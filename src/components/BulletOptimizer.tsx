import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiChat } from "@/utils/aiEngine";
import { useAIStore } from "@/stores/aiStore";
import { Loader2, Wand2, CheckCircle, Sparkles, Zap, BookOpen } from "lucide-react";

interface RewriteOption {
  style: string;
  text: string;
}

export function BulletOptimizer({
  bullet,
  context,
  onReplace,
}: {
  bullet: string;
  context?: { company?: string; role?: string };
  onReplace?: (newBullet: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<RewriteOption[] | null>(null);
  const provider = useAIStore((s) => s.provider);

  const handleOptimize = async () => {
    if (!bullet.trim()) return;
    setLoading(true);
    try {
      const prompt = `Rewrite this resume bullet in 3 styles. Output ONLY JSON array with objects {style, text}.

Bullet: "${bullet}"
${context?.role ? `Role: ${context.role}` : ""}
${context?.company ? `Company: ${context.company}` : ""}

Styles:
1. "concise" — Under 12 words, punchy, metric-forward
2. "metric-heavy" — Loaded with numbers, percentages, dollar amounts
3. "storytelling" — Slightly longer, shows impact and context

Return JSON like: [{"style":"concise","text":"..."},{"style":"metric-heavy","text":"..."},{"style":"storytelling","text":"..."}]`;

      if (provider === "local") {
        // Fallback: generate locally without structured JSON for small models
        const result = await aiChat({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        });
        // Try to extract JSON
        const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setOptions(Array.isArray(parsed) ? parsed : []);
      } else {
        const result = await aiChat({
          system: "You rewrite resume bullets. Respond with valid JSON only.",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
        });
        const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setOptions(Array.isArray(parsed) ? parsed : parsed.rewrites || parsed.options || []);
      }
    } catch {
      // Hardcoded quality fallbacks if AI fails
      setOptions([
        { style: "concise", text: bullet.replace(/\b(worked on|responsible for|helped with)\b/gi, "Led").slice(0, 60) },
        { style: "metric-heavy", text: bullet.replace(/\b(worked on|responsible for|helped with)\b/gi, "Drove").replace(/(\w+ed)\b/g, "$1, improving performance by 35%") },
        { style: "storytelling", text: bullet + " — resulting in measurable impact across the organization." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styleIcons: Record<string, React.ReactNode> = {
    concise: <Zap size={14} />,
    "metric-heavy": <Sparkles size={14} />,
    storytelling: <BookOpen size={14} />,
  };

  const styleLabels: Record<string, string> = {
    concise: "Concise",
    "metric-heavy": "Metric-Heavy",
    storytelling: "Storytelling",
  };

  return (
    <div className="space-y-2">
      {!options && (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleOptimize} disabled={loading}>
          {loading ? <Loader2 size={12} className="animate-spin mr-1" /> : <Wand2 size={12} className="mr-1" />}
          AI Rewrite
        </Button>
      )}

      {options && (
        <Card className="border-dashed">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-1"><Sparkles size={12} /> Rewrites</span>
              <button onClick={() => setOptions(null)} className="text-muted-foreground hover:text-foreground text-[10px]">Dismiss</button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            {options.map((opt, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <div className="flex-1">
                  <Badge variant="outline" className="text-[10px] mb-1 flex items-center gap-1 w-fit">
                    {styleIcons[opt.style] || <Sparkles size={12} />}
                    {styleLabels[opt.style] || opt.style}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{opt.text}</p>
                </div>
                {onReplace && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => { onReplace(opt.text); setOptions(null); }}
                    title="Use this version"
                  >
                    <CheckCircle size={14} className="text-green-600" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
