"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import type { Project } from "@/utils/types";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useAuth } from "@/utils/auth-provider";
import { getBackendUrl } from "@/utils/get-backend-url";
import axios from "axios";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { get, create } = useProjects();

  const projectId = useMemo(() => {
    if (Array.isArray(params?.id)) return params.id[0];
    return params?.id ?? "";
  }, [params]);

  const blankProject: Project = useMemo(
    () => ({
      id: "",
      ownerId: user?.id ?? "",
      name: "",
      architect: "",
      builder: "",
      installer: "",
      consultant: "",
      preparedBy: "",
      location: "",
      date: "",
      notes: "",
      thumbnail: "",
    }),
    [user?.id]
  );

  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const creationPromiseRef = useRef<Promise<Project> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let ignore = false;

    const loadProject = async () => {
      if (projectId === "new") {
        if (!user?.id) {
          setError("You must be logged in to create a project.");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setIsModified(false);
        setMissingFields([]);
        setError("");

        try {
          if (!creationPromiseRef.current) {
            creationPromiseRef.current = create({ ownerId: user.id });
          }

          const created = await creationPromiseRef.current;
          if (ignore) return;
          setProject(created);
          setForm(created);
          setIsLoading(false);
          setIsModified(false);
          setMissingFields([]);
          router.replace(`/projects/${created.id}/project-details`);
          creationPromiseRef.current = null;
        } catch (creationError: any) {
          if (ignore) return;
          console.error(creationError);
          setError(
            creationError?.response?.data?.error ?? "Failed to create project."
          );
          setIsLoading(false);
          creationPromiseRef.current = null;
        }
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        creationPromiseRef.current = null;
        const detail = await get(projectId);
        if (ignore) return;
        if (!detail) {
          setProject(blankProject);
          setForm(blankProject);
        } else {
          const { areas: _areas, ...projectData } = detail;
          setProject(projectData);
          setForm(projectData);
        }
        setIsModified(false);
        setMissingFields([]);
      } catch (fetchError) {
        if (ignore) return;
        console.error(fetchError);
        setError("Failed to load project.");
        setProject(blankProject);
        setForm(blankProject);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      ignore = true;
    };
  }, [projectId, blankProject, create, get, router, user?.id]);

  if (!project || projectId === "new") {
    return (
      <div className="p-6">
        {error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="text-[#7C878E]">
            {projectId === "new"
              ? isLoading
                ? "Creating project..."
                : "Preparing project editor..."
              : "Loading project..."}
          </div>
        )}
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Project Name", required: true },
    { key: "architect", label: "Architect", required: true },
    { key: "builder", label: "Builder", required: true },
    { key: "installer", label: "Installer", required: true },
    { key: "consultant", label: "Consultant", required: true },
    { key: "preparedBy", label: "Prepared by", required: true },
    { key: "location", label: "Location", required: true },
    { key: "date", label: "Date", required: true },
    { key: "notes", label: "Notes", required: false },
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
      if (field.required && !form[field.key]?.toString().trim()) {
        missing.push(field.key);
      }
    }

    if (missing.length > 0) {
      setError("Please fill in all required fields");
      setMissingFields(missing);
      return;
    }

    if (!project?.id) {
      setError("Project is not ready to save yet.");
      return;
    }

    try {
      const { id: _id, ...updates } = { ...form, ownerId: project.ownerId };

      await axios.patch(getBackendUrl(`/projects/${project.id}`), updates);

      const detail = await get(project.id);
      if (detail) {
        const { areas: _areas, ...projectData } = detail;
        setProject(projectData);
        setForm(projectData);
      }

      setIsModified(false);
      setError("");
      setMissingFields([]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update project.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h5 className="text-left -mt-6 mb-6">Project Details</h5>

      <div className="space-y-4">
        {fields.map((field) => {
          const isError = missingFields.includes(field.key);
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
                  placeholder={
                    projectId === "new" ? `Please enter ${field.label}` : ""
                  }
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border-2 rounded p-2 pr-10 outline-none bg-transparent transition-colors ${
                    isError
                      ? "border-red-500 text-red-500"
                      : "border-[#7C878E] text-[#7C878E] focus:border-[#0072CE] focus:text-[#0072CE]"
                  }`}
                />
                <Pencil
                  size={18}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    focusedField === field.key
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

        <div className="flex items-center space-x-4">
          <label className="w-40 font-semibold text-[#0072CE] text-left">
            Thumbnail (optional):
          </label>

          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                handleChange("thumbnail", imageUrl);
              }
            }}
          />

          <label
            htmlFor="thumbnail-upload"
            className="flex items-center justify-center w-48 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
          >
            <Upload className="mr-2" size={18} /> Upload Image
          </label>

          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Thumbnail preview"
              className="ml-2 w-20 h-20 object-cover rounded border"
            />
          )}
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        <button
          className={`px-6 py-3 font-bold rounded text-white ${
            isModified
              ? "bg-[#0072CE] hover:bg-[#005fa8]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isModified}
          onClick={handleSave}
        >
          Save Project Details
        </button>
      </div>
    </div>
  );
}
