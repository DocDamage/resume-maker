import { useResumeStore } from "@/stores/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIImproveButton } from "@/components/AIImproveButton";
import { FileText } from "lucide-react";

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const charCount = summary.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText size={18} />
          Professional Summary
        </CardTitle>
        <AIImproveButton
          type="summary"
          content={summary}
          onImproved={setSummary}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Summary</Label>
            <span className={`text-[10px] font-medium tabular-nums ${wordCount < 20 ? "text-yellow-600" : wordCount > 80 ? "text-muted-foreground" : "text-green-600"}`}>
              {wordCount} words · {charCount} chars
            </span>
          </div>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a brief summary of your professional background and key strengths..."
            rows={6}
            className="resize-y"
          />
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${wordCount < 20 ? "bg-yellow-500" : wordCount > 80 ? "bg-primary" : "bg-green-500"}`}
              style={{ width: `${Math.min((wordCount / 60) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Aim for 30–60 words. Include metrics and your top 2–3 skills.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
