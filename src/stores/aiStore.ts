import { create } from "zustand";

export type AIProvider = "openai" | "local";

export interface LocalModel {
  id: string;
  name: string;
  size: string;
  description: string;
}

export const LOCAL_MODELS: LocalModel[] = [
  {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    name: "Llama 3.2 1B",
    size: "~700 MB",
    description: "Fast, small, good for resume tasks. Best balance.",
  },
  {
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen2.5 0.5B",
    size: "~350 MB",
    description: "Ultra-small, fastest download. Basic quality.",
  },
  {
    id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
    name: "Llama 3.2 3B",
    size: "~1.9 GB",
    description: "Higher quality, slower download. Best results.",
  },
];

interface AIStore {
  provider: AIProvider;
  openaiKey: string;
  openaiModel: string;
  localModel: string;
  engineStatus: "idle" | "downloading" | "ready" | "error";
  downloadProgress: number;
  engineError: string;

  setProvider: (p: AIProvider) => void;
  setOpenAIKey: (key: string) => void;
  setOpenAIModel: (model: string) => void;
  setLocalModel: (model: string) => void;
  setEngineStatus: (status: "idle" | "downloading" | "ready" | "error") => void;
  setDownloadProgress: (p: number) => void;
  setEngineError: (e: string) => void;
}

const load = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const useAIStore = create<AIStore>((set) => ({
  provider: (load("resume-builder-ai-provider", "local") as AIProvider) || "local",
  openaiKey: load("resume-builder-openai-key", ""),
  openaiModel: load("resume-builder-openai-model", "gpt-4o-mini"),
  localModel: load("resume-builder-local-model", LOCAL_MODELS[0].id),
  engineStatus: "idle",
  downloadProgress: 0,
  engineError: "",

  setProvider: (provider) => {
    localStorage.setItem("resume-builder-ai-provider", provider);
    set({ provider });
  },
  setOpenAIKey: (openaiKey) => {
    localStorage.setItem("resume-builder-openai-key", openaiKey);
    set({ openaiKey });
  },
  setOpenAIModel: (openaiModel) => {
    localStorage.setItem("resume-builder-openai-model", openaiModel);
    set({ openaiModel });
  },
  setLocalModel: (localModel) => {
    localStorage.setItem("resume-builder-local-model", localModel);
    set({ localModel });
  },
  setEngineStatus: (engineStatus) => set({ engineStatus }),
  setDownloadProgress: (downloadProgress) => set({ downloadProgress }),
  setEngineError: (engineError) => set({ engineError }),
}));
