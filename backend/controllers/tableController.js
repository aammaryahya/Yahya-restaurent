const Table = require('../models/Table');

// Get all tables
exports.getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// Create a new table
exports.createTable = async (req, res) => {
    try {
        const table = await Table.create(req.body);
        res.json({ message: 'Table created successfully', table });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// Update a table
exports.updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Table updated successfully', table });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// Delete a table
exports.deleteTable = async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.json({ message: 'Table deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};