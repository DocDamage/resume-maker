import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateModern({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, photoUrl } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px", fontFamily }}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: "#1e293b", lineHeight: "inherit", fontSize: "13px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        {photoUrl && (
          <img src={photoUrl} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: `3px solid ${accent}` }} />
        )}
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: accent, margin: 0, fontFamily }}>{personal.fullName}</h1>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", marginTop: "4px", fontFamily }}>{personal.title}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
          {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {personal.email}</span>}
          {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} /> {personal.phone}</span>}
          {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {personal.location}</span>}
          {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Globe size={12} /> {personal.website}</span>}
          {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ExternalLink size={12} /> {personal.linkedin}</span>}
        </div>
      </div>

      {summary && <Section title="Summary"><p style={{ color: "#334155", fontSize: "13px" }}>{summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><strong style={{ fontSize: "13px", color: "#0f172a" }}>{exp.role}</strong><span style={{ color: "#64748b" }}> — {exp.company}</span></div>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, color: "#334155" }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "3px", listStyleType: "disc" }}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><strong style={{ fontSize: "13px", color: "#0f172a" }}>{edu.institution}</strong><span style={{ color: "#64748b" }}> — {edu.degree} in {edu.field}</span></div>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                {edu.gpa && <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {certifications.map((cert) => (
              <div key={cert.id}>
                <strong style={{ fontSize: "12px", color: "#0f172a" }}>{cert.name}</strong>
                <span style={{ fontSize: "11px", color: "#64748b" }}> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {languages.length > 0 && (
        <Section title="Languages">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "12px", color: "#475569" }}>
                <strong style={{ color: "#0f172a" }}>{lang.language}</strong> ({lang.proficiency})
              </span>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {skills.map((cat) => (
              <div key={cat.id}><strong style={{ fontSize: "12px", color: "#0f172a" }}>{cat.category}: </strong><span style={{ color: "#334155" }}>{cat.skills.join(", ")}</span></div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <strong style={{ fontSize: "13px", color: "#0f172a" }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "12px", color: "#64748b" }}> — {proj.link}</span>}
                <p style={{ color: "#334155", marginTop: "2px" }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
