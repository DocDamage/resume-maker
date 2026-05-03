import { useState } from "react";
import { useJobStore } from "@/stores/jobStore";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateATSScore } from "@/utils/atsScore";
import { aiChat } from "@/utils/aiEngine";
import { useAIStore } from "@/stores/aiStore";
import {
  Loader2, Target, ClipboardCopy, CheckCircle,
  Briefcase, Wand2,
} from "lucide-react";

interface KitResult {
  tailoredSummary: string;
  coverLetter: string;
  linkedinMessage: string;
  gaps: string[];
}

export function ApplicationKit() {
  const jobs = useJobStore((s) => s.jobs);
  const resume = useResumeStore((s) => s.resume);
  const provider = useAIStore((s) => s.provider);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KitResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleGenerate = async () => {
    if (!selectedJob) return;
    setLoading(true);

    const ats = calculateATSScore(resume, selectedJob.jobDescription);

    try {
      if (provider === "local") {
        setResult({
          tailoredSummary: `Experienced ${resume.personal.title} with a proven track record in ${resume.skills.flatMap((s) => s.skills).slice(0, 5).join(", ")}. Skilled in meeting the requirements for ${selectedJob.role} at ${selectedJob.company}.`,
          coverLetter: `Dear Hiring Manager,\n\nI am excited to apply for the ${selectedJob.role} position at ${selectedJob.company}. With my background as ${resume.personal.title} and expertise in ${resume.skills.flatMap((s) => s.skills).slice(0, 4).join(", ")}, I am confident I can contribute immediately.\n\n${resume.summary.slice(0, 200)}...\n\nI would welcome the opportunity to discuss how my skills align with your needs.\n\nBest regards,\n${resume.personal.fullName}`,
          linkedinMessage: `Hi, I recently applied for the ${selectedJob.role} position at ${selectedJob.company}. I'd love to learn more about the team and how I can contribute. Would you be open to a brief conversation?`,
          gaps: ats.missingKeywords.slice(0, 5),
        });
      } else {
        const prompt = `Generate a job application kit based on this resume and job description.

Resume: ${resume.personal.fullName}, ${resume.personal.title}. Summary: ${resume.summary}. Skills: ${resume.skills.flatMap((s) => s.skills).join(", ")}. Experience: ${resume.experience.map((e) => e.role + " at " + e.company).join("; ")}.

Job: ${selectedJob.role} at ${selectedJob.company}. JD: ${selectedJob.jobDescription.slice(0, 1500)}.

Missing keywords: ${ats.missingKeywords.slice(0, 8).join(", ")}.

Output ONLY JSON:
{"tailoredSummary":"2-sentence summary tailored to this job","coverLetter":"3-paragraph cover letter","linkedinMessage":"1-paragraph LinkedIn connection message","gaps":["missing keyword 1","missing keyword 2"]}`;

        const raw = await aiChat({
          system: "You are a career coach. Respond with valid JSON only.",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
        });
        const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setResult({
          tailoredSummary: parsed.tailoredSummary || "",
          coverLetter: parsed.coverLetter || "",
          linkedinMessage: parsed.linkedinMessage || "",
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ats.missingKeywords.slice(0, 5),
        });
      }
    } catch {
      setResult({
        tailoredSummary: resume.summary,
        coverLetter: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${selectedJob.role} position at ${selectedJob.company}.\n\n${resume.summary}\n\nBest regards,\n${resume.personal.fullName}`,
        linkedinMessage: `Hi! I recently applied for the ${selectedJob.role} role at ${selectedJob.company} and would love to connect and learn more about the team.`,
        gaps: ats.missingKeywords.slice(0, 5),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          <Briefcase size={24} className="mx-auto mb-2" />
          No tracked jobs yet. Add a job in the Job Tracker to generate an application kit.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase size={18} />
          Application Kit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate tailored application materials for any tracked job: summary, cover letter, LinkedIn message, and keyword gap report.
        </p>
        <div className="flex gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => { setSelectedJobId(e.target.value); setResult(null); }}
            className="flex-1 text-sm px-2 py-1.5 rounded border bg-background"
          >
            <option value="">Select a job...</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.role} at {j.company}</option>
            ))}
          </select>
          <Button size="sm" onClick={handleGenerate} disabled={!selectedJob || loading}>
            {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Wand2 size={14} className="mr-1" />}
            Generate
          </Button>
        </div>

        {result && selectedJob && (
          <div className="space-y-4">
            {/* Tailored Summary */}
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">Tailored Summary</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleCopy(result.tailoredSummary, "summary")}>
                  {copied === "summary" ? <CheckCircle size={12} className="mr-1 text-green-600" /> : <ClipboardCopy size={12} className="mr-1" />}
                  {copied === "summary" ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{result.tailoredSummary}</p>
            </div>

            {/* Cover Letter */}
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">Cover Letter</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleCopy(result.coverLetter, "letter")}>
                  {copied === "letter" ? <CheckCircle size={12} className="mr-1 text-green-600" /> : <ClipboardCopy size={12} className="mr-1" />}
                  {copied === "letter" ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.coverLetter}</p>
            </div>

            {/* LinkedIn Message */}
            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">LinkedIn Message</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleCopy(result.linkedinMessage, "li")}>
                  {copied === "li" ? <CheckCircle size={12} className="mr-1 text-green-600" /> : <ClipboardCopy size={12} className="mr-1" />}
                  {copied === "li" ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{result.linkedinMessage}</p>
            </div>

            {/* Keyword Gaps */}
            {result.gaps.length > 0 && (
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Target size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Keyword Gaps</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.gaps.map((g) => (
                    <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
