import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, FileText, Briefcase, Upload } from "lucide-react";

export function GettingStarted() {
  const [dismissed, setDismissed] = useState(false);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);
  const resume = useResumeStore((s) => s.resume);

  if (dismissed) return null;

  // Only show for relatively empty resumes
  const hasContent =
    resume.experience.length >= 2 &&
    resume.education.length >= 1 &&
    resume.skills.length >= 1 &&
    resume.summary.length > 50;
  if (hasContent) return null;

  const steps = [
    {
      icon: FileText,
      label: "Fill in your info",
      action: () => setActiveSection("personal"),
      done: resume.personal.fullName && resume.personal.email,
    },
    {
      icon: Briefcase,
      label: "Add experience",
      action: () => setActiveSection("experience"),
      done: resume.experience.length > 0,
    },
    {
      icon: Upload,
      label: "Upload a resume",
      action: () => {
        const evt = new CustomEvent("open-upload");
        window.dispatchEvent(evt);
      },
      done: false,
    },
    {
      icon: Sparkles,
      label: "Try AI tools",
      action: () => setActiveSection("ai-tools"),
      done: false,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Getting Started</h3>
            <p className="text-xs text-muted-foreground">
              {doneCount}/{steps.length} steps completed
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setDismissed(true)}
          >
            <X size={14} />
          </Button>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all rounded-full"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {steps.map((step) => (
            <button
              key={step.label}
              onClick={step.action}
              className={`flex items-center gap-2 text-left text-xs p-2 rounded-md border transition-colors ${
                step.done
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <step.icon size={14} />
              {step.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
