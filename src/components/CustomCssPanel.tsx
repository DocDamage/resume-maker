import { useResumeStore } from "@/stores/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

export function CustomCssPanel() {
  const customCss = useResumeStore((s) => s.resume.customCss);
  const setCustomCss = useResumeStore((s) => s.setCustomCss);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Code size={20} /> Custom CSS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">Override any template styles. Applied to the preview only.</p>
        <Textarea value={customCss || ""} onChange={(e) => setCustomCss(e.target.value)} placeholder={"/* Example: */\nh1 { color: #ff0000; }"} rows={10} className="font-mono text-xs" />
      </CardContent>
    </Card>
  );
}
