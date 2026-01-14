import { prisma } from "../../../lib/prisma.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError, NotFoundError, ConflictError } from "../../lib/errors.ts";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

// Login admin
export async function loginAdmin(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.password) {
        throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
    }

    if (user.role !== "ADMIN") {
        throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const token = generateToken(user.id, user.email, user.role);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
}

// Get admin by ID
export async function getAdminById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user || user.role !== "ADMIN") {
        throw new NotFoundError("Admin not found", "ADMIN_NOT_FOUND");
    }

    return user;
}

// Create admin (for seeding or by existing admin)
export async function createAdmin(data: {
    name: string;
    email: string;
    password: string;
}) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new ConflictError("Email already exists", "EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const admin = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
}

// Generate JWT token
function generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
        { userId, email, role } as JwtPayload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        throw new UnauthorizedError("Invalid or expired token", "INVALID_TOKEN");
    }
}
