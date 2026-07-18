/**
 * Francisco Holdings Inc. - Empire Configuration
 * The Trillion Dollar Skyscraper
 */

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'empire-default-secret-CHANGE-IN-PRODUCTION',
    expire: process.env.JWT_EXPIRE || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },
  
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  
  ws: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 30000,
    maxConnections: parseInt(process.env.WS_MAX_CONNECTIONS) || 10000
  },
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'francisco_holdings',
    user: process.env.DB_USER || 'empire_admin',
    password: process.env.DB_PASSWORD || ''
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 1000
  },
  
  empire: {
    totalFloors: parseInt(process.env.TOTAL_FLOORS) || 392,
    activeFloors: parseInt(process.env.ACTIVE_FLOORS) || 12,
    totalAgents: parseInt(process.env.TOTAL_AGENTS) || 12847,
    gemmaVersion: process.env.GEMMA_VERSION || '31B',
    companies: [
      { id: 1, name: 'Francisco Holdings Inc.', domain: 'franciscoholdingsinc.com', floor: 1, status: 'active', revenue: 0 },
      { id: 2, name: 'OmniGuard', domain: 'omniaguard.com', floor: 2, status: 'active', revenue: 0 },
      { id: 3, name: 'PrimeDox AI', domain: 'zprimedoxaihq.com', floor: 3, status: 'active', revenue: 0 },
      { id: 4, name: 'Vault Velocity Auto', domain: 'vaultvelocityauto.com', floor: 4, status: 'active', revenue: 0 },
      { id: 5, name: 'CCLDR', domain: 'ccldr.net', floor: 5, status: 'active', revenue: 0 },
      { id: 6, name: 'CCC', domain: 'cannabis-consulting-corp.com', floor: 6, status: 'active', revenue: 0 },
      { id: 7, name: 'Kiaros', domain: 'kiaros.com', floor: 7, status: 'active', revenue: 0 },
      { id: 8, name: 'Vigilax', domain: 'vigilax.com', floor: 8, status: 'active', revenue: 0 },
      { id: 9, name: 'CleanSwarm', domain: 'cleanswarm.com', floor: 9, status: 'active', revenue: 0 },
      { id: 10, name: 'TechPetCage', domain: 'techpetcage.com', floor: 10, status: 'active', revenue: 0 },
      { id: 11, name: 'BENO-X', domain: 'beno-x.com', floor: 11, status: 'active', revenue: 0 },
      { id: 12, name: 'CannaDeliver', domain: 'canna-deliver.com', floor: 12, status: 'active', revenue: 0 }
    ]
  },
  
  colors: {
    champagneGold: '#C9A961',
    black: '#0a0a0a',
    platinum: '#C0C0C0',
    emerald: '#00C853',
    danger: '#FF1744',
    warning: '#FFAB00'
  }
};

module.exports = config;
