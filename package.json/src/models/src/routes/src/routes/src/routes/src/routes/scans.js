/**
 * Empire Scans Routes
 * Francisco Holdings Inc. — Gap Hunter Market Intelligence
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../models/database');

const router = express.Router();

// Create new scan
router.post('/', async (req, res) => {
  try {
    const { targetUrl, scanType = 'market-analysis' } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: 'Target URL required' });
    }

    const scanId = uuidv4();

    await run(
      'INSERT INTO scans (scan_id, target_url, scan_type, status) VALUES (?, ?, ?, ?)',
      [scanId, targetUrl, scanType, 'pending']
    );

    res.status(201).json({
      message: 'Gap Hunter scan initiated',
      scanId,
      target: targetUrl,
      type: scanType,
      status: 'pending'
    });

  } catch (err) {
    console.error('Scan creation error:', err);
    res.status(500).json({ error: 'Failed to create scan' });
  }
});

// Get all scans
router.get('/', async (req, res) => {
  try {
    const scans = await all('SELECT * FROM scans ORDER BY created_at DESC');
    res.json({ scans, count: scans.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

// Get scan by ID
router.get('/:scanId', async (req, res) => {
  try {
    const scan = await get('SELECT * FROM scans WHERE scan_id = ?', [req.params.scanId]);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json({ scan });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scan' });
  }
});

// Update scan results
router.put('/:scanId/results', async (req, res) => {
  try {
    const { results, status = 'completed' } = req.body;

    await run(
      'UPDATE scans SET results = ?, status = ? WHERE scan_id = ?',
      [JSON.stringify(results), status, req.params.scanId]
    );

    res.json({
      message: 'Scan results updated',
      scanId: req.params.scanId,
      status
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update scan' });
  }
});

module.exports = router;
