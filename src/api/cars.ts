import { api } from "./http";

export type CarRow = {
  id: number;
  brand: string;
  model: string;
  vin: string;
  engineType: string;
  horsePower: number;
};

export type CarHistory = CarRow & {
  jobs: Array<{
    id: number;
    mileage: number;
    description: string;
    mechanicName: string;
    partsCost: number;
    labourCost: number;
    totalCost: number;
    status: "OPEN" | "DONE" | "CANCELLED";
    createdAt: string;
    completedAt: string | null;
    parts: Array<{ name: string; qty: number }>;
  }>;
};

export const getCars = () => api<CarRow[]>("/api/boss/cars");
export const getCarHistory = (id: number) => api<CarHistory>(`/api/boss/cars/${id}/history`);
