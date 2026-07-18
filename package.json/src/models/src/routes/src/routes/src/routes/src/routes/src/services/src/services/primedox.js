/**
 * Francisco Holdings Inc. - PrimeDox AI Service
 * Document Generator, Litigation Tracker, Cases
 * Floor 3 - The Trillion Dollar Skyscraper
 */

const db = require('../database');

class PrimeDoxService {
  constructor() {
    this.subscribers = new Set();
    this.docTypes = ['motion', 'affidavit', 'contract', 'letter', 'research', 'brief', 'notice', 'appeal'];
    this._startDocProcessingSimulation();
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  _notify(data) {
    this.subscribers.forEach(cb => {
      try { cb(data); } catch (e) { console.error('PrimeDox subscriber error:', e); }
    });
  }
  
  createDocument(docData) {
    const doc = db.addDocument({
      type: docData.type,
      title: docData.title,
      status: 'pending',
      priority: docData.priority || 'normal',
      floor: docData.floor || 3,
      companyId: docData.companyId || 3,
      litigationId: docData.litigationId,
      content: docData.content || '',
      metadata: docData.metadata || {}
    });
    
    this._notify({ type: 'document_created', data: doc });
    return doc;
  }
  
  getDocuments(filters = {}) { return db.getDocuments(filters); }
  getDocument(id) { return db.data.documents.find(d => d.id === id); }
  
  updateStatus(id, status, processingTime = null) {
    const doc = db.updateDocumentStatus(id, status, processingTime);
    if (doc) this._notify({ type: 'document_updated', data: doc });
    return doc;
  }
  
  getQueue() { return db.getDocQueue(); }
  getLitigation() { return db.getLitigation(); }
  getLitigationById(id) { return db.getLitigationById(id); }
  
  addLitigationNote(litigationId, note) {
    const lit = db.getLitigationById(litigationId);
    if (!lit) return null;
    if (!lit.notes) lit.notes = [];
    lit.notes.push({
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: note,
      author: 'PrimeDox AI'
    });
    this._notify({ type: 'litigation_updated', data: lit });
    return lit;
  }
  
  getTemplates() {
    return [
      { id: 'motion', name: 'Notice of Motion', category: 'court', floor: 3 },
      { id: 'affidavit', name: 'Affidavit', category: 'court', floor: 3 },
      { id: 'contract', name: 'Service Agreement', category: 'commercial', floor: 3 },
      { id: 'letter', name: 'Demand Letter', category: 'correspondence', floor: 3 },
      { id: 'research', name: 'Legal Research Memo', category: 'research', floor: 3 },
      { id: 'brief', name: 'Factum / Brief', category: 'court', floor: 3 },
      { id: 'notice', name: 'Notice of Claim', category: 'court', floor: 3 },
      { id: 'appeal', name: 'Notice of Appeal', category: 'appeal', floor: 3 }
    ];
  }
  
  _startDocProcessingSimulation() {
    setInterval(() => {
      const pending = db.getDocuments({ status: 'pending' });
      if (pending.length > 0 && Math.random() > 0.5) {
        const doc = pending[0];
        const processingTime = Math.floor(Math.random() * 5000) + 1000;
        db.updateDocumentStatus(doc.id, 'processing');
        this._notify({ type: 'document_processing', data: doc });
        
        setTimeout(() => {
          db.updateDocumentStatus(doc.id, 'completed', processingTime);
          this._notify({ type: 'document_completed', data: doc });
        }, processingTime);
      }
    }, 4000);
  }
}

module.exports = new PrimeDoxService();
