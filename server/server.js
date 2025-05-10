const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// ... existing code ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 