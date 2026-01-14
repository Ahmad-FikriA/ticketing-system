import { Router } from "express";
import * as authController from "./auth.controller.ts";
import { authenticate, requireAdmin } from "./auth.middleware.ts";
import { validate } from "../../middleware/validate.ts";
import { loginSchema, createAdminSchema } from "./auth.schema.ts";

const authRouter = Router();

// POST /api/auth/login - Admin login
authRouter.post("/login", validate(loginSchema), authController.login);

// POST /api/auth/logout - Logout
authRouter.post("/logout", authController.logout);

// GET /api/auth/me - Get current admin info (protected)
authRouter.get("/me", authenticate, authController.getMe);

// POST /api/auth/admin/create - Create new admin (protected, admin only)
authRouter.post("/admin/create", authenticate, requireAdmin, validate(createAdminSchema), authController.createAdmin);

export default authRouter;
