const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database');
const morgan = require('morgan');



// Import routes
const eventsRouter = require('./routes/events');
const userRouter = require('./routes/user.route');
const agentRoutes = require('./routes/agentRoutes');
const servicesRouter = require('./routes/services.js');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/agents', agentRoutes);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;


