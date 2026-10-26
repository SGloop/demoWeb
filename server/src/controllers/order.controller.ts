import { Request, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import prisma from '../config/db';
import stripe from '../config/stripe';
import { AuthRequest } from '../middlewares/auth';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least one product'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    addressLine1: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
});

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const parseResult = createOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Validation failed', details: parseResult.error.errors });
    return;
  }

  const { items, shippingAddress } = parseResult.data;

  // Retrieve products from database to ensure price and stock integrity
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    res.status(400).json({ error: 'One or more items in your cart do not exist' });
    return;
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate stock and calculate total strictly on server side
  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of items) {
    const prod = productMap.get(item.productId)!;
    if (prod.inventoryCount < item.quantity) {
      res.status(400).json({
        error: `Insufficient inventory for "${prod.title}". Only ${prod.inventoryCount} left.`,
      });
      return;
    }
    totalAmount += prod.price * item.quantity;
    orderItemsData.push({
      productId: prod.id,
      unitPrice: prod.price,
      quantity: item.quantity,
    });
  }

  // Create order in PENDING status
  const order = await prisma.order.create({
    data: {
      userId: req.user.userId,
      totalAmount,
      shippingAddress,
      status: 'PENDING',
      orderItems: {
        create: orderItemsData,
      },
    },
  });

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'usd',
    metadata: {
      orderId: order.id,
      userId: req.user.userId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // Attach PaymentIntent ID to Order
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentIntentId: paymentIntent.id },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
    totalAmount,
  });
};

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).send('Webhook secret or signature missing');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });

        if (order && order.status === 'PENDING') {
          await tx.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });

          // Decrement product inventory safely
          for (const item of order.orderItems) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                inventoryCount: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      });
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    }
  }

  res.json({ received: true });
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId: req.user.userId },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ orders });
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order || order.userId !== req.user.userId) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json({ order });
};
