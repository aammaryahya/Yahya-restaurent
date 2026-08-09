const express = require('express');
const router = express.Router();
const { createPayment, getPayments, refundPayment } = require('../controllers/paymentController');

const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', auth, role(['admin', 'cashier']), createPayment);
router.get('/', auth, role(['admin', 'cashier']), getPayments);
router.post('/:id/refund', auth, role('admin'), refundPayment);

module.exports = router;