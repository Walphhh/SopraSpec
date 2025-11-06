import { Request, Response } from "express";
import supabase from "@src/config/supabase-client";
import { Status, getStatusMessage } from "@src/utils/status-codes";
import { toSnakeCase } from "@src/utils/to-snake-case";

const ProjectController = {
  /**
   * Create a new project
   */
  createProject: async (req: Request, res: Response) => {
    try {
      const { ownerId, name, ...projectData } = req.body;

      if (!ownerId) {
        return res.status(400).json({ error: "Missing ownerId" });
      }

      // 🧩 Auto-generate name if empty or duplicate
      let projectName = name?.trim();

      if (!projectName) {
        const { data: existing, error: fetchError } = await supabase
          .from("projects")
          .select("name")
          .ilike("name", "New Project%");

        if (fetchError) {
          console.error(fetchError);
          return res.status(400).json({ error: fetchError.message });
        }

        const existingNames = existing.map((p) => p.name);
        let counter = 0;

        for (const n of existingNames) {
          const match = n.match(/^New Project\s*(\d+)?$/i);
          if (match) {
            const num = match[1] ? parseInt(match[1], 10) : 0;
            if (num >= counter) counter = num + 1;
          }
        }

        projectName = counter === 0 ? "New Project" : `New Project ${counter}`;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([{ owner_id: ownerId, name: projectName, ...projectData }])
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });

      return res.status(200).json({ project: data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
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

  addProjectArea: async (req: Request, res: Response) => {
    try {
      const {
        project_id,
        name,
        area_type,
        drawing,
        system_stack_id,
        status,
        combination,
      } = req.body;

      console.log("Received addProjectArea request:", req.body);

      // Validate required fields
      if (!project_id || !name || !area_type) {
        return res.status(Status.BAD_REQUEST).json({
          error: "Missing required fields: project_id, name, or area_type",
        });
      }

      // Insert new area into project_areas table
      const { data, error } = await supabase
        .from("project_areas")
        .insert([
          {
            project_id,
            name,
            area_type,
            drawing: drawing || null,
            system_stack_id: system_stack_id || null,
            status: status || "pending", // optional default
            combination: combination,
          },
        ])
        .select()
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        message: "Project area added successfully",
        project_area: data,
      });
    } catch (err) {
      console.error("Error adding project area:", err);
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Delete a specific project area
   */
  deleteProjectArea: async (req: Request, res: Response) => {
    try {
      const { projectAreaId } = req.params;

      if (!projectAreaId) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Missing projectAreaId" });
      }

      // Check if the area exists first
      const { data: existing, error: fetchError } = await supabase
        .from("project_areas")
        .select("id, name")
        .eq("id", projectAreaId)
        .single();

      if (fetchError || !existing) {
        return res
          .status(Status.NOT_FOUND)
          .json({ error: "Project area not found" });
      }

      // Perform delete
      const { error } = await supabase
        .from("project_areas")
        .delete()
        .eq("id", projectAreaId);

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        message: `Project area '${existing.name}' deleted successfully`,
      });
    } catch (err) {
      console.error("Error deleting project area:", err);
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  updateProject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // project id from URL
      const updates = req.body; // fields to update
      const mappedUpdates = toSnakeCase(updates);

      if (!id) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Missing project ID" });
      }

      // Optional: validate that updates has at least one key
      if (!updates || Object.keys(updates).length === 0) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "No update fields provided" });
      }

      // Check if project exists first
      const { data: existing, error: fetchError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", id)
        .single();

      if (fetchError || !existing) {
        return res
          .status(Status.NOT_FOUND)
          .json({ error: "Project not found" });
      }

      // Perform the update
      const { data, error } = await supabase
        .from("projects")
        .update(mappedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        project: data,
      });
    } catch (err) {
      console.error("Update project error:", err);
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default ProjectController;
