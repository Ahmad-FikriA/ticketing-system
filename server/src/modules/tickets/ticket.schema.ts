import { z } from "zod";

// ========== PURCHASE TICKET ==========
export const purchaseTicketSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email address"),
    
    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    
    phone: z
        .string()
        .regex(/^[+]?[\d\s-]{10,}$/, "Invalid phone number")
        .optional()
        .or(z.literal("")),
    
    emailConsent: z
        .boolean({ message: "Email consent is required" })
        .refine((val) => val === true, {
            message: "You must agree to receive the ticket via email",
        }),
    
    ticketTypeId: z
        .string({ message: "Ticket type is required" })
        .min(1, "Ticket type is required"),
    
    attendee: z
        .string({ message: "Attendee name is required" })
        .min(2, "Attendee name must be at least 2 characters")
        .max(100, "Attendee name must be less than 100 characters"),
    
    expiryDays: z
        .number()
        .int()
        .positive("Expiry days must be positive")
        .max(365, "Expiry days cannot exceed 365")
        .optional(),
});

export type PurchaseTicketInput = z.infer<typeof purchaseTicketSchema>;

// ========== ID PARAM ==========
export const idParamSchema = z.object({
    id: z.string().min(1, "ID is required"),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ========== TICKET CODE PARAM ==========
export const ticketCodeParamSchema = z.object({
    code: z
        .string()
        .min(1, "Ticket code is required")
        .regex(/^TKT-[A-F0-9]{12}$/, "Invalid ticket code format"),
});

export type TicketCodeParam = z.infer<typeof ticketCodeParamSchema>;

// ========== USER ID PARAM ==========
export const userIdParamSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;