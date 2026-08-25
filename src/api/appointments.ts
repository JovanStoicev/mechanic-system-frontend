import { api } from "./http";

export type BossAppointment = {
  problemId: number;
  appointmentAt: string;
  status: "REQUESTED" | "CONFIRMED" | "PROPOSED" | "CANCELLED";
  customerName: string;
  mechanicName: string;
  carName: string;
  vin: string;
  description: string;
};

export const getBossAppointments = () => api<BossAppointment[]>("/api/boss/appointments");
