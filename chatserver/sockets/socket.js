require("dotenv").config();
const { Server } = require("socket.io");
const Message = require("../models/Message");

const allowedOrigins = [
  process.env.CLIENT_LOCAL,
  process.env.CLIENT_URL,
];

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  const users = {};

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (email) => {
      users[socket.id] = email;
      socket.join(email);
      console.log(`User ${email} joined`);
      io.emit("users", users);
      socket.emit("self-id", socket.id);
    });

    socket.on("message", async ({ sender, content }) => {
      try {
        const msg = await Message.create({ sender, content });
        io.emit("message", msg);
      } catch (err) {
        console.error("Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete users[socket.id];
      io.emit("users", users);
    });
  });
};

module.exports = initSocket;
