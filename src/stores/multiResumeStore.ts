import { create } from "zustand";
import type { Resume } from "@/types/resume";

interface MultiResumeStore {
  resumes: Resume[];
  activeId: string | null;
  loadAll: () => void;
  addResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  setActiveId: (id: string) => void;
  getActive: () => Resume | undefined;
  saveCurrent: (resume: Resume) => void;
}

const STORAGE_KEY = "resume-builder-multi";

function loadAllResumes(): Resume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAllResumes(resumes: Resume[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch {
    // ignore
  }
}

export const useMultiResumeStore = create<MultiResumeStore>((set, get) => ({
  resumes: [],
  activeId: null,

  loadAll: () => {
    const resumes = loadAllResumes();
    set({ resumes, activeId: resumes[0]?.id || null });
  },

  addResume: (resume) => {
    const resumes = [...get().resumes, resume];
    saveAllResumes(resumes);
    set({ resumes, activeId: resume.id });
  },

  removeResume: (id) => {
    const resumes = get().resumes.filter((r) => r.id !== id);
    saveAllResumes(resumes);
    set({
      resumes,
      activeId: resumes[0]?.id || null,
    });
  },

  setActiveId: (id) => set({ activeId: id }),

  getActive: () => get().resumes.find((r) => r.id === get().activeId),

  saveCurrent: (resume) => {
    const resumes = get().resumes.map((r) =>
      r.id === resume.id ? resume : r
    );
    const exists = resumes.some((r) => r.id === resume.id);
    const updated = exists ? resumes : [...resumes, resume];
    saveAllResumes(updated);
    set({ resumes: updated, activeId: resume.id });
  },
}));
