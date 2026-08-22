export type MechanicDto = {
  id: number;
  name: string;
  email: string;
  fixedSalary: number;
  active: boolean;
};

export async function createMechanic(
  token: string,
  data: {
    name: string;
    email: string;
    fixedSalary: number;
    tempPassword: string;
  },
) {
  void token;
  return api<MechanicDto>("/api/boss/mechanics", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMechanics(token: string): Promise<MechanicDto[]> {
  void token;
  return api<MechanicDto[]>("/api/boss/mechanics");
}
export const deactivateMechanic = (id: number) => api<MechanicDto>(`/api/boss/mechanics/${id}/deactivate`, { method: "PATCH" });
export const activateMechanic = (id: number) => api<MechanicDto>(`/api/boss/mechanics/${id}/activate`, { method: "PATCH" });
export const deleteMechanic = (id: number) => api<void>(`/api/boss/mechanics/${id}`, { method: "DELETE" });
import { api } from "./http";
