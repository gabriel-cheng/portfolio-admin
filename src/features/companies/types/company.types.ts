import type { Experience } from "../../experiences/types/experience.types";

export type CompanyStatus = "DRAFT" | "PUBLISHED";

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  status: CompanyStatus;
  experiences?: Experience[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRequest {
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
}
