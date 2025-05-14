const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const eventSpaceRoutes = require('./routes/eventSpaceRoutes');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['polling', 'websocket']
  },
  allowEIO3: true,
  path: '/socket.io',
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  agent: false,
  reconnectionDelayMax: 5000,
  reconnectionDelay: 1000
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Mount routes
app.use('/api/event-spaces', eventSpaceRoutes);

const PORT = process.env.PORT || 3000;
const HOST = '192.168.149.72';

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});




