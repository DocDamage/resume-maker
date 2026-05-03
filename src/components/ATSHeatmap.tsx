import { useMemo, useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeBullet } from "@/utils/atsScore";
import { Eye, EyeOff, Target } from "lucide-react";

export function ATSHeatmap() {
  const resume = useResumeStore((s) => s.resume);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const bulletAnalyses = useMemo(() => {
    const results: { section: string; entryId: string; bulletIndex: number; analysis: ReturnType<typeof analyzeBullet> }[] = [];
    resume.experience.forEach((exp) => {
      exp.description.forEach((bullet, i) => {
        results.push({ section: "experience", entryId: exp.id, bulletIndex: i, analysis: analyzeBullet(bullet) });
      });
    });
    resume.volunteer.forEach((vol) => {
      vol.description.forEach((bullet, i) => {
        results.push({ section: "volunteer", entryId: vol.id, bulletIndex: i, analysis: analyzeBullet(bullet) });
      });
    });
    return results;
  }, [resume.experience, resume.volunteer]);

  const summaryAnalysis = useMemo(() => {
    const words = resume.summary.trim().split(/\s+/).length;
    const hasMetric = /\d|%|\$/.test(resume.summary);
    const score = words >= 30 && words <= 60 && hasMetric ? 90 : words >= 20 ? 70 : 40;
    return { words, hasMetric, score };
  }, [resume.summary]);

  const avgScore = bulletAnalyses.length > 0
    ? Math.round(bulletAnalyses.reduce((a, b) => a + b.analysis.score, 0) / bulletAnalyses.length)
    : 0;

  const scoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target size={18} />
          ATS Heatmap
          <Badge variant="outline" className="ml-auto text-[10px]">
            Avg: {avgScore}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showHeatmap ? <Eye size={14} /> : <EyeOff size={14} />}
            {showHeatmap ? "Hide scores" : "Show scores"}
          </button>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <span className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Strong</span>
            <span className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Okay</span>
            <span className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Weak</span>
          </div>
        </div>

        {/* Summary row */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary</div>
          <div className="flex items-center gap-2 p-2 rounded-md border">
            {showHeatmap && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${scoreColor(summaryAnalysis.score)}`}>
                {summaryAnalysis.score}
              </div>
            )}
            <div className="flex-1 text-xs truncate">{resume.summary.slice(0, 80)}...</div>
            <div className="flex gap-1 shrink-0">
              {summaryAnalysis.words < 20 && (
                <Badge variant="destructive" className="text-[10px]">Too short</Badge>
              )}
              {!summaryAnalysis.hasMetric && (
                <Badge variant="secondary" className="text-[10px]">No metric</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Experience bullets */}
        {bulletAnalyses.filter((b) => b.section === "experience").length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience Bullets</div>
            <div className="space-y-1.5">
              {bulletAnalyses
                .filter((b) => b.section === "experience")
                .map((b) => (
                  <div
                    key={`${b.entryId}-${b.bulletIndex}`}
                    className="flex items-start gap-2 p-2 rounded-md border group hover:bg-muted/40 transition-colors"
                  >
                    {showHeatmap && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5 ${scoreColor(b.analysis.score)}`}>
                        {b.analysis.score}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">{b.analysis.text}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {!b.analysis.hasPowerVerb && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto border-red-200 text-red-600">Weak verb</Badge>
                        )}
                        {!b.analysis.hasMetric && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto border-yellow-200 text-yellow-600">No metric</Badge>
                        )}
                        {b.analysis.isPassive && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto border-yellow-200 text-yellow-600">Passive</Badge>
                        )}
                        {b.analysis.isTooLong && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto border-yellow-200 text-yellow-600">Too long</Badge>
                        )}
                        {b.analysis.score >= 80 && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-auto border-green-200 text-green-600">Strong</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-md border">
            <div className="text-lg font-bold {scoreTextColor(avgScore)}">{avgScore}%</div>
            <div className="text-[10px] text-muted-foreground">Bullet Avg</div>
          </div>
          <div className="p-2 rounded-md border">
            <div className="text-lg font-bold">
              {bulletAnalyses.filter((b) => b.analysis.hasMetric).length}
            </div>
            <div className="text-[10px] text-muted-foreground">With Metrics</div>
          </div>
          <div className="p-2 rounded-md border">
            <div className="text-lg font-bold">
              {bulletAnalyses.filter((b) => b.analysis.score >= 80).length}
            </div>
            <div className="text-[10px] text-muted-foreground">Strong Bullets</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
