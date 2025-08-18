import { getStatusMessage, Status } from "@src/utils/status-codes";
import supabase from "../config/supabase-client";
import { Request, Response } from "express";

//TODO: Fill in the documentation for the methods below

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
      console.log("Received email:", email);
      console.log("Received password:", password);

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
        console.error("Error during sign-in:", error);
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
        return res.status(401).json({ error: loggedOut.error.message });
      } else {
        return res.status(201).json({ message: "Logout successful" });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(501).json({ error: "Internal server error" });
    }
  },
};

export default Auth;
