import { getStatusMessage, Status } from "@src/utils/status-codes";
import supabase from "../config/supabase-client";
import { Request, Response } from "express";

//TODO: Fill in the documentation for the methods below

const Auth = {
  /**
   * Sign in a user with email and password
   * @param req
   * @param res
   * @returns JWT token
   */
  signInWithPassword: async (req: Request, res: Response) => {
    if (req.body && typeof req.body === "object") {
      const { email, password } = req.body;
      
      // Check for empty email or password first
      if (!email || !password) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Email and password are required" });
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          return res.status(Status.BAD_REQUEST).json({ error: error.message });
        }
        // Return JWT token for subsequent requests that requires authentication
        return res.status(Status.SUCCESS).json({ 
          message: "Login successful",
          token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          user: data.user
        });
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
