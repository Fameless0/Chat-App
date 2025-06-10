require("dotenv").config();
const { Server } = require("socket.io");
const Message = require("../models/Message");

const allowedOrigins = [process.env.CLIENT_LOCAL, process.env.CLIENT_URL];

// Global map: userId (ObjectId as string) → socket.id
const connectedUsers = new Map();

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

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    // Step 1: Register the user
    socket.on("register-user", (userId) => {
      if (!userId) return;
      connectedUsers.set(userId, socket.id);
      socket.userId = userId; // Save on socket instance
      console.log(`✅ Registered user ${userId} with socket ${socket.id}`);

      // Broadcast online users
      io.emit("online-users", Array.from(connectedUsers.keys()));
    });

    // Step 2: Handle chat messages
    socket.on("send-message", async ({ sender, receiver, content }) => {
      try {
        const message = await Message.create({ sender, receiver, content });

        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", message);
        }

        // Confirm to sender
        socket.emit("message-sent", message);
      } catch (error) {
        console.error("❌ Message DB error:", error.message);
      }
    });

    // Step 3: Handle WebRTC signaling
    socket.on("video-signal", ({ to, signalData }) => {
      const targetSocket = connectedUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit("video-signal", {
          from: socket.userId,
          signalData,
        });
      }
    });

    // Step 4: Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);

      // Remove the user from the connectedUsers map
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`🚪 User ${socket.userId} disconnected`);
      }

      io.emit("online-users", Array.from(connectedUsers.keys()));
    });
  });
};

module.exports = initSocket;
