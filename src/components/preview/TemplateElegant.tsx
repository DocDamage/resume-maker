import type { Resume } from "@/types/resume";

export function TemplateElegant({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "'Cambria', Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "22px" }}>
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 600,
          fontStyle: "italic",
          color: accent,
          borderBottom: "1px solid #cbd5e1",
          paddingBottom: "4px",
          marginBottom: "10px",
          fontFamily,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div
      style={{
        fontFamily,
        color: "#334155",
        lineHeight: 1.6,
        fontSize: "13px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 400,
            color: "#0f172a",
            margin: 0,
            fontFamily,
            letterSpacing: "1px",
          }}
        >
          {personal.fullName}
        </h1>
        <p
          style={{
            fontSize: "13px",
            fontStyle: "italic",
            color: "#64748b",
            marginTop: "4px",
            fontFamily,
          }}
        >
          {personal.title}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "8px",
            fontSize: "11px",
            color: "#94a3b8",
            fontStyle: "italic",
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Profile">
          <p style={{ color: "#475569", fontSize: "13px", textAlign: "center", maxWidth: "90%", margin: "0 auto" }}>
            {summary}
          </p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                      {exp.role}
                    </span>
                    <span style={{ color: "#94a3b8" }}> — {exp.company}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap", fontStyle: "italic" }}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, color: "#475569" }}>
                  {exp.description.map((d, i) => (
                    <li key={i} style={{ marginBottom: "3px", listStyleType: "circle" }}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                    {edu.institution}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap", fontStyle: "italic" }}>
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  {edu.degree} in {edu.field}
                </div>
                {edu.gpa && (
                  <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.flatMap((cat) => cat.skills).map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#475569",
                  fontStyle: "italic",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                  {proj.name}
                </span>
                {proj.link && (
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}> — {proj.link}</span>
                )}
                <p style={{ color: "#475569", marginTop: "2px" }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
