const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true
    },
    items: [
        {
            menuItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MenuItem",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model("Order", OrderSchema);