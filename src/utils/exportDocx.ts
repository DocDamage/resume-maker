import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import type { Resume } from "@/types/resume";

export async function exportToDOCX(resume: Resume): Promise<Blob> {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: resume.personal.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: resume.personal.title,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  const contactParts = [
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.website,
    resume.personal.linkedin,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        text: contactParts.join("  |  "),
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  if (resume.summary && resume.visibility.summary !== false) {
    children.push(sectionHeader("Summary"));
    children.push(new Paragraph({ text: resume.summary, spacing: { after: 200 } }));
  }

  if (resume.experience.length > 0 && resume.visibility.experience !== false) {
    children.push(sectionHeader("Experience"));
    resume.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true }),
            new TextRun({ text: `  —  ${exp.company}` }),
          ],
          spacing: { after: 50 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`, italics: true })],
          spacing: { after: 100 },
        })
      );
      exp.description.forEach((d) => {
        children.push(new Paragraph({ text: `• ${d}`, spacing: { after: 50 } }));
      });
      children.push(new Paragraph({ spacing: { after: 150 } }));
    });
  }

  if (resume.education.length > 0 && resume.visibility.education !== false) {
    children.push(sectionHeader("Education"));
    resume.education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true }),
            new TextRun({ text: `  —  ${edu.degree} in ${edu.field}` }),
          ],
          spacing: { after: 50 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.startDate} – ${edu.endDate}${edu.gpa ? `  |  GPA: ${edu.gpa}` : ""}`,
              italics: true,
            }),
          ],
          spacing: { after: 150 },
        })
      );
    });
  }

  if (resume.certifications.length > 0 && resume.visibility.certifications !== false) {
    children.push(sectionHeader("Certifications"));
    resume.certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun({ text: `  —  ${cert.issuer}${cert.date ? `, ${cert.date}` : ""}` }),
          ],
          spacing: { after: 50 },
        })
      );
    });
  }

  if (resume.languages.length > 0 && resume.visibility.languages !== false) {
    children.push(sectionHeader("Languages"));
    const langs = resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ");
    children.push(new Paragraph({ text: langs, spacing: { after: 200 } }));
  }

  if (resume.skills.length > 0 && resume.visibility.skills !== false) {
    children.push(sectionHeader("Skills"));
    resume.skills.forEach((cat) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${cat.category}: `, bold: true }),
            new TextRun({ text: cat.skills.join(", ") }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  if (resume.projects.length > 0 && resume.visibility.projects !== false) {
    children.push(sectionHeader("Projects"));
    resume.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            new TextRun({ text: proj.link ? `  —  ${proj.link}` : "" }),
          ],
          spacing: { after: 50 },
        })
      );
      children.push(new Paragraph({ text: proj.description, spacing: { after: 150 } }));
    });
  }

  if (resume.awards.length > 0 && resume.visibility.awards !== false) {
    children.push(sectionHeader("Awards"));
    resume.awards.forEach((a) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: a.title, bold: true }),
            new TextRun({ text: `  —  ${a.issuer}${a.date ? `, ${a.date}` : ""}` }),
          ],
          spacing: { after: 50 },
        })
      );
      if (a.description) children.push(new Paragraph({ text: a.description, spacing: { after: 100 } }));
    });
  }

  if (resume.volunteer.length > 0 && resume.visibility.volunteer !== false) {
    children.push(sectionHeader("Volunteer Work"));
    resume.volunteer.forEach((v) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: v.role, bold: true }),
            new TextRun({ text: `  —  ${v.organization}` }),
          ],
          spacing: { after: 50 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${v.startDate} – ${v.current ? "Present" : v.endDate}`, italics: true })],
          spacing: { after: 100 },
        })
      );
      v.description.forEach((d) => {
        children.push(new Paragraph({ text: `• ${d}`, spacing: { after: 50 } }));
      });
      children.push(new Paragraph({ spacing: { after: 150 } }));
    });
  }

  if (resume.references.length > 0 && resume.visibility.references !== false) {
    children.push(sectionHeader("References"));
    resume.references.forEach((ref) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: ref.name, bold: true }),
            new TextRun({ text: `  —  ${ref.title}, ${ref.company}` }),
          ],
          spacing: { after: 50 },
        })
      );
      const parts = [ref.email, ref.phone].filter(Boolean);
      if (parts.length) {
        children.push(new Paragraph({ text: parts.join(" | "), spacing: { after: 100 } }));
      }
    });
  }

  resume.customSections.forEach((cs) => {
    if (resume.visibility[cs.id] === false || cs.items.length === 0) return;
    children.push(sectionHeader(cs.name));
    cs.items.forEach((item) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.title, bold: true }),
            new TextRun({ text: item.subtitle ? `  —  ${item.subtitle}` : "" }),
          ],
          spacing: { after: 50 },
        })
      );
      if (item.date) children.push(new Paragraph({ children: [new TextRun({ text: item.date, italics: true })], spacing: { after: 50 } }));
      if (item.description) children.push(new Paragraph({ text: item.description, spacing: { after: 100 } }));
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

function sectionHeader(title: string): Paragraph {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    border: {
      bottom: { color: "2563eb", space: 1, size: 6, style: BorderStyle.SINGLE },
    },
    spacing: { before: 200, after: 100 },
  });
}
