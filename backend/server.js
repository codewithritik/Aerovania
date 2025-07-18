const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase, testConnection } = require('./src/utils/database');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Import routes
const authRoutes = require('./src/routes/auth');
const reportRoutes = require('./src/routes/reports');


const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply JSON parsing to most routes, but exclude upload endpoints
app.use((req, res, next) => {
  // Skip JSON parsing for upload endpoints
  if (req.path.includes('/upload')) {
    console.log('Skipping JSON parsing for upload endpoint:', req.path);
    next();
  } else {
    console.log('Applying JSON parsing for:', req.path);
    express.json({ limit: '10mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Apply rate limiting to all requests
// app.use(apiLimiter);

// Health check routes
app.get('/', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    
    res.json({
      status: 'OK',
      service: 'Aerovania Drone Analytics API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      endpoints: {
        auth: '/api/auth',
        reports: '/api/reports',
        admin: '/api/admin'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'ERROR',
      service: 'Aerovania Drone Analytics API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      database: { connected: false, error: error.message }
    });
  }
});

app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  if (dbStatus.connected) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  } else {
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: dbStatus
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);


// Backward compatibility routes (keeping same endpoints)
app.use('/api', reportRoutes); // This maintains the existing endpoints

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  
  if (error.message === 'Only JSON files are allowed') {
    return res.status(400).json({ error: 'Only JSON files are allowed' });
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`📊 Report endpoints: http://localhost:${PORT}/api/reports`);
      console.log(`👨‍💼 Admin endpoints: http://localhost:${PORT}/api/admin`);
    });

    // Store server reference for graceful shutdown
    global.server = server;
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
