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
