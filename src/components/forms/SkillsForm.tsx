import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X, Wrench } from "lucide-react";
import { AIImproveButton } from "@/components/AIImproveButton";

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);

  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  const handleKeyDown = (categoryId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = newSkillInputs[categoryId]?.trim();
      if (value) {
        addSkill(categoryId, value);
        setNewSkillInputs((prev) => ({ ...prev, [categoryId]: "" }));
      }
    }
  };

  const skillsText = skills
    .map((cat) => `${cat.category}: ${cat.skills.join(", ")}`)
    .join("\n");

  const handleSkillsImproved = (result: string) => {
    try {
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed)) {
        parsed.forEach((cat: { category: string; skills: string[] }) => {
          const existing = skills.find((s) => s.category === cat.category);
          if (existing) {
            updateSkillCategory(existing.id, {
              skills: cat.skills,
            });
          } else {
            const id = crypto.randomUUID();
            updateSkillCategory(id, {
              category: cat.category,
              skills: cat.skills,
            });
          }
        });
      }
    } catch {
      // ignore parse errors
    }
  };

  const totalSkills = skills.reduce((acc, s) => acc + s.skills.length, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wrench size={18} />
          Skills
          {totalSkills > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {totalSkills} total
            </span>
          )}
        </CardTitle>
        <div className="flex gap-2">
          <AIImproveButton
            type="skills"
            content={skillsText}
            onImproved={handleSkillsImproved}
          />
          <Button size="sm" onClick={addSkillCategory}>
            <Plus size={16} className="mr-1" /> Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {skills.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Wrench size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No skill categories yet</p>
            <p className="text-xs text-muted-foreground mt-1">Group your skills by category (e.g., Languages, Frameworks, Tools)</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={addSkillCategory}>
              <Plus size={14} className="mr-1" /> Add Category
            </Button>
          </div>
        )}
        {skills.map((category) => (
          <div key={category.id} className="border rounded-lg p-4 bg-card space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Input
                value={category.category}
                onChange={(e) =>
                  updateSkillCategory(category.id, { category: e.target.value })
                }
                placeholder="Category name"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0 hover:bg-destructive/10"
                onClick={() => removeSkillCategory(category.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1 text-xs">
                  {skill}
                  <button
                    onClick={() => removeSkill(category.id, skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              {category.skills.length === 0 && (
                <span className="text-xs text-muted-foreground italic">No skills added yet</span>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Add Skill</Label>
              <Input
                value={newSkillInputs[category.id] || ""}
                onChange={(e) =>
                  setNewSkillInputs((prev) => ({
                    ...prev,
                    [category.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => handleKeyDown(category.id, e)}
                placeholder="Type skill and press Enter"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
