const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getOrders);

router.post('/', auth, role(['admin', 'waiter']), createOrder);
router.put('/:id', auth, role(['admin', 'waiter']), updateOrderStatus);
router.delete('/:id', auth, role(['admin']), deleteOrder);


module.exports = router;