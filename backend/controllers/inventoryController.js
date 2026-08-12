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
            return res.status(404).json({ message: "Ingrédient introuvable." });
        }

        let newStock = ingredient.stock;

        if (type === "in") {
            newStock += quantity;
        }

        if (type === "out") {
            if (ingredient.stock - quantity < 0) {
                return res.status(400).json({
                    message: "Impossible de retirer cette quantité : stock insuffisant."
                });
            }
            newStock -= quantity;
        }

        if (type === "adjust") {
            if (quantity < 0) {
                return res.status(400).json({
                    message: "La quantité ajustée ne peut pas être négative."
                });
            }
            newStock = quantity;
        }

        ingredient.stock = newStock;

        ingredient.transactions.push({
            type,
            quantity,
            note,
            date: new Date()
        });

        await ingredient.save();

        res.json({ message: "Transaction enregistrée.", ingredient });

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