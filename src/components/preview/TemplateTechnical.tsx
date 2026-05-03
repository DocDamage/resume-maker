import type { Resume } from "@/types/resume";

export function TemplateTechnical({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, references, awards, volunteer, customSections, visibility, accentColor, font, darkMode } = resume;
  const accent = accentColor;
  const fontFamily = font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const strongColor = darkMode ? "#f1f5f9" : "#0f172a";
  const codeBg = darkMode ? "#1e293b" : "#f1f5f9";
  const visible = (key: string) => visibility[key] !== false;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "18px" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px", fontFamily }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: textColor, lineHeight: "inherit", fontSize: "12.5px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: `3px solid ${accent}`, paddingBottom: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: accent, margin: 0, fontFamily }}>{personal.fullName}</h1>
          <p style={{ fontSize: "13px", fontWeight: 600, color: strongColor, marginTop: "4px", fontFamily }}>{personal.title}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: mutedColor }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.linkedin && <div>{personal.linkedin}</div>}
        </div>
      </div>

      {visible("summary") && summary && <Section title="Profile"><p style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: summary }} /></Section>}

      {visible("skills") && skills.length > 0 && (
        <Section title="Technical Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {skills.map((cat) => (
              <div key={cat.id}>
                <strong style={{ fontSize: "11px", color: strongColor }}>{cat.category}: </strong>
                <span style={{ color: textColor }}>{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("experience") && experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><strong style={{ fontSize: "13px", color: strongColor }}>{exp.role}</strong><span style={{ color: mutedColor }}> — {exp.company}</span></div>
                  <span style={{ fontSize: "11px", color: mutedColor, whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul style={{ margin: "4px 0 0 16px", padding: 0, color: textColor }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "2px", listStyleType: "disc" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("projects") && projects.length > 0 && (
        <Section title="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ padding: "8px", backgroundColor: codeBg, borderRadius: "4px" }}>
                <strong style={{ fontSize: "12px", color: strongColor }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "11px", color: mutedColor }}> — {proj.link}</span>}
                <p style={{ color: textColor, marginTop: "2px", fontSize: "11px" }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("education") && education.length > 0 && (
        <Section title="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <strong style={{ fontSize: "12px", color: strongColor }}>{edu.institution}</strong>
                <span style={{ fontSize: "11px", color: mutedColor }}> — {edu.degree} in {edu.field} ({edu.startDate} – {edu.endDate})</span>
                {edu.gpa && <span style={{ fontSize: "11px", color: mutedColor }}> GPA: {edu.gpa}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("certifications") && certifications.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {certifications.map((cert) => (
              <div key={cert.id}><strong style={{ fontSize: "11px", color: strongColor }}>{cert.name}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("languages") && languages.length > 0 && (
        <Section title="Languages">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "11px", color: textColor }}><strong style={{ color: strongColor }}>{lang.language}</strong> ({lang.proficiency})</span>
            ))}
          </div>
        </Section>
      )}

      {visible("awards") && awards.length > 0 && (
        <Section title="Awards">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {awards.map((a) => (
              <div key={a.id}><strong style={{ fontSize: "11px", color: strongColor }}>{a.title}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {a.issuer}{a.date ? `, ${a.date}` : ""}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("volunteer") && volunteer.length > 0 && (
        <Section title="Volunteer Work">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {volunteer.map((v) => (
              <div key={v.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "12px", color: strongColor }}>{v.role}</strong>
                  <span style={{ fontSize: "11px", color: mutedColor }}>{v.startDate} – {v.current ? "Present" : v.endDate}</span>
                </div>
                <div style={{ fontSize: "11px", color: textColor }}>{v.organization}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("references") && references.length > 0 && (
        <Section title="References">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {references.map((ref) => (
              <div key={ref.id}><strong style={{ fontSize: "11px", color: strongColor }}>{ref.name}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {ref.title}, {ref.company}</span></div>
            ))}
          </div>
        </Section>
      )}

      {customSections.map((cs) => visible(cs.id) && cs.items.length > 0 && (
        <Section key={cs.id} title={cs.name}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {cs.items.map((item) => (
              <div key={item.id}>
                <strong style={{ fontSize: "12px", color: strongColor }}>{item.title}</strong>
                {item.subtitle && <span style={{ fontSize: "11px", color: mutedColor }}> — {item.subtitle}</span>}
                {item.date && <span style={{ fontSize: "10px", color: mutedColor }}> ({item.date})</span>}
                {item.description && <p style={{ color: textColor, marginTop: "2px", fontSize: "11px" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
