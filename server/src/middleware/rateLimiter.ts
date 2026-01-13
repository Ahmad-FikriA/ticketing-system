import rateLimit from "express-rate-limit";

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for ticket purchases (prevent bulk buying)
export const purchaseLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 ticket purchases per minute
    message: {
        error: "Too many ticket purchases. Please wait before trying again.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for check-ins
export const checkInLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 check-ins per minute
    message: {
        error: "Too many check-in attempts. Please slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
