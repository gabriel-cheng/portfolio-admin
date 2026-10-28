export type ProjectStatus = "DRAFT" | "PUBLISHED";

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: unknown;
  featured: boolean;
  displayOrder: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}
