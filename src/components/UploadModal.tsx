import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { extractText } from "@/utils/extractText";
import { parseResumeWithAI } from "@/utils/aiParser";
import { useResumeStore } from "@/stores/resumeStore";
import { Upload, FileText, Loader2, Sparkles, Type, AlertCircle } from "lucide-react";
import type { Resume } from "@/types/resume";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function UploadModal({ open, onClose }: UploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadResume = useResumeStore((s) => s.loadResume);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      setError("");
      const file = e.dataTransfer.files[0];
      if (file) await processFile(file);
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsExtracting(true);
    setError("");
    try {
      const text = await extractText(file);
      setExtractedText(text);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAIParse = async () => {
    setIsParsing(true);
    setError("");
    try {
      const parsed = await parseResumeWithAI(extractedText);
      const resume = buildResumeFromParsed(parsed);
      loadResume(resume);
      setExtractedText("");
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsParsing(false);
    }
  };

  const handleManualImport = () => {
    const resume = buildResumeFromText(extractedText);
    loadResume(resume);
    setExtractedText("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Upload size={20} />
            Upload Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {!extractedText && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}
              `}
            >
              <FileText size={40} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {isExtracting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Extracting text...
                  </span>
                ) : (
                  "Drag & drop a PDF or DOCX file here, or click to browse"
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports .pdf, .docx
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {extractedText && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Type size={14} /> Extracted Text
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => setExtractedText("")}>
                    Upload another
                  </Button>
                </div>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={10}
                  className="text-xs font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Edit the extracted text if needed before importing.
                </p>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleAIParse}
                  disabled={isParsing}
                  className="gap-1"
                >
                  {isParsing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  AI Parse & Import
                </Button>
                <Button variant="outline" onClick={handleManualImport}>
                  Import as Plain Text
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

function buildResumeFromParsed(parsed: Partial<Resume>): Resume {
  const id = crypto.randomUUID();

  return {
    id,
    title: parsed.title || "Imported Resume",
    template: "modern",
    accentColor: "#2563eb",
    font: "sans",
    paperSize: "a4",
    spacing: 1.0,
    darkMode: false,
    photoUrl: undefined,
    sectionOrder: ["summary", "experience", "education", "skills", "certifications", "languages", "projects", "awards", "volunteer", "references"],
    customCss: "",
    personal: {
      fullName: parsed.personal?.fullName || "",
      title: parsed.personal?.title || "",
      email: parsed.personal?.email || "",
      phone: parsed.personal?.phone || "",
      location: parsed.personal?.location || "",
      website: parsed.personal?.website || "",
      linkedin: parsed.personal?.linkedin || "",
    },
    summary: parsed.summary || "",
    experience:
      parsed.experience?.map((exp) => ({
        id: crypto.randomUUID(),
        company: exp.company || "",
        role: exp.role || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.current || false,
        description: Array.isArray(exp.description)
          ? exp.description
          : [exp.description || ""],
      })) || [],
    education:
      parsed.education?.map((edu) => ({
        id: crypto.randomUUID(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: edu.gpa || "",
      })) || [],
    skills:
      parsed.skills?.map((cat) => ({
        id: crypto.randomUUID(),
        category: cat.category || "Skills",
        skills: cat.skills || [],
      })) || [],
    projects:
      parsed.projects?.map((proj) => ({
        id: crypto.randomUUID(),
        name: proj.name || "",
        description: proj.description || "",
        link: proj.link || "",
      })) || [],
    certifications: parsed.certifications?.map((cert) => ({ ...cert, id: crypto.randomUUID() })) || [],
    languages: parsed.languages?.map((lang) => ({ ...lang, id: crypto.randomUUID() })) || [],
    references: parsed.references?.map((ref) => ({ ...ref, id: crypto.randomUUID() })) || [],
    awards: parsed.awards?.map((a) => ({ ...a, id: crypto.randomUUID() })) || [],
    volunteer: parsed.volunteer?.map((v) => ({ ...v, id: crypto.randomUUID(), description: Array.isArray(v.description) ? v.description : [v.description || ""] })) || [],
    customSections: [],
    visibility: {
      summary: true, experience: true, education: true, skills: true,
      certifications: true, languages: true, projects: true,
      references: true, awards: true, volunteer: true,
    },
  };
}

function buildResumeFromText(text: string): Resume {
  const id = crypto.randomUUID();
  return {
    id,
    title: "Imported Resume",
    template: "modern",
    accentColor: "#2563eb",
    font: "sans",
    paperSize: "a4",
    spacing: 1.0,
    darkMode: false,
    photoUrl: undefined,
    sectionOrder: ["summary", "experience", "education", "skills", "certifications", "languages", "projects", "awards", "volunteer", "references"],
    customCss: "",
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
    },
    summary: text,
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    references: [],
    awards: [],
    volunteer: [],
    customSections: [],
    visibility: {
      summary: true, experience: true, education: true, skills: true,
      certifications: true, languages: true, projects: true,
      references: true, awards: true, volunteer: true,
    },
  };
}
