import type { Resume } from "@/types/resume";
import { aiChat } from "./aiEngine";

const SYSTEM_PROMPT = `You are a resume parsing assistant. Extract structured resume information from the provided raw text and output it as a JSON object matching this exact schema:

{
  "title": "string - a short title for this resume",
  "personal": {
    "fullName": "string",
    "title": "string - current job title",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string or empty",
    "linkedin": "string or empty"
  },
  "summary": "string - a professional summary paragraph",
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "YYYY-MM or empty",
      "endDate": "YYYY-MM or empty",
      "current": boolean,
      "description": ["array of bullet point strings"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY-MM or empty",
      "endDate": "YYYY-MM or empty",
      "gpa": "string or empty"
    }
  ],
  "skills": [
    {
      "category": "string e.g. Languages, Frameworks, Tools",
      "skills": ["array of skill strings"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "link": "string or empty"
    }
  ]
}

Rules:
- Use empty strings for missing fields, never null.
- Dates should be YYYY-MM format if possible.
- For current jobs, set current: true and endDate: "".
- Break descriptions into 2-5 concise bullet points per job.
- Group skills into logical categories.
- If a section is not present in the text, return empty arrays.
- Output ONLY valid JSON. No markdown, no explanations.`;

export async function parseResumeWithAI(text: string): Promise<Partial<Resume>> {
  const content = await aiChat({
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  if (!content) {
    throw new Error("Empty response from AI");
  }

  const parsed = JSON.parse(content);
  return parsed;
}
