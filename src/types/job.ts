import { z } from "zod";

export const JobStatusSchema = z.enum([
  "wishlist",
  "applied",
  "screen",
  "interview",
  "offer",
  "rejected",
  "ghosted",
]);

export const JobSourceSchema = z.enum([
  "indeed",
  "monster",
  "linkedin",
  "greenhouse",
  "lever",
  "workday",
  "other",
]);

export const JobApplicationSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  sourceURL: z.string(),
  sourceBoard: JobSourceSchema,
  jobDescription: z.string(),
  resumeId: z.string().optional(),
  resumeBranchName: z.string().optional(),
  status: JobStatusSchema,
  dateApplied: z.string().optional(),
  dateUpdated: z.string(),
  notes: z.string(),
  matchScore: z.number().min(0).max(100).optional(),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  remoteStatus: z.enum(["onsite", "hybrid", "remote", "unknown"]).default("unknown"),
  deadline: z.string().optional(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type JobSource = z.infer<typeof JobSourceSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;

export const JOB_STATUSES: JobStatus[] = [
  "wishlist",
  "applied",
  "screen",
  "interview",
  "offer",
  "rejected",
  "ghosted",
];

export const STATUS_LABELS: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  screen: "Phone Screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
};

export const SOURCE_LABELS: Record<JobSource, string> = {
  indeed: "Indeed",
  monster: "Monster",
  linkedin: "LinkedIn",
  greenhouse: "Greenhouse",
  lever: "Lever",
  workday: "Workday",
  other: "Other",
};

export const SOURCE_COLORS: Record<JobSource, string> = {
  indeed: "#2164f3",
  monster: "#6d44e5",
  linkedin: "#0a66c2",
  greenhouse: "#24a47b",
  lever: "#5c4ee5",
  workday: "#f48c25",
  other: "#64748b",
};
