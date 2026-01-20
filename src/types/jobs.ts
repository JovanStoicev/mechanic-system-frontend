export type JobStatus = "OPEN" | "DONE";

export type Job = {
  id: number;
  carId: number;
  mechanicId: number;
  description: string;
  totalCost: number;
  status: JobStatus;
  createdAt: string; // ISO
};

export type JobPart = {
  id: number;
  jobId: number;
  partId: number;
  qty: number;
};
