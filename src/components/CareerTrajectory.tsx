import { useState, useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, TrendingUp, GraduationCap, Award, Rocket } from "lucide-react";

interface Scenario {
  id: string;
  label: string;
  impact: number; // dollar impact
  category: "skill" | "cert" | "role" | "experience";
}

const SCENARIOS: Scenario[] = [
  { id: "aws-cert", label: "AWS Solutions Architect cert", impact: 15000, category: "cert" },
  { id: "k8s-cert", label: "Kubernetes CKA cert", impact: 12000, category: "cert" },
  { id: "pmp-cert", label: "PMP Certification", impact: 10000, category: "cert" },
  { id: "ml-skill", label: "Learn Machine Learning", impact: 25000, category: "skill" },
  { id: "rust-skill", label: "Learn Rust", impact: 8000, category: "skill" },
  { id: "react-skill", label: "Deepen React expertise", impact: 5000, category: "skill" },
  { id: "promo-lead", label: "Promotion to Lead/Manager", impact: 30000, category: "role" },
  { id: "promo-staff", label: "Promotion to Staff/Principal", impact: 50000, category: "role" },
  { id: "side-project", label: "Ship a popular side project", impact: 10000, category: "experience" },
  { id: "speak-conf", label: "Speak at 2+ conferences", impact: 8000, category: "experience" },
  { id: "open-source", label: "Become OSS maintainer", impact: 12000, category: "experience" },
  { id: "mba", label: "MBA or advanced degree", impact: 20000, category: "cert" },
];

export function CareerTrajectory() {
  const resume = useResumeStore((s) => s.resume);
  const [active, setActive] = useState<Set<string>>(new Set());

  const baseEstimate = useMemo(() => {
    const role = resume.personal.title.toLowerCase();
    const location = resume.personal.location.toLowerCase();
    const allSkills = resume.skills.flatMap((s) => s.skills);
    const skillCount = allSkills.length;
    const years = resume.experience.length;

    let base = 85000;
    if (role.includes("senior") || role.includes("staff") || role.includes("principal")) base += 60000;
    else if (role.includes("lead") || role.includes("manager")) base += 45000;

    if (/san francisco|new york|seattle/i.test(location)) base += 45000;
    if (skillCount > 15) base += 8000;
    base += years * 5000;

    return base;
  }, [resume]);

  const toggle = (id: string) => {
    const next = new Set(active);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActive(next);
  };

  const totalImpact = Array.from(active).reduce((sum, id) => {
    const s = SCENARIOS.find((sc) => sc.id === id);
    return sum + (s?.impact || 0);
  }, 0);

  const newEstimate = baseEstimate + totalImpact;
  const percentChange = Math.round((totalImpact / baseEstimate) * 100);

  const categoryIcons: Record<string, React.ReactNode> = {
    skill: <Rocket size={12} />,
    cert: <GraduationCap size={12} />,
    role: <TrendingUp size={12} />,
    experience: <Award size={12} />,
  };

  const categoryLabels: Record<string, string> = {
    skill: "Skill", cert: "Certification", role: "Role", experience: "Experience",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp size={18} />
          Career Trajectory Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select skills, certifications, and milestones to see how they could affect your estimated market value.
        </p>

        <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Current Estimate</div>
            <div className="text-lg font-bold">${baseEstimate.toLocaleString()}</div>
          </div>
          {active.size > 0 && (
            <>
              <TrendingUp size={20} className="text-muted-foreground" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">With Changes</div>
                <div className="text-lg font-bold text-green-600">${newEstimate.toLocaleString()}</div>
                <div className="text-xs text-green-600">+{percentChange}%</div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCENARIOS.map((s) => {
            const isActive = active.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex items-center justify-between p-2.5 rounded-md border text-left text-sm transition-colors ${
                  isActive
                    ? "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{categoryIcons[s.category]}</span>
                  <span>{s.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px]">+${(s.impact / 1000).toFixed(0)}k</Badge>
                  {isActive ? <Minus size={12} className="text-green-600" /> : <Plus size={12} className="text-muted-foreground" />}
                </div>
              </button>
            );
          })}
        </div>

        {active.size > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Path</div>
            <div className="flex flex-wrap gap-1">
              {Array.from(active).map((id) => {
                const s = SCENARIOS.find((sc) => sc.id === id)!;
                return (
                  <Badge key={id} variant="secondary" className="text-[10px] flex items-center gap-1">
                    {categoryLabels[s.category]}: {s.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Estimates are hypothetical and based on market trends. Actual increases depend on company, negotiation, timing, and demand.
        </p>
      </CardContent>
    </Card>
  );
}
