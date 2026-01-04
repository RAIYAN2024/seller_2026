const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'stripe', notes } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'No order items provided');
  }

  let orderItems = [];
  let subtotal = 0;

  for (let item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: product.images[0]?.url || '',
    });

    subtotal += product.price * item.quantity;

    product.stock -= item.quantity;
    product.soldCount += item.quantity;
    await product.save();
  }

  const tax = subtotal * 0.08;
  const shippingCost = subtotal > 100 ? 0 : 10;
  const totalAmount = subtotal + tax + shippingCost;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentInfo: {
      method: paymentMethod,
      status: 'pending',
    },
    subtotal,
    tax,
    shippingCost,
    totalAmount,
    notes,
  });

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json(
    new ApiResponse(201, { order }, 'Order created successfully')
  );
});

const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.orderStatus = status;
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip)
    .populate('items.product');

  const total = await Order.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to access this order');
  }

  res.json(new ApiResponse(200, { order }));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.orderStatus = status;

  if (status === 'shipped') {
    order.shippedAt = Date.now();
  } else if (status === 'delivered') {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paidAt = Date.now();
  } else if (status === 'cancelled') {
    order.cancelledAt = Date.now();
    
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  res.json(new ApiResponse(200, { order }, 'Order status updated successfully'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, startDate, endDate } = req.query;

  const query = {};

  if (status) {
    query.orderStatus = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip)
    .populate('user', 'firstName lastName email')
    .populate('items.product');

  const total = await Order.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

  const revenueData = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        averageOrderValue: { $avg: '$totalAmount' },
      },
    },
  ]);

  const revenue = revenueData[0] || { totalRevenue: 0, averageOrderValue: 0 };

  res.json(
    new ApiResponse(200, {
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: revenue.totalRevenue,
        averageOrderValue: revenue.averageOrderValue,
      },
    })
  );
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
};
