import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1),
  title: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
});

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  description: z.array(z.string()),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional().or(z.literal("")),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  link: z.string().optional().or(z.literal("")),
});

export const ResumeSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default("Untitled Resume"),
  template: z.enum(["modern", "classic", "minimal"]).default("modern"),
  accentColor: z.string().default("#2563eb"),
  font: z.enum(["sans", "serif"]).default("sans"),
  sectionOrder: z.array(z.string()),
  personal: PersonalInfoSchema,
  summary: z.string(),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  skills: z.array(SkillCategorySchema),
  projects: z.array(ProjectSchema),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
