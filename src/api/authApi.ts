import type { User } from "../types/auth"
import { API_BASE_URL } from "./http";

type AuthResponse = { token: string; userId: number; email: string; name: string; role: "ROLE_BOSS" | "ROLE_MECHANIC" | "ROLE_CUSTOMER" };

function toUser(data: AuthResponse): User {
  return { id: data.userId, email: data.email, name: data.name,
    role: data.role.replace("ROLE_", "") as User["role"], token: data.token };
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!res.ok) {
    throw new Error(
      res.status === 401 ? "Invalid email or password." : "Login failed.",
    );
  }

  return toUser((await res.json()) as AuthResponse);
}

export type CustomerRegistration = { fullName: string; phone: string; email: string; address: string; password: string };
export async function registerCustomer(body: CustomerRegistration): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register/customer`, { method: "POST",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.text()) || "Registration failed.");
  return toUser((await res.json()) as AuthResponse);
}
