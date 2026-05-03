import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Globe, Link2, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PersonalInfoForm() {
  const personal = useResumeStore((s) => s.resume.personal);
  const photoUrl = useResumeStore((s) => s.resume.photoUrl);
  const setPersonal = useResumeStore((s) => s.setPersonal);
  const setPhotoUrl = useResumeStore((s) => s.setPhotoUrl);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setPersonal({ ...personal, [field]: value });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const emailValid = !touched.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email);
  const websiteValid = !touched.website || !personal.website || /^https?:\/\/.+/.test(personal.website) || personal.website === "";

  const fields = [
    { id: "fullName", label: "Full Name", icon: User, placeholder: "John Doe", type: "text", required: true },
    { id: "title", label: "Job Title", icon: User, placeholder: "Software Engineer", type: "text", required: false },
    { id: "email", label: "Email", icon: Mail, placeholder: "john@example.com", type: "email", required: true },
    { id: "phone", label: "Phone", icon: Phone, placeholder: "+1 (555) 000-0000", type: "tel", required: false },
    { id: "location", label: "Location", icon: MapPin, placeholder: "City, State", type: "text", required: false },
    { id: "website", label: "Website", icon: Globe, placeholder: "https://your-site.com", type: "url", required: false },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User size={18} />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <div className="relative">
              <img src={photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border shadow-sm" />
              <button
                onClick={() => setPhotoUrl(undefined)}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                title="Remove photo"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted border flex items-center justify-center text-muted-foreground">
              <Camera size={20} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-muted h-8 px-3 cursor-pointer text-xs">
              <Camera size={12} />
              {photoUrl ? "Change Photo" : "Add Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.id} className={cn("space-y-1.5", field.id === "website" && "sm:col-span-2")}>
              <Label htmlFor={field.id} className="flex items-center gap-1">
                <field.icon size={12} />
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                value={(personal as Record<string, string>)[field.id]}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={() => handleBlur(field.id)}
                placeholder={field.placeholder}
                className={cn(
                  (field.id === "email" && !emailValid) || (field.id === "website" && !websiteValid)
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                )}
              />
              {field.id === "email" && !emailValid && (
                <p className="text-[10px] text-destructive">Please enter a valid email address</p>
              )}
              {field.id === "website" && !websiteValid && (
                <p className="text-[10px] text-destructive">URL should start with http:// or https://</p>
              )}
            </div>
          ))}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="linkedin" className="flex items-center gap-1">
              <Link2 size={12} />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={personal.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
