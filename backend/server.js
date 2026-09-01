const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, ".env.production")
        : path.resolve(__dirname, ".env.development")
});

const app = express();

// Middleware
app.use(cors());
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



const http = require("http");
const server = http.createServer(app);

const socket = require("./socket");
const io = socket.init(server);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = io;
