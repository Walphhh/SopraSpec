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

  /**
   * Get recommended system stacks
   * @param req Express Request object with body { user_id, selections }
   * @param res Express Response object
   * @returns JSON response with recommended system stacks based on user selections
   */
  getRecommendedSystems: async (req: Request, res: Response) => {
    const { user_id, selections } = req.body;

    if (!user_id || !selections) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "User ID and selections are required" });
    }

    try {
      // Build query based on user selections
      let query = supabase
        .from("system_stack")
        .select(`
        id,
        substrate,
        insulated,
        exposure,
        material,
        attachment,
        system_stack_layer (
          priority,
          product:product_id (
            id,
            name,
            layer,
            distributor_id,
            distributor (
              id,
              distributor_name
            )
          )
        )
      `);

      // Apply user selections as filters
      if (selections.substrate) {
        query = query.eq("substrate", selections.substrate);
      }
      if (selections.material) {
        query = query.eq("material", selections.material);
      }
      if (selections.insulated !== undefined) {
        query = query.eq("insulated", selections.insulated);
      }
      if (selections.exposure !== undefined) {
        query = query.eq("exposure", selections.exposure);
      }
      if (selections.attachment) {
        query = query.eq("attachment", selections.attachment);
      }

      const { data: recommendedSystems, error } = await query;

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      if (!recommendedSystems || recommendedSystems.length === 0) {
        return res.status(Status.NOT_FOUND).json({
          message: "No recommended systems found for the given selections",
          data: {
            selections: selections,
            recommendedSystems: [],
            count: 0
          }
        });
      }

      return res.status(Status.SUCCESS).json({
        message: "System recommendations generated successfully",
        data: {
          selections: selections,
          recommendedSystems: recommendedSystems,
          count: recommendedSystems.length
        }
      });
    } catch (error) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Get available selection options for the wizard
   * @param req Express Request object
   * @param res Express Response object
   * @returns JSON response with available options for each selection step
   */
  getSelectionOptions: async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from("system_stack")
        .select("substrate, material, attachment")
        .not("substrate", "is", null)
        .not("material", "is", null)
        .not("attachment", "is", null);

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      // Extract unique values for each selection option
      const substrates = [...new Set(data.map(item => item.substrate))];
      const materials = [...new Set(data.map(item => item.material))];
      const attachments = [...new Set(data.map(item => item.attachment))];

      return res.status(Status.SUCCESS).json({
        message: "Selection options retrieved successfully",
        data: {
          steps: {
            substrate: {
              title: "What type of substrate?",
              options: substrates.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
            },
            material: {
              title: "What material type?",
              options: materials.map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))
            },
            insulated: {
              title: "Do you need insulation?",
              options: [
                { value: true, label: "Yes, insulated" },
                { value: false, label: "No, non-insulated" }
              ]
            },
            exposure: {
              title: "Will it be exposed?",
              options: [
                { value: true, label: "Yes, exposed" },
                { value: false, label: "No, protected" }
              ]
            },
            attachment: {
              title: "What attachment method?",
              options: attachments.map(a => ({ value: a, label: a.replace('_', ' ').charAt(0).toUpperCase() + a.replace('_', ' ').slice(1) }))
            }
          }
        }
      });
    } catch (error) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default SystemStack;