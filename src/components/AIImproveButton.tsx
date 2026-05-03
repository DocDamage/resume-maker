import { useState } from "react";
import { Button } from "@/components/ui/button";
import { improveSummary, improveBullet, improveSkills } from "@/utils/aiImprover";
import { Loader2, Wand2 } from "lucide-react";

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

  const handleClick = async () => {
    if (!content.trim()) {
      alert("Please add some content first.");
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
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={className}
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
  );
}
