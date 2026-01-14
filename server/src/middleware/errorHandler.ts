import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../lib/errors.ts";

/**
 * Standard error response structure
 */
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

/**
 * Check if error is an operational AppError (expected errors)
 */
function isAppError(error: unknown): error is AppError {
    return error instanceof AppError && error.isOperational;
}

/**
 * Build standardized error response
 */
function buildErrorResponse(
    code: string,
    message: string,
    details?: unknown
): ErrorResponse {
    const response: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
        },
    };

    if (details !== undefined) {
        response.error.details = details;
    }

    return response;
}

/**
 * Global error handler middleware
 * Must be registered LAST in the middleware chain
 * 
 * Handles:
 * - AppError (operational errors with status codes)
 * - Prisma errors (database errors)
 * - Unexpected errors (500 Internal Server Error)
 */
export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Handle operational AppError
    if (isAppError(err)) {
        res.status(err.statusCode).json(
            buildErrorResponse(err.code, err.message)
        );
        return;
    }

    // Handle Prisma known errors
    if (isPrismaError(err)) {
        const { statusCode, code, message } = handlePrismaError(err);
        res.status(statusCode).json(buildErrorResponse(code, message));
        return;
    }

    // Handle standard Error objects
    if (err instanceof Error) {
        // Log unexpected errors in development
        if (process.env.NODE_ENV !== "production") {
            console.error("[Error]", err.stack);
        }

        res.status(500).json(
            buildErrorResponse(
                "INTERNAL_ERROR",
                process.env.NODE_ENV === "production"
                    ? "An unexpected error occurred"
                    : err.message
            )
        );
        return;
    }

    // Handle unknown error types
    res.status(500).json(
        buildErrorResponse("INTERNAL_ERROR", "An unexpected error occurred")
    );
};

/**
 * Check if error is a Prisma error
 */
interface PrismaError {
    code: string;
    meta?: { target?: string[] };
}

function isPrismaError(error: unknown): error is PrismaError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as PrismaError).code === "string" &&
        (error as PrismaError).code.startsWith("P")
    );
}

/**
 * Map Prisma error codes to HTTP responses
 */
function handlePrismaError(error: PrismaError): {
    statusCode: number;
    code: string;
    message: string;
} {
    switch (error.code) {
        case "P2002":
            // Unique constraint violation
            const field = error.meta?.target?.[0] ?? "field";
            return {
                statusCode: 409,
                code: "DUPLICATE_ENTRY",
                message: `A record with this ${field} already exists`,
            };

        case "P2025":
            // Record not found
            return {
                statusCode: 404,
                code: "NOT_FOUND",
                message: "Record not found",
            };

        case "P2003":
            // Foreign key constraint failed
            return {
                statusCode: 400,
                code: "INVALID_REFERENCE",
                message: "Referenced record does not exist",
            };

        case "P2014":
            // Required relation violation
            return {
                statusCode: 400,
                code: "RELATION_VIOLATION",
                message: "The change would violate a required relation",
            };

        default:
            return {
                statusCode: 500,
                code: "DATABASE_ERROR",
                message: "A database error occurred",
            };
    }
}

/**
 * 404 handler for undefined routes
 * Register AFTER all routes but BEFORE errorHandler
 */
export function notFoundHandler(
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    res.status(404).json(
        buildErrorResponse(
            "ROUTE_NOT_FOUND",
            `Cannot ${req.method} ${req.path}`
        )
    );
}

/**
 * Async wrapper to catch errors in async route handlers
 * Use this if you prefer wrapper pattern over try/catch
 */
export function asyncHandler<T>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
