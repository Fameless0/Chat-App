// src/socket.js
import { io } from "socket.io-client";

// Access the environment variable using import.meta.env in Vite
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
