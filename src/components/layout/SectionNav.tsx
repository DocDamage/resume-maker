import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2,
  Upload, Bot, Palette, Type, LayoutTemplate, Undo2, Redo2,
  Award, Globe, Sparkles, Eye, EyeOff, Moon, Sun, Code, Accessibility,
  ShieldCheck, GitBranch, Share2, Users, ChevronRight,
} from "lucide-react";

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "certifications", label: "Certifications", icon: ShieldCheck },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "references", label: "References", icon: User },
  { id: "awards", label: "Awards", icon: Award },
  { id: "volunteer", label: "Volunteer", icon: Sparkles },
];

const presets = [
  { name: "Blue", color: "#2563eb" },
  { name: "Emerald", color: "#10b981" },
  { name: "Coral", color: "#f43f5e" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Slate", color: "#475569" },
];

interface SectionNavProps {
  onUpload: () => void;
}

export function SectionNav({ onUpload }: SectionNavProps) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);
  const visibility = useResumeStore((s) => s.resume.visibility);
  const setVisibility = useResumeStore((s) => s.setVisibility);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => s.canUndo);
  const canRedo = useResumeStore((s) => s.canRedo);

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">
        Resume Sections
      </div>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isVisible = visibility[section.id] !== false;
        return (
          <div key={section.id} className="flex items-center gap-1 mx-3 group">
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex-1 justify-start gap-2 text-sm h-8 transition-all",
                isActive && "bg-secondary font-medium shadow-sm"
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon size={15} className={cn(isActive && "text-primary")} />
              {section.label}
              {isActive && <ChevronRight size={12} className="ml-auto text-muted-foreground opacity-50" />}
            </Button>
            <button
              onClick={() => setVisibility(section.id, !isVisible)}
              className={cn(
                "p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 focus:opacity-100",
                !isVisible && "opacity-30 group-hover:opacity-50"
              )}
              title={isVisible ? "Hide section" : "Show section"}
            >
              {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
          </div>
        );
      })}

      <div className="mt-3 mx-3">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-sm h-8" onClick={onUpload}>
          <Upload size={15} /> Upload Resume
        </Button>
      </div>

      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">
        Tools
      </div>

      <div className="space-y-0.5 mx-3">
        <NavButton id="job-tracker" icon={Briefcase} label="Job Tracker" />
        <NavButton id="branches" icon={GitBranch} label="Branches" />
        <NavButton id="networking" icon={Users} label="Networking" />
        <NavButton id="share" icon={Share2} label="Share & Export" />
        <NavButton id="import" icon={Globe} label="Import" />
        <NavButton id="ai-tools" icon={Sparkles} label="AI Tools" />
        <NavButton id="ai-settings" icon={Bot} label="AI Settings" />
        <NavButton id="custom-css" icon={Code} label="Custom CSS" />
        <NavButton id="accessibility" icon={Accessibility} label="Accessibility" />
      </div>

      <div className="flex gap-1 mt-3 mx-3">
        <Button variant="ghost" size="sm" className="flex-1 gap-1 h-8 text-xs" onClick={undo} disabled={!canUndo()}>
          <Undo2 size={13} /> Undo
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-1 h-8 text-xs" onClick={redo} disabled={!canRedo()}>
          <Redo2 size={13} /> Redo
        </Button>
      </div>
    </div>
  );
}

function NavButton({ id, icon: Icon, label }: { id: string; icon: React.ElementType; label: string }) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);
  const isActive = activeSection === id;
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start gap-2 text-sm h-8 transition-all",
        isActive && "bg-secondary font-medium shadow-sm"
      )}
      onClick={() => setActiveSection(id)}
    >
      <Icon size={15} className={cn(isActive && "text-primary")} />
      {label}
    </Button>
  );
}

export function AppearancePanel() {
  const template = useResumeStore((s) => s.resume.template);
  const accentColor = useResumeStore((s) => s.resume.accentColor);
  const font = useResumeStore((s) => s.resume.font);
  const paperSize = useResumeStore((s) => s.resume.paperSize);
  const spacing = useResumeStore((s) => s.resume.spacing);
  const darkMode = useResumeStore((s) => s.resume.darkMode);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFont = useResumeStore((s) => s.setFont);
  const setPaperSize = useResumeStore((s) => s.setPaperSize);
  const setSpacing = useResumeStore((s) => s.setSpacing);
  const setDarkMode = useResumeStore((s) => s.setDarkMode);

  const templates = ["modern", "classic", "minimal", "sidebar", "executive", "creative", "compact", "elegant", "technical", "academic"] as const;

  return (
    <div className="flex flex-col gap-1 p-3 border-t mt-2">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">
        Appearance
      </div>
      <div className="px-3 space-y-3">
        <div className="flex gap-1">
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-1 flex-1 text-xs py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors">
            {darkMode ? <Moon size={12} /> : <Sun size={12} />}
            {darkMode ? "Dark" : "Light"}
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><LayoutTemplate size={12} /> Template</label>
          <div className="grid grid-cols-5 gap-1">
            {templates.map((t) => (
              <button key={t} onClick={() => setTemplate(t)} className={cn("text-[10px] py-1 rounded-md border capitalize transition-colors", template === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")} title={t}>
                {t.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><Palette size={12} /> Accent</label>
          <div className="flex gap-1 flex-wrap">
            {presets.map((p) => (
              <button key={p.color} onClick={() => setAccentColor(p.color)} className={cn("w-6 h-6 rounded-full border-2 transition-all", accentColor === p.color ? "border-foreground scale-110" : "border-transparent hover:scale-105")} style={{ background: p.color }} title={p.name} />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-7 w-7 rounded-md border cursor-pointer p-0" />
            <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1"><Type size={12} /> Font</label>
          <div className="flex gap-1">
            {(["sans", "serif"] as const).map((f) => (
              <button key={f} onClick={() => setFont(f)} className={cn("flex-1 text-xs py-1.5 rounded-md border capitalize transition-colors", font === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>{f}</button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Paper Size</label>
          <div className="flex gap-1">
            {(["a4", "letter", "legal"] as const).map((p) => (
              <button key={p} onClick={() => setPaperSize(p)} className={cn("flex-1 text-xs py-1.5 rounded-md border uppercase transition-colors", paperSize === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>{p}</button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Spacing: {spacing.toFixed(1)}x</label>
          <input type="range" min={0.8} max={1.5} step={0.1} value={spacing} onChange={(e) => setSpacing(parseFloat(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
    </div>
  );
}
