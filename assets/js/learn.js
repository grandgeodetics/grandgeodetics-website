/* Learn page: tutorial cards from the tutorials list in assets/js/content.js. A card plays its YouTube video or its
   own file in the big player; tutorials without a video yet show as "Coming soon". */
(function () {
  const C = window.CONTENT || {}, S = window.SITE || {}, T = C.tutorials || S.tutorials || [], I = window.ICON, E = window.ESC;
  const grid = document.getElementById('tuts'), player = document.getElementById('player'), ttl = document.getElementById('playerTitle');
  if (!grid) return;
  const has = t => !!(t.youtube || t.file);
  const thumb = t => t.youtube ? `https://i.ytimg.com/vi/${encodeURIComponent(t.youtube)}/hqdefault.jpg` : t.poster || '';
  function play(t, auto) {
    ttl.textContent = t.title;
    player.innerHTML = t.youtube ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(t.youtube)}${auto ? '?autoplay=1' : ''}" title="${E(t.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`
      : `<video controls preload="none" playsinline ${t.poster ? `poster="${E(t.poster)}"` : ''} ${auto ? 'autoplay' : ''}><source src="${E(t.file)}" type="video/mp4">Your browser cannot play this video. <a href="${E(t.file)}" download>Download it</a>.</video>`;
  }
  grid.innerHTML = T.map((t, i) => `<div class="card lift">${has(t)
      ? `<button type="button" class="thumb" data-i="${i}" style="background-image:url('${E(thumb(t))}')" aria-label="Play ${E(t.title)}"><span>${I('play')}</span></button>`
      : `<div class="soon">${I('video-camera')}Coming soon</div>`}
    <div class="body"><h3>${E(t.title)}</h3><p>${E(t.about || '')}</p><small>${I('timer')}${t.minutes ? t.minutes + ' min' : ''}${has(t) ? '' : ' · not recorded yet'}</small></div></div>`).join('');
  if (window.SITE_REVEAL) SITE_REVEAL([...grid.children]);
  grid.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; play(T[+b.dataset.i], true); player.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  const first = T.find(has); if (first) play(first, false); else player.closest('.vbox').hidden = true;
})();
