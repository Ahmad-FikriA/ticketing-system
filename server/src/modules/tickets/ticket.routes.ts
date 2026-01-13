import { Router } from "express";
import * as ticketController from "./ticket.controller.ts"
import { purchaseLimiter, checkInLimiter } from "../../middleware/rateLimiter.ts";

const router = Router();

// GET /api/tickets - Get all tickets
router.get("/", ticketController.getAllTickets);

// POST /api/tickets/purchase - Purchase ticket (rate limited: 5/min)
router.post("/purchase", purchaseLimiter, ticketController.purchaseTicket);

// GET /api/tickets/code/:code - Get ticket by QR code
router.get("/code/:code", ticketController.getTicketByCode);

// GET /api/tickets/user/:userId - Get tickets by user
router.get("/user/:userId", ticketController.getTicketsByUser);

// GET /api/tickets/:id - Get ticket by ID
router.get("/:id", ticketController.getTicketById);

// POST /api/tickets/:id/checkin - Check in (rate limited: 10/min)
router.post("/:id/checkin", checkInLimiter, ticketController.checkInTicket);


export default router;

