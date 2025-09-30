'use client';

import Link from "next/link";
import { useState, FormEvent } from "react";

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: implement the signup logic (e.g., call useAuth().signup(form))
    console.log("Sign-up attempt:", form);
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

      {/* Sign Up */}
      <button
        type="submit"
        className="mx-auto block w-40 rounded-lg bg-[#76828B] py-2 text-white hover:opacity-90"
      >
        Sign Up
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
