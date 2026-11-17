/* Grand Geodetics website — shared behaviour for every page:
   • draws the cards and lists from assets/js/content.js (numbers, workspaces, steps, resources, the moving strip,
     support, social links, questions, the open-data table)
   • motion: the opening sequence, reveals that replay as you scroll down, the progress line, hero depth,
     the light that follows the pointer, the moving strip
   • live release information from GitHub, copy buttons, the contact form and the home video */
(function () {
  const S = window.SITE || {}, C = window.CONTENT || {}, I = window.ICON, E = window.ESC;
  const $ = (q, r = document) => r.querySelector(q), $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnim = !RM && 'IntersectionObserver' in window;
  if (window.LAYOUT) LAYOUT.drawFooter();
  const fill = (id, list, tpl) => { const el = document.getElementById(id); if (el && Array.isArray(list)) el.innerHTML = list.map(tpl).join(''); return el; };

  /* ---------------- cards from content.js ---------------- */
  fill('numsList', C.numbers, n => `<div class="card num lift"><div class="top"><b data-count="${+n.value || 0}" data-suffix="${E(n.suffix)}">${+n.value || 0}${E(n.suffix)}</b><span class="tile">${I(n.icon)}</span></div><div class="bottom"><h3>${E(n.title)}</h3><p>${E(n.text)}</p></div></div>`);
  const parcel = `<div class="art"><svg viewBox="0 0 400 180" width="86%" aria-hidden="true"><g fill="none" stroke="var(--blue)" stroke-width="1.6"><path d="M20 20h110v60H20zM130 20h120v80H130zM250 20h130v55H250zM20 80h110v80H20zM130 100h70v60h-70zM200 100h50v60h-50zM250 75h130v85H250z" fill="var(--paper)" fill-opacity=".7"/></g><path class="pick" d="M130 100h70v60h-70z"/><circle cx="165" cy="130" r="4" fill="var(--ox)"/></svg></div>`;
  fill('wsList', C.workspaces, w => { const pic = w.image ? `<img class="shot" src="${E(w.image)}" alt="${E(w.tag)} in Land Studio" loading="lazy">` : parcel;
    const head = `<div class="tagrow"><span class="tile">${I(w.icon)}</span><span class="tag">${E(w.tag)}</span></div><h3>${E(w.title)}</h3><p>${E(w.text)}</p>`;
    return w.size === 'full' ? `<article class="card ws full lift"><div class="txt">${head}</div>${pic}</article>` : `<article class="card ws ${w.size === 'wide' ? 'wide' : ''} lift">${head}${pic}</article>`; });
  const st = fill('stepsList', C.steps, s => `<li class="card"><div class="n">${I(s.icon)}</div><h3>${E(s.title)}</h3><p>${E(s.text)}</p></li>`);
  if (st) st.insertAdjacentHTML('afterbegin', '<span class="track" aria-hidden="true"></span>');
  fill('whyList', C.why, w => `<div><span class="tile">${I(w.icon)}</span><h3>${E(w.title)}</h3><p>${E(w.text)}</p></div>`);
  fill('resList', C.resources, r => `<a class="card lift" href="${E(r.href)}"><span class="tile">${I(r.icon)}</span><h3>${E(r.title)}${I('arrow-up-right')}</h3><p>${E(r.text)}</p></a>`);
  fill('strip', C.pages, p => `<a class="card" href="${E(p.path)}"><img src="${E(p.image)}" alt="${E(p.title)} page" loading="lazy" width="640" height="360"><div class="meta"><b>${I(p.icon)}${E(p.title)}</b><small>${E(p.path)}</small></div></a>`);
  fill('supList', C.support, s => `<div class="card lift"><span class="tile">${I(s.icon)}</span><small>${E(s.label)}</small><span class="n">${E(s.number)}</span><button class="copy-btn" type="button" data-copy="${E(s.copy || s.number)}">${I('copy')}<span>Copy number</span></button></div>`);
  $$('[data-socials]').forEach(el => el.innerHTML = window.LAYOUT ? LAYOUT.socials() : '');
  fill('faqList', C.faq, f => `<details class="q"><summary>${E(f.q)}${I('caret-down')}</summary><p>${E(f.a)}</p></details>`);
  fill('dataRows', C.data, d => `<tr><td><b style="font-weight:500">${E(d.name)}</b><br><small>${E(String(d.file).split('/').pop())}</small></td><td>${E(d.features)}</td><td>${E(d.size)}</td><td>${E(d.source)}<br><small>${E(d.licence)}</small></td><td><a class="btn btn-soft btn-sm" href="${E(d.file)}" download>${I('download-simple', 'dn')}Download</a></td></tr>`);
  const cl = document.getElementById('contactLines');
  if (cl) cl.innerHTML = (S.email ? `<a href="mailto:${E(S.email)}"><span class="tile">${I('envelope-simple')}</span>${E(S.email)}</a>` : '')
    + (S.phone ? `<a href="tel:${E(S.phone)}"><span class="tile">${I('phone')}</span>${E(S.phoneDisplay || S.phone)}</a>` : '')
    + (S.location ? `<span><span class="tile">${I('map-pin')}</span>${E(S.location)}</span>` : '');
  $$('[data-version]').forEach(e => e.textContent = S.fallbackVersion || '');

  /* ---------------- opening sequence ---------------- */
  if (canAnim) root.classList.add('js-anim');
  $$('.hcopy .w').forEach((w, i) => w.style.setProperty('--i', i));
  $$('.rc').forEach((c, i) => c.style.setProperty('--i', i));
  $$('.phero .wrap > *').forEach((c, i) => c.style.setProperty('--i', i));
  requestAnimationFrame(() => setTimeout(() => root.classList.add('loaded'), 60));

  /* ---------------- reveals that replay on the way down ---------------- */
  const mark = (sel, kind, stagger) => $$(sel).forEach((el, i) => { if (!el.hasAttribute('data-r') || kind) el.setAttribute('data-r', kind || ''); el.style.setProperty('--d', stagger ? i % 4 : 0); });
  mark('.head'); mark('.nums > *', '', 1); mark('.bento > *', '', 1); mark('.steps > li', '', 1); mark('.whys > div', '', 1);
  mark('.portal'); mark('.res > a', '', 1); mark('.dl', 'zoom'); mark('.sup > .card', '', 1); mark('.contact > .lhs', 'left'); mark('.contact > form', 'right');
  mark('.video', 'zoom'); mark('.fgrid > *', '', 1); mark('.band'); mark('.stripbar'); mark('.vnote');
  mark('.reveal'); mark('.reveal-list > *', '', 1); mark('.tablebox'); mark('.rel', '', 1); mark('.stats > *', '', 1); mark('.panel');
  const counters = new Map();
  function count(el) { const to = +el.dataset.count, suf = el.dataset.suffix || '', fmt = v => Math.round(v).toLocaleString('en-GB') + suf;
    if (!canAnim || !isFinite(to)) { el.textContent = fmt(to || 0); return; }
    cancelAnimationFrame(counters.get(el)); const t0 = performance.now(), D = 1600;
    const step = t => { const k = Math.min(1, (t - t0) / D); el.textContent = fmt(to * (1 - Math.pow(2, -10 * k))); if (k < 1) counters.set(el, requestAnimationFrame(step)); else el.textContent = fmt(to); };
    counters.set(el, requestAnimationFrame(step)); }
  window.SITE_COUNT = count;
  const watched = () => [...$$('[data-r]'), ...$$('.steps')];
  let io = null;
  if (canAnim) {
    io = new IntersectionObserver(es => es.forEach(e => { const el = e.target;
      if (e.isIntersecting) { if (!el.classList.contains('in')) { el.classList.add('in'); $$('[data-count]', el).forEach(count); } }
      else if (e.boundingClientRect.top > 0) el.classList.remove('in');   /* gone below the screen: reset, so it plays again on the way down */
    }), { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    watched().forEach(el => io.observe(el));
  } else { watched().forEach(el => el.classList.add('in')); $$('[data-count]').forEach(count); }
  /* other scripts (tutorials, changelog, statistics) call this after they add cards */
  window.SITE_REVEAL = els => els.forEach((el, i) => { el.setAttribute('data-r', ''); el.style.setProperty('--d', i % 4); if (io) io.observe(el); else el.classList.add('in'); });

  /* ---------------- scroll-linked: progress, header state, hero depth, active link ---------------- */
  const prog = $('.progress'), nw = $('#navwrap'), dark = $('.hero, .phero'), rcards = $('.rcards'), hc = $('.hcopy');
  const spyLinks = $$('#links a[data-spy]').filter(a => document.getElementById(a.dataset.spy));
  let tick = false;
  function frame() { tick = false;
    const y = scrollY, max = root.scrollHeight - innerHeight;
    if (prog) prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (nw) nw.classList.toggle('ondark', !!dark && dark.getBoundingClientRect().bottom > 70);
    if (canAnim && rcards && y < innerHeight * 1.2) { rcards.style.translate = `0 ${(-y * .12).toFixed(1)}px`; hc.style.translate = `0 ${(y * .18).toFixed(1)}px`; hc.style.opacity = Math.max(0, 1 - y / 700).toFixed(3); }
    if (spyLinks.length) { let cur = null; spyLinks.forEach(a => { if (document.getElementById(a.dataset.spy).getBoundingClientRect().top < innerHeight * .45) cur = a; }); spyLinks.forEach(a => a.classList.toggle('on', a === cur)); }
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true }); addEventListener('resize', frame); frame();

  /* ---------------- soft light that follows the pointer over a dark hero ---------------- */
  if (canAnim && dark && matchMedia('(hover:hover)').matches) { const lamp = $('.ir b', dark);
    if (lamp) dark.addEventListener('pointermove', e => { const r = dark.getBoundingClientRect(); lamp.style.left = ((e.clientX - r.left) / r.width * 100) + '%'; lamp.style.top = ((e.clientY - r.top) / r.height * 100) + '%'; }); }

  /* ---------------- the moving strip: stops on touch, hover or focus; carries on after a pause ---------------- */
  const strip = $('#strip');
  if (strip && strip.children.length) {
    const bar = $('#stripbar'), state = $('#stripState');
    strip.insertAdjacentHTML('beforeend', strip.innerHTML);              /* a second copy for a seamless loop */
    [...strip.children].slice(strip.children.length / 2).forEach(a => { a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1; });
    let held = RM, resumeT = 0, pos = 0, last = 0, visible = false;
    const SPEED = 38;                                                    /* pixels per second */
    const say = (stopped, txt) => { if (bar) bar.classList.toggle('paused', stopped); if (state) state.textContent = txt; };
    const hold = () => { held = true; clearTimeout(resumeT); say(true, 'Stopped. Swipe to browse.'); };
    const release = ms => { if (RM) return; clearTimeout(resumeT); resumeT = setTimeout(() => { held = false; pos = strip.scrollLeft; say(false, 'Moving. Touch to stop.'); }, ms); };
    ['pointerdown', 'touchstart', 'focusin', 'wheel'].forEach(t => strip.addEventListener(t, hold, { passive: true }));
    strip.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hold(); });
    strip.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') release(600); });
    ['pointerup', 'touchend', 'focusout'].forEach(t => strip.addEventListener(t, () => release(3000), { passive: true }));
    strip.addEventListener('scroll', () => { if (held) { const half = strip.scrollWidth / 2; if (strip.scrollLeft >= half) strip.scrollLeft -= half; } }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => visible = es[0].isIntersecting).observe(strip); else visible = true;
    const run = t => { const dt = Math.min(64, t - (last || t)); last = t;
      if (!held && visible) { const half = strip.scrollWidth / 2; pos += SPEED * dt / 1000; if (pos >= half) pos -= half; strip.scrollLeft = pos; }
      requestAnimationFrame(run); };
    if (RM) say(true, 'Swipe to browse.'); requestAnimationFrame(run);
  }

  /* ---------------- phone menu ---------------- */
  const mb = $('#menuBtn'), mn = $('#mnav');
  if (mb && mn) { const set = o => { mn.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Close the menu' : 'Open the menu'); mb.innerHTML = I(o ? 'x' : 'list'); };
    mb.addEventListener('click', () => set(!mn.classList.contains('open')));
    mn.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); }); }

  /* ---------------- copy buttons ---------------- */
  document.addEventListener('click', async e => { const b = e.target.closest('[data-copy]'); if (!b) return; const lab = b.querySelector('span') || b, was = lab.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); lab.textContent = 'Copied'; b.classList.add('ok'); }
    catch (err) { const t = b.previousElementSibling; if (t) { const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } lab.textContent = 'Selected: press Ctrl+C'; }
    setTimeout(() => { lab.textContent = was; b.classList.remove('ok'); }, 1800); });

  /* ---------------- home video: plays this site's file, or the YouTube video set in config.js ---------------- */
  const hv = $('#homeVideo');
  if (hv) { const play = () => { hv.innerHTML = S.adVideoYoutube
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(S.adVideoYoutube)}?autoplay=1" title="Land Studio in one minute" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<video controls autoplay playsinline poster="/assets/img/ad-poster.jpg"><source src="/assets/video/land-studio-ad.mp4" type="video/mp4">Your browser cannot play this video. <a href="/assets/video/land-studio-ad.mp4" download>Download it</a>.</video>`; };
    const btn = $('.playbtn', hv); if (btn) btn.addEventListener('click', play); }

  /* ---------------- live release information from GitHub (free, no key) ---------------- */
  const relPage = S.githubRepo ? `https://github.com/${S.githubRepo}/releases/latest` : '#';
  $$('[data-dl]').forEach(a => a.href = relPage);
  $$('[data-relnotes]').forEach(a => a.href = '/changelog/');
  const mbs = n => n > 1e6 ? (n / 1e6).toFixed(0) + ' MB' : Math.round(n / 1e3) + ' kB';
  (async function release() { if (!S.githubRepo || !$('[data-dl],[data-dlcount],[data-size]')) return;
    try { const r = await fetch(`https://api.github.com/repos/${S.githubRepo}/releases?per_page=30`, { headers: { Accept: 'application/vnd.github+json' } }); if (!r.ok) return;
      const list = (await r.json()).filter(x => !x.draft && !x.prerelease); if (!list.length) return;
      const L = list[0], exe = (L.assets || []).find(a => /\.exe$/i.test(a.name)) || (L.assets || []).find(a => /\.msi$/i.test(a.name));
      $$('[data-version]').forEach(e => e.textContent = String(L.tag_name || '').replace(/^v/i, ''));
      if (exe) { $$('[data-dl]').forEach(a => a.href = exe.browser_download_url); $$('[data-size]').forEach(e => e.textContent = mbs(exe.size)); }
      const total = list.reduce((s, x) => s + (x.assets || []).reduce((t, a) => t + (a.download_count || 0), 0), 0);
      $$('[data-dlcount]').forEach(e => { e.textContent = total.toLocaleString('en-GB'); });
    } catch (err) { /* offline or rate-limited: the release page link still works */ } })();

  /* ---------------- contact form: checks the fields, then opens the visitor's e-mail app ---------------- */
  const f = $('#contactForm');
  if (f) f.addEventListener('submit', e => { e.preventDefault(); const msg = $('#formMsg'); let ok = true, first = null;
    const need = (id, test) => { const el = $('#' + id); if (!el) return; const good = test(el.value.trim()); el.closest('.field').classList.toggle('bad', !good); if (!good) { ok = false; first = first || el; } };
    need('cName', v => v.length >= 2); need('cEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)); need('cMsg', v => v.length >= 10);
    if (!ok) { msg.className = 'msg bad'; msg.textContent = 'Please fix the highlighted fields, then send again.'; first.focus(); return; }
    const org = $('#cOrg') ? $('#cOrg').value.trim() : '';
    const body = `${$('#cMsg').value.trim()}\n\n${$('#cName').value.trim()}${org ? ', ' + org : ''}\n${$('#cEmail').value.trim()}`;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent('Website: ' + $('#cTopic').value)}&body=${encodeURIComponent(body)}`;
    msg.className = 'msg ok'; msg.textContent = 'Your e-mail app has opened with the message ready. Press Send there. If nothing opened, write to ' + S.email + '.'; });
})();
