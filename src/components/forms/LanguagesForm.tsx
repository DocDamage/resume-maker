import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Language } from "@/types/resume";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function LanguageItem({ lang }: { lang: Language }) {
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lang.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-start gap-2">
        <button className="mt-1 text-muted-foreground cursor-grab" {...attributes} {...listeners}>
          <GripVertical size={18} />
        </button>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Language</Label>
            <Input value={lang.language} onChange={(e) => updateLanguage(lang.id, { language: e.target.value })} placeholder="Spanish" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Proficiency</Label>
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as Language["proficiency"] })}
              className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Conversational">Conversational</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeLanguage(lang.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export function LanguagesForm() {
  const languages = useResumeStore((s) => s.resume.languages);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const reorderLanguages = useResumeStore((s) => s.reorderLanguages);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = languages.findIndex((l) => l.id === active.id);
      const newIndex = languages.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(languages, oldIndex, newIndex);
      reorderLanguages(reordered.map((l) => l.id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Languages</CardTitle>
        <Button size="sm" onClick={addLanguage}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {languages.map((lang) => (
                <LanguageItem key={lang.id} lang={lang} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
