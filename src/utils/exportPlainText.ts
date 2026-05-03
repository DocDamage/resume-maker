import type { Resume } from "@/types/resume";

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function exportToPlainText(resume: Resume): string {
  const lines: string[] = [];
  const visible = (key: string) => resume.visibility[key] !== false;

  lines.push(resume.personal.fullName.toUpperCase());
  if (resume.personal.title) lines.push(resume.personal.title);

  const contacts: string[] = [];
  if (resume.personal.email) contacts.push(resume.personal.email);
  if (resume.personal.phone) contacts.push(resume.personal.phone);
  if (resume.personal.location) contacts.push(resume.personal.location);
  if (resume.personal.linkedin) contacts.push(resume.personal.linkedin);
  if (resume.personal.website) contacts.push(resume.personal.website);
  if (contacts.length) lines.push(contacts.join(" | "));

  lines.push("");

  if (visible("summary") && resume.summary) {
    lines.push("SUMMARY");
    lines.push(stripHtml(resume.summary));
    lines.push("");
  }

  if (visible("experience") && resume.experience.length > 0) {
    lines.push("EXPERIENCE");
    for (const exp of resume.experience) {
      lines.push(`${exp.role} - ${exp.company}`);
      lines.push(`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`);
      for (const d of exp.description) {
        const clean = stripHtml(d).trim();
        if (clean) lines.push(`  • ${clean}`);
      }
      lines.push("");
    }
  }

  if (visible("education") && resume.education.length > 0) {
    lines.push("EDUCATION");
    for (const edu of resume.education) {
      lines.push(`${edu.institution} — ${edu.degree} in ${edu.field}`);
      lines.push(`${edu.startDate} – ${edu.endDate}${edu.gpa ? ` (GPA: ${edu.gpa})` : ""}`);
      lines.push("");
    }
  }

  if (visible("skills") && resume.skills.length > 0) {
    lines.push("SKILLS");
    for (const cat of resume.skills) {
      lines.push(`${cat.category}: ${cat.skills.join(", ")}`);
    }
    lines.push("");
  }

  if (visible("projects") && resume.projects.length > 0) {
    lines.push("PROJECTS");
    for (const proj of resume.projects) {
      lines.push(`${proj.name}${proj.link ? ` (${proj.link})` : ""}`);
      const clean = stripHtml(proj.description).trim();
      if (clean) lines.push(`  ${clean}`);
      lines.push("");
    }
  }

  if (visible("certifications") && resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    for (const cert of resume.certifications) {
      lines.push(`${cert.name} — ${cert.issuer}${cert.date ? `, ${cert.date}` : ""}`);
    }
    lines.push("");
  }

  if (visible("languages") && resume.languages.length > 0) {
    lines.push("LANGUAGES");
    for (const lang of resume.languages) {
      lines.push(`${lang.language} (${lang.proficiency})`);
    }
    lines.push("");
  }

  if (visible("awards") && resume.awards.length > 0) {
    lines.push("AWARDS");
    for (const a of resume.awards) {
      lines.push(`${a.title} — ${a.issuer}${a.date ? `, ${a.date}` : ""}`);
    }
    lines.push("");
  }

  if (visible("volunteer") && resume.volunteer.length > 0) {
    lines.push("VOLUNTEER WORK");
    for (const v of resume.volunteer) {
      lines.push(`${v.role} — ${v.organization}`);
      lines.push(`${v.startDate} – ${v.current ? "Present" : v.endDate}`);
      lines.push("");
    }
  }

  if (visible("references") && resume.references.length > 0) {
    lines.push("REFERENCES");
    for (const ref of resume.references) {
      lines.push(`${ref.name} — ${ref.title}, ${ref.company}`);
    }
    lines.push("");
  }

  for (const cs of resume.customSections) {
    if (visible(cs.id) && cs.items.length > 0) {
      lines.push(cs.name.toUpperCase());
      for (const item of cs.items) {
        let line = item.title;
        if (item.subtitle) line += ` — ${item.subtitle}`;
        if (item.date) line += ` (${item.date})`;
        lines.push(line);
        if (item.description) lines.push(`  ${stripHtml(item.description).trim()}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
