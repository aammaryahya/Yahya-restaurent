import { io } from "socket.io-client";

export const socket = io("https://yahya-restaurent.onrender.com", {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
        token: localStorage.getItem("token")
    }
});

export function reconnectSocket() {
    socket.auth.token = localStorage.getItem("token"); // 🔥 mettre le nouveau token
    socket.connect(); // 🔥 reconnecter
}

