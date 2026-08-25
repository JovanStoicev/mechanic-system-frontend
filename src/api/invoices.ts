import { API_BASE_URL, api, getToken } from "./http";

export type Invoice = {
  id: number; jobId: number; invoiceNumber: string; customerName: string;
  customerEmail: string|null; customerPhone: string|null; customerAddress: string|null;
  carBrand: string; carModel: string; vin: string; mechanicName: string;
  description: string; mileage: number; partsCost: number; labourCost: number;
  totalCost: number; issuedAt: string;
  parts: { name: string; unitPrice: number; quantity: number; lineTotal: number }[];
};

export const getInvoices = (role: "boss" | "customer") => api<Invoice[]>(`/api/${role}/invoices`);

export async function downloadInvoicePdf(role: "boss" | "customer", invoice: Invoice) {
  const response = await fetch(`${API_BASE_URL}/api/${role}/invoices/${invoice.id}/pdf`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });
  if (!response.ok) throw new Error(`Could not download invoice (${response.status})`);
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `${invoice.invoiceNumber}.pdf`; anchor.click();
  URL.revokeObjectURL(url);
}
