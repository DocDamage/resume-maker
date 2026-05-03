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

  if (resume.summary) {
    children.push(sectionHeader("Summary"));
    children.push(new Paragraph({ text: resume.summary, spacing: { after: 200 } }));
  }

  if (resume.experience.length > 0) {
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

  if (resume.education.length > 0) {
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

  if (resume.certifications.length > 0) {
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

  if (resume.languages.length > 0) {
    children.push(sectionHeader("Languages"));
    const langs = resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ");
    children.push(new Paragraph({ text: langs, spacing: { after: 200 } }));
  }

  if (resume.skills.length > 0) {
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

  if (resume.projects.length > 0) {
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
