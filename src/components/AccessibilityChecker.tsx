import { useMemo } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

function getContrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const rgb = parseInt(hex.replace("#", ""), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  const l1 = lum(hex1) + 0.05;
  const l2 = lum(hex2) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}

export function AccessibilityChecker() {
  const resume = useResumeStore((s) => s.resume);

  const checks = useMemo(() => {
    const results: { pass: boolean; msg: string }[] = [];
    const accent = resume.accentColor;
    const white = "#ffffff";
    const black = "#000000";
    const bg = resume.darkMode ? black : white;
    const text = resume.darkMode ? white : black;

    const accentOnBg = getContrastRatio(accent, bg);
    results.push({ pass: accentOnBg >= 4.5, msg: `Accent color on background: ${accentOnBg.toFixed(2)}:1 (needs 4.5:1)` });

    const textOnBg = getContrastRatio(text, bg);
    results.push({ pass: textOnBg >= 4.5, msg: `Text on background: ${textOnBg.toFixed(2)}:1 (needs 4.5:1)` });

    const hasH1 = resume.personal.fullName.length > 0;
    results.push({ pass: hasH1, msg: hasH1 ? "Name present (H1 equivalent)" : "Missing name at top of resume" });

    const hasContact = resume.personal.email.length > 0 || resume.personal.phone.length > 0;
    results.push({ pass: hasContact, msg: hasContact ? "Contact info present" : "Missing contact information" });

    return results;
  }, [resume]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><AlertCircle size={20} /> Accessibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {c.pass ? <CheckCircle size={14} className="text-green-600 shrink-0" /> : <AlertCircle size={14} className="text-amber-600 shrink-0" />}
            <span className={c.pass ? "text-green-700" : "text-amber-700"}>{c.msg}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
