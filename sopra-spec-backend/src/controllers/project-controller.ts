import { Request, Response } from "express";
import supabase from "@src/config/supabase-client";
import { Status, getStatusMessage } from "@src/utils/status-codes";

const ProjectController = {
  /**
   * Create a new project
   */
  createProject: async (req: Request, res: Response) => {
    try {
      const { ownerId, ...projectData } = req.body;

      const { data, error } = await supabase
        .from("projects")
        .insert([{ owner_id: ownerId, ...projectData }])
        .select()
        .single();

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res.status(Status.SUCCESS).json({ project: data });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Get all projects for an owner
   */
  getProjectsByOwner: async (req: Request, res: Response) => {
    try {
      const { ownerId } = req.query;
      if (!ownerId) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Missing ownerId" });
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId);

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res.status(Status.SUCCESS).json({ projects: data });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Get a single project by ID
   */
  getProjectById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from("projects")
        .select("*, project_areas(*)") // join areas
        .eq("id", id)
        .single();

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res.status(Status.SUCCESS).json({ project: data });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Delete a project
   */
  deleteProject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res
        .status(Status.SUCCESS)
        .json({ message: "Project deleted successfully" });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Create a project area
   */
  createProjectArea: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;
      const { name, areaType, drawing, systemStackId, status } = req.body;

      const { data, error } = await supabase
        .from("project_areas")
        .insert([
          {
            project_id: projectId,
            name,
            area_type: areaType,
            drawing,
            system_stack_id: systemStackId,
            status,
          },
        ])
        .select()
        .single();

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res.status(Status.SUCCESS).json({ project_area: data });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Get all areas for a project
   */
  getProjectAreas: async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      const { data, error } = await supabase
        .from("project_areas")
        .select("*")
        .eq("project_id", projectId);

      if (error)
        return res.status(Status.BAD_REQUEST).json({ error: error.message });

      return res.status(Status.SUCCESS).json({ project_areas: data });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default ProjectController;
