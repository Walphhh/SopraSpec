import supabase from "../config/supabase-client";
import { Request, Response } from "express";

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const signInWithPassword = async (req: Request, res: Response) => {
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
          .status(400)
          .json({ error: "Email and password are required" });
      }

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during sign-in:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(400).json({ error: "invalid request body" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const loggedOut = await supabase.auth.signOut(); // could probably benefit from a better variable name
    if (loggedOut.error) {
      return res.status(400).json({ error: loggedOut.error.message });
    } else {
      return res.status(200).json({ message: "Logout successful" });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
