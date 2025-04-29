const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database')
const db = require('./database');
const { Event } = db;
const eventsRouter = require('./routes/events');
const userRouter = require('./routes/user.route');const agentRoutes = require('./routes/agentRoutes');


const app = express();
const port = 
// process.env.PORT || 
3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Paginated events endpoint
app.use('/api/events', eventsRouter);

// Routes
app.use('/api/agents', agentRoutes);

// Database connection and server start

  try { 
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }

module.exports = app;


