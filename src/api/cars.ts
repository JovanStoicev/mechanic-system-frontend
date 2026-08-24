import { api } from "./http";

export type CarRow = {
  id: number;
  brand: string;
  model: string;
  vin: string;
  engineType: string;
  horsePower: number;
  customerId: number | null;
  customerName: string | null;
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
export const createCar = (input: {
  brand: string;
  model: string;
  vin: string;
  engineType: string;
  horsePower: number;
  customerId: number | null;
}) => api<CarRow>("/api/boss/cars", { method: "POST", body: JSON.stringify(input) });
export const assignCarCustomer = (carId: number, customerId: number | null) =>
  api<CarRow>(`/api/boss/cars/${carId}/customer`, {
    method: "PATCH",
    body: JSON.stringify({ customerId }),
  });
