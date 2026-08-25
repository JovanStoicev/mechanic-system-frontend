import { api } from "./http";

export type BossDashboard = { activeJobs:number; pendingPartRequests:number; upcomingAppointments:number; completedJobsThisMonth:number; revenueThisMonth:number; estimatedResultThisMonth:number; mechanics:number; customers:number };
export type MechanicDashboard = { assignedProblems:number; activeJobs:number; upcomingAppointments:number; pendingPartRequests:number; unreadNotifications:number };
export type CustomerDashboard = { cars:number; activeRepairs:number; upcomingAppointments:number; invoices:number; unreadNotifications:number };

export const getBossDashboard = () => api<BossDashboard>("/api/boss/dashboard");
export const getMechanicDashboard = () => api<MechanicDashboard>("/api/me/dashboard");
export const getCustomerDashboard = () => api<CustomerDashboard>("/api/customer/dashboard");
