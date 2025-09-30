"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SessionPayload = {
  token: string;
  refresh_token: string;
  user: any;
};

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  login: (payload: SessionPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // on mount, restore session
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (tokens: {
    token: string;
    refresh_token: string;
    user: any;
  }) => {
    localStorage.setItem("access_token", tokens.token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("user", JSON.stringify(tokens.user));
    setUser(tokens.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
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
