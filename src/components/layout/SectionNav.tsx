import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2,
  Upload, Bot, Palette, Type, LayoutTemplate, Undo2, Redo2,
  Award, Globe, Sparkles,
} from "lucide-react";

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "projects", label: "Projects", icon: FolderGit2 },
];

interface SectionNavProps {
  onUpload: () => void;
}

export function SectionNav({ onUpload }: SectionNavProps) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);

  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => s.canUndo);
  const canRedo = useResumeStore((s) => s.canRedo);

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
        Sections
      </div>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        return (
          <Button
            key={section.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn("justify-start gap-2 text-sm", isActive && "bg-secondary font-medium")}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon size={16} />
            {section.label}
          </Button>
        );
      })}

      <Button variant="outline" size="sm" className="justify-start gap-2 text-sm mt-2 mx-3" onClick={onUpload}>
        <Upload size={16} />
        Upload Resume
      </Button>

      <Button
        variant={activeSection === "ai-tools" ? "secondary" : "ghost"}
        size="sm"
        className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "ai-tools" && "bg-secondary font-medium")}
        onClick={() => setActiveSection("ai-tools")}
      >
        <Sparkles size={16} />
        AI Tools
      </Button>

      <Button
        variant={activeSection === "ai-settings" ? "secondary" : "ghost"}
        size="sm"
        className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "ai-settings" && "bg-secondary font-medium")}
        onClick={() => setActiveSection("ai-settings")}
      >
        <Bot size={16} />
        AI Settings
      </Button>

      <div className="flex gap-1 mt-2 mx-3">
        <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={undo} disabled={!canUndo()}>
          <Undo2 size={14} /> Undo
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={redo} disabled={!canRedo()}>
          <Redo2 size={14} /> Redo
        </Button>
      </div>
    </div>
  );
}

export function AppearancePanel() {
  const template = useResumeStore((s) => s.resume.template);
  const accentColor = useResumeStore((s) => s.resume.accentColor);
  const font = useResumeStore((s) => s.resume.font);
  const paperSize = useResumeStore((s) => s.resume.paperSize);
  const spacing = useResumeStore((s) => s.resume.spacing);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFont = useResumeStore((s) => s.setFont);
  const setPaperSize = useResumeStore((s) => s.setPaperSize);
  const setSpacing = useResumeStore((s) => s.setSpacing);

  const templates = ["modern", "classic", "minimal", "sidebar", "executive", "creative", "compact", "elegant"] as const;

  return (
    <div className="flex flex-col gap-1 p-3 border-t mt-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
        Appearance
      </div>
      <div className="px-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <LayoutTemplate size={12} /> Template
          </label>
          <div className="grid grid-cols-4 gap-1">
            {templates.map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  "text-[10px] py-1 rounded-md border capitalize transition-colors",
                  template === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
                )}
              >
                {t.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><Palette size={12} /> Accent</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 w-8 rounded-md border cursor-pointer p-0" />
            <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><Type size={12} /> Font</label>
          <div className="flex gap-1">
            {(["sans", "serif"] as const).map((f) => (
              <button key={f} onClick={() => setFont(f)} className={cn("flex-1 text-xs py-1.5 rounded-md border capitalize transition-colors", font === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Paper Size</label>
          <div className="flex gap-1">
            {(["a4", "letter", "legal"] as const).map((p) => (
              <button key={p} onClick={() => setPaperSize(p)} className={cn("flex-1 text-xs py-1.5 rounded-md border uppercase transition-colors", paperSize === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Spacing: {spacing.toFixed(1)}x</label>
          <input type="range" min={0.8} max={1.5} step={0.1} value={spacing} onChange={(e) => setSpacing(parseFloat(e.target.value))} className="w-full" />
        </div>
      </div>
    </div>
  );
}
