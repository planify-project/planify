const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database')
const db = require('./database');
const { Event } = db;
const eventsRouter = require('./routes/events');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Paginated events endpoint
app.use('/api/events', eventsRouter);

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


