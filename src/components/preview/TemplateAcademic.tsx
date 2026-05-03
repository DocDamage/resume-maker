import type { Resume } from "@/types/resume";

export function TemplateAcademic({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, references, awards, volunteer, customSections, visibility, accentColor, font, darkMode } = resume;
  const accent = accentColor;
  const fontFamily = font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const strongColor = darkMode ? "#f1f5f9" : "#0f172a";
  const visible = (key: string) => visibility[key] !== false;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 700, color: accent, marginBottom: "10px", fontFamily, letterSpacing: "-0.3px" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: textColor, lineHeight: "inherit", fontSize: "13px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: strongColor, margin: 0, fontFamily }}>{personal.fullName}</h1>
        <p style={{ fontSize: "13px", color: mutedColor, marginTop: "6px" }}>{personal.title}</p>
        <div style={{ fontSize: "12px", color: mutedColor, marginTop: "8px" }}>
          {personal.email} {personal.phone && `| ${personal.phone}`} {personal.location && `| ${personal.location}`}
          {personal.linkedin && <span> | {personal.linkedin}</span>}
        </div>
      </div>

      {visible("education") && education.length > 0 && (
        <Section title="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "13px", color: strongColor }}>{edu.institution}</strong>
                  <span style={{ fontSize: "12px", color: mutedColor }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ fontSize: "13px", color: textColor }}>{edu.degree} in {edu.field}{edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("summary") && summary && <Section title="Research Interests / Summary"><p style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: summary }} /></Section>}

      {visible("experience") && experience.length > 0 && (
        <Section title="Research & Professional Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><strong style={{ fontSize: "13px", color: strongColor }}>{exp.company}</strong><span style={{ color: mutedColor }}> — {exp.role}</span></div>
                  <span style={{ fontSize: "12px", color: mutedColor, whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, color: textColor }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "3px", listStyleType: "disc" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("projects") && projects.length > 0 && (
        <Section title="Publications & Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "12px", color: mutedColor }}> — {proj.link}</span>}
                <p style={{ color: textColor, marginTop: "2px" }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("awards") && awards.length > 0 && (
        <Section title="Awards & Honors">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {awards.map((a) => (
              <div key={a.id}>
                <strong style={{ fontSize: "12px", color: strongColor }}>{a.title}</strong>
                <span style={{ fontSize: "11px", color: mutedColor }}> — {a.issuer}{a.date ? `, ${a.date}` : ""}</span>
                {a.description && <p style={{ fontSize: "11px", color: textColor, marginTop: "2px" }}>{a.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("skills") && skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {skills.map((cat) => (
              <div key={cat.id}><strong style={{ fontSize: "12px", color: strongColor }}>{cat.category}: </strong><span style={{ color: textColor }}>{cat.skills.join(", ")}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("certifications") && certifications.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {certifications.map((cert) => (
              <div key={cert.id}><strong style={{ fontSize: "12px", color: strongColor }}>{cert.name}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {cert.issuer}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("languages") && languages.length > 0 && (
        <Section title="Languages">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "12px", color: textColor }}>{lang.language} ({lang.proficiency})</span>
            ))}
          </div>
        </Section>
      )}

      {visible("volunteer") && volunteer.length > 0 && (
        <Section title="Service & Outreach">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {volunteer.map((v) => (
              <div key={v.id}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{v.role}</strong>
                <span style={{ fontSize: "12px", color: mutedColor }}> — {v.organization} ({v.startDate} – {v.current ? "Present" : v.endDate})</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("references") && references.length > 0 && (
        <Section title="References">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {references.map((ref) => (
              <div key={ref.id}>
                <strong style={{ fontSize: "12px", color: strongColor }}>{ref.name}</strong>
                <span style={{ fontSize: "11px", color: mutedColor }}> — {ref.title}, {ref.company}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {customSections.map((cs) => visible(cs.id) && cs.items.length > 0 && (
        <Section key={cs.id} title={cs.name}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {cs.items.map((item) => (
              <div key={item.id}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{item.title}</strong>
                {item.subtitle && <span style={{ fontSize: "12px", color: mutedColor }}> — {item.subtitle}</span>}
                {item.date && <span style={{ fontSize: "11px", color: mutedColor }}> ({item.date})</span>}
                {item.description && <p style={{ color: textColor, marginTop: "2px", fontSize: "12px" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
