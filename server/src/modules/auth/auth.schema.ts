import { z } from "zod";

// ========== LOGIN ==========
export const loginSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email address"),
    
    password: z
        .string({ message: "Password is required" })
        .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ========== CREATE ADMIN ==========
export const createAdminSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email address"),
    
    password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
