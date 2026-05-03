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

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  link: z.string().optional().or(z.literal("")),
});

export const LanguageSchema = z.object({
  id: z.string(),
  language: z.string().min(1),
  proficiency: z.enum(["Native", "Fluent", "Conversational", "Basic"]),
});

export const ReferenceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  title: z.string(),
  company: z.string(),
  email: z.string(),
  phone: z.string().optional().or(z.literal("")),
});

export const AwardSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  description: z.string().optional().or(z.literal("")),
});

export const VolunteerEntrySchema = z.object({
  id: z.string(),
  organization: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean().default(false),
  description: z.array(z.string()),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().or(z.literal("")),
    date: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
  })),
});

export const SectionVisibilitySchema = z.record(z.string(), z.boolean()).default({
  summary: true,
  experience: true,
  education: true,
  skills: true,
  certifications: true,
  languages: true,
  projects: true,
  references: true,
  awards: true,
  volunteer: true,
});

export const ResumeSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default("Untitled Resume"),
  template: z.enum(["modern", "classic", "minimal", "sidebar", "executive", "creative", "compact", "elegant"]).default("modern"),
  accentColor: z.string().default("#2563eb"),
  font: z.enum(["sans", "serif"]).default("sans"),
  sectionOrder: z.array(z.string()),
  photoUrl: z.string().optional(),
  paperSize: z.enum(["a4", "letter", "legal"]).default("a4"),
  spacing: z.number().default(1.0),
  darkMode: z.boolean().default(false),
  personal: PersonalInfoSchema,
  summary: z.string(),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  skills: z.array(SkillCategorySchema),
  projects: z.array(ProjectSchema),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  references: z.array(ReferenceSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  volunteer: z.array(VolunteerEntrySchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
  visibility: SectionVisibilitySchema,
  customCss: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type VolunteerEntry = z.infer<typeof VolunteerEntrySchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
