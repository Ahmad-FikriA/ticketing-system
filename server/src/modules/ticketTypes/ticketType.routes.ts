import { Router } from "express";
import * as ticketTypeController from "./ticketType.controller.ts";
import { authenticate, requireAdmin } from "../auth/auth.middleware.ts";
import { validate, validateParams } from "../../middleware/validate.ts";
import { createTicketTypeSchema, updateTicketTypeSchema, idParamSchema } from "./ticketType.schema.ts";

const ticketTypeRouter = Router();

// GET /api/ticket-types - Get all ticket types (public)
ticketTypeRouter.get("/", ticketTypeController.getAllTicketTypes);

// GET /api/ticket-types/:id - Get ticket type by ID (public)
ticketTypeRouter.get("/:id", validateParams(idParamSchema), ticketTypeController.getTicketTypeById);

// POST /api/ticket-types - Create a new ticket type (admin only)
ticketTypeRouter.post("/", authenticate, requireAdmin, validate(createTicketTypeSchema), ticketTypeController.createTicketType);

// PUT /api/ticket-types/:id - Update a ticket type (admin only)
ticketTypeRouter.put("/:id", authenticate, requireAdmin, validateParams(idParamSchema), validate(updateTicketTypeSchema), ticketTypeController.updateTicketType);

// DELETE /api/ticket-types/:id - Delete a ticket type (admin only)
ticketTypeRouter.delete("/:id", authenticate, requireAdmin, validateParams(idParamSchema), ticketTypeController.deleteTicketType);

export default ticketTypeRouter;
