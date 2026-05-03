import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { VolunteerEntry } from "@/types/resume";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function VolunteerItem({ entry }: { entry: VolunteerEntry }) {
  const update = useResumeStore((s) => s.updateVolunteer);
  const remove = useResumeStore((s) => s.removeVolunteer);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const handleBulletChange = (index: number, value: string) => {
    const newDesc = [...entry.description]; newDesc[index] = value;
    update(entry.id, { description: newDesc });
  };
  const addBullet = () => update(entry.id, { description: [...entry.description, ""] });
  const removeBullet = (index: number) => {
    const newDesc = entry.description.filter((_, i) => i !== index);
    update(entry.id, { description: newDesc });
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-start gap-2">
        <button className="mt-1 text-muted-foreground cursor-grab" {...attributes} {...listeners}><GripVertical size={18} /></button>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1"><Label className="text-xs">Organization</Label><Input value={entry.organization} onChange={(e) => update(entry.id, { organization: e.target.value })} placeholder="Organization" /></div>
          <div className="space-y-1"><Label className="text-xs">Role</Label><Input value={entry.role} onChange={(e) => update(entry.id, { role: e.target.value })} placeholder="Role" /></div>
          <div className="space-y-1"><Label className="text-xs">Start Date</Label><Input type="month" value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} /></div>
          <div className="space-y-1"><Label className="text-xs">End Date</Label><Input type="month" value={entry.current ? "" : entry.endDate} disabled={entry.current} onChange={(e) => update(entry.id, { endDate: e.target.value })} />
            <label className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><input type="checkbox" checked={entry.current} onChange={(e) => update(entry.id, { current: e.target.checked, endDate: e.target.checked ? "" : entry.endDate })} /> Current</label>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => remove(entry.id)}><Trash2 size={16} /></Button>
      </div>
      <div className="space-y-2 pl-7">
        <Label className="text-xs">Description</Label>
        {entry.description.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">•</span>
            <Input value={bullet} onChange={(e) => handleBulletChange(i, e.target.value)} placeholder="Describe your contribution" className="text-sm" />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeBullet(i)}><Trash2 size={14} /></Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addBullet} className="text-xs"><Plus size={14} className="mr-1" /> Add bullet</Button>
      </div>
    </div>
  );
}

export function VolunteerForm() {
  const volunteer = useResumeStore((s) => s.resume.volunteer);
  const add = useResumeStore((s) => s.addVolunteer);
  const reorder = useResumeStore((s) => s.reorderVolunteer);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = volunteer.findIndex((v) => v.id === active.id);
      const newIndex = volunteer.findIndex((v) => v.id === over.id);
      const reordered = arrayMove(volunteer, oldIndex, newIndex);
      reorder(reordered.map((v) => v.id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Volunteer Work</CardTitle>
        <Button size="sm" onClick={add}><Plus size={16} className="mr-1" /> Add</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={volunteer.map((v) => v.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">{volunteer.map((entry) => <VolunteerItem key={entry.id} entry={entry} />)}</div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
