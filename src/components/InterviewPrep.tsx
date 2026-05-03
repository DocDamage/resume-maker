import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiChat } from "@/utils/aiEngine";
import { Loader2, MessageSquare, Lightbulb, AlertCircle } from "lucide-react";

export function InterviewPrep() {
  const resume = useResumeStore((s) => s.resume);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const bullets = resume.experience.flatMap((e) => e.description);
      const prompt = `Based on this experience, generate 5 likely interview questions and strong answers. Experience: ${bullets.join(" ")}. Output ONLY JSON: {"questions":[{"question":"","answer":""}]}`;
      const raw = await aiChat({ messages: [{ role: "user", content: prompt }], temperature: 0.4 });
      const parsed = JSON.parse(raw);
      setQa(parsed.questions || []);
    } catch {
      setError("Failed to generate questions. Please try again.");
      setQa([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={18} />
          Interview Prep
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Generate likely interview questions and suggested answers based on your experience.</p>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Lightbulb size={16} className="mr-1" />}
          Generate Q&A
        </Button>

        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {qa.length > 0 && (
          <div className="space-y-4">
            {qa.map((item, i) => (
              <div key={i} className="border rounded-lg p-3 bg-muted/30">
                <p className="font-medium text-sm mb-1">Q: {item.q}</p>
                <p className="text-sm text-muted-foreground">A: {item.a}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
