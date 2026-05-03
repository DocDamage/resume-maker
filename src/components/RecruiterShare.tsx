import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { encodeResumeToUrl } from "@/utils/shareLink";
import { Share2, CheckCircle, FileText, Eye } from "lucide-react";

export function RecruiterShare() {
  const resume = useResumeStore((s) => s.resume);
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(() => {
    try {
      return parseInt(localStorage.getItem(`resume-views-${resume.id}`) || "0");
    } catch { return 0; }
  });

  const shareUrl = encodeResumeToUrl(resume);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Increment view counter for demo
      const newViews = views + 1;
      setViews(newViews);
      try { localStorage.setItem(`resume-views-${resume.id}`, String(newViews)); } catch {}
    });
  };

  const generateRecruiterHTML = (): string => {
    const accent = resume.accentColor;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${resume.personal.fullName} — Resume</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, serif; background:#fff; color:#1a1a1a; line-height:1.6; max-width:800px; margin:0 auto; padding:48px 32px; }
  h1 { font-size:28px; font-weight:700; margin-bottom:4px; color:${accent}; }
  .subtitle { font-size:15px; color:#555; margin-bottom:12px; font-weight:600; }
  .contact { font-size:13px; color:#666; margin-bottom:32px; }
  .contact a { color:${accent}; text-decoration:none; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:1.5px; color:#333; border-bottom:2px solid ${accent}; padding-bottom:4px; margin:28px 0 14px; font-weight:700; }
  .entry { margin-bottom:18px; }
  .entry-header { display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:8px; }
  .entry-title { font-weight:700; font-size:14px; }
  .entry-company { color:#555; font-size:14px; }
  .entry-date { font-size:12px; color:#888; white-space:nowrap; }
  ul { margin:6px 0 0 18px; }
  li { font-size:13px; margin-bottom:3px; }
  .skills { font-size:13px; }
  .skills strong { font-weight:700; }
  .project { margin-bottom:10px; }
  .project-name { font-weight:700; font-size:14px; }
  @media print { body { padding:0; } }
</style>
</head>
<body>
  <h1>${resume.personal.fullName}</h1>
  <div class="subtitle">${resume.personal.title}</div>
  <div class="contact">
    ${resume.personal.email} ${resume.personal.phone ? "| " + resume.personal.phone : ""}
    ${resume.personal.location ? "| " + resume.personal.location : ""}
    ${resume.personal.linkedin ? "| <a href='https://" + resume.personal.linkedin.replace(/^https?:\/\//, "") + "'>LinkedIn</a>" : ""}
    ${resume.personal.website ? "| <a href='" + resume.personal.website + "'>Website</a>" : ""}
  </div>

  ${resume.summary ? `<h2>Summary</h2><p style="font-size:13px;">${resume.summary}</p>` : ""}

  ${resume.experience.length > 0 ? `
  <h2>Experience</h2>
  ${resume.experience.map(e => `
    <div class="entry">
      <div class="entry-header">
        <span><span class="entry-title">${e.role}</span> <span class="entry-company">— ${e.company}</span></span>
        <span class="entry-date">${e.startDate} – ${e.current ? "Present" : e.endDate}</span>
      </div>
      <ul>${e.description.map(d => `<li>${d}</li>`).join("")}</ul>
    </div>
  `).join("")}
  ` : ""}

  ${resume.education.length > 0 ? `
  <h2>Education</h2>
  ${resume.education.map(e => `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${e.institution}</span>
        <span class="entry-date">${e.startDate} – ${e.endDate}</span>
      </div>
      <p style="font-size:13px;color:#555;">${e.degree} in ${e.field}${e.gpa ? " (GPA: " + e.gpa + ")" : ""}</p>
    </div>
  `).join("")}
  ` : ""}

  ${resume.skills.length > 0 ? `
  <h2>Skills</h2>
  <div class="skills">
    ${resume.skills.map(s => `<div><strong>${s.category}:</strong> ${s.skills.join(", ")}</div>`).join("")}
  </div>
  ` : ""}

  ${resume.certifications.length > 0 ? `
  <h2>Certifications</h2>
  <ul>
    ${resume.certifications.map(c => `<li>${c.name} — ${c.issuer}${c.date ? ", " + c.date : ""}</li>`).join("")}
  </ul>
  ` : ""}

  ${resume.projects.length > 0 ? `
  <h2>Projects</h2>
  ${resume.projects.map(p => `
    <div class="project">
      <span class="project-name">${p.name}</span>
      ${p.link ? `<span style="font-size:12px;color:#666;"> — ${p.link}</span>` : ""}
      <p style="font-size:13px;color:#555;margin-top:2px;">${p.description}</p>
    </div>
  `).join("")}
  ` : ""}

  ${resume.languages.length > 0 ? `
  <h2>Languages</h2>
  <p style="font-size:13px;">${resume.languages.map(l => l.language + " (" + l.proficiency + ")").join(", ")}</p>
  ` : ""}

  ${resume.references.length > 0 ? `
  <h2>References</h2>
  <ul>
    ${resume.references.map(r => `<li><strong>${r.name}</strong> — ${r.title}, ${r.company}</li>`).join("")}
  </ul>
  ` : ""}
</body>
</html>`;
  };

  const handleDownload = () => {
    const html = generateRecruiterHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personal.fullName.replace(/\s+/g, "-")}-resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 size={18} />
          Recruiter Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
            {copied ? <CheckCircle size={14} className="mr-2 text-green-600" /> : <Share2 size={14} className="mr-2" />}
            {copied ? "Copied!" : "Copy Share Link"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
            <FileText size={14} className="mr-2" /> Download HTML
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye size={12} />
          {views} view{views !== 1 ? "s" : ""} tracked
        </div>

        <div className="rounded-md border p-3 bg-muted/30">
          <p className="text-xs text-muted-foreground break-all">{shareUrl.slice(0, 120)}...</p>
        </div>
      </CardContent>
    </Card>
  );
}
