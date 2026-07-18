/**
 * Francisco Holdings Inc. - Rate Limiter
 * The Trillion Dollar Skyscraper
 */

const rateLimit = require('express-rate-limit');
const config = require('../config');

const standardLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    empire: 'Francisco Holdings Inc.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: 'API rate limit exceeded.',
    empire: 'Francisco Holdings Inc.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
    empire: 'Francisco Holdings Inc.'
  }
});

module.exports = { standardLimiter, apiLimiter, authLimiter };
