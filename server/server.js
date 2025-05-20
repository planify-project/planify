const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const initializeSocket = require('./socket');
const { sequelize } = require('./database');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Upgrade', 'Connection', 'Sec-WebSocket-Key', 'Sec-WebSocket-Version', 'Sec-WebSocket-Extensions'],
  exposedHeaders: ['Upgrade', 'Connection']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    clientIp: req.ip,
    clientHeaders: req.headers
  });
});

// Initialize Socket.IO
const io = initializeSocket(server);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/events', require('./routes/events'));
app.use('/api/event-spaces', require('./routes/eventSpaceRoutes'));
app.use('/api/wishlist', require('./routes/wishlist.route'));
app.use('/api', require('./routes/stripeRoutes'));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    socketConnections: io.engine.clientsCount,
    clientIp: req.ip
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Bind to all network interfaces

// Start server with detailed logging
server.listen(PORT, HOST, () => {
  const networkInterfaces = require('os').networkInterfaces();
  const addresses = [];
  
  // Get all network interfaces
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    });
  });

  console.log('\nServer running on:');
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`  Android Emulator: http://10.0.2.2:${PORT}`);
  console.log(`  Network: http://192.168.1.164:${PORT}`);
  addresses.forEach(addr => {
    if (addr !== '192.168.1.164') {
      console.log(`  Network: http://${addr}:${PORT}`);
    }
  });
  console.log(`\nEndpoints:`);
  console.log(`  Test: http://localhost:${PORT}/test`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  Socket.IO: http://localhost:${PORT}/socket.io/`);
  
  console.log('\nSocket.IO Configuration:');
  console.log('  - Transports: polling, websocket');
  console.log('  - Path: /socket.io/');
  console.log('  - CORS: enabled for all origins');
  console.log('  - Ping Interval: 10000ms');
  console.log('  - Ping Timeout: 5000ms');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
}); 