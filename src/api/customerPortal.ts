import { api } from "./http";

export type CustomerCar = { id: number; brand: string; model: string; vin: string; engineType: string; horsePower: number };
export type CarInput = Omit<CustomerCar, "id">;
export type MechanicOption = { id: number; name: string };
export type AppointmentStatus = "REQUESTED"|"CONFIRMED"|"PROPOSED"|"CANCELLED";
export type Problem = { id: number; carId: number; carName: string; vin: string; mechanicId: number; mechanicName: string; customerName: string; description: string; status: "SUBMITTED"|"ESTIMATE_CREATED"|"APPROVED"|"REJECTED"|"CANCELLED"; latestMileage: number; appointmentAt: string|null; appointmentStatus: AppointmentStatus|null; jobId: number|null; estimatedMinutes: number|null; jobStatus: string|null; partsCost: number|null; workPrice: number|null; totalCost: number|null; rejectionReason: string|null; parts: { partId:number; name:string; unitPrice:number; qty:number }[]; createdAt: string; updatedAt: string };

export const customerPortal = {
  cars: () => api<CustomerCar[]>("/api/customer/cars"),
  createCar: (body: CarInput) => api<CustomerCar>("/api/customer/cars", { method: "POST", body: JSON.stringify(body) }),
  updateCar: (id: number, body: CarInput) => api<CustomerCar>(`/api/customer/cars/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  mechanics: () => api<MechanicOption[]>("/api/customer/mechanics"),
  problems: () => api<Problem[]>("/api/customer/problems"),
  createProblem: (body: { carId: number; mechanicId: number; description: string; appointmentAt: string }) => api<Problem>("/api/customer/problems", { method: "POST", body: JSON.stringify(body) }),
  cancelProblem: (id: number) => api<Problem>(`/api/customer/problems/${id}/cancel`, { method: "PATCH" }),
  approveEstimate: (id: number) => api<Problem>(`/api/customer/problems/${id}/approve`, { method: "PATCH" }),
  rejectEstimate: (id: number, reason: string) => api<Problem>(`/api/customer/problems/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  acceptAppointment: (id: number) => api<Problem>(`/api/customer/problems/${id}/appointment/accept`, { method: "PATCH" }),
  assignedProblems: () => api<Problem[]>("/api/me/problems"),
  convertProblem: (id: number, body: { description?: string; mileage: number; labourCost: number; estimatedMinutes: number; parts: {partId:number;qty:number}[] }) => api<Problem>(`/api/me/problems/${id}/job`, { method: "POST", body: JSON.stringify(body) }),
  confirmAppointment: (id: number) => api<Problem>(`/api/me/problems/${id}/appointment/confirm`, { method: "PATCH" }),
  proposeAppointment: (id: number, appointmentAt: string) => api<Problem>(`/api/me/problems/${id}/appointment/propose`, { method: "PATCH", body: JSON.stringify({ appointmentAt }) }),
};
