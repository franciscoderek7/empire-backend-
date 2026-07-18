/**
 * Francisco Holdings Inc. - PrimeDox AI API Routes
 * Document Generator, Litigation Tracker, Cases
 * Floor 3 - The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const primeDoxService = require('../services/primedox');

// GET /api/primedox/documents
router.get('/documents', authenticate, (req, res) => {
  const docs = primeDoxService.getDocuments(req.query);
  res.json({
    success: true,
    count: docs.length,
    data: docs,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/primedox/documents/:id
router.get('/documents/:id', authenticate, (req, res) => {
  const doc = primeDoxService.getDocument(req.params.id);
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: 'Document not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: doc,
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/primedox/documents
router.post('/documents', authenticate, (req, res) => {
  const doc = primeDoxService.createDocument(req.body);
  res.status(201).json({
    success: true,
    message: 'Document queued for generation.',
    data: doc,
    empire: 'Francisco Holdings Inc.'
  });
});

// PUT /api/primedox/documents/:id/status
router.put('/documents/:id/status', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  const doc = primeDoxService.updateStatus(req.params.id, req.body.status, req.body.processingTime);
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: 'Document not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    message: 'Document status updated.',
    data: doc,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/primedox/queue
router.get('/queue', authenticate, (req, res) => {
  res.json({
    success: true,
    data: primeDoxService.getQueue(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/primedox/litigation
router.get('/litigation', authenticate, (req, res) => {
  res.json({
    success: true,
    data: primeDoxService.getLitigation(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/primedox/litigation/:id
router.get('/litigation/:id', authenticate, (req, res) => {
  const lit = primeDoxService.getLitigationById(req.params.id);
  if (!lit) {
    return res.status(404).json({
      success: false,
      error: 'Litigation case not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: lit,
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/primedox/litigation/:id/notes
router.post('/litigation/:id/notes', authenticate, (req, res) => {
  const lit = primeDoxService.addLitigationNote(req.params.id, req.body.note);
  if (!lit) {
    return res.status(404).json({
      success: false,
      error: 'Litigation case not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    message: 'Note added.',
    data: lit,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/primedox/templates
router.get('/templates', authenticate, (req, res) => {
  res.json({
    success: true,
    data: primeDoxService.getTemplates(),
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
