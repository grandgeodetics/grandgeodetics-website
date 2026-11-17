/* Verify a sketch plan.
   The QR code on a Land Studio plan holds: GLS1 | reference | sheet | area m² | beacons | fingerprint.
   New plans print it as a link, https://…/verify/#GLS1~ref~sheet~…, so a phone camera opens this page; the part
   after # never leaves the phone. The page checks the code against /verify/plans.json, the list of issued plans
   that Grand Geodetics signs with its private key (ECDSA P-256). The list holds no names, places or coordinates.
   Everything runs in the visitor's browser; nothing is sent anywhere. */
(function () {
  const $ = id => document.getElementById(id);
  const PUB = { kty: 'EC', crv: 'P-256', x: 'mXzmXdLiEPXqzQJ-g1pEOP8VrFWs24PF5m_zsHxO8xM', y: 'lgmhjchSHTQuNSdVEMpHzR9TNkFxdXm0NnGcr0UUIrc' };
  const te = new TextEncoder(), esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const unb = t => Uint8Array.from(atob(t.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((t.length + 3) % 4)), c => c.charCodeAt(0));
  const day = d => { const t = Date.parse(d); return isNaN(t) ? '—' : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };

  /* the signed list */
  let list = null, listErr = '';
  const ready = (async () => {
    try {
      const r = await fetch('/verify/plans.json', { cache: 'no-cache' });
      if (r.status === 404) { listErr = 'none'; return; }
      if (!r.ok) throw new Error('fetch');
      const j = await r.json(), key = await crypto.subtle.importKey('jwk', PUB, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, unb(j.sig), te.encode('GLS-LIST|' + j.body));
      if (!ok) { listErr = 'forged'; return; }
      const d = JSON.parse(new TextDecoder().decode(unb(j.body)));
      list = { signed: d.signed, map: new Map(d.plans.map(p => [p.r, p])), n: d.plans.length };
    } catch (e) { listErr = 'offline'; }
    $('vfList').textContent = list ? `Checked against ${list.n.toLocaleString('en-GB')} issued plan${list.n === 1 ? '' : 's'}, list signed by Grand Geodetics on ${day(list.signed)}.`
      : listErr === 'none' ? 'No plan list has been published yet.' : listErr === 'forged' ? 'The plan list on this site failed its signature check.' : 'The plan list could not be loaded. Check the internet connection and reload.';
  })();

  /* read a code: a link with # or the plain text */
  function parse(raw) {
    let t = String(raw || '').trim(); const h = t.indexOf('#');
    if (h >= 0 && /^https?:|^\/|^#/i.test(t)) { t = t.slice(h + 1); try { t = decodeURI(t); } catch (e) { } t = t.replace(/~/g, '|'); }
    const p = t.split('|'); if (p[0] !== 'GLS1' || p.length < 6) return null;
    return { ref: p[1], sheet: p[2], area: +p[3], beacons: p[4] ? p[4].split(';').filter(Boolean).length : 0, fp: p[5].trim().toUpperCase() };
  }
  function show(cls, title, html) { const v = $('vfOut'); v.className = 'verdict show ' + cls; v.innerHTML = `<h3>${title}</h3>${html}`; v.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }
  async function check(raw) {
    const c = parse(raw);
    if (!c) return show('bad', 'Not a Land Studio plan code', '<p>The code must come from the QR code on a Land Studio sketch plan. It is a link to this page, or text that starts with GLS1|. Scan it again, or paste the whole text.</p>');
    await ready;
    if (!list) return show('warn', 'Cannot check this plan yet', `<p>${listErr === 'none' ? 'Grand Geodetics has not published the list of issued plans yet.' : listErr === 'forged' ? 'The list on this site is not signed by Grand Geodetics, so it cannot be trusted. Please tell us at the contact address below.' : 'The list of issued plans could not be loaded. Check the internet connection and try again.'}</p><p>The code reads plan <b>${esc(c.ref)}</b>, sheet ${esc(c.sheet)}, ${(c.area / 1e4).toFixed(4)} Ha, ${c.beacons} beacons.</p>`);
    const r = list.map.get(c.ref);
    const facts = r => `<dl><dt>Plan reference</dt><dd>${esc(r.r)}</dd><dt>District</dt><dd>${esc(r.k || '—')}</dd><dt>Map sheet</dt><dd>${esc(r.s || '—')}</dd><dt>Area</dt><dd>${(r.a / 1e4).toFixed(4)} Ha (${Math.round(r.a).toLocaleString('en-GB')} m²)</dd><dt>Beacons</dt><dd>${r.b}</dd><dt>First issued</dt><dd>${day(r.d)}</dd>${r.st ? `<dt>Status</dt><dd>${esc(r.st)}</dd>` : ''}<dt>Fingerprint</dt><dd>${esc(r.f)}</dd></dl>`;
    if (!r) return show('warn', 'This plan is not in the issued list', `<p>No plan with reference <b>${esc(c.ref)}</b> is in the list signed on ${day(list.signed)}. A plan issued after that date may not be listed yet. Ask the land office that issued it, quoting the reference.</p>`);
    const diffs = [];
    if (r.f.toUpperCase() !== c.fp) diffs.push('fingerprint');
    if (r.s && c.sheet && r.s !== c.sheet) diffs.push('map sheet');
    if (r.a && Math.abs(r.a - c.area) > 1) diffs.push('area');
    if (r.b && c.beacons && r.b !== c.beacons) diffs.push('number of beacons');
    if (diffs.length) return show('bad', 'Does not match the issued plan', `<p>The reference <b>${esc(c.ref)}</b> is in the list, but the ${diffs.join(', ')} on this paper differ${diffs.length === 1 ? 's' : ''} from what was issued. The plan may have been altered, or replaced by a newer version. Do not rely on it; contact the land office that issued it.</p>${facts(r)}`);
    if (/WITHDRAWN|CANCEL|REVOKED/i.test(r.st || '')) return show('bad', 'This plan has been withdrawn', `<p>The plan matches the issued record, but the issuing office has marked it ${esc(r.st)}.</p>${facts(r)}`);
    show('ok', '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Genuine: matches the issued plan', `<p>The reference, fingerprint, sheet, area and beacons on this plan match the list signed by Grand Geodetics. Compare the details below with the paper.</p>${facts(r)}`);
  }
  $('vfGo').addEventListener('click', () => check($('vfText').value));
  $('vfText').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) check($('vfText').value); });
  if (location.hash.length > 5) { const raw = location.href; $('vfText').value = decodeURIComponent(location.hash.slice(1)).replace(/~/g, '|'); check(raw); }

  /* camera scanning: the browser's own detector when it has one, otherwise jsQR */
  let stream = null, timer = 0;
  const det = 'BarcodeDetector' in window ? new BarcodeDetector({ formats: ['qr_code'] }) : null;
  const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
  async function decodeFrom(src, w, h) {
    if (det) { try { const r = await det.detect(src); if (r[0]) return r[0].rawValue; } catch (e) { } }
    if (!window.jsQR) return null; const s = Math.min(1, 1000 / Math.max(w, h)); cv.width = Math.round(w * s); cv.height = Math.round(h * s); cx.drawImage(src, 0, 0, cv.width, cv.height);
    const r = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: 'dontInvert' }); return r ? r.data : null; }
  function stop() { clearTimeout(timer); if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; $('vfCam').classList.remove('on'); $('vfScan').textContent = 'Scan with the camera'; }
  $('vfScan').addEventListener('click', async () => {
    if (stream) return stop();
    try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); }
    catch (e) { $('vfMsg').textContent = 'The camera could not start. Allow camera access for this site, or use "Choose a photo" instead.'; return; }
    $('vfMsg').textContent = 'Hold the QR code inside the square.'; const v = $('vfVideo'); v.srcObject = stream; await v.play(); $('vfCam').classList.add('on'); $('vfScan').textContent = 'Stop the camera';
    const tick = async () => { if (!stream) return; if (v.readyState >= 2) { const t = await decodeFrom(v, v.videoWidth, v.videoHeight); if (t) { stop(); $('vfMsg').textContent = ''; $('vfText').value = t; check(t); return; } } timer = setTimeout(tick, 220); }; tick(); });
  $('vfPhoto').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; $('vfMsg').textContent = 'Reading the photo…';
    try { const img = await createImageBitmap(f); const t = await decodeFrom(img, img.width, img.height); if (!t) { $('vfMsg').textContent = 'No QR code found in that photo. Take it closer, flat and in good light.'; return; } $('vfMsg').textContent = ''; $('vfText').value = t; check(t); }
    catch (err) { $('vfMsg').textContent = 'That file could not be read as a photo.'; } e.target.value = ''; });
  window.addEventListener('pagehide', stop);
})();
