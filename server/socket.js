const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);
    
    // Get user ID from query parameters
    const userId = socket.handshake.query.userId;
    console.log('User ID from socket connection:', userId);

    if (userId) {
      // Join user's room
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room:`, roomName);
    }

    // Handle room joining
    socket.on('joinRoom', (room) => {
      console.log(`Socket ${socket.id} joining room:`, room);
      socket.join(room);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
}; 