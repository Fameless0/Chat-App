const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join", (userEmail) => {
      socket.join(userEmail);
      console.log(`User ${userEmail} joined`);
    });

    socket.on("message", async ({ sender, content }) => {
      const msg = await Message.create({ sender, content });
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
const { Server } = require("socket.io");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  const users = {};

  io.on("connection", (socket) => {
    socket.on("join", (email) => {
      users[socket.id] = email;
      io.emit("users", users);
      socket.emit("self-id", socket.id);
    });

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.emit("users", users);
    });
  });
};

module.exports = initSocket;