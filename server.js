/**
 * Empire Backend API
 * Francisco Holdings Inc. — Production-Ready Node.js Server
 * Features: Auth, Leads, AI Chat, Gap Hunter Scans, Health Check
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth');
const leadsRoutes = require('./src/routes/leads');
const chatRoutes = require('./src/routes/chat');
const scansRoutes = require('./src/routes/scans');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    empire: 'Francisco Holdings Inc.',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/scans', scansRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Empire Backend API — Francisco Holdings Inc.',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      leads: '/api/leads',
      chat: '/api/chat',
      scans: '/api/scans'
    },
    documentation: 'PrimeDox AI HQ'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Empire Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    empire: 'Francisco Holdings Inc.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════╗`);
  console.log(`║  EMPIRE BACKEND ONLINE                   ║`);
  console.log(`║  Francisco Holdings Inc.                 ║`);
  console.log(`║  Port: ${PORT.toString().padEnd(33)}║`);
  console.log(`║  Mode: ${process.env.NODE_ENV?.padEnd(32) || 'development'.padEnd(32)}║`);
  console.log(`╚══════════════════════════════════════════╝`);
});

module.exports = app;

