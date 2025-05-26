const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./database');
const path = require('path');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/services.js');
const eventsRouter = require('./routes/events');
const userRouter = require('./routes/user.route');
const agentRoutes = require('./routes/agentRoutes');
const bookingRouter = require('./routes/booking.routes.js');
const notificationRoutes = require('./routes/notificationRoutes');
const stripeRoutes = require("./routes/stripeRoutes");
const wishlistRoutes = require('./routes/wishlist.route');
const eventSpaceRoutes = require('./routes/eventSpaceRoutes');
const AdminAuthRoutes = require('./routes/AdminAuth.routes');
const messageRoutes = require('./routes/message.routes');
const conversationRoutes = require('./routes/conversation.routes');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS
app.use(cors({
  origin: ['http://192.168.132.68:3000', 'http://localhost:3000'],
  origin: ['http://192.168.132.68:3000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket']
});

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Get user ID from query parameters
  const userId = socket.handshake.query.userId;
  if (userId) {
    const roomName = `user_${userId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  }

  // Handle chat room joining
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined chat room: ${roomId}`);
  });

  // Handle chat room leaving
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left chat room: ${roomId}`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    console.log('New message:', messageData);
    const { roomId, receiverId } = messageData;
    
    // Emit to the chat room
    io.to(roomId).emit('receive_message', messageData);
    
    // Also emit to receiver's personal room for notifications
    io.to(`user_${receiverId}`).emit('new_message', {
      ...messageData,
      type: 'chat_message'
    });
  });

  // Handle message status updates
  socket.on('message_status_update', ({ messageId, status, roomId }) => {
    console.log('Message status update:', { messageId, status });
    io.to(roomId).emit('message_status_update', { messageId, status });
  });

  // Handle new booking notifications
  socket.on('newBooking', (data) => {
    console.log('New booking notification:', data);
    const { providerId, bookingId, customerId, customerName, message } = data;
    
    // Emit to provider's room
    io.to(`user_${providerId}`).emit('newBooking', {
      notification: {
        id: bookingId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: message || `New booking request from ${customerName}`,
        bookingId,
        customerId,
        customerName,
        createdAt: new Date().toISOString(),
        is_read: false
      }
    });

    // Also emit to customer's room for confirmation
    io.to(`user_${customerId}`).emit('newBooking', {
      notification: {
        id: bookingId,
        type: 'booking_request',
        title: 'Booking Request Sent',
        message: 'Your booking request has been sent to the service provider.',
        bookingId,
        createdAt: new Date().toISOString(),
        is_read: false
      }
    });
  });

  // Handle booking responses
  socket.on('bookingResponse', (data) => {
    console.log('Booking response:', data);
    const { customerId, bookingId, status, message } = data;
    
    // Emit to customer's room
    io.to(`user_${customerId}`).emit('bookingResponse', {
      notification: {
        id: bookingId,
        type: 'booking_response',
        title: 'Booking Update',
        message: message || `Your booking request has been ${status}`,
        bookingId,
        status,
        createdAt: new Date().toISOString(),
        is_read: false
      }
    });
  });

  // Handle notification deletion
  socket.on('deleteNotification', (data) => {
    console.log('Deleting notification:', data);
    const { notificationId, userId } = data;
    io.to(`user_${userId}`).emit('notificationDeleted', { notificationId });
  });

  // Handle notification dismissal
  socket.on('dismissNotification', (data) => {
    console.log('Dismissing notification:', data);
    const { notificationId, userId } = data;
    io.to(`user_${userId}`).emit('notificationDismissed', { notificationId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Debug middleware for Socket.IO
io.engine.on("connection_error", (err) => {
  console.log('Connection Error:', {
    message: err.message,
    description: err.description,
    type: err.type,
    context: err.context
  });
});

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/agents', agentRoutes);
app.use('/api', stripeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/event-spaces', eventSpaceRoutes);
app.use('/api/authadmin',AdminAuthRoutes)
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);                          

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Sync database and start server
const PORT = process.env.PORT || 3000;
const HOST = '192.168.1.13';

const startServer = async () => {
  try {
    // Start server
    server.listen(PORT, HOST, () => {
      const urls = [
        `http://localhost:${PORT}`,
        `http://${HOST}:${PORT}`,
        `http://192.168.1.13:${PORT}`
      ];
      
      console.log('\nServer running on:');
      urls.forEach(url => {
        console.log(`\n${url}:`);
        console.log(`  - Test endpoint: ${url}/test`);
        console.log(`  - Health check: ${url}/health`);
        console.log(`  - Socket.IO: ${url}/socket.io/`);
      });
      console.log('\nSocket.IO Configuration:');
      console.log('  - Transports: websocket');
      console.log('  - Path: /socket.io/');
      console.log('  - CORS: enabled for all origins');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 
