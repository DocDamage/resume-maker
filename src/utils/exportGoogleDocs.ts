import type { Resume } from "@/types/resume";
import { exportToPlainText } from "./exportPlainText";

export function exportToGoogleDocs(resume: Resume): void {
  const plain = exportToPlainText(resume);
  const title = encodeURIComponent(resume.title || "Resume");

  navigator.clipboard.writeText(plain).then(() => {
    window.open(`https://docs.google.com/document/create?title=${title}`, "_blank");
  }).catch(() => {
    window.open(`https://docs.google.com/document/create?title=${title}`, "_blank");
  });
}
