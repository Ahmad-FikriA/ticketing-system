import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType, ZodIssue } from "zod";

/**
 * Validation error response structure
 */
interface ValidationErrorResponse {
    error: string;
    details: Array<{
        field: string;
        message: string;
    }>;
}

/**
 * Format Zod issues into a consistent response structure
 */
function formatZodErrors(issues: ZodIssue[], errorLabel: string): ValidationErrorResponse {
    return {
        error: errorLabel,
        details: issues.map((issue) => ({
            field: issue.path.map(String).join("."),
            message: issue.message,
        })),
    };
}

/**
 * Middleware factory to validate request body against a Zod schema
 * Uses generic types to preserve type safety through the validation chain
 */
export function validate<T>(schema: ZodType<T>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json(formatZodErrors(result.error.issues, "Validation failed"));
            return;
        }

        // Replace req.body with validated and transformed data
        req.body = result.data;
        next();
    };
}

/**
 * Middleware factory to validate request params against a Zod schema
 */
export function validateParams<T extends Record<string, string>>(
    schema: ZodType<T>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json(formatZodErrors(result.error.issues, "Invalid parameters"));
            return;
        }

        req.params = result.data as Record<string, string>;
        next();
    };
}

/**
 * Middleware factory to validate query parameters against a Zod schema
 */
export function validateQuery<T extends Record<string, unknown>>(
    schema: ZodType<T>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            res.status(400).json(formatZodErrors(result.error.issues, "Invalid query parameters"));
            return;
        }

        req.query = result.data as typeof req.query;
        next();
    };
}
