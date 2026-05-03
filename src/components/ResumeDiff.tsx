import { useState } from "react";
import { useMultiResumeStore } from "@/stores/multiResumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, ArrowRight, Plus, Minus, Pencil } from "lucide-react";

type DiffType = "added" | "removed" | "changed" | "same";

interface DiffItem {
  type: DiffType;
  section: string;
  label: string;
  old?: string;
  new?: string;
}

function diffStrings(oldStr: string, newStr: string): DiffType {
  if (oldStr === newStr) return "same";
  if (!oldStr && newStr) return "added";
  if (oldStr && !newStr) return "removed";
  return "changed";
}

function generateDiff(leftId: string, rightId: string, store: ReturnType<typeof useMultiResumeStore.getState>): DiffItem[] {
  const left = store.resumes.find((r) => r.id === leftId);
  const right = store.resumes.find((r) => r.id === rightId);
  if (!left || !right) return [];

  const diffs: DiffItem[] = [];

  // Personal
  if (left.personal.fullName !== right.personal.fullName) {
    diffs.push({ type: "changed", section: "Personal", label: "Name", old: left.personal.fullName, new: right.personal.fullName });
  }
  if (left.personal.title !== right.personal.title) {
    diffs.push({ type: "changed", section: "Personal", label: "Title", old: left.personal.title, new: right.personal.title });
  }

  // Summary
  const sumDiff = diffStrings(left.summary, right.summary);
  if (sumDiff !== "same") {
    diffs.push({ type: sumDiff, section: "Summary", label: "Summary", old: left.summary, new: right.summary });
  }

  // Experience
  const leftExp = left.experience.map((e) => `${e.role} at ${e.company}`);
  const rightExp = right.experience.map((e) => `${e.role} at ${e.company}`);
  rightExp.forEach((r) => {
    if (!leftExp.includes(r)) diffs.push({ type: "added", section: "Experience", label: r });
  });
  leftExp.forEach((l) => {
    if (!rightExp.includes(l)) diffs.push({ type: "removed", section: "Experience", label: l });
  });

  // Skills
  const leftSkills = left.skills.flatMap((s) => s.skills);
  const rightSkills = right.skills.flatMap((s) => s.skills);
  rightSkills.forEach((r) => {
    if (!leftSkills.includes(r)) diffs.push({ type: "added", section: "Skills", label: r });
  });
  leftSkills.forEach((l) => {
    if (!rightSkills.includes(l)) diffs.push({ type: "removed", section: "Skills", label: l });
  });

  // Education
  const leftEdu = left.education.map((e) => `${e.degree} at ${e.institution}`);
  const rightEdu = right.education.map((e) => `${e.degree} at ${e.institution}`);
  rightEdu.forEach((r) => {
    if (!leftEdu.includes(r)) diffs.push({ type: "added", section: "Education", label: r });
  });
  leftEdu.forEach((l) => {
    if (!rightEdu.includes(l)) diffs.push({ type: "removed", section: "Education", label: l });
  });

  // Template / appearance
  if (left.template !== right.template) {
    diffs.push({ type: "changed", section: "Appearance", label: "Template", old: left.template, new: right.template });
  }
  if (left.accentColor !== right.accentColor) {
    diffs.push({ type: "changed", section: "Appearance", label: "Accent Color", old: left.accentColor, new: right.accentColor });
  }

  return diffs;
}

export function ResumeDiff() {
  const store = useMultiResumeStore();
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  // Ensure loaded
  useState(() => { store.loadAll(); });

  const diffs = leftId && rightId ? generateDiff(leftId, rightId, store) : [];
  const hasChanges = diffs.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitCompare size={18} />
          Compare Branches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {store.resumes.length < 2 ? (
          <p className="text-sm text-muted-foreground">Save at least two branches in the Branches panel to compare them.</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <select
                value={leftId}
                onChange={(e) => setLeftId(e.target.value)}
                className="flex-1 text-sm px-2 py-1.5 rounded border bg-background"
              >
                <option value="">Select branch...</option>
                {store.resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
              <ArrowRight size={16} className="text-muted-foreground" />
              <select
                value={rightId}
                onChange={(e) => setRightId(e.target.value)}
                className="flex-1 text-sm px-2 py-1.5 rounded border bg-background"
              >
                <option value="">Select branch...</option>
                {store.resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            {leftId && rightId && (
              <div className="space-y-2">
                {!hasChanges ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">No differences found between these branches.</div>
                ) : (
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {diffs.map((d, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2 rounded-md text-sm border ${
                        d.type === "added" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" :
                        d.type === "removed" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
                        d.type === "changed" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" :
                        "border-border"
                      }`}>
                        {d.type === "added" && <Plus size={14} className="shrink-0 mt-0.5 text-green-600" />}
                        {d.type === "removed" && <Minus size={14} className="shrink-0 mt-0.5 text-red-600" />}
                        {d.type === "changed" && <Pencil size={14} className="shrink-0 mt-0.5 text-yellow-600" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[9px] h-auto py-0 px-1">{d.section}</Badge>
                            <span className="font-medium">{d.label}</span>
                          </div>
                          {d.type === "changed" && (
                            <div className="mt-1 space-y-0.5 text-xs">
                              <p className="text-muted-foreground line-through">{d.old}</p>
                              <p className="text-foreground">{d.new}</p>
                            </div>
                          )}
                          {d.type === "added" && <p className="text-xs text-green-700 mt-0.5">{d.new || d.label}</p>}
                          {d.type === "removed" && <p className="text-xs text-red-700 mt-0.5">{d.old || d.label}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Plus size={10} className="text-green-600" /> {diffs.filter((d) => d.type === "added").length} added</span>
                  <span className="flex items-center gap-1"><Minus size={10} className="text-red-600" /> {diffs.filter((d) => d.type === "removed").length} removed</span>
                  <span className="flex items-center gap-1"><Pencil size={10} className="text-yellow-600" /> {diffs.filter((d) => d.type === "changed").length} changed</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
