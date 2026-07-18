/**
 * Francisco Holdings Inc. - Empire API Routes
 * The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const config = require('../config');
const db = require('../database');

// GET /api/empire/status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Francisco Holdings Inc.',
      tagline: 'The Trillion Dollar Skyscraper',
      totalFloors: config.empire.totalFloors,
      activeFloors: config.empire.activeFloors,
      totalAgents: config.empire.totalAgents,
      gemmaVersion: config.empire.gemmaVersion,
      companies: config.empire.companies,
      colors: config.colors,
      uptime: db.data.metrics.uptime,
      lastUpdated: db.data.metrics.lastUpdated
    },
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/empire/metrics
router.get('/metrics', authenticate, (req, res) => {
  res.json({
    success: true,
    data: db.getMetrics(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/empire/floors
router.get('/floors', (req, res) => {
  const floors = [];
  for (let i = 1; i <= config.empire.totalFloors; i++) {
    const company = config.empire.companies.find(c => c.floor === i);
    floors.push({
      floor: i,
      status: company ? 'active' : 'planned',
      company: company || null,
      revenue: db.data.revenue.byFloor.get(i)?.total || 0
    });
  }
  res.json({
    success: true,
    count: floors.length,
    data: floors,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/empire/companies
router.get('/companies', (req, res) => {
  res.json({
    success: true,
    count: config.empire.companies.length,
    data: config.empire.companies,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/empire/companies/:id
router.get('/companies/:id', (req, res) => {
  const company = config.empire.companies.find(c => c.id === parseInt(req.params.id));
  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: {
      ...company,
      revenue: db.data.revenue.byCompany.get(company.id) || { total: 0 }
    },
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
