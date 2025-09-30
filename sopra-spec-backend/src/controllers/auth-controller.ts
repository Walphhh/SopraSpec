import { getStatusMessage, Status } from "@src/utils/status-codes";
import supabase from "../config/supabase-client";
import { Request, Response } from "express";
import { toUserModel } from "@src/utils/models/user-model";

const Auth = {
  /**
   * Sign in a user with email and password
   * @param req
   * @param res
   * @returns JWT token
   */
  signInWithPassword: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Email and password are required" });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      // Fetch user_information row
      let userInfo = null;
      if (data.user) {
        const { data: infoData, error: infoError } = await supabase
          .from("user_information")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (!infoError && infoData) {
          userInfo = toUserModel(infoData); // 👈 mapped to camelCase
        }
      }

      return res.status(Status.SUCCESS).json({
        message: "Login successful",
        token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
        user_information: userInfo,
      });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Log out a user
   * @param req
   * @param res
   * @returns success message
   */
  logout: async (req: Request, res: Response) => {
    try {
      const loggedOut = await supabase.auth.signOut();
      if (loggedOut.error) {
        return res
          .status(Status.UNAUTHORIZED)
          .json({ error: loggedOut.error.message });
      }
      return res.status(Status.SUCCESS).json({ message: "Logout successful" });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Sign up a user with email and password
   * @param req body { email, password, confirmPassword }
   * @param res
   * @returns { message, token, refresh_token, user, user_information }
   */
  signUpWithEmail: async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Enter email and password" });
    }
    if (password !== confirmPassword) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Passwords do not match" });
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        return res.status(Status.BAD_REQUEST).json({ error: error.message });
      }

      // Insert into user_information table after signup
      let userInfo = null;
      if (data.user) {
        const { data: infoData, error: infoError } = await supabase
          .from("user_information")
          .insert({ user_id: data.user.id })
          .select()
          .single();

        if (!infoError && infoData) {
          userInfo = toUserModel(infoData); // 👈 mapped to camelCase
        }
      }

      return res.status(Status.SUCCESS).json({
        message: "Sign up successful",
        token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
        user_information: userInfo,
      });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },

  /**
   * Refresh the JWT access token using a refresh token to keep users logged in after the current token expires
   * @param req Express Request object required { refresh_token }
   * @param res Express Response object
   * @returns JSON response with new tokens { message, token, refresh_token }
   */
  refreshToken: async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Missing refresh token" });
    }

    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token,
      });
      if (error) {
        return res.status(Status.UNAUTHORIZED).json({ error: error.message });
      }
      return res.status(Status.SUCCESS).json({
        message: "Token refreshed successfully",
        token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      });
    } catch {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: getStatusMessage(Status.INTERNAL_SERVER_ERROR) });
    }
  },
};

export default Auth;
