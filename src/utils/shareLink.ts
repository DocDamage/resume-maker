import type { Resume } from "@/types/resume";

export function encodeResumeToUrl(resume: Resume): string {
  const json = JSON.stringify(resume);
  const compressed = btoa(json);
  const url = new URL(window.location.href);
  url.searchParams.set("r", compressed);
  return url.toString();
}

export function decodeResumeFromUrl(): Resume | null {
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get("r");
  if (!encoded) return null;
  try {
    const json = atob(encoded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
