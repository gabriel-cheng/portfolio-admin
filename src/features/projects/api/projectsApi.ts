import { apiClient } from "../../../api/client";
import type { Project } from "../types/project.types";

export const projectsApi = {
  async list(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/v1/admin/projects");

    return response.data;
  },

  async publish(id: string): Promise<Project> {
    const response = await apiClient.post<Project>(
      `/v1/admin/projects/${id}/publish`,
    );

    return response.data;
  },

  async unpublish(id: string): Promise<Project> {
    const response = await apiClient.post<Project>(
      `/v1/admin/projects/${id}/unpublish`,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/admin/projects/${id}`);
  },
};
