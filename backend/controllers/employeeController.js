const bcrypt = require("bcryptjs");
const User = require("../models/User")

exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password required" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashed });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
