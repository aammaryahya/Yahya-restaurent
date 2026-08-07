const express = require('express');
const router = express.Router();
const { getKitchenOrders, updateKitchenStatus } = require('../controllers/kitchenController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/orders', auth, role(['admin', 'chef']), getKitchenOrders);

router.put('/orders/:id/status', auth, role(['admin', 'chef']), updateKitchenStatus);

module.exports = router;
