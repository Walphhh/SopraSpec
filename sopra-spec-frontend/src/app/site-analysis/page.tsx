"use client";

import { useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import ProjectDropdownButton from "@/components/ProjectDropDownButton";

export default function SiteAnalysis() {
    const [detectedArea, setDetectedArea] = useState("Detected area...");

    return (
        <div className="p-6">
            {/* Title */}
            <h1>Site Analysis</h1>

            {/* Instruction */}
            <h4 className="mb-6">
                Review AI-detected building areas from uploaded site plans and technical drawings.
            </h4>

            {/* Coming soon note */}
            <div className="w-full flex justify-center">
                <p className="italic mb-6 text-red-600 font-semibold text-center">
                    This feature is not yet available (coming soon).
                </p>
            </div>

            {/* Upload button */}
            <div className="mb-6 flex justify-center">
                <input
                    id="upload-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) e.target.value = "";
                    }}
                />
                <label
                    htmlFor="upload-file"
                    className="inline-flex items-center justify-center w-56 gap-2 px-4 py-2 bg-[#7C878E] text-white font-semibold rounded cursor-pointer hover:bg-[#0072CE] transition"
                >
                    <Upload size={18} /> Upload File
                </label>
            </div>

            {/* Area name / ID + detected area field */}
            <div className="flex items-center space-x-4 mb-8">
                <label className="font-medium whitespace-nowrap text-[#0072CE] font-semibold">
                    Area name / ID:
                </label>
                <input
                    type="text"
                    className="flex-1 border border-[#7C878E] rounded px-3 py-2 text-sm"
                    value={detectedArea}
                    onChange={(e) => setDetectedArea(e.target.value)}
                />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-center space-y-4">
                {/* Re-run AI Detection */}
                <button className="inline-flex items-center justify-center w-56 gap-2 px-4 py-2 bg-[#7C878E] text-white font-semibold rounded cursor-pointer hover:bg-[#0072CE] transition">
                    <RefreshCw className="w-4 h-4" />
                    Re-run AI Detection
                </button>

                {/* Add to Project dropdown */}
                <div className="relative">
                    <ProjectDropdownButton projects={["Project A", "Project B", "Project C"]} />
                </div>
            </div>
        </div>
    );
}
