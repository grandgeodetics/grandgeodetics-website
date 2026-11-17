/* Grand Geodetics website — the menu and the footer of every page, drawn from assets/js/content.js and
   assets/js/config.js, so a change there shows on every page at once. Also gives every script ICON() and ESC(). */
(function () {
  const C = window.CONTENT || {}, S = window.SITE || {};
  const SPRITE = '/assets/img/icons.svg';
  const ESC = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICON = (name, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="${SPRITE}#i-${ESC(name)}"/></svg>`;
  window.ICON = ICON; window.ESC = ESC;

  const path = location.pathname.replace(/index\.html$/, '');
  const isHome = path === '/';
  /* on the home page, "/#section" links scroll in place */
  const local = href => (isHome && /^\/#/.test(href)) ? href.slice(1) : href;
  const here = href => !/#/.test(href) && href !== '/' && path.indexOf(href) === 0;

  function header() {
    const nav = C.nav || [], more = C.navMore || [];
    const link = (n, mobile) => `<a href="${ESC(local(n.href))}"${n.spy ? ` data-spy="${ESC(n.spy)}"` : ''}${here(n.href) ? ' class="on" aria-current="page"' : ''}>${mobile ? ICON(n.icon || 'caret-right') : ''}${ESC(n.label)}</a>`;
    return `<div class="progress" aria-hidden="true"><i></i></div>
<div class="navwrap" id="navwrap">
  <nav class="nav" aria-label="Main">
    <a class="brand" href="/"><img src="/assets/img/orb.svg" alt="" width="28" height="28">Grand Geodetics</a>
    <div class="links" id="links">${nav.map(n => link(n)).join('')}</div>
    <button class="menu" id="menuBtn" type="button" aria-label="Open the menu" aria-expanded="false" aria-controls="mnav">${ICON('list')}</button>
    <a class="cta" href="${ESC(local('/#download'))}">${ICON('download-simple')}<span>Download</span></a>
  </nav>
  <nav class="mnav" id="mnav" aria-label="Phone menu">${nav.map(n => link(n, true)).join('')}${more.length ? '<hr>' + more.map(n => link(n, true)).join('') : ''}</nav>
</div>`;
  }

  function socials() {
    return (C.socials || []).filter(s => s.url).map(s => `<a href="${ESC(s.url)}" aria-label="${ESC(s.name)}" title="${ESC(s.name)}" target="_blank" rel="noopener">${ICON(s.icon)}</a>`).join('');
  }

  function footer() {
    const p = C.parent || {};
    const cols = (C.footer || []).map(c => `<div><b>${ESC(c.title)}</b><nav aria-label="${ESC(c.title)}">${(c.links || []).map(l => `<a href="${ESC(local(l.href))}">${ESC(l.label)}</a>`).join('')}</nav></div>`).join('');
    return `<div class="grain"></div>
<div class="wrap">
  ${p.title ? `<div class="parent" id="ciba" data-r><div><b>${ESC(p.title)}</b><p>${ESC(p.text)}</p></div>${p.link ? `<a href="${ESC(p.link)}">${ICON('envelope-simple')}${ESC(p.linkLabel || 'Contact')}</a>` : ''}</div>` : ''}
  <div class="fgrid">
    <div class="fbrand" data-r><span class="nm"><img src="/assets/img/logo-white.svg" alt="" width="28" height="28">Grand Geodetics</span>
      <p style="font-size:15px;max-width:22em">Navigating sustainability with precision.</p>
      <div class="lines">${S.email ? `<a href="mailto:${ESC(S.email)}">${ICON('envelope-simple')}${ESC(S.email)}</a>` : ''}${S.phone ? `<a href="tel:${ESC(S.phone)}">${ICON('phone')}${ESC(S.phoneDisplay || S.phone)}</a>` : ''}${S.location ? `<span>${ICON('map-pin')}${ESC(S.location)}</span>` : ''}</div>
      <div class="social" aria-label="Social media">${socials()}</div></div>
    ${cols}
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} Grand Geodetics Inc., an affiliate of Ciba Creatives. Dedicated for Malawi Ministry of Lands.</span><span>Boundaries: geoBoundaries (CC BY 4.0). Lakes, rivers, roads and towns: Natural Earth.</span><a class="totop" href="#top">${ICON('arrow-down')}Back to top</a></div>
</div>`;
  }

  /* the header draws straight away (this script sits right after its placeholder); the footer once the page has loaded */
  const h = document.getElementById('siteHeader'); if (h) h.outerHTML = header();
  const drawFooter = () => { const f = document.getElementById('siteFooter'); if (f && !f.dataset.done) { f.innerHTML = footer(); f.dataset.done = '1'; } };
  window.LAYOUT = { header, footer, socials, drawFooter };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawFooter); else drawFooter();
})();
