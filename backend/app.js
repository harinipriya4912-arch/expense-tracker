const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  const app = express();

  // Body parser
  app.use(express.json());

  // Enable CORS
  app.use(cors());

  // Mount routers
  app.use('/api/transactions', require('./routes/transactionRoutes'));

  // Error handler middleware
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error.message);
  process.exit(1);
});