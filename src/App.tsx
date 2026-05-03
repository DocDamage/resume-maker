import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { SectionNav, AppearancePanel } from "@/components/layout/SectionNav";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/forms/SummaryForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { UploadModal } from "@/components/UploadModal";
import { AISettings } from "@/components/AISettings";
import { Separator } from "@/components/ui/separator";

function EditorPanel({ onUpload }: { onUpload: () => void }) {
  const activeSection = useResumeStore((s) => s.activeSection);

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold tracking-tight">Resume Builder</h1>
        <p className="text-xs text-muted-foreground">Build, upload, and improve your resume</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SectionNav onUpload={onUpload} />
        <AppearancePanel />
        <Separator className="my-2" />
        <div className="p-4 space-y-6">
          {activeSection === "personal" && <PersonalInfoForm />}
          {activeSection === "summary" && <SummaryForm />}
          {activeSection === "experience" && <ExperienceForm />}
          {activeSection === "education" && <EducationForm />}
          {activeSection === "skills" && <SkillsForm />}
          {activeSection === "projects" && <ProjectsForm />}
          {activeSection === "ai-settings" && <AISettings />}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="w-[420px] min-w-[320px] max-w-[40vw] flex-shrink-0 h-full">
          <EditorPanel onUpload={() => setUploadOpen(true)} />
        </div>
        <div className="flex-1 h-full">
          <ResumePreview />
        </div>
      </div>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
