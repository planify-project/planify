const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust for your frontend origin in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Example event
    socket.on("message", (data) => {
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIO };