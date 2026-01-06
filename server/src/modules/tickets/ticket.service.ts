import { prisma } from "../../../lib/prisma.ts";
import { randomUUID } from "crypto";

export async function createTicket(data: { userId: string; ticketTypeId: string; attendee: string }){
    return await prisma.ticket.create({
        data:{
            userId: data.userId,
            ticketTypeId: data.ticketTypeId,
            ticketCode: randomUUID(),
            status: "PENDING",
            attendee: data.attendee,
        }
    });
}

export async function getTicketById(id: string){
    return await prisma.ticket.findUnique({
        where: { id },
    });
}
export async function checkInTicket(id: string){
    return await prisma.ticket.update({
        where: { id },
        data: { status: "USED" },
    });
}