/**
 * Francisco Holdings Inc. - OmniGuard Sentinel Service
 * Threat Map, Agent Swarm Defense, Gemma 31B Security
 * Floor 2 - The Trillion Dollar Skyscraper
 */

const db = require('../database');

class OmniGuardService {
  constructor() {
    this.subscribers = new Set();
    this.threatTypes = [
      'DDoS', 'SQL Injection', 'XSS', 'Brute Force', 'Malware',
      'Phishing', 'Data Exfiltration', 'Credential Stuffing', 'Ransomware',
      'API Abuse', 'Bot Attack', 'Zero-Day Exploit', 'Insider Threat'
    ];
    this._startThreatSimulation();
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  _notify(data) {
    this.subscribers.forEach(cb => {
      try { cb(data); } catch (e) { console.error('OmniGuard subscriber error:', e); }
    });
  }
  
  addThreat(threatData) {
    const threat = db.addThreat(threatData);
    this._notify({ type: 'threat_detected', data: threat });
    return threat;
  }
  
  getThreats(filters = {}) { return db.getThreats(filters); }
  getStats() { return db.getThreatStats(); }
  
  getThreatMap() {
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
    return regions.map(region => ({
      region,
      threats: Math.floor(Math.random() * 500) + 50,
      blocked: Math.floor(Math.random() * 400) + 40,
      active: Math.floor(Math.random() * 20),
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)]
    }));
  }
  
  getAgentDefenseStatus() {
    const agents = db.getAgents({ type: 'security' });
    return {
      totalDefenders: agents.length,
      activeDefenders: agents.filter(a => a.status === 'active').length,
      patrolling: agents.filter(a => a.status === 'busy').length,
      threatsNeutralized: db.data.threatStats.totalBlocked,
      lastSweep: new Date().toISOString()
    };
  }
  
  resolveThreat(threatId, resolution) {
    const threat = db.data.threats.find(t => t.id === threatId);
    if (!threat) return null;
    threat.status = 'resolved';
    threat.resolution = resolution;
    threat.resolvedAt = new Date().toISOString();
    db.data.threatStats.activeThreats = Math.max(0, db.data.threatStats.activeThreats - 1);
    this._notify({ type: 'threat_resolved', data: threat });
    return threat;
  }
  
  _startThreatSimulation() {
    setInterval(() => {
      if (Math.random() > 0.6) {
        const severities = ['low', 'medium', 'high', 'critical'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const blocked = Math.random() > 0.3;
        
        this.addThreat({
          severity,
          type: this.threatTypes[Math.floor(Math.random() * this.threatTypes.length)],
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          target: `floor_${Math.floor(Math.random() * 12) + 1}`,
          description: `Automated threat detection: ${severity} severity ${this.threatTypes[Math.floor(Math.random() * this.threatTypes.length)]}`,
          status: blocked ? 'blocked' : 'active',
          blocked,
          agentId: `agent_${Math.floor(Math.random() * 12847) + 1}`,
          metadata: { autoDetected: true }
        });
      }
    }, 3000);
  }
}

module.exports = new OmniGuardService();
