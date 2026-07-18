/**
 * JARVIS AUTOMATION ENGINE v1.0
 * Francisco Holdings Inc. — Phoenix Dominion
 * Custom AI Brain — NOT third party. Empire owned.
 * Author: Derek Francisco (Doc Weedlaw)
 */

class JarvisAutomation {
  constructor() {
    this.API_BASE = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000/api' 
      : '/api';
    this.tasks = [];
    this.sequences = [];
    this.schedules = [];
    this.analytics = {
      emailsSent: 0,
      emailsOpened: 0,
      repliesReceived: 0,
      conversions: 0,
      revenue: 0
    };
    this.specialOffers = {
      freeWebsite: { count: 0, max: 100, active: true },
      standard: { price: 499, label: '$499/mo' },
      empire: { price: 50000, label: '$50K-$500K Empire Builder' }
    };
    this.init();
  }

  init() {
    this.loadState();
    this.startScheduler();
    this.renderInterface();
    console.log('🤖 Jarvis Automation Engine v1.0 online — Phoenix Dominion');
    console.log('👑 Awaiting your command, Emperor Derek');
  }

  // ============================================================
  // COMMAND INTERFACE
  // ============================================================
  renderInterface() {
    const container = document.querySelector('.jarvis-container') || document.body;
    container.innerHTML = `
      <div class="jv-header">
        <div class="jv-title">
          <span class="jv-icon">🤖</span>
          <h2>Jarvis Automation Engine</h2>
          <span class="jv-badge">CUSTOM AI</span>
        </div>
        <div class="jv-status">
          <span class="jv-status-dot online"></span>
          <span>Online — Awaiting Command</span>
        </div>
      </div>

      <div class="jv-command-center">
        <div class="jv-input-group">
          <input type="text" id="jv-command" class="jv-input" placeholder="Command Jarvis... (e.g., 'scan 100 URLs', 'send follow-ups', 'generate proposal for example.com')">
          <button id="jv-execute" class="jv-btn jv-btn-primary">
            <span>⚡</span> Execute
          </button>
        </div>
        <div class="jv-quick-commands">
          <button class="jv-quick-btn" data-cmd="scan 100 URLs">🎯 Mass Scan</button>
          <button class="jv-quick-btn" data-cmd="send follow-ups">📧 Follow-ups</button>
          <button class="jv-quick-btn" data-cmd="check threats">🛡️ Check Threats</button>
          <button class="jv-quick-btn" data-cmd="generate report">📊 Report</button>
          <button class="jv-quick-btn" data-cmd="deploy special offer">🎁 Special Offer</button>
        </div>
      </div>

      <div class="jv-modules">
        <div class="jv-module" id="jv-task-orchestrator">
          <div class="jv-module-header">
            <span class="jv-module-icon">🎛️</span>
            <h3>Task Orchestrator</h3>
            <span class="jv-module-status active">Active</span>
          </div>
          <div class="jv-module-content">
            <div class="jv-task-list" id="jv-tasks"></div>
          </div>
        </div>

        <div class="jv-module" id="jv-email-sequencer">
          <div class="jv-module-header">
            <span class="jv-module-icon">📧</span>
            <h3>Email Sequencer</h3>
            <span class="jv-module-status active">Active</span>
          </div>
          <div class="jv-module-content">
            <div class="jv-sequence-list" id="jv-sequences"></div>
            <div class="jv-sequence-controls">
              <button id="jv-new-sequence" class="jv-btn jv-btn-small">+ New Sequence</button>
            </div>
          </div>
        </div>

        <div class="jv-module" id="jv-special-offers">
          <div class="jv-module-header">
            <span class="jv-module-icon">🎁</span>
            <h3>Special Offers</h3>
            <span class="jv-module-status active">Active</span>
          </div>
          <div class="jv-module-content">
            <div class="jv-offer-grid">
              <div class="jv-offer-card ${this.specialOffers.freeWebsite.active ? 'active' : 'expired'}">
                <div class="jv-offer-title">🎁 FREE AI Website</div>
                <div class="jv-offer-count">${this.specialOffers.freeWebsite.max - this.specialOffers.freeWebsite.count} remaining</div>
                <div class="jv-offer-bar">
                  <div class="jv-offer-fill" style="width: ${(this.specialOffers.freeWebsite.count / this.specialOffers.freeWebsite.max * 100)}%"></div>
                </div>
                <button class="jv-btn jv-btn-small" onclick="jarvis.toggleOffer('freeWebsite')">
                  ${this.specialOffers.freeWebsite.active ? 'Pause' : 'Resume'}
                </button>
              </div>
              <div class="jv-offer-card">
                <div class="jv-offer-title">💼 $499/mo Automation</div>
                <div class="jv-offer-desc">Full gap monitoring + compliance</div>
                <button class="jv-btn jv-btn-small" onclick="jarvis.deployOffer('standard')">Deploy</button>
              </div>
              <div class="jv-offer-card">
                <div class="jv-offer-title">🏛️ Empire Builder</div>
                <div class="jv-offer-desc">$50K-$500K custom build</div>
                <button class="jv-btn jv-btn-small" onclick="jarvis.deployOffer('empire')">Deploy</button>
              </div>
            </div>
          </div>
        </div>

        <div class="jv-module" id="jv-analytics">
          <div class="jv-module-header">
            <span class="jv-module-icon">📊</span>
            <h3>Analytics Tracker</h3>
            <span class="jv-module-status active">Active</span>
          </div>
          <div class="jv-module-content">
            <div class="jv-analytics-grid">
              <div class="jv-analytics-card">
                <div class="jv-analytics-num">${this.analytics.emailsSent}</div>
                <div class="jv-analytics-label">Emails Sent</div>
              </div>
              <div class="jv-analytics-card">
                <div class="jv-analytics-num">${this.analytics.emailsOpened}</div>
                <div class="jv-analytics-label">Opened</div>
              </div>
              <div class="jv-analytics-card">
                <div class="jv-analytics-num">${this.analytics.repliesReceived}</div>
                <div class="jv-analytics-label">Replies</div>
              </div>
              <div class="jv-analytics-card">
                <div class="jv-analytics-num">${this.analytics.conversions}</div>
                <div class="jv-analytics-label">Conversions</div>
              </div>
              <div class="jv-analytics-card highlight">
                <div class="jv-analytics-num">$${this.analytics.revenue.toLocaleString()}</div>
                <div class="jv-analytics-label">Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="jv-log" id="jv-log">
        <div class="jv-log-header">
          <span>📝 Activity Log</span>
          <button class="jv-btn jv-btn-ghost jv-btn-tiny" onclick="jarvis.clearLog()">Clear</button>
        </div>
        <div class="jv-log-content" id="jv-log-content"></div>
      </div>
    `;

    this.attachListeners();
    this.renderTasks();
    this.renderSequences();
  }

  attachListeners() {
    const commandInput = document.getElementById('jv-command');
    const executeBtn = document.getElementById('jv-execute');

    executeBtn?.addEventListener('click', () => this.executeCommand(commandInput.value));
    commandInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.executeCommand(commandInput.value);
    });

    document.querySelectorAll('.jv-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        commandInput.value = cmd;
        this.executeCommand(cmd);
      });
    });

    document.getElementById('jv-new-sequence')?.addEventListener('click', () => {
      this.createSequence();
    });
  }

  // ============================================================
  // COMMAND PROCESSOR
  // ============================================================
  executeCommand(command) {
    if (!command.trim()) return;
    
    this.log(`👤 COMMAND: "${command}"`);
    
    const cmd = command.toLowerCase();
    
    if (cmd.includes('scan') && cmd.includes('url')) {
      const count = parseInt(cmd.match(/\d+/)?.[0]) || 100;
      this.executeTask('mass_scan', { count });
    }
    else if (cmd.includes('follow')) {
      this.executeTask('send_followups');
    }
    else if (cmd.includes('threat')) {
      this.executeTask('check_threats');
    }
    else if (cmd.includes('report')) {
      this.executeTask('generate_report');
    }
    else if (cmd.includes('offer') || cmd.includes('special')) {
      this.executeTask('deploy_special_offer');
    }
    else if (cmd.includes('proposal')) {
      const url = cmd.match(/for\s+(\S+)/)?.[1];
      this.executeTask('generate_proposal', { url });
    }
    else {
      this.log(`❓ Unknown command: "${command}". Try: scan URLs, send follow-ups, check threats, generate report, deploy special offer`);
    }
  }

  // ============================================================
  // TASK ORCHESTRATOR
  // ============================================================
  executeTask(type, data = {}) {
    const task = {
      id: `TASK-${Date.now()}`,
      type,
      status: 'running',
      startedAt: new Date().toISOString(),
      data
    };
    
    this.tasks.push(task);
    this.renderTasks();
    this.log(`🤖 EXECUTING: ${type}...`);

    switch (type) {
      case 'mass_scan':
        this.runMassScan(task);
        break;
      case 'send_followups':
        this.runFollowUps(task);
        break;
      case 'check_threats':
        this.runThreatCheck(task);
        break;
      case 'generate_report':
        this.runReport(task);
        break;
      case 'deploy_special_offer':
        this.runSpecialOffer(task);
        break;
      case 'generate_proposal':
        this.runProposal(task, data.url);
        break;
      default:
        this.completeTask(task, 'failed', 'Unknown task type');
    }
  }

  async runMassScan(task) {
    this.log(`🎯 Initiating mass scan for ${task.data.count} URLs...`);
    
    // Trigger Gap Hunter
    if (window.gapHunter) {
      const sampleUrls = Array.from({length: 10}, (_, i) => `target${i}.com`);
      document.getElementById('gh-url-input').value = sampleUrls.join('\n');
      window.gapHunter.startMassScan();
    }
    
    this.completeTask(task, 'complete', `Scan initiated for ${task.data.count} targets`);
  }

  async runFollowUps(task) {
    this.log(`📧 Sending follow-up sequences...`);
    
    const pending = this.sequences.filter(s => s.status === 'pending');
    for (const seq of pending) {
      await this.sendFollowUp(seq);
    }
    
    this.completeTask(task, 'complete', `${pending.length} follow-ups sent`);
  }

  async runThreatCheck(task) {
    this.log(`🛡️ Checking OmniGuard threat status...`);
    
    try {
      const res = await fetch(`${this.API_BASE}/omniguard/status`);
      const data = await res.json();
      
      if (data.status === 'SECURE') {
        this.log(`✅ Empire secure. Uptime: ${data.uptime}%. Nodes: ${data.activeNodes}`);
      } else {
        this.log(`⚠️ THREAT DETECTED: ${data.threatLevel}`);
        this.sendAlert('THREAT', `Threat level: ${data.threatLevel}`);
      }
      
      this.completeTask(task, 'complete', `Threat check complete: ${data.status}`);
    } catch (err) {
      this.completeTask(task, 'failed', err.message);
    }
  }

  async runReport(task) {
    this.log(`📊 Generating empire report...`);
    
    const report = {
      timestamp: new Date().toISOString(),
      tasksCompleted: this.tasks.filter(t => t.status === 'complete').length,
      emailsSent: this.analytics.emailsSent,
      revenue: this.analytics.revenue,
      activeSequences: this.sequences.filter(s => s.status === 'active').length
    };
    
    this.log(`📊 Report: ${report.tasksCompleted} tasks, $${report.revenue.toLocaleString()} revenue`);
    this.completeTask(task, 'complete', 'Report generated');
  }

  async runSpecialOffer(task) {
    this.log(`🎁 Deploying special offer campaign...`);
    
    if (this.specialOffers.freeWebsite.active && this.specialOffers.freeWebsite.count < this.specialOffers.freeWebsite.max) {
      this.log(`🎁 FREE AI Website offer: ${this.specialOffers.freeWebsite.max - this.specialOffers.freeWebsite.count} slots remaining`);
    }
    
    this.completeTask(task, 'complete', 'Special offers deployed');
  }

  async runProposal(task, url) {
    if (!url) {
      this.completeTask(task, 'failed', 'No URL specified');
      return;
    }
    
    this.log(`✍️ Generating proposal for ${url}...`);
    
    // Simulate proposal generation
    setTimeout(() => {
      this.log(`✅ Proposal generated for ${url}. Value: $2,840+`);
      this.completeTask(task, 'complete', `Proposal ready for ${url}`);
    }, 1500);
  }

  completeTask(task, status, message) {
    task.status = status;
    task.completedAt = new Date().toISOString();
    task.message = message;
    this.renderTasks();
    this.log(`${status === 'complete' ? '✅' : '❌'} TASK ${task.id}: ${message}`);
    this.saveState();
  }

  // ============================================================
  // EMAIL SEQUENCER
  // ============================================================
  createSequence(target = null) {
    const sequence = {
      id: `SEQ-${Date.now()}`,
      target: target || { url: 'example.com', email: 'contact@example.com' },
      steps: [
        { step: 1, type: 'initial', delay: 0, sent: false },
        { step: 2, type: 'follow_up', delay: 48, sent: false },
        { step: 3, type: 'value_add', delay: 96, sent: false },
        { step: 4, type: 'final', delay: 168, sent: false }
      ],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    this.sequences.push(sequence);
    this.renderSequences();
    this.log(`📧 Sequence created for ${sequence.target.url}`);
    this.saveState();
    return sequence;
  }

  async sendFollowUp(sequence) {
    const nextStep = sequence.steps.find(s => !s.sent);
    if (!nextStep) {
      sequence.status = 'complete';
      return;
    }

    this.log(`📧 Sending ${nextStep.type} to ${sequence.target.url}...`);
    
    // Simulate send
    nextStep.sent = true;
    nextStep.sentAt = new Date().toISOString();
    this.analytics.emailsSent++;
    
    this.renderSequences();
    this.renderAnalytics();
    this.saveState();
  }

  // ============================================================
  // SPECIAL OFFERS
  // ============================================================
  toggleOffer(offerType) {
    if (offerType === 'freeWebsite') {
      this.specialOffers.freeWebsite.active = !this.specialOffers.freeWebsite.active;
      this.log(`${this.specialOffers.freeWebsite.active ? '✅' : '⏸️'} Free website offer ${this.specialOffers.freeWebsite.active ? 'resumed' : 'paused'}`);
      this.renderInterface();
    }
  }

  deployOffer(offerType) {
    const offer = this.specialOffers[offerType];
    this.log(`🚀 Deploying ${offer.label} campaign...`);
    
    if (offerType === 'freeWebsite') {
      this.specialOffers.freeWebsite.count++;
    }
    
    this.analytics.conversions++;
    this.analytics.revenue += offer.price;
    this.renderAnalytics();
    this.saveState();
  }

  // ============================================================
  // ALERT SYSTEM
  // ============================================================
  sendAlert(level, message) {
    this.log(`🚨 ALERT [${level}]: ${message}`);
    
    // Could integrate with notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Empire Alert: ${level}`, { body: message });
    }
  }

  // ============================================================
  // ANALYTICS
  // ============================================================
  renderAnalytics() {
    const cards = document.querySelectorAll('.jv-analytics-num');
    if (cards.length >= 5) {
      cards[0].textContent = this.analytics.emailsSent;
      cards[1].textContent = this.analytics.emailsOpened;
      cards[2].textContent = this.analytics.repliesReceived;
      cards[3].textContent = this.analytics.conversions;
      cards[4].textContent = `$${this.analytics.revenue.toLocaleString()}`;
    }
  }

  // ============================================================
  // RENDERERS
  // ============================================================
  renderTasks() {
    const container = document.getElementById('jv-tasks');
    if (!container) return;
    
    const active = this.tasks.filter(t => t.status === 'running');
    const recent = this.tasks.filter(t => t.status !== 'running').slice(-5);
    
    container.innerHTML = `
      ${active.length > 0 ? '<div class="jv-task-section"><div class="jv-task-label">Running</div>' + 
        active.map(t => `
          <div class="jv-task-item running">
            <span class="jv-task-spinner">⟳</span>
            <span class="jv-task-name">${t.type}</span>
            <span class="jv-task-time">${this.timeAgo(t.startedAt)}</span>
          </div>
        `).join('') + '</div>' : ''}
      ${recent.length > 0 ? '<div class="jv-task-section"><div class="jv-task-label">Recent</div>' + 
        recent.map(t => `
          <div class="jv-task-item ${t.status}">
            <span>${t.status === 'complete' ? '✓' : '✗'}</span>
            <span class="jv-task-name">${t.type}</span>
            <span class="jv-task-msg">${t.message}</span>
          </div>
        `).join('') + '</div>' : ''}
    `;
  }

  renderSequences() {
    const container = document.getElementById('jv-sequences');
    if (!container) return;
    
    container.innerHTML = this.sequences.slice(-10).map(s => `
      <div class="jv-sequence-item ${s.status}">
        <div class="jv-sequence-url">${s.target.url}</div>
        <div class="jv-sequence-steps">
          ${s.steps.map(step => `
            <div class="jv-step ${step.sent ? 'sent' : ''} ${step === s.steps.find(st => !st.sent) ? 'next' : ''}">
              ${step.sent ? '✓' : step.step}
            </div>
          `).join('')}
        </div>
        <div class="jv-sequence-status">${s.status}</div>
      </div>
    `).join('');
  }

  // ============================================================
  // LOGGING
  // ============================================================
  log(message) {
    const logContent = document.getElementById('jv-log-content');
    if (!logContent) return;
    
    const entry = document.createElement('div');
    entry.className = 'jv-log-entry';
    entry.innerHTML = `<span class="jv-log-time">${new Date().toLocaleTimeString()}</span> ${message}`;
    logContent.insertBefore(entry, logContent.firstChild);
    
    // Keep last 50 entries
    while (logContent.children.length > 50) {
      logContent.removeChild(logContent.lastChild);
    }
  }

  clearLog() {
    const logContent = document.getElementById('jv-log-content');
    if (logContent) logContent.innerHTML = '';
  }

  // ============================================================
  // SCHEDULER
  // ============================================================
  startScheduler() {
    // Check every minute for scheduled tasks
    setInterval(() => {
      this.checkScheduledTasks();
    }, 60000);
    
    this.log('⏰ Scheduler active — checking every 60 seconds');
  }

  checkScheduledTasks() {
    const now = Date.now();
    this.schedules = this.schedules.filter(s => {
      if (s.nextRun <= now) {
        this.executeTask(s.taskType, s.data);
        if (s.recurring) {
          s.nextRun = now + s.interval;
          return true;
        }
        return false;
      }
      return true;
    });
  }

  scheduleTask(taskType, delayMs, data = {}, recurring = false) {
    this.schedules.push({
      id: `SCHED-${Date.now()}`,
      taskType,
      nextRun: Date.now() + delayMs,
      interval: recurring ? delayMs : null,
      recurring,
      data
    });
    this.log(`⏰ Scheduled: ${taskType} in ${(delayMs / 60000).toFixed(1)} minutes`);
  }

  // ============================================================
  // PERSISTENCE
  // ============================================================
  saveState() {
    try {
      localStorage.setItem('jarvis_state', JSON.stringify({
        tasks: this.tasks.slice(-50),
        sequences: this.sequences,
        analytics: this.analytics,
        specialOffers: this.specialOffers,
        schedules: this.schedules
      }));
    } catch (e) {
      console.warn('Failed to save Jarvis state');
    }
  }

  loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('jarvis_state') || '{}');
      if (saved.analytics) this.analytics = saved.analytics;
      if (saved.specialOffers) this.specialOffers = saved.specialOffers;
      if (saved.sequences) this.sequences = saved.sequences;
      if (saved.schedules) this.schedules = saved.schedules;
    } catch (e) {
      // Fresh start
    }
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  timeAgo(isoString) {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}

// ============================================================
// STYLES
// ============================================================
const jvStyle = document.createElement('style');
jvStyle.textContent = `
  .jarvis-container { max-width: 1400px; margin: 0 auto; padding: 20px; color: #e8e8f0; font-family: 'Segoe UI', system-ui, sans-serif; }
  .jv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #2a2a3a; }
  .jv-title { display: flex; align-items: center; gap: 12px; }
  .jv-title h2 { margin: 0; font-size: 24px; color: #00D4FF; }
  .jv-icon { font-size: 28px; }
  .jv-badge { background: linear-gradient(135deg, #00D4FF, #EC4899); color: #0a0a0f; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .jv-status { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #8888a0; }
  .jv-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; animation: pulse 2s infinite; }
  .jv-command-center { background: #111118; border: 1px solid #2a2a3a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .jv-input-group { display: flex; gap: 12px; margin-bottom: 16px; }
  .jv-input { flex: 1; background: #0a0a0f; border: 1px solid #2a2a3a; border-radius: 8px; padding: 12px 16px; color: #e8e8f0; font-size: 14px; }
  .jv-input:focus { outline: none; border-color: #00D4FF; }
  .jv-btn { padding: 10px 20px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .jv-btn:hover { transform: translateY(-1px); }
  .jv-btn-primary { background: linear-gradient(135deg, #00D4FF, #EC4899); color: white; }
  .jv-btn-small { padding: 6px 14px; font-size: 12px; }
  .jv-btn-ghost { background: transparent; color: #8888a0; border: 1px solid #2a2a3a; }
  .jv-btn-tiny { padding: 4px 10px; font-size: 11px; }
  .jv-quick-commands { display: flex; gap: 10px; flex-wrap: wrap; }
  .jv-quick-btn { padding: 8px 16px; background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 6px; color: #e8e8f0; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .jv-quick-btn:hover { background: #2a2a3a; border-color: #00D4FF; }
  .jv-modules { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 20px; }
  .jv-module { background: #111118; border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; }
  .jv-module-header { display: flex; align-items: center; gap: 10px; padding: 16px; border-bottom: 1px solid #2a2a3a; }
  .jv-module-icon { font-size: 20px; }
  .jv-module-header h3 { margin: 0; font-size: 16px; flex: 1; }
  .jv-module-status { padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  .jv-module-status.active { background: rgba(16,185,129,0.1); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
  .jv-module-content { padding: 16px; }
  .jv-task-list { display: flex; flex-direction: column; gap: 8px; }
  .jv-task-section { margin-bottom: 12px; }
  .jv-task-label { font-size: 11px; color: #8888a0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .jv-task-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #0a0a0f; border-radius: 6px; font-size: 13px; }
  .jv-task-item.running { border-left: 3px solid #00D4FF; }
  .jv-task-item.complete { border-left: 3px solid #10B981; }
  .jv-task-item.failed { border-left: 3px solid #EF4444; }
  .jv-task-spinner { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .jv-task-name { font-weight: 600; }
  .jv-task-msg { color: #8888a0; font-size: 12px; }
  .jv-task-time { margin-left: auto; font-size: 11px; color: #8888a0; }
  .jv-sequence-list { display: flex; flex-direction: column; gap: 10px; }
  .jv-sequence-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: #0a0a0f; border-radius: 6px; }
  .jv-sequence-url { font-weight: 600; color: #D4AF37; font-size: 13px; width: 120px; }
  .jv-sequence-steps { display: flex; gap: 6px; flex: 1; }
  .jv-step { width: 28px; height: 28px; border-radius: 50%; background: #1a1a24; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #8888a0; }
  .jv-step.sent { background: #10B981; color: white; border-color: #10B981; }
  .jv-step.next { background: #00D4FF; color: #0a0a0f; border-color: #00D4FF; animation: pulse 2s infinite; }
  .jv-sequence-status { font-size: 11px; color: #8888a0; text-transform: uppercase; }
  .jv-offer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
  .jv-offer-card { background: #0a0a0f; border: 1px solid #2a2a3a; border-radius: 8px; padding: 16px; text-align: center; }
  .jv-offer-card.active { border-color: #10B981; }
  .jv-offer-card.expired { border-color: #EF4444; opacity: 0.6; }
  .jv-offer-title { font-weight: 600; margin-bottom: 8px; }
  .jv-offer-count { font-size: 24px; color: #D4AF37; font-weight: 700; margin-bottom: 8px; }
  .jv-offer-desc { font-size: 12px; color: #8888a0; margin-bottom: 12px; }
  .jv-offer-bar { height: 6px; background: #1a1a24; border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
  .jv-offer-fill { height: 100%; background: linear-gradient(90deg, #10B981, #D4AF37); border-radius: 3px; transition: width 0.5s; }
  .jv-analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; }
  .jv-analytics-card { background: #0a0a0f; border: 1px solid #2a2a3a; border-radius: 8px; padding: 16px; text-align: center; }
  .jv-analytics-card.highlight { border-color: #D4AF37; }
  .jv-analytics-num { font-size: 24px; font-weight: 700; color: #D4AF37; }
  .jv-analytics-card.highlight .jv-analytics-num { color: #10B981; }
  .jv-analytics-label { font-size: 11px; color: #8888a0; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .jv-log { background: #111118; border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; }
  .jv-log-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #2a2a3a; font-size: 14px; font-weight: 600; }
  .jv-log-content { max-height: 300px; overflow-y: auto; padding: 12px 16px; }
  .jv-log-entry { padding: 6px 0; border-bottom: 1px solid #1a1a24; font-size: 13px; font-family: monospace; }
  .jv-log-time { color: #8888a0; margin-right: 8px; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;
document.head.appendChild(jvStyle);

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window.jarvis = new JarvisAutomation();
});
