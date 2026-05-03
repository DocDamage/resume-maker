import type { Resume } from "@/types/resume";

export interface ATSScore {
  overall: number;
  categories: { name: string; score: number; message: string }[];
  keywords: string[];
  missingKeywords: string[];
  plainText: string;
}

export interface BulletAnalysis {
  text: string;
  hasMetric: boolean;
  hasPowerVerb: boolean;
  isPassive: boolean;
  isTooLong: boolean;
  wordCount: number;
  score: number; // 0-100
  suggestions: string[];
}

export function analyzeBullet(bullet: string): BulletAnalysis {
  const text = bullet.trim();
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Power verbs
  const powerVerbs = new Set([
    "led", "managed", "built", "created", "developed", "designed", "implemented",
    "launched", "spearheaded", "drove", "optimized", "improved", "increased",
    "decreased", "reduced", "accelerated", "engineered", "architected",
    "transformed", "revamped", "streamlined", "automated", "delivered",
    "achieved", "grew", "scaled", " mentored", "trained", "negotiated",
    "conducted", "performed", "executed", "oversaw", "directed", "coordinated",
    "collaborated", "partnered", "facilitated", "initiated", "pioneered",
    "generated", "produced", "secured", "won", "saved", "eliminated",
  ]);
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, "");
  const hasPowerVerb = firstWord ? powerVerbs.has(firstWord) : false;

  // Metrics
  const hasMetric = /\d+%?|\$\d+|\d+\+?\s*(x|times|fold)|\d+\s*(users|customers|clients|teams|people|members)/i.test(text);

  // Passive voice heuristics
  const passiveIndicators = /\b(was|were|been|being|is|are)\s+\w+ed\b|\b(has been|have been|had been)\s+\w+ed\b/i;
  const isPassive = passiveIndicators.test(text);

  // Length
  const isTooLong = wordCount > 25;

  // Score
  let score = 50;
  if (hasPowerVerb) score += 20;
  if (hasMetric) score += 20;
  if (!isPassive) score += 10;
  if (!isTooLong) score += 10;
  if (wordCount < 8) score -= 15;
  score = Math.max(0, Math.min(100, score));

  const suggestions: string[] = [];
  if (!hasPowerVerb) suggestions.push("Start with a strong action verb (e.g., Led, Built, Drove)");
  if (!hasMetric) suggestions.push("Add a number or percentage to quantify impact");
  if (isPassive) suggestions.push("Use active voice instead of passive");
  if (isTooLong) suggestions.push("Shorten to under 25 words for better scanability");
  if (wordCount < 8) suggestions.push("Expand to show more specific impact");

  return { text, hasMetric, hasPowerVerb, isPassive, isTooLong, wordCount, score, suggestions };
}

export function resumeToPlainText(resume: Resume): string {
  const parts: string[] = [];
  parts.push(resume.personal.fullName, resume.personal.title);
  parts.push(resume.summary);
  resume.experience.forEach((e) => {
    parts.push(e.company, e.role, ...e.description);
  });
  resume.education.forEach((e) => {
    parts.push(e.institution, e.degree, e.field);
  });
  resume.skills.forEach((s) => parts.push(...s.skills));
  resume.projects.forEach((p) => parts.push(p.name, p.description));
  resume.certifications.forEach((c) => parts.push(c.name, c.issuer));
  resume.languages.forEach((l) => parts.push(l.language));
  return parts.join(" ").toLowerCase();
}

export function calculateATSScore(
  resume: Resume,
  jobDescription: string = ""
): ATSScore {
  const plainText = resumeToPlainText(resume);
  const text = plainText;
  const categories: ATSScore["categories"] = [];

  // Contact info score
  const hasEmail = resume.personal.email.includes("@");
  const hasPhone = resume.personal.phone.length > 0;
  const contactScore = (hasEmail ? 50 : 0) + (hasPhone ? 50 : 0);
  categories.push({
    name: "Contact Info",
    score: contactScore,
    message: contactScore === 100 ? "Complete" : "Add missing contact details",
  });

  // Summary score
  const summaryWords = resume.summary.trim().split(/\s+/).length;
  const summaryScore = summaryWords > 30 ? 100 : summaryWords > 10 ? 60 : 30;
  categories.push({
    name: "Summary",
    score: summaryScore,
    message: summaryScore === 100 ? "Strong summary" : "Expand to 30+ words",
  });

  // Experience score
  const hasBulletQuantities = resume.experience.some((e) =>
    e.description.some((d) => /\d+%?|\$\d+|\d+\+?/.test(d))
  );
  const experienceScore =
    resume.experience.length >= 2 && hasBulletQuantities
      ? 100
      : resume.experience.length >= 1
      ? 70
      : 30;
  categories.push({
    name: "Experience",
    score: experienceScore,
    message: hasBulletQuantities
      ? "Good quantification"
      : "Add numbers/metrics to bullets",
  });

  // Skills score
  const totalSkills = resume.skills.reduce((acc, s) => acc + s.skills.length, 0);
  const skillsScore = totalSkills >= 10 ? 100 : totalSkills >= 5 ? 70 : 40;
  categories.push({
    name: "Skills",
    score: skillsScore,
    message: skillsScore === 100 ? "Good skill coverage" : "Add more skills",
  });

  // Length score
  const totalLength = text.split(/\s+/).length;
  const lengthScore = totalLength >= 300 && totalLength <= 700 ? 100 : totalLength < 300 ? 60 : 80;
  categories.push({
    name: "Length",
    score: lengthScore,
    message: totalLength < 300 ? "Too short" : totalLength > 700 ? "Consider condensing" : "Good length",
  });

  // Keyword analysis
  const keywords = extractKeywords(jobDescription);
  const missingKeywords = keywords.filter((k) => !text.includes(k));
  const keywordScore = keywords.length > 0 ? Math.round(((keywords.length - missingKeywords.length) / keywords.length) * 100) : 100;
  categories.push({
    name: "Keyword Match",
    score: keywordScore,
    message: keywordScore === 100 ? "Great match" : `Missing ${missingKeywords.length} keywords`,
  });

  const overall = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  return {
    overall,
    categories,
    keywords,
    missingKeywords,
    plainText: plainText.replace(/\s+/g, " ").slice(0, 2000),
  };
}

function extractKeywords(text: string): string[] {
  if (!text.trim()) return [];
  const common = new Set([
    "the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","day","get","has","him","his","how","its","may","new","now","old","see","two","way","who","boy","did","she","use","her","than","them","well","were","with","have","from","they","know","want","been","good","much","some","time","very","when","come","here","just","like","long","make","many","over","such","take","than","them","well","were","what","will","would","there","should","could","about","after","back","other","many","then","these","work","first","also","each","which","their","said","even","more","only","most","into","year","your","word","where","being","every","great","might","shall","still","those","while","without","within","through","during","before","after","above","below","between","under","again","further","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","can","will","just","don","should","now","is","are","was","were","be","been","being","have","has","had","do","does","did","a","an","the","this","that","these","those","i","me","my","myself","we","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","whose","am","of","to","in","on","at","by","up","off","over","out","down","away","on","off","over","under","again","further","then","once"
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !common.has(w));
  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([w]) => w);
}
