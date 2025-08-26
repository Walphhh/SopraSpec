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
   * @returns JWT token upon successful signup
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

  /**
   * Sign up a user with email and password
   * @param req body { email, password, confirmPassword }
   * @param res
   * @returns
   */
  signUpWithEmail: async (req: Request, res: Response) => {
    if (req.body && typeof req.body === "object") {
      const { email, password, confirmPassword } = req.body;

      // Validate required field password and email 
      if (!email || !password) { 
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Enter email and password" });
      }
      // Validate valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Please provide a valid email address"});
      }
      // Validate password strength
      if (password.length < 8) { 
        return res
          .status(Status.BAD_REQUEST)
          .json({ error: "Password must be at least 8 characters long"});
      }
      try {
      // Sign up user in supabase
        const { data, error } = await supabase.auth.signUp({
          email: email, 
          password: password
        });

        // Handling duplicate user error
        if (error) { 
          if (error.message.includes("User already registered")) { 
            return res.status(Status.BAD_REQUEST).json({ error: "User already registered" });
          }
          return res.status(Status.BAD_REQUEST).json({ error: error.message });
        }

        // Disabled email confirmation -> return success message after sign up. 
        return res.status(Status.SUCCESS).json({ 
          message: "Sign up successful", 
          token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          user: data.user
        })
      } catch (error) {
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
      }
    }
  },
};

export default Auth;
