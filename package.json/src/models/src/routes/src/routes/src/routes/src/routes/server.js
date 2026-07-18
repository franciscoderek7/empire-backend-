/**
 * JARVIS / EMPIRE OS BACKEND
 * Francisco Holdings Inc. — 392-Floor Agent Swarm Ecosystem
 * Author: Derek Francisco (Doc Weedlaw)
 * Version: 2.0.0 — Phoenix Dominion
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// EMPIRE DATA STORE (In-Memory + File Persistence)
// ============================================================
const DATA_FILE = path.join(__dirname, 'empire-data.json');

let empire = {
  meta: {
    name: "Francisco Holdings Inc.",
    ceo: "Derek Francisco",
    alias: "Doc Weedlaw",
    floorsTotal: 392,
    floorsActive: 47,
    floorsPlanned: 345,
    valuationGoal: 1000000000000,
    founded: "2026-01-01"
  },
  companies: [
    { id: 1, floor: 1, name: "Francisco Holdings Inc.", category: "Holding Company", status: "live", revenue: 187000, agents: 24, color: "#D4AF37" },
    { id: 2, floor: 2, name: "OmniGuard", category: "AI Cybersecurity", status: "live", revenue: 420000, agents: 89, color: "#00D4FF" },
    { id: 3, floor: 3, name: "PrimeDox AI", category: "Legal Technology", status: "live", revenue: 315000, agents: 56, color: "#00FF88" },
    { id: 4, floor: 4, name: "CCLDR", category: "Cannabis Legal & Compliance", status: "live", revenue: 128000, agents: 12, color: "#22C55E" },
    { id: 5, floor: 5, name: "VIGILAX", category: "AI Surveillance & Security", status: "live", revenue: 245000, agents: 34, color: "#A855F7" },
    { id: 6, floor: 6, name: "CleanSwarm", category: "Commercial Cleaning / Facility", status: "live", revenue: 89000, agents: 8, color: "#06B6D4" },
    { id: 7, floor: 7, name: "Kiaros", category: "AI Business Strategy", status: "live", revenue: 156000, agents: 18, color: "#F59E0B" },
    { id: 8, floor: 8, name: "VaultVelocity Auto", category: "Auto Financing / Luxury", status: "live", revenue: 520000, agents: 22, color: "#EF4444" },
    { id: 9, floor: 9, name: "TechPetCage", category: "Pet Technology", status: "live", revenue: 67000, agents: 6, color: "#F97316" },
    { id: 10, floor: 10, name: "Doc Weedlaw", category: "Cannabis Advocacy", status: "live", revenue: 95000, agents: 14, color: "#10B981" },
    { id: 11, floor: 11, name: "BENO-X Institute", category: "Constitutional Defense Research", status: "live", revenue: 45000, agents: 5, color: "#6366F1" },
    { id: 12, floor: 12, name: "Agent Swarm Tech", category: "AI Agent Automation", status: "live", revenue: 380000, agents: 67, color: "#EC4899" },
    { id: 13, floor: 13, name: "AgentForge", category: "AI Agent SaaS Development", status: "live", revenue: 275000, agents: 45, color: "#8B5CF6" },
    { id: 14, floor: 14, name: "AI Governance Canada", category: "AI Policy & Compliance", status: "live", revenue: 112000, agents: 9, color: "#14B8A6" },
    { id: 15, floor: 15, name: "Constitutional Defense Labs", category: "Constitutional Law Technology", status: "live", revenue: 78000, agents: 7, color: "#84CC16" },
    { id: 16, floor: 16, name: "Canna-Deliver", category: "Cannabis Delivery", status: "live", revenue: 134000, agents: 11, color: "#22C55E" },
    { id: 17, floor: 17, name: "SoulStack", category: "AI Brand Reputation", status: "live", revenue: 198000, agents: 19, color: "#F43F5E" },
    { id: 18, floor: 18, name: "ZPrimeDox AI HQ", category: "AI Command Center", status: "live", revenue: 445000, agents: 78, color: "#D946EF" },
    { id: 19, floor: 19, name: "Francisco Realty", category: "Real Estate & Property", status: "development", revenue: 0, agents: 0, color: "#EAB308" },
    { id: 20, floor: 20, name: "Francisco Legal", category: "Legal Services", status: "development", revenue: 0, agents: 0, color: "#3B82F6" }
  ],
  agents: {
    total: 312,
    active: 298,
    idle: 14,
    byCompany: {}
  },
  revenue: {
    mtd: 28743159,
    target: 100000000,
    byTier: { basic: 84500, pro: 189000, enterprise: 15000, government: 0 },
    trajectory: [12000, 18500, 24000, 32000, 41000, 48000, 52000, 61000, 72000, 85000, 92000, 98000]
  },
  threats: {
    total: 247,
    critical: 3,
    high: 12,
    medium: 45,
    low: 187,
    blocked: 12847
  },
  gapHunter: {
    scanned: 80,
    leads: 0,
    pipeline: 0,
    targets: [
      { url: "sentinelone.com", score: 70, gaps: ["No privacy policy", "No compliance certs", "No MFA/2FA"], value: 2840, stage: "Found" },
      { url: "crowdstrike.com", score: 75, gaps: ["No HTTPS/SSL", "No privacy policy", "No MFA/2FA"], value: 2840, stage: "Found" },
      { url: "logrhythm.com", score: 75, gaps: ["No HTTPS/SSL", "No privacy policy", "No MFA/2FA"], value: 2840, stage: "Found" }
    ]
  },
  jarvis: {
    automations: [],
    outreachQueue: [],
    templates: {
      cybersecurity: "I scanned your perimeter. You have {gaps} gaps. I can fix them in 48 hours. $499/mo. 100+ hours saved.",
      legal: "Your contracts are costing you {hours} hours/month. PrimeDox AI generates them in 30 seconds. $299/mo.",
      surveillance: "Your cameras record but don't think. VIGILAX AI detects threats before they become incidents. $199/mo."
    }
  },
  primedox: {
    documentsGenerated: 1247,
    templates: ["Contract", "NDA", "Lease Agreement", "Employment Contract", "Service Agreement", "Affidavit", "Motion", "Letter"],
    queue: []
  },
  omniguard: {
    status: "SECURE",
    uptime: 99.98,
    activeNodes: 7392,
    threatsBlocked: 12847,
    threatLevel: "NONE"
  },
  lobby: {
    instruments: [
      { type: "Grand Piano", status: "playing", piece: "Nocturne in E-flat", avatar: "pianist-01" },
      { type: "Violin", status: "ready", piece: null, avatar: null },
      { type: "Cello", status: "ready", piece: null, avatar: null },
      { type: "Saxophone", status: "ready", piece: null, avatar: null },
      { type: "Jazz Drums", status: "ready", piece: null, avatar: null }
    ],
    avatars: 12,
    guests: 3
  },
  humanQueue: [
    { id: 1, title: "Cannabis Compliance Review", priority: "HIGH", floor: 12, company: "Doc Weedlaw Inc.", time: "2 min ago", action: "review" },
    { id: 2, title: "20% Discount Request", priority: "MEDIUM", floor: 23, company: "PrimeDox Solutions", time: "5 min ago", action: "approve" },
    { id: 3, title: "Threat Escalation", priority: "HIGH", floor: 7, company: "External Actor Detected", time: "8 min ago", action: "escalate" }
  ]
};

// Load persisted data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    empire = { ...empire, ...saved };
  } catch (e) {
    console.log('⚠️ Could not load saved data, using defaults');
  }
}

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(empire, null, 2));
};

// ============================================================
// API ROUTES — EMPIRE OS
// ============================================================

// Health / Status
app.get('/api/status', (req, res) => {
  res.json({
    status: "OPERATIONAL",
    system: "Empire OS v2.0",
    timestamp: new Date().toISOString(),
    ceo: empire.meta.ceo,
    floors: `${empire.meta.floorsActive}/${empire.meta.floorsTotal}`,
    agents: empire.agents.active,
    revenue: empire.revenue.mtd
  });
});

// Empire Overview
app.get('/api/empire/overview', (req, res) => {
  res.json({
    meta: empire.meta,
    metrics: {
      companies: empire.companies.length,
      liveFloors: empire.meta.floorsActive,
      activeAgents: empire.agents.active,
      totalRevenue: empire.revenue.mtd,
      valuationProgress: (empire.revenue.mtd / empire.meta.valuationGoal * 100).toFixed(8),
      threats: empire.threats.total,
      documentsGenerated: empire.primedox.documentsGenerated
    }
  });
});

// All Companies / Floors
app.get('/api/companies', (req, res) => {
  res.json(empire.companies);
});

app.get('/api/companies/:id', (req, res) => {
  const company = empire.companies.find(c => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).json({ error: "Company not found" });
  res.json(company);
});

// Agent Swarm
app.get('/api/agents', (req, res) => {
  res.json({
    swarm: empire.agents,
    byCompany: empire.companies.map(c => ({
      name: c.name,
      floor: c.floor,
      agents: c.agents,
      status: c.status
    }))
  });
});

// Revenue Command Center
app.get('/api/revenue', (req, res) => {
  res.json(empire.revenue);
});

// Threat Monitor (OmniGuard)
app.get('/api/omniguard/status', (req, res) => {
  res.json(empire.omniguard);
});

app.get('/api/omniguard/threats', (req, res) => {
  res.json({
    summary: empire.threats,
    realtime: Array.from({ length: 20 }, (_, i) => ({
      id: `THREAT-${1000 + i}`,
      level: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)],
      source: ['External IP', 'Bot Net', 'Phishing', 'DDoS', 'Insider'][Math.floor(Math.random() * 5)],
      blocked: Math.random() > 0.3,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }))
  });
});

// ============================================================
// API ROUTES — GAP HUNTER
// ============================================================

app.get('/api/gap-hunter/targets', (req, res) => {
  res.json(empire.gapHunter.targets);
});

app.post('/api/gap-hunter/scan', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });
  
  const score = Math.floor(Math.random() * 40) + 40;
  const gaps = [];
  if (Math.random() > 0.5) gaps.push("No HTTPS/SSL");
  if (Math.random() > 0.5) gaps.push("No privacy policy");
  if (Math.random() > 0.5) gaps.push("No MFA/2FA mention");
  if (Math.random() > 0.7) gaps.push("No compliance certs");
  
  const target = {
    url,
    score,
    gaps,
    value: score * 40 + Math.floor(Math.random() * 1000),
    stage: "Found",
    scannedAt: new Date().toISOString()
  };
  
  empire.gapHunter.targets.push(target);
  empire.gapHunter.scanned++;
  saveData();
  
  res.json({ success: true, target });
});

app.post('/api/gap-hunter/add-lead', (req, res) => {
  const { url, email } = req.body;
  empire.gapHunter.leads++;
  empire.gapHunter.pipeline += Math.floor(Math.random() * 5000) + 1000;
  saveData();
  res.json({ success: true, message: `Lead added for ${url}` });
});

// ============================================================
// API ROUTES — JARVIS AUTOMATION ENGINE
// ============================================================

app.get('/api/jarvis/status', (req, res) => {
  res.json({
    status: "ONLINE",
    automationsRunning: empire.jarvis.automations.length,
    outreachPending: empire.jarvis.outreachQueue.length,
    templates: Object.keys(empire.jarvis.templates)
  });
});

app.post('/api/jarvis/automate', (req, res) => {
  const { companyName, industry, gaps, email } = req.body;
  
  const automation = {
    id: `AUTO-${Date.now()}`,
    companyName,
    industry,
    gaps,
    targetEmail: email,
    status: "running",
    createdAt: new Date().toISOString(),
    steps: [
      { step: 1, name: "Research", status: "complete", detail: `Analyzed ${companyName} website` },
      { step: 2, name: "Gap Analysis", status: "complete", detail: `Found ${gaps.length} critical gaps` },
      { step: 3, name: "Proposal Generation", status: "running", detail: "Drafting custom solution..." },
      { step: 4, name: "Outreach", status: "pending", detail: "Queueing personalized email" },
      { step: 5, name: "Follow-up", status: "pending", detail: "Scheduled for +48 hours" }
    ]
  };
  
  empire.jarvis.automations.push(automation);
  saveData();
  
  res.json({ success: true, automation });
});

app.post('/api/jarvis/outreach', (req, res) => {
  const { to, company, template, customMessage } = req.body;
  
  const outreach = {
    id: `EMAIL-${Date.now()}`,
    to,
    company,
    template,
    message: customMessage || empire.jarvis.templates[template] || "Custom outreach",
    status: "sent",
    sentAt: new Date().toISOString()
  };
  
  empire.jarvis.outreachQueue.push(outreach);
  saveData();
  
  // Simulate n8n webhook trigger
  console.log(`📧 JARVIS OUTREACH: ${to} | ${company} | Template: ${template}`);
  
  res.json({ success: true, outreach });
});

// ============================================================
// API ROUTES — PRIMEDOX AI
// ============================================================

app.get('/api/primedox/status', (req, res) => {
  res.json({
    status: "ONLINE",
    documentsGenerated: empire.primedox.documentsGenerated,
    templates: empire.primedox.templates,
    queueLength: empire.primedox.queue.length
  });
});

app.post('/api/primedox/generate', (req, res) => {
  const { template, fields, parties } = req.body;
  
  const doc = {
    id: `DOC-${Date.now()}`,
    template,
    fields,
    parties,
    status: "generated",
    generatedAt: new Date().toISOString(),
    downloadUrl: `/api/primedox/download/${Date.now()}`
  };
  
  empire.primedox.documentsGenerated++;
  empire.primedox.queue.push(doc);
  saveData();
  
  res.json({ success: true, document: doc });
});

// ============================================================
// API ROUTES — LOBBY / 3D EXPERIENCE
// ============================================================

app.get('/api/lobby/status', (req, res) => {
  res.json(empire.lobby);
});

app.get('/api/lobby/instruments', (req, res) => {
  res.json(empire.lobby.instruments);
});

app.post('/api/lobby/instrument/play', (req, res) => {
  const { instrument, piece } = req.body;
  const inst = empire.lobby.instruments.find(i => i.type === instrument);
  if (inst) {
    inst.status = "playing";
    inst.piece = piece;
    saveData();
  }
  res.json({ success: true, instrument: inst });
});

// ============================================================
// API ROUTES — HUMAN-IN-THE-LOOP
// ============================================================

app.get('/api/human-queue', (req, res) => {
  res.json(empire.humanQueue);
});

app.post('/api/human-queue/:id/action', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const item = empire.humanQueue.find(q => q.id === parseInt(id));
  if (!item) return res.status(404).json({ error: "Queue item not found" });
  
  item.resolved = true;
  item.resolvedAt = new Date().toISOString();
  item.resolution = action;
  
  saveData();
  res.json({ success: true, item });
});

// ============================================================
// WEBSOCKET-SIMULATION (Long Polling Fallback)
// ============================================================

app.get('/api/stream/empire', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const interval = setInterval(() => {
    const update = {
      timestamp: Date.now(),
      agents: empire.agents.active + Math.floor(Math.random() * 5),
      revenue: empire.revenue.mtd + Math.floor(Math.random() * 1000),
      threats: empire.threats.total
    };
    res.write(`data: ${JSON.stringify(update)}\n\n`);
  }, 5000);
  
  req.on('close', () => clearInterval(interval));
});

// ============================================================
// CATCH-ALL — SERVE THE 3D SKYSCRAPER APP
// ============================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🏛️  FRANCISCO HOLDINGS INC. — EMPIRE OS v2.0              ║
║                                                              ║
║   👑 CEO: Derek Francisco (Doc Weedlaw)                     ║
║   🏢 Floors: ${empire.meta.floorsActive.toString().padStart(3)}/392 Active                             ║
║   🤖 Agents: ${empire.agents.active.toString().padStart(3)} Online                               ║
║   💰 Revenue: $${empire.revenue.mtd.toLocaleString()} MTD                        ║
║                                                              ║
║   🔗 API Endpoints:                                          ║
║   → /api/status           → /api/empire/overview            ║
║   → /api/companies        → /api/agents                     ║
║   → /api/revenue          → /api/omniguard/*                ║
║   → /api/gap-hunter/*     → /api/jarvis/*                   ║
║   → /api/primedox/*       → /api/lobby/*                    ║
║                                                              ║
║   🚀 Server running on port ${PORT}                            ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
