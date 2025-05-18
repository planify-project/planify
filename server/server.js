const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');
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

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Basic middleware
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS
app.use(cors({
  origin: '*',
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

  socket.on('joinUserRoom', ({ userId }) => {
    if (!userId) return;
    const roomName = `user_${userId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
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
  console.log('  - Transports: websocket');
  console.log('  - Path: /socket.io/');
  console.log('  - CORS: enabled for all origins');
}); 