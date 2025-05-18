const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Upgrade', 'Connection', 'Sec-WebSocket-Key', 'Sec-WebSocket-Version', 'Sec-WebSocket-Extensions'],
      exposedHeaders: ['Upgrade', 'Connection']
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000,
    connectTimeout: 10000,
    allowEIO3: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxHttpBufferSize: 1e8,
    upgrade: true,
    rememberUpgrade: true,
    allowUpgrades: true,
    perMessageDeflate: {
      threshold: 2048
    }
  });

  // Store socket connections by user ID
  const userSockets = new Map();

  // Handle connection errors
  io.engine.on("connection_error", (err) => {
    console.error('Socket.IO Connection Error:', {
      message: err.message,
      description: err.description,
      type: err.type,
      context: err.context,
      transport: err.transport
    });
  });

  // Handle upgrade errors
  io.engine.on("upgrade_error", (err) => {
    console.error('Socket.IO Upgrade Error:', {
      message: err.message,
      description: err.description,
      type: err.type,
      context: err.context,
      transport: err.transport
    });
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', {
      id: socket.id,
      transport: socket.conn.transport.name,
      address: socket.handshake.address,
      headers: socket.handshake.headers
    });

    // Send test event to verify connection
    socket.emit('test', { 
      message: 'Connected successfully',
      timestamp: new Date().toISOString(),
      transport: socket.conn.transport.name
    });

    // Handle user authentication and room joining
    socket.on('authenticate', async (userId) => {
      if (!userId) {
        console.error('Authentication failed: No userId provided');
        socket.emit('error', {
          success: false,
          message: 'Authentication failed: No userId provided'
        });
        return;
      }

      try {
        // Leave any existing rooms
        const existingRooms = Array.from(socket.rooms);
        existingRooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Join user's room
        const userRoom = `user_${userId}`;
        socket.join(userRoom);
        console.log(`Socket ${socket.id} joined room: ${userRoom}`);

        // Store socket connection
        userSockets.set(userId, socket.id);

        // Send connection confirmation
        socket.emit('authenticated', {
          success: true,
          message: 'Successfully authenticated and joined room',
          room: userRoom,
          userId: userId,
          transport: socket.conn.transport.name
        });

      } catch (error) {
        console.error('Socket authentication error:', error);
        socket.emit('error', {
          success: false,
          message: 'Authentication failed',
          error: error.message
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', {
        id: socket.id,
        reason: reason,
        transport: socket.conn.transport.name
      });
      
      // Remove socket from userSockets map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', {
        id: socket.id,
        error: error.message,
        transport: socket.conn.transport.name
      });
    });
  });

  return io;
}

module.exports = initializeSocket; 