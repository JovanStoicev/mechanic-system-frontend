import { api } from "./http";

export type CustomerCar = { id: number; brand: string; model: string; vin: string; engineType: string; horsePower: number };
export type CarInput = Omit<CustomerCar, "id">;
export type MechanicOption = { id: number; name: string };
export type Problem = { id: number; carId: number; carName: string; vin: string; mechanicId: number; mechanicName: string; customerName: string; description: string; status: "SUBMITTED"|"CONVERTED"|"CANCELLED"; jobId: number|null; estimatedMinutes: number|null; jobStatus: string|null; createdAt: string; updatedAt: string };

export const customerPortal = {
  cars: () => api<CustomerCar[]>("/api/customer/cars"),
  createCar: (body: CarInput) => api<CustomerCar>("/api/customer/cars", { method: "POST", body: JSON.stringify(body) }),
  updateCar: (id: number, body: CarInput) => api<CustomerCar>(`/api/customer/cars/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  mechanics: () => api<MechanicOption[]>("/api/customer/mechanics"),
  problems: () => api<Problem[]>("/api/customer/problems"),
  createProblem: (body: { carId: number; mechanicId: number; description: string }) => api<Problem>("/api/customer/problems", { method: "POST", body: JSON.stringify(body) }),
  cancelProblem: (id: number) => api<Problem>(`/api/customer/problems/${id}/cancel`, { method: "PATCH" }),
  assignedProblems: () => api<Problem[]>("/api/me/problems"),
  convertProblem: (id: number, body: { description?: string; mileage: number; labourCost: number; estimatedMinutes: number; parts: {partId:number;qty:number}[] }) => api<Problem>(`/api/me/problems/${id}/job`, { method: "POST", body: JSON.stringify(body) }),
};
