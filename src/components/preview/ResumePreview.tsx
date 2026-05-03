import { useRef, useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/utils/exportPdf";
import { exportToDOCX } from "@/utils/exportDocx";
import { exportToMarkdown } from "@/utils/exportMarkdown";
import { encodeResumeToUrl } from "@/utils/shareLink";
import { Download, FileJson, RotateCcw, FileText, Share2, CheckCircle, FileCode } from "lucide-react";
import { TemplateModern } from "./TemplateModern";
import { TemplateClassic } from "./TemplateClassic";
import { TemplateMinimal } from "./TemplateMinimal";
import { TemplateSidebar } from "./TemplateSidebar";
import { TemplateExecutive } from "./TemplateExecutive";
import { TemplateCreative } from "./TemplateCreative";
import { TemplateCompact } from "./TemplateCompact";
import { TemplateElegant } from "./TemplateElegant";

export function ResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const resetResume = useResumeStore((s) => s.resetResume);
  const loadResume = useResumeStore((s) => s.loadResume);
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleExportPDF = () => exportToPDF("resume-preview-content", resume.title || "resume", resume.darkMode);

  const handleExportDOCX = async () => {
    const blob = await exportToDOCX(resume);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.title || "resume"}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const md = exportToMarkdown(resume);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.title || "resume"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.title || "resume"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { loadResume(JSON.parse(String(ev.target?.result || "{}"))); }
      catch { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleShare = () => {
    navigator.clipboard.writeText(encodeResumeToUrl(resume)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const paperStyles: Record<string, React.CSSProperties> = {
    a4: { width: "210mm", minHeight: "297mm" },
    letter: { width: "216mm", minHeight: "279mm" },
    legal: { width: "216mm", minHeight: "356mm" },
  };

  const templates: Record<string, React.FC<{ resume: typeof resume }>> = {
    modern: TemplateModern, classic: TemplateClassic, minimal: TemplateMinimal,
    sidebar: TemplateSidebar, executive: TemplateExecutive, creative: TemplateCreative,
    compact: TemplateCompact, elegant: TemplateElegant,
  };

  const TemplateComponent = templates[resume.template] || TemplateModern;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button id="export-pdf-btn" variant="outline" size="sm" onClick={handleExportPDF}><Download size={16} className="mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportDOCX}><FileText size={16} className="mr-1" /> Word</Button>
          <Button variant="outline" size="sm" onClick={handleExportMarkdown}><FileCode size={16} className="mr-1" /> MD</Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}><FileJson size={16} className="mr-1" /> JSON</Button>
          <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-muted h-8 px-3 cursor-pointer text-xs">
            Import JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? <CheckCircle size={16} className="mr-1 text-green-600" /> : <Share2 size={16} className="mr-1" />}
            {copied ? "Copied!" : "Share"}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetResume} className="text-muted-foreground"><RotateCcw size={14} className="mr-1" /> Reset</Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 bg-muted flex justify-center" id="resume-preview-container">
        <div className="a4-page" ref={previewRef} style={{ ...paperStyles[resume.paperSize], lineHeight: resume.spacing, backgroundColor: resume.darkMode ? "#0f172a" : "#ffffff", color: resume.darkMode ? "#e2e8f0" : "inherit" }}>
          {resume.customCss && <style>{resume.customCss}</style>}
          <div id="resume-preview-content">
            <TemplateComponent resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
