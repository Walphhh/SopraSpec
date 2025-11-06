"use client";

import axios from "axios";
import { FileDown } from "lucide-react";
import { useState } from "react";

export default function DownloadFullSpecButton({
  projectId,
}: {
  projectId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownloadFullSpec = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/system-stacks/projects/${projectId}/generate-pdf`,
        {},
        { responseType: "blob" } // 👈 expect file
      );

      // create blob url
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // create temporary link
      const a = document.createElement("a");
      a.href = url;
      a.download = `Project_${projectId}_Specs.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // cleanup
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadFullSpec}
      disabled={loading}
      className={`hover:cursor-pointer inline-flex items-center gap-2 rounded border border-[#0072CE] px-4 py-2 text-[#0072CE] transition-colors hover:bg-[#0072CE] hover:text-white ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <FileDown size={18} />
      {loading ? "Generating..." : "Download Full Project Spec"}
    </button>
  );
}
