/**
 * PROTOTYPE AUTH MODE. No backend is connected, so "signing in" only picks a
 * demo role to preview role-based UI. It does NOT protect any data.
 * Real authorization must be enforced by the backend.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role, User } from "./types";
import { api, IS_MOCK } from "@/services/api";

interface Ctx {
  user: User | null;
  role: Role;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  can: (...roles: Role[]) => boolean;
}
const AuthContext = createContext<Ctx | null>(null);
const KEY = "jalrakshak-auth-user";
const TOKEN_KEY = "jalrakshak-access-token";

export const ROLE_LABEL: Record<Role, string> = {
  public: "Public visitor",
  citizen: "Registered citizen",
  responder: "Responder / volunteer",
  provider: "Shelter / relief provider",
  admin: "Administrator",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
      if (!IS_MOCK && window.sessionStorage.getItem(TOKEN_KEY)) void api.me().then(setUser).catch(() => {
        window.sessionStorage.removeItem(KEY);
        window.sessionStorage.removeItem(TOKEN_KEY);
      });
    } catch {
      /* ignore */
    }
  }, []);
  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    setUser(result.user);
    window.sessionStorage.setItem(KEY, JSON.stringify(result.user));
    window.sessionStorage.setItem(TOKEN_KEY, result.accessToken);
  }, []);
  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await api.register(name, email, password);
    setUser(result.user);
    window.sessionStorage.setItem(KEY, JSON.stringify(result.user));
    window.sessionStorage.setItem(TOKEN_KEY, result.accessToken);
  }, []);
  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  }, []);
  const role: Role = user?.role ?? "public";
  const can = useCallback((...roles: Role[]) => roles.includes(role), [role]);
  return <AuthContext.Provider value={{ user, role, signIn, register, signOut, can }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
