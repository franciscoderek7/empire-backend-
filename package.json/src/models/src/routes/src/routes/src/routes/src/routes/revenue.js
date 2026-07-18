/**
 * Francisco Holdings Inc. - Revenue Service
 * Every penny, every floor, real-time
 * The Trillion Dollar Skyscraper
 */

const db = require('../database');
const { v4: uuidv4 } = require('uuid');

class RevenueService {
  constructor() {
    this.subscribers = new Set();
    this._startSimulation();
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  _notifySubscribers(data) {
    this.subscribers.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Revenue subscriber error:', e); }
    });
  }
  
  async recordTransaction(txData) {
    const tx = db.recordTransaction({
      amount: parseFloat(txData.amount),
      currency: txData.currency || 'CAD',
      floor: txData.floor,
      companyId: txData.companyId,
      companyName: txData.companyName,
      source: txData.source,
      description: txData.description,
      customerId: txData.customerId,
      status: txData.status || 'completed',
      metadata: txData.metadata
    });
    
    this._notifySubscribers({ type: 'transaction', data: tx });
    return tx;
  }
  
  getSummary() { return db.getRevenueSummary(); }
  getByFloor(floor) { return db.data.revenue.byFloor.get(parseInt(floor)); }
  getByCompany(companyId) { return db.data.revenue.byCompany.get(parseInt(companyId)); }
  
  getTopFloors(limit = 10) {
    return Array.from(db.data.revenue.byFloor.values())
      .sort((a, b) => b.total - a.total).slice(0, limit);
  }
  
  getHourlyTrend() {
    const now = new Date();
    const hours = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = hour.toISOString().slice(0, 13);
      const txs = db.data.revenue.transactions.filter(t => t.timestamp.startsWith(hourStr));
      const total = txs.reduce((sum, t) => sum + t.amount, 0);
      hours.push({ hour: hour.toISOString(), total, count: txs.length });
    }
    return hours;
  }
  
  _startSimulation() {
    const companies = [
      { id: 1, name: 'Francisco Holdings Inc.', floor: 1 },
      { id: 2, name: 'OmniGuard', floor: 2 },
      { id: 3, name: 'PrimeDox AI', floor: 3 },
      { id: 4, name: 'Vault Velocity Auto', floor: 4 },
      { id: 5, name: 'CCLDR', floor: 5 },
      { id: 6, name: 'CCC', floor: 6 },
      { id: 7, name: 'Kiaros', floor: 7 },
      { id: 8, name: 'Vigilax', floor: 8 },
      { id: 9, name: 'CleanSwarm', floor: 9 },
      { id: 10, name: 'TechPetCage', floor: 10 },
      { id: 11, name: 'BENO-X', floor: 11 },
      { id: 12, name: 'CannaDeliver', floor: 12 }
    ];
    const sources = ['paypal', 'stripe', 'crypto', 'invoice', 'subscription'];
    
    setInterval(() => {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const amount = Math.random() > 0.7 
        ? Math.floor(Math.random() * 5000) + 100
        : Math.floor(Math.random() * 200) + 10;
      
      this.recordTransaction({
        amount, currency: 'CAD', floor: company.floor,
        companyId: company.id, companyName: company.name,
        source: sources[Math.floor(Math.random() * sources.length)],
        description: `Revenue from ${company.name}`,
        customerId: `customer_${Math.floor(Math.random() * 10000)}`,
        status: 'completed', metadata: { simulated: true }
      });
    }, Math.random() * 12000 + 3000);
  }
}

module.exports = new RevenueService();
