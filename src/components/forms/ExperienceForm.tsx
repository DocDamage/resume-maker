import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Copy, Briefcase } from "lucide-react";
import { AIImproveButton } from "@/components/AIImproveButton";
import { BulletOptimizer } from "@/components/BulletOptimizer";
import type { ExperienceEntry } from "@/types/resume";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function ExperienceItem({ entry }: { entry: ExperienceEntry }) {
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const duplicateExperience = useResumeStore((s) => s.duplicateExperience);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleBulletChange = (index: number, value: string) => {
    const newDesc = [...entry.description];
    newDesc[index] = value;
    updateExperience(entry.id, { description: newDesc });
  };

  const addBullet = () => {
    updateExperience(entry.id, {
      description: [...entry.description, ""],
    });
  };

  const removeBullet = (index: number) => {
    const newDesc = entry.description.filter((_, i) => i !== index);
    updateExperience(entry.id, { description: newDesc });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-muted-foreground cursor-grab hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Company</Label>
            <Input
              value={entry.company}
              onChange={(e) =>
                updateExperience(entry.id, { company: e.target.value })
              }
              placeholder="Company Name"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Role</Label>
            <Input
              value={entry.role}
              onChange={(e) =>
                updateExperience(entry.id, { role: e.target.value })
              }
              placeholder="Job Title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Start Date</Label>
            <Input
              type="month"
              value={entry.startDate}
              onChange={(e) =>
                updateExperience(entry.id, { startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Date</Label>
            <Input
              type="month"
              value={entry.current ? "" : entry.endDate}
              disabled={entry.current}
              onChange={(e) =>
                updateExperience(entry.id, { endDate: e.target.value })
              }
            />
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) =>
                  updateExperience(entry.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : entry.endDate,
                  })
                }
                className="rounded border-border text-primary focus:ring-primary"
              />
              I currently work here
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => duplicateExperience(entry.id)}
            title="Duplicate"
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={() => removeExperience(entry.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2 pl-7">
        <Label className="text-xs">Description</Label>
        {entry.description.map((bullet, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground text-xs mt-2">•</span>
              <textarea
                value={bullet}
                onChange={(e) => handleBulletChange(i, e.target.value)}
                placeholder="Describe your achievement or responsibility..."
                rows={2}
                className="flex-1 min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              />
              <div className="flex flex-col gap-1 shrink-0">
                <AIImproveButton
                  type="bullet"
                  content={bullet}
                  onImproved={(text) => handleBulletChange(i, text)}
                  size="sm"
                  className="shrink-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive shrink-0 hover:bg-destructive/10"
                  onClick={() => removeBullet(i)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <div className="pl-4">
              <BulletOptimizer
                bullet={bullet}
                context={{ company: entry.company, role: entry.role }}
                onReplace={(text) => handleBulletChange(i, text)}
              />
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addBullet} className="text-xs">
          <Plus size={14} className="mr-1" /> Add bullet
        </Button>
      </div>
    </div>
  );
}

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resume.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const reorderExperience = useResumeStore((s) => s.reorderExperience);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = experience.findIndex((e) => e.id === active.id);
      const newIndex = experience.findIndex((e) => e.id === over.id);
      const reordered = arrayMove(experience, oldIndex, newIndex);
      reorderExperience(reordered.map((e) => e.id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <Briefcase size={18} />
          Experience
        </CardTitle>
        <Button size="sm" onClick={addExperience}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Briefcase size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No experience entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your work history to get started</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={addExperience}>
              <Plus size={14} className="mr-1" /> Add Experience
            </Button>
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experience.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {experience.map((entry) => (
                <ExperienceItem key={entry.id} entry={entry} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
