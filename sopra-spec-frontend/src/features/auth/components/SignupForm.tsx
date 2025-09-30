"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import axios from "axios";
import { getBackendUrl } from "@/utils/get-backend-url";
import { useAuth } from "@/utils/auth-provider"; // adjust path
import type { SessionPayload } from "@/utils/auth-provider"; // import the type

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const [form, setForm] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth(); // reuse login from provider

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(getBackendUrl("/auth/signup"), {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        username: form.username,
      });

      // convert response into SessionPayload
      const payload: SessionPayload = {
        token: res.data.token,
        refresh_token: res.data.refresh_token,
        user: res.data.user,
      };

      // log user in after signup
      login(payload);

      alert("Account created successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        className="w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
        required
      />

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Sign Up */}
      <button
        type="submit"
        disabled={loading}
        className="mx-auto block w-40 rounded-lg bg-[#76828B] py-2 text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing up…" : "Sign Up"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 text-[#8C99A5]">
        <div className="h-px flex-1 bg-[#C9D1D8]" />
        <span>Or</span>
        <div className="h-px flex-1 bg-[#C9D1D8]" />
      </div>

      <p className="text-center text-[#8C99A5]">Already have an account?</p>

      {/* Log In link */}
      <Link
        href="/login"
        className="mx-auto block w-40 rounded-lg bg-[#76828B] py-2 text-center text-white hover:opacity-90"
      >
        Log In
      </Link>
    </form>
  );
}
