import { Request, Response } from "express";
import supabase from "../config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";

const SystemStack = {
  /**
   * Get specific system stack by ID with its products
   * @param req Express Request object with system_stack_id in params
   * @param res Express Response object
   * @returns JSON response with system stack and its products
   */
  getSystemStackById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from("system_stack")
        .select(`
          id,
          substrate,
          insulated,
          exposure,
          material,
          attachment,
          system_stack_layer (
            product:product_id (
              name,
              layer,
              distributor:distributor_id (
                distributor_name
              )
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      return res.status(Status.SUCCESS).json({
        message: "System stack retrieved successfully",
        data: data,
      });
    } catch (error) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default SystemStack;