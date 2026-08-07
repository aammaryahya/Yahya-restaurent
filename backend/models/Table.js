const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    seats: { type: Number, required: true },
    status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
    createdAt: { type: Date, default: Date.now }    
});

module.exports = mongoose.model('Table', TableSchema);