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