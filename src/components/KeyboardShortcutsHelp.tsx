import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "Z"], action: "Undo last change" },
  { keys: ["Ctrl", "Shift", "Z"], action: "Redo last change" },
  { keys: ["Ctrl", "S"], action: "Trigger save (auto-saves continuously)" },
];

export function KeyboardShortcutsHelp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Keyboard size={18} />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j} className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-muted border text-[11px] font-mono min-w-[24px]">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
