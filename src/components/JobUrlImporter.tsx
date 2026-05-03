import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobStore } from "@/stores/jobStore";
import { detectJobSource, extractSalary, extractLocation, detectRemote, extractCompanyAndRole, extractDeadline } from "@/utils/jobParser";
import { SOURCE_LABELS, SOURCE_COLORS, type JobSource } from "@/types/job";
import { Link2, Plus, Globe } from "lucide-react";

export function JobUrlImporter() {
  const [url, setUrl] = useState("");
  const [jd, setJd] = useState("");
  const [detected, setDetected] = useState<{
    source: JobSource;
    company?: string;
    role?: string;
    salary?: string;
    location?: string;
    remote: ReturnType<typeof detectRemote>;
    deadline?: string;
  } | null>(null);

  const addJob = useJobStore((s) => s.addJob);

  const handleDetect = () => {
    if (!url && !jd) return;
    const source = detectJobSource(url || "");
    const text = jd || "";
    const meta = extractCompanyAndRole(text);
    setDetected({
      source,
      company: meta.company,
      role: meta.role,
      salary: extractSalary(text),
      location: extractLocation(text),
      remote: detectRemote(text),
      deadline: extractDeadline(text),
    });
  };

  const handleSave = () => {
    if (!detected) return;
    const today = new Date().toISOString().split("T")[0];
    addJob({
      company: detected.company || "Unknown Company",
      role: detected.role || "Unknown Role",
      sourceURL: url,
      sourceBoard: detected.source,
      jobDescription: jd,
      status: "wishlist",
      dateApplied: today,
      notes: "",
      matchScore: undefined,
      salaryRange: detected.salary,
      location: detected.location,
      remoteStatus: detected.remote,
      deadline: detected.deadline,
    });
    setUrl("");
    setJd("");
    setDetected(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 size={18} />
          Add Job from URL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste job posting URL (Indeed, Monster, LinkedIn...)"
        />
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste job description text here..."
          rows={5}
        />
        <Button onClick={handleDetect} variant="outline" size="sm">
          <Globe size={14} className="mr-1" /> Detect Details
        </Button>

        {detected && (
          <div className="space-y-2 rounded-md border p-3 bg-muted/40">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge style={{ backgroundColor: SOURCE_COLORS[detected.source], color: "#fff" }}>
                {SOURCE_LABELS[detected.source]}
              </Badge>
              {detected.remote !== "unknown" && (
                <Badge variant="secondary" className="capitalize">{detected.remote}</Badge>
              )}
              {detected.salary && <Badge variant="outline">{detected.salary}</Badge>}
            </div>
            <div className="text-sm font-medium">{detected.role}</div>
            <div className="text-sm text-muted-foreground">{detected.company}</div>
            {detected.location && <div className="text-xs text-muted-foreground">{detected.location}</div>}
            <Button size="sm" onClick={handleSave} className="w-full mt-1">
              <Plus size={14} className="mr-1" /> Save to Tracker
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
