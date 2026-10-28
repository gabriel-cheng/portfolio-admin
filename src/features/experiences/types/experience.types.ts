export type ExperienceStatus = "DRAFT" | "PUBLISHED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP"
  | "TEMPORARY"
  | "OTHER";

export interface Experience {
  id: string;
  slug: string;
  company: string;
  role: string;
  employmentType: EmploymentType;
  location: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  displayOrder: number;
  status: ExperienceStatus;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceRequest {
  slug: string;
  company: string;
  role: string;
  employmentType: EmploymentType;
  location: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  displayOrder: number;
  technologies: string[];
}
