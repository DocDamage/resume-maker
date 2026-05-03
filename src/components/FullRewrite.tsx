import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumeStore } from "@/stores/resumeStore";
import { aiChat } from "@/utils/aiEngine";
import { Loader2, Wand2, CheckCircle } from "lucide-react";

export function FullRewrite() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const resume = useResumeStore((s) => s.resume);
  const loadResume = useResumeStore((s) => s.loadResume);

  const handleRewrite = async () => {
    setLoading(true);
    setDone(false);
    try {
      const prompt = `Rewrite and improve this entire resume. Make it more impactful with strong action verbs, quantified achievements, and professional language. Keep the same structure and factual information but elevate the writing. Output ONLY valid JSON matching this schema:

{"personal": {"fullName": "", "title": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": ""}, "summary": "", "experience": [{"company": "", "role": "", "startDate": "", "endDate": "", "current": false, "description": [""]}], "education": [{"institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": ""}], "skills": [{"category": "", "skills": [""]}], "projects": [{"name": "", "description": "", "link": ""}], "certifications": [{"name": "", "issuer": "", "date": "", "link": ""}], "languages": [{"language": "", "proficiency": "Native|Fluent|Conversational|Basic"}]}

Current resume JSON:\n${JSON.stringify(resume, null, 2)}`;

      const raw = await aiChat({
        system: "You are an elite resume writer. Improve every section while preserving facts.",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      const parsed = JSON.parse(raw);
      const improved: typeof resume = {
        ...resume,
        personal: { ...resume.personal, ...parsed.personal },
        summary: parsed.summary || resume.summary,
        experience: parsed.experience?.map((exp: { description: string[] }) => ({
          ...exp,
          id: crypto.randomUUID(),
          description: Array.isArray(exp.description) ? exp.description : [exp.description],
        })) || resume.experience,
        education: parsed.education?.map((edu: object) => ({ ...edu, id: crypto.randomUUID() })) || resume.education,
        skills: parsed.skills?.map((cat: object) => ({ ...cat, id: crypto.randomUUID() })) || resume.skills,
        projects: parsed.projects?.map((proj: object) => ({ ...proj, id: crypto.randomUUID() })) || resume.projects,
        certifications: parsed.certifications?.map((cert: object) => ({ ...cert, id: crypto.randomUUID() })) || resume.certifications,
        languages: parsed.languages?.map((lang: object) => ({ ...lang, id: crypto.randomUUID() })) || resume.languages,
      };
      loadResume(improved);
      setDone(true);
    } catch (err) {
      alert("Rewrite failed: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 size={20} />
          Full Resume Rewrite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          AI will rewrite your entire resume — summary, bullets, skills — with stronger language and quantified achievements. Facts are preserved.
        </p>
        <Button onClick={handleRewrite} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Wand2 size={16} className="mr-1" />}
          {loading ? "Rewriting..." : "Rewrite Everything"}
        </Button>
        {done && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={16} /> Resume rewritten successfully!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
