import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { port } from "./config/db.config.ts";
import { apiLimiter } from "./middleware/rateLimiter.ts";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.ts";

import ticketRouter from "./modules/tickets/ticket.routes.ts";
import paymentRouter from "./modules/payments/payment.routes.ts";
import ticketTypeRouter from "./modules/ticketTypes/ticketType.routes.ts";
import authRouter from "./modules/auth/auth.routes.ts";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global rate limiter (100 requests per 15 minutes)
app.use(apiLimiter);

// ! API HERE
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/ticket-types", ticketTypeRouter);
app.use("/api/payments", paymentRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
