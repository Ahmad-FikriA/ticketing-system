import { z } from "zod";

// ========== CREATE TICKET TYPE ==========
export const createTicketTypeSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    
    price: z
        .number({ message: "Price is required" })
        .int("Price must be a whole number (in cents)")
        .min(0, "Price cannot be negative"),
    
    quota: z
        .number({ message: "Quota is required" })
        .int("Quota must be a whole number")
        .min(1, "Quota must be at least 1"),
});

export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;

// ========== UPDATE TICKET TYPE ==========
export const updateTicketTypeSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .optional(),
    
    price: z
        .number()
        .int("Price must be a whole number (in cents)")
        .min(0, "Price cannot be negative")
        .optional(),
    
    quota: z
        .number()
        .int("Quota must be a whole number")
        .min(1, "Quota must be at least 1")
        .optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});

export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;

// ========== ID PARAM ==========
export const idParamSchema = z.object({
    id: z.string().min(1, "ID is required"),
});

export type IdParam = z.infer<typeof idParamSchema>;
