const Ingredient = require("../models/Ingredient");

// Get all ingredients
exports.getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Create a new ingredient
exports.createIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.create(req.body);
        res.json({ message: "Ingredient created", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an ingredient
exports.updateIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        res.json({ message: "Ingredient updated", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an ingredient
exports.deleteIngredient = async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.json({ message: "Ingredient deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//stock transaction for an ingredient
exports.addTransaction = async (req, res) => {
    try {
        const { type, quantity, note } = req.body;

        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found" });
        }

        // Update stock based on transaction type
        if (type === "in") ingredient.stock += quantity;
        if (type === "out") ingredient.stock -= quantity;
        if (type === "adjust") ingredient.stock = quantity;

// Add transaction to the ingredient
        ingredient.transactions.push({ type, quantity, note });
        await ingredient.save();

        res.json({ message: "Transaction added", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

//Low stock alert for ingredients
exports.getlowStock = async (req, res) => {
    try {
        const lowStock = await Ingredient.find({
            $expr: { $lte: ["$stock", "$minStock"] }
        });
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};