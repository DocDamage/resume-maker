import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Palette,
  Type,
  LayoutTemplate,
  Upload,
  Bot,
} from "lucide-react";

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
];

interface SectionNavProps {
  onUpload: () => void;
}

export function SectionNav({ onUpload }: SectionNavProps) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);

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
            className={cn(
              "justify-start gap-2 text-sm",
              isActive && "bg-secondary font-medium"
            )}
            onClick={() => setActiveSection(section.id)}
          >
            <Icon size={16} />
            {section.label}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        className="justify-start gap-2 text-sm mt-2 mx-3"
        onClick={onUpload}
      >
        <Upload size={16} />
        Upload Resume
      </Button>

      <Button
        variant={activeSection === "ai-settings" ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "justify-start gap-2 text-sm mt-1 mx-3",
          activeSection === "ai-settings" && "bg-secondary font-medium"
        )}
        onClick={() => setActiveSection("ai-settings")}
      >
        <Bot size={16} />
        AI Settings
      </Button>
    </div>
  );
}

export function AppearancePanel() {
  const template = useResumeStore((s) => s.resume.template);
  const accentColor = useResumeStore((s) => s.resume.accentColor);
  const font = useResumeStore((s) => s.resume.font);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFont = useResumeStore((s) => s.setFont);

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
          <div className="flex gap-1">
            {(["modern", "classic", "minimal", "sidebar", "executive", "creative", "compact", "elegant"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-md border capitalize transition-colors",
                  template === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Palette size={12} /> Accent Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-8 w-8 rounded-md border cursor-pointer p-0"
            />
            <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Type size={12} /> Font
          </label>
          <div className="flex gap-1">
            {(["sans", "serif"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-md border capitalize transition-colors",
                  font === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
