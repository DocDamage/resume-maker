import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateExecutive({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "24px" }}>
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "12px",
          fontFamily,
          letterSpacing: "-0.3px",
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
        color: "#1e293b",
        lineHeight: 1.6,
        fontSize: "13px",
        padding: "8px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            fontFamily,
            letterSpacing: "-0.5px",
          }}
        >
          {personal.fullName}
        </h1>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 500,
            color: accent,
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
            gap: "16px",
            marginTop: "10px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          {personal.email && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Mail size={12} /> {personal.email}
            </span>
          )}
          {personal.phone && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Phone size={12} /> {personal.phone}
            </span>
          )}
          {personal.location && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} /> {personal.location}
            </span>
          )}
          {personal.website && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Globe size={12} /> {personal.website}
            </span>
          )}
          {personal.linkedin && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ExternalLink size={12} /> {personal.linkedin}
            </span>
          )}
        </div>
      </div>

      <div style={{ height: "1px", background: "#e2e8f0", margin: "0 0 4px" }} />

      {/* Summary */}
      {summary && (
        <Section title="Executive Summary">
          <p style={{ color: "#334155", fontSize: "13px" }}>{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Professional Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "14px", color: "#0f172a" }}>{exp.company}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: accent, fontWeight: 600, marginTop: "2px" }}>
                  {exp.role}
                </div>
                <ul style={{ margin: "6px 0 0 18px", padding: 0, color: "#334155" }}>
                  {exp.description.map((d, i) => (
                    <li key={i} style={{ marginBottom: "4px", listStyleType: "disc" }}>
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
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{edu.institution}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                  {edu.degree} in {edu.field}
                </div>
                {edu.gpa && (
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Core Competencies">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.flatMap((cat) => cat.skills).map((skill) => (
              <span
                key={skill}
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  background: "#f1f5f9",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#475569",
                  border: "1px solid #e2e8f0",
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
        <Section title="Key Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>{proj.name}</strong>
                {proj.link && (
                  <span style={{ fontSize: "12px", color: "#64748b" }}> — {proj.link}</span>
                )}
                <p style={{ color: "#334155", marginTop: "2px" }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
