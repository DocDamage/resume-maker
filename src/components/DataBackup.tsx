import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Database, CheckCircle, AlertTriangle } from "lucide-react";

interface AppData {
  resume: unknown;
  jobs: unknown;
  branches: unknown;
  offers: unknown;
  comments: unknown;
  aiSettings: unknown;
  exportedAt: string;
  version: string;
}

export function DataBackup() {
  const [imported, setImported] = useState(false);
  const [error, setError] = useState("");

  const gatherData = (): AppData => {
    const data: AppData = {
      resume: null,
      jobs: null,
      branches: null,
      offers: null,
      comments: null,
      aiSettings: null,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    try { data.resume = JSON.parse(localStorage.getItem("resume-builder-data") || "null"); } catch { /* ignore */ }
    try { data.jobs = JSON.parse(localStorage.getItem("resume-builder-jobs") || "null"); } catch { /* ignore */ }
    try { data.branches = JSON.parse(localStorage.getItem("resume-builder-multi") || "null"); } catch { /* ignore */ }
    try { data.offers = JSON.parse(localStorage.getItem("resume-builder-offers") || "null"); } catch { /* ignore */ }
    try {
      const comments: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("resume-comments-")) {
          comments[key] = JSON.parse(localStorage.getItem(key) || "null");
        }
      }
      data.comments = comments;
    } catch { /* ignore */ }
    try {
      data.aiSettings = {
        provider: localStorage.getItem("resume-builder-ai-provider"),
        openaiKey: localStorage.getItem("resume-builder-openai-key"),
        openaiModel: localStorage.getItem("resume-builder-openai-model"),
        localModel: localStorage.getItem("resume-builder-local-model"),
      };
    } catch { /* ignore */ }
    return data;
  };

  const handleExport = () => {
    const data = gatherData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-builder-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data: AppData = JSON.parse(String(ev.target?.result || "{}"));
        if (data.resume) localStorage.setItem("resume-builder-data", JSON.stringify(data.resume));
        if (data.jobs) localStorage.setItem("resume-builder-jobs", JSON.stringify(data.jobs));
        if (data.branches) localStorage.setItem("resume-builder-multi", JSON.stringify(data.branches));
        if (data.offers) localStorage.setItem("resume-builder-offers", JSON.stringify(data.offers));
        if (data.comments && typeof data.comments === "object") {
          Object.entries(data.comments).forEach(([key, val]) => {
            if (val) localStorage.setItem(key, JSON.stringify(val));
          });
        }
        if (data.aiSettings && typeof data.aiSettings === "object") {
          const s = data.aiSettings as Record<string, string | null>;
          if (s.provider) localStorage.setItem("resume-builder-ai-provider", s.provider);
          if (s.openaiKey) localStorage.setItem("resume-builder-openai-key", s.openaiKey);
          if (s.openaiModel) localStorage.setItem("resume-builder-openai-model", s.openaiModel);
          if (s.localModel) localStorage.setItem("resume-builder-local-model", s.localModel);
        }
        setImported(true);
        setError("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch {
        setError("Invalid backup file. Please select a valid resume-builder backup.");
        setImported(false);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const summary = gatherData();
  const counts = [
    { label: "Resume", has: !!summary.resume },
    { label: "Jobs", has: Array.isArray(summary.jobs) && summary.jobs.length > 0, count: Array.isArray(summary.jobs) ? summary.jobs.length : 0 },
    { label: "Branches", has: Array.isArray(summary.branches) && summary.branches.length > 0, count: Array.isArray(summary.branches) ? summary.branches.length : 0 },
    { label: "Offer Details", has: !!summary.offers && Object.keys(summary.offers).length > 0 },
    { label: "Comments", has: !!summary.comments && Object.keys(summary.comments).length > 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database size={18} />
          Data Backup & Restore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {counts.map((c) => (
            <Badge key={c.label} variant={c.has ? "default" : "outline"} className="text-[10px]">
              {c.label}{c.count !== undefined ? `: ${c.count}` : ""}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={14} className="mr-1" /> Export All Data
          </Button>
          <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-muted h-8 px-3 cursor-pointer">
            <Upload size={14} /> Import Backup
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        {imported && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-800">
            <CheckCircle size={14} />
            Data imported successfully. Reloading...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-800">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Export creates a complete backup of your resume, job tracker, branches, offer comparisons, comments, and AI settings.
          Importing will overwrite all current data and reload the page.
        </p>
      </CardContent>
    </Card>
  );
}
