/**
 * Francisco Holdings Inc. - Gap Hunter Pro API Routes
 * Scan 100 companies, find gaps, fill gaps, solve
 * The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const gapHunterService = require('../services/gap-hunter');

// POST /api/gaphunter/scan
router.post('/scan', authenticate, (req, res) => {
  const scan = gapHunterService.scanCompanies(req.body.companies, req.body.industry);
  res.status(202).json({
    success: true,
    message: 'Gap scan initiated. Monitor via WebSocket or GET /api/gaphunter/scans.',
    data: scan,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/gaphunter/scans
router.get('/scans', authenticate, (req, res) => {
  res.json({
    success: true,
    data: gapHunterService.getScans(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/gaphunter/scans/:id
router.get('/scans/:id', authenticate, (req, res) => {
  const scan = gapHunterService.getScan(req.params.id);
  if (!scan) {
    return res.status(404).json({
      success: false,
      error: 'Scan not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: scan,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/gaphunter/stats
router.get('/stats', authenticate, (req, res) => {
  res.json({
    success: true,
    data: gapHunterService.getGapStats(),
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
