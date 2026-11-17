/* Training request: checks the form, then hands the request to the visitor's own e-mail app or WhatsApp.
   The website stores nothing and sends nothing by itself. */
(function () {
  const S = window.SITE || {}, f = document.getElementById('trForm'), $ = id => document.getElementById(id);
  if (!f) return;
  const need = [['trOffice', v => v.length > 1], ['trDistrict', v => !!v], ['trName', v => v.length > 1], ['trPhone', v => /\d{7,}/.test(v.replace(/\D/g, '')) ], ['trPeople', v => +v >= 1 && +v <= 200]];
  function text() {
    const mods = [...f.querySelectorAll('input[name=mod]:checked')].map(i => '- ' + i.value).join('\n') || '- Not sure yet';
    const v = id => $(id).value.trim();
    return `Training request for Land Studio\n\nOffice: ${v('trOffice')}\nDistrict: ${v('trDistrict')}\nContact person: ${v('trName')}${v('trRole') ? ' (' + v('trRole') + ')' : ''}\nPhone: ${v('trPhone')}${v('trEmail') ? '\nE-mail: ' + v('trEmail') : ''}\nPeople to train: ${v('trPeople')}\nComputers: ${v('trPcs')}\nPreferred dates: ${v('trDates') || 'Flexible'}\nFormat: ${v('trMode')}\n\nTopics:\n${mods}${v('trNotes') ? '\n\nNotes:\n' + v('trNotes') : ''}`;
  }
  function valid() { let ok = true, first = null;
    need.forEach(([id, t]) => { const el = $(id), good = t(el.value.trim()); el.closest('.field').classList.toggle('bad', !good); if (!good) { ok = false; first = first || el; } });
    const em = $('trEmail'), eok = !em.value.trim() || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim()); em.closest('.field').classList.toggle('bad', !eok); if (!eok) { ok = false; first = first || em; }
    const m = $('trMsg'); if (!ok) { m.className = 'msg bad'; m.textContent = 'Some details are missing. Check the fields marked in red.'; first.focus(); } return ok; }
  f.addEventListener('submit', e => { e.preventDefault(); if (!valid()) return;
    location.href = `mailto:${S.email || ''}?subject=${encodeURIComponent('Training request: ' + $('trOffice').value.trim() + ', ' + $('trDistrict').value)}&body=${encodeURIComponent(text())}`;
    const m = $('trMsg'); m.className = 'msg ok'; m.textContent = 'Your e-mail app should open with the request filled in. Press Send there. If nothing opened, use WhatsApp or e-mail us directly.'; });
  $('trWa').addEventListener('click', () => { if (!valid()) return; window.open(`https://wa.me/${String(S.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(text())}`, '_blank', 'noopener');
    const m = $('trMsg'); m.className = 'msg ok'; m.textContent = 'WhatsApp opens with the request filled in. Press Send there.'; });
})();
