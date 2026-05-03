import { create } from "zustand";
import type {
  Resume,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
  Project,
  Certification,
  Language,
} from "@/types/resume";
import { defaultResume } from "@/constants/defaults";
import { saveToStorage } from "@/utils/storage";

interface ResumeState {
  resume: Resume;
  past: Resume[];
  future: Resume[];
  activeSection: string;
}

interface ResumeActions {
  setActiveSection: (section: string) => void;
  setPersonal: (data: PersonalInfo) => void;
  setSummary: (summary: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (ids: string[]) => void;
  duplicateExperience: (id: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (ids: string[]) => void;
  duplicateEducation: (id: string) => void;

  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  addSkill: (categoryId: string, skill: string) => void;
  removeSkill: (categoryId: string, skill: string) => void;

  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (ids: string[]) => void;
  duplicateProject: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (ids: string[]) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (ids: string[]) => void;

  setTemplate: (template: Resume["template"]) => void;
  setAccentColor: (color: string) => void;
  setFont: (font: Resume["font"]) => void;
  setSectionOrder: (order: string[]) => void;
  setPhotoUrl: (url: string | undefined) => void;
  setPaperSize: (size: Resume["paperSize"]) => void;
  setSpacing: (spacing: number) => void;

  loadResume: (data: Resume) => void;
  resetResume: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialResume = (() => {
  try {
    const raw = localStorage.getItem("resume-builder-data");
    if (raw) return JSON.parse(raw) as Resume;
  } catch { /* ignore */ }
  return defaultResume;
})();

function wrap(
  set: (fn: (state: ResumeState & ResumeActions) => Partial<ResumeState>) => void,
  updater: (state: ResumeState) => Partial<ResumeState>
) {
  set((state) => {
    const next = updater(state);
    if ("resume" in next && next.resume) {
      saveToStorage(next.resume);
      return { ...next, past: [...state.past, state.resume], future: [] };
    }
    return next;
  });
}

export const useResumeStore = create<ResumeState & ResumeActions>((set, get) => ({
  resume: initialResume,
  past: [],
  future: [],
  activeSection: "personal",

  setActiveSection: (section) => set({ activeSection: section }),

  setPersonal: (data) => wrap(set, (state) => ({ resume: { ...state.resume, personal: data } })),
  setSummary: (summary) => wrap(set, (state) => ({ resume: { ...state.resume, summary } })),

  addExperience: () => wrap(set, (state) => {
    const entry: ExperienceEntry = { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", current: false, description: [""] };
    return { resume: { ...state.resume, experience: [...state.resume.experience, entry] } };
  }),
  updateExperience: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, experience: state.resume.experience.map((e) => e.id === id ? { ...e, ...data } : e) },
  })),
  removeExperience: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, experience: state.resume.experience.filter((e) => e.id !== id) },
  })),
  reorderExperience: (ids) => wrap(set, (state) => {
    const map = new Map(state.resume.experience.map((e) => [e.id, e]));
    return { resume: { ...state.resume, experience: ids.map((id) => map.get(id)!).filter(Boolean) } };
  }),
  duplicateExperience: (id) => wrap(set, (state) => {
    const original = state.resume.experience.find((e) => e.id === id);
    if (!original) return {};
    const copy = { ...original, id: crypto.randomUUID() };
    return { resume: { ...state.resume, experience: [...state.resume.experience, copy] } };
  }),

  addEducation: () => wrap(set, (state) => {
    const entry: EducationEntry = { id: crypto.randomUUID(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };
    return { resume: { ...state.resume, education: [...state.resume.education, entry] } };
  }),
  updateEducation: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, education: state.resume.education.map((e) => e.id === id ? { ...e, ...data } : e) },
  })),
  removeEducation: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, education: state.resume.education.filter((e) => e.id !== id) },
  })),
  reorderEducation: (ids) => wrap(set, (state) => {
    const map = new Map(state.resume.education.map((e) => [e.id, e]));
    return { resume: { ...state.resume, education: ids.map((id) => map.get(id)!).filter(Boolean) } };
  }),
  duplicateEducation: (id) => wrap(set, (state) => {
    const original = state.resume.education.find((e) => e.id === id);
    if (!original) return {};
    const copy = { ...original, id: crypto.randomUUID() };
    return { resume: { ...state.resume, education: [...state.resume.education, copy] } };
  }),

  addSkillCategory: () => wrap(set, (state) => {
    const entry: SkillCategory = { id: crypto.randomUUID(), category: "New Category", skills: [] };
    return { resume: { ...state.resume, skills: [...state.resume.skills, entry] } };
  }),
  updateSkillCategory: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, skills: state.resume.skills.map((s) => s.id === id ? { ...s, ...data } : s) },
  })),
  removeSkillCategory: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, skills: state.resume.skills.filter((s) => s.id !== id) },
  })),
  addSkill: (categoryId, skill) => wrap(set, (state) => ({
    resume: { ...state.resume, skills: state.resume.skills.map((s) => s.id === categoryId ? { ...s, skills: [...s.skills, skill] } : s) },
  })),
  removeSkill: (categoryId, skill) => wrap(set, (state) => ({
    resume: { ...state.resume, skills: state.resume.skills.map((s) => s.id === categoryId ? { ...s, skills: s.skills.filter((sk) => sk !== skill) } : s) },
  })),

  addProject: () => wrap(set, (state) => {
    const entry: Project = { id: crypto.randomUUID(), name: "", description: "", link: "" };
    return { resume: { ...state.resume, projects: [...state.resume.projects, entry] } };
  }),
  updateProject: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, projects: state.resume.projects.map((p) => p.id === id ? { ...p, ...data } : p) },
  })),
  removeProject: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, projects: state.resume.projects.filter((p) => p.id !== id) },
  })),
  reorderProjects: (ids) => wrap(set, (state) => {
    const map = new Map(state.resume.projects.map((p) => [p.id, p]));
    return { resume: { ...state.resume, projects: ids.map((id) => map.get(id)!).filter(Boolean) } };
  }),
  duplicateProject: (id) => wrap(set, (state) => {
    const original = state.resume.projects.find((p) => p.id === id);
    if (!original) return {};
    const copy = { ...original, id: crypto.randomUUID() };
    return { resume: { ...state.resume, projects: [...state.resume.projects, copy] } };
  }),

  addCertification: () => wrap(set, (state) => {
    const entry: Certification = { id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" };
    return { resume: { ...state.resume, certifications: [...state.resume.certifications, entry] } };
  }),
  updateCertification: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, certifications: state.resume.certifications.map((c) => c.id === id ? { ...c, ...data } : c) },
  })),
  removeCertification: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, certifications: state.resume.certifications.filter((c) => c.id !== id) },
  })),
  reorderCertifications: (ids) => wrap(set, (state) => {
    const map = new Map(state.resume.certifications.map((c) => [c.id, c]));
    return { resume: { ...state.resume, certifications: ids.map((id) => map.get(id)!).filter(Boolean) } };
  }),

  addLanguage: () => wrap(set, (state) => {
    const entry: Language = { id: crypto.randomUUID(), language: "", proficiency: "Conversational" };
    return { resume: { ...state.resume, languages: [...state.resume.languages, entry] } };
  }),
  updateLanguage: (id, data) => wrap(set, (state) => ({
    resume: { ...state.resume, languages: state.resume.languages.map((l) => l.id === id ? { ...l, ...data } : l) },
  })),
  removeLanguage: (id) => wrap(set, (state) => ({
    resume: { ...state.resume, languages: state.resume.languages.filter((l) => l.id !== id) },
  })),
  reorderLanguages: (ids) => wrap(set, (state) => {
    const map = new Map(state.resume.languages.map((l) => [l.id, l]));
    return { resume: { ...state.resume, languages: ids.map((id) => map.get(id)!).filter(Boolean) } };
  }),

  setTemplate: (template) => wrap(set, (state) => ({ resume: { ...state.resume, template } })),
  setAccentColor: (accentColor) => wrap(set, (state) => ({ resume: { ...state.resume, accentColor } })),
  setFont: (font) => wrap(set, (state) => ({ resume: { ...state.resume, font } })),
  setSectionOrder: (sectionOrder) => wrap(set, (state) => ({ resume: { ...state.resume, sectionOrder } })),
  setPhotoUrl: (photoUrl) => wrap(set, (state) => ({ resume: { ...state.resume, photoUrl } })),
  setPaperSize: (paperSize) => wrap(set, (state) => ({ resume: { ...state.resume, paperSize } })),
  setSpacing: (spacing) => wrap(set, (state) => ({ resume: { ...state.resume, spacing } })),

  loadResume: (data) => {
    saveToStorage(data);
    set({ resume: data, past: [], future: [] });
  },
  resetResume: () => {
    const resume = { ...defaultResume, id: crypto.randomUUID() };
    saveToStorage(resume);
    set({ resume, past: [], future: [] });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    saveToStorage(previous);
    set({ resume: previous, past: newPast, future: [state.resume, ...state.future] });
  },
  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    saveToStorage(next);
    set({ resume: next, past: [...state.past, state.resume], future: newFuture });
  },
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
