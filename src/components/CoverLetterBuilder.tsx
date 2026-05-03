import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiChat } from "@/utils/aiEngine";
import { Loader2, FileText, Wand2, Download } from "lucide-react";
import { exportToPDF } from "@/utils/exportPdf";

export function CoverLetterBuilder() {
  const resume = useResumeStore((s) => s.resume);
  const [jd, setJd] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Write a professional cover letter for ${resume.personal.fullName}, a ${resume.personal.title}. Resume summary: ${resume.summary}. Key experience: ${resume.experience.map(e => e.role + " at " + e.company).join(", ")}. ${jd ? "Job description: " + jd : ""} Keep it under 300 words. Output only the cover letter text, no markdown.`;
      const result = await aiChat({ messages: [{ role: "user", content: prompt }], temperature: 0.5 });
      setLetter(result);
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const el = document.createElement("div");
    el.innerHTML = `<div style="font-family:system-ui,sans-serif;padding:40px;line-height:1.6;max-width:700px;margin:0 auto;"><p style="margin-bottom:20px;">${resume.personal.fullName}<br>${resume.personal.email}<br>${resume.personal.phone}<br>${resume.personal.location}</p><p style="margin-bottom:20px;">${new Date().toLocaleDateString()}</p><div>${letter.replace(/\n/g, "<br>")}</div></div>`;
    document.body.appendChild(el);
    exportToPDF(el.id, "cover-letter").then(() => document.body.removeChild(el));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText size={20} /> Cover Letter Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job description (optional)..." rows={4} />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Wand2 size={16} className="mr-1" />}
          Generate Cover Letter
        </Button>
        {letter && (
          <>
            <Textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={12} className="font-serif text-sm" />
            <Button variant="outline" size="sm" onClick={handleExport}><Download size={14} className="mr-1" /> Export PDF</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
