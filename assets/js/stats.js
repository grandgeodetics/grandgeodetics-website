/* Download statistics page: reads every published release of the repository in config.js from the GitHub API
   (free, no key, 60 requests an hour per visitor) and shows totals, a bar chart and a table. */
(async function () {
  const S = window.SITE || {}, $ = id => document.getElementById(id), esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fail = msg => { $('stChart').innerHTML = `<p class="empty">${msg}</p>`; $('stRows').innerHTML = `<tr><td colspan="5" class="empty">${msg}</td></tr>`; };
  if (!S.githubRepo) return fail('Set githubRepo in assets/js/config.js to show statistics.');
  let list;
  try { const r = await fetch(`https://api.github.com/repos/${S.githubRepo}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } });
    if (r.status === 404) return fail('No releases are published yet. Publish the first installer on GitHub and the numbers appear here.');
    if (r.status === 403) return fail('GitHub is limiting requests from this network for a while. Try again in an hour.');
    if (!r.ok) return fail('GitHub could not be reached. Try again later.'); list = (await r.json()).filter(x => !x.draft); }
  catch (e) { return fail('GitHub could not be reached. Check the internet connection and reload.'); }
  if (!list.length) return fail('No releases are published yet.');
  const sum = x => (x.assets || []).reduce((t, a) => t + (a.download_count || 0), 0), total = list.reduce((s, x) => s + sum(x), 0), latest = list[0];
  const set = (id, v) => { const e = $(id); e.dataset.count = v; e.textContent = v.toLocaleString('en-GB'); };
  set('stTotal', total); set('stLatest', sum(latest)); set('stReleases', list.length); set('stDays', Math.max(0, Math.floor((Date.now() - Date.parse(latest.published_at)) / 864e5)));
  const rows = list.slice().reverse(), max = Math.max(1, ...rows.map(sum)), W = 900, bw = Math.max(18, Math.min(60, (W - 80) / rows.length - 12)), H = 260;
  $('stChart').innerHTML = `<svg viewBox="0 0 ${W} ${H + 40}" role="img" aria-label="Downloads per version" style="width:100%;height:auto">${rows.map((x, i) => { const v = sum(x), h = Math.round(v / max * H), xx = 50 + i * ((W - 80) / rows.length); return `<rect x="${xx}" y="${H - h + 10}" width="${bw}" height="${h}" rx="6" fill="${i === rows.length - 1 ? '#8e1b2a' : '#1a5c9e'}"><title>${esc(x.tag_name)}: ${v} downloads</title></rect><text x="${xx + bw / 2}" y="${H - h + 2}" text-anchor="middle" font-size="13" fill="#0d2440">${v}</text><text x="${xx + bw / 2}" y="${H + 32}" text-anchor="middle" font-size="13" fill="#5a6b7b">${esc(String(x.tag_name).replace(/^v/i, ''))}</text>`; }).join('')}<line x1="40" y1="${H + 10}" x2="${W - 20}" y2="${H + 10}" stroke="#c9d8e6"/></svg>`;
  const mb = n => n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.round(n / 1e3) + ' kB';
  $('stRows').innerHTML = list.flatMap(x => (x.assets && x.assets.length ? x.assets : [{ name: '(no files)', size: 0, download_count: 0 }]).map((a, i) => `<tr><td>${i ? '' : `<a href="${esc(x.html_url)}">${esc(x.tag_name)}</a>`}</td><td>${i ? '' : new Date(x.published_at).toLocaleDateString('en-GB')}</td><td>${esc(a.name)}</td><td>${a.size ? mb(a.size) : '—'}</td><td>${(a.download_count || 0).toLocaleString('en-GB')}</td></tr>`)).join('');
})();
