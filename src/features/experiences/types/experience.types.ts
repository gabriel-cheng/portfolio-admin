import type { Company } from "../../companies/types/company.types";

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
  companyId?: string;
  company: string;
  companyDetails?: Partial<Company> | null;
  role: string;
  employmentType: EmploymentType;
  location: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  displayOrder: number;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceRequest {
  slug: string;
  companyId?: string;
  company?: string;
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
