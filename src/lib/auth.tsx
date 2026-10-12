/**
 * PROTOTYPE AUTH MODE. No backend is connected, so "signing in" only picks a
 * demo role to preview role-based UI. It does NOT protect any data.
 * Real authorization must be enforced by the backend.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role, User } from "./types";

interface Ctx {
  user: User | null;
  role: Role;
  signIn: (email: string, role: Role) => void;
  signOut: () => void;
  can: (...roles: Role[]) => boolean;
}
const AuthContext = createContext<Ctx | null>(null);
const KEY = "jalrakshak-demo-role";

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
    } catch {
      /* ignore */
    }
  }, []);
  const signIn = useCallback((email: string, role: Role) => {
    const u: User = { id: role === "citizen" ? "demo-citizen" : `demo-${role}`, name: `Demo ${ROLE_LABEL[role]}`, email, role };
    setUser(u);
    // Only the demo role is kept (session only) — no passwords or tokens.
    window.sessionStorage.setItem(KEY, JSON.stringify(u));
  }, []);
  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem(KEY);
  }, []);
  const role: Role = user?.role ?? "public";
  const can = useCallback((...roles: Role[]) => roles.includes(role), [role]);
  return <AuthContext.Provider value={{ user, role, signIn, signOut, can }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
