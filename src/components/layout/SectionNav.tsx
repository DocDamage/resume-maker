import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2,
  Upload, Bot, Palette, Type, LayoutTemplate, Undo2, Redo2,
  Award, Globe, Sparkles, Eye, EyeOff, Moon, Sun, Code, Accessibility,
  ShieldCheck, GitBranch, Share2, Users,
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
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
        Sections
      </div>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isVisible = visibility[section.id] !== false;
        return (
          <div key={section.id} className="flex items-center gap-1 mx-3">
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn("flex-1 justify-start gap-2 text-sm", isActive && "bg-secondary font-medium")}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon size={16} />
              {section.label}
            </Button>
            <button
              onClick={() => setVisibility(section.id, !isVisible)}
              className={cn("p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors", !isVisible && "text-muted-foreground/30")}
              title={isVisible ? "Hide section" : "Show section"}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        );
      })}

      <Button variant="outline" size="sm" className="justify-start gap-2 text-sm mt-2 mx-3" onClick={onUpload}>
        <Upload size={16} /> Upload Resume
      </Button>

      <Button variant={activeSection === "job-tracker" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "job-tracker" && "bg-secondary font-medium")} onClick={() => setActiveSection("job-tracker")}>
        <Briefcase size={16} /> Job Tracker
      </Button>
      <Button variant={activeSection === "branches" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "branches" && "bg-secondary font-medium")} onClick={() => setActiveSection("branches")}>
        <GitBranch size={16} /> Branches
      </Button>
      <Button variant={activeSection === "share" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "share" && "bg-secondary font-medium")} onClick={() => setActiveSection("share")}>
        <Share2 size={16} /> Share & Export
      </Button>
      <Button variant={activeSection === "import" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "import" && "bg-secondary font-medium")} onClick={() => setActiveSection("import")}>
        <Globe size={16} /> Import
      </Button>
      <Button variant={activeSection === "ai-tools" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "ai-tools" && "bg-secondary font-medium")} onClick={() => setActiveSection("ai-tools")}>
        <Sparkles size={16} /> AI Tools
      </Button>
      <Button variant={activeSection === "ai-settings" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "ai-settings" && "bg-secondary font-medium")} onClick={() => setActiveSection("ai-settings")}>
        <Bot size={16} /> AI Settings
      </Button>
      <Button variant={activeSection === "custom-css" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "custom-css" && "bg-secondary font-medium")} onClick={() => setActiveSection("custom-css")}>
        <Code size={16} /> Custom CSS
      </Button>
      <Button variant={activeSection === "networking" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "networking" && "bg-secondary font-medium")} onClick={() => setActiveSection("networking")}>
        <Users size={16} /> Networking
      </Button>
      <Button variant={activeSection === "accessibility" ? "secondary" : "ghost"} size="sm" className={cn("justify-start gap-2 text-sm mt-1 mx-3", activeSection === "accessibility" && "bg-secondary font-medium")} onClick={() => setActiveSection("accessibility")}>
        <Accessibility size={16} /> Accessibility
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
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
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
          <div className="grid grid-cols-4 gap-1">
            {templates.map((t) => (
              <button key={t} onClick={() => setTemplate(t)} className={cn("text-[10px] py-1 rounded-md border capitalize transition-colors", template === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted")}>
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
          <input type="range" min={0.8} max={1.5} step={0.1} value={spacing} onChange={(e) => setSpacing(parseFloat(e.target.value))} className="w-full" />
        </div>
      </div>
    </div>
  );
}
