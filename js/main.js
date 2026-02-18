document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================
     THEME TOGGLE
     ============================================== */
  const tt = document.getElementById('theme-toggle');
  const mt = document.getElementById('mobile-theme-toggle');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('colt-theme', t);
    const ic = t === 'light' ? '\u2600' : '\u263D';
    if (tt) tt.textContent = ic;
    if (mt) mt.textContent = ic;
  }
  setTheme(localStorage.getItem('colt-theme') || 'dark');
  function flipTheme() { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
  if (tt) tt.addEventListener('click', flipTheme);
  if (mt) mt.addEventListener('click', flipTheme);

  /* ==============================================
     NAVBAR SCROLL SHADOW
     ============================================== */
  const nav = document.querySelector('.navbar');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });

  /* ==============================================
     MOBILE MENU
     ============================================== */
  const mobBtn = document.getElementById('mobile-btn');
  const mobNav = document.getElementById('mobile-nav');
  if (mobBtn && mobNav) {
    mobBtn.addEventListener('click', () => {
      mobBtn.classList.toggle('active');
      mobNav.classList.toggle('open');
      document.body.style.overflow = mobNav.classList.contains('open') ? 'hidden' : '';
    });
    mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobBtn.classList.remove('active');
      mobNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ==============================================
     SCROLL REVEAL
     ============================================== */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const rObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rObs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => rObs.observe(el));
  }

  /* ==============================================
     ACTIVE NAV LINK
     ============================================== */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const h = a.getAttribute('href');
    if (h && !h.startsWith('#') && (h === page || (page === '' && h === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* ==============================================
     HERO TERMINAL TYPEWRITER
     ============================================== */
  const heroTerm = document.getElementById('hero-term');
  if (heroTerm) {
    const lines = [
      { t: '$ colt execute --react "Update billing to 456 Oak St"', c: 'cmd-line' },
      { t: '' },
      { t: '. react  Searching semantic index...', c: 'inf' },
      { t: '. react  Target: /settings/billing (0.87)', c: 'inf' },
      { t: '' },
      { t: '. iter 1  OBSERVE  14 elements found', c: 'wrn' },
      { t: '. iter 1  REASON   Click "Edit Address"', c: 'wrn' },
      { t: '. iter 1  ACT      click -> #edit-address-btn', c: 'wrn' },
      { t: '' },
      { t: '. iter 2  OBSERVE  Modal detected (aria-modal)', c: 'wrn' },
      { t: '. iter 2  ACT      fill -> input[name="street"]', c: 'wrn' },
      { t: '' },
      { t: '  Task complete (5 iter, 7 calls, $0.003)', c: 'ok' },
    ];
    let li = 0;
    function typeLine() {
      if (li >= lines.length) return;
      const l = lines[li];
      const d = document.createElement('div');
      d.style.cssText = 'opacity:0;transform:translateY(3px);transition:opacity .3s,transform .3s;';
      if (!l.t) {
        d.innerHTML = '<br>';
      } else if (l.c === 'cmd-line') {
        d.innerHTML = '<span class="prompt">$</span> <span class="cmd">colt execute</span> <span class="flag">--react</span> <span class="str">"Update billing to 456 Oak St"</span>';
      } else {
        const sp = l.t.indexOf('  ');
        d.innerHTML = '<span class="' + l.c + '">' + l.t.substring(0, sp + 2) + '</span><span class="out">' + l.t.substring(sp + 2) + '</span>';
      }
      heroTerm.appendChild(d);
      requestAnimationFrame(() => { d.style.opacity = '1'; d.style.transform = 'translateY(0)'; });
      li++;
      setTimeout(typeLine, !l.t ? 90 : l.c === 'cmd-line' ? 550 : l.c === 'ok' ? 350 : 160);
    }
    setTimeout(typeLine, 900);
  }

  /* ==============================================
     ANIMATED COUNTERS
     ============================================== */
  document.querySelectorAll('[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = +el.dataset.count, dur = 1400, start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      obs.unobserve(el);
    }), { threshold: 0.5 });
    obs.observe(el);
  });

  /* ==============================================
     PIPELINE SCROLL ANIMATION
     ============================================== */
  const pipeVis = document.getElementById('pipeline-vis');
  const pipeFill = document.getElementById('pipe-fill');
  if (pipeVis && pipeFill) {
    const nodes = pipeVis.querySelectorAll('.pipe-node');
    const pObs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting || pipeVis._fired) return;
      pipeVis._fired = true;
      let s = 0;
      const iv = setInterval(() => {
        nodes.forEach((n, i) => n.classList.toggle('on', i <= s));
        pipeFill.style.width = (s / (nodes.length - 1) * 100) + '%';
        s++;
        if (s >= nodes.length) clearInterval(iv);
      }, 450);
    }), { threshold: 0.25 });
    pObs.observe(pipeVis);
  }

  /* ==============================================
     TABS
     ============================================== */
  const tabsNav = document.getElementById('tabs-nav');
  if (tabsNav) {
    tabsNav.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabsNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
      // re-trigger modal overlay animation
      if (btn.dataset.tab === 'modal') {
        const ov = document.getElementById('modal-overlay');
        if (ov) { ov.style.animation = 'none'; ov.offsetHeight; ov.style.animation = ''; }
      }
    });
  }

  /* ==============================================
     REACT CYCLE ANIMATION
     ============================================== */
  const reactCycle = document.getElementById('react-cycle');
  if (reactCycle) {
    const steps = reactCycle.querySelectorAll('.cycle-step');
    let ci = 0;
    setInterval(() => {
      steps.forEach(s => s.classList.remove('on'));
      steps[ci].classList.add('on');
      ci = (ci + 1) % steps.length;
    }, 1100);
  }

  /* ==============================================
     COLT APP DEMO TYPEWRITER
     ============================================== */
  const appIn = document.getElementById('app-in');
  const appOut = document.getElementById('app-out');
  if (appIn && appOut) {
    const txt = 'Monitor billing page for overdue invoices, extract amounts, send Slack alert';
    const outLines = [
      { t: '# Auto-generated by COLT App', c: 'cmt' },
      { t: '# Context: /billing/invoices (18 elements)', c: 'cmt' },
      { t: '' },
      { t: 'from playwright.sync_api import sync_playwright', c: 'kw' },
      { t: '' },
      { t: 'def monitor_overdue(config):', c: 'out' },
      { t: '    page.goto(base_url + "/billing/invoices")', c: 'str' },
      { t: '    page.click(\'[data-testid="status-filter"]\')', c: 'str' },
      { t: '    page.click(\'[data-value="overdue"]\')', c: 'str' },
      { t: '    rows = page.query_selector_all("tbody tr")', c: 'out' },
      { t: '    return [extract(r) for r in rows]', c: 'out' },
    ];
    let appFired = false;
    const appSection = document.querySelector('.app-section');
    if (appSection) {
      new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting || appFired) return;
        appFired = true;
        let i = 0;
        const ti = setInterval(() => {
          if (i <= txt.length) { appIn.textContent = txt.substring(0, i++); }
          else { clearInterval(ti); setTimeout(showAppOut, 350); }
        }, 28);
      }), { threshold: 0.35 }).observe(appSection);
    }

    function showAppOut() {
      let idx = 0;
      (function next() {
        if (idx >= outLines.length) return;
        const l = outLines[idx];
        const d = document.createElement('div');
        d.style.cssText = 'opacity:0;transform:translateY(3px);transition:opacity .25s,transform .25s;';
        d.innerHTML = !l.t ? '<br>' : '<span class="' + l.c + '">' + l.t + '</span>';
        appOut.appendChild(d);
        requestAnimationFrame(() => { d.style.opacity = '1'; d.style.transform = 'translateY(0)'; });
        idx++;
        setTimeout(next, !l.t ? 70 : 120);
      })();
    }
  }

  /* ==============================================
     WAITLIST — SUPABASE + LOCALSTORAGE
     ============================================== */
  const WL = window.ColtWaitlist;

  // Helper: show "already applied" state on a waitlist container
  function showAppliedState(containerId, email) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Find the form and elements within the container
    const form = container.querySelector('form');
    const titleEl = container.querySelector('h2, h3');
    const descEl = container.querySelector('p:not(.wl-note)');

    if (form) form.style.display = 'none';

    // Insert applied badge
    const applied = document.createElement('div');
    applied.className = 'wl-applied';
    applied.innerHTML =
      '<div class="wl-applied-icon">\u2713</div>' +
      '<h3>You\'re on the list</h3>' +
      '<p class="wl-applied-email">' + email + '</p>' +
      '<p>We\'ll reach out when your spot opens.</p>';

    if (form) form.parentNode.insertBefore(applied, form);
    else container.appendChild(applied);

    // Update title if present
    if (titleEl) titleEl.textContent = 'Already applied';
    if (descEl) descEl.style.display = 'none';

    // Hide wl-note if present
    const note = container.querySelector('.wl-note');
    if (note) note.style.display = 'none';
  }

  // On page load: check if already applied
  if (WL && WL.isAlreadyApplied()) {
    const email = WL.getAppliedEmail();
    showAppliedState('home-wl-box', email);
    showAppliedState('docs-wl-card', email);
  }

  // Home waitlist form
  const homeForm = document.getElementById('wl-form');
  if (homeForm && WL) {
    homeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('home-wl-email');
      const btn = document.getElementById('home-wl-btn');
      const email = emailInput.value.trim();
      if (!email) return;

      btn.textContent = 'Submitting...';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';

      const result = await WL.submitWaitlist(email);

      if (result.ok) {
        showAppliedState('home-wl-box', email);
        // Also update docs form if it exists on a different page load
      } else {
        btn.textContent = 'Try again';
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        setTimeout(() => { btn.textContent = 'Join Waitlist'; }, 2000);
      }
    });
  }

  // Docs waitlist form
  const docsForm = document.getElementById('docs-wl-form');
  if (docsForm && WL) {
    docsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('docs-wl-email');
      const btn = document.getElementById('docs-wl-btn');
      const email = emailInput.value.trim();
      if (!email) return;

      btn.textContent = 'Submitting...';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';

      const result = await WL.submitWaitlist(email);

      if (result.ok) {
        showAppliedState('docs-wl-card', email);
      } else {
        btn.textContent = 'Try again';
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        setTimeout(() => { btn.textContent = 'Request Access'; }, 2000);
      }
    });
  }

  /* ==============================================
     DOCS SMART SEARCH
     ============================================== */
  const searchInput = document.getElementById('docs-search');
  const searchResults = document.getElementById('docs-search-results');
  const docsNavEl = document.getElementById('docs-nav');

  if (searchInput && searchResults && docsNavEl) {
    // Build search index from docs content
    const searchIndex = [];
    const mainContent = document.querySelector('.docs-main');
    if (mainContent) {
      const sections = mainContent.querySelectorAll('h2[id], h3[id]');
      sections.forEach(heading => {
        const id = heading.id;
        const title = heading.textContent.trim();
        // Collect text from this heading until the next heading
        let text = '';
        let sibling = heading.nextElementSibling;
        while (sibling && !sibling.matches('h2, h3')) {
          text += ' ' + (sibling.textContent || '');
          sibling = sibling.nextElementSibling;
        }
        text = text.replace(/\s+/g, ' ').trim().substring(0, 300);
        const level = heading.tagName === 'H2' ? 'section' : 'subsection';
        searchIndex.push({ id, title, text, level });
      });
    }

    let activeResultIdx = -1;

    function performSearch(query) {
      query = query.toLowerCase().trim();
      if (!query || query.length < 2) {
        searchResults.style.display = 'none';
        docsNavEl.style.display = '';
        activeResultIdx = -1;
        return;
      }

      const results = [];
      const words = query.split(/\s+/);

      searchIndex.forEach(item => {
        const titleLower = item.title.toLowerCase();
        const textLower = item.text.toLowerCase();
        let score = 0;

        words.forEach(w => {
          if (titleLower.includes(w)) score += 10;
          if (titleLower.startsWith(w)) score += 5;
          const textMatches = (textLower.match(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          score += Math.min(textMatches, 5);
        });

        if (score > 0) {
          results.push({ ...item, score });
        }
      });

      results.sort((a, b) => b.score - a.score);
      activeResultIdx = -1;

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="docs-sr-empty">No results for "' + query.replace(/</g, '&lt;') + '"</div>';
        searchResults.style.display = 'block';
        docsNavEl.style.display = 'none';
        return;
      }

      const escQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlightRe = new RegExp('(' + escQuery.split(/\s+/).join('|') + ')', 'gi');

      searchResults.innerHTML = results.slice(0, 8).map((r, i) => {
        const hlTitle = r.title.replace(highlightRe, '<mark>$1</mark>');
        // Show a snippet of the text
        let snippet = r.text.substring(0, 120);
        snippet = snippet.replace(highlightRe, '<mark>$1</mark>');
        return '<a class="docs-sr-item" href="#' + r.id + '" data-idx="' + i + '">' +
          hlTitle + '<small>' + snippet + '...</small></a>';
      }).join('');

      searchResults.style.display = 'block';
      docsNavEl.style.display = 'none';
    }

    // Debounced search
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => performSearch(searchInput.value), 150);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      const items = searchResults.querySelectorAll('.docs-sr-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeResultIdx = Math.min(activeResultIdx + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === activeResultIdx));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeResultIdx = Math.max(activeResultIdx - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === activeResultIdx));
      } else if (e.key === 'Enter' && activeResultIdx >= 0) {
        e.preventDefault();
        items[activeResultIdx].click();
      } else if (e.key === 'Escape') {
        searchInput.value = '';
        searchResults.style.display = 'none';
        docsNavEl.style.display = '';
        searchInput.blur();
      }
    });

    // Click result -> navigate and close
    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.docs-sr-item');
      if (item) {
        searchInput.value = '';
        searchResults.style.display = 'none';
        docsNavEl.style.display = '';
      }
    });

    // "/" keyboard shortcut to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.docs-side')) {
        searchResults.style.display = 'none';
        docsNavEl.style.display = '';
      }
    });
  }

  /* ==============================================
     DOCS SIDEBAR SCROLL SPY
     ============================================== */
  const docsSections = document.querySelectorAll('.docs-main h2[id], .docs-main h3[id]');
  const docsLinks = document.querySelectorAll('.docs-side a[href^="#"]');
  if (docsSections.length && docsLinks.length) {
    const spyObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          docsLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector('.docs-side a[href="#' + e.target.id + '"]');
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0, rootMargin: '-80px 0px -70% 0px' });
    docsSections.forEach(s => spyObs.observe(s));
  }

});