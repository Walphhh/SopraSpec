"use client";

import axios from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBackendUrl } from "@/utils/get-backend-url";

export default function DeleteAreaButton({
  projectId,
  projectAreaId,
  areaName,
}: {
  projectId: string;
  projectAreaId: string;
  areaName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the area "${areaName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(
        getBackendUrl(`/projects/${projectId}/areas/${projectAreaId}`)
      );

      // Refresh the page or refetch data
      router.refresh();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`hover:cursor-pointer flex items-center gap-1 text-red-500 hover:underline ${loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      <Trash2 size={16} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}