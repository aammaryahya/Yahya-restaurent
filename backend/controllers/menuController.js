const io = global.io;
const MenuItem = require('../models/MenuItem');

// Get all menu items       
exports.getMenu = async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new menu item   
exports.createMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        const io = global.io;

        io.emit("menuUpdated", { action: "create", item });

        res.json({ message: 'Menu item created successfully', item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const io = global.io;

        io.emit("menuUpdated", { action: "update", item });

        res.json({ message: 'Menu item updated successfully', item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        const io = global.io;

        io.emit("menuUpdated", { action: "delete", id: req.params.id });

        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};
