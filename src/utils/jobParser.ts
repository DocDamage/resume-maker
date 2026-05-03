import type { JobSource } from "@/types/job";

export function detectJobSource(url: string): JobSource {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("indeed")) return "indeed";
    if (hostname.includes("monster")) return "monster";
    if (hostname.includes("linkedin")) return "linkedin";
    if (hostname.includes("greenhouse")) return "greenhouse";
    if (hostname.includes("lever")) return "lever";
    if (hostname.includes("workday")) return "workday";
    return "other";
  } catch {
    return "other";
  }
}

export function extractSalary(text: string): string | undefined {
  const patterns = [
    /\$\d{2,3}[kK]?\s*-\s*\$?\d{2,3}[kK]?/,
    /\$\d{2,3},\d{3}\s*-\s*\$?\d{2,3},\d{3}/,
    /£\d{2,3}[kK]?\s*-\s*£?\d{2,3}[kK]?/,
    /€\d{2,3}[kK]?\s*-\s*€?\d{2,3}[kK]?/,
    /\d{2,3}[kK]?\s*-\s*\d{2,3}[kK]?\s*(USD|EUR|GBP|\$)/i,
    /(?:salary|compensation|pay)\s*[:\-]?\s*\$?\d+/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0];
  }
  return undefined;
}

export function extractLocation(text: string): string | undefined {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  // Heuristic: look for "Location:" or city/state patterns near the top
  for (const line of lines.slice(0, 15)) {
    const locMatch = line.match(/(?:location|based in|office in|headquartered in)[:\s]+(.{3,60})/i);
    if (locMatch) return locMatch[1].trim();
  }
  // City, ST or City, State patterns
  for (const line of lines.slice(0, 10)) {
    const cityMatch = line.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*(?:[A-Z]{2}|[A-Za-z\s]+))/);
    if (cityMatch) return cityMatch[1].trim();
  }
  return undefined;
}

export function detectRemote(text: string): "onsite" | "hybrid" | "remote" | "unknown" {
  const t = text.toLowerCase();
  if (t.includes("fully remote") || t.includes("100% remote") || t.includes("work from home")) return "remote";
  if (t.includes("hybrid")) return "hybrid";
  if (t.includes("on-site") || t.includes("onsite") || t.includes("in office") || t.includes("in-person")) return "onsite";
  return "unknown";
}

export function extractCompanyAndRole(text: string): { company?: string; role?: string } {
  const lines = text.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  // First substantial line is often the role or company
  let role: string | undefined;
  let company: string | undefined;

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    if (!role && line.length > 5 && line.length < 80 && !line.match(/^(apply|save|report|share|date|location|salary)/i)) {
      role = line;
      continue;
    }
    if (role && !company && line.length > 2 && line.length < 60) {
      company = line;
      break;
    }
  }
  return { company, role };
}

export function extractDeadline(text: string): string | undefined {
  const patterns = [
    /(?:apply by|deadline|closes? on|applications? close|submit by)[:\s]+(\w+\s+\d{1,2}(?:,\s+\d{4})?)/i,
    /(?:apply by|deadline|closes? on|applications? close|submit by)[:\s]+(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i,
    /(?:apply by|deadline|closes? on|applications? close|submit by)[:\s]+(\d{4}-\d{2}-\d{2})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return undefined;
}

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - then.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr: string): number | null {
  const then = new Date(dateStr);
  const now = new Date();
  if (isNaN(then.getTime())) return null;
  const diff = then.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
