import { create } from "zustand";
import type {
  Resume, PersonalInfo, ExperienceEntry, EducationEntry, SkillCategory,
  Project, Certification, Language, Reference, Award, VolunteerEntry, CustomSection,
} from "@/types/resume";
import { defaultResume } from "@/constants/defaults";
import { saveToStorage } from "@/utils/storage";

interface ResumeState {
  resume: Resume;
  past: Resume[];
  future: Resume[];
  activeSection: string;
  lastSaved: number;
}

interface ResumeActions {
  setActiveSection: (section: string) => void;
  setLastSaved: (ts: number) => void;

  setPersonal: (data: PersonalInfo) => void;
  setSummary: (summary: string) => void;

  addExperience: () => void; updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void; reorderExperience: (ids: string[]) => void; duplicateExperience: (id: string) => void;

  addEducation: () => void; updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void; reorderEducation: (ids: string[]) => void; duplicateEducation: (id: string) => void;

  addSkillCategory: () => void; updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void; addSkill: (categoryId: string, skill: string) => void; removeSkill: (categoryId: string, skill: string) => void;

  addProject: () => void; updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void; reorderProjects: (ids: string[]) => void; duplicateProject: (id: string) => void;

  addCertification: () => void; updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void; reorderCertifications: (ids: string[]) => void;

  addLanguage: () => void; updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void; reorderLanguages: (ids: string[]) => void;

  addReference: () => void; updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void; reorderReferences: (ids: string[]) => void;

  addAward: () => void; updateAward: (id: string, data: Partial<Award>) => void;
  removeAward: (id: string) => void; reorderAwards: (ids: string[]) => void;

  addVolunteer: () => void; updateVolunteer: (id: string, data: Partial<VolunteerEntry>) => void;
  removeVolunteer: (id: string) => void; reorderVolunteer: (ids: string[]) => void; duplicateVolunteer: (id: string) => void;

  addCustomSection: () => void; updateCustomSection: (id: string, data: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void; addCustomItem: (sectionId: string) => void;
  updateCustomItem: (sectionId: string, itemId: string, data: Partial<CustomSection["items"][0]>) => void;
  removeCustomItem: (sectionId: string, itemId: string) => void;

  setVisibility: (section: string, visible: boolean) => void;
  setTemplate: (template: Resume["template"]) => void;
  setAccentColor: (color: string) => void;
  setFont: (font: Resume["font"]) => void;
  setSectionOrder: (order: string[]) => void;
  setPhotoUrl: (url: string | undefined) => void;
  setPaperSize: (size: Resume["paperSize"]) => void;
  setSpacing: (spacing: number) => void;
  setDarkMode: (dark: boolean) => void;
  setCustomCss: (css: string) => void;
  setTitle: (title: string) => void;

  loadResume: (data: Resume) => void;
  resetResume: () => void;
  duplicateResume: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialResume = (() => {
  try { const raw = localStorage.getItem("resume-builder-data"); if (raw) return JSON.parse(raw) as Resume; } catch { }
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
      return { ...next, past: [...state.past, state.resume], future: [], lastSaved: Date.now() };
    }
    return next;
  });
}

export const useResumeStore = create<ResumeState & ResumeActions>((set, get) => ({
  resume: initialResume,
  past: [],
  future: [],
  activeSection: "personal",
  lastSaved: Date.now(),

  setActiveSection: (section) => set({ activeSection: section }),
  setLastSaved: (ts) => set({ lastSaved: ts }),

  setPersonal: (data) => wrap(set, (s) => ({ resume: { ...s.resume, personal: data } })),
  setSummary: (summary) => wrap(set, (s) => ({ resume: { ...s.resume, summary } })),

  addExperience: () => wrap(set, (s) => ({ resume: { ...s.resume, experience: [...s.resume.experience, { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", current: false, description: [""] }] } })),
  updateExperience: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, experience: s.resume.experience.map((e) => e.id === id ? { ...e, ...data } : e) } })),
  removeExperience: (id) => wrap(set, (s) => ({ resume: { ...s.resume, experience: s.resume.experience.filter((e) => e.id !== id) } })),
  reorderExperience: (ids) => wrap(set, (s) => { const map = new Map(s.resume.experience.map((e) => [e.id, e])); return { resume: { ...s.resume, experience: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),
  duplicateExperience: (id) => wrap(set, (s) => { const orig = s.resume.experience.find((e) => e.id === id); if (!orig) return {}; const copy = { ...orig, id: crypto.randomUUID() }; return { resume: { ...s.resume, experience: [...s.resume.experience, copy] } }; }),

  addEducation: () => wrap(set, (s) => ({ resume: { ...s.resume, education: [...s.resume.education, { id: crypto.randomUUID(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }] } })),
  updateEducation: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, education: s.resume.education.map((e) => e.id === id ? { ...e, ...data } : e) } })),
  removeEducation: (id) => wrap(set, (s) => ({ resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) } })),
  reorderEducation: (ids) => wrap(set, (s) => { const map = new Map(s.resume.education.map((e) => [e.id, e])); return { resume: { ...s.resume, education: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),
  duplicateEducation: (id) => wrap(set, (s) => { const orig = s.resume.education.find((e) => e.id === id); if (!orig) return {}; const copy = { ...orig, id: crypto.randomUUID() }; return { resume: { ...s.resume, education: [...s.resume.education, copy] } }; }),

  addSkillCategory: () => wrap(set, (s) => ({ resume: { ...s.resume, skills: [...s.resume.skills, { id: crypto.randomUUID(), category: "New Category", skills: [] }] } })),
  updateSkillCategory: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, skills: s.resume.skills.map((c) => c.id === id ? { ...c, ...data } : c) } })),
  removeSkillCategory: (id) => wrap(set, (s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((c) => c.id !== id) } })),
  addSkill: (cid, skill) => wrap(set, (s) => ({ resume: { ...s.resume, skills: s.resume.skills.map((c) => c.id === cid ? { ...c, skills: [...c.skills, skill] } : c) } })),
  removeSkill: (cid, skill) => wrap(set, (s) => ({ resume: { ...s.resume, skills: s.resume.skills.map((c) => c.id === cid ? { ...c, skills: c.skills.filter((sk) => sk !== skill) } : c) } })),

  addProject: () => wrap(set, (s) => ({ resume: { ...s.resume, projects: [...s.resume.projects, { id: crypto.randomUUID(), name: "", description: "", link: "" }] } })),
  updateProject: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, projects: s.resume.projects.map((p) => p.id === id ? { ...p, ...data } : p) } })),
  removeProject: (id) => wrap(set, (s) => ({ resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) } })),
  reorderProjects: (ids) => wrap(set, (s) => { const map = new Map(s.resume.projects.map((p) => [p.id, p])); return { resume: { ...s.resume, projects: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),
  duplicateProject: (id) => wrap(set, (s) => { const orig = s.resume.projects.find((p) => p.id === id); if (!orig) return {}; const copy = { ...orig, id: crypto.randomUUID() }; return { resume: { ...s.resume, projects: [...s.resume.projects, copy] } }; }),

  addCertification: () => wrap(set, (s) => ({ resume: { ...s.resume, certifications: [...s.resume.certifications, { id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" }] } })),
  updateCertification: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, certifications: s.resume.certifications.map((c) => c.id === id ? { ...c, ...data } : c) } })),
  removeCertification: (id) => wrap(set, (s) => ({ resume: { ...s.resume, certifications: s.resume.certifications.filter((c) => c.id !== id) } })),
  reorderCertifications: (ids) => wrap(set, (s) => { const map = new Map(s.resume.certifications.map((c) => [c.id, c])); return { resume: { ...s.resume, certifications: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),

  addLanguage: () => wrap(set, (s) => ({ resume: { ...s.resume, languages: [...s.resume.languages, { id: crypto.randomUUID(), language: "", proficiency: "Conversational" }] } })),
  updateLanguage: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, languages: s.resume.languages.map((l) => l.id === id ? { ...l, ...data } : l) } })),
  removeLanguage: (id) => wrap(set, (s) => ({ resume: { ...s.resume, languages: s.resume.languages.filter((l) => l.id !== id) } })),
  reorderLanguages: (ids) => wrap(set, (s) => { const map = new Map(s.resume.languages.map((l) => [l.id, l])); return { resume: { ...s.resume, languages: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),

  addReference: () => wrap(set, (s) => ({ resume: { ...s.resume, references: [...s.resume.references, { id: crypto.randomUUID(), name: "", title: "", company: "", email: "", phone: "" }] } })),
  updateReference: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, references: s.resume.references.map((r) => r.id === id ? { ...r, ...data } : r) } })),
  removeReference: (id) => wrap(set, (s) => ({ resume: { ...s.resume, references: s.resume.references.filter((r) => r.id !== id) } })),
  reorderReferences: (ids) => wrap(set, (s) => { const map = new Map(s.resume.references.map((r) => [r.id, r])); return { resume: { ...s.resume, references: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),

  addAward: () => wrap(set, (s) => ({ resume: { ...s.resume, awards: [...s.resume.awards, { id: crypto.randomUUID(), title: "", issuer: "", date: "", description: "" }] } })),
  updateAward: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, awards: s.resume.awards.map((a) => a.id === id ? { ...a, ...data } : a) } })),
  removeAward: (id) => wrap(set, (s) => ({ resume: { ...s.resume, awards: s.resume.awards.filter((a) => a.id !== id) } })),
  reorderAwards: (ids) => wrap(set, (s) => { const map = new Map(s.resume.awards.map((a) => [a.id, a])); return { resume: { ...s.resume, awards: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),

  addVolunteer: () => wrap(set, (s) => ({ resume: { ...s.resume, volunteer: [...s.resume.volunteer, { id: crypto.randomUUID(), organization: "", role: "", startDate: "", endDate: "", current: false, description: [""] }] } })),
  updateVolunteer: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, volunteer: s.resume.volunteer.map((v) => v.id === id ? { ...v, ...data } : v) } })),
  removeVolunteer: (id) => wrap(set, (s) => ({ resume: { ...s.resume, volunteer: s.resume.volunteer.filter((v) => v.id !== id) } })),
  reorderVolunteer: (ids) => wrap(set, (s) => { const map = new Map(s.resume.volunteer.map((v) => [v.id, v])); return { resume: { ...s.resume, volunteer: ids.map((id) => map.get(id)!).filter(Boolean) } }; }),
  duplicateVolunteer: (id) => wrap(set, (s) => { const orig = s.resume.volunteer.find((v) => v.id === id); if (!orig) return {}; const copy = { ...orig, id: crypto.randomUUID() }; return { resume: { ...s.resume, volunteer: [...s.resume.volunteer, copy] } }; }),

  addCustomSection: () => wrap(set, (s) => ({ resume: { ...s.resume, customSections: [...s.resume.customSections, { id: crypto.randomUUID(), name: "Custom Section", items: [] }] } })),
  updateCustomSection: (id, data) => wrap(set, (s) => ({ resume: { ...s.resume, customSections: s.resume.customSections.map((cs) => cs.id === id ? { ...cs, ...data } : cs) } })),
  removeCustomSection: (id) => wrap(set, (s) => ({ resume: { ...s.resume, customSections: s.resume.customSections.filter((cs) => cs.id !== id) } })),
  addCustomItem: (sectionId) => wrap(set, (s) => ({ resume: { ...s.resume, customSections: s.resume.customSections.map((cs) => cs.id === sectionId ? { ...cs, items: [...cs.items, { id: crypto.randomUUID(), title: "", subtitle: "", date: "", description: "" }] } : cs) } })),
  updateCustomItem: (sectionId, itemId, data) => wrap(set, (s) => ({ resume: { ...s.resume, customSections: s.resume.customSections.map((cs) => cs.id === sectionId ? { ...cs, items: cs.items.map((it) => it.id === itemId ? { ...it, ...data } : it) } : cs) } })),
  removeCustomItem: (sectionId, itemId) => wrap(set, (s) => ({ resume: { ...s.resume, customSections: s.resume.customSections.map((cs) => cs.id === sectionId ? { ...cs, items: cs.items.filter((it) => it.id !== itemId) } : cs) } })),

  setVisibility: (section, visible) => wrap(set, (s) => ({ resume: { ...s.resume, visibility: { ...s.resume.visibility, [section]: visible } } })),
  setTemplate: (template) => wrap(set, (s) => ({ resume: { ...s.resume, template } })),
  setAccentColor: (accentColor) => wrap(set, (s) => ({ resume: { ...s.resume, accentColor } })),
  setFont: (font) => wrap(set, (s) => ({ resume: { ...s.resume, font } })),
  setSectionOrder: (sectionOrder) => wrap(set, (s) => ({ resume: { ...s.resume, sectionOrder } })),
  setPhotoUrl: (photoUrl) => wrap(set, (s) => ({ resume: { ...s.resume, photoUrl } })),
  setPaperSize: (paperSize) => wrap(set, (s) => ({ resume: { ...s.resume, paperSize } })),
  setSpacing: (spacing) => wrap(set, (s) => ({ resume: { ...s.resume, spacing } })),
  setDarkMode: (darkMode) => wrap(set, (s) => ({ resume: { ...s.resume, darkMode } })),
  setCustomCss: (customCss) => wrap(set, (s) => ({ resume: { ...s.resume, customCss } })),
  setTitle: (title) => wrap(set, (s) => ({ resume: { ...s.resume, title } })),

  loadResume: (data) => { saveToStorage(data); set({ resume: data, past: [], future: [] }); },
  resetResume: () => { const resume = { ...defaultResume, id: crypto.randomUUID() }; saveToStorage(resume); set({ resume, past: [], future: [] }); },
  duplicateResume: () => { const resume = { ...get().resume, id: crypto.randomUUID(), title: get().resume.title + " (Copy)" }; saveToStorage(resume); set({ resume, past: [], future: [] }); },

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
