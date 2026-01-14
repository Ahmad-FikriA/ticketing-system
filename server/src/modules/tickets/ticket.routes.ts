import { Router } from "express";
import * as ticketController from "./ticket.controller.ts"
import { purchaseLimiter, checkInLimiter } from "../../middleware/rateLimiter.ts";
import { authenticate, requireAdmin } from "../auth/auth.middleware.ts";
import { validate, validateParams } from "../../middleware/validate.ts";
import { purchaseTicketSchema, ticketCodeParamSchema, idParamSchema, userIdParamSchema } from "./ticket.schema.ts";

const router = Router();

// ========== PUBLIC ROUTES ==========

// POST /api/tickets/purchase - Purchase ticket (rate limited: 5/min)
router.post("/purchase", purchaseLimiter, validate(purchaseTicketSchema), ticketController.purchaseTicket);

// GET /api/tickets/code/:code - Get ticket by QR code (for ticket verification)
router.get("/code/:code", validateParams(ticketCodeParamSchema), ticketController.getTicketByCode);

// ========== ADMIN ROUTES ==========

// GET /api/tickets - Get all tickets (admin only)
router.get("/", authenticate, requireAdmin, ticketController.getAllTickets);

// GET /api/tickets/user/:userId - Get tickets by user (admin only)
router.get("/user/:userId", authenticate, requireAdmin, validateParams(userIdParamSchema), ticketController.getTicketsByUser);

// GET /api/tickets/:id - Get ticket by ID (admin only)
router.get("/:id", authenticate, requireAdmin, validateParams(idParamSchema), ticketController.getTicketById);

// POST /api/tickets/:id/checkin - Check in (admin only, rate limited: 10/min)
router.post("/:id/checkin", authenticate, requireAdmin, validateParams(idParamSchema), checkInLimiter, ticketController.checkInTicket);


export default router;

