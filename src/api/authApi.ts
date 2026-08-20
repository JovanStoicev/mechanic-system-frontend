import type { User } from "../types/auth"
import { API_BASE_URL } from "./http";

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

  const data = (await res.json()) as {
    token: string;
    userId: number;
    email: string;
    name: string;
    role: "ROLE_BOSS" | "ROLE_MECHANIC";
  };

  return {
    id: data.userId,
    email: data.email,
    name: data.name,
    role: data.role === "ROLE_BOSS" ? "BOSS" : "MECHANIC",
    token: data.token,
  };
}
