import { useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, MapPin, Award } from "lucide-react";

interface SalaryBand {
  role: string;
  location: string;
  low: number;
  mid: number;
  high: number;
  currency: string;
}

function estimateSalary(resume: ReturnType<typeof useResumeStore.getState>["resume"]): SalaryBand {
  const role = resume.personal.title.toLowerCase();
  const location = resume.personal.location.toLowerCase();
  const allSkills = resume.skills.flatMap((s) => s.skills);
  const skillCount = allSkills.length;
  const hasCloud = allSkills.some((s) => /aws|azure|gcp|cloud/i.test(s));
  const hasML = allSkills.some((s) => /machine learning|ai|tensorflow|pytorch/i.test(s));
  const hasLeadership = resume.experience.some((e) =>
    e.description.some((d) => /lead|manage|direct|head of/i.test(d))
  );
  const years = resume.experience.length;

  let baseLow = 60000, baseMid = 85000, baseHigh = 120000;

  // Role adjustments
  if (role.includes("senior") || role.includes("staff") || role.includes("principal")) {
    baseLow += 40000; baseMid += 60000; baseHigh += 90000;
  } else if (role.includes("lead") || role.includes("manager")) {
    baseLow += 30000; baseMid += 45000; baseHigh += 70000;
  } else if (role.includes("junior") || role.includes("associate") || role.includes("intern")) {
    baseLow -= 15000; baseMid -= 20000; baseHigh -= 30000;
  }

  if (role.includes("engineer") || role.includes("developer")) {
    baseLow += 10000; baseMid += 15000; baseHigh += 25000;
  }
  if (role.includes("data")) {
    baseLow += 15000; baseMid += 20000; baseHigh += 30000;
  }
  if (role.includes("product") || role.includes("design")) {
    baseLow += 5000; baseMid += 10000; baseHigh += 15000;
  }

  // Location adjustments
  const isHighCoL = /san francisco|new york|seattle|boston|los angeles|london|zurich|sydney|toronto/i.test(location);
  const isLowCoL = /remote|india|philippines|vietnam|poland|romania|brazil|mexico/i.test(location);
  if (isHighCoL) { baseLow += 30000; baseMid += 45000; baseHigh += 70000; }
  if (isLowCoL) { baseLow -= 20000; baseMid -= 25000; baseHigh -= 40000; }

  // Skill premiums
  if (hasCloud) { baseLow += 8000; baseMid += 12000; baseHigh += 20000; }
  if (hasML) { baseLow += 15000; baseMid += 25000; baseHigh += 40000; }
  if (skillCount > 15) { baseLow += 5000; baseMid += 8000; baseHigh += 15000; }

  // Experience
  baseLow += years * 3000;
  baseMid += years * 5000;
  baseHigh += years * 8000;

  if (hasLeadership) {
    baseLow += 10000; baseMid += 15000; baseHigh += 25000;
  }

  const currency = /london|uk|england|britain/i.test(location) ? "£" : /euro|germany|france|spain|italy|netherlands/i.test(location) ? "€" : "$";

  return {
    role: resume.personal.title,
    location: resume.personal.location || "Unspecified",
    low: Math.round(baseLow / 1000) * 1000,
    mid: Math.round(baseMid / 1000) * 1000,
    high: Math.round(baseHigh / 1000) * 1000,
    currency,
  };
}

export function SalaryEstimator() {
  const resume = useResumeStore((s) => s.resume);
  const estimate = useMemo(() => estimateSalary(resume), [resume]);

  const factors = useMemo(() => {
    const list: { label: string; impact: "positive" | "negative" | "neutral"; text: string }[] = [];
    const allSkills = resume.skills.flatMap((s) => s.skills);
    const years = resume.experience.length;

    if (years >= 5) list.push({ label: "Experience", impact: "positive", text: `${years} years — strong leverage` });
    else if (years < 2) list.push({ label: "Experience", impact: "negative", text: `${years} years — early career` });

    if (allSkills.some((s) => /aws|azure|gcp/i.test(s))) list.push({ label: "Cloud", impact: "positive", text: "Cloud skills command premium" });
    if (allSkills.some((s) => /machine learning|ai/i.test(s))) list.push({ label: "AI/ML", impact: "positive", text: "AI/ML roles are high-demand" });
    if (resume.certifications.length > 0) list.push({ label: "Certifications", impact: "positive", text: `${resume.certifications.length} cert(s) add credibility` });

    const hasLeadership = resume.experience.some((e) => e.description.some((d) => /lead|manage|direct/i.test(d)));
    if (hasLeadership) list.push({ label: "Leadership", impact: "positive", text: "Management experience increases band" });

    if (/san francisco|new york|seattle/i.test(resume.personal.location)) list.push({ label: "Location", impact: "positive", text: "High cost-of-living market" });
    if (/remote|india|philippines/i.test(resume.personal.location)) list.push({ label: "Location", impact: "negative", text: "Competitive/lower CoL market" });

    return list;
  }, [resume]);

  const format = (n: number) => estimate.currency + n.toLocaleString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign size={18} />
          Salary Estimate
          <Badge variant="outline" className="ml-auto text-[10px]">Heuristic</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          {estimate.location}
        </div>

        <div className="relative pt-6 pb-2">
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="h-full bg-red-400" style={{ width: "25%" }} />
            <div className="h-full bg-yellow-400" style={{ width: "50%" }} />
            <div className="h-full bg-green-400" style={{ width: "25%" }} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium">
            <span>{format(estimate.low)}</span>
            <span className="text-primary font-bold">{format(estimate.mid)}</span>
            <span>{format(estimate.high)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>25th percentile</span>
            <span>Median</span>
            <span>75th percentile</span>
          </div>
        </div>

        {factors.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Factors</div>
            {factors.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs">
                {f.impact === "positive" ? (
                  <TrendingUp size={12} className="text-green-600 shrink-0" />
                ) : f.impact === "negative" ? (
                  <TrendingUp size={12} className="text-red-600 shrink-0 rotate-180" />
                ) : (
                  <Award size={12} className="text-muted-foreground shrink-0" />
                )}
                <span className="font-medium">{f.label}:</span>
                <span className="text-muted-foreground">{f.text}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground">
          Estimates are heuristic-based and vary significantly by company size, industry, and negotiation skill.
          Use as a directional guide, not a guarantee.
        </p>
      </CardContent>
    </Card>
  );
}
