interface TicketEmailProps {
    attendeeName: string;
    ticketCode: string;
    ticketType: string;
    price: number;
    expiryDate: Date;
}

export function ticketEmailTemplate(data: TicketEmailProps): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
            .container { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: auto; }
            .ticket-code { font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 15px; text-align: center; border-radius: 4px; letter-spacing: 2px; }
            .details { margin: 20px 0; }
            .details li { padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎟️ Your Ticket</h1>
            <p>Thank you for your purchase, <strong>${data.attendeeName}</strong>!</p>
            
            <div class="ticket-code">${data.ticketCode}</div>
            
            <ul class="details">
                <li><strong>Type:</strong> ${data.ticketType}</li>
                <li><strong>Price:</strong> $${(data.price / 100).toFixed(2)}</li>
                <li><strong>Valid Until:</strong> ${data.expiryDate.toLocaleDateString()}</li>
            </ul>
            
            <p>Please present this ticket code at the event entrance.</p>
            
            <div class="footer">
                <p>This is an automated email. Do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}