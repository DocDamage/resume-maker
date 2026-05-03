import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import type { Toast } from "@/hooks/useToast";

export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    success: <CheckCircle size={16} className="text-green-600" />,
    error: <AlertCircle size={16} className="text-destructive" />,
    info: <Info size={16} className="text-primary" />,
  };

  const borders = {
    success: "border-green-200 dark:border-green-800",
    error: "border-destructive/20",
    info: "border-primary/20",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2 rounded-lg border bg-card text-card-foreground shadow-lg px-3 py-2.5 min-w-[240px] max-w-[320px] animate-in slide-in-from-bottom-2 fade-in duration-200 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
