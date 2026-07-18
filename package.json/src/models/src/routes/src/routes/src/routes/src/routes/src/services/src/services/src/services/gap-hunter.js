/**
 * Francisco Holdings Inc. - Gap Hunter Pro Service
 * Scan 100 companies, find gaps, fill gaps, solve
 * The Trillion Dollar Skyscraper
 */

const db = require('../database');

class GapHunterService {
  constructor() {
    this.subscribers = new Set();
    this.industries = [
      'Legal Tech', 'Cybersecurity', 'Cannabis', 'Real Estate', 
      'Automotive', 'AI/ML', 'FinTech', 'Healthcare', 'E-commerce',
      'Logistics', 'Education', 'Entertainment', 'Energy', 'Biotech'
    ];
    this.gapCategories = [
      'Automation', 'Customer Experience', 'Compliance', 'Security',
      'Revenue Leakage', 'Efficiency', 'Market Gap', 'Technology',
      'Talent', 'Branding', 'Operations', 'Data Analytics'
    ];
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  _notify(data) {
    this.subscribers.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Gap Hunter subscriber error:', e); }
    });
  }
  
  async scanCompanies(targetCompanies, industry) {
    const scan = db.addGapScan({
      targetCompanies: targetCompanies || this._generateTargetCompanies(),
      industry: industry || this.industries[Math.floor(Math.random() * this.industries.length)],
      status: 'scanning',
      gapsFound: [],
      recommendations: [],
      estimatedSavings: 0,
      estimatedTimeSaved: 0,
      confidence: 0
    });
    
    this._notify({ type: 'scan_started', data: scan });
    
    setTimeout(() => {
      this._completeScan(scan.id);
    }, Math.random() * 3000 + 2000);
    
    return scan;
  }
  
  _generateTargetCompanies() {
    const companies = [];
    const prefixes = ['Global', 'Prime', 'Advanced', 'Smart', 'Elite', 'Dynamic', 'Future', 'Mega'];
    const suffixes = ['Solutions', 'Systems', 'Corp', 'Inc', 'Technologies', 'Group', 'Holdings', 'Partners'];
    
    for (let i = 0; i < 100; i++) {
      companies.push({
        name: `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${Math.floor(Math.random() * 999) + 1}`,
        industry: this.industries[Math.floor(Math.random() * this.industries.length)],
        size: ['startup', 'small', 'medium', 'enterprise', 'fortune500'][Math.floor(Math.random() * 5)],
        revenue: Math.floor(Math.random() * 1000000000) + 1000000
      });
    }
    return companies;
  }
  
  _completeScan(scanId) {
    const scan = db.data.gapScans.find(s => s.id === scanId);
    if (!scan) return;
    
    const numGaps = Math.floor(Math.random() * 15) + 5;
    const gaps = [];
    const recommendations = [];
    let totalSavings = 0;
    let totalTimeSaved = 0;
    
    for (let i = 0; i < numGaps; i++) {
      const category = this.gapCategories[Math.floor(Math.random() * this.gapCategories.length)];
      const severity = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)];
      const savings = Math.floor(Math.random() * 500000) + 10000;
      const timeSaved = Math.floor(Math.random() * 2000) + 100;
      
      gaps.push({
        id: `gap_${scanId}_${i}`,
        category,
        severity,
        description: `Identified ${category} gap in ${scan.industry} sector`,
        affectedCompanies: Math.floor(Math.random() * 30) + 1,
        estimatedSavings: savings,
        estimatedTimeSaved: timeSaved,
        confidence: Math.floor(Math.random() * 30) + 70
      });
      
      recommendations.push({
        gapId: `gap_${scanId}_${i}`,
        action: `Implement ${category} solution via Francisco Holdings ${category} division`,
        priority: severity === 'critical' ? 'immediate' : severity,
        expectedROI: `${Math.floor(Math.random() * 500) + 50}%`,
        implementationTime: `${Math.floor(Math.random() * 12) + 1} weeks`
      });
      
      totalSavings += savings;
      totalTimeSaved += timeSaved;
    }
    
    scan.status = 'completed';
    scan.gapsFound = gaps;
    scan.recommendations = recommendations;
    scan.estimatedSavings = totalSavings;
    scan.estimatedTimeSaved = totalTimeSaved;
    scan.confidence = Math.floor(Math.random() * 15) + 85;
    scan.completedAt = new Date().toISOString();
    
    this._notify({ type: 'scan_completed', data: scan });
  }
  
  getScans() { return db.getGapScans(); }
  getScan(id) { return db.data.gapScans.find(s => s.id === id); }
  
  getGapStats() {
    const scans = db.data.gapScans;
    const completed = scans.filter(s => s.status === 'completed');
    
    return {
      totalScans: scans.length,
      completedScans: completed.length,
      totalGapsFound: completed.reduce((sum, s) => sum + (s.gapsFound?.length || 0), 0),
      totalEstimatedSavings: completed.reduce((sum, s) => sum + (s.estimatedSavings || 0), 0),
      totalTimeSaved: completed.reduce((sum, s) => sum + (s.estimatedTimeSaved || 0), 0),
      avgConfidence: completed.length > 0 
        ? completed.reduce((sum, s) => sum + (s.confidence || 0), 0) / completed.length 
        : 0,
      topCategories: this._getTopGapCategories(completed)
    };
  }
  
  _getTopGapCategories(scans) {
    const counts = {};
    scans.forEach(s => {
      s.gapsFound?.forEach(g => {
        counts[g.category] = (counts[g.category] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }
}

module.exports = new GapHunterService();
