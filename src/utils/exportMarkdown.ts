import type { Resume } from "@/types/resume";

export function exportToMarkdown(resume: Resume): string {
  const lines: string[] = [];

  lines.push(`# ${resume.personal.fullName}`);
  lines.push(`**${resume.personal.title}**`);
  lines.push("");

  const contacts = [
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.website,
    resume.personal.linkedin,
  ].filter(Boolean);
  if (contacts.length) lines.push(contacts.join(" | "), "");

  if (resume.summary && resume.visibility.summary !== false) {
    lines.push("## Summary", "", resume.summary, "");
  }

  if (resume.experience.length && resume.visibility.experience !== false) {
    lines.push("## Experience", "");
    resume.experience.forEach((exp) => {
      lines.push(`### ${exp.role} — ${exp.company}`);
      lines.push(`*${exp.startDate} – ${exp.current ? "Present" : exp.endDate}*`);
      exp.description.forEach((d) => lines.push(`- ${d}`));
      lines.push("");
    });
  }

  if (resume.education.length && resume.visibility.education !== false) {
    lines.push("## Education", "");
    resume.education.forEach((edu) => {
      lines.push(`### ${edu.institution}`);
      lines.push(`${edu.degree} in ${edu.field}`);
      lines.push(`*${edu.startDate} – ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}*`);
      lines.push("");
    });
  }

  if (resume.certifications.length && resume.visibility.certifications !== false) {
    lines.push("## Certifications", "");
    resume.certifications.forEach((c) => lines.push(`- **${c.name}** — ${c.issuer}${c.date ? `, ${c.date}` : ""}`));
    lines.push("");
  }

  if (resume.languages.length && resume.visibility.languages !== false) {
    lines.push("## Languages", "");
    resume.languages.forEach((l) => lines.push(`- ${l.language} (${l.proficiency})`));
    lines.push("");
  }

  if (resume.skills.length && resume.visibility.skills !== false) {
    lines.push("## Skills", "");
    resume.skills.forEach((cat) => lines.push(`- **${cat.category}:** ${cat.skills.join(", ")}`));
    lines.push("");
  }

  if (resume.projects.length && resume.visibility.projects !== false) {
    lines.push("## Projects", "");
    resume.projects.forEach((p) => {
      lines.push(`### ${p.name}${p.link ? ` ([link](${p.link}))` : ""}`);
      lines.push(p.description);
      lines.push("");
    });
  }

  if (resume.awards.length && resume.visibility.awards !== false) {
    lines.push("## Awards", "");
    resume.awards.forEach((a) => lines.push(`- **${a.title}** — ${a.issuer}${a.date ? `, ${a.date}` : ""}`));
    lines.push("");
  }

  if (resume.volunteer.length && resume.visibility.volunteer !== false) {
    lines.push("## Volunteer Work", "");
    resume.volunteer.forEach((v) => {
      lines.push(`### ${v.role} — ${v.organization}`);
      lines.push(`*${v.startDate} – ${v.current ? "Present" : v.endDate}*`);
      v.description.forEach((d) => lines.push(`- ${d}`));
      lines.push("");
    });
  }

  if (resume.references.length && resume.visibility.references !== false) {
    lines.push("## References", "");
    resume.references.forEach((r) => {
      lines.push(`- **${r.name}** — ${r.title}, ${r.company}${r.email ? ` | ${r.email}` : ""}${r.phone ? ` | ${r.phone}` : ""}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}
