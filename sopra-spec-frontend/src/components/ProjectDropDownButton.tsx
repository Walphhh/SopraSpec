"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

type ProjectDropdownButtonProps = {
    projects: string[]
}

export default function ProjectDropdownButton({ projects }: ProjectDropdownButtonProps) {
    const router = useRouter()
    const handleCreateNewProject = () => {
        router.push("/") // navigate to home page
    }

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative flex flex-col items-center" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#7C878E] text-white font-semibold rounded hover:bg-[#0072CE] transition w-56"
            >
                Add to Project
                <ChevronDown size={25} color="white"/>
            </button>

            {dropdownOpen && (
                <div className="absolute top-full mt-0 w-56 bg-[#ECECEC] border rounded shadow-lg z-10">
                    {projects.map((project, index) => (
                        <button
                            key={project}
                            className={`w-full text-center px-4 py-2 hover:bg-[#0072CE] hover:text-white ${
                                index < projects.length - 1 ? "border-b border-gray-300" : ""
                            }`}
                        >
                            {project}
                        </button>
                    ))}
                    <button 
                        onClick={handleCreateNewProject}
                        className="w-full text-center px-4 py-2 hover:bg-[#0072CE] hover:text-white font-semibold border-t border-gray-300"
                    >
                        + Create New Project
                    </button>
                </div>
            )}
        </div>
    )
}
