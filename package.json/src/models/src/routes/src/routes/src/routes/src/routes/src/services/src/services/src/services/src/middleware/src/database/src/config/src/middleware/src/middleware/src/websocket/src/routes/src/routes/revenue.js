/**
 * Francisco Holdings Inc. - Revenue API Routes
 * Every penny, every floor, real-time
 * The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rate-limiter');
const revenueService = require('../services/revenue');
const logger = require('../middleware/logger');

// GET /api/revenue/summary
router.get('/summary', authenticate, (req, res) => {
  const summary = revenueService.getSummary();
  res.json({
    success: true,
    data: summary,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/revenue/floor/:floor
router.get('/floor/:floor', authenticate, (req, res) => {
  const floor = revenueService.getByFloor(req.params.floor);
  if (!floor) {
    return res.status(404).json({
      success: false,
      error: 'Floor not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: floor,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/revenue/company/:companyId
router.get('/company/:companyId', authenticate, (req, res) => {
  const company = revenueService.getByCompany(req.params.companyId);
  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: company,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/revenue/top-floors
router.get('/top-floors', authenticate, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const top = revenueService.getTopFloors(limit);
  res.json({
    success: true,
    data: top,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/revenue/hourly-trend
router.get('/hourly-trend', authenticate, (req, res) => {
  const trend = revenueService.getHourlyTrend();
  res.json({
    success: true,
    data: trend,
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/revenue/transaction (admin only)
router.post('/transaction', authenticate, authorize(['admin', 'superadmin']), apiLimiter, (req, res) => {
  try {
    const tx = revenueService.recordTransaction(req.body);
    logger.info(`Transaction recorded: ${tx.amount} CAD on Floor ${tx.floor}`);
    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully.',
      data: tx,
      empire: 'Francisco Holdings Inc.'
    });
  } catch (error) {
    logger.error(`Transaction failed: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message,
      empire: 'Francisco Holdings Inc.'
    });
  }
});

module.exports = router;
