const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    unit: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    minStock: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [
        {
            type: {
                type: String,
                enum: ["in", "out", "adjust"],
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            note: {
                type: String
            },
            user: {
                type: String,
                required: false
            },
            oldStock: Number,
            newStock: Number,
            difference: Number
        }
    ]
}); 

module.exports = mongoose.model("Ingredient", IngredientSchema);