const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./database');
const path = require('path');
const morgan = require('morgan');

// Import routes
const eventsRouter = require('./routes/events');
const userRouter = require('./routes/user.route');
const agentRoutes = require('./routes/agentRoutes');
const servicesRouter = require('./routes/services.js');
const bookingRouter = require('./routes/booking.routes.js');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/auth.routes');
const eventSpaceRoutes = require('./routes/eventSpaceRoutes');
const AdminAuthRoutes = require('./routes/AdminAuth.routes');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  transports: ['websocket', 'polling']
});

// Add better connection logging
io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  console.log(`New client connected - ID: ${socket.id}, IP: ${clientIp}`);
  
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected - ID: ${socket.id}, Reason: ${reason}`);
  });
});

// Make io accessible to our routes
app.set('io', io);

const PORT = process.env.PORT || 3000;
const HOST = '172.20.10.3'; // Updated IP address

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/agents', agentRoutes);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/event-spaces', eventSpaceRoutes);
app.use('/api/authadmin', AdminAuthRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Listen on specific network interface
server.listen(PORT, HOST, () => {
  console.log('Server running on:');
  console.log(`- http://${HOST}:${PORT}`);
});

// Error handling for server
server.on('error', (error) => {
  if (error.code === 'EADDRNOTAVAIL') {
    console.error('Address not available, falling back to all interfaces');
    // Fallback to listen on all available network interfaces
    server.listen(PORT, '0.0.0.0', () => {
      console.log('Server running on all network interfaces:');
      console.log(`- http://localhost:${PORT}`);
      console.log(`- http://0.0.0.0:${PORT}`);
      console.log(`- http://${HOST}:${PORT}`);
    });
  } else {
    console.error('Server error:', error);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server };




