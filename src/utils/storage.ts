import type { Resume } from "@/types/resume";

const STORAGE_KEY = "resume-builder-data";

export function saveToStorage(resume: Resume) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  } catch {
    // ignore
  }
}

export function loadFromStorage(): Resume | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Resume;
  } catch {
    return null;
  }
}
