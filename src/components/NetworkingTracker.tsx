import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, Mail, Building2, Calendar } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  linkedin: string;
  relationship: string;
  lastContacted: string;
  notes: string;
  referrals: string[];
}

const STORAGE_KEY = "resume-builder-contacts";

function loadContacts(): Contact[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

function saveContacts(contacts: Contact[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch {}
}

export function NetworkingTracker() {
  const [contacts, setContacts] = useState<Contact[]>(loadContacts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Contact>>({});

  const handleAdd = () => {
    if (!form.name?.trim()) return;
    const contact: Contact = {
      id: crypto.randomUUID(),
      name: form.name || "",
      company: form.company || "",
      role: form.role || "",
      email: form.email || "",
      linkedin: form.linkedin || "",
      relationship: form.relationship || "",
      lastContacted: form.lastContacted || new Date().toISOString().split("T")[0],
      notes: form.notes || "",
      referrals: [],
    };
    const updated = [...contacts, contact];
    setContacts(updated);
    saveContacts(updated);
    setForm({});
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  };

  const addReferral = (contactId: string, company: string) => {
    const updated = contacts.map((c) =>
      c.id === contactId ? { ...c, referrals: [...c.referrals, company] } : c
    );
    setContacts(updated);
    saveContacts(updated);
  };

  const daysSince = (dateStr: string) => {
    const then = new Date(dateStr);
    const now = new Date();
    return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User size={18} />
          Networking Tracker
          <Badge variant="outline" className="ml-auto text-[10px]">{contacts.length} contacts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-1" /> {showForm ? "Cancel" : "Add Contact"}
        </Button>

        {showForm && (
          <div className="grid grid-cols-2 gap-2 p-3 rounded-md border bg-muted/30">
            <Input placeholder="Name *" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="text-sm" />
            <Input placeholder="Company" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} className="text-sm" />
            <Input placeholder="Role" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="text-sm" />
            <Input placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="text-sm" />
            <Input placeholder="LinkedIn URL" value={form.linkedin || ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="text-sm" />
            <Input placeholder="Relationship (e.g., Former colleague)" value={form.relationship || ""} onChange={(e) => setForm({ ...form, relationship: e.target.value })} className="text-sm" />
            <Input type="date" placeholder="Last contacted" value={form.lastContacted || ""} onChange={(e) => setForm({ ...form, lastContacted: e.target.value })} className="text-sm" />
            <Button size="sm" onClick={handleAdd} disabled={!form.name?.trim()} className="col-span-2">Save Contact</Button>
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {contacts.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <User size={32} className="mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No contacts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add people who can help your job search</p>
            </div>
          )}
          {contacts.map((c) => {
            const days = daysSince(c.lastContacted);
            return (
              <div key={c.id} className="rounded-md border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.role}{c.role && c.company ? " at " : ""}{c.company}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(c.id)}>
                    <Trash2 size={12} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                  {c.email && <span className="flex items-center gap-0.5"><Mail size={10} /> {c.email}</span>}
                  {c.linkedin && <span className="flex items-center gap-0.5"><User size={10} /> LinkedIn</span>}
                  {c.relationship && <span className="flex items-center gap-0.5"><Building2 size={10} /> {c.relationship}</span>}
                  <span className={`flex items-center gap-0.5 ${days > 30 ? "text-red-500" : days > 14 ? "text-yellow-600" : ""}`}>
                    <Calendar size={10} /> {days === 0 ? "Today" : `${days}d ago`}
                  </span>
                </div>

                {c.notes && <p className="text-xs text-muted-foreground bg-muted/30 p-1.5 rounded">{c.notes}</p>}

                {c.referrals.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.referrals.map((r, i) => (
                      <Badge key={i} variant="secondary" className="text-[9px]">Referred: {r}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-1">
                  <Input
                    placeholder="Add referral company"
                    className="h-6 text-[10px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addReferral(c.id, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
