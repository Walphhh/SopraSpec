import { getStatusMessage, Status } from "@src/utils/status-codes";
import supabase from "../config/supabase-client";
import { Request, Response, NextFunction } from "express";


/**
 * Middleware to authenticate requests using Supabase.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns 
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    // Retrieve and process the header
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.replace("Bearer ", "")

    try { 
        // Authenticate the token with supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) { 
            return res.status(401).json({ error: "Invalid token" });
        }

        res.locals.user = user; // Store user info in response locals for downstream use
        next();
    } catch (error) { 
        return res.status(Status.UNAUTHORIZED).json({
            error: "Unauthorized"
        });
    }
}