"use client";

import axios from "axios";
import { FileDown } from "lucide-react";
import { useState } from "react";

export default function DownloadAreaSpecButton({
  projectId,
  projectAreaId,
}: {
  projectId: string;
  projectAreaId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownloadAreaSpec = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/system-stacks/projects/${projectId}/projectAreas/${projectAreaId}/generate-pdf`,
        {},
        { responseType: "blob" } // 👈 expects a file
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Area_${projectAreaId}_Spec.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download area spec:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadAreaSpec}
      disabled={loading}
      className={`hover:cursor-pointer flex items-center gap-1 text-[#0072CE] hover:underline ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <FileDown size={16} />
      {loading ? "Generating..." : "Download"}
    </button>
  );
}
