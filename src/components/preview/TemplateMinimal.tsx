import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateMinimal({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, photoUrl } = resume;
  const fontFamily = resume.font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "22px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#94a3b8", marginBottom: "10px", fontFamily }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: "#334155", lineHeight: "inherit", fontSize: "13px" }}>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
        {photoUrl && <img src={photoUrl} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />}
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 300, color: "#0f172a", margin: 0, fontFamily, letterSpacing: "-0.5px" }}>{personal.fullName}</h1>
          <p style={{ fontSize: "13px", fontWeight: 400, color: "#64748b", marginTop: "4px", fontFamily }}>{personal.title}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", fontSize: "12px", color: "#94a3b8" }}>
        {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {personal.email}</span>}
        {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} /> {personal.phone}</span>}
        {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {personal.location}</span>}
        {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Globe size={12} /> {personal.website}</span>}
        {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ExternalLink size={12} /> {personal.linkedin}</span>}
      </div>

      {summary && <Section title="About"><p style={{ color: "#475569", fontSize: "13px" }}>{summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div><span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 500 }}>{exp.role}</span><span style={{ color: "#94a3b8" }}> — {exp.company}</span></div>
                  <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, color: "#475569" }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "3px", listStyleType: "circle" }}>{d}</li>)}
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
                  <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 500 }}>{edu.institution}</span>
                  <span style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{edu.degree} in {edu.field}</div>
                {edu.gpa && <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>GPA: {edu.gpa}</p>}
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
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>{cert.name}</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span>
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
                {lang.language} <span style={{ color: "#94a3b8" }}>({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {skills.map((cat) => (
              <div key={cat.id}>
                <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.category}: </span>
                <span style={{ color: "#475569" }}>{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>{proj.name}</span>
                {proj.link && <span style={{ fontSize: "11px", color: "#94a3b8" }}> — {proj.link}</span>}
                <p style={{ color: "#475569", marginTop: "2px" }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
