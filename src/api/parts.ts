import { api } from "./http";

export type Part = { id: number; name: string; price: number; stockQty: number };

export const getBossParts = () => api<Part[]>("/api/boss/parts");
export const createBossPart = (data: { name: string; price: number; stockQty: number }) =>
  api<Part>("/api/boss/parts", { method: "POST", body: JSON.stringify(data) });
