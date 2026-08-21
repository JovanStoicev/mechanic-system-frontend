import { api } from "./http";

export type SalaryReport = {
  year: number;
  month: number;
  bonusRate: number;
  mechanics: Array<{
    mechanicId: number; mechanicName: string; fixedSalary: number; completedJobs: number;
    labourTotal: number; bonus: number; totalSalary: number;
    jobs: Array<{ jobId: number; carBrand: string; carModel: string; description: string; labourCost: number; completedAt: string }>;
  }>;
};

export const getSalaryReport = (year: number, month: number) =>
  api<SalaryReport>(`/api/boss/salaries?year=${year}&month=${month}`);
