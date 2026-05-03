import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, User } from "lucide-react";
import type { Reference } from "@/types/resume";

function ReferenceItem({ ref }: { ref: Reference }) {
  const update = useResumeStore((s) => s.updateReference);
  const remove = useResumeStore((s) => s.removeReference);
  return (
    <div className="border rounded-lg p-4 bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={ref.name} onChange={(e) => update(ref.id, { name: e.target.value })} placeholder="Name" /></div>
        <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={ref.title} onChange={(e) => update(ref.id, { title: e.target.value })} placeholder="Job Title" /></div>
        <div className="space-y-1"><Label className="text-xs">Company</Label><Input value={ref.company} onChange={(e) => update(ref.id, { company: e.target.value })} placeholder="Company" /></div>
        <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={ref.email} onChange={(e) => update(ref.id, { email: e.target.value })} placeholder="Email" /></div>
        <div className="space-y-1 sm:col-span-2"><Label className="text-xs">Phone</Label><Input value={ref.phone} onChange={(e) => update(ref.id, { phone: e.target.value })} placeholder="Phone" /></div>
      </div>
      <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => remove(ref.id)}><Trash2 size={14} className="mr-1" /> Remove</Button></div>
    </div>
  );
}

export function ReferencesForm() {
  const references = useResumeStore((s) => s.resume.references);
  const add = useResumeStore((s) => s.addReference);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <User size={18} />
          References
        </CardTitle>
        <Button size="sm" onClick={add}><Plus size={16} className="mr-1" /> Add</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {references.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <User size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No references yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add professional references available upon request</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={add}>
              <Plus size={14} className="mr-1" /> Add Reference
            </Button>
          </div>
        )}
        {references.map((r) => <ReferenceItem key={r.id} ref={r} />)}
      </CardContent>
    </Card>
  );
}
