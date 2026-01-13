import { prisma } from "../../../lib/prisma.ts";
import crypto from "crypto";
import { sendTicketEmail } from "../../lib/email.ts";

// Helper function to generate unique ticket code
function generateTicketCode(): string {
    return `TKT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}

// Helper function to check if ticket is expired
function isTicketExpired(expiryDate: Date | null): boolean {
    if (!expiryDate) {
        return false;
    }
    return new Date() > new Date(expiryDate);
}


export async function getAllTickets() {
    return await prisma.ticket.findMany({
        include: {
            user: true,
            ticketType: true,
            payments: true,
        },
    });
}

export async function purchaseTicket(data: { 
    email: string;
    name: string;
    phone?: string;
    emailConsent: boolean;
    ticketTypeId: string; 
    attendee: string;
    expiryDays?: number;
}) {
    // 1. Validate email consent
    if (!data.emailConsent) {
        throw new Error("Email consent is required");
    }

    // 2. Check if ticket type exists and has quota
    const ticketType = await prisma.ticketType.findUnique({
        where: { id: data.ticketTypeId },
    });

    if (!ticketType) {
        throw new Error("Ticket type not found");
    }

    if (ticketType.soldCount >= ticketType.quota) {
        throw new Error("Tickets sold out");
    }

    // 3. Find or create user by email
    let user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone ?? null,
                emailConsent: data.emailConsent,
            },
        });
    }

    // 4. Calculate expiry date (default: 7 days from now)
    const expiryDays = data.expiryDays || 7;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    // 5. Generate unique ticket code
    const ticketCode = generateTicketCode();

    // 6. Create ticket and increment soldCount atomically
    const [ticket] = await prisma.$transaction([
        prisma.ticket.create({
            data: {
                ticketCode,
                status: "PENDING",
                attendee: data.attendee,
                expiryDate,
                userId: user.id,
                ticketTypeId: data.ticketTypeId,
            },
            include: {
                user: true,
                ticketType: true,
            },
        }),
        prisma.ticketType.update({
            where: { id: data.ticketTypeId },
            data: { soldCount: { increment: 1 } },
        }),
    ]);

    // 7. Send ticket email
    await sendTicketEmail({
        to: user.email,
        attendeeName: data.attendee,
        ticketCode: ticket.ticketCode,
        ticketType: ticket.ticketType.name,
        price: ticket.ticketType.price,
        expiryDate: expiryDate,
    });

    return ticket;
}

export async function getTicketById(id: string, expiryDate?: Date) {
    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            user: true,
            ticketType: true,
            payments: true,
        },
    });

    if (!ticket) {
        return null;
    }

    // Add expiry status to response
    return {
        ...ticket,
        isExpired: isTicketExpired(ticket.expiryDate),
    };
}

export async function getTicketByCode(ticketCode: string) {
    const ticket = await prisma.ticket.findUnique({
        where: { ticketCode },
        include: {
            user: true,
            ticketType: true,
        },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    return {
        ...ticket,
        isExpired: isTicketExpired(ticket.expiryDate),
    };
}

export async function checkInTicket(id: string) {
    // 1. Get ticket
    const ticket = await prisma.ticket.findUnique({
        where: { id },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    // 2. Validate ticket is not expired
    if (isTicketExpired(ticket.expiryDate)) {
        throw new Error("Ticket has expired");
    }

    // 3. Validate ticket status
    if (ticket.status === "USED") {
        throw new Error("Ticket already used");
    }

    if (ticket.status === "PENDING") {
        throw new Error("Ticket must be paid before check-in");
    }

    // 4. Update ticket to USED
    return await prisma.ticket.update({
        where: { id },
        data: {
            status: "USED",
            checkedInAt: new Date(),
        },
        include: {
            user: true,
            ticketType: true,
        },
    });
}

export async function getTicketsByUser(userId: string) {
    const tickets = await prisma.ticket.findMany({
        where: { userId },
        include: {
            ticketType: true,
            payments: true,
        },
    });

    return tickets.map(ticket => ({
        ...ticket,
        isExpired: isTicketExpired(ticket.expiryDate),
    }));
}
