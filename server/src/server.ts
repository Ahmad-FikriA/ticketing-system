import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { port } from "./config/db.config.ts";

import ticketRouter from "./modules/tickets/ticket.routes.ts";

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

// ! API HERE
app.use("/api/tickets", ticketRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
