import { Request, Response } from "express";
import supabase from "@src/config/supabase-client";
import { Status, getStatusMessage } from "@src/utils/status-codes";
import { toProjectModel } from "@src/utils/models/project-mapper";

const ProjectController = {
  /**
   * Create a new project
   * @param req body: { ownerId, builder, architect, installer, consultant, preparedBy, location, date, notes, thumbnailUrl }
   * @param res
   * @returns Created project
   */
  createProject: async (req: Request, res: Response) => {
    const {
      ownerId,
      builder,
      architect,
      installer,
      consultant,
      preparedBy,
      location,
      date,
      notes,
      thumbnailUrl,
    } = req.body;

    if (!ownerId) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Owner ID is required" });
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            owner_id: ownerId,
            builder,
            architect,
            installer,
            consultant,
            prepared_by: preparedBy,
            location,
            date,
            notes,
            thumbnail_url: thumbnailUrl,
          },
        ])
        .select()
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        message: "Project created successfully",
        project: toProjectModel(data),
      });
    } catch {
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },

  /**
   * Get all projects for a given user
   * @param req query: { ownerId }
   * @param res
   * @returns List of projects
   */
  getProjectsByUser: async (req: Request, res: Response) => {
    const { ownerId } = req.query;

    if (!ownerId || typeof ownerId !== "string") {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "ownerId query parameter is required" });
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId);

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        message: "Projects fetched successfully",
        projects: data.map(toProjectModel),
      });
    } catch {
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },
};

export default ProjectController;
