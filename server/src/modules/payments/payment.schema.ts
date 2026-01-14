import { z } from "zod";

// ========== CREATE TRANSACTION ==========
export const createTransactionSchema = z.object({
    ticketId: z
        .string({ message: "Ticket ID is required" })
        .min(1, "Ticket ID is required"),
    
    customerDetails: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email("Invalid email").optional(),
        phone: z.string().optional(),
    }).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// ========== PAYMENT NOTIFICATION (Midtrans Webhook) ==========
export const paymentNotificationSchema = z.object({
    order_id: z.string(),
    transaction_status: z.string(),
    fraud_status: z.string().optional(),
    payment_type: z.string(),
    gross_amount: z.string(),
    transaction_time: z.string(),
    transaction_id: z.string(),
});

export type PaymentNotificationInput = z.infer<typeof paymentNotificationSchema>;

// ========== TICKET ID PARAM ==========
export const ticketIdParamSchema = z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
});

export type TicketIdParam = z.infer<typeof ticketIdParamSchema>;

// ========== ORDER ID PARAM ==========
export const orderIdParamSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
});

export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
