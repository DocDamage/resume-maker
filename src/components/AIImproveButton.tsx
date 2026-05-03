import { useState } from "react";
import { Button } from "@/components/ui/button";
import { improveSummary, improveBullet, improveSkills } from "@/utils/aiImprover";
import { Loader2, Wand2, AlertCircle } from "lucide-react";

interface AIImproveButtonProps {
  type: "summary" | "bullet" | "skills";
  content: string;
  onImproved: (text: string) => void;
  className?: string;
  size?: "sm" | "default";
}

export function AIImproveButton({
  type,
  content,
  onImproved,
  className,
  size = "sm",
}: AIImproveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    if (!content.trim()) {
      setError("Add some content first before improving.");
      return;
    }
    setLoading(true);
    try {
      let result = "";
      if (type === "summary") {
        result = await improveSummary(content);
      } else if (type === "bullet") {
        result = await improveBullet(content);
      } else if (type === "skills") {
        const cats = await improveSkills(content);
        result = JSON.stringify(cats);
      }
      onImproved(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size={size}
        onClick={handleClick}
        disabled={loading}
        title={type === "summary" ? "Improve Summary" : type === "bullet" ? "Improve Bullet" : "Improve Skills"}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin mr-1" />
        ) : (
          <Wand2 size={14} className="mr-1" />
        )}
        {type === "summary" && "Improve Summary"}
        {type === "bullet" && "Improve Bullet"}
        {type === "skills" && "Improve Skills"}
      </Button>
      {error && (
        <div className="flex items-start gap-1 mt-1 text-[10px] text-destructive">
          <AlertCircle size={10} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  );
}
