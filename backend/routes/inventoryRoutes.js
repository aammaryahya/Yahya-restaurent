const express = require("express");
const router = express.Router();
const { getIngredients, createIngredient, updateIngredient,
    deleteIngredient, addTransaction, getlowStock } = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", auth, role(["admin", "chef", "waiter"]), getIngredients);
router.post("/", auth, role("admin"), createIngredient);
router.put("/:id", auth, role("admin"), updateIngredient);
router.delete("/:id", auth, role("admin"), deleteIngredient);


router.post("/:id/transaction", auth, role(["admin", "chef", "waiter"]), addTransaction);
router.get("/alerts/low-stock", auth, role(["admin", "chef", "waiter"]), getlowStock);

module.exports = router;