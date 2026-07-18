/**
 * Francisco Holdings Inc. - Agent Swarm API Routes
 * 12,847 AI Agents | Gemma 31B Orchestration
 * The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const agentSwarmService = require('../services/agent-swarm');

// GET /api/agents/status
router.get('/status', authenticate, (req, res) => {
  res.json({
    success: true,
    data: agentSwarmService.getStatus(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/agents
router.get('/', authenticate, (req, res) => {
  const agents = agentSwarmService.getAgents(req.query);
  res.json({
    success: true,
    count: agents.length,
    data: agents,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/agents/:id
router.get('/:id', authenticate, (req, res) => {
  const agent = agentSwarmService.getAgent(req.params.id);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    data: agent,
    empire: 'Francisco Holdings Inc.'
  });
});

// PUT /api/agents/:id/status
router.put('/:id/status', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  const agent = agentSwarmService.updateAgent(req.params.id, req.body);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found',
      empire: 'Francisco Holdings Inc.'
    });
  }
  res.json({
    success: true,
    message: 'Agent status updated.',
    data: agent,
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/agents/dispatch
router.post('/dispatch', authenticate, authorize(['admin', 'superadmin']), (req, res) => {
  const result = agentSwarmService.dispatchTask(req.body);
  res.json({
    success: result.success,
    message: result.success ? 'Task dispatched successfully.' : result.error,
    data: result,
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/agents/gemma/status
router.get('/gemma/status', authenticate, (req, res) => {
  res.json({
    success: true,
    data: agentSwarmService.getGemmaStatus(),
    empire: 'Francisco Holdings Inc.'
  });
});

// GET /api/agents/metrics
router.get('/metrics', authenticate, (req, res) => {
  res.json({
    success: true,
    data: agentSwarmService.getMetrics(),
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
