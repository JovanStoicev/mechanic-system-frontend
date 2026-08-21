import { api } from "./http";

export type PartRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PartRequest = { id: number; mechanicId: number; mechanicName: string; partId: number; partName: string; quantity: number; note: string | null; status: PartRequestStatus; createdAt: string; decidedAt: string | null };

export const getMyPartRequests = () => api<PartRequest[]>("/api/me/part-requests");
export const createPartRequest = (data: { partId: number; quantity: number; note: string }) => api<PartRequest>("/api/me/part-requests", { method: "POST", body: JSON.stringify(data) });
export const getBossPartRequests = () => api<PartRequest[]>("/api/boss/part-requests");
export const approvePartRequest = (id: number) => api<PartRequest>(`/api/boss/part-requests/${id}/approve`, { method: "PATCH" });
export const rejectPartRequest = (id: number) => api<PartRequest>(`/api/boss/part-requests/${id}/reject`, { method: "PATCH" });
