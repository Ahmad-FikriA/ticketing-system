import * as paymentService from './payment.service.ts';
import type { Request, Response, NextFunction } from 'express';

/**
 * Create Midtrans Snap transaction
 * POST /api/payments/create-transaction
 */
export const createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ticketId, customerDetails } = req.body;
        
        if (!ticketId) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }

        const transaction = await paymentService.createTransaction({
            ticketId,
            customerDetails,
        });

        res.status(201).json(transaction);
    } catch (error: any) {
        if (error.message === "Ticket not found") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === "Ticket already paid" || 
            error.message === "Ticket has been cancelled" ||
            error.message === "Payment already completed for this ticket") {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

/**
 * Handle Midtrans webhook notification
 * POST /api/payments/notification
 */
export const handleNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const notificationJson = req.body;

        const result = await paymentService.handleNotification(notificationJson);

        // Midtrans expects 200 OK response
        res.status(200).json({ 
            success: true,
            message: "Notification processed",
            data: result,
        });
    } catch (error: any) {
        console.error("Notification handling error:", error);
        // Still return 200 to Midtrans to prevent retries for invalid data
        res.status(200).json({ 
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get transaction status from Midtrans
 * GET /api/payments/status/:orderId
 */
export const getTransactionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }

        const status = await paymentService.getTransactionStatus(orderId);
        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment by ticket ID
 * GET /api/payments/ticket/:ticketId
 */
export const getPaymentByTicketId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ticketId } = req.params;

        if (!ticketId) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }

        const payment = await paymentService.getPaymentByTicketId(ticketId);
        res.status(200).json(payment);
    } catch (error: any) {
        if (error.message === "Payment not found") {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
};

/**
 * Get Midtrans client key for frontend
 * GET /api/payments/client-key
 */
export const getClientKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const clientKey = paymentService.getClientKey();
        res.status(200).json({ clientKey });
    } catch (error) {
        next(error);
    }
};
