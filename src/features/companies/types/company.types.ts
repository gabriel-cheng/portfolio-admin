import type { Experience } from "../../experiences/types/experience.types";

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
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

