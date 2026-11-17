/* What's new: every published release of the repository in config.js, newest first, with its notes.
   The notes are whatever you write in the GitHub release description (Markdown: headings, lists, bold, links). */
(async function () {
  const S = window.SITE || {}, box = document.getElementById('clList');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fail = m => { box.innerHTML = `<p class="empty">${m}</p>`; };
  /* a small, safe Markdown reader: escapes everything first, then adds headings, lists, bold, italics, code and links */
  function md(src) {
    const inline = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
    let out = '', list = false;
    for (const raw of String(src || '').replace(/\r/g, '').split('\n')) {
      const l = raw.trimEnd(), li = l.match(/^\s*[-*+]\s+(.*)/), h = l.match(/^(#{1,4})\s+(.*)/);
      if (li) { if (!list) { out += '<ul>'; list = true; } out += `<li>${inline(li[1])}</li>`; continue; }
      if (list) { out += '</ul>'; list = false; }
      if (h) out += `<h${h[1].length < 3 ? 3 : 4}>${inline(h[2])}</h${h[1].length < 3 ? 3 : 4}>`; else if (l.trim()) out += `<p>${inline(l)}</p>`;
    }
    return out + (list ? '</ul>' : '');
  }
  if (!S.githubRepo) return fail('Set githubRepo in assets/js/config.js to show the version history.');
  let rel;
  try { const r = await fetch(`https://api.github.com/repos/${S.githubRepo}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } });
    if (r.status === 404) return fail('No versions are published yet. The first release on GitHub will appear here.');
    if (r.status === 403) return fail('GitHub is limiting requests from this network for a while. Try again in an hour.');
    if (!r.ok) return fail('GitHub could not be reached. Try again later.'); rel = (await r.json()).filter(x => !x.draft); }
  catch (e) { return fail('GitHub could not be reached. Check the internet connection and reload.'); }
  if (!rel.length) return fail('No versions are published yet.');
  box.innerHTML = rel.map((x, i) => { const exe = (x.assets || []).find(a => /\.(exe|msi)$/i.test(a.name));
    return `<article class="rel${i ? '' : ' latest'}" id="${esc(x.tag_name)}"><h2>${esc(x.name || x.tag_name)}<small>${new Date(x.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}${i ? '' : ' · latest'}${x.prerelease ? ' · preview' : ''}</small></h2>
    <div class="notes">${md(x.body) || '<p>No notes for this version.</p>'}</div>${exe ? `<p style="margin-top:12px"><a class="btn btn-soft btn-sm" href="${esc(exe.browser_download_url)}">${window.ICON ? ICON('download-simple', 'dn') : ''}Download ${esc(x.tag_name)}</a></p>` : ''}</article>`; }).join('');
  if (window.SITE_REVEAL) SITE_REVEAL([...box.children]);
})();
