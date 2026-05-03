import { useMemo } from "react";
import { useJobStore } from "@/stores/jobStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Calendar, Funnel } from "lucide-react";
import { JOB_STATUSES, STATUS_LABELS, SOURCE_LABELS } from "@/types/job";

export function AnalyticsDashboard() {
  const jobs = useJobStore((s) => s.jobs);

  const funnel = useMemo(() => {
    const counts: Record<string, number> = {};
    JOB_STATUSES.forEach((s) => { counts[s] = jobs.filter((j) => j.status === s).length; });
    const max = Math.max(...Object.values(counts), 1);
    return { counts, max };
  }, [jobs]);

  const sources = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((j) => {
      map.set(j.sourceBoard, (map.get(j.sourceBoard) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [jobs]);

  const timeline = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((j) => {
      if (j.dateApplied) {
        const month = j.dateApplied.slice(0, 7);
        map.set(month, (map.get(month) || 0) + 1);
      }
    });
    return Array.from(map.entries()).sort();
  }, [jobs]);

  const responseRate = useMemo(() => {
    const applied = jobs.filter((j) => j.status === "applied").length;
    const responded = jobs.filter((j) => ["screen", "interview", "offer", "rejected"].includes(j.status)).length;
    return applied > 0 ? Math.round((responded / (responded + applied)) * 100) : 0;
  }, [jobs]);

  const avgMatch = useMemo(() => {
    const withScore = jobs.filter((j) => j.matchScore !== undefined);
    return withScore.length > 0
      ? Math.round(withScore.reduce((a, j) => a + (j.matchScore || 0), 0) / withScore.length)
      : null;
  }, [jobs]);

  const colors: Record<string, string> = {
    wishlist: "bg-slate-400",
    applied: "bg-blue-500",
    screen: "bg-yellow-500",
    interview: "bg-purple-500",
    offer: "bg-green-500",
    rejected: "bg-red-400",
    ghosted: "bg-gray-400",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 size={18} />
          Job Search Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No data yet. Add jobs to your tracker to see analytics.
          </p>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-md border text-center">
                <div className="text-2xl font-bold">{jobs.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Jobs</div>
              </div>
              <div className="p-3 rounded-md border text-center">
                <div className="text-2xl font-bold text-green-600">
                  {jobs.filter((j) => j.status === "offer").length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Offers</div>
              </div>
              <div className="p-3 rounded-md border text-center">
                <div className="text-2xl font-bold">{responseRate}%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Response Rate</div>
              </div>
              {avgMatch !== null && (
                <div className="p-3 rounded-md border text-center">
                  <div className="text-2xl font-bold">{avgMatch}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Match</div>
                </div>
              )}
            </div>

            {/* Funnel */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Funnel size={12} /> Application Funnel
              </div>
              <div className="space-y-1">
                {JOB_STATUSES.map((status) => {
                  const count = funnel.counts[status];
                  const pct = Math.round((count / funnel.max) * 100);
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <div className="w-20 text-[10px] text-muted-foreground text-right">{STATUS_LABELS[status]}</div>
                      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[status]} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-6 text-[10px] font-medium text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source breakdown */}
            {sources.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Target size={12} /> Sources
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map(([source, count]) => (
                    <Badge key={source} variant="secondary" className="text-[10px]">
                      {SOURCE_LABELS[source as keyof typeof SOURCE_LABELS] || source}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Calendar size={12} /> Application Timeline
                </div>
                <div className="flex items-end gap-1 h-16">
                  {timeline.map(([month, count]) => {
                    const max = Math.max(...timeline.map((t) => t[1]), 1);
                    const h = Math.max((count / max) * 100, 10);
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-full bg-primary/60 rounded-t"
                          style={{ height: `${h}%` }}
                          title={`${month}: ${count} applications`}
                        />
                        <span className="text-[8px] text-muted-foreground -rotate-45 origin-top-left translate-y-2">
                          {month.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversion rates */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <TrendingUp size={12} /> Conversion Rates
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { from: "applied", to: "screen", label: "Applied → Screen" },
                  { from: "screen", to: "interview", label: "Screen → Interview" },
                  { from: "interview", to: "offer", label: "Interview → Offer" },
                ].map((c) => {
                  const fromCount = jobs.filter((j) => j.status === c.from || j.status === c.to || (c.to === "offer" && j.status === "offer")).length;
                  const toCount = jobs.filter((j) => j.status === c.to).length;
                  const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
                  return (
                    <div key={c.label} className="p-2 rounded-md border">
                      <div className="text-lg font-bold">{rate}%</div>
                      <div className="text-[9px] text-muted-foreground">{c.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
