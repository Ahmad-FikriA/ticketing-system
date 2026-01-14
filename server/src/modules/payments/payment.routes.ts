import { Router } from 'express';
import * as paymentController from './payment.controller.ts';
import { validate, validateParams } from '../../middleware/validate.ts';
import { 
    createTransactionSchema, 
    paymentNotificationSchema,
    ticketIdParamSchema,
    orderIdParamSchema,
} from './payment.schema.ts';

const router = Router();

// GET /api/payments/client-key - Get Midtrans client key for frontend
router.get('/client-key', paymentController.getClientKey);

// POST /api/payments/create-transaction - Create Snap transaction
router.post('/create-transaction', validate(createTransactionSchema), paymentController.createTransaction);

// POST /api/payments/notification - Midtrans webhook handler
router.post('/notification', validate(paymentNotificationSchema), paymentController.handleNotification);

// GET /api/payments/status/:orderId - Get transaction status
router.get('/status/:orderId', validateParams(orderIdParamSchema), paymentController.getTransactionStatus);

// GET /api/payments/ticket/:ticketId - Get payment by ticket ID
router.get('/ticket/:ticketId', validateParams(ticketIdParamSchema), paymentController.getPaymentByTicketId);

export default router;
