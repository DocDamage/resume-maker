import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Copy } from "lucide-react";
import type { EducationEntry } from "@/types/resume";
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

function EducationItem({ entry }: { entry: EducationEntry }) {
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const duplicateEducation = useResumeStore((s) => s.duplicateEducation);

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
            <Label className="text-xs">Institution</Label>
            <Input
              value={entry.institution}
              onChange={(e) =>
                updateEducation(entry.id, { institution: e.target.value })
              }
              placeholder="University Name"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Degree</Label>
            <Input
              value={entry.degree}
              onChange={(e) =>
                updateEducation(entry.id, { degree: e.target.value })
              }
              placeholder="Bachelor of Science"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Field of Study</Label>
            <Input
              value={entry.field}
              onChange={(e) =>
                updateEducation(entry.id, { field: e.target.value })
              }
              placeholder="Computer Science"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">GPA</Label>
            <Input
              value={entry.gpa}
              onChange={(e) =>
                updateEducation(entry.id, { gpa: e.target.value })
              }
              placeholder="3.8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Start Date</Label>
            <Input
              type="month"
              value={entry.startDate}
              onChange={(e) =>
                updateEducation(entry.id, { startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Date</Label>
            <Input
              type="month"
              value={entry.endDate}
              onChange={(e) =>
                updateEducation(entry.id, { endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => duplicateEducation(entry.id)}
            title="Duplicate"
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => removeEducation(entry.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EducationForm() {
  const education = useResumeStore((s) => s.resume.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const reorderEducation = useResumeStore((s) => s.reorderEducation);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((e) => e.id === active.id);
      const newIndex = education.findIndex((e) => e.id === over.id);
      const reordered = arrayMove(education, oldIndex, newIndex);
      reorderEducation(reordered.map((e) => e.id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button size="sm" onClick={addEducation}>
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
            items={education.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {education.map((entry) => (
                <EducationItem key={entry.id} entry={entry} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
