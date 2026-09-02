const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "https://yahya-restaurent-frontend.onrender.com",
    credentials: true
}));
app.use(express.json());

//routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/kitchen", require("./routes/kitchenRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));



// HTTP Server
const server = http.createServer(app);

// SOCKET.IO
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "https://yahya-restaurent-frontend.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
    }
});

global.io = io;

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = io;
