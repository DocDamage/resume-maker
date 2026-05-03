import type { Resume } from "@/types/resume";

export function TemplateCompact({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  return (
    <div
      style={{
        fontFamily,
        color: "#1e293b",
        lineHeight: 1.35,
        fontSize: "11px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: accent,
              margin: 0,
              fontFamily,
            }}
          >
            {personal.fullName}
          </h1>
          <p style={{ fontSize: "11px", color: "#475569", marginTop: "1px", fontFamily }}>
            {personal.title}
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: "10px", color: "#64748b" }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.website && <div>{personal.website}</div>}
          {personal.linkedin && <div>{personal.linkedin}</div>}
        </div>
      </div>

      <div style={{ height: "1px", background: accent, marginBottom: "8px" }} />

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: "8px" }}>
          <p style={{ color: "#334155", fontSize: "11px", margin: 0 }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#0f172a",
              borderBottom: `1px solid ${accent}`,
              marginBottom: "4px",
              paddingBottom: "2px",
              fontFamily,
            }}
          >
            Experience
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "11px", color: "#0f172a" }}>{exp.role}</strong>
                  <span style={{ fontSize: "10px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "#475569" }}>{exp.company}</div>
                <ul style={{ margin: "2px 0 0 12px", padding: 0, color: "#334155" }}>
                  {exp.description.map((d, i) => (
                    <li key={i} style={{ marginBottom: "1px", listStyleType: "disc", fontSize: "10px" }}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#0f172a",
              borderBottom: `1px solid ${accent}`,
              marginBottom: "4px",
              paddingBottom: "2px",
              fontFamily,
            }}
          >
            Education
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "11px", color: "#0f172a" }}>{edu.institution}</strong>
                  <span style={{ fontSize: "10px", color: "#475569" }}> — {edu.degree} in {edu.field}</span>
                </div>
                <span style={{ fontSize: "10px", color: "#64748b", whiteSpace: "nowrap" }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#0f172a",
              borderBottom: `1px solid ${accent}`,
              marginBottom: "4px",
              paddingBottom: "2px",
              fontFamily,
            }}
          >
            Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {skills.flatMap((cat) => cat.skills).map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  background: "#f1f5f9",
                  borderRadius: "3px",
                  color: "#475569",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#0f172a",
              borderBottom: `1px solid ${accent}`,
              marginBottom: "4px",
              paddingBottom: "2px",
              fontFamily,
            }}
          >
            Projects
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <strong style={{ fontSize: "11px", color: "#0f172a" }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "10px", color: "#64748b" }}> — {proj.link}</span>}
                <p style={{ color: "#334155", marginTop: "1px", fontSize: "10px" }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
