import { useRef, useState, useEffect } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/utils/exportPdf";
import { exportToDOCX } from "@/utils/exportDocx";
import { exportToMarkdown } from "@/utils/exportMarkdown";
import { encodeResumeToUrl } from "@/utils/shareLink";
import { cn } from "@/lib/utils";
import { Download, FileJson, RotateCcw, FileText, Share2, CheckCircle, FileCode, FileType, ExternalLink, MoreHorizontal } from "lucide-react";
import { TemplateModern } from "./TemplateModern";
import { TemplateClassic } from "./TemplateClassic";
import { TemplateMinimal } from "./TemplateMinimal";
import { TemplateSidebar } from "./TemplateSidebar";
import { TemplateExecutive } from "./TemplateExecutive";
import { TemplateCreative } from "./TemplateCreative";
import { TemplateCompact } from "./TemplateCompact";
import { TemplateElegant } from "./TemplateElegant";
import { TemplateTechnical } from "./TemplateTechnical";
import { TemplateAcademic } from "./TemplateAcademic";
import { exportToPlainText } from "@/utils/exportPlainText";
import { exportToGoogleDocs } from "@/utils/exportGoogleDocs";

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
      catch {
        // Show a temporary inline error instead of alert
        const el = document.getElementById("import-error");
        if (el) { el.textContent = "Invalid JSON file"; el.classList.remove("hidden"); setTimeout(() => el.classList.add("hidden"), 3000); }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportPlainText = () => {
    const text = exportToPlainText(resume);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.title || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGoogleDocs = () => {
    exportToGoogleDocs(resume);
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
    compact: TemplateCompact, elegant: TemplateElegant, technical: TemplateTechnical, academic: TemplateAcademic,
  };

  const TemplateComponent = templates[resume.template] || TemplateModern;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button id="export-pdf-btn" variant="default" size="sm" onClick={handleExportPDF} className="shadow-sm">
            <Download size={15} className="mr-1" /> PDF
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="outline" size="sm" onClick={handleExportDOCX} title="Word">
            <FileText size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportMarkdown} title="Markdown">
            <FileCode size={14} />
          </Button>
          <ExportDropdown
            onPlainText={handleExportPlainText}
            onJSON={handleExportJSON}
            onGoogleDocs={handleExportGoogleDocs}
            onImport={handleImportJSON}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={handleShare} className={cn(copied && "border-green-500 text-green-600")}>
            {copied ? <CheckCircle size={14} className="mr-1" /> : <Share2 size={14} className="mr-1" />}
            {copied ? "Copied!" : "Share"}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetResume} className="text-muted-foreground hover:text-destructive">
            <RotateCcw size={13} className="mr-1" /> Reset
          </Button>
        </div>
      </div>
      <div id="import-error" className="hidden fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground text-xs px-3 py-1.5 rounded-md shadow-lg">
        Invalid JSON file
      </div>
      <div className="flex-1 overflow-auto p-6 bg-muted flex justify-center" id="resume-preview-container">
        <div className="a4-page" ref={previewRef} style={{ ...paperStyles[resume.paperSize], lineHeight: resume.spacing, backgroundColor: resume.darkMode ? "#0f172a" : "#ffffff", color: resume.darkMode ? "#e2e8f0" : "inherit" }}>
          {resume.customCss && <style>{resume.customCss}</style>}
          <style>{`
            @media print {
              #resume-preview-container { background: white !important; padding: 0 !important; overflow: visible !important; }
              .a4-page { box-shadow: none !important; margin: 0 !important; width: 100% !important; min-height: auto !important; }
              #export-pdf-btn { display: none !important; }
              button, nav, .no-print { display: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}</style>
          <div id="resume-preview-content">
            <TemplateComponent resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}


function ExportDropdown({
  onPlainText,
  onJSON,
  onGoogleDocs,
  onImport,
}: {
  onPlainText: () => void;
  onJSON: () => void;
  onGoogleDocs: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} title="More exports">
        <MoreHorizontal size={14} />
      </Button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 rounded-md border bg-popover shadow-lg z-50 p-1 space-y-0.5">
          <button onClick={() => { onPlainText(); setOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors text-left">
            <FileType size={14} /> Plain Text
          </button>
          <button onClick={() => { onJSON(); setOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors text-left">
            <FileJson size={14} /> JSON
          </button>
          <button onClick={() => { onGoogleDocs(); setOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors text-left">
            <ExternalLink size={14} /> Google Docs
          </button>
          <div className="h-px bg-border my-1" />
          <label className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-muted transition-colors text-left cursor-pointer">
            <UploadIcon size={14} /> Import JSON
            <input type="file" accept=".json" className="hidden" onChange={(e) => { onImport(e); setOpen(false); }} />
          </label>
        </div>
      )}
    </div>
  );
}

function UploadIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
  );
}
