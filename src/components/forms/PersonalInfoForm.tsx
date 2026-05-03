import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonalInfoForm() {
  const personal = useResumeStore((s) => s.resume.personal);
  const photoUrl = useResumeStore((s) => s.resume.photoUrl);
  const setPersonal = useResumeStore((s) => s.setPersonal);
  const setPhotoUrl = useResumeStore((s) => s.setPhotoUrl);

  const handleChange = (field: string, value: string) => {
    setPersonal({ ...personal, [field]: value });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted border flex items-center justify-center text-xs text-muted-foreground">
              No Photo
            </div>
          )}
          <div>
            <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-muted h-8 px-3 cursor-pointer text-xs">
              {photoUrl ? "Change Photo" : "Add Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            {photoUrl && (
              <Button variant="ghost" size="sm" className="text-destructive ml-2" onClick={() => setPhotoUrl(undefined)}>
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={personal.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={personal.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personal.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={personal.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={personal.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={personal.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://your-site.com"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
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
