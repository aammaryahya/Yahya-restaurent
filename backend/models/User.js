const mongoose = require('mongoose');

const UserShchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'waiter', 'chef', 'cashier'], default: 'waiter' }
});

module.exports = mongoose.model('User', UserShchema);