import { useMemo, useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { aiChat } from "@/utils/aiEngine";
import { useAIStore } from "@/stores/aiStore";
import { Calendar, Loader2, Wand2, AlertCircle } from "lucide-react";

interface Gap {
  start: string;
  end: string;
  months: number;
  beforeRole: string;
  afterRole: string;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Try various formats: "2021-03", "Mar 2021", "2021", "03/2021"
  const clean = dateStr.trim().toLowerCase();
  // YYYY-MM
  const ym = clean.match(/(\d{4})-(\d{2})/);
  if (ym) return new Date(parseInt(ym[1]), parseInt(ym[2]) - 1, 1);
  // MM/YYYY
  const my = clean.match(/(\d{2})\/(\d{4})/);
  if (my) return new Date(parseInt(my[2]), parseInt(my[1]) - 1, 1);
  // Mon YYYY
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const monYear = clean.match(/([a-z]{3,})\s+(\d{4})/);
  if (monYear) {
    const m = months.indexOf(monYear[1].slice(0,3));
    if (m >= 0) return new Date(parseInt(monYear[2]), m, 1);
  }
  // Just YYYY
  const justYear = clean.match(/^(\d{4})$/);
  if (justYear) return new Date(parseInt(justYear[1]), 0, 1);
  return null;
}

function monthDiff(d1: Date, d2: Date): number {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

function findGaps(experience: ReturnType<typeof useResumeStore.getState>["resume"]["experience"]): Gap[] {
  const sorted = [...experience]
    .map((e) => ({
      ...e,
      start: parseDate(e.startDate),
      end: e.current ? new Date() : parseDate(e.endDate),
    }))
    .filter((e) => e.start && e.end)
    .sort((a, b) => (a.start!.getTime() - b.start!.getTime()));

  const gaps: Gap[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const gapMonths = monthDiff(current.end!, next.start!);
    if (gapMonths > 3) {
      gaps.push({
        start: current.endDate || current.end!.toISOString().slice(0, 7),
        end: next.startDate || next.start!.toISOString().slice(0, 7),
        months: gapMonths,
        beforeRole: `${current.role} at ${current.company}`,
        afterRole: `${next.role} at ${next.company}`,
      });
    }
  }
  return gaps;
}

export function GapNarrative() {
  const experience = useResumeStore((s) => s.resume.experience);
  const gaps = useMemo(() => findGaps(experience), [experience]);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const provider = useAIStore((s) => s.provider);

  const handleGenerate = async (gap: Gap) => {
    const key = `${gap.start}-${gap.end}`;
    setLoading(key);
    try {
      if (provider === "local") {
        // Fast fallback without AI
        setSuggestions((prev) => ({
          ...prev,
          [key]: [
            "Pursued independent consulting and skill development in emerging technologies.",
            "Took time for personal growth and family responsibilities while maintaining professional network.",
            "Completed certification courses and contributed to open-source projects during the transition period.",
          ],
        }));
      } else {
        const prompt = `Suggest 3 professional ways to explain a ${gap.months}-month employment gap on a resume.

Gap: ${gap.beforeRole} → ${gap.afterRole}
Duration: ${gap.start} to ${gap.end}

Output ONLY a JSON array of 3 strings. Each should be one sentence, professional, honest, and concise. No markdown.`;
        const result = await aiChat({
          system: "You are a career coach. Respond with valid JSON array of strings only.",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
        });
        const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const arr = Array.isArray(parsed) ? parsed : parsed.suggestions || parsed.options || [];
        setSuggestions((prev) => ({ ...prev, [key]: arr.slice(0, 3) }));
      }
    } catch {
      setSuggestions((prev) => ({
        ...prev,
        [key]: [
          "Invested in professional development through targeted coursework and self-directed learning.",
          "Managed personal responsibilities while actively networking and exploring strategic career opportunities.",
          "Used the time to earn industry certifications and contribute to community technical initiatives.",
        ],
      }));
    } finally {
      setLoading(null);
    }
  };

  if (gaps.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar size={28} className="mx-auto text-green-500 mb-2" />
          <p className="font-medium text-sm">No employment gaps detected</p>
          <p className="text-xs text-muted-foreground">Your work history has no significant gaps.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar size={18} />
          Employment Gaps
          <Badge variant="secondary" className="ml-auto text-[10px]">{gaps.length} found</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.map((gap) => {
          const key = `${gap.start}-${gap.end}`;
          return (
            <div key={key} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-yellow-600" />
                <span className="text-sm font-medium">
                  {gap.months}-month gap
                </span>
                <span className="text-xs text-muted-foreground">
                  ({gap.start} → {gap.end})
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {gap.beforeRole} → {gap.afterRole}
              </div>

              {!suggestions[key] && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleGenerate(gap)}
                  disabled={loading === key}
                >
                  {loading === key ? (
                    <Loader2 size={12} className="animate-spin mr-1" />
                  ) : (
                    <Wand2 size={12} className="mr-1" />
                  )}
                  Generate Explanations
                </Button>
              )}

              {suggestions[key] && (
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Suggested explanations
                  </p>
                  {suggestions[key].map((s, i) => (
                    <div
                      key={i}
                      className="text-xs p-2 rounded bg-muted/50 border border-dashed cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        // Copy to clipboard
                        navigator.clipboard.writeText(s);
                      }}
                      title="Click to copy"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
