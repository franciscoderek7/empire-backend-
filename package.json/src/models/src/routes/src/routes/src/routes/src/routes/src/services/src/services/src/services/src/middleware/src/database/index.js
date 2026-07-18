/**
 * Francisco Holdings Inc. - Empire Database Layer
 * In-memory with PostgreSQL migration path
 * The Trillion Dollar Skyscraper
 */

const { v4: uuidv4 } = require('uuid');
const config = require('../config');

class EmpireDatabase {
  constructor() {
    this.data = {
      users: new Map(),
      sessions: new Map(),
      revenue: {
        total: 0,
        today: 0,
        thisMonth: 0,
        thisYear: 0,
        byFloor: new Map(),
        byCompany: new Map(),
        transactions: [],
        history: []
      },
      agents: new Map(),
      agentSwarm: {
        totalAgents: config.empire.totalAgents,
        activeAgents: 0,
        idleAgents: 0,
        busyAgents: 0,
        errorAgents: 0,
        gemmaStatus: 'online',
        gemmaLoad: 0,
        orchestrationQueue: [],
        swarmMetrics: {
          tasksCompleted: 0,
          tasksFailed: 0,
          avgResponseTime: 0,
          uptime: 99.99
        }
      },
      threats: [],
      threatStats: {
        totalBlocked: 0,
        totalDetected: 0,
        activeThreats: 0,
        severityBreakdown: { critical: 0, high: 0, medium: 0, low: 0 }
      },
      documents: [],
      docQueue: {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        avgProcessingTime: 0
      },
      gapScans: [],
      gapResults: [],
      litigation: [
        {
          id: 'CV-26-00000064-0000',
          name: 'Francisco v. Denby et al.',
          amount: 3300000,
          status: 'active',
          hearingDate: '2026-07-14T09:30:00',
          court: 'Lindsay',
          defendants: ['Bill Denby', 'Gwen Denby', 'Treasure Island Resort Inc.', 'Treasure Island Cycle\'s & ATV\'s', '2413319 Ontario Inc.'],
          type: 'civil',
          notes: 'Leave to add 2413319 Ontario Inc., amend damages to $3.3M'
        },
        {
          id: 'CV-26-00000063-0000',
          name: 'Francisco v. Attorney General of Canada',
          amount: 35000000,
          status: 'active',
          hearingDate: null,
          court: 'Federal',
          defendants: ['Attorney General of Canada', 'Health Canada'],
          type: 'constitutional',
          notes: 'Constitutional claim - cannabis rights'
        },
        {
          id: 'CIBC-2026',
          name: 'Francisco v. CIBC / Kudos / Telus',
          amount: 331313.21,
          status: 'active',
          hearingDate: null,
          court: 'Pending',
          defendants: ['CIBC', 'Kudos', 'Telus', 'Andrew Slopianka (#5420)', 'Assim (AK...)'],
          type: 'fraud',
          notes: 'Criminal Code s.380(1), s.362(1) - check fraud, unauthorized charges'
        }
      ],
      metrics: {
        totalRevenue: 0,
        totalUsers: 0,
        totalDocuments: 0,
        totalThreatsBlocked: 0,
        uptime: 99.99,
        lastUpdated: new Date().toISOString()
      },
      siteVisits: new Map(),
      userActivity: new Map()
    };
    
    this._initializeAgents();
    this._initializeRevenue();
  }
  
  _initializeAgents() {
    const agentTypes = ['document', 'security', 'analytics', 'customer', 'sales', 'legal', 'research', 'orchestration'];
    const companies = config.empire.companies;
    
    for (let i = 1; i <= config.empire.totalAgents; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const type = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      
      this.data.agents.set(`agent_${i}`, {
        id: `agent_${i}`,
        name: `Agent-${i.toString().padStart(5, '0')}`,
        type,
        companyId: company.id,
        companyName: company.name,
        floor: company.floor,
        status: Math.random() > 0.3 ? 'active' : (Math.random() > 0.5 ? 'idle' : 'busy'),
        load: Math.floor(Math.random() * 100),
        tasksCompleted: Math.floor(Math.random() * 10000),
        lastHeartbeat: new Date().toISOString(),
        gemmaShard: Math.floor(i / 413),
        capabilities: this._getAgentCapabilities(type),
        createdAt: new Date().toISOString()
      });
    }
    
    this._updateAgentStats();
  }
  
  _getAgentCapabilities(type) {
    const caps = {
      document: ['generate', 'review', 'analyze', 'translate', 'summarize'],
      security: ['scan', 'block', 'monitor', 'alert', 'patch'],
      analytics: ['predict', 'trend', 'report', 'visualize', 'forecast'],
      customer: ['support', 'route', 'escalate', 'satisfy', 'retain'],
      sales: ['prospect', 'pitch', 'close',close', 'upsell', 'retain'],
      legal: ['research', 'draft', 'citation', 'compliance', 'review'],
      research: ['discover', 'validate', 'synthesize', 'publish', 'patent'],
      orchestration: ['coordinate', 'dispatch', 'balance', 'scale', 'heal']
    };
    return caps[type] || ['generic'];
  }
  
  _updateAgentStats() {
    const agents = Array.from(this.data.agents.values());
    this.data.agentSwarm.activeAgents = agents.filter(a => a.status === 'active').length;
    this.data.agentSwarm.idleAgents = agents.filter(a => a.status === 'idle').length;
    this.data.agentSwarm.busyAgents = agents.filter(a => a.status === 'busy').length;
    this.data.agentSwarm.errorAgents = agents.filter(a => a.status === 'error').length;
  }
  
  _initializeRevenue() {
    config.empire.companies.forEach(company => {
      this.data.revenue.byFloor.set(company.floor, {
        floor: company.floor,
        companyId: company.id,
        companyName: company.name,
        total: 0,
        today: 0,
        month: 0,
        transactions: []
      });
      this.data.revenue.byCompany.set(company.id, {
        companyId: company.id,
        companyName: company.name,
        total: 0,
        today: 0,
        month: 0,
        transactions: []
      });
    });
  }
  
  createUser(userData) {
    const id = uuidv4();
    const user = {
      id,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      soulStack: {
        level: 1,
        xp: 0,
        badges: [],
        achievements: []
      },
      permissions: userData.permissions || ['read'],
      authorizedSites: userData.authorizedSites || [],
      lastLogin: null,
      loginHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.users.set(id, user);
    return user;
  }
  
  getUser(id) { return this.data.users.get(id); }
  getUserByEmail(email) { return Array.from(this.data.users.values()).find(u => u.email === email); }
  
  recordTransaction(tx) {
    const transaction = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      amount: tx.amount,
      currency: tx.currency || 'CAD',
      floor: tx.floor,
      companyId: tx.companyId,
      companyName: tx.companyName,
      source: tx.source,
      description: tx.description,
      customerId: tx.customerId,
      status: tx.status || 'completed',
      metadata: tx.metadata || {}
    };
    
    this.data.revenue.transactions.push(transaction);
    this.data.revenue.total += tx.amount;
    this.data.revenue.today += tx.amount;
    this.data.revenue.thisMonth += tx.amount;
    this.data.revenue.thisYear += tx.amount;
    
    const floorData = this.data.revenue.byFloor.get(tx.floor);
    if (floorData) {
      floorData.total += tx.amount;
      floorData.today += tx.amount;
      floorData.month += tx.amount;
      floorData.transactions.push(transaction);
    }
    
    const companyData = this.data.revenue.byCompany.get(tx.companyId);
    if (companyData) {
      companyData.total += tx.amount;
      companyData.today += tx.amount;
      companyData.month += tx.amount;
      companyData.transactions.push(transaction);
    }
    
    this.data.metrics.totalRevenue = this.data.revenue.total;
    this.data.metrics.lastUpdated = new Date().toISOString();
    return transaction;
  }
  
  getRevenueSummary() {
    return {
      total: this.data.revenue.total,
      today: this.data.revenue.today,
      thisMonth: this.data.revenue.thisMonth,
      thisYear: this.data.revenue.thisYear,
      byFloor: Array.from(this.data.revenue.byFloor.values()),
      byCompany: Array.from(this.data.revenue.byCompany.values()),
      recentTransactions: this.data.revenue.transactions.slice(-50).reverse()
    };
  }
  
  getAgent(id) { return this.data.agents.get(id); }
  getAgents(filters = {}) {
    let agents = Array.from(this.data.agents.values());
    if (filters.status) agents = agents.filter(a => a.status === filters.status);
    if (filters.type) agents = agents.filter(a => a.type === filters.type);
    if (filters.companyId) agents = agents.filter(a => a.companyId === parseInt(filters.companyId));
    if (filters.floor) agents = agents.filter(a => a.floor === parseInt(filters.floor));
    return agents;
  }
  
  updateAgentStatus(id, status, load = null) {
    const agent = this.data.agents.get(id);
    if (!agent) return null;
    agent.status = status;
    if (load !== null) agent.load = load;
    agent.lastHeartbeat = new Date().toISOString();
    this._updateAgentStats();
    return agent;
  }
  
  getAgentSwarmStatus() {
    return {
      ...this.data.agentSwarm,
      agents: {
        total: this.data.agentSwarm.totalAgents,
        active: this.data.agentSwarm.activeAgents,
        idle: this.data.agentSwarm.idleAgents,
        busy: this.data.agentSwarm.busyAgents,
        error: this.data.agentSwarm.errorAgents
      }
    };
  }
  
  addThreat(threat) {
    const t = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      severity: threat.severity,
      type: threat.type,
      source: threat.source,
      target: threat.target,
      description: threat.description,
      status: threat.status || 'active',
      blocked: threat.blocked || false,
      agentId: threat.agentId,
      metadata: threat.metadata || {}
    };
    
    this.data.threats.unshift(t);
    this.data.threatStats.totalDetected++;
    this.data.threatStats.severityBreakdown[threat.severity]++;
    
    if (t.blocked) this.data.threatStats.totalBlocked++;
    if (t.status === 'active') this.data.threatStats.activeThreats++;
    
    if (this.data.threats.length > 10000) this.data.threats = this.data.threats.slice(0, 10000);
    this.data.metrics.totalThreatsBlocked = this.data.threatStats.totalBlocked;
    return t;
  }
  
  getThreats(filters = {}) {
    let threats = this.data.threats;
    if (filters.severity) threats = threats.filter(t => t.severity === filters.severity);
    if (filters.status) threats = threats.filter(t => t.status === filters.status);
    if (filters.limit) threats = threats.slice(0, parseInt(filters.limit));
    return threats;
  }
  
  getThreatStats() { return this.data.threatStats; }
  
  addDocument(doc) {
    const d = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: doc.type,
      title: doc.title,
      status: doc.status || 'pending',
      priority: doc.priority || 'normal',
      floor: doc.floor,
      companyId: doc.companyId,
      litigationId: doc.litigationId,
      content: doc.content,
      metadata: doc.metadata || {},
      processingTime: null,
      completedAt: null
    };
    
    this.data.documents.push(d);
    this.data.docQueue.pending++;
    this.data.metrics.totalDocuments = this.data.documents.length;
    return d;
  }
  
  updateDocumentStatus(id, status, processingTime = null) {
    const doc = this.data.documents.find(d => d.id === id);
    if (!doc) return null;
    
    const oldStatus = doc.status;
    doc.status = status;
    
    if (oldStatus === 'pending') this.data.docQueue.pending--;
    if (oldStatus === 'processing') this.data.docQueue.processing--;
    
    if (status === 'processing') this.data.docQueue.processing++;
    if (status === 'completed') {
      this.data.docQueue.completed++;
      doc.completedAt = new Date().toISOString();
      doc.processingTime = processingTime;
    }
    if (status === 'failed') this.data.docQueue.failed++;
    
    return doc;
  }
  
  getDocuments(filters = {}) {
    let docs = this.data.documents;
    if (filters.status) docs = docs.filter(d => d.status === filters.status);
    if (filters.type) docs = docs.filter(d => d.type === filters.type);
    if (filters.floor) docs = docs.filter(d => d.floor === parseInt(filters.floor));
    if (filters.litigationId) docs = docs.filter(d => d.litigationId === filters.litigationId);
    if (filters.limit) docs = docs.slice(-parseInt(filters.limit)).reverse();
    return docs;
  }
  
  getDocQueue() { return this.data.docQueue; }
  
  addGapScan(scan) {
    const s = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      targetCompanies: scan.targetCompanies || [],
      industry: scan.industry,
      status: scan.status || 'scanning',
      gapsFound: scan.gapsFound || [],
      recommendations: scan.recommendations || [],
      estimatedSavings: scan.estimatedSavings || 0,
      estimatedTimeSaved: scan.estimatedTimeSaved || 0,
      confidence: scan.confidence || 0
    };
    this.data.gapScans.push(s);
    return s;
  }
  
  getGapScans() { return this.data.gapScans; }
  
  getLitigation() { return this.data.litigation; }
  getLitigationById(id) { return this.data.litigation.find(l => l.id === id); }
  
  getMetrics() {
    this.data.metrics.totalUsers = this.data.users.size;
    this.data.metrics.lastUpdated = new Date().toISOString();
    return this.data.metrics;
  }
  
  trackSiteVisit(site, userId, sessionData) {
    const key = `${site}_${userId}`;
    const visit = {
      site,
      userId,
      timestamp: new Date().toISOString(),
      sessionData,
      pageViews: 1
    };
    this.data.siteVisits.set(key, visit);
    return visit;
  }
  
  getSiteVisits(site) {
    return Array.from(this.data.siteVisits.values()).filter(v => v.site === site);
  }
}

const db = new EmpireDatabase();
module.exports = db;
