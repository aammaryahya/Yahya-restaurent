import { io } from "socket.io-client";

export const socket = io("https://yahya-restaurent.onrender.com", {
    transports: ["websocket"],
    withCredentials: true
});
