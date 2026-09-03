const io = global.io;
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
        const io = global.io;

        io.emit("inventoryUpdated", { action: "create", ingredient });

        res.json({ message: "Ingredient created", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an ingredient
exports.updateIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        const io = global.io;

        io.emit("inventoryUpdated", { action: "update", ingredient });

        res.json({ message: "Ingredient updated", ingredient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an ingredient
exports.deleteIngredient = async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        const io = global.io;

        io.emit("inventoryUpdated", { action: "delete", ingredient });

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

        const oldStock = ingredient.stock;   
        let newStock = oldStock;

        if (type === "in") {
            newStock += quantity;
        }

        if (type === "out") {
            if (oldStock - quantity < 0) {
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

        const difference = newStock - oldStock;   

        ingredient.stock = newStock;

        ingredient.transactions.push({
            type,
            quantity,
            note,
            date: new Date(),
            user: req.user.name,
            oldStock,        
            newStock,        
            difference       
        });

        await ingredient.save();

        const io = global.io;
        io.emit("inventoryUpdated", { action: "transaction", ingredient });

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

exports.getAllAdjustments = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();

        const adjustments = [];

        ingredients.forEach(ingredient => {
            ingredient.transactions
                .filter(t =>
                    t.type === "adjust" ||
                    t.type === "in" ||
                    t.type === "out"
                )
                .forEach(t => {
                    adjustments.push({
                        ingredientId: ingredient._id,
                        ingredientName: ingredient.name,
                        unit: ingredient.unit,
                        quantity: t.quantity,
                        note: t.note,
                        date: t.date,
                        user: t.user,
                        oldStock: t.oldStock,
                        newStock: t.newStock,
                        difference: t.difference
                    });
                });
        });

        res.status(200).json(adjustments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAdjustmentsByIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.ingredientId);

        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found" });
        }

        const adjustments = ingredient.transactions
            .filter(t =>
                t.type === "adjust" ||
                t.type === "in" ||
                t.type === "out"
            )
            .map(t => ({
                ingredientId: ingredient._id,
                ingredientName: ingredient.name,      
                unit: ingredient.unit,               
                quantity: t.quantity,
                note: t.note,
                date: t.date,
                type: t.type,
                user: t.user || "Inconnu",
                oldStock: t.oldStock,
                newStock: t.newStock,
                difference: t.difference
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(adjustments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



