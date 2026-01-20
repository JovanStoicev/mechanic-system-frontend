import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useBossData } from "../boss/BossDataContext";
import type { User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => User;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { mechanics } = useBossData();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      signIn: (email: string, _password: string) => {
        const normalizedEmail = email.toLowerCase().trim();

        // Boss login (always allowed)
        if (normalizedEmail === "boss@garage.com") {
          const u: User = {
            id: 1,
            email: normalizedEmail,
            name: "Boss",
            role: "BOSS",
            token: "fake-jwt-token",
          };
          setUser(u);
          return u;
        }

        // Mechanic login (must exist)
        const mechanic = mechanics.find(
          (m) => m.email.toLowerCase().trim() === normalizedEmail,
        );

        if (!mechanic) {
          throw new Error("Account with this email does not exist.");
        }

        const u: User = {
          id: mechanic.id,
          email: normalizedEmail,
          name: mechanic.name,
          role: "MECHANIC",
          token: "fake-jwt-token",
        };
        setUser(u);
        return u;
      },

      signOut: () => setUser(null),
    }),
    [user, mechanics],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
