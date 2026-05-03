import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Award as AwardIcon } from "lucide-react";
import type { Award } from "@/types/resume";

function AwardItem({ award }: { award: Award }) {
  const update = useResumeStore((s) => s.updateAward);
  const remove = useResumeStore((s) => s.removeAward);
  return (
    <div className="border rounded-lg p-4 bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={award.title} onChange={(e) => update(award.id, { title: e.target.value })} placeholder="Award Title" /></div>
        <div className="space-y-1"><Label className="text-xs">Issuer</Label><Input value={award.issuer} onChange={(e) => update(award.id, { issuer: e.target.value })} placeholder="Issuer" /></div>
        <div className="space-y-1"><Label className="text-xs">Date</Label><Input type="month" value={award.date} onChange={(e) => update(award.id, { date: e.target.value })} /></div>
        <div className="space-y-1 sm:col-span-2"><Label className="text-xs">Description</Label><Textarea value={award.description} onChange={(e) => update(award.id, { description: e.target.value })} placeholder="Description" rows={2} /></div>
      </div>
      <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => remove(award.id)}><Trash2 size={14} className="mr-1" /> Remove</Button></div>
    </div>
  );
}

export function AwardsForm() {
  const awards = useResumeStore((s) => s.resume.awards);
  const add = useResumeStore((s) => s.addAward);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2">
          <AwardIcon size={18} />
          Awards & Honors
        </CardTitle>
        <Button size="sm" onClick={add}><Plus size={16} className="mr-1" /> Add</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {awards.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <AwardIcon size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No awards yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add honors, awards, or recognitions you&apos;ve received</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={add}>
              <Plus size={14} className="mr-1" /> Add Award
            </Button>
          </div>
        )}
        {awards.map((a) => <AwardItem key={a.id} award={a} />)}
      </CardContent>
    </Card>
  );
}
