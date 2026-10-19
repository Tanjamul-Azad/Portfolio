import type { Project } from "@/types";

export function ProjectStatus({ project }: { project: Project }) {
  if (project.status !== "building") return null;

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 px-2 py-1 text-[10px] font-medium leading-none text-sky-700 dark:text-sky-300">
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
      In development
    </span>
  );
}
