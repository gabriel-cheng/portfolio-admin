import { apiClient } from "../../../api/client";

import type { Experience, ExperienceRequest } from "../types/experience.types";

export const experiencesApi = {
  async list(): Promise<Experience[]> {
    const response = await apiClient.get<Experience[]>("/v1/admin/experiences");

    return response.data;
  },

  async getById(id: string): Promise<Experience> {
    const response = await apiClient.get<Experience>(
      `/v1/admin/experiences/${id}`,
    );

    return response.data;
  },

  async create(experience: ExperienceRequest): Promise<Experience> {
    const response = await apiClient.post<Experience>(
      "/v1/admin/experiences",
      experience,
    );

    return response.data;
  },

  async update(id: string, experience: ExperienceRequest): Promise<Experience> {
    const response = await apiClient.put<Experience>(
      `/v1/admin/experiences/${id}`,
      experience,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/admin/experiences/${id}`);
  },
};
