'use client';
export type LoginInput = { email: string; password: string };
export type SignupInput = { name: string; email: string; password: string };

export function useAuth() {
  // TODO: wire to real auth (Firebase/Auth API)
  const login = async (_: LoginInput) => Promise.resolve(true);
  const signup = async (_: SignupInput) => Promise.resolve(true);
  const logout = async () => Promise.resolve(true);

  return { login, signup, logout };
}
