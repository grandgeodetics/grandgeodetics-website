/* Malawi Geoportal — a static web map (OpenLayers). Every file is served from the website itself, so it handles
   as many visitors as the hosting does; only the optional OpenStreetMap background comes from elsewhere.
   To add a layer: put its GeoJSON (WGS 84) in /data/ and add a line to LAYERS below.
   Layers marked optional appear only when their file is in /data/ (protected areas and flood-prone areas). */
(function () {
  const $ = id => document.getElementById(id);
  /* kind: area | line | point. Drawn bottom to top in this order; listed top to bottom in reverse. */
  const LAYERS = [
    { id: 'flood', name: 'Flood-prone areas', kind: 'area', file: '/data/malawi_flood_prone.geojson', fill: 'rgba(216,74,52,.28)', stroke: '#b8432f', width: 1, label: 'name', on: true, optional: true },
    { id: 'protected', name: 'Protected areas', kind: 'area', file: '/data/malawi_protected_areas.geojson', fill: 'rgba(76,155,90,.25)', stroke: '#3c7d48', width: 1.2, label: 'name', on: true, optional: true },
    { id: 'lakes', name: 'Lakes', kind: 'area', file: '/data/malawi_lakes.geojson', fill: 'rgba(158,201,236,.9)', stroke: '#4f8fc7', width: 1, label: 'name', on: true },
    { id: 'districts', name: 'Districts', kind: 'area', file: '/data/malawi_districts.geojson', fill: 'rgba(42,120,194,.05)', stroke: '#4a6a8a', width: 1.2, dash: [6, 4], label: 'district', on: true },
    { id: 'regions', name: 'Regions', kind: 'area', file: '/data/malawi_regions.geojson', fill: 'rgba(42,120,194,.06)', stroke: '#0f4a86', width: 2, label: 'name', on: false },
    { id: 'rivers', name: 'Rivers', kind: 'line', file: '/data/malawi_rivers.geojson', stroke: '#3f86c9', width: 2.2, label: 'name', on: true },
    { id: 'railways', name: 'Railway', kind: 'line', file: '/data/malawi_railways.geojson', stroke: '#5b4636', width: 1.6, dash: [8, 5], on: false },
    { id: 'roads', name: 'Main roads', kind: 'line', file: '/data/malawi_roads.geojson', stroke: '#c9772b', width: 2, on: true },
    { id: 'country', name: 'National boundary', kind: 'area', file: '/data/malawi_country.geojson', fill: 'rgba(0,0,0,0)', stroke: '#0d2440', width: 2.6, on: true },
    { id: 'towns', name: 'Cities and district centres', kind: 'point', file: '/data/malawi_towns.geojson', fill: '#0d2440', stroke: '#fff', label: 'name', on: true }];
  proj4.defs('EPSG:20936', '+proj=utm +zone=36 +south +ellps=clrk80ip +towgs84=-143,-90,-294,0,0,0,0 +units=m +no_defs');
  const fmt = new ol.format.GeoJSON(), selStyle = new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#b3263a', width: 3.5 }), fill: new ol.style.Fill({ color: 'rgba(179,38,58,.14)' }), image: new ol.style.Circle({ radius: 7, fill: new ol.style.Fill({ color: '#b3263a' }), stroke: new ol.style.Stroke({ color: '#fff', width: 2 }) }) });
  let selected = null;
  const txt = (t, o = {}) => new ol.style.Text({ text: t, font: `${o.w || 600} ${o.s || 13}px Outfit, sans-serif`, fill: new ol.style.Fill({ color: o.c || '#0d2440' }), stroke: new ol.style.Stroke({ color: '#fff', width: 3.5 }), overflow: true, offsetY: o.dy || 0, placement: o.line ? 'line' : 'point', textAlign: o.align });
  const styleFor = L => (f, res) => {
    if (f === selected) return selStyle;
    if (L.kind === 'point') { const big = /Capital|City/.test(f.get('kind') || ''); if (!big && res > 1600) return null;
      return new ol.style.Style({ image: new ol.style.Circle({ radius: big ? 5.5 : 4, fill: new ol.style.Fill({ color: L.fill }), stroke: new ol.style.Stroke({ color: L.stroke, width: 1.6 }) }), text: res < (big ? 4000 : 1600) ? txt(String(f.get('name') || ''), { s: big ? 14 : 12, w: big ? 600 : 500, dy: -13 }) : undefined }); }
    if (L.kind === 'line') { const minor = f.get('class') === 'secondary'; if (minor && res > 1200) return null;
      const s = [new ol.style.Style({ stroke: new ol.style.Stroke({ color: L.stroke, width: minor ? L.width * .6 : L.width, lineDash: L.dash }) })];
      if (L.label && res < 1500 && f.get(L.label)) s.push(new ol.style.Style({ text: txt(String(f.get(L.label)), { s: 12, w: 500, c: '#1f5d96', line: true }) })); return s; }
    const s = [new ol.style.Style({ stroke: new ol.style.Stroke({ color: L.stroke, width: L.width, lineDash: L.dash }), fill: new ol.style.Fill({ color: L.fill }) })];
    if (L.label && f.get(L.label) && res < (L.id === 'districts' ? 900 : L.id === 'lakes' || L.id === 'regions' ? 4000 : 600)) s.push(new ol.style.Style({ text: txt(String(f.get(L.label))) })); return s; };
  const base = new ol.layer.Tile({ source: new ol.source.OSM(), opacity: .9 });
  const vec = {}; LAYERS.forEach(L => { vec[L.id] = new ol.layer.Vector({ source: new ol.source.Vector(), style: styleFor(L), visible: L.on, declutter: L.kind === 'point' }); vec[L.id].set('meta', L); });
  const measureSrc = new ol.source.Vector(), measureLyr = new ol.layer.Vector({ source: measureSrc, style: new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#b3263a', width: 3, lineDash: [8, 6] }) }) });
  const home = ol.proj.transformExtent([32.6, -17.2, 36.0, -9.3], 'EPSG:4326', 'EPSG:3857');
  const map = new ol.Map({ target: 'map', layers: [base, ...LAYERS.map(L => vec[L.id]), measureLyr], view: new ol.View({ center: ol.extent.getCenter(home), zoom: 6, minZoom: 5, maxZoom: 18 }), controls: ol.control.defaults.defaults ? ol.control.defaults.defaults({ attribution: true }).extend([new ol.control.ScaleLine(), new ol.control.FullScreen()]) : undefined });
  function fromHash() { const m = location.hash.match(/^#(\d+(?:\.\d+)?)\/(-?\d+\.\d+)\/(-?\d+\.\d+)$/); if (m) { map.getView().setZoom(+m[1]); map.getView().setCenter(ol.proj.fromLonLat([+m[3], +m[2]])); return true; } return false; }
  if (!fromHash()) map.getView().fit(home, { padding: [20, 20, 20, 20] });

  /* load every layer; optional layers stay out of the list when their file is not on the site */
  const loaded = {};
  const load = L => fetch(L.file).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(j => { vec[L.id].getSource().addFeatures(fmt.readFeatures(j, { featureProjection: 'EPSG:3857' })); loaded[L.id] = true; }).catch(() => { loaded[L.id] = false; });
  Promise.all(LAYERS.map(load)).then(() => { listLayers(); fillSearch(); });

  /* layer list with a download link for each */
  const swatch = L => L.kind === 'line' ? `<span class="sw line" style="border-color:${L.stroke};${L.dash ? 'border-top-style:dashed;' : ''}"></span>` : L.kind === 'point' ? `<span class="sw pt" style="background:${L.fill}"></span>` : `<span class="sw" style="background:${L.fill};border-color:${L.stroke}"></span>`;
  function listLayers() {
    const shown = LAYERS.filter(L => loaded[L.id] || !L.optional).reverse();
    $('gpLayers').innerHTML = shown.map(L => `<div class="lyr"><input type="checkbox" id="l_${L.id}" ${L.on ? 'checked' : ''} ${loaded[L.id] ? '' : 'disabled'}>${swatch(L)}<label for="l_${L.id}">${L.name}${loaded[L.id] ? '' : ' <small>(not available)</small>'}</label>${loaded[L.id] ? `<a href="${L.file}" download title="Download ${L.name} as GeoJSON">GeoJSON</a>` : '<span></span>'}</div>`).join('');
    shown.forEach(L => $('l_' + L.id).addEventListener('change', e => vec[L.id].setVisible(e.target.checked)));
  }
  $('gpBase').addEventListener('change', e => base.setVisible(e.target.value === 'osm'));

  /* search: districts and towns */
  let places = [];
  function fillSearch() {
    places = vec.districts.getSource().getFeatures().map(f => ({ n: String(f.get('district')), t: 'District', f, id: 'districts' }))
      .concat(vec.towns.getSource().getFeatures().map(f => ({ n: String(f.get('name')), t: f.get('kind') || 'Town', f, id: 'towns' })))
      .sort((a, b) => a.n.localeCompare(b.n));
    $('gpList').innerHTML = places.map(p => `<option value="${p.n}">${p.t}</option>`).join('');
  }
  function findPlace() { const q = $('gpFind').value.trim().toLowerCase(); if (!q) return; const hit = places.find(p => p.n.toLowerCase() === q && p.id === 'districts') || places.find(p => p.n.toLowerCase() === q) || places.find(p => p.n.toLowerCase().startsWith(q));
    if (!hit) { $('gpFindMsg').textContent = 'Nothing by that name. Check the spelling, for example Zomba, Nkhata Bay or Liwonde.'; return; } $('gpFindMsg').textContent = ''; select(hit.f, hit.id);
    const g = hit.f.getGeometry(); if (g.getType() === 'Point') map.getView().animate({ center: g.getCoordinates(), zoom: 11, duration: 500 }); else map.getView().fit(g.getExtent(), { padding: [40, 40, 40, 40], duration: 500 }); }
  $('gpFind').addEventListener('change', findPlace); $('gpFind').addEventListener('keydown', e => { if (e.key === 'Enter') findPlace(); });

  /* click: name with area, length or position */
  const nf = (v, d) => v.toLocaleString('en-GB', { maximumFractionDigits: d });
  function select(f, lid) { selected = f; Object.values(vec).forEach(v => v.changed()); const L = vec[lid].get('meta'), p = f.getProperties(), g = f.getGeometry(), t = g.getType();
    const name = p.district ? p.district + ' District' : p.name || L.name; let line = '';
    if (/Polygon/.test(t)) { const a = ol.sphere.getArea(g) / 1e6; line = `Area about ${nf(a, a < 100 ? 1 : 0)} km²`; }
    else if (/Line/.test(t)) { const l = ol.sphere.getLength(g) / 1000; line = `Length in Malawi about ${nf(l, l < 100 ? 1 : 0)} km`; }
    else { const ll = ol.proj.toLonLat(g.getCoordinates()); line = `Lat ${ll[1].toFixed(4)}°, Lon ${ll[0].toFixed(4)}°`; }
    const sub = p.region ? p.region + ' Region · ' + L.name : p.kind || L.name;
    $('gpInfo').innerHTML = `<b>${name}</b>${sub}<br>${line}`; }
  let measuring = false, draw = null, tip = null;
  map.on('singleclick', e => { if (measuring) return; let hit = null; const pick = test => map.forEachFeatureAtPixel(e.pixel, (f, ly) => { if (hit || !ly || ly === measureLyr) return; const m = ly.get('meta'); if (m && test(m)) hit = { f, id: m.id }; }, { hitTolerance: 5 });
    pick(m => m.kind !== 'area'); if (!hit) pick(m => m.id !== 'country' && m.id !== 'regions'); if (!hit) pick(() => true);
    if (hit) select(hit.f, hit.id); else { selected = null; Object.values(vec).forEach(v => v.changed()); $('gpInfo').innerHTML = '<b>Outside the layers</b>Click inside Malawi to see a district, town, road, river or lake.'; } });

  /* coordinates in WGS 84 and Arc 1950 / UTM 36S */
  map.on('pointermove', e => { if (e.dragging) return; const ll = ol.proj.toLonLat(e.coordinate), u = proj4('EPSG:4326', 'EPSG:20936', ll); $('gpCoords').innerHTML = `Lat ${ll[1].toFixed(5)}°, Lon ${ll[0].toFixed(5)}°<br>Arc 1950 / UTM 36S: E ${u[0].toFixed(1)} m, N ${u[1].toFixed(1)} m`; });

  /* measure */
  $('gpMeasure').addEventListener('click', () => { measuring = !measuring; $('gpMeasure').classList.toggle('on', measuring); $('gpMeasure').setAttribute('aria-pressed', measuring);
    if (measuring) { measureSrc.clear(); draw = new ol.interaction.Draw({ source: measureSrc, type: 'LineString' }); map.addInteraction(draw); const el = document.createElement('div'); el.className = 'mtip'; tip = new ol.Overlay({ element: el, offset: [12, -12], positioning: 'bottom-left' }); map.addOverlay(tip);
      draw.on('drawstart', ev => { measureSrc.clear(); ev.feature.getGeometry().on('change', g => { const L = ol.sphere.getLength(g.target), t = L > 1000 ? (L / 1000).toFixed(2) + ' km' : L.toFixed(0) + ' m'; el.textContent = t; tip.setPosition(g.target.getLastCoordinate()); $('gpToolMsg').textContent = 'Distance: ' + t; }); });
      $('gpToolMsg').textContent = 'Click points along the line; double-click to finish. Click the button again to stop.'; }
    else { if (draw) map.removeInteraction(draw); if (tip) map.removeOverlay(tip); draw = null; tip = null; measureSrc.clear(); $('gpToolMsg').textContent = ''; } });
  $('gpHome').addEventListener('click', () => map.getView().fit(home, { duration: 500, padding: [20, 20, 20, 20] }));
  $('gpShare').addEventListener('click', async () => { const v = map.getView(), ll = ol.proj.toLonLat(v.getCenter()), h = `#${v.getZoom().toFixed(2)}/${ll[1].toFixed(5)}/${ll[0].toFixed(5)}`; history.replaceState(null, '', h); try { await navigator.clipboard.writeText(location.href); $('gpToolMsg').textContent = 'Link copied. Anyone who opens it sees this view.'; } catch (e) { $('gpToolMsg').textContent = 'Copy this address: ' + location.href; } });

  /* phone: the panel slides up */
  const tg = $('gpToggle'), pn = $('gpPanel'); tg && tg.addEventListener('click', () => { const o = !pn.classList.contains('open'); pn.classList.toggle('open', o); tg.setAttribute('aria-expanded', o); });
})();
