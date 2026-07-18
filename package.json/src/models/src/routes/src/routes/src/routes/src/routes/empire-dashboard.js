/**
 * EMPIRE DASHBOARD — Live API Wire
 * Francisco Holdings Inc. — Phoenix Dominion
 * Fetches real-time data from Empire OS v2.0 backend
 * Author: Derek Francisco (Doc Weedlaw)
 */

class EmpireDashboard {
  constructor() {
    this.API_BASE = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000/api' 
      : '/api';
    this.refreshInterval = 5000;
    this.sseConnected = false;
    this.init();
  }

  init() {
    this.renderSkeleton();
    this.fetchAll();
    this.connectSSE();
    setInterval(() => this.fetchAll(), this.refreshInterval);
    console.log('🏛️ Empire Dashboard initialized — Phoenix Dominion');
  }

  renderSkeleton() {
    const revenuePanel = document.querySelector('.panel-revenue');
    if (revenuePanel) {
      revenuePanel.innerHTML = `
        <div class="panel-title">💰 Revenue Command Center</div>
        <div class="revenue-loading">Loading empire metrics...</div>
      `;
    }
  }

  async fetchAll() {
    await Promise.all([
      this.fetchOverview(),
      this.fetchCompanies(),
      this.fetchAgents(),
      this.fetchRevenue(),
      this.fetchOmniGuard(),
      this.fetchHumanQueue(),
      this.fetchLobby()
    ]);
  }

  async fetchJSON(endpoint) {
    try {
      const res = await fetch(`${this.API_BASE}${endpoint}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`⚠️ API fail: ${endpoint}`, err.message);
      return null;
    }
  }

  async fetchOverview() {
    const data = await this.fetchJSON('/empire/overview');
    if (!data) return;
    this.renderOverview(data);
  }

  async fetchCompanies() {
    const data = await this.fetchJSON('/companies');
    if (!data) return;
    this.renderFloorGrid(data);
  }

  async fetchAgents() {
    const data = await this.fetchJSON('/agents');
    if (!data) return;
    this.renderAgentSwarm(data);
  }

  async fetchRevenue() {
    const data = await this.fetchJSON('/revenue');
    if (!data) return;
    this.renderRevenue(data);
  }

  async fetchOmniGuard() {
    const data = await this.fetchJSON('/omniguard/status');
    if (!data) return;
    this.renderOmniGuard(data);
  }

  async fetchHumanQueue() {
    const data = await this.fetchJSON('/human-queue');
    if (!data) return;
    this.renderHumanQueue(data);
  }

  async fetchLobby() {
    const data = await this.fetchJSON('/lobby/instruments');
    if (!data) return;
    this.renderLobby(data);
  }

  connectSSE() {
    try {
      const evtSource = new EventSource(`${this.API_BASE}/stream/empire`);
      
      evtSource.onmessage = (e) => {
        try {
          const update = JSON.parse(e.data);
          this.handleSSEUpdate(update);
        } catch (err) {
          console.warn('SSE parse error:', err);
        }
      };

      evtSource.onopen = () => {
        this.sseConnected = true;
        console.log('📡 SSE connected — live empire stream active');
      };

      evtSource.onerror = () => {
        this.sseConnected = false;
        console.warn('📡 SSE disconnected — retrying in 10s');
        setTimeout(() => this.connectSSE(), 10000);
      };
    } catch (err) {
      console.warn('SSE not supported, falling back to polling');
    }
  }

  handleSSEUpdate(update) {
    const revenueEl = document.querySelector('.revenue-mtd');
    if (revenueEl && update.revenue) {
      revenueEl.textContent = this.formatCurrency(update.revenue);
      revenueEl.classList.add('flash-update');
      setTimeout(() => revenueEl.classList.remove('flash-update'), 500);
    }

    const agentEl = document.querySelector('.agent-count');
    if (agentEl && update.agents) {
      agentEl.textContent = update.agents.toLocaleString();
      agentEl.classList.add('flash-update');
      setTimeout(() => agentEl.classList.remove('flash-update'), 500);
    }
  }

  renderOverview(data) {
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
      headerRight.innerHTML = `
        <div>${data.meta.ceo} — ${data.meta.alias}</div>
        <div style="color: var(--gold); font-weight: 600;">
          ${data.meta.floorsActive}/${data.meta.floorsTotal} Floors Active
        </div>
        <div style="font-size: 11px; color: var(--text-muted);">
          Valuation Progress: ${data.metrics.valuationProgress}%
        </div>
      `;
    }
  }

  renderFloorGrid(companies) {
    const grid = document.querySelector('.floor-grid');
    if (!grid) return;

    const live = companies.filter(c => c.status === 'live');
    const dev = companies.filter(c => c.status === 'development');
    const planned = companies.filter(c => c.status === 'planned');

    grid.innerHTML = `
      <div class="floor-tabs">
        <button class="tab active" data-filter="all">All (${companies.length})</button>
        <button class="tab" data-filter="live">Live (${live.length})</button>
        <button class="tab" data-filter="dev">Dev (${dev.length})</button>
        <button class="tab" data-filter="planned">Planned (${planned.length})</button>
      </div>
      <div class="floor-container">
        ${companies.map(c => `
          <div class="floor-card ${c.status}" data-floor="${c.floor}" data-status="${c.status}">
            <div class="floor-number" style="color: ${c.color || 'var(--gold)'}">F${c.floor}</div>
            <div class="floor-name">${c.name}</div>
            <div class="floor-category">${c.category}</div>
            <div class="floor-metrics">
              <span class="floor-revenue">$${(c.revenue / 1000).toFixed(1)}K</span>
              <span class="floor-agents">${c.agents} 🤖</span>
            </div>
            <div class="floor-status-badge ${c.status}">${c.status}</div>
          </div>
        `).join('')}
      </div>
    `;

    grid.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        grid.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        grid.querySelectorAll('.floor-card').forEach(card => {
          const status = card.dataset.status;
          card.style.display = (filter === 'all' || status === filter) ? 'block' : 'none';
        });
      });
    });
  }

  renderAgentSwarm(data) {
    const panel = document.querySelector('.panel-agents');
    if (!panel) return;

    const { swarm, byCompany } = data;
    panel.innerHTML = `
      <div class="panel-title">🤖 Agent Swarm Network</div>
      <div class="swarm-stats">
        <div class="swarm-stat">
          <div class="swarm-number agent-count">${swarm.active}</div>
          <div class="swarm-label">Active</div>
        </div>
        <div class="swarm-stat">
          <div class="swarm-number">${swarm.idle}</div>
          <div class="swarm-label">Idle</div>
        </div>
        <div class="swarm-stat">
          <div class="swarm-number">${swarm.total}</div>
          <div class="swarm-label">Total</div>
        </div>
      </div>
      <div class="agent-list">
        ${byCompany.map(c => `
          <div class="agent-row">
            <div class="agent-info">
              <span class="agent-floor">F${c.floor}</span>
              <span class="agent-name">${c.name}</span>
            </div>
            <div class="agent-bar-container">
              <div class="agent-bar" style="width: ${Math.min(c.agents / 100 * 100, 100)}%; background: ${c.status === 'live' ? 'var(--emerald)' : 'var(--warning)'}"></div>
            </div>
            <div class="agent-count-label">${c.agents}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderRevenue(data) {
    const panel = document.querySelector('.panel-revenue');
    if (!panel) return;

    const progress = (data.mtd / data.target * 100).toFixed(2);
    const trajectory = data.trajectory || [];
    const maxTraj = Math.max(...trajectory, 1);

    panel.innerHTML = `
      <div class="panel-title">💰 Revenue Command Center</div>
      <div class="revenue-header">
        <div class="revenue-mtd">${this.formatCurrency(data.mtd)}</div>
        <div class="revenue-label">MTD Revenue</div>
      </div>
      <div class="revenue-target-bar">
        <div class="target-track">
          <div class="target-fill" style="width: ${Math.min(progress, 100)}%"></div>
        </div>
        <div class="target-labels">
          <span>$0</span>
          <span style="color: var(--gold)">${progress}% of ${this.formatCurrency(data.target)}</span>
          <span>${this.formatCurrency(data.target)}</span>
        </div>
      </div>
      <div class="revenue-tiers">
        ${Object.entries(data.byTier).map(([tier, amount]) => `
          <div class="tier-row">
            <span class="tier-name">${tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
            <span class="tier-amount">${this.formatCurrency(amount)}</span>
          </div>
        `).join('')}
      </div>
      <div class="revenue-trajectory">
        <div class="panel-title" style="margin-top: 16px;">📈 12-Month Trajectory</div>
        <div class="trajectory-chart">
          ${trajectory.map((val, i) => `
            <div class="trajectory-bar" style="height: ${(val / maxTraj * 100).toFixed(1)}%">
              <div class="trajectory-tooltip">${this.formatCurrency(val)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderOmniGuard(data) {
    const panel = document.querySelector('.panel-omniguard');
    if (!panel) return;

    const statusColor = data.status === 'SECURE' ? 'var(--success)' : 'var(--danger)';
    
    panel.innerHTML = `
      <div class="panel-title">🛡️ OmniGuard Security</div>
      <div class="omniguard-status" style="color: ${statusColor}">
        <div class="status-icon">${data.status === 'SECURE' ? '✓' : '⚠'}</div>
        <div class="status-text">${data.status}</div>
      </div>
      <div class="omniguard-metrics">
        <div class="og-metric">
          <div class="og-number">${data.uptime}%</div>
          <div class="og-label">Uptime</div>
        </div>
        <div class="og-metric">
          <div class="og-number">${data.activeNodes.toLocaleString()}</div>
          <div class="og-label">Active Nodes</div>
        </div>
        <div class="og-metric">
          <div class="og-number">${data.threatsBlocked.toLocaleString()}</div>
          <div class="og-label">Threats Blocked</div>
        </div>
      </div>
      <div class="threat-level" style="color: ${data.threatLevel === 'NONE' ? 'var(--success)' : 'var(--danger)'}">
        Threat Level: ${data.threatLevel}
      </div>
    `;
  }

  renderHumanQueue(queue) {
    const panel = document.querySelector('.panel-human-queue');
    if (!panel) return;

    panel.innerHTML = `
      <div class="panel-title">👤 Human-in-the-Loop Queue</div>
      <div class="queue-list">
        ${queue.map(item => {
          const priorityColor = item.priority === 'HIGH' ? 'var(--danger)' : 
                               item.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)';
          return `
            <div class="queue-item">
              <div class="queue-priority" style="background: ${priorityColor}">${item.priority}</div>
              <div class="queue-content">
                <div class="queue-title">${item.title}</div>
                <div class="queue-meta">F${item.floor} · ${item.company} · ${item.time}</div>
              </div>
              <div class="queue-action">
                <button class="action-btn ${item.action}" data-id="${item.id}">${item.action}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    panel.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const action = btn.classList.contains('approve') ? 'approve' : 
                      btn.classList.contains('review') ? 'review' : 'escalate';
        await this.handleQueueAction(id, action);
      });
    });
  }

  async handleQueueAction(id, action) {
    try {
      const res = await fetch(`${this.API_BASE}/human-queue/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        this.fetchHumanQueue();
        console.log(`✅ Queue item ${id} ${action}d`);
      }
    } catch (err) {
      console.error('Queue action failed:', err);
    }
  }

  renderLobby(instruments) {
    const panel = document.querySelector('.panel-lobby');
    if (!panel) return;

    panel.innerHTML = `
      <div class="panel-title">🎵 Lobby Instruments</div>
      <div class="instrument-grid">
        ${instruments.map(inst => `
          <div class="instrument-card ${inst.status}">
            <div class="instrument-icon">${this.getInstrumentEmoji(inst.type)}</div>
            <div class="instrument-name">${inst.type}</div>
            <div class="instrument-status ${inst.status}">${inst.status}</div>
            ${inst.piece ? `<div class="instrument-piece">${inst.piece}</div>` : ''}
            ${inst.avatar ? `<div class="instrument-avatar">🎭 ${inst.avatar}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  getInstrumentEmoji(type) {
    const map = {
      'Grand Piano': '🎹',
      'Violin': '🎻',
      'Cello': '🎻',
      'Saxophone': '🎷',
      'Jazz Drums': '🥁'
    };
    return map[type] || '🎵';
  }

  formatCurrency(num) {
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(1) + 'K';
    return '$' + num.toLocaleString();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.empireDashboard = new EmpireDashboard();
});

const style = document.createElement('style');
style.textContent = `
  .flash-update { animation: flashGold 0.5s ease; }
  @keyframes flashGold {
    0% { color: var(--gold); text-shadow: 0 0 20px var(--gold); }
    100% { color: inherit; text-shadow: none; }
  }
  .floor-card { transition: all 0.2s; cursor: pointer; }
  .floor-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(212,175,55,0.2); }
  .floor-card.live { border-left: 3px solid var(--emerald); }
  .floor-card.development { border-left: 3px solid var(--warning); }
  .floor-card.planned { border-left: 3px solid var(--text-muted); }
  .trajectory-bar { position: relative; background: var(--gold); border-radius: 2px 2px 0 0; }
  .trajectory-bar:hover .trajectory-tooltip { opacity: 1; }
  .trajectory-tooltip { 
    position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    background: var(--bg-panel); border: 1px solid var(--border); padding: 4px 8px;
    border-radius: 4px; font-size: 11px; white-space: nowrap; opacity: 0; transition: opacity 0.2s;
    pointer-events: none; z-index: 10;
  }
  .action-btn { padding: 4px 12px; border: none; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; }
  .action-btn.approve { background: var(--emerald); color: white; }
  .action-btn.review { background: var(--warning); color: black; }
  .action-btn.escalate { background: var(--danger); color: white; }
  .queue-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-bottom: 1px solid var(--border); }
  .queue-priority { padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; color: white; }
  .instrument-card { padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center; }
  .instrument-card.playing { border-color: var(--emerald); background: rgba(16,185,129,0.1); }
  .instrument-status.playing { color: var(--emerald); }
  .agent-bar-container { height: 4px; background: var(--bg-raised); border-radius: 2px; overflow: hidden; flex: 1; margin: 0 8px; }
  .agent-bar { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
`;
document.head.appendChild(style);
