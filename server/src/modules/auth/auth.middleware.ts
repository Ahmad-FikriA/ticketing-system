import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.service.ts";
import { UnauthorizedError, ForbiddenError } from "../../lib/errors.ts";

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}

/**
 * Authenticate user from JWT token (cookie or Authorization header)
 */
export function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token as string ;

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        next(new UnauthorizedError("Authentication required", "AUTH_REQUIRED"));
        return;
    }

    try {
        const payload = verifyToken(token);
        req.userId = payload.userId;
        req.userRole = payload.role;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Require admin role (must be used after authenticate middleware)
 */
export function requireAdmin(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    if (req.userRole !== "ADMIN") {
        next(new ForbiddenError("Admin access required", "ADMIN_REQUIRED"));
        return;
    }
    next();
}
