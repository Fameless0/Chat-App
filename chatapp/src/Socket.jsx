import { io } from "socket.io-client";
const socket = io("http://192.168.31.34:5000");
export default socket;