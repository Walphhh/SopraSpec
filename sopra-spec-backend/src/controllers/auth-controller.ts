import { getStatusMessage, Status } from "@src/utils/status-codes";
import supabase from "../config/supabase-client";
import { Request, Response } from "express";

//TODO: Fill in the documentation for the methods below
// We do not need to use a controller for this because it is being handled by the Supabase client directly.
const Auth = {
  /**
   *
   * @param req
   * @param res
   * @returns
   */
  signInWithPassword: async (req: Request, res: Response) => {
    if (req.body && typeof req.body === "object") {
      const { email, password } = req.body;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        // Check for empty email or password
        if (!email || !password) {
          return res
            .status(Status.BAD_REQUEST)
            .json({ error: "Email and password are required" });
        }

        if (error) {
          return res.status(Status.BAD_REQUEST).json({ error: error.message });
        }

        return res.status(Status.SUCCESS).json({ message: "Login successful" });
      } catch (error) {
        return res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
      }
    } else {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: getStatusMessage(Status.BAD_REQUEST) });
    }
  },

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  logout: async (req: Request, res: Response) => {
    try {
      const loggedOut = await supabase.auth.signOut(); // could probably benefit from a better variable name
      if (loggedOut.error) {
        return res
          .status(Status.UNAUTHORIZED)
          .json({ error: loggedOut.error.message });
      } else {
        console.log(loggedOut);
        return res
          .status(Status.SUCCESS)
          .json({ message: "Logout successful" });
      }
    } catch (error) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default Auth;
