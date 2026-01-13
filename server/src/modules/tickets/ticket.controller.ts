import * as ticketService from './ticket.service.ts';
import type { Request, Response, NextFunction } from 'express';

export const getAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}

export const purchaseTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, name, phone, emailConsent, ticketTypeId, attendee, expiryDays } = req.body;

        if (!email || !name || !ticketTypeId || !attendee) {
            return res.status(400).json({ error: "Missing required fields: email, name, ticketTypeId, attendee" });
        }

        if (!emailConsent) {
            return res.status(400).json({ error: "You must agree to receive email notifications" });
        }

        const ticket = await ticketService.purchaseTicket({ 
            email,
            name,
            phone,
            emailConsent,
            ticketTypeId,
            attendee,
            expiryDays,
        });

        res.status(201).json(ticket);
    } catch (error: any) {
        if (error.message === "Tickets sold out") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Ticket type not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Email consent is required") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Failed to send ticket email") {
            return res.status(500).json({ error: "Purchase successful but failed to send email. Please contact support." });
        }
        next(error);
    }
}

export const getTicketById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try { 
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }
        const ticket = await ticketService.getTicketById(id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (error) {
        next(error);
    }
}

export const getTicketByCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code } = req.params;
        if (!code) {
            return res.status(400).json({ error: "Ticket code is required" });
        }
        const ticket = await ticketService.getTicketByCode(code);
        res.status(200).json(ticket);
    } catch (error: any) {
        if (error.message === "Ticket not found") {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
}

export const checkInTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }
        const ticket = await ticketService.checkInTicket(id);
        res.status(200).json({ message: "Check-in successful", ticket });
    } catch (error: any) {
        const clientErrors = [
            "Ticket not found",
            "Ticket has expired",
            "Ticket already used",
            "Ticket must be paid before check-in",
        ];

        if (clientErrors.includes(error.message)) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
}

export const getTicketsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const tickets = await ticketService.getTicketsByUser(userId);
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}

