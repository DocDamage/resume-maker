import { useState, useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Trash2, Download, Send } from "lucide-react";

interface Comment {
  id: string;
  section: string;
  text: string;
  author: string;
  date: string;
}

function loadComments(resumeId: string): Comment[] {
  try {
    const raw = localStorage.getItem(`resume-comments-${resumeId}`);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveComments(resumeId: string, comments: Comment[]) {
  try {
    localStorage.setItem(`resume-comments-${resumeId}`, JSON.stringify(comments));
  } catch { /* ignore */ }
}

export function ResumeReview() {
  const resume = useResumeStore((s) => s.resume);
  const [comments, setComments] = useState<Comment[]>(() => loadComments(resume.id));
  const [newComment, setNewComment] = useState("");
  const [selectedSection, setSelectedSection] = useState("general");
  const [author, setAuthor] = useState("Reviewer");

  const sections = useMemo(() => {
    const base = [
      { id: "general", label: "General" },
      { id: "personal", label: "Personal Info" },
      { id: "summary", label: "Summary" },
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "certifications", label: "Certifications" },
      { id: "languages", label: "Languages" },
      { id: "awards", label: "Awards" },
      { id: "volunteer", label: "Volunteer" },
      { id: "references", label: "References" },
    ];
    resume.customSections.forEach((cs) => {
      base.push({ id: cs.id, label: cs.name });
    });
    return base;
  }, [resume.customSections]);

  const handleAdd = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      section: selectedSection,
      text: newComment.trim(),
      author,
      date: new Date().toISOString(),
    };
    const updated = [...comments, comment];
    setComments(updated);
    saveComments(resume.id, updated);
    setNewComment("");
  };

  const handleDelete = (id: string) => {
    const updated = comments.filter((c) => c.id !== id);
    setComments(updated);
    saveComments(resume.id, updated);
  };

  const handleExport = () => {
    const lines: string[] = [];
    lines.push(`# Review: ${resume.personal.fullName}'s Resume`);
    lines.push("");
    sections.forEach((sec) => {
      const secComments = comments.filter((c) => c.section === sec.id);
      if (secComments.length > 0) {
        lines.push(`## ${sec.label}`);
        secComments.forEach((c) => {
          lines.push(`- **${c.author}** (${new Date(c.date).toLocaleDateString()}): ${c.text}`);
        });
        lines.push("");
      }
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `review-${resume.personal.fullName.replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Comment[]>();
    sections.forEach((s) => map.set(s.id, []));
    comments.forEach((c) => {
      const existing = map.get(c.section) || [];
      existing.push(c);
      map.set(c.section, existing);
    });
    return map;
  }, [comments, sections]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare size={18} />
          Resume Review
          <Badge variant="secondary" className="ml-auto text-[10px]">{comments.length} comments</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="text-sm px-2 py-1 rounded border w-28"
          />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="text-sm px-2 py-1 rounded border flex-1 bg-background"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add feedback about this section..."
          rows={3}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAdd} disabled={!newComment.trim()}>
            <Send size={14} className="mr-1" /> Add Comment
          </Button>
          {comments.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={14} className="mr-1" /> Export Review
            </Button>
          )}
        </div>

        {comments.length > 0 && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {sections.map((sec) => {
              const secComments = grouped.get(sec.id) || [];
              if (secComments.length === 0) return null;
              return (
                <div key={sec.id}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {sec.label}
                  </div>
                  <div className="space-y-1.5">
                    {secComments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2 p-2 rounded-md border text-sm">
                        <div className="flex-1">
                          <p>{c.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {c.author} • {new Date(c.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
