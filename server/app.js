const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./database');
const db = require('./database');
const { Event } = db;

// Import routes
const eventsRouter = require('./routes/events');
const userRouter = require('./routes/user.route');
const agentRoutes = require('./routes/agentRoutes');
const servicesRouter = require('./routes/services.js');
const bookingRouter = require('./routes/booking.routes.js');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to our routes
app.set('io', io);

const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/agents', agentRoutes);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




