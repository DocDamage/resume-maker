import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Upload, CheckCircle } from "lucide-react";

interface ParsedLinkedIn {
  fullName?: string;
  title?: string;
  summary?: string;
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { institution: string; degree: string; field: string }[];
  skills: string[];
}

function parseLinkedInText(text: string): ParsedLinkedIn {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const result: ParsedLinkedIn = { experience: [], education: [], skills: [] };

  // Heuristic: first line is often name, second is title
  if (lines.length > 0) result.fullName = lines[0];
  if (lines.length > 1) result.title = lines[1];

  // Find summary (paragraph before "Experience" or after title)
  let inExp = false;
  let inEdu = false;
  let inSkills = false;
  let currentExp: ParsedLinkedIn["experience"][0] | null = null;
  let currentEdu: ParsedLinkedIn["education"][0] | null = null;
  let summaryLines: string[] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (lower.includes("experience") && line.length < 20) {
      inExp = true; inEdu = false; inSkills = false;
      if (summaryLines.length > 0) result.summary = summaryLines.join(" ");
      continue;
    }
    if (lower.includes("education") && line.length < 20) {
      inExp = false; inEdu = true; inSkills = false;
      continue;
    }
    if ((lower.includes("skills") || lower.includes("top skills")) && line.length < 20) {
      inExp = false; inEdu = false; inSkills = true;
      continue;
    }

    if (!inExp && !inEdu && !inSkills && i < 15) {
      summaryLines.push(line);
    }

    if (inExp) {
      // Heuristic: company name often has "·" or is followed by role
      if (line.includes("·") || (lines[i + 1] && lines[i + 1].match(/\d+\s*(mo|yr)/))) {
        if (currentExp) result.experience.push(currentExp);
        const parts = line.split("·").map((p) => p.trim());
        currentExp = { company: parts[0], role: parts[1] || "", duration: "", description: "" };
      } else if (line.match(/\d+\s*(mo|yr|month|year)/) || line.match(/\d{4}/)) {
        if (currentExp) currentExp.duration = line;
      } else if (currentExp && line.length > 10) {
        currentExp.description += (currentExp.description ? " " : "") + line;
      }
    }

    if (inEdu) {
      if (line.match(/(university|college|institute|school|academy)/i)) {
        if (currentEdu) result.education.push(currentEdu);
        currentEdu = { institution: line, degree: "", field: "" };
      } else if (currentEdu && (line.includes("Bachelor") || line.includes("Master") || line.includes("PhD") || line.includes("Degree"))) {
        currentEdu.degree = line;
      }
    }

    if (inSkills) {
      if (line.length < 30 && !line.match(/^(show|see|more|less|and|the)/i)) {
        result.skills.push(line);
      }
    }
  }

  if (currentExp) result.experience.push(currentExp);
  if (currentEdu) result.education.push(currentEdu);

  return result;
}

export function LinkedInImporter() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ParsedLinkedIn | null>(null);
  const [imported, setImported] = useState(false);

  const setPersonal = useResumeStore((s) => s.setPersonal);
  const setSummary = useResumeStore((s) => s.setSummary);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);

  const handleParse = () => {
    if (!text.trim()) return;
    setParsed(parseLinkedInText(text));
  };

  const handleImport = () => {
    if (!parsed) return;
    const personal = useResumeStore.getState().resume.personal;

    if (parsed.fullName) setPersonal({ ...personal, fullName: parsed.fullName });
    if (parsed.title) setPersonal({ ...personal, title: parsed.title });
    if (parsed.summary) setSummary(parsed.summary);

    parsed.experience.forEach((exp) => {
      addExperience();
      const all = useResumeStore.getState().resume.experience;
      const last = all[all.length - 1];
      if (last) {
        updateExperience(last.id, {
          company: exp.company,
          role: exp.role,
          description: exp.description ? [exp.description] : [""],
        });
      }
    });

    parsed.education.forEach((edu) => {
      addEducation();
      const all = useResumeStore.getState().resume.education;
      const last = all[all.length - 1];
      if (last) {
        updateEducation(last.id, {
          institution: edu.institution,
          degree: edu.degree || "Degree",
          field: edu.field || "",
        });
      }
    });

    if (parsed.skills.length > 0) {
      addSkillCategory();
      const all = useResumeStore.getState().resume.skills;
      const last = all[all.length - 1];
      if (last) {
        updateSkillCategory(last.id, { category: "LinkedIn Skills", skills: parsed.skills.slice(0, 10) });
      }
    }

    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe size={18} />
          LinkedIn Profile Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Paste your LinkedIn profile text (copy from View Profile → Select All). We'll extract your details.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste LinkedIn profile text here..."
          rows={8}
        />
        <Button variant="outline" size="sm" onClick={handleParse} disabled={!text.trim()}>
          <Upload size={14} className="mr-1" /> Parse Profile
        </Button>

        {parsed && (
          <div className="space-y-2 rounded-md border p-3 bg-muted/40">
            <div className="flex items-center gap-2 flex-wrap">
              {parsed.fullName && <Badge variant="secondary">{parsed.fullName}</Badge>}
              {parsed.title && <Badge variant="outline">{parsed.title}</Badge>}
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>{parsed.experience.length} experience entries detected</p>
              <p>{parsed.education.length} education entries detected</p>
              <p>{parsed.skills.length} skills detected</p>
              {parsed.summary && <p className="line-clamp-2">Summary: {parsed.summary.slice(0, 80)}...</p>}
            </div>
            <Button size="sm" onClick={handleImport} disabled={imported} className="w-full">
              {imported ? (
                <><CheckCircle size={14} className="mr-1" /> Imported!</>
              ) : (
                <><Upload size={14} className="mr-1" /> Import to Resume</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
