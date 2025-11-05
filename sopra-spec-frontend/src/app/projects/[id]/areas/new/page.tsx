"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Upload, Pencil } from "lucide-react";

type Area = {
  id: string;
  project_id: string;
  system_stack_id: string;
  combination: string;
  name: string;
  area_type: string;
  drawing: string;
  status: string;
};

export default function AreaDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = useMemo(() => {
    if (Array.isArray(params?.id)) return params.id[0];
    return params?.id ?? "";
  }, [params]);

  const prefilledStackId = searchParams.get("stackId") ?? "";
  const prefilledComboId = searchParams.get("combination") ?? "";
  const prefilledAreaType = searchParams.get("areaType") ?? "";

  const blankArea: Area = {
    id: "",
    project_id: projectId,
    system_stack_id: prefilledStackId,
    combination: prefilledComboId,
    name: "",
    area_type: prefilledAreaType,
    drawing: "",
    status: "",
  };

  const [form, setForm] = useState<Area>(blankArea);
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const fields = [
    { key: "project_id", label: "Project ID", required: true, locked: true },
    {
      key: "system_stack_id",
      label: "System Stack ID",
      required: true,
      locked: true,
    },
    {
      key: "combination",
      label: "Combination ID",
      required: true,
      locked: true,
    },
    { key: "name", label: "Area Name", required: true, locked: false },
    { key: "area_type", label: "Area Type", required: true, locked: true },
    { key: "status", label: "Status", required: true, locked: false },
  ] as const;

  const handleChange = (key: (typeof fields)[number]["key"], value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsModified(true);
    setError("");
    setMissingFields((prev) => prev.filter((f) => f !== key));
  };

  const handleSave = async () => {
    const missing: string[] = [];
    for (const field of fields) {
      const value = form[field.key];
      if (field.required && !field.locked && !value?.trim())
        missing.push(field.key);
    }

    if (missing.length > 0) {
      setError("Please fill in all required fields");
      setMissingFields(missing);
      return;
    }

    try {
      const payload = {
        ...form,
        system_stack_id: Number(form.system_stack_id),
        combination: Number(form.combination),
      };

      console.log("Saving Area:", payload);

      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/areas`,
        payload
      );

      console.log(res.data);
      router.push(`/projects/${projectId}/areas`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save area.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h5 className="text-left -mt-6 mb-6">Add New Area</h5>

      <div className="space-y-4">
        {fields.map((field) => {
          const isError = missingFields.includes(field.key);
          const locked = field.locked ?? false;

          // Render dropdown for status
          if (field.key === "status") {
            return (
              <div key={field.key} className="flex items-center space-x-4">
                <label className="w-40 font-semibold text-[#0072CE] text-left">
                  {field.label} <span className="text-red-500">*</span>
                </label>

                <div className="relative flex-1">
                  <select
                    title="status-selection"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={`w-full border-2 rounded p-2 outline-none bg-white transition-colors appearance-none ${
                      isError
                        ? "border-red-500 text-red-500"
                        : "border-[#7C878E] text-[#7C878E] focus:border-[#0072CE] focus:text-[#0072CE]"
                    }`}
                  >
                    <option value="">Select Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Final">Final</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            );
          }

          // Default text input for everything else
          return (
            <div key={field.key} className="flex items-center space-x-4">
              <label className="w-40 font-semibold text-[#0072CE] text-left">
                {field.label}{" "}
                {field.required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-[#7C878E]">(optional)</span>
                )}
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={form[field.key] ?? ""}
                  placeholder={`Enter ${field.label}`}
                  onChange={(e) =>
                    !locked && handleChange(field.key, e.target.value)
                  }
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                  disabled={locked}
                  className={`w-full border-2 rounded p-2 pr-10 outline-none bg-transparent transition-colors ${
                    locked
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed border-[#B3C7D6]"
                      : isError
                      ? "border-red-500 text-red-500"
                      : "border-[#7C878E] text-[#7C878E] focus:border-[#0072CE] focus:text-[#0072CE]"
                  }`}
                />
                <Pencil
                  size={18}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    locked
                      ? "text-gray-400"
                      : focusedField === field.key
                      ? "text-[#0072CE]"
                      : isError
                      ? "text-red-500"
                      : "text-[#7C878E]"
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Drawing Upload */}
        <div className="flex items-center space-x-4">
          <label className="w-40 font-semibold text-[#0072CE] text-left">
            Drawing (optional):
          </label>

          <input
            id="drawing-upload"
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const fileUrl = URL.createObjectURL(file);
                setForm((prev) => ({ ...prev, drawing: fileUrl }));
                setIsModified(true);
              }
            }}
          />

          <label
            htmlFor="drawing-upload"
            className="flex items-center justify-center w-48 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
          >
            <Upload className="mr-2" size={18} /> Upload File
          </label>

          {form.drawing && (
            <a
              href={form.drawing}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-blue-600 underline"
            >
              View Drawing
            </a>
          )}
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        <button
          className={`px-6 py-3 font-bold rounded text-white hover:cursor-pointer ${
            isModified
              ? "bg-[#0072CE] hover:bg-[#005fa8]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isModified}
          onClick={handleSave}
        >
          Add Area
        </button>
      </div>
    </div>
  );
}
