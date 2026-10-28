import { StatusBadge, type ItemStatus } from "../ui/StatusBadge";
import type { ProjectStatus } from "../../features/projects/types/project.types";

export interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return <StatusBadge status={status as ItemStatus} className={className} />;
}
