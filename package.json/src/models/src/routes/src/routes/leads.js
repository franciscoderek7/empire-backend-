/**
 * Empire Leads Routes
 * Francisco Holdings Inc. — Lead Capture for All 45+ Companies
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../models/database');

const router = express.Router();

// Create new lead (from any floor contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, floor, message, source = 'website' } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const uuid = uuidv4();
    const result = await run(
      'INSERT INTO leads (uuid, name, email, phone, company, floor, message, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid, name, email, phone || null, company || null, floor || null, message || null, source]
    );

    res.status(201).json({
      message: 'Lead captured for the Empire',
      leadId: uuid,
      floor: floor || 'general'
    });

  } catch (err) {
    console.error('Lead capture error:', err);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// Get all leads (admin view)
router.get('/', async (req, res) => {
  try {
    const leads = await all('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ leads, count: leads.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get leads by floor
router.get('/floor/:floor', async (req, res) => {
  try {
    const floor = parseInt(req.params.floor);
    const leads = await all('SELECT * FROM leads WHERE floor = ? ORDER BY created_at DESC', [floor]);
    res.json({ floor, leads, count: leads.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch floor leads' });
  }
});

// Get single lead by UUID
router.get('/:uuid', async (req, res) => {
  try {
    const lead = await get('SELECT * FROM leads WHERE uuid = ?', [req.params.uuid]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ lead });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Update lead status
router.put('/:uuid/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await run('UPDATE leads SET status = ? WHERE uuid = ?', [status, req.params.uuid]);
    res.json({ message: 'Lead status updated', status });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

module.exports = router;
