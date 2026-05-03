import type { Resume } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function TemplateCompact({ resume }: { resume: Resume }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, references, awards, volunteer, customSections, photoUrl, visibility, accentColor, font, darkMode } = resume;
  const accent = accentColor;
  const fontFamily = font === "serif" ? "Georgia, serif" : "system-ui, sans-serif";
  const textColor = darkMode ? "#e2e8f0" : "#1e293b";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const strongColor = darkMode ? "#f1f5f9" : "#0f172a";
  const visible = (key: string) => visibility[key] !== false;

  return (
    <div style={{ fontFamily, color: textColor, lineHeight: "inherit", fontSize: "11.5px" }}>
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {photoUrl && <img src={photoUrl} alt="" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: accent, margin: 0, fontFamily }}>{personal.fullName}</h1>
            <span style={{ fontSize: "11px", color: mutedColor }}>{personal.title}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "10.5px", color: mutedColor, marginTop: "4px" }}>
            {personal.email && <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Mail size={10} /> {personal.email}</span>}
            {personal.phone && <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Phone size={10} /> {personal.phone}</span>}
            {personal.location && <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><MapPin size={10} /> {personal.location}</span>}
            {personal.website && <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Globe size={10} /> {personal.website}</span>}
            {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><ExternalLink size={10} /> {personal.linkedin}</span>}
          </div>
        </div>
      </div>

      {visible("summary") && summary && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ color: textColor, fontSize: "11.5px" }} dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
      )}

      {visible("experience") && experience.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Experience</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "11.5px", color: strongColor }}>{exp.role}, {exp.company}</strong>
                  <span style={{ fontSize: "10px", color: mutedColor, whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <ul style={{ margin: "2px 0 0 14px", padding: 0, color: textColor }}>
                  {exp.description.map((d, i) => <li key={i} style={{ marginBottom: "1px", listStyleType: "disc", fontSize: "11px" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {visible("education") && education.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Education</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "11.5px", color: strongColor }}>{edu.institution}</strong>
                  <span style={{ fontSize: "10px", color: mutedColor, whiteSpace: "nowrap" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <span style={{ fontSize: "11px", color: textColor }}>{edu.degree} in {edu.field}{edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {visible("certifications") && certifications.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Certifications</h2>
          <div style={{ fontSize: "11px", color: textColor }}>{certifications.map((c) => `${c.name} (${c.issuer})`).join(" | ")}</div>
        </div>
      )}

      {visible("languages") && languages.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Languages</h2>
          <div style={{ fontSize: "11px", color: textColor }}>{languages.map((l) => `${l.language} (${l.proficiency})`).join(" | ")}</div>
        </div>
      )}

      {visible("awards") && awards.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Awards</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {awards.map((a) => (
              <div key={a.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{a.title}</strong><span style={{ color: mutedColor }}> — {a.issuer}{a.date ? `, ${a.date}` : ""}</span></div>
            ))}
          </div>
        </div>
      )}

      {visible("volunteer") && volunteer.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Volunteer Work</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {volunteer.map((v) => (
              <div key={v.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "11.5px", color: strongColor }}>{v.role}, {v.organization}</strong>
                  <span style={{ fontSize: "10px", color: mutedColor, whiteSpace: "nowrap" }}>{v.startDate} – {v.current ? "Present" : v.endDate}</span>
                </div>
                <ul style={{ margin: "2px 0 0 14px", padding: 0, color: textColor }}>
                  {v.description.map((d, i) => <li key={i} style={{ marginBottom: "1px", listStyleType: "disc", fontSize: "10.5px" }} dangerouslySetInnerHTML={{ __html: d }} />)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {visible("skills") && skills.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Skills</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {skills.map((cat) => (
              <div key={cat.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{cat.category}: </strong><span style={{ color: textColor }}>{cat.skills.join(", ")}</span></div>
            ))}
          </div>
        </div>
      )}

      {visible("projects") && projects.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>Projects</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <strong style={{ fontSize: "11.5px", color: strongColor }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "10px", color: mutedColor }}> — {proj.link}</span>}
                <p style={{ color: textColor, marginTop: "1px", fontSize: "10.5px" }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {visible("references") && references.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>References</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {references.map((ref) => (
              <div key={ref.id} style={{ fontSize: "11px" }}><strong style={{ color: strongColor }}>{ref.name}</strong><span style={{ color: mutedColor }}> — {ref.title}, {ref.company}</span></div>
            ))}
          </div>
        </div>
      )}

      {customSections.map((cs) => visible(cs.id) && cs.items.length > 0 && (
        <div key={cs.id} style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: "2px", marginBottom: "6px", fontFamily }}>{cs.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {cs.items.map((item) => (
              <div key={item.id}>
                <strong style={{ fontSize: "11.5px", color: strongColor }}>{item.title}</strong>
                {item.subtitle && <span style={{ fontSize: "10px", color: mutedColor }}> — {item.subtitle}</span>}
                {item.date && <span style={{ fontSize: "10px", color: mutedColor }}> ({item.date})</span>}
                {item.description && <p style={{ color: textColor, marginTop: "1px", fontSize: "10.5px" }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
