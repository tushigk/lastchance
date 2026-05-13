"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, membershipApi, AuthUser } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  membershipActive: boolean;
  refreshUser: () => Promise<void>;
  refreshMembership: () => Promise<void>;
  register: (body: { phone: string; name: string; gender: string }) => Promise<void>;
  login: (body: { phone: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [membershipActive, setMembershipActive] = useState(false);

  async function checkMembership() {
    try {
      const status = await membershipApi.getStatus();
      setMembershipActive(status.active);
    } catch {
      setMembershipActive(false);
    }
  }

  useEffect(() => {
    authApi.me()
      .then(async u => {
        setUser(u);
        await checkMembership();
      })
      .catch(() => {
        setUser(null);
        setMembershipActive(false);
      })
      .finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      // keep existing user
    }
  }

  async function refreshMembership() {
    await checkMembership();
  }

  async function register(body: { phone: string; name: string; gender: string }) {
    const res = await authApi.register(body);
    setUser(res.user);
    setMembershipActive(false);
  }

  async function login(body: { phone: string }) {
    const res = await authApi.login(body);
    setUser(res.user);
    await checkMembership();
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    setUser(null);
    setMembershipActive(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, membershipActive, refreshUser, refreshMembership, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
