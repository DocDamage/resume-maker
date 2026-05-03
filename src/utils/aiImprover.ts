import { aiChat } from "./aiEngine";

const IMPROVE_SUMMARY_PROMPT = `You are an expert resume writer. Rewrite the following professional summary to be more impactful, concise, and compelling. Use strong action verbs, quantify achievements where possible, and keep it under 75 words. Output ONLY the improved summary text, with no quotes or markdown.`;

const IMPROVE_BULLET_PROMPT = `You are an expert resume writer. Rewrite the following resume bullet point to be more impactful using the STAR method (Situation, Task, Action, Result). Quantify results where possible. Use strong action verbs. Output ONLY the improved bullet text, with no quotes or markdown.`;

const IMPROVE_SKILLS_PROMPT = `You are an expert resume writer. Review the following skills list and suggest a better organized, more professional categorization. Group related skills, remove outdated or overly generic skills, and add relevant industry-standard terms. Output ONLY a JSON object with this exact shape:
{"categories": [{"category": "string", "skills": ["string"]}]}
No markdown, no explanations.`;

export async function improveSummary(summary: string): Promise<string> {
  const result = await aiChat({
    system: IMPROVE_SUMMARY_PROMPT,
    messages: [{ role: "user", content: summary }],
    temperature: 0.4,
  });
  return result.trim().replace(/^["'`]+|["'`]+$/g, "");
}

export async function improveBullet(bullet: string): Promise<string> {
  const result = await aiChat({
    system: IMPROVE_BULLET_PROMPT,
    messages: [{ role: "user", content: bullet }],
    temperature: 0.4,
  });
  return result.trim().replace(/^["'`]+|["'`]+$/g, "");
}

export async function improveSkills(
  skillsText: string
): Promise<{ category: string; skills: string[] }[]> {
  const result = await aiChat({
    system: IMPROVE_SKILLS_PROMPT,
    messages: [{ role: "user", content: skillsText }],
    temperature: 0.4,
  });
  try {
    const parsed = JSON.parse(result);
    return parsed.categories || [];
  } catch {
    return [];
  }
}
