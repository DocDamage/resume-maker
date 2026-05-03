import { useState } from "react";
import { useJobStore } from "@/stores/jobStore";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Briefcase, Home, Heart, Scale } from "lucide-react";

interface OfferDetails {
  salary: string;
  bonus: string;
  equity: string;
  remote: string;
  pto: string;
  benefits: string;
  growth: number; // 1-5
  culture: number; // 1-5
}

const WEIGHTS = {
  salary: 0.25,
  bonus: 0.10,
  equity: 0.15,
  remote: 0.10,
  pto: 0.05,
  benefits: 0.10,
  growth: 0.15,
  culture: 0.10,
};

function parseMoney(val: string): number {
  const cleaned = val.replace(/[^\d.k]/gi, "");
  if (cleaned.includes("k")) return parseFloat(cleaned) * 1000;
  if (cleaned.includes(".")) return parseFloat(cleaned) * 1000;
  return parseFloat(cleaned) || 0;
}

function scoreOffer(details: OfferDetails): number {
  let score = 0;
  const salary = parseMoney(details.salary);
  const bonus = parseMoney(details.bonus);
  const equity = parseMoney(details.equity);

  // Normalize salary score (assume $200k is max)
  score += Math.min(salary / 200000, 1) * WEIGHTS.salary * 100;
  score += Math.min(bonus / 50000, 1) * WEIGHTS.bonus * 100;
  score += Math.min(equity / 100000, 1) * WEIGHTS.equity * 100;

  // Remote score
  const remoteScore = details.remote.toLowerCase().includes("fully") || details.remote.toLowerCase().includes("100%") ? 1 :
    details.remote.toLowerCase().includes("hybrid") ? 0.7 :
    details.remote.toLowerCase().includes("flex") ? 0.8 : 0.3;
  score += remoteScore * WEIGHTS.remote * 100;

  // PTO score (assume 30 days is max)
  const ptoDays = parseFloat(details.pto) || 0;
  score += Math.min(ptoDays / 30, 1) * WEIGHTS.pto * 100;

  // Benefits score (heuristic based on length)
  score += Math.min(details.benefits.length / 100, 1) * WEIGHTS.benefits * 100;

  // Growth & culture (1-5 scale)
  score += (details.growth / 5) * WEIGHTS.growth * 100;
  score += (details.culture / 5) * WEIGHTS.culture * 100;

  return Math.round(score);
}

export function OfferComparison() {
  const jobs = useJobStore((s) => s.jobs).filter((j) => j.status === "offer");
  const [offers, setOffers] = useState<Record<string, OfferDetails>>(() => {
    try {
      const raw = localStorage.getItem("resume-builder-offers");
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {};
  });

  const saveOffers = (data: Record<string, OfferDetails>) => {
    try {
      localStorage.setItem("resume-builder-offers", JSON.stringify(data));
    } catch { /* ignore */ }
    setOffers(data);
  };

  const updateOffer = (jobId: string, field: keyof OfferDetails, value: string | number) => {
    const updated = {
      ...offers,
      [jobId]: { ...((offers[jobId] as OfferDetails) || {}), [field]: value },
    };
    saveOffers(updated);
  };

  const getOffer = (jobId: string): OfferDetails => {
    return offers[jobId] || { salary: "", bonus: "", equity: "", remote: "", pto: "", benefits: "", growth: 3, culture: 3 };
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          <Scale size={24} className="mx-auto mb-2" />
          No offers yet. Move jobs to the "Offer" column in Job Tracker to compare them here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Scale size={18} />
          Offer Comparison
          <Badge variant="outline" className="ml-auto text-[10px]">{jobs.length} offers</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Criteria</th>
                {jobs.map((j) => (
                  <th key={j.id} className="text-left py-2 px-3 min-w-[160px]">
                    <div className="font-semibold">{j.company}</div>
                    <div className="text-xs text-muted-foreground">{j.role}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { key: "salary", label: "Base Salary", icon: <DollarSign size={12} />, placeholder: "$150k" },
                { key: "bonus", label: "Signing/Annual Bonus", icon: <DollarSign size={12} />, placeholder: "$20k" },
                { key: "equity", label: "Equity/RSUs", icon: <TrendingUp size={12} />, placeholder: "$50k" },
                { key: "remote", label: "Remote Policy", icon: <Home size={12} />, placeholder: "Hybrid" },
                { key: "pto", label: "PTO Days", icon: <Briefcase size={12} />, placeholder: "20" },
                { key: "benefits", label: "Key Benefits", icon: <Heart size={12} />, placeholder: "Health, 401k..." },
              ].map((field) => (
                <tr key={field.key}>
                  <td className="py-2 pr-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">{field.icon} {field.label}</span>
                  </td>
                  {jobs.map((j) => (
                    <td key={j.id} className="py-1.5 px-3">
                      <Input
                        value={getOffer(j.id)[field.key as keyof OfferDetails] as string}
                        onChange={(e) => updateOffer(j.id, field.key as keyof OfferDetails, e.target.value)}
                        placeholder={field.placeholder}
                        className="h-7 text-xs"
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-2 pr-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><TrendingUp size={12} /> Growth (1-5)</span>
                </td>
                {jobs.map((j) => (
                  <td key={j.id} className="py-1.5 px-3">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={getOffer(j.id).growth}
                      onChange={(e) => updateOffer(j.id, "growth", parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-[10px] text-center text-muted-foreground">{getOffer(j.id).growth}/5</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart size={12} /> Culture (1-5)</span>
                </td>
                {jobs.map((j) => (
                  <td key={j.id} className="py-1.5 px-3">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={getOffer(j.id).culture}
                      onChange={(e) => updateOffer(j.id, "culture", parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-[10px] text-center text-muted-foreground">{getOffer(j.id).culture}/5</div>
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 font-semibold">
                <td className="py-3 pr-4 text-xs">Score</td>
                {jobs.map((j) => {
                  const score = scoreOffer(getOffer(j.id));
                  return (
                    <td key={j.id} className="py-3 px-3">
                      <div className={`text-lg font-bold ${score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {score}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Scores are calculated from weighted criteria: Salary (25%), Equity (15%), Growth (15%), Bonus (10%), Remote (10%), Benefits (10%), Culture (10%), PTO (5%).
        </p>
      </CardContent>
    </Card>
  );
}
