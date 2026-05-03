import type { JobApplication } from "@/types/job";
import { SOURCE_LABELS, SOURCE_COLORS } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { daysSince, daysUntil } from "@/utils/jobParser";
import { Building2, MapPin, Calendar, Target, Trash2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";
import { useJobStore } from "@/stores/jobStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function JobApplicationCard({ job }: { job: JobApplication }) {
  const [expanded, setExpanded] = useState(false);
  const updateJob = useJobStore((s) => s.updateJob);
  const removeJob = useJobStore((s) => s.removeJob);
  const days = daysSince(job.dateUpdated);

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{job.role}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 size={10} />
              {job.company}
            </div>
          </div>
          <Badge
            className="shrink-0 text-[10px] px-1.5 py-0"
            style={{ backgroundColor: SOURCE_COLORS[job.sourceBoard], color: "#fff" }}
          >
            {SOURCE_LABELS[job.sourceBoard]}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-0.5">
              <MapPin size={10} /> {job.location}
            </span>
          )}
          {job.salaryRange && <span>{job.salaryRange}</span>}
          {job.remoteStatus !== "unknown" && (
            <span className="capitalize">{job.remoteStatus}</span>
          )}
          {job.deadline && (
            <span className={`flex items-center gap-0.5 ${(daysUntil(job.deadline) ?? 999) < 3 ? "text-red-500 font-medium" : ""}`}>
              <Clock size={10} />
              {(daysUntil(job.deadline) ?? 999) < 0 ? "Expired" : (daysUntil(job.deadline) ?? 999) === 0 ? "Due today" : `${daysUntil(job.deadline)} days left`}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {job.matchScore !== undefined && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: job.matchScore >= 70 ? "#16a34a" : job.matchScore >= 40 ? "#ca8a04" : "#dc2626" }}>
                <Target size={10} /> {job.matchScore}%
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Calendar size={10} />
              {days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {expanded && (
          <div className="space-y-2 pt-2 border-t">
            <Textarea
              value={job.notes}
              onChange={(e) => updateJob(job.id, { notes: e.target.value })}
              placeholder="Notes..."
              rows={2}
              className="text-xs"
            />
            {job.jobDescription && (
              <div className="text-[10px] text-muted-foreground max-h-24 overflow-y-auto whitespace-pre-wrap border rounded p-2 bg-muted/30">
                {job.jobDescription.slice(0, 400)}
                {job.jobDescription.length > 400 && "..."}
              </div>
            )}
            <div className="flex gap-2">
              {job.sourceURL && (
                <a
                  href={job.sourceURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View Posting
                </a>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive ml-auto"
                onClick={() => removeJob(job.id)}
              >
                <Trash2 size={12} className="mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
