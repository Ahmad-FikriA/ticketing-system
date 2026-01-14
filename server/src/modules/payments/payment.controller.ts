import * as paymentService from "./payment.service.ts";
import type { Request, Response, NextFunction } from "express";
import type {
    CreateTransactionInput,
    TicketIdParam,
    OrderIdParam,
} from "./payment.schema.ts";

/**
 * Create Midtrans Snap transaction
 * POST /api/payments/create-transaction
 */
export const createTransaction = async (
    req: Request<unknown, unknown, CreateTransactionInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ticketId, customerDetails } = req.body;

        const transaction = await paymentService.createTransaction({
            ticketId,
            customerDetails,
        });

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
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
    } catch (error) {
        console.error("Notification handling error:", error);
        // Still return 200 to Midtrans to prevent retries for invalid data
        res.status(200).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/**
 * Get transaction status from Midtrans
 * GET /api/payments/status/:orderId
 */
export const getTransactionStatus = async (
    req: Request<OrderIdParam>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.params;

        const status = await paymentService.getTransactionStatus(orderId);

        res.status(200).json({
            success: true,
            data: status,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment by ticket ID
 * GET /api/payments/ticket/:ticketId
 */
export const getPaymentByTicketId = async (
    req: Request<TicketIdParam>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ticketId } = req.params;

        const payment = await paymentService.getPaymentByTicketId(ticketId);

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get Midtrans client key for frontend
 * GET /api/payments/client-key
 */
export const getClientKey = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const clientKey = paymentService.getClientKey();

        res.status(200).json({
            success: true,
            data: { clientKey },
        });
    } catch (error) {
        next(error);
    }
};
