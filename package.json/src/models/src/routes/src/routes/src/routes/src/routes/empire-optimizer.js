/**
 * EMPIRE OPTIMIZER — Performance Engine
 * Francisco Holdings Inc. — Phoenix Dominion
 * Lazy-load, code-split, cache, speed up 392-floor empire
 * Author: Derek Francisco (Doc Weedlaw)
 */

class EmpireOptimizer {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
    this.observers = new Map();
    this.loadedChunks = new Set();
    this.init();
  }

  init() {
    this.setupLazyLoader();
    this.setupAPICache();
    this.setupCSSDefer();
    this.setupPrefetcher();
    this.setupImageOptimizer();
    console.log('⚡ Empire Optimizer initialized — Phoenix Dominion');
  }

  // ============================================================
  // LAZY LOADER — Load heavy sections on scroll
  // ============================================================
  setupLazyLoader() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load everything immediately
      document.querySelectorAll('[data-lazy-load]').forEach(el => this.loadChunk(el));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          this.loadChunk(el);
          observer.unobserve(el);
        }
      });
    }, {
      rootMargin: '200px', // Start loading 200px before visible
      threshold: 0.01
    });

    document.querySelectorAll('[data-lazy-load]').forEach(el => {
      observer.observe(el);
      // Show skeleton while loading
      el.classList.add('lazy-skeleton');
    });

    this.observers.set('lazy', observer);
  }

  async loadChunk(element) {
    const chunkId = element.dataset.lazyLoad;
    if (this.loadedChunks.has(chunkId)) return;

    const chunkUrl = element.dataset.chunkUrl || `/chunks/${chunkId}.html`;
    
    try {
      const html = await this.fetchWithCache(chunkUrl);
      element.innerHTML = html;
      element.classList.remove('lazy-skeleton');
      element.classList.add('lazy-loaded');
      this.loadedChunks.add(chunkId);
      
      // Execute any scripts in the chunk
      element.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      console.log(`📦 Chunk loaded: ${chunkId}`);
    } catch (err) {
      console.warn(`⚠️ Failed to load chunk: ${chunkId}`, err);
      element.innerHTML = `<div class="lazy-error">Failed to load ${chunkId}. <button onclick="location.reload()">Retry</button></div>`;
    }
  }

  // ============================================================
  // API CACHE — Cache dashboard data in localStorage
  // ============================================================
  setupAPICache() {
    // Override fetch to use cache
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      // Only cache GET requests
      if (options.method && options.method !== 'GET') {
        return originalFetch(url, options);
      }

      const cacheKey = `api_cache_${url}`;
      const cached = this.getCache(cacheKey);
      
      if (cached && !options.noCache) {
        console.log(`💾 Cache hit: ${url}`);
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const response = await originalFetch(url, options);
      const clone = response.clone();
      
      try {
        const data = await clone.json();
        this.setCache(cacheKey, data);
      } catch (e) {
        // Not JSON, don't cache
      }

      return response;
    };
  }

  getCache(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > this.cacheTTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  setCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      // localStorage full, clear old entries
      this.clearOldCache();
    }
  }

  clearOldCache() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('api_cache_'));
    keys.sort((a, b) => {
      const aTime = JSON.parse(localStorage.getItem(a) || '{}').timestamp || 0;
      const bTime = JSON.parse(localStorage.getItem(b) || '{}').timestamp || 0;
      return aTime - bTime;
    });
    // Remove oldest 20%
    keys.slice(0, Math.ceil(keys.length * 0.2)).forEach(k => localStorage.removeItem(k));
  }

  // ============================================================
  // CSS DEFER — Load non-critical CSS after first paint
  // ============================================================
  setupCSSDefer() {
    // Find all link[rel="stylesheet"] with data-defer
    document.querySelectorAll('link[data-defer]').forEach(link => {
      // Store href, remove to prevent blocking
      const href = link.href;
      link.removeAttribute('href');
      link.setAttribute('data-href', href);
      
      // Load after first paint
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.loadCSS(link, href));
      } else {
        setTimeout(() => this.loadCSS(link, href), 100);
      }
    });
  }

  loadCSS(link, href) {
    link.href = href;
    link.removeAttribute('data-defer');
    console.log(`🎨 Deferred CSS loaded: ${href}`);
  }

  // ============================================================
  // PREFETCHER — Preload next likely page
  // ============================================================
  setupPrefetcher() {
    // Prefetch on hover
    document.querySelectorAll('a[data-prefetch]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const url = link.href;
        if (!this.prefetchedUrls) this.prefetchedUrls = new Set();
        if (this.prefetchedUrls.has(url)) return;
        
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = url;
        document.head.appendChild(prefetch);
        this.prefetchedUrls.add(url);
      });
    });

    // Prefetch based on navigation pattern
    const navPattern = JSON.parse(localStorage.getItem('nav_pattern') || '[]');
    if (navPattern.length > 3) {
      const likelyNext = this.predictNextPage(navPattern);
      if (likelyNext) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = likelyNext;
        document.head.appendChild(link);
      }
    }
  }

  predictNextPage(pattern) {
    // Simple Markov chain: last page → most common next
    const transitions = {};
    for (let i = 0; i < pattern.length - 1; i++) {
      const from = pattern[i];
      const to = pattern[i + 1];
      if (!transitions[from]) transitions[from] = {};
      transitions[from][to] = (transitions[from][to] || 0) + 1;
    }
    
    const current = pattern[pattern.length - 1];
    const nexts = transitions[current];
    if (!nexts) return null;
    
    return Object.entries(nexts).sort((a, b) => b[1] - a[1])[0][0];
  }

  // ============================================================
  // IMAGE OPTIMIZER — WebP fallback, responsive
  // ============================================================
  setupImageOptimizer() {
    // Convert images to WebP where supported
    if (!this.supportsWebP()) return;

    document.querySelectorAll('img[data-webp]').forEach(img => {
      const webpSrc = img.dataset.webp;
      if (webpSrc) img.src = webpSrc;
    });
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // ============================================================
  // FETCH WITH CACHE
  // ============================================================
  async fetchWithCache(url) {
    const cached = this.getCache(`chunk_${url}`);
    if (cached) return cached.data;

    const res = await fetch(url);
    const text = await res.text();
    this.setCache(`chunk_${url}`, text);
    return text;
  }

  // ============================================================
  // PERFORMANCE METRICS
  // ============================================================
  logMetrics() {
    if (!window.performance) return;
    
    const timing = performance.timing;
    const metrics = {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      connect: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.requestStart,
      domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
      fullLoad: timing.loadEventEnd - timing.navigationStart
    };

    console.log('⚡ Empire Performance Metrics:', metrics);
    
    // Report to backend if slow
    if (metrics.fullLoad > 5000) {
      fetch('/api/performance/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, url: location.href, timestamp: Date.now() })
      }).catch(() => {});
    }
  }
}

// ============================================================
// SKELETON STYLES
// ============================================================
const optimizerStyle = document.createElement('style');
optimizerStyle.textContent = `
  .lazy-skeleton {
    background: linear-gradient(90deg, #1a1a24 25%, #2a2a3a 50%, #1a1a24 75%);
    background-size: 200% 100%;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    min-height: 200px;
    border-radius: 8px;
  }
  @keyframes skeleton-pulse {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .lazy-loaded {
    animation: fade-in 0.3s ease;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .lazy-error {
    padding: 40px;
    text-align: center;
    color: #EF4444;
    background: rgba(239,68,68,0.1);
    border-radius: 8px;
    border: 1px solid rgba(239,68,68,0.3);
  }
  .lazy-error button {
    margin-top: 12px;
    padding: 8px 16px;
    background: #EF4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;
document.head.appendChild(optimizerStyle);

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window.empireOptimizer = new EmpireOptimizer();
  
  // Log metrics after full load
  window.addEventListener('load', () => {
    setTimeout(() => window.empireOptimizer.logMetrics(), 0);
  });
});
