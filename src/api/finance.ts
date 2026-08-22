import { api } from "./http";

export type FinanceReport = {
  year: number; month: number; completedJobs: number; revenue: number; partsRevenue: number;
  labourRevenue: number; salaryExpenses: number; inventoryExpenses: number; totalExpenses: number;
  estimatedResult: number;
  receivedOrders: Array<{ requestId: number; partName: string; quantity: number; unitPrice: number; total: number; receivedAt: string }>;
};

export const getFinanceReport = (year: number, month: number) =>
  api<FinanceReport>(`/api/boss/finance?year=${year}&month=${month}`);
