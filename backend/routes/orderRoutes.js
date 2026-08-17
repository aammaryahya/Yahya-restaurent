const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus, deleteOrder, updateOrderNotes, getOrderById } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getOrders);

router.post('/', auth, role(['admin', 'waiter']), createOrder);
router.put('/:id', auth, updateOrderStatus);
router.delete('/:id', auth, role(['admin']), deleteOrder);

router.put('/:id/notes', auth, role(['admin', 'waiter']), updateOrderNotes);
router.get('/:id', auth, getOrderById);


module.exports = router;