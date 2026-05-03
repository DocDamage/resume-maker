import { create } from "zustand";
import type { JobApplication, JobStatus } from "@/types/job";

interface JobState {
  jobs: JobApplication[];
}

interface JobActions {
  addJob: (job: Omit<JobApplication, "id" | "dateUpdated">) => string;
  updateJob: (id: string, data: Partial<JobApplication>) => void;
  removeJob: (id: string) => void;
  moveJob: (id: string, status: JobStatus) => void;
  reorderJobs: (status: JobStatus, ids: string[]) => void;
  getJobsByStatus: (status: JobStatus) => JobApplication[];
}

const STORAGE_KEY = "resume-builder-jobs";

function loadJobs(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveJobs(jobs: JobApplication[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch { /* ignore */ }
}

export const useJobStore = create<JobState & JobActions>((set, get) => ({
  jobs: loadJobs(),

  addJob: (job) => {
    const id = crypto.randomUUID();
    const newJob: JobApplication = {
      ...job,
      id,
      dateUpdated: new Date().toISOString(),
    };
    const jobs = [...get().jobs, newJob];
    saveJobs(jobs);
    set({ jobs });
    return id;
  },

  updateJob: (id, data) => {
    const jobs = get().jobs.map((j) =>
      j.id === id ? { ...j, ...data, dateUpdated: new Date().toISOString() } : j
    );
    saveJobs(jobs);
    set({ jobs });
  },

  removeJob: (id) => {
    const jobs = get().jobs.filter((j) => j.id !== id);
    saveJobs(jobs);
    set({ jobs });
  },

  moveJob: (id, status) => {
    const jobs = get().jobs.map((j) =>
      j.id === id
        ? { ...j, status, dateUpdated: new Date().toISOString() }
        : j
    );
    saveJobs(jobs);
    set({ jobs });
  },

  reorderJobs: (status, ids) => {
    const others = get().jobs.filter((j) => j.status !== status);
    const map = new Map(get().jobs.filter((j) => j.status === status).map((j) => [j.id, j]));
    const ordered = ids.map((id) => map.get(id)).filter(Boolean) as JobApplication[];
    const jobs = [...others, ...ordered];
    saveJobs(jobs);
    set({ jobs });
  },

  getJobsByStatus: (status) => get().jobs.filter((j) => j.status === status),
}));
