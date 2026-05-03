import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, ShieldCheck } from "lucide-react";
import type { Certification } from "@/types/resume";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function CertificationItem({ cert }: { cert: Certification }) {
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cert.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-start gap-2">
        <button className="mt-1 text-muted-foreground cursor-grab hover:text-foreground transition-colors" {...attributes} {...listeners}>
          <GripVertical size={18} />
        </button>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Certification Name</Label>
            <Input value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Issuer</Label>
            <Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Date</Label>
            <Input type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Credential Link</Label>
            <Input value={cert.link} onChange={(e) => updateCertification(cert.id, { link: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive shrink-0 hover:bg-destructive/10" onClick={() => removeCertification(cert.id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export function CertificationsForm() {
  const certifications = useResumeStore((s) => s.resume.certifications);
  const addCertification = useResumeStore((s) => s.addCertification);
  const reorderCertifications = useResumeStore((s) => s.reorderCertifications);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((c) => c.id === active.id);
      const newIndex = certifications.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(certifications, oldIndex, newIndex);
      reorderCertifications(reordered.map((c) => c.id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck size={18} />
          Certifications
        </CardTitle>
        <Button size="sm" onClick={addCertification}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <ShieldCheck size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No certifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add professional certs, licenses, or credentials</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={addCertification}>
              <Plus size={14} className="mr-1" /> Add Certification
            </Button>
          </div>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <CertificationItem key={cert.id} cert={cert} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
