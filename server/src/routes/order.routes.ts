import { Router } from 'express';
import { createPaymentIntent, getMyOrders, getOrderById } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/create-payment-intent', createPaymentIntent);
router.get('/me', getMyOrders);
router.get('/:id', getOrderById);

export default router;
