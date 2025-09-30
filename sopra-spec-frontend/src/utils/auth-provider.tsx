"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, SessionPayload } from "@/utils/types";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: SessionPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_information");

    if (token && userData) {
      setUser(JSON.parse(userData) as User);
    }
  }, []);

  const login = (payload: SessionPayload) => {
    localStorage.setItem("access_token", payload.token);
    localStorage.setItem("refresh_token", payload.refresh_token);
    localStorage.setItem(
      "user_information",
      JSON.stringify(payload.user_information)
    );

    setUser(payload.user_information);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_information");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
