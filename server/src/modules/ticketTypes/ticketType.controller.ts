import type { Request, Response, NextFunction } from "express";
import * as ticketTypeService from "./ticketType.service.ts";
import type { IdParam, CreateTicketTypeInput, UpdateTicketTypeInput } from "./ticketType.schema.ts";

/**
 * GET /api/ticket-types
 * Get all ticket types (public)
 */
export async function getAllTicketTypes(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const ticketTypes = await ticketTypeService.getAllTicketTypes();
        res.status(200).json({ success: true, data: ticketTypes });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/ticket-types/:id
 * Get ticket type by ID with availability (public)
 */
export async function getTicketTypeById(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const ticketType = await ticketTypeService.getTicketTypeWithAvailability(id);
        res.status(200).json({ success: true, data: ticketType });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/ticket-types
 * Create a new ticket type (admin only)
 */
export async function createTicketType(
    req: Request<unknown, unknown, CreateTicketTypeInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const ticketType = await ticketTypeService.createTicketType(req.body);
        res.status(201).json({ success: true, data: ticketType });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/ticket-types/:id
 * Update a ticket type (admin only)
 */
export async function updateTicketType(
    req: Request<IdParam, unknown, UpdateTicketTypeInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        const ticketType = await ticketTypeService.updateTicketType(id, req.body);
        res.status(200).json({ success: true, data: ticketType });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/ticket-types/:id
 * Delete a ticket type (admin only)
 */
export async function deleteTicketType(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { id } = req.params;
        await ticketTypeService.deleteTicketType(id);
        res.status(200).json({ success: true, message: "Ticket type deleted successfully" });
    } catch (error) {
        next(error);
    }
}

