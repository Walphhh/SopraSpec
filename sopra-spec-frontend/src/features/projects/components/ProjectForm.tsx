'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProjectFormData = {
  name: string;
  location: string;
  architect?: string;
  builder?: string;
};

export default function ProjectForm() {
  const [form, setForm] = useState<ProjectFormData>({
    name: "",
    location: "",
    architect: "",
    builder: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Until backend integration, use local mock storage
      const id = Date.now().toString();
      const key = "mock-projects";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([{ id, ...form }, ...prev]));

      // After saving, navigate to the details page
      router.push(`/projects/${id}/details`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-3">
      <input
        placeholder="Project Name"
        className="w-full rounded border p-2 outline-none focus:border-blue-600"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        placeholder="Location"
        className="w-full rounded border p-2 outline-none focus:border-blue-600"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          placeholder="Architect"
          className="w-full rounded border p-2 outline-none focus:border-blue-600"
          value={form.architect}
          onChange={(e) => setForm({ ...form, architect: e.target.value })}
        />
        <input
          placeholder="Builder"
          className="w-full rounded border p-2 outline-none focus:border-blue-600"
          value={form.builder}
          onChange={(e) => setForm({ ...form, builder: e.target.value })}
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
