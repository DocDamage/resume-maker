import { useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Suggestion {
  id: string;
  type: "error" | "warning" | "tip";
  message: string;
  section?: string;
  action?: string;
}

export function SmartSuggestionsPanel() {
  const resume = useResumeStore((s) => s.resume);

  const suggestions = useMemo<Suggestion[]>(() => {
    const list: Suggestion[] = [];

    // Contact
    if (!resume.personal.email.includes("@")) {
      list.push({ id: "contact-email", type: "error", message: "Add a valid email address", section: "personal", action: "Go to Personal Info" });
    }
    if (!resume.personal.phone.trim()) {
      list.push({ id: "contact-phone", type: "warning", message: "Add a phone number — many recruiters prefer calling", section: "personal" });
    }
    if (!resume.personal.linkedin?.trim()) {
      list.push({ id: "contact-linkedin", type: "tip", message: "Add your LinkedIn URL — 87% of recruiters check it", section: "personal" });
    }

    // Summary
    const summaryWords = resume.summary.trim().split(/\s+/).length;
    if (summaryWords < 20) {
      list.push({ id: "summary-short", type: "warning", message: `Summary is only ${summaryWords} words — expand to 30-50 for ATS`, section: "summary" });
    }
    if (summaryWords > 80) {
      list.push({ id: "summary-long", type: "tip", message: `Summary is ${summaryWords} words — consider condensing to under 60`, section: "summary" });
    }
    if (!/\d|%|\$/.test(resume.summary)) {
      list.push({ id: "summary-metric", type: "tip", message: "Add a metric to your summary (e.g., '6+ years', '40% improvement')", section: "summary" });
    }

    // Experience
    if (resume.experience.length === 0) {
      list.push({ id: "exp-missing", type: "error", message: "Add at least one work experience entry", section: "experience" });
    } else {
      const hasMetrics = resume.experience.some((e) =>
        e.description.some((d) => /\d+%?|\$\d+|\d+\+?/.test(d))
      );
      if (!hasMetrics) {
        list.push({ id: "exp-metrics", type: "warning", message: "None of your experience bullets include numbers — add metrics to stand out", section: "experience" });
      }
      const shortBullets = resume.experience.flatMap((e) =>
        e.description.filter((d) => d.split(/\s+/).length < 6)
      );
      if (shortBullets.length > 0) {
        list.push({ id: "exp-short", type: "tip", message: `${shortBullets.length} bullet(s) are very short — expand with more context`, section: "experience" });
      }
    }

    // Skills
    const totalSkills = resume.skills.reduce((acc, s) => acc + s.skills.length, 0);
    if (totalSkills < 5) {
      list.push({ id: "skills-low", type: "warning", message: `Only ${totalSkills} skills listed — aim for 10+ across categories`, section: "skills" });
    }
    const skillNames = resume.skills.flatMap((s) => s.skills.map((sk) => sk.toLowerCase()));
    if (skillNames.some((s) => s.includes("aws") || s.includes("azure") || s.includes("gcp")) && resume.certifications.length === 0) {
      list.push({ id: "cert-cloud", type: "tip", message: "You list cloud skills but have no certifications — consider adding AWS/Azure certs", section: "certifications" });
    }

    // Education
    if (resume.education.length === 0) {
      list.push({ id: "edu-missing", type: "warning", message: "No education section — add even bootcamps or online courses", section: "education" });
    }

    // Projects
    if (resume.projects.length === 0 && resume.experience.length < 2) {
      list.push({ id: "proj-suggest", type: "tip", message: "With limited experience, adding 1-2 projects can strengthen your resume", section: "projects" });
    }

    // Languages
    if (resume.languages.length === 0 && resume.skills.some((s) => s.skills.some((sk) => sk.toLowerCase().includes("international") || sk.toLowerCase().includes("global")))) {
      list.push({ id: "lang-suggest", type: "tip", message: "You mention global/international work — add languages you speak", section: "languages" });
    }

    // Photo
    if (!resume.photoUrl && ["modern", "sidebar", "creative"].includes(resume.template)) {
      list.push({ id: "photo-suggest", type: "tip", message: `Your ${resume.template} template has space for a photo — consider adding one`, section: "personal" });
    }

    return list;
  }, [resume]);

  const counts = {
    error: suggestions.filter((s) => s.type === "error").length,
    warning: suggestions.filter((s) => s.type === "warning").length,
    tip: suggestions.filter((s) => s.type === "tip").length,
  };

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
          <p className="font-medium">Your resume looks great!</p>
          <p className="text-sm text-muted-foreground">No suggestions right now.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb size={18} />
          Smart Suggestions
          <div className="flex gap-1 ml-auto">
            {counts.error > 0 && <Badge variant="destructive" className="text-[10px]">{counts.error}</Badge>}
            {counts.warning > 0 && <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-800">{counts.warning}</Badge>}
            {counts.tip > 0 && <Badge variant="outline" className="text-[10px]">{counts.tip}</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className={`flex items-start gap-2 p-2.5 rounded-md text-sm ${
              s.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : s.type === "warning"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {s.type === "error" ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
            ) : s.type === "warning" ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-yellow-600" />
            ) : (
              <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
            )}
            <div className="flex-1">
              <p>{s.message}</p>
              {s.section && (
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {s.section}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
