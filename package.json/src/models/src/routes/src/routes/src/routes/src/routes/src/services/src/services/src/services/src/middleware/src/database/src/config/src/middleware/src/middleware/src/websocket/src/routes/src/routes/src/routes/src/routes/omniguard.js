/**
 * Francisco Holdings Inc. - OmniGuard API Routes
 * Threat Map, Agent Swarm Defense, Gemma 31B Security
 * Floor 2 - The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const omniGuardService = require('../services/omniguard');

// GET /api/omniguard/threats
router.get('/threats', authenticate, (req, res) => {
  const threats = omniGuardService.getThreats(req.query);
  res.json({
    success: true,
    count: threats.length,
    data: threats,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/omniguard/stats
router.get('/stats', authenticate, (req, res) => {
  res.json({
    success: true,
    data: omniGuardService.getStats(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/omniguard/threat-map
router.get('/threat-map', authenticate, (req, res) => {
  res.json({
    success: true,
    data: omniGuardService.getThreatMap(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/omniguard/defense-status
router.get('/defense-status', authenticate, (req, res) => {
  res.json({
    success: true,
    data: omniGuardService.getAgentDefenseStatus(),
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/omniguard/threats (report new threat)
router.post('/threats', authenticate, (req, res) => {
  const threat = omniGuardService.addThreat(req.body);
  res.status(201).json({
    success: true,
    message: 'Threat logged.',
    data: threat,
    empire: 'Francisco Holdings Inc.'
  });
});

// PUT /api/omniguard/threats/:id/resolve
router.put('/threats/:id/resolve', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  const threat = omniGuardService.resolveThreat(req.params.id, req.body.resolution);
  if (!threat) {
    return res.status(404).json({
      success: false,
      error: 'Threat not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    message: 'Threat resolved.',
    data: threat,
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
