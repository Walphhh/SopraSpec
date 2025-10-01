"use client";

import ProjectCard from "@/components/ProjectCard";

export default function SpecificationGeneratorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      <h4 className="mb-10">
        Select an existing project or create a new project to start generating
        product specifications
      </h4>

      <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
        {allProjects.map((project) => {
          const isNewProject = project.id === "new";
          return (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                router.push(
                  `/projects/${
                    isNewProject ? "new" : project.id
                  }/project-details`
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}
