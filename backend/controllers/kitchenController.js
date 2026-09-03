const io = global.io;
const Order = require('../models/Order');

// Get all kitchen orders
exports.getKitchenOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $in: ['pending', 'preparing', 'ready'] } })
            .sort({ status: 1, createdAt: 1 })
            .populate('tableId')
            .populate('items.menuItemId');

        const colorMap = {
            'pending': 'yellow',
            'preparing': 'orange',
            'ready': 'green'
        }

        const ordersWithColors = orders.map(order => ({
            ...order.toObject(),
            color: colorMap[order.status] || 'grey'
        }));

        res.json(ordersWithColors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
exports.updateKitchenStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

        const io = global.io;

        io.emit("kitchenUpdated", { action: "update", order });

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
