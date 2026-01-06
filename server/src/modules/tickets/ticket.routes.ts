import { Router } from "express";
import * as ticketController from "./ticket.controller.ts"

const router = Router();

router.post("/", ticketController.createTicket);
router.get("/:id", ticketController.getTicketById);
router.post(":id/checkin", ticketController.checkInTicket);


export default router;

