import { apiClient } from "../../../api/client";
import type { Project } from "../types/project.types";

export interface ProjectRequest {
  title: string;
  slug: string;
  summary: string;
  content: unknown;
  featured: boolean;
  displayOrder: number;
}

export const projectsApi = {
  async list(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>("/v1/admin/projects");

    return response.data;
  },

  async publish(id: string): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `/v1/admin/projects/${id}/publish`,
    );

    return response.data;
  },

  async unpublish(id: string): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `/v1/admin/projects/${id}/unpublish`,
    );

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/admin/projects/${id}`);
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/v1/admin/projects/${id}`);

    return response.data;
  },

  async create(project: ProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>(
      "/v1/admin/projects",
      project,
    );

    return response.data;
  },

  async update(id: string, project: ProjectRequest): Promise<Project> {
    const response = await apiClient.put<Project>(
      `/v1/admin/projects/${id}`,
      project,
    );

    return response.data;
  },
};
