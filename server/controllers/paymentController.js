const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
    description: `Order ${order.orderNumber}`,
  });

  res.json(
    new ApiResponse(200, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  );
});

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId, successUrl, cancelUrl } = req.body;

  const order = await Order.findById(orderId).populate('items.product');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Tax',
      },
      unit_amount: Math.round(order.tax * 100),
    },
    quantity: 1,
  });

  if (order.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: Math.round(order.shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl || `${process.env.CORS_ORIGIN}/orders/${order._id}?success=true`,
    cancel_url: cancelUrl || `${process.env.CORS_ORIGIN}/orders/${order._id}?cancelled=true`,
    customer_email: order.shippingAddress.email,
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json(
    new ApiResponse(200, {
      sessionId: session.id,
      url: session.url,
    })
  );
});

const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentInfo.status = 'completed';
      order.paymentInfo.transactionId = paymentIntent.id;
      order.paymentInfo.paidAt = new Date();
      order.orderStatus = 'processing';
      await order.save();
    }
  } else if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentInfo.status = 'completed';
      order.paymentInfo.transactionId = session.payment_intent;
      order.paymentInfo.paidAt = new Date();
      order.orderStatus = 'processing';
      await order.save();
    }
  }

  res.json({ received: true });
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  res.json(
    new ApiResponse(200, {
      paymentStatus: order.paymentInfo.status,
      transactionId: order.paymentInfo.transactionId,
      paidAt: order.paymentInfo.paidAt,
    })
  );
});

module.exports = {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus,
};
