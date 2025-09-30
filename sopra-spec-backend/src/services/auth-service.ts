// services/auth-service.ts
import supabase from "../config/supabase-client";

export async function signInWithPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function logout() {
  return await supabase.auth.signOut();
}

export async function refreshToken(refresh_token: string) {
  return await supabase.auth.refreshSession({ refresh_token });
}
