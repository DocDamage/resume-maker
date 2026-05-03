import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Copy } from "lucide-react";
import { AIImproveButton } from "@/components/AIImproveButton";
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
      className="border rounded-lg p-4 bg-card space-y-3"
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-muted-foreground cursor-grab"
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
            <label className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) =>
                  updateExperience(entry.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : entry.endDate,
                  })
                }
              />
              Current
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => duplicateExperience(entry.id)}
            title="Duplicate"
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => removeExperience(entry.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-2 pl-7">
        <Label className="text-xs">Description</Label>
        {entry.description.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">•</span>
            <Input
              value={bullet}
              onChange={(e) => handleBulletChange(i, e.target.value)}
              placeholder="Describe your achievement or responsibility"
              className="text-sm"
            />
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
              className="h-7 w-7 text-destructive shrink-0"
              onClick={() => removeBullet(i)}
            >
              <Trash2 size={14} />
            </Button>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <Button size="sm" onClick={addExperience}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
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
