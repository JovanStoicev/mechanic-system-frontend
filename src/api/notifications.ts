import { api } from "./http";

export type Notification = { id:number; type:string; title:string; message:string; link:string|null; createdAt:string; readAt:string|null };
export const getNotifications = () => api<Notification[]>("/api/notifications");
export const getUnreadNotificationCount = () => api<{count:number}>("/api/notifications/unread-count");
export const markNotificationRead = (id:number) => api<Notification>(`/api/notifications/${id}/read`, { method:"PATCH" });
export const markAllNotificationsRead = () => api<void>("/api/notifications/read-all", { method:"PATCH" });
