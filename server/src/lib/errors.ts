/**
 * Custom application error class for standardized error handling
 * Extends the built-in Error class with HTTP status codes and error codes
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = "INTERNAL_ERROR"
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request - Invalid input or validation error
 */
export class BadRequestError extends AppError {
    constructor(message: string = "Bad request", code: string = "BAD_REQUEST") {
        super(message, 400, code);
    }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized", code: string = "UNAUTHORIZED") {
        super(message, 401, code);
    }
}

/**
 * 403 Forbidden - Authenticated but not allowed
 */
export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden", code: string = "FORBIDDEN") {
        super(message, 403, code);
    }
}

/**
 * 404 Not Found - Resource not found
 */
export class NotFoundError extends AppError {
    constructor(message: string = "Not found", code: string = "NOT_FOUND") {
        super(message, 404, code);
    }
}

/**
 * 409 Conflict - Resource already exists or conflict
 */
export class ConflictError extends AppError {
    constructor(message: string = "Conflict", code: string = "CONFLICT") {
        super(message, 409, code);
    }
}

/**
 * 422 Unprocessable Entity - Validation passed but business logic failed
 */
export class UnprocessableError extends AppError {
    constructor(message: string = "Unprocessable entity", code: string = "UNPROCESSABLE") {
        super(message, 422, code);
    }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class TooManyRequestsError extends AppError {
    constructor(message: string = "Too many requests", code: string = "RATE_LIMIT") {
        super(message, 429, code);
    }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
export class InternalError extends AppError {
    constructor(message: string = "Internal server error", code: string = "INTERNAL_ERROR") {
        super(message, 500, code);
    }
}

/**
 * 503 Service Unavailable - External service failure
 */
export class ServiceUnavailableError extends AppError {
    constructor(message: string = "Service unavailable", code: string = "SERVICE_UNAVAILABLE") {
        super(message, 503, code);
    }
}
