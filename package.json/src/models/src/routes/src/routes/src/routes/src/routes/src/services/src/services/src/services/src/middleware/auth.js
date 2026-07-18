/**
 * Francisco Holdings Inc. - Authentication Middleware
 * SSO across all 45+ companies
 * The Trillion Dollar Skyscraper
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const config = require('../config');

class AuthService {
  async hashPassword(password) {
    return bcrypt.hash(password, config.jwt.bcryptRounds);
  }
  
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        permissions: user.permissions,
        authorizedSites: user.authorizedSites
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return null;
    }
  }
  
  async register(userData) {
    const existing = db.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await this.hashPassword(userData.password);
    const user = db.createUser({
      ...userData,
      password: hashedPassword
    });
    
    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }
  
  async login(email, password) {
    const user = db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const valid = await this.comparePassword(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    
    user.lastLogin = new Date().toISOString();
    user.loginHistory.push({
      timestamp: new Date().toISOString(),
      ip: 'recorded'
    });
    
    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }
  
  sanitizeUser(user) {
    const { password, ...safe } = user;
    return safe;
  }
}

const authService = new AuthService();

// Express middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.',
      empire: 'Francisco Holdings Inc.'
    });
  }
  
  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
      empire: 'Francisco Holdings Inc.'
    });
  }
  
  req.user = decoded;
  next();
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated.',
        empire: 'Francisco Holdings Inc.'
      });
    }
    
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.',
        required: roles,
        empire: 'Francisco Holdings Inc.'
      });
    }
    
    next();
  };
};

module.exports = { authService, authenticate, authorize };
