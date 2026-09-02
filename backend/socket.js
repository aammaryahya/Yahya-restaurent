let io = null;

module.exports = {
    init: (server) => {
        const { Server } = require("socket.io");
        io = new Server(server, {
            cors: {
                origin: "https://yahya-restaurent-frontend.onrender.com",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized");
        }
        return io;
    }
};
