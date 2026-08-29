let io = null;

module.exports = {
    init: (server) => {
        const { Server } = require("socket.io");
        io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
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
