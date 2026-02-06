const express = require('express');
const {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/status/:orderId', getPaymentStatus);

module.exports = router;
