'use client';
import Link from "next/link";
import { useState, FormEvent } from "react";

type LoginFormData = { email: string; password: string };

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: implement the login logic (e.g., call useAuth().login(form))
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Email */}
      <label className="block">
        <span className="text-[15px] text-[#6E7A86]">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
          required
        />
      </label>

      {/* Password */}
      <label className="block">
        <span className="text-[15px] text-[#6E7A86]">Password</span>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 w-full rounded-lg border border-[#A7B1BA] p-3 outline-none focus:border-[#1F75CB]"
          required
        />
      </label>

      {/* Forgot password */}
      <div className="flex justify-end -mt-1">
        <button
          type="button"
          className="text-sm italic text-[#8C99A5] hover:underline"
        >
          Forgot your password?
        </button>
      </div>

      {/* Log In */}
      <button
        type="submit"
        disabled={loading}
        className="mx-auto block w-40 rounded-lg bg-[#76828B] py-2 text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>

      {/* Divider + text */}
      <div className="flex items-center gap-3 text-[#8C99A5]">
        <div className="h-px flex-1 bg-[#C9D1D8]" />
        <span>Or</span>
        <div className="h-px flex-1 bg-[#C9D1D8]" />
      </div>

      {/* Sign up prompt */}
      <p className="text-center text-[#8C99A5]">Don’t have an account?</p>

      {/* Sign Up */}
      <Link
        href="/signup"
        className="mx-auto block w-40 rounded-lg bg-[#76828B] py-2 text-center text-white hover:opacity-90"
      >
        Sign Up
      </Link>
    </form>
  );
}
