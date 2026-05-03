import type { MLCEngine } from "@mlc-ai/web-llm";
import { useAIStore } from "@/stores/aiStore";

let engine: MLCEngine | null = null;
let engineModel: string | null = null;

export function resetEngine() {
  engine = null;
  engineModel = null;
}

export async function initEngine(): Promise<MLCEngine> {
  const store = useAIStore.getState();
  const model = store.localModel;

  if (engine && engineModel === model) {
    return engine;
  }

  if (engine) {
    resetEngine();
  }

  store.setEngineStatus("downloading");
  store.setDownloadProgress(0);
  store.setEngineError("");

  try {
    const webllm = await import("@mlc-ai/web-llm");
    engine = await webllm.CreateMLCEngine(model, {
      initProgressCallback: (progress) => {
        store.setDownloadProgress(Math.round(progress.progress * 100));
      },
    });
    engineModel = model;
    store.setEngineStatus("ready");
    store.setDownloadProgress(100);
    return engine;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    store.setEngineStatus("error");
    store.setEngineError(msg);
    throw err;
  }
}

export async function aiChat(options: {
  system?: string;
  messages: { role: "system" | "user"; content: string }[];
  temperature?: number;
  response_format?: { type: "json_object" };
}): Promise<string> {
  const store = useAIStore.getState();

  if (store.provider === "openai") {
    if (!store.openaiKey) throw new Error("OpenAI API key not set");

    const body: Record<string, unknown> = {
      model: store.openaiModel,
      messages: options.system
        ? [{ role: "system", content: options.system }, ...options.messages]
        : options.messages,
      temperature: options.temperature ?? 0.3,
    };
    if (options.response_format) {
      body.response_format = options.response_format;
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.openaiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  // Local AI via WebLLM
  const eng = await initEngine();

  const messages: { role: "system" | "user"; content: string }[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  options.messages.forEach((m) => messages.push(m));

  const res = (await eng.chat.completions.create({
    messages,
    temperature: options.temperature ?? 0.3,
  } as Parameters<typeof eng.chat.completions.create>[0])) as {
    choices: { message?: { content?: string } }[];
  };

  return res.choices[0]?.message?.content ?? "";
}

export async function aiChatJSON<T>(options: {
  system?: string;
  messages: { role: "system" | "user"; content: string }[];
  temperature?: number;
}): Promise<T> {
  const jsonSystem = `You are a helpful assistant. You MUST respond with valid JSON only. No markdown, no explanations outside the JSON. ${options.system ?? ""}`;
  const text = await aiChat({
    system: jsonSystem,
    messages: options.messages,
    temperature: options.temperature ?? 0.3,
    response_format: { type: "json_object" },
  });
  // Extract JSON from potential markdown fences
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as T;
}
