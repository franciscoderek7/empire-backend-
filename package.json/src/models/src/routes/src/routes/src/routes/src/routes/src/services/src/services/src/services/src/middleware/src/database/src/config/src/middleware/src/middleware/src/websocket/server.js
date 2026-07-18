/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  FRANCISCO HOLDINGS INC. - EMPIRE BACKEND API                           ║
 * ║  The Trillion Dollar Skyscraper                                         ║
 * ║  45+ Companies | 392 Floors | 12,847 AI Agents | Gemma 31B            ║
 * ║  Real-time Revenue | Agent Swarm | OmniGuard | PrimeDox | Gap Hunter   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const path = require('path');

const config = require('./config');
const logger = require('./middleware/logger');
const { standardLimiter } = require('./middleware/rateLimiter');
const WebSocketHandler = require('./websocket/handler');

const authRoutes = require('./routes/auth');
const revenueRoutes = require('./routes/revenue');
const agentRoutes = require('./routes/agents');
const omniGuardRoutes = require('./routes/omniguard');
const primeDoxRoutes = require('./routes/primedox');
const gapHunterRoutes = require('./routes/gaphunter');
const empireRoutes = require('./routes/empire');

const app = express();
const server = http.createServer(app);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:", ...config.corsOrigins],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(standardLimiter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')?.slice(0, 50)
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/omniguard', omniGuardRoutes);
app.use('/api/primedox', primeDoxRoutes);
app.use('/api/gaphunter', gapHunterRoutes);
app.use('/api/empire', empireRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    empire: 'Francisco Holdings Inc.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Francisco Holdings Inc.',
    tagline: 'The Trillion Dollar Skyscraper',
    message: 'Empire Backend API is operational.',
    endpoints: {
      auth: '/api/auth',
      revenue: '/api/revenue',
      agents: '/api/agents',
      omniguard: '/api/omniguard',
      primedox: '/api/primedox',
      gaphunter: '/api/gaphunter',
      empire: '/api/empire',
      websocket: '/ws',
      health: '/health'
    },
    documentation: 'API documentation available at /api/docs (coming soon)',
    timestamp: new Date().toISOString()
  });
});

const wsHandler = new WebSocketHandler(server);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.',
    path: req.path,
    empire: 'Francisco Holdings Inc.'
  });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'Internal server error.' : err.message,
    empire: 'Francisco Holdings Inc.'
  });
});

const PORT = config.port;

server.listen(PORT, () => {
  logger.info(`╔════════════════════════════════════════════════════════════╗`);
  logger.info(`║  FRANCISCO HOLDINGS INC. - EMPIRE BACKEND ONLINE           ║`);
  logger.info(`║  Port: ${PORT.toString().padEnd(53)}║`);
  logger.info(`║  Environment: ${config.nodeEnv.padEnd(47)}║`);
  logger.info(`║  Floors: ${config.empire.totalFloors.toString().padEnd(52)}║`);
  logger.info(`║  Agents: ${config.empire.totalAgents.toString().padEnd(52)}║`);
  logger.info(`║  Gemma: ${config.empire.gemmaVersion.padEnd(53)}║`);
  logger.info(`║  WebSocket: /ws${' '.padEnd(44)}║`);
  logger.info(`╚════════════════════════════════════════════════════════════╝`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed. Empire offline.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed. Empire offline.');
    process.exit(0);
  });
});

module.exports = { app, server, wsHandler };
