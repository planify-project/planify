const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');
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
const stripeRoutes = require("./routes/stripeRoutes");
const wishlistRoutes = require('./routes/wishlist.route');
const eventSpaceRoutes = require('./routes/eventSpaceRoutes');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Basic middleware
app.use(express.json());
app.use(morgan('dev'));

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  allowEIO3: true
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', {
    id: socket.id,
    transport: socket.conn.transport.name,
    address: socket.handshake.address
  });

  // Send test event to verify connection
  socket.emit('test', { 
    message: 'Connected successfully',
    timestamp: new Date().toISOString()
  });

  socket.on('joinUserRoom', ({ userId }) => {
    if (!userId) {
      console.error('Invalid userId provided for room join');
      return;
    }
    const roomName = `user_${userId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', {
      id: socket.id,
      reason: reason
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', {
      id: socket.id,
      error: error.message
    });
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
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/agents', agentRoutes);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRoutes);
app.use('/api', stripeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/event-spaces', eventSpaceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  const urls = [
    `http://localhost:${PORT}`,
    `http://${HOST}:${PORT}`,
    `http://172.20.10.3:${PORT}`
  ];
  
  console.log('\nServer running on:');
  urls.forEach(url => {
    console.log(`\n${url}:`);
    console.log(`  - Test endpoint: ${url}/test`);
    console.log(`  - Health check: ${url}/health`);
    console.log(`  - Socket.IO: ${url}/socket.io/`);
  });
  console.log('\nSocket.IO Configuration:');
  console.log('  - Transports: websocket, polling');
  console.log('  - Path: /socket.io/');
  console.log('  - CORS: enabled for all origins');
});




