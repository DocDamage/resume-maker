import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateCreative({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, photoUrl } = resume;
  const accent = resume.accentColor;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#0f172a", marginBottom: "10px", fontFamily }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: "#1e293b", lineHeight: "inherit", fontSize: "13px" }}>
      <div style={{ background: accent, margin: "-20mm -20mm 20px", padding: "24px 20mm", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {photoUrl && <img src={photoUrl} alt="" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)" }} />}
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 800, margin: 0, fontFamily, letterSpacing: "-0.5px" }}>{personal.fullName}</h1>
            <p style={{ fontSize: "15px", fontWeight: 500, marginTop: "4px", opacity: 0.95, fontFamily }}>{personal.title}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "10px", fontSize: "12px", opacity: 0.9 }}>
          {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {personal.email}</span>}
          {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} /> {personal.phone}</span>}
          {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {personal.location}</span>}
          {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Globe size={12} /> {personal.website}</span>}
          {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ExternalLink size={12} /> {personal.linkedin}</span>}
        </div>
      </div>

      {summary && <Section title="About"><p style={{ color: "#334155", fontSize: "13px" }}>{summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{exp.role}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <div style={{ fontSize: "12px", color: accent, fontWeight: 600 }}>{exp.company}</div>
                <ul style={{ margin: "6px 0 0 14px", padding: 0, color: "#334155" }}>
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
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{edu.institution}</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>{edu.degree} in {edu.field}</div>
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
