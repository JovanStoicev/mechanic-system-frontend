export type MechanicDto = {
  id: number;
  name: string;
  email: string;
  fixedSalary: number;
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
import { api } from "./http";
