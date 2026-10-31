import { apiClient } from "../../../api/client";
import type { Company, CompanyRequest } from "../types/company.types";

export const companiesApi = {
  async list(): Promise<Company[]> {
    const response = await apiClient.get<Company[]>("/v1/admin/companies");
    return response.data;
  },

  async getById(id: string): Promise<Company> {
    const response = await apiClient.get<Company>(`/v1/admin/companies/${id}`);
    return response.data;
  },

  async create(company: CompanyRequest): Promise<Company> {
    const response = await apiClient.post<Company>(
      "/v1/admin/companies",
      company,
    );
    return response.data;
  },

  async update(id: string, company: CompanyRequest): Promise<Company> {
    const response = await apiClient.put<Company>(
      `/v1/admin/companies/${id}`,
      company,
    );
    return response.data;
  },

  async publish(id: string): Promise<Company> {
    const response = await apiClient.patch<Company>(
      `/v1/admin/companies/${id}/publish`,
    );
    return response.data;
  },

  async unpublish(id: string): Promise<Company> {
    const response = await apiClient.patch<Company>(
      `/v1/admin/companies/${id}/unpublish`,
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/admin/companies/${id}`);
  },
};
