import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "garage_auth_v1";

type LoginResponse = {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: "ROLE_BOSS" | "ROLE_MECHANIC";
};

function mapRole(role: LoginResponse["role"]): User["role"] {
  return role === "ROLE_BOSS" ? "BOSS" : "MECHANIC";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // restore session on refresh
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as User;
      setUser(parsed);
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      signIn: async (email: string, password: string) => {
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        if (!res.ok) {
          // backend should return 401 for invalid credentials
          const msg =
            res.status === 401 ? "Invalid email or password." : "Login failed.";
          throw new Error(msg);
        }

        const data = (await res.json()) as LoginResponse;

        const u: User = {
          id: data.userId,
          email: data.email,
          name: data.name,
          role: mapRole(data.role),
          token: data.token,
        };

        setUser(u);
        localStorage.setItem(LS_KEY, JSON.stringify(u));
        return u;
      },

      signOut: () => {
        setUser(null);
        localStorage.removeItem(LS_KEY);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
