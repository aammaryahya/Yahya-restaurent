const io = global.io;
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');


//get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('tableId')
            .populate('items.menuItemId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//create a new order
exports.createOrder = async (req, res) => {
    try {
        const { tableId, items, notes } = req.body;

        const detailItems = [];
        let total = 0;

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found` });
            }

            const price = menuItem.price;
            const quantity = item.quantity;

            detailItems.push({
                menuItemId: item.menuItemId,
                quantity,
                price
            });

            total += price * quantity;
        }

        const order = await Order.create({
            tableId,
            items: detailItems,
            total,
            notes: notes || ""
        });

        const io = global.io;        


        io.emit("ordersUpdated", { action: "create", order });


        res.status(201).json({ message: 'Order created successfully', order });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
            .populate("tableId")
            .populate("items.menuItemId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (req.body.status === "cancelled" || req.body.status === "paid") {
            await Table.findByIdAndUpdate(order.tableId._id, { status: "available" });
        }

        const io = global.io;
        io.emit("ordersUpdated", { action: "update", order, tableId: order.tableId._id });

        res.status(200).json({
            message: 'Order status updated successfully',
            order,
            tableId: order.tableId._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//delete an order
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);

        const io = global.io;

        io.emit("ordersUpdated", { action: "delete", id: req.params.id });


        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update order notes
exports.updateOrderNotes = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.notes = req.body.notes;
        await order.save();

        const io = global.io;

        io.emit("orderUpdated", { action: "updateNote", order });


        res.status(200).json({ message: 'Order notes updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("tableId")
            .populate("items.menuItemId");

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

