import { api } from "./http";

export type JobStatus = "PENDING_APPROVAL" | "OPEN" | "REJECTED" | "DONE" | "CANCELLED";

export type JobRow = {
  id: number;
  carId: number;
  description: string;
  mileage: number;
  estimatedMinutes: number | null;
  partsCost: number;
  labourCost: number;
  totalCost: number;
  status: JobStatus;
  createdAt: string;
  completedAt: string | null;
};

export type BossJobRow = JobRow & {
  carBrand: string;
  carModel: string;
  vin: string;
  mechanicId: number;
  mechanicName: string;
};

export type JobDetails = BossJobRow & {
  parts: Array<{
    partId: number;
    name: string;
    unitPrice: number;
    qty: number;
    lineTotal: number;
  }>;
};

export type CatalogCar = { id: number; brand: string; model: string; vin: string };
export type CatalogPart = { id: number; name: string; price: number; stockQty: number };

export const getMechanicJobs = () => api<JobRow[]>("/api/me/jobs");
export const completeJob = (id: number) =>
  api<JobRow>(`/api/me/jobs/${id}/complete`, { method: "PATCH" });
export const cancelJob = (id: number) =>
  api<JobRow>(`/api/me/jobs/${id}/cancel`, { method: "PATCH" });
export const getCatalogCars = () => api<CatalogCar[]>("/api/me/catalog/cars");
export const getCatalogParts = () => api<CatalogPart[]>("/api/me/catalog/parts");
export const createJob = (data: {
  carId: number;
  description: string;
  mileage: number;
  labourCost: number;
  parts: Array<{ partId: number; qty: number }>;
}) => api<JobRow>("/api/me/jobs", { method: "POST", body: JSON.stringify(data) });
export const getBossJobs = () => api<BossJobRow[]>("/api/boss/jobs");
export const getBossJob = (id: number) => api<JobDetails>(`/api/boss/jobs/${id}`);
