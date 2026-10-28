import { apiClient } from "../../../api/client";

export interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<void> {
    await apiClient.get("/v1/public/projects");
    await apiClient.post("/v1/auth/login", credentials);
  },

  async getCurrentUser(): Promise<void> {
    await apiClient.get("/v1/users/me");
  },

  async logout(): Promise<void> {
    await apiClient.get("/v1/public/projects");
    await apiClient.post("/v1/auth/logout", {});
  },
};
