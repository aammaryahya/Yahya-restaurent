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

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'User registered successfully',
            token,
            user
        });

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

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1d' });

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

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
        );

        res.json({
            message: "Profil mis à jour",
            user: updatedUser
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        // Vérifier ancien mot de passe
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }

        // Hash nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Mot de passe changé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};