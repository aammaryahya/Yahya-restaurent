const Order = require('../models/Order');

// Get all kitchen orders
exports.getKitchenOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: ['pending', 'preparing'] } }).populate('tableId').populate('items.menuItemId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
exports.updateKitchenStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};