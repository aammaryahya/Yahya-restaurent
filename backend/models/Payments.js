const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0.15
    },
    taxAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    method: {
        type: String,
        enum: ['cash', 'card', 'debit', 'credit', 'online'],
        required: true
    },
    invoicePdf: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);