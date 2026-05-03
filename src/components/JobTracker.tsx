import { useState } from "react";
import { useJobStore } from "@/stores/jobStore";
import { JobApplicationCard } from "./JobApplicationCard";
import { JobUrlImporter } from "./JobUrlImporter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JOB_STATUSES, STATUS_LABELS, type JobStatus } from "@/types/job";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Briefcase, Plus, BarChart3, TrendingUp } from "lucide-react";

const STATUS_COLORS: Record<JobStatus, string> = {
  wishlist: "bg-slate-100 dark:bg-slate-800",
  applied: "bg-blue-50 dark:bg-blue-900/20",
  screen: "bg-yellow-50 dark:bg-yellow-900/20",
  interview: "bg-purple-50 dark:bg-purple-900/20",
  offer: "bg-green-50 dark:bg-green-900/20",
  rejected: "bg-red-50 dark:bg-red-900/20",
  ghosted: "bg-gray-50 dark:bg-gray-800",
};

const STATUS_BORDER: Record<JobStatus, string> = {
  wishlist: "border-slate-300 dark:border-slate-600",
  applied: "border-blue-300 dark:border-blue-700",
  screen: "border-yellow-300 dark:border-yellow-700",
  interview: "border-purple-300 dark:border-purple-700",
  offer: "border-green-300 dark:border-green-700",
  rejected: "border-red-300 dark:border-red-700",
  ghosted: "border-gray-300 dark:border-gray-600",
};

function SortableJobCard({ job }: { job: ReturnType<typeof useJobStore.getState>["jobs"][0] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { status: job.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobApplicationCard job={job} />
    </div>
  );
}

function KanbanColumn({
  status,
  jobs,
}: {
  status: JobStatus;
  jobs: ReturnType<typeof useJobStore.getState>["jobs"];
}) {
  const { setNodeRef, isOver } = useSortable({
    id: `column-${status}`,
    data: { type: "column", status },
  });

  const columnJobs = jobs.filter((j) => j.status === status);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[260px] w-[260px] rounded-lg border ${STATUS_BORDER[status]} ${STATUS_COLORS[status]} ${
        isOver ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-inherit">
        <span className="text-xs font-semibold uppercase tracking-wider">{STATUS_LABELS[status]}</span>
        <Badge variant="secondary" className="text-[10px]">{columnJobs.length}</Badge>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        <SortableContext items={columnJobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {columnJobs.map((job) => (
            <SortableJobCard key={job.id} job={job} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function JobTracker() {
  const jobs = useJobStore((s) => s.jobs);
  const moveJob = useJobStore((s) => s.moveJob);
  const reorderJobs = useJobStore((s) => s.reorderJobs);
  const [showImporter, setShowImporter] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Dropping on a column
    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as JobStatus;
      moveJob(activeId, newStatus);
      return;
    }

    // Reordering within same column
    const activeJob = jobs.find((j) => j.id === activeId);
    const overJob = jobs.find((j) => j.id === overId);
    if (activeJob && overJob && activeJob.status === overJob.status) {
      const statusJobs = jobs.filter((j) => j.status === activeJob.status);
      const oldIndex = statusJobs.findIndex((j) => j.id === activeId);
      const newIndex = statusJobs.findIndex((j) => j.id === overId);
      const reordered = arrayMove(statusJobs, oldIndex, newIndex);
      reorderJobs(activeJob.status, reordered.map((j) => j.id));
    } else if (activeJob && overJob) {
      // Moving to different column via dropping on a card
      moveJob(activeId, overJob.status);
    }
  };

  const total = jobs.length;
  const active = jobs.filter((j) => !["rejected", "ghosted", "offer"].includes(j.status)).length;
  const offers = jobs.filter((j) => j.status === "offer").length;
  const avgMatch = jobs.length > 0 && jobs.some((j) => j.matchScore !== undefined)
    ? Math.round(
        jobs.filter((j) => j.matchScore !== undefined).reduce((a, j) => a + (j.matchScore || 0), 0) /
          jobs.filter((j) => j.matchScore !== undefined).length
      )
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Briefcase size={20} className="text-primary" />
          <h2 className="text-lg font-bold">Job Hunt Command Center</h2>
        </div>
        <Button size="sm" onClick={() => setShowImporter(!showImporter)}>
          <Plus size={14} className="mr-1" />
          {showImporter ? "Close" : "Add Job"}
        </Button>
      </div>

      {showImporter && <JobUrlImporter />}

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <BarChart3 size={12} />
          {total} total
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp size={12} />
          {active} active
        </div>
        {offers > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            {offers} offer{offers > 1 ? "s" : ""}
          </div>
        )}
        {avgMatch !== null && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Avg match: {avgMatch}%
          </div>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {JOB_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} jobs={jobs} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
