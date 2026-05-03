import { useState, useEffect } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { SectionNav, AppearancePanel } from "@/components/layout/SectionNav";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/forms/SummaryForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { CertificationsForm } from "@/components/forms/CertificationsForm";
import { LanguagesForm } from "@/components/forms/LanguagesForm";
import { ReferencesForm } from "@/components/forms/ReferencesForm";
import { AwardsForm } from "@/components/forms/AwardsForm";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { UploadModal } from "@/components/UploadModal";
import { AISettings } from "@/components/AISettings";
import { JobMatcher } from "@/components/JobMatcher";
import { FullRewrite } from "@/components/FullRewrite";
import { CoverLetterBuilder } from "@/components/CoverLetterBuilder";
import { InterviewPrep } from "@/components/InterviewPrep";
import { InterviewQuestionGenerator } from "@/components/InterviewQuestionGenerator";
import { LinkedInImporter } from "@/components/LinkedInImporter";
import { SmartSuggestionsPanel } from "@/components/SmartSuggestionsPanel";
import { ATSHeatmap } from "@/components/ATSHeatmap";
import { GapNarrative } from "@/components/GapNarrative";
import { PortfolioExporter } from "@/components/PortfolioExporter";
import { RecruiterShare } from "@/components/RecruiterShare";
import { ResumeReview } from "@/components/ResumeReview";
import { CustomCssPanel } from "@/components/CustomCssPanel";
import { AccessibilityChecker } from "@/components/AccessibilityChecker";
import { JobTracker } from "@/components/JobTracker";
import { ResumeBranchManager } from "@/components/ResumeBranchManager";
import { Separator } from "@/components/ui/separator";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { decodeResumeFromUrl } from "@/utils/shareLink";
import { cn } from "@/lib/utils";

function EditorPanel({ onUpload }: { onUpload: () => void }) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const lastSaved = useResumeStore((s) => s.lastSaved);
  const title = useResumeStore((s) => s.resume.title);
  const setTitle = useResumeStore((s) => s.setTitle);

  const timeAgo = () => {
    const diff = Math.floor((Date.now() - lastSaved) / 1000);
    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-bold tracking-tight bg-transparent border-none outline-none p-0 focus:ring-0"
          placeholder="Resume Title"
        />
        <p className="text-xs text-muted-foreground">Saved {timeAgo()}</p>
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
          {activeSection === "certifications" && <CertificationsForm />}
          {activeSection === "languages" && <LanguagesForm />}
          {activeSection === "projects" && <ProjectsForm />}
          {activeSection === "references" && <ReferencesForm />}
          {activeSection === "awards" && <AwardsForm />}
          {activeSection === "volunteer" && <VolunteerForm />}
          {activeSection === "ai-settings" && <AISettings />}
          {activeSection === "ai-tools" && (
            <div className="space-y-4">
              <SmartSuggestionsPanel />
              <ATSHeatmap />
              <GapNarrative />
              <FullRewrite />
              <JobMatcher />
              <CoverLetterBuilder />
              <InterviewQuestionGenerator />
              <InterviewPrep />
            </div>
          )}
          {activeSection === "import" && (
            <div className="space-y-4">
              <LinkedInImporter />
            </div>
          )}
          {activeSection === "share" && (
            <div className="space-y-4">
              <RecruiterShare />
              <PortfolioExporter />
              <ResumeReview />
            </div>
          )}
          {activeSection === "job-tracker" && (
            <div className="space-y-4">
              <JobTracker />
            </div>
          )}
          {activeSection === "branches" && (
            <div className="space-y-4">
              <ResumeBranchManager />
            </div>
          )}
          {activeSection === "custom-css" && <CustomCssPanel />}
          {activeSection === "accessibility" && <AccessibilityChecker />}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const loadResume = useResumeStore((s) => s.loadResume);
  const darkMode = useResumeStore((s) => s.resume.darkMode);
  useKeyboardShortcuts();

  useEffect(() => {
    const shared = decodeResumeFromUrl();
    if (shared) loadResume(shared);
  }, [loadResume]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <>
      <div className={cn("flex h-screen w-screen overflow-hidden", darkMode && "dark")}>
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
