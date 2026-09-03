const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();

app.use(cors({
    origin: "https://yahya-restaurent.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://yahya-restaurent.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/kitchen", require("./routes/kitchenRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "https://yahya-restaurent.vercel.app",
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
