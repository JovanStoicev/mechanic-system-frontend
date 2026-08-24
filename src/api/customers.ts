import { api } from "./http";

export type CustomerRow = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  address: string | null;
  carCount: number;
};

export type CustomerDetails = Omit<CustomerRow, "carCount"> & {
  createdAt: string;
  updatedAt: string;
  cars: Array<{
    id: number;
    brand: string;
    model: string;
    vin: string;
    jobCount: number;
  }>;
};

export type CustomerInput = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
};

export const getCustomers = () => api<CustomerRow[]>("/api/boss/customers");
export const getCustomer = (id: number) => api<CustomerDetails>(`/api/boss/customers/${id}`);
export const createCustomer = (input: CustomerInput) => api<CustomerRow>("/api/boss/customers", {
  method: "POST",
  body: JSON.stringify(input),
});
export const updateCustomer = (id: number, input: CustomerInput) => api<CustomerRow>(`/api/boss/customers/${id}`, {
  method: "PUT",
  body: JSON.stringify(input),
});
export const deleteCustomer = (id: number) => api<void>(`/api/boss/customers/${id}`, { method: "DELETE" });
