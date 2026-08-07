const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'User already exists' });
        }   

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashed, role });

        res.json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'Login successful', token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzNhNTkxZDJiYzI0YzI5MDA3NTMwZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTk2NDA4NiwiZXhwIjoxNzg1OTY3Njg2fQ.CtcsZ6HJA_ggbd-fl8sHUp85xD_Qh1DBQr1fAmMZCiw
//6a73a591d2bc24c29007530f
