/**
 * Francisco Holdings Inc. - Auth Routes
 * SSO across all 45+ companies
 * The Trillion Dollar Skyscraper
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authService, authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rate-limiter');
const logger = require('../middleware/logger');

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        empire: 'Francisco Holdings Inc.'
      });
    }
    
    const result = await authService.register(req.body);
    logger.info(`New user registered: ${req.body.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Welcome to the Empire. Account created successfully.',
      data: result,
      empire: 'Francisco Holdings Inc.'
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message,
      empire: 'Francisco Holdings Inc.'
    });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        empire: 'Francisco Holdings Inc.'
      });
    }
    
    const result = await authService.login(req.body.email, req.body.password);
    logger.info(`User logged in: ${req.body.email}`);
    
    res.json({
      success: true,
      message: 'Welcome back to the Empire.',
      data: result,
      empire: 'Francisco Holdings Inc.'
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(401).json({
      success: false,
      error: error.message,
      empire: 'Francisco Holdings Inc.'
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user,
    empire: 'Francisco Holdings Inc.'
  });
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const { token } = req.body;
  const decoded = authService.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      valid: false,
      error: 'Token invalid or expired',
      empire: 'Francisco Holdings Inc.'
    });
  }
  
  res.json({
    success: true,
    valid: true,
    data: decoded,
    empire: 'Francisco Holdings Inc.'
  });
});

module.exports = router;
