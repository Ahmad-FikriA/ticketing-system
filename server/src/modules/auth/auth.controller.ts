import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.ts";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/login
 * Admin login
 */
export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginAdmin(email, password);

        // Set token in HTTP-only cookie
        res.cookie("token", token, COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/logout
 * Logout (clear cookie)
 */
export async function logout(
    _req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Logout successful" });
}

/**
 * GET /api/auth/me
 * Get current admin info
 */
export async function getMe(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ 
                success: false, 
                error: { code: "UNAUTHORIZED", message: "Not authenticated" } 
            });
            return;
        }

        const user = await authService.getAdminById(userId);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/admin/create
 * Create new admin (admin only)
 */
export async function createAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const admin = await authService.createAdmin(req.body);
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: admin,
        });
    } catch (error) {
        next(error);
    }
}
