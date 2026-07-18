/**
 * Francisco Holdings Inc. - Database Seeder
 * Initialize empire with Derek's admin account and sample data
 * The Trillion Dollar Skyscraper
 */

const db = require('../src/database');
const { authService } = require('../src/middleware/auth');

async function seed() {
  console.log('🌱 Seeding Francisco Holdings Empire Database...');
  
  // Create Derek's admin account
  try {
    const admin = await authService.register({
      email: 'franciscoderek7@gmail.com',
      password: 'YOUR_SECURE_PASSWORD_HERE',
      firstName: 'Derek',
      lastName: 'Francisco',
      role: 'superadmin',
      permissions: ['read', 'write', 'admin', 'superadmin'],
      authorizedSites: ['all']
    });
    
    console.log('✅ Admin created:', admin.user.email);
    console.log('✅ Token:', admin.token);
  } catch (error) {
    console.log('⚠️ Admin already exists or error:', error.message);
  }
  
  // Seed initial revenue
  db.recordTransaction({
    amount: 49900,
    currency: 'CAD',
    floor: 3,
    companyId: 3,
    companyName: 'PrimeDox AI',
    source: 'subscription',
    description: 'Enterprise AI subscription - initial seed',
    customerId: 'customer_seed_001',
    status: 'completed',
    metadata: { seeded: true }
  });
  
  console.log('✅ Initial revenue seeded');
  
  // Seed some threats
  db.addThreat({
    severity: 'medium',
    type: 'Bot Attack',
    source: '192.168.1.1',
    target: 'floor_3',
    description: 'Initial seed threat - Bot Attack detected',
    status: 'blocked',
    blocked: true,
    agentId: 'agent_00001',
    metadata: { seeded: true }
  });
  
  console.log('✅ Initial threat seeded');
  
  // Seed a document
  db.addDocument({
    type: 'motion',
    title: 'Notice of Motion - Leave to Add Defendant',
    status: 'completed',
    priority: 'high',
    floor: 3,
    companyId: 3,
    litigationId: 'CV-26-00000064-0000',
    content: 'Motion for leave to add 2413319 Ontario Inc. as Defendant 6...',
    metadata: { case: 'Denby', seeded: true }
  });
  
  console.log('✅ Initial document seeded');
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  🏗️ EMPIRE DATABASE SEEDED SUCCESSFULLY                    ║');
  console.log('║  Ready for domination.                                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
}

seed().catch(console.error);
