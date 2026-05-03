import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateSidebar({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "18px" }}>
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#0f172a",
          borderBottom: `2px solid ${accent}`,
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

  const iconStyle = { color: accent, width: 12, height: 12 };

  return (
    <div
      style={{
        fontFamily,
        color: "#1e293b",
        lineHeight: 1.5,
        fontSize: "12px",
        display: "flex",
        gap: "20px",
      }}
    >
      {/* Sidebar */}
      <div style={{ width: "30%", flexShrink: 0 }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: accent,
            margin: 0,
            fontFamily,
            lineHeight: 1.2,
          }}
        >
          {personal.fullName}
        </h1>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#475569",
            marginTop: "4px",
            fontFamily,
          }}
        >
          {personal.title}
        </p>

        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {personal.email && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <Mail style={iconStyle} /> {personal.email}
            </span>
          )}
          {personal.phone && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <Phone style={iconStyle} /> {personal.phone}
            </span>
          )}
          {personal.location && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <MapPin style={iconStyle} /> {personal.location}
            </span>
          )}
          {personal.website && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <Globe style={iconStyle} /> {personal.website}
            </span>
          )}
          {personal.linkedin && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
              <ExternalLink style={iconStyle} /> {personal.linkedin}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                marginBottom: "8px",
                fontFamily,
              }}
            >
              Skills
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {skills.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#0f172a", marginBottom: "2px" }}>
                    {cat.category}
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569" }}>
                    {cat.skills.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                marginBottom: "8px",
                fontFamily,
              }}
            >
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#0f172a" }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569" }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                    {edu.startDate} – {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {summary && (
          <Section title="Profile">
            <p style={{ color: "#334155", fontSize: "12px" }}>{summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "12px", color: "#0f172a" }}>{exp.role}</strong>
                    <span style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap" }}>
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569" }}>{exp.company}</div>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0, color: "#334155" }}>
                    {exp.description.map((d, i) => (
                      <li key={i} style={{ marginBottom: "2px", listStyleType: "disc", fontSize: "11px" }}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <strong style={{ fontSize: "12px", color: "#0f172a" }}>{proj.name}</strong>
                  {proj.link && (
                    <span style={{ fontSize: "11px", color: "#64748b" }}> — {proj.link}</span>
                  )}
                  <p style={{ color: "#334155", marginTop: "2px", fontSize: "11px" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
