const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { orderValidation, validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post('/', orderValidation, validate, createOrder);
router.get('/', getOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/admin/stats', admin, getOrderStats);
router.get('/:id', getOrderById);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
