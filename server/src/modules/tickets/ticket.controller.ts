import * as ticketService from './ticket.service.ts';
import type { Request, Response, NextFunction } from 'express';

export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId, ticketTypeId, attendee } = req.body;

        const ticket = await ticketService.createTicket({ 
            userId,
            ticketTypeId,
            attendee
        });
        res.status(201).json(ticket);
    } catch (error){
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
            return res.status(400).json({ message: "Ticket ID is required" });
        }
        const ticket = await ticketService.getTicketById(id);
        if(!ticket){
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (error){
        next(error);
    }
}

export const checkInTicket = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Ticket ID is required" });
        }
        const ticket = await ticketService.checkInTicket(id);
        res.status(200).json(ticket);
    }
    catch (error){
        next(error);
    }
}
