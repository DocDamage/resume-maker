import { create } from "zustand";
import type {
  Resume,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
  Project,
} from "@/types/resume";
import { defaultResume } from "@/constants/defaults";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

interface ResumeStore {
  resume: Resume;
  activeSection: string;
  setActiveSection: (section: string) => void;

  setPersonal: (data: PersonalInfo) => void;
  setSummary: (summary: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (ids: string[]) => void;

  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (ids: string[]) => void;

  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  addSkill: (categoryId: string, skill: string) => void;
  removeSkill: (categoryId: string, skill: string) => void;

  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (ids: string[]) => void;

  setTemplate: (template: Resume["template"]) => void;
  setAccentColor: (color: string) => void;
  setFont: (font: Resume["font"]) => void;
  setSectionOrder: (order: string[]) => void;

  loadResume: (data: Resume) => void;
  resetResume: () => void;
}

const initialResume = loadFromStorage() || defaultResume;

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,
  activeSection: "personal",

  setActiveSection: (section) => set({ activeSection: section }),

  setPersonal: (data) =>
    set((state) => {
      const resume = { ...state.resume, personal: data };
      saveToStorage(resume);
      return { resume };
    }),

  setSummary: (summary) =>
    set((state) => {
      const resume = { ...state.resume, summary };
      saveToStorage(resume);
      return { resume };
    }),

  addExperience: () =>
    set((state) => {
      const entry: ExperienceEntry = {
        id: crypto.randomUUID(),
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        current: false,
        description: [""],
      };
      const resume = {
        ...state.resume,
        experience: [...state.resume.experience, entry],
      };
      saveToStorage(resume);
      return { resume };
    }),

  updateExperience: (id, data) =>
    set((state) => {
      const experience = state.resume.experience.map((e) =>
        e.id === id ? { ...e, ...data } : e
      );
      const resume = { ...state.resume, experience };
      saveToStorage(resume);
      return { resume };
    }),

  removeExperience: (id) =>
    set((state) => {
      const experience = state.resume.experience.filter((e) => e.id !== id);
      const resume = { ...state.resume, experience };
      saveToStorage(resume);
      return { resume };
    }),

  reorderExperience: (ids) =>
    set((state) => {
      const map = new Map(state.resume.experience.map((e) => [e.id, e]));
      const experience = ids.map((id) => map.get(id)!).filter(Boolean);
      const resume = { ...state.resume, experience };
      saveToStorage(resume);
      return { resume };
    }),

  addEducation: () =>
    set((state) => {
      const entry: EducationEntry = {
        id: crypto.randomUUID(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      };
      const resume = {
        ...state.resume,
        education: [...state.resume.education, entry],
      };
      saveToStorage(resume);
      return { resume };
    }),

  updateEducation: (id, data) =>
    set((state) => {
      const education = state.resume.education.map((e) =>
        e.id === id ? { ...e, ...data } : e
      );
      const resume = { ...state.resume, education };
      saveToStorage(resume);
      return { resume };
    }),

  removeEducation: (id) =>
    set((state) => {
      const education = state.resume.education.filter((e) => e.id !== id);
      const resume = { ...state.resume, education };
      saveToStorage(resume);
      return { resume };
    }),

  reorderEducation: (ids) =>
    set((state) => {
      const map = new Map(state.resume.education.map((e) => [e.id, e]));
      const education = ids.map((id) => map.get(id)!).filter(Boolean);
      const resume = { ...state.resume, education };
      saveToStorage(resume);
      return { resume };
    }),

  addSkillCategory: () =>
    set((state) => {
      const entry: SkillCategory = {
        id: crypto.randomUUID(),
        category: "New Category",
        skills: [],
      };
      const resume = {
        ...state.resume,
        skills: [...state.resume.skills, entry],
      };
      saveToStorage(resume);
      return { resume };
    }),

  updateSkillCategory: (id, data) =>
    set((state) => {
      const skills = state.resume.skills.map((s) =>
        s.id === id ? { ...s, ...data } : s
      );
      const resume = { ...state.resume, skills };
      saveToStorage(resume);
      return { resume };
    }),

  removeSkillCategory: (id) =>
    set((state) => {
      const skills = state.resume.skills.filter((s) => s.id !== id);
      const resume = { ...state.resume, skills };
      saveToStorage(resume);
      return { resume };
    }),

  addSkill: (categoryId, skill) =>
    set((state) => {
      const skills = state.resume.skills.map((s) =>
        s.id === categoryId ? { ...s, skills: [...s.skills, skill] } : s
      );
      const resume = { ...state.resume, skills };
      saveToStorage(resume);
      return { resume };
    }),

  removeSkill: (categoryId, skill) =>
    set((state) => {
      const skills = state.resume.skills.map((s) =>
        s.id === categoryId
          ? { ...s, skills: s.skills.filter((sk) => sk !== skill) }
          : s
      );
      const resume = { ...state.resume, skills };
      saveToStorage(resume);
      return { resume };
    }),

  addProject: () =>
    set((state) => {
      const entry: Project = {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        link: "",
      };
      const resume = {
        ...state.resume,
        projects: [...state.resume.projects, entry],
      };
      saveToStorage(resume);
      return { resume };
    }),

  updateProject: (id, data) =>
    set((state) => {
      const projects = state.resume.projects.map((p) =>
        p.id === id ? { ...p, ...data } : p
      );
      const resume = { ...state.resume, projects };
      saveToStorage(resume);
      return { resume };
    }),

  removeProject: (id) =>
    set((state) => {
      const projects = state.resume.projects.filter((p) => p.id !== id);
      const resume = { ...state.resume, projects };
      saveToStorage(resume);
      return { resume };
    }),

  reorderProjects: (ids) =>
    set((state) => {
      const map = new Map(state.resume.projects.map((p) => [p.id, p]));
      const projects = ids.map((id) => map.get(id)!).filter(Boolean);
      const resume = { ...state.resume, projects };
      saveToStorage(resume);
      return { resume };
    }),

  setTemplate: (template) =>
    set((state) => {
      const resume = { ...state.resume, template };
      saveToStorage(resume);
      return { resume };
    }),

  setAccentColor: (accentColor) =>
    set((state) => {
      const resume = { ...state.resume, accentColor };
      saveToStorage(resume);
      return { resume };
    }),

  setFont: (font) =>
    set((state) => {
      const resume = { ...state.resume, font };
      saveToStorage(resume);
      return { resume };
    }),

  setSectionOrder: (sectionOrder) =>
    set((state) => {
      const resume = { ...state.resume, sectionOrder };
      saveToStorage(resume);
      return { resume };
    }),

  loadResume: (data) =>
    set(() => {
      saveToStorage(data);
      return { resume: data };
    }),

  resetResume: () =>
    set(() => {
      const resume = {
        ...defaultResume,
        id: crypto.randomUUID(),
      };
      saveToStorage(resume);
      return { resume };
    }),
}));
