/**
 * Francisco Holdings Inc. - WebSocket Handler
 * Real-time updates across all 5 command center screens
 * The Trillion Dollar Skyscraper
 */

const WebSocket = require('ws');
const config = require('../config');
const revenueService = require('../services/revenueService');
const agentSwarmService = require('../services/agentSwarmService');
const omniGuardService = require('../services/omniGuardService');
const primeDoxService = require('../services/primeDoxService');
const gapHunterService = require('../services/gapHunterService');
const logger = require('../middleware/logger');

class WebSocketHandler {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws',
      maxPayload: 1024 * 1024
    });
    
    this.clients = new Map();
    this.heartbeatInterval = config.ws.heartbeatInterval;
    
    this._setupConnectionHandling();
    this._setupServiceSubscriptions();
    this._startHeartbeat();
    
    logger.info('WebSocket server initialized on /ws');
  }
  
  _setupConnectionHandling() {
    this.wss.on('connection', (ws, req) => {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientInfo = {
        id: clientId,
        ip: req.socket.remoteAddress,
        connectedAt: new Date().toISOString(),
        subscriptions: new Set(),
        lastPong: Date.now()
      };
      
      this.clients.set(ws, clientInfo);
      logger.info(`WebSocket client connected: ${clientId}`);
      
      this._send(ws, {
        type: 'connection',
        message: 'Welcome to the Francisco Holdings Empire Command Center.',
        data: {
          empire: 'Francisco Holdings Inc.',
          tagline: 'The Trillion Dollar Skyscraper',
          totalFloors: config.empire.totalFloors,
          activeFloors: config.empire.activeFloors,
          totalAgents: config.empire.totalAgents,
          gemmaVersion: config.empire.gemmaVersion,
          timestamp: new Date().toISOString()
        }
      });
      
      this._sendInitialData(ws);
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this._handleMessage(ws, message);
        } catch (e) {
          logger.error('Invalid WebSocket message:', e.message);
          this._send(ws, { type: 'error', message: 'Invalid message format' });
        }
      });
      
      ws.on('pong', () => {
        const info = this.clients.get(ws);
        if (info) info.lastPong = Date.now();
      });
      
      ws.on('close', () => {
        logger.info(`WebSocket client disconnected: ${clientId}`);
        this.clients.delete(ws);
      });
      
      ws.on('error', (err) => {
        logger.error(`WebSocket error for ${clientId}:`, err.message);
      });
    });
  }
  
  _handleMessage(ws, message) {
    const info = this.clients.get(ws);
    
    switch (message.type) {
      case 'subscribe':
        const channel = message.channel || 'all';
        info.subscriptions.add(channel);
        this._send(ws, { type: 'subscribed', channel, message: `Subscribed to ${channel} updates.` });
        break;
        
      case 'unsubscribe':
        info.subscriptions.delete(message.channel);
        this._send(ws, { type: 'unsubscribed', channel: message.channel });
        break;
        
      case 'ping':
        this._send(ws, { type: 'pong', timestamp: Date.now() });
        break;
        
      case 'get_status':
        this._send(ws, {
          type: 'status',
          data: {
            connectedClients: this.clients.size,
            subscriptions: Array.from(info.subscriptions),
            uptime: process.uptime()
          }
        });
        break;
        
      case 'command':
        this._handleCommand(ws, message);
        break;
        
      default:
        this._send(ws, { type: 'error', message: `Unknown message type: ${message.type}` });
    }
  }
  
  _handleCommand(ws, message) {
    const { command, params } = message;
    
    switch (command) {
      case 'dispatch_agent':
        const result = agentSwarmService.dispatchTask(params);
        this._send(ws, { type: 'command_result', command, result });
        break;
        
      case 'scan_gaps':
        const scan = gapHunterService.scanCompanies(params.companies, params.industry);
        this._send(ws, { type: 'command_result', command, scan });
        break;
        
      case 'generate_document':
        const doc = primeDoxService.createDocument(params);
        this._send(ws, { type: 'command_result', command, doc });
        break;
        
      default:
        this._send(ws, { type: 'error', message: `Unknown command: ${command}` });
    }
  }
  
  _send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
  
  _broadcast(data, channel = 'all') {
    this.clients.forEach((info, ws) => {
      if (info.subscriptions.has(channel) || info.subscriptions.has('all')) {
        this._send(ws, data);
      }
    });
  }
  
  _sendInitialData(ws) {
    this._send(ws, { type: 'revenue_snapshot', data: revenueService.getSummary() });
    this._send(ws, { type: 'agent_snapshot', data: agentSwarmService.getStatus() });
    this._send(ws, {
      type: 'threat_snapshot',
      data: { threats: omniGuardService.getThreats({ limit: 20 }), stats: omniGuardService.getStats() }
    });
    this._send(ws, {
      type: 'document_snapshot',
      data: { queue: primeDoxService.getQueue(), recent: primeDoxService.getDocuments({ limit: 10 }) }
    });
    this._send(ws, { type: 'gap_snapshot', data: gapHunterService.getGapStats() });
  }
  
  _setupServiceSubscriptions() {
    revenueService.subscribe((data) => {
      this._broadcast({ type: 'revenue_update', data: data.type === 'transaction' ? data.data : revenueService.getSummary() }, 'revenue');
    });
    
    agentSwarmService.subscribe((data) => {
      this._broadcast({ type: 'agent_update', data: data.type === 'swarm_heartbeat' ? data.data : agentSwarmService.getStatus() }, 'agents');
    });
    
    omniGuardService.subscribe((data) => {
      this._broadcast({ type: 'threat_update', data: data.type === 'threat_detected' ? data.data : omniGuardService.getStats() }, 'threats');
    });
    
    primeDoxService.subscribe((data) => {
      this._broadcast({ type: 'document_update', data: data.type === 'document_completed' ? data.data : primeDoxService.getQueue() }, 'documents');
    });
    
    gapHunterService.subscribe((data) => {
      this._broadcast({ type: 'gap_update', data: data.type === 'scan_completed' ? data.data : gapHunterService.getGapStats() }, 'gaps');
    });
  }
  
  _startHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      this.clients.forEach((info, ws) => {
        if (now - info.lastPong > this.heartbeatInterval * 2) {
          logger.warn(`Client ${info.id} heartbeat timeout. Disconnecting.`);
          ws.terminate();
          this.clients.delete(ws);
        } else {
          ws.ping();
        }
      });
    }, this.heartbeatInterval);
  }
  
  getStats() {
    return {
      connectedClients: this.clients.size,
      maxConnections: config.ws.maxConnections,
      uptime: process.uptime()
    };
  }
}

module.exports = WebSocketHandler;
