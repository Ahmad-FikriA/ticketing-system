import { prisma } from "../../../lib/prisma.ts";
import { snap, coreApi } from "../../config/midtrans.config.ts";
import {
    NotFoundError,
    BadRequestError,
    ConflictError,
    ServiceUnavailableError,
} from "../../lib/errors.ts";

interface CreateTransactionParams {
    ticketId: string;
    customerDetails?: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    } | undefined;
}

interface MidtransNotification {
    order_id: string;
    transaction_status: string;
    fraud_status?: string;
    payment_type: string;
    gross_amount: string;
    transaction_time: string;
    transaction_id: string;
}

/**
 * Create a Midtrans Snap transaction for a ticket purchase
 */
export async function createTransaction(params: CreateTransactionParams) {
    const { ticketId, customerDetails } = params;

    // 1. Get ticket with related data
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
            ticketType: true,
            user: true,
        },
    });

    if (!ticket) {
        throw new NotFoundError("Ticket not found");
    }

    if (ticket.status === "PAID") {
        throw new ConflictError("Ticket already paid");
    }

    if (ticket.status === "CANCELLED") {
        throw new BadRequestError("Ticket has been cancelled");
    }

    // 2. Check if payment already exists for this ticket
    const existingPayment = await prisma.payment.findUnique({
        where: { ticketId: ticket.id },
    });

    if (existingPayment && existingPayment.status === "success") {
        throw new ConflictError("Payment already completed for this ticket");
    }

    // 3. Generate unique order ID
    const orderId = `ORDER-${ticket.id}-${Date.now()}`;

    // 4. Create Midtrans transaction parameter
    const transactionParams = {
        transaction_details: {
            order_id: orderId,
            gross_amount: ticket.ticketType.price,
        },
        item_details: [
            {
                id: ticket.ticketTypeId,
                price: ticket.ticketType.price,
                quantity: 1,
                name: ticket.ticketType.name,
            },
        ],
        customer_details: {
            first_name: customerDetails?.firstName || ticket.user.name.split(" ")[0],
            last_name: customerDetails?.lastName || ticket.user.name.split(" ").slice(1).join(" ") || "",
            email: customerDetails?.email || ticket.user.email,
            phone: customerDetails?.phone || ticket.user.phone || "",
        },
        callbacks: {
            finish: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/finish`,
        },
    };

    // 5. Create Snap transaction
    const transaction = await snap.createTransaction(transactionParams);

    // 6. Create or update payment record in database
    if (existingPayment) {
        await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
                provider: "midtrans",
                amount: ticket.ticketType.price,
                status: "pending",
            },
        });
    } else {
        await prisma.payment.create({
            data: {
                provider: "midtrans",
                amount: ticket.ticketType.price,
                status: "pending",
                ticketId: ticket.id,
            },
        });
    }

    return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
        orderId,
        ticketId: ticket.id,
    };
}

/**
 * Handle Midtrans webhook/notification
 */
export async function handleNotification(notificationJson: MidtransNotification) {
    // 1. Verify notification with Midtrans
    const statusResponse = await coreApi.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    // 2. Extract ticket ID from order ID (format: ORDER-{ticketId}-{timestamp})
    const ticketId = orderId.split("-")[1];

    if (!ticketId) {
        throw new BadRequestError("Invalid order ID format");
    }

    // 3. Get ticket and payment
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { payments: true },
    });

    if (!ticket) {
        throw new NotFoundError("Ticket not found");
    }

    const payment = ticket.payments[0];
    if (!payment) {
        throw new NotFoundError("Payment not found");
    }

    // 4. Update based on transaction status
    let paymentStatus = "pending";
    let ticketStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
    let paidAt: Date | null = null;

    if (transactionStatus === "capture") {
        // Credit card transaction
        if (fraudStatus === "accept") {
            paymentStatus = "success";
            ticketStatus = "PAID";
            paidAt = new Date();
        } else if (fraudStatus === "challenge") {
            paymentStatus = "challenge";
            ticketStatus = "PENDING";
        }
    } else if (transactionStatus === "settlement") {
        // Non-credit card transaction settled
        paymentStatus = "success";
        ticketStatus = "PAID";
        paidAt = new Date();
    } else if (transactionStatus === "pending") {
        paymentStatus = "pending";
        ticketStatus = "PENDING";
    } else if (transactionStatus === "deny" || transactionStatus === "cancel" || transactionStatus === "expire") {
        paymentStatus = transactionStatus;
        ticketStatus = "CANCELLED";
    } else if (transactionStatus === "refund") {
        paymentStatus = "refund";
        ticketStatus = "CANCELLED";
    }

    // 5. Update payment and ticket in transaction
    await prisma.$transaction([
        prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: paymentStatus,
                paidAt,
            },
        }),
        prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: ticketStatus,
            },
        }),
    ]);

    return {
        orderId,
        transactionStatus,
        paymentStatus,
        ticketStatus,
        paymentType,
    };
}

/**
 * Get transaction status from Midtrans
 */
export async function getTransactionStatus(orderId: string) {
    const status = await coreApi.transaction.status(orderId);
    return status;
}

/**
 * Get payment by ticket ID
 */
export async function getPaymentByTicketId(ticketId: string) {
    const payment = await prisma.payment.findUnique({
        where: { ticketId },
        include: {
            ticket: {
                include: {
                    ticketType: true,
                    user: true,
                },
            },
        },
    });

    if (!payment) {
        throw new NotFoundError("Payment not found");
    }

    return payment;
}

/**
 * Get client key for frontend
 */
export function getClientKey() {
    return process.env.MIDTRANS_CLIENT_KEY || "";
}
