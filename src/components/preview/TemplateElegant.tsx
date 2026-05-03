import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateElegant({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, references, awards, volunteer, customSections, photoUrl, visibility, accentColor, font, darkMode } = resume;
  const accent = accentColor;
  const fontFamily = font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";
  const textColor = darkMode ? "#e2e8f0" : "#334155";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const strongColor = darkMode ? "#f1f5f9" : "#0f172a";
  const visible = (key: string) => visibility[key] !== false;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "22px" }}>
      <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: accent, textAlign: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", fontFamily }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: textColor, lineHeight: "inherit", fontSize: "13px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {photoUrl && <img src={photoUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: "10px", border: `2px solid ${accent}` }} />}
        <h1 style={{ fontSize: "28px", fontWeight: 400, color: strongColor, margin: 0, fontFamily, letterSpacing: "2px" }}>{personal.fullName}</h1>
        <p style={{ fontSize: "13px", fontWeight: 400, color: accent, marginTop: "6px", fontFamily, letterSpacing: "1px", textTransform: "uppercase" }}>{personal.title}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "12px", fontSize: "12px", color: mutedColor }}>
          {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} /> {personal.email}</span>}
          {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} /> {personal.phone}</span>}
          {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {personal.location}</span>}
          {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Globe size={12} /> {personal.website}</span>}
          {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ExternalLink size={12} /> {personal.linkedin}</span>}
        </div>
      </div>

      {visible("summary") && summary && <Section title="Summary"><p style={{ color: textColor, fontSize: "13px", textAlign: "center" }} dangerouslySetInnerHTML={{ __html: summary }} /></Section>}

      {visible("experience") && experience.length > 0 && (
        <Section title="Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{exp.role}</strong>
                <div style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>{exp.company} | {exp.startDate} – {exp.current ? "Present" : exp.endDate}</div>
                <ul style={{ margin: "6px auto 0", padding: 0, color: textColor, display: "inline-block", textAlign: "left" }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "3px", listStyleType: "disc" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("education") && education.length > 0 && (
        <Section title="Education">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{edu.institution}</strong>
                <div style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>{edu.degree} in {edu.field} | {edu.startDate} – {edu.endDate}</div>
                {edu.gpa && <p style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("certifications") && certifications.length > 0 && (
        <Section title="Certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
            {certifications.map((cert) => (
              <div key={cert.id}><strong style={{ fontSize: "12px", color: strongColor }}>{cert.name}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("languages") && languages.length > 0 && (
        <Section title="Languages">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: "12px", color: textColor }}>{lang.language} <span style={{ color: mutedColor }}>({lang.proficiency})</span></span>
            ))}
          </div>
        </Section>
      )}

      {visible("awards") && awards.length > 0 && (
        <Section title="Awards">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
            {awards.map((a) => (
              <div key={a.id}><strong style={{ fontSize: "12px", color: strongColor }}>{a.title}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {a.issuer}{a.date ? `, ${a.date}` : ""}</span>{a.description && <p style={{ fontSize: "11px", color: textColor, marginTop: "2px" }}>{a.description}</p>}</div>
            ))}
          </div>
        </Section>
      )}

      {visible("volunteer") && volunteer.length > 0 && (
        <Section title="Volunteer Work">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {volunteer.map((v) => (
              <div key={v.id} style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{v.role}</strong>
                <div style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>{v.organization} | {v.startDate} – {v.current ? "Present" : v.endDate}</div>
                <ul style={{ margin: "6px auto 0", padding: 0, color: textColor, display: "inline-block", textAlign: "left" }}>
                  {v.description.map((d, i) => <li key={i} style={{ marginBottom: "3px", listStyleType: "disc" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("skills") && skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            {skills.map((cat) => (
              <div key={cat.id} style={{ textAlign: "center" }}><strong style={{ fontSize: "12px", color: strongColor }}>{cat.category}: </strong><span style={{ color: textColor }}>{cat.skills.join(", ")}</span></div>
            ))}
          </div>
        </Section>
      )}

      {visible("projects") && projects.length > 0 && (
        <Section title="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "13px", color: strongColor }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "11px", color: mutedColor }}> — {proj.link}</span>}
                <p style={{ color: textColor, marginTop: "2px" }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible("references") && references.length > 0 && (
        <Section title="References">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
            {references.map((ref) => (
              <div key={ref.id}><strong style={{ fontSize: "12px", color: strongColor }}>{ref.name}</strong><span style={{ fontSize: "11px", color: mutedColor }}> — {ref.title}, {ref.company}</span></div>
            ))}
          </div>
        </Section>
      )}

      {customSections.map((cs) => visible(cs.id) && cs.items.length > 0 && (
        <Section key={cs.id} title={cs.name}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
            {cs.items.map((item) => (
              <div key={item.id} style={{ textAlign: "center" }}>
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
