import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { login, registerCustomer } from "../api/authApi";
import type { CustomerRegistration } from "../api/authApi";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  register: (data: CustomerRegistration) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_KEY = "garage_auth_v1";

function loadFromStorage(): User | null {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(LS_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // load immediately (before any route guard runs)
  const [user, setUser] = useState<User | null>(() => loadFromStorage());
  const [ready] = useState(true);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,

      signIn: async (email: string, password: string) => {
        const u = await login(email, password);

        setUser(u);
        localStorage.setItem(LS_KEY, JSON.stringify(u));
        return u;
      },

      register: async (data) => {
        const u = await registerCustomer(data);
        setUser(u);
        localStorage.setItem(LS_KEY, JSON.stringify(u));
        return u;
      },

      signOut: () => {
        setUser(null);
        localStorage.removeItem(LS_KEY);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
