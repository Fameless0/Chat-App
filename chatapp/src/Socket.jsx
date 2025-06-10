// socket.js
import { io } from "socket.io-client";

const Socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false, // Important: Prevent auto connection before login
});

export const connectAndRegisterUser = (userIdOrEmail) => {
  if (!Socket.connected) {
    Socket.connect();
  }

  Socket.once("connect", () => {
    Socket.emit("register-user", userIdOrEmail);
  });
};

export default Socket;
