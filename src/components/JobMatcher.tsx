import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateATSScore } from "@/utils/atsScore";
import { useResumeStore } from "@/stores/resumeStore";
import { Loader2, Target, CheckCircle } from "lucide-react";
import { aiChat } from "@/utils/aiEngine";
import { useAIStore } from "@/stores/aiStore";

export function JobMatcher() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    missing: string[];
    suggestions: string[];
  } | null>(null);

  const resume = useResumeStore((s) => s.resume);
  const provider = useAIStore((s) => s.provider);

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    try {
      const ats = calculateATSScore(resume, jd);
      if (provider === "local") {
        setResult({
          score: ats.overall,
          missing: ats.missingKeywords.slice(0, 10),
          suggestions: ats.missingKeywords.length > 0
            ? [`Add these keywords: ${ats.missingKeywords.slice(0, 5).join(", ")}`]
            : ["Great keyword coverage!"],
        });
      } else {
        const prompt = `Job Description:\n${jd}\n\nResume Plain Text:\n${ats.plainText}\n\nAnalyze how well this resume matches the job description. Output ONLY JSON:\n{"score": 0-100, "missing": ["keyword1", ...], "suggestions": ["...", ...]}`;
        const raw = await aiChat({ system: "You are an ATS expert.", messages: [{ role: "user", content: prompt }], temperature: 0.3 });
        const parsed = JSON.parse(raw);
        setResult({
          score: parsed.score || ats.overall,
          missing: parsed.missing || ats.missingKeywords,
          suggestions: parsed.suggestions || [],
        });
      }
    } catch {
      const ats = calculateATSScore(resume, jd);
      setResult({
        score: ats.overall,
        missing: ats.missingKeywords.slice(0, 10),
        suggestions: ats.missingKeywords.length > 0
          ? [`Consider adding: ${ats.missingKeywords.slice(0, 5).join(", ")}`]
          : ["Good match!"],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target size={20} />
          Job Description Matcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste a job description here to analyze keyword match..."
          rows={8}
        />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Target size={16} className="mr-1" />}
          Analyze Match
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold" style={{ color: result.score >= 70 ? "#16a34a" : result.score >= 40 ? "#ca8a04" : "#dc2626" }}>
                {result.score}%
              </div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>

            {result.missing.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Missing Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {result.missing.map((k) => (
                    <Badge key={k} variant="destructive">{k}</Badge>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Suggestions</div>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                    <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-600" />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
