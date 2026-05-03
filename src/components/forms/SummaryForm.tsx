import { useResumeStore } from "@/stores/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIImproveButton } from "@/components/AIImproveButton";

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const setSummary = useResumeStore((s) => s.setSummary);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Professional Summary</CardTitle>
        <AIImproveButton
          type="summary"
          content={summary}
          onImproved={setSummary}
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a brief summary of your professional background and key strengths..."
          rows={6}
        />
      </CardContent>
    </Card>
  );
}
