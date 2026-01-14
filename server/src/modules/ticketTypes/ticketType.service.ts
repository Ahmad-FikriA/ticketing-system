import { prisma } from "../../../lib/prisma.ts";
import { NotFoundError, UnprocessableError } from "../../lib/errors.ts";

// Get all ticket types
export async function getAllTicketTypes() {
    return await prisma.ticketType.findMany({
        orderBy: { name: "asc" },
    });
}

// Get ticket type by ID
export async function getTicketTypeById(id: string) {
    const ticketType = await prisma.ticketType.findUnique({
        where: { id },
    });

    if (!ticketType) {
        throw new NotFoundError("Ticket type not found", "TICKET_TYPE_NOT_FOUND");
    }

    return ticketType;
}

// Get ticket type with availability info
export async function getTicketTypeWithAvailability(id: string) {
    const ticketType = await prisma.ticketType.findUnique({
        where: { id },
    });

    if (!ticketType) {
        throw new NotFoundError("Ticket type not found", "TICKET_TYPE_NOT_FOUND");
    }

    return {
        ...ticketType,
        available: ticketType.quota - ticketType.soldCount,
        isSoldOut: ticketType.soldCount >= ticketType.quota,
    };
}

// Create a new ticket type
export async function createTicketType(data: {
    name: string;
    price: number;
    quota: number;
}) {
    return await prisma.ticketType.create({
        data: {
            name: data.name,
            price: data.price,
            quota: data.quota,
            soldCount: 0,
        },
    });
}

// Update a ticket type
export async function updateTicketType(
    id: string,
    data: {
        name?: string | undefined;
        price?: number | undefined;
        quota?: number | undefined;
    }
) {
    const ticketType = await prisma.ticketType.findUnique({
        where: { id },
    });

    if (!ticketType) {
        throw new NotFoundError("Ticket type not found", "TICKET_TYPE_NOT_FOUND");
    }

    // Prevent reducing quota below sold count
    if (data.quota !== undefined && data.quota < ticketType.soldCount) {
        throw new UnprocessableError(
            "Cannot reduce quota below sold count",
            "QUOTA_BELOW_SOLD"
        );
    }

    // Filter out undefined values for Prisma compatibility
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quota !== undefined) updateData.quota = data.quota;

    return await prisma.ticketType.update({
        where: { id },
        data: updateData,
    });
}

// Delete a ticket type (only if no tickets sold)
export async function deleteTicketType(id: string) {
    const ticketType = await prisma.ticketType.findUnique({
        where: { id },
        include: { tickets: true },
    });

    if (!ticketType) {
        throw new NotFoundError("Ticket type not found", "TICKET_TYPE_NOT_FOUND");
    }

    if (ticketType.tickets.length > 0) {
        throw new UnprocessableError(
            "Cannot delete ticket type with existing tickets",
            "TICKET_TYPE_HAS_TICKETS"
        );
    }

    return await prisma.ticketType.delete({
        where: { id },
    });
}





