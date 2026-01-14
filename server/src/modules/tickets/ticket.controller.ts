import type { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.ts";
import type { 
    PurchaseTicketInput, 
    IdParam, 
    TicketCodeParam, 
    UserIdParam 
} from "./ticket.schema.ts";

/**
 * GET /api/tickets
 * Get all tickets (admin only)
 */
export async function getAllTickets(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/tickets/purchase
 * Purchase a new ticket (public)
 */
export async function purchaseTicket(
    req: Request<unknown, unknown, PurchaseTicketInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const ticket = await ticketService.purchaseTicket(req.body);
        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/tickets/:id
 * Get ticket by ID (admin only)
 */
export async function getTicketById(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const ticket = await ticketService.getTicketById(id);
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/tickets/code/:code
 * Get ticket by QR code (public - for verification)
 */
export async function getTicketByCode(
    req: Request<TicketCodeParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { code } = req.params;
        const ticket = await ticketService.getTicketByCode(code);
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/tickets/:id/checkin
 * Check in a ticket (admin only)
 */
export async function checkInTicket(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const ticket = await ticketService.checkInTicket(id);
        res.status(200).json({ 
            success: true, 
            message: "Check-in successful", 
            data: ticket 
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/tickets/user/:userId
 * Get tickets by user ID (admin only)
 */
export async function getTicketsByUser(
    req: Request<UserIdParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId } = req.params;
        const tickets = await ticketService.getTicketsByUser(userId);
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
}

