import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode, Download } from "lucide-react";

export function LaTeXExporter() {
  const resume = useResumeStore((s) => s.resume);
  const [includePhoto, setIncludePhoto] = useState(false);

  const generateLaTeX = (): string => {
    const escape = (s: string) =>
      s
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/~/g, "\\textasciitilde{}")
        .replace(/\^/g, "\\textasciicircum{}");

    const sections: string[] = [];

    // Document setup
    sections.push(`\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\definecolor{accent}{HTML}{${resume.accentColor.replace("#", "")}}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{6pt}

\\begin{document}
`);

    // Header
    sections.push(`
\\begin{center}
  {\\Huge\\bfseries\\textcolor{accent}{${escape(resume.personal.fullName)}}}\\[4pt]
  {\\large ${escape(resume.personal.title)}}\\[6pt]
  ${escape(resume.personal.email)} \\quad ${escape(resume.personal.phone)} \\quad ${escape(resume.personal.location)}\\[2pt]
  ${resume.personal.linkedin ? `\\href{https://${escape(resume.personal.linkedin.replace(/^https?:\/\//, ""))}}{${escape(resume.personal.linkedin)}}` : ""}
  ${resume.personal.website ? `\\quad \\href{${escape(resume.personal.website)}}{${escape(resume.personal.website)}}` : ""}
\\end{center}

\\vspace{4pt}
\\hrule height 1.5pt
\\vspace{8pt}
`);

    // Summary
    if (resume.summary) {
      sections.push(`
\\section*{Summary}
${escape(resume.summary)}

`);
    }

    // Experience
    if (resume.experience.length > 0) {
      sections.push(`
\\section*{Experience}
`);
      resume.experience.forEach((exp) => {
        sections.push(`
\\textbf{${escape(exp.role)}} \\hfill ${escape(exp.startDate)} -- ${exp.current ? "Present" : escape(exp.endDate)}\\\\
\\textit{${escape(exp.company)}}
\\begin{itemize}[leftmargin=1.2em, itemsep=1pt, topsep=3pt]
${exp.description.map((d) => `  \\item ${escape(d)}`).join("\n")}
\\end{itemize}
`);
      });
    }

    // Education
    if (resume.education.length > 0) {
      sections.push(`
\\section*{Education}
`);
      resume.education.forEach((edu) => {
        sections.push(`
\\textbf{${escape(edu.institution)}} \\hfill ${escape(edu.startDate)} -- ${escape(edu.endDate)}\\\\
${escape(edu.degree)} in ${escape(edu.field)}${edu.gpa ? ` (GPA: ${escape(edu.gpa)})` : ""}
`);
      });
    }

    // Skills
    if (resume.skills.length > 0) {
      sections.push(`
\\section*{Skills}
`);
      resume.skills.forEach((cat) => {
        sections.push(`
\\textbf{${escape(cat.category)}:} ${escape(cat.skills.join(", "))}
`);
      });
    }

    // Certifications
    if (resume.certifications.length > 0) {
      sections.push(`
\\section*{Certifications}
`);
      resume.certifications.forEach((cert) => {
        sections.push(`
\\textbf{${escape(cert.name)}} -- ${escape(cert.issuer)}${cert.date ? `, ${escape(cert.date)}` : ""}
`);
      });
    }

    // Projects
    if (resume.projects.length > 0) {
      sections.push(`
\\section*{Projects}
`);
      resume.projects.forEach((proj) => {
        sections.push(`
\\textbf{${escape(proj.name)}}${proj.link ? ` \\quad \\href{${escape(proj.link)}}{${escape(proj.link)}}` : ""}\\\\
${escape(proj.description)}
`);
      });
    }

    // Languages
    if (resume.languages.length > 0) {
      sections.push(`
\\section*{Languages}
${resume.languages.map((l) => `${escape(l.language)} (${escape(l.proficiency)})`).join(", ")}
`);
    }

    // References
    if (resume.references.length > 0) {
      sections.push(`
\\section*{References}
`);
      resume.references.forEach((ref) => {
        sections.push(`
\\textbf{${escape(ref.name)}} -- ${escape(ref.title)}, ${escape(ref.company)}
`);
      });
    }

    sections.push(`
\\end{document}
`);

    return sections.join("\n");
  };

  const handleDownload = () => {
    const tex = generateLaTeX();
    const blob = new Blob([tex], { type: "application/x-tex" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personal.fullName.replace(/\s+/g, "_")}_resume.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCode size={18} />
          LaTeX Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export a clean, professional LaTeX source file. Compile with pdfLaTeX or Overleaf.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includePhoto}
            onChange={(e) => setIncludePhoto(e.target.checked)}
            className="rounded border"
          />
          Include photo placeholder (commented)
        </label>
        <Button onClick={handleDownload} className="w-full">
          <Download size={16} className="mr-2" /> Download .tex File
        </Button>
        <div className="rounded-md border p-2 bg-muted/30 max-h-32 overflow-auto">
          <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap">{generateLaTeX().slice(0, 600)}...</pre>
        </div>
      </CardContent>
    </Card>
  );
}
