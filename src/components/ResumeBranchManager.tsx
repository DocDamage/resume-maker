import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { useMultiResumeStore } from "@/stores/multiResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Save, Trash2, CheckCircle, Copy } from "lucide-react";

export function ResumeBranchManager() {
  const resume = useResumeStore((s) => s.resume);
  const loadResume = useResumeStore((s) => s.loadResume);
  const multiStore = useMultiResumeStore();
  const [branchName, setBranchName] = useState("");

  // Ensure loaded on mount
  useState(() => {
    multiStore.loadAll();
  });

  const handleSaveBranch = () => {
    const name = branchName.trim() || `${resume.title} (Copy)`;
    const branch = { ...resume, id: crypto.randomUUID(), title: name };
    multiStore.addResume(branch);
    setBranchName("");
  };

  const handleSwitch = (id: string) => {
    const target = multiStore.resumes.find((r) => r.id === id);
    if (target) {
      loadResume(target);
      multiStore.setActiveId(id);
    }
  };

  const handleDelete = (id: string) => {
    multiStore.removeResume(id);
  };

  const isActive = (id: string) => multiStore.activeId === id || resume.id === id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitBranch size={18} />
          Resume Branches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Branch name (e.g., 'Google-SRE')"
            className="flex-1"
          />
          <Button size="sm" onClick={handleSaveBranch}>
            <Save size={14} className="mr-1" /> Save
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {multiStore.resumes.length === 0 && (
            <p className="text-sm text-muted-foreground">No saved branches yet. Save your first branch above.</p>
          )}
          {multiStore.resumes.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between p-2 rounded-md border text-sm ${
                isActive(r.id) ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isActive(r.id) && <CheckCircle size={14} className="text-primary shrink-0" />}
                <span className="truncate font-medium">{r.title}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {r.template}
                </Badge>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleSwitch(r.id)}
                >
                  <Copy size={12} className="mr-1" /> Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
