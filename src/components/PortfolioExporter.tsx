import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Globe, Code } from "lucide-react";

export function PortfolioExporter() {
  const resume = useResumeStore((s) => s.resume);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const generateHTML = (): string => {
    const accent = resume.accentColor;
    const bg = darkMode ? "#0f172a" : "#ffffff";
    const text = darkMode ? "#e2e8f0" : "#1e293b";
    const muted = darkMode ? "#94a3b8" : "#64748b";
    const cardBg = darkMode ? "#1e293b" : "#f8fafc";

    const sections: string[] = [];

    // Header
    sections.push(`
      <header style="text-align:center;padding:60px 20px 40px;border-bottom:3px solid ${accent};">
        ${includePhoto && resume.photoUrl ? `<img src="${resume.photoUrl}" alt="${resume.personal.fullName}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:20px;border:4px solid ${accent};" />` : ""}
        <h1 style="font-size:42px;font-weight:800;margin:0;color:${accent};letter-spacing:-1px;">${resume.personal.fullName}</h1>
        <p style="font-size:18px;color:${muted};margin-top:8px;font-weight:500;">${resume.personal.title}</p>
        ${includeContact ? `
        <div style="margin-top:16px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap;font-size:14px;color:${muted};">
          ${resume.personal.email ? `<a href="mailto:${resume.personal.email}" style="color:${accent};text-decoration:none;">${resume.personal.email}</a>` : ""}
          ${resume.personal.phone ? `<span>${resume.personal.phone}</span>` : ""}
          ${resume.personal.location ? `<span>${resume.personal.location}</span>` : ""}
          ${resume.personal.website ? `<a href="${resume.personal.website}" style="color:${accent};text-decoration:none;" target="_blank">Website</a>` : ""}
          ${resume.personal.linkedin ? `<a href="https://${resume.personal.linkedin.replace(/^https?:\/\//, "")}" style="color:${accent};text-decoration:none;" target="_blank">LinkedIn</a>` : ""}
        </div>` : ""}
      </header>
    `);

    // Summary
    if (resume.summary) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:16px;font-weight:700;">About</h2>
          <p style="line-height:1.7;color:${text};font-size:16px;">${resume.summary}</p>
        </section>
      `);
    }

    // Experience
    if (resume.experience.length > 0) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:24px;font-weight:700;">Experience</h2>
          <div style="display:flex;flex-direction:column;gap:28px;">
            ${resume.experience.map((exp) => `
              <div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;">
                  <h3 style="font-size:18px;font-weight:700;margin:0;color:${text};">${exp.role}</h3>
                  <span style="font-size:13px;color:${muted};font-weight:500;">${exp.startDate} – ${exp.current ? "Present" : exp.endDate}</span>
                </div>
                <p style="color:${accent};font-weight:600;margin:4px 0 10px;font-size:15px;">${exp.company}</p>
                <ul style="margin:0;padding-left:20px;color:${text};line-height:1.7;">
                  ${exp.description.map((d) => `<li style="margin-bottom:6px;">${d}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>
        </section>
      `);
    }

    // Skills
    if (resume.skills.length > 0) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:24px;font-weight:700;">Skills</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${resume.skills.map((cat) => `
              <div>
                <span style="font-weight:700;color:${text};font-size:14px;">${cat.category}: </span>
                <span style="color:${muted};font-size:14px;">${cat.skills.join(", ")}</span>
              </div>
            `).join("")}
          </div>
        </section>
      `);
    }

    // Projects
    if (includeProjects && resume.projects.length > 0) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:24px;font-weight:700;">Projects</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
            ${resume.projects.map((proj) => `
              <div style="background:${cardBg};padding:20px;border-radius:8px;border:1px solid ${darkMode ? "#334155" : "#e2e8f0"};">
                <h3 style="font-size:16px;font-weight:700;margin:0 0 8px;color:${text};">${proj.name}</h3>
                <p style="font-size:14px;color:${muted};line-height:1.6;margin-bottom:10px;">${proj.description}</p>
                ${proj.link ? `<a href="${proj.link}" target="_blank" style="color:${accent};font-size:13px;font-weight:600;text-decoration:none;">View Project →</a>` : ""}
              </div>
            `).join("")}
          </div>
        </section>
      `);
    }

    // Education
    if (resume.education.length > 0) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:24px;font-weight:700;">Education</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${resume.education.map((edu) => `
              <div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <h3 style="font-size:16px;font-weight:700;margin:0;color:${text};">${edu.institution}</h3>
                  <span style="font-size:13px;color:${muted};">${edu.startDate} – ${edu.endDate}</span>
                </div>
                <p style="color:${muted};margin:4px 0 0;font-size:14px;">${edu.degree} in ${edu.field}${edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</p>
              </div>
            `).join("")}
          </div>
        </section>
      `);
    }

    // Certifications
    if (resume.certifications.length > 0) {
      sections.push(`
        <section style="padding:40px 20px;max-width:720px;margin:0 auto;">
          <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};margin-bottom:24px;font-weight:700;">Certifications</h2>
          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            ${resume.certifications.map((cert) => `
              <span style="background:${cardBg};padding:8px 14px;border-radius:20px;font-size:13px;color:${text};border:1px solid ${darkMode ? "#334155" : "#e2e8f0"};">
                <strong>${cert.name}</strong> — ${cert.issuer}
              </span>
            `).join("")}
          </div>
        </section>
      `);
    }

    // Footer
    sections.push(`
      <footer style="text-align:center;padding:40px 20px;color:${muted};font-size:13px;border-top:1px solid ${darkMode ? "#334155" : "#e2e8f0"};margin-top:20px;">
        <p>Generated by Resume Maker</p>
      </footer>
    `);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.personal.fullName} — ${resume.personal.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${bg}; color: ${text}; line-height: 1.6; }
    a:hover { text-decoration: underline !important; }
    @media print { body { background: #fff !important; color: #000 !important; } }
  </style>
</head>
<body>
  ${sections.join("\n")}
</body>
</html>`;
  };

  const handleDownload = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personal.fullName.replace(/\s+/g, "-")}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe size={18} />
          Portfolio Site Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate a single HTML file you can host on GitHub Pages, Netlify, or any static host.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includePhoto} onChange={(e) => setIncludePhoto(e.target.checked)} />
            Include photo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includeProjects} onChange={(e) => setIncludeProjects(e.target.checked)} />
            Include projects
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={includeContact} onChange={(e) => setIncludeContact(e.target.checked)} />
            Include contact
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            Dark mode
          </label>
        </div>
        <Button onClick={handleDownload} className="w-full">
          <Code size={16} className="mr-2" /> Download Portfolio HTML
        </Button>
      </CardContent>
    </Card>
  );
}
