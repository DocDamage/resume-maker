import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateSidebar({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, references, awards, volunteer, customSections, photoUrl, visibility, accentColor, font, darkMode } = resume;
  const accent = accentColor;
  const fontFamily = font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const strongColor = darkMode ? "#f1f5f9" : "#0f172a";
  const visible = (key: string) => visibility[key] !== false;
  const iconStyle = { color: accent, width: 12, height: 12 };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginTop: "18px" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px", fontFamily }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily, color: textColor, lineHeight: "inherit", fontSize: "12px", display: "flex", gap: "20px" }}>
      <div style={{ width: "30%", flexShrink: 0 }}>
        {photoUrl && <img src={photoUrl} alt="" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: `2px solid ${accent}`, display: "block" }} />}
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: accent, margin: 0, fontFamily, lineHeight: 1.2 }}>{personal.fullName}</h1>
        <p style={{ fontSize: "12px", fontWeight: 600, color: mutedColor, marginTop: "4px", fontFamily }}>{personal.title}</p>
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}><Mail style={iconStyle} /> {personal.email}</span>}
          {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}><Phone style={iconStyle} /> {personal.phone}</span>}
          {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}><MapPin style={iconStyle} /> {personal.location}</span>}
          {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}><Globe style={iconStyle} /> {personal.website}</span>}
          {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}><ExternalLink style={iconStyle} /> {personal.linkedin}</span>}
        </div>

        {visible("languages") && languages.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>Languages</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {languages.map((lang) => (
                <div key={lang.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{lang.language}</strong><span style={{ color: mutedColor }}> — {lang.proficiency}</span></div>
              ))}
            </div>
          </div>
        )}

        {visible("skills") && skills.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>Skills</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {skills.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: strongColor, marginBottom: "2px" }}>{cat.category}</div>
                  <div style={{ fontSize: "11px", color: textColor }}>{cat.skills.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visible("certifications") && certifications.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>Certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{cert.name}</strong><span style={{ color: mutedColor }}> — {cert.issuer}</span></div>
              ))}
            </div>
          </div>
        )}

        {visible("awards") && awards.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>Awards</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {awards.map((a) => (
                <div key={a.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{a.title}</strong><span style={{ color: mutedColor }}> — {a.issuer}</span></div>
              ))}
            </div>
          </div>
        )}

        {visible("references") && references.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>References</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {references.map((ref) => (
                <div key={ref.id} style={{ fontSize: "11px" }}>
                  <strong style={{ color: strongColor }}>{ref.name}</strong>
                  <span style={{ color: mutedColor }}> — {ref.title}, {ref.company}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {visible("education") && education.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "8px", fontFamily }}>Education</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: strongColor }}>{edu.institution}</div>
                  <div style={{ fontSize: "11px", color: textColor }}>{edu.degree}</div>
                  <div style={{ fontSize: "10px", color: mutedColor }}>{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        {visible("summary") && summary && <Section title="Profile"><p style={{ color: textColor, fontSize: "12px" }} dangerouslySetInnerHTML={{ __html: summary }} /></Section>}

        {visible("experience") && experience.length > 0 && (
          <Section title="Experience">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><strong style={{ fontSize: "12px", color: strongColor }}>{exp.role}</strong><span style={{ color: mutedColor }}> — {exp.company}</span></div>
                    <span style={{ fontSize: "11px", color: mutedColor, whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0, color: textColor }}>
                    {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "2px", listStyleType: "disc", fontSize: "11px" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {visible("volunteer") && volunteer.length > 0 && (
          <Section title="Volunteer Work">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {volunteer.map((v) => (
                <div key={v.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><strong style={{ fontSize: "12px", color: strongColor }}>{v.role}</strong><span style={{ color: mutedColor }}> — {v.organization}</span></div>
                    <span style={{ fontSize: "11px", color: mutedColor, whiteSpace: "nowrap" }}>{v.startDate} – {v.current ? "Present" : v.endDate}</span>
                  </div>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0, color: textColor }}>
                    {v.description.map((d, i) => <li key={i} style={{ marginBottom: "2px", listStyleType: "disc", fontSize: "11px" }} dangerouslySetInnerHTML={{ __html: d }} />)}
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
                <div key={proj.id}>
                  <strong style={{ fontSize: "12px", color: strongColor }}>{proj.name}</strong>
                  {proj.link && <span style={{ fontSize: "11px", color: mutedColor }}> — {proj.link}</span>}
                  <p style={{ color: textColor, marginTop: "2px", fontSize: "11px" }} dangerouslySetInnerHTML={{ __html: proj.description }} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {customSections.map((cs) => visible(cs.id) && cs.items.length > 0 && (
          <Section key={cs.id} title={cs.name}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cs.items.map((item) => (
                <div key={item.id}>
                  <strong style={{ fontSize: "12px", color: strongColor }}>{item.title}</strong>
                  {item.subtitle && <span style={{ fontSize: "11px", color: mutedColor }}> — {item.subtitle}</span>}
                  {item.date && <span style={{ fontSize: "11px", color: mutedColor }}> ({item.date})</span>}
                  {item.description && <p style={{ color: textColor, marginTop: "2px", fontSize: "11px" }}>{item.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        ))}
      </div>
    </div>
  );
}
