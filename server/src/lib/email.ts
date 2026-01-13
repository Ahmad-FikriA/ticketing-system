import { Resend } from "resend";
import { ticketEmailTemplate } from "../templates/ticketEmail.ts";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TicketEmailData {
    to: string;
    attendeeName: string;
    ticketCode: string;
    ticketType: string;
    price: number;
    expiryDate: Date;
}

export async function sendTicketEmail(data: TicketEmailData) {
    try { 
        await resend.emails.send({
            from: "Tickets <provider@gmail.com>",
            to: data.to,
            subject: "Your Ticket Details",
            html: ticketEmailTemplate({
                attendeeName: data.attendeeName,
                ticketCode: data.ticketCode,
                ticketType: data.ticketType,
                price: data.price,
                expiryDate: data.expiryDate,
            }),
        });
    } catch (error) {
        console.error("Error sending ticket email:", error);    
        throw new Error("Failed to send ticket email")
        }
    }
