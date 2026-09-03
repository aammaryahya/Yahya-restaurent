const io = global.io;
const Payment = require('../models/Payments');
const Order = require('../models/Order');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { orderId, discount, method } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const subtotal = order.total;
        const taxRate = 0.15; // Assuming a fixed tax rate of 15%
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount - (discount || 0);

        const payment = await Payment.create({
            orderId,
            subtotal,
            tax,
            taxAmount,
            discount: discount || 0,
            total,
            method,
            status: 'paid'
        });

        const io = global.io;

        io.emit("paymentsUpdated", { action: "create", payment });


        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('orderId');
        res.status(200).json({ payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'refunded';
        await payment.save();

        const io = global.io;

        io.emit("paymentsUpdated", { action: "refund", payment });


        res.status(200).json({ message: 'Payment refunded successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
