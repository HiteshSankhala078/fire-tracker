/* Arav Fire Safety · Leads & visits module
   Separate from refill entries: own table "leads" + "app_settings". Never touches public.entries
   except through the normal "Convert to customer" form, which only ADDS a new entry. */
(function () {
"use strict";

const CSS = `
.tabbar{grid-template-columns:repeat(6,1fr)!important}
.lstrip{padding:14px 16px 6px;margin-bottom:18px}
.lstrip-h{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.lstrip-h h3{font-size:15.5px;font-weight:800;flex:1}
.lmini{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:6px}
.lmini button{border:1px solid var(--line);border-radius:12px;padding:9px 10px;text-align:left;background:#fff}
.lmini button:hover{border-color:#F4A497}
.lmini b{display:block;font-size:21px;font-weight:800;letter-spacing:-.02em;line-height:1.15}
.lmini small{font-size:11.5px;font-weight:700;color:var(--ink3)}
.lstrip .row{padding:10px 4px}
.ltag{display:inline-flex;align-items:center;font-size:11px;font-weight:800;padding:2px 7px;border-radius:99px;background:var(--line2);color:var(--ink2);margin-right:4px;white-space:nowrap}
.ltag.warn{background:var(--amber-l);color:var(--amber)}
.ltag.red{background:var(--red-l);color:var(--red)}
.ltag.ok{background:var(--green-l);color:var(--green)}
.lsec{border:1px solid var(--line);border-radius:14px;margin-bottom:12px;overflow:hidden;background:#fff}
.lsec>summary{list-style:none;cursor:pointer;padding:13px 14px;font-weight:800;font-size:14px;display:flex;align-items:center;gap:8px}
.lsec>summary::-webkit-details-marker{display:none}
.lsec>summary::after{content:"▾";margin-left:auto;color:var(--ink3);transition:transform .15s}
.lsec:not([open])>summary::after{transform:rotate(-90deg)}
.lsec>summary small{font-weight:600;color:var(--ink3);font-size:12px}
.lsec .lbody{padding:0 14px 14px}
.ochips{display:flex;flex-wrap:wrap;gap:6px}
.ochip{height:34px;padding:0 12px;border-radius:99px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:700;color:var(--ink2)}
.ochip.on{background:var(--ink);border-color:var(--ink);color:#fff}
.lrow3{display:grid;grid-template-columns:1.5fr .7fr .6fr .8fr 34px;gap:6px;align-items:center;margin-bottom:6px}
.lrow3.np{grid-template-columns:1.5fr .7fr .9fr 34px}
.lrow3 input,.lrow3 select{height:40px;border:1px solid var(--line);border-radius:9px;padding:0 8px;background:#fff;font-size:14px;width:100%;outline:none;min-width:0}
.lrow3 .icon-btn{width:34px;height:34px;color:var(--ink3)}
.lhead{font-size:11px;font-weight:800;color:var(--ink3);text-transform:uppercase;letter-spacing:.04em}
.ltot{display:flex;flex-direction:column;gap:3px;align-items:flex-end;font-size:13.5px;font-weight:700;color:var(--ink2);margin-top:8px}
.ltot b{font-size:17px;color:var(--ink)}
.lnext{display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#EEF4FF,#fff);border:1px solid #D6E4FF;margin-bottom:14px}
.lnext.late{background:linear-gradient(135deg,#FFF1EE,#fff);border-color:#FBD2CB}
.lnext .t{font-size:12px;font-weight:800;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em}
.lnext .v{font-size:16px;font-weight:800}
.lnext .n{font-size:13px;color:var(--ink2);font-weight:600}
.tl{position:relative;margin:0 0 16px;padding-left:18px}
.tl::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:var(--line)}
.tli{position:relative;margin-bottom:12px}
.tli::before{content:"";position:absolute;left:-17px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--brand);box-shadow:0 0 0 3px #fff}
.tli .h{font-size:12.5px;font-weight:800;color:var(--ink2)}
.tli .b{font-size:14px;font-weight:600;white-space:pre-wrap;margin-top:2px}
.lphoto-btns{display:flex;gap:8px;flex-wrap:wrap}
.lcards{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-top:10px}
@media (max-width:760px){.lmini{grid-template-columns:repeat(2,1fr)}.lrow3{grid-template-columns:1.3fr .6fr .5fr .8fr 30px;gap:4px}.lrow3.np{grid-template-columns:1.4fr .6fr .9fr 30px}}
`;
try { const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); } catch (_) {}

const STAGES = [
  ['new', 'New / first visit', 's-upcoming'],
  ['followup', 'Follow-up (come later)', 's-soon'],
  ['quoted', 'Price given', 's-upcoming'],
  ['thinking', '50-50 / thinking', 's-soon'],
  ['won', 'Work received', 's-active'],
  ['lost', 'Rejected', 's-renewed']
];
const STAGE = Object.fromEntries(STAGES.map(s => [s[0], s]));
const CATS = ['Hospital', 'Clinic', 'School / College', 'Hotel / Restaurant', 'Shop / Showroom', 'Office', 'Society / Apartment', 'Factory / Godown', 'PG / Hostel', 'Other'];
const ROLES = ['Doctor', 'Owner', 'Manager', 'Admin', 'Other'];
const ACTIONS = [['visit', 'Visit again'], ['call', 'Call'], ['whatsapp', 'WhatsApp'], ['email', 'Email']];
const ACT = Object.fromEntries(ACTIONS);
const OUTCOMES = [
  ['notavail', 'Doctor / owner not available', 'followup'],
  ['later', 'Said “come later”', 'followup'],
  ['days', 'Come after X days', 'followup'],
  ['quote', 'Price / quote given', 'quoted'],
  ['thinking', 'Will think (50-50)', 'thinking'],
  ['won', 'Work / order received', 'won'],
  ['lost', 'Rejected', 'lost'],
  ['info', 'Only info collected', '']
];
const OUT = Object.fromEntries(OUTCOMES.map(o => [o[0], o]));
const WITH = ['Reception', 'Doctor', 'Owner', 'Manager', 'Other'];
const PHOTO_KINDS = ['Visiting card', 'Bottle / label', 'Current vendor', 'Place', 'Other'];

let F = null;                       // app helpers (window.FT), set by app.js
let leads = [], settings = {}, loadedUid = null, loading = false, chan = null, refT = null;
let lq = '', lfilter = 'open', lsort = 'next', larea = '';

const H = () => F || (F = window.FT);
const esc = s => H().esc(s);
const ic = (n, s, w) => ICON[n] ? `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>` : H().ic(n, s, w);
const ICON = {
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  msg: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'
};

/* ---------- small helpers ---------- */
function todayIso() { return H().iso(H().today()); }
function addDays(n) { const d = H().today(); d.setDate(d.getDate() + n); return H().iso(d); }
function days(s) { return H().daysUntil(s); }
function fmtD(s) { return H().fmt(s); }
function isOpen(l) { return l.stage !== 'won' && l.stage !== 'lost'; }
function nextDays(l) { return l.next && l.next.date ? days(l.next.date) : null; }
function rupee(n) { return '₹' + (Math.round((+n || 0) * 100) / 100).toLocaleString('en-IN'); }
function num(v) { const n = parseFloat(v); return isFinite(n) ? n : 0; }
function bottleCount(l) { const b = l.bottles || {}; const s = (b.items || []).reduce((a, i) => a + (+i.qty || 0), 0); return s || (+b.count || 0); }
function mainPhone(l) { return (l.dm && l.dm.phone) || (l.reception && l.reception.phone) || ''; }
function stagePill(l) { const s = STAGE[l.stage] || STAGE.new; return `<span class="pill ${s[2]}">${s[1]}</span>`; }
function nextText(l) {
  if (!isOpen(l)) return l.stage === 'won' ? 'Won' : 'Closed';
  const d = nextDays(l); if (d == null) return 'No follow-up set';
  const t = l.next.time ? ' · ' + l.next.time : '';
  if (d < 0) return `${-d} day${d === -1 ? '' : 's'} late` + t;
  if (d === 0) return 'Today' + t;
  if (d === 1) return 'Tomorrow' + t;
  return d <= 30 ? `in ${d} days` : fmtD(l.next.date);
}
function quoteCalc(q) {
  q = q || {}; const lines = q.lines || [];
  const sub = lines.reduce((a, x) => a + num(x.qty || 1) * num(x.price), 0);
  const r = num(q.gstRate || 18) / 100;
  if (q.gst === 'incl') { const base = sub / (1 + r); return { sub: base, gst: sub - base, total: sub, label: `GST ${q.gstRate || 18}% included` }; }
  if (q.gst === 'none') return { sub, gst: 0, total: sub, label: 'Without GST' };
  return { sub, gst: sub * r, total: sub * (1 + r), label: `+ GST ${q.gstRate || 18}%` };
}
function lineLabel(x) { return [x.type, x.capacity ? x.capacity + ' Kg' : ''].filter(Boolean).join(' '); }
function mapUrl(o) {
  o = o || {}; const loc = String(o.location || '').trim();
  if (/^https?:\/\//i.test(loc)) return loc;
  const ll = loc.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (ll) return `https://www.google.com/maps/search/?api=1&query=${ll[1]},${ll[2]}`;
  const q = loc || [o.name || o.shop, o.address].filter(Boolean).join(', ');
  return q ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) : '';
}
function fillGeo(input) {
  if (!navigator.geolocation) { H().toast('Location not available on this device'); return; }
  H().toast('Getting your location…');
  navigator.geolocation.getCurrentPosition(p => {
    const v = `https://www.google.com/maps/search/?api=1&query=${p.coords.latitude.toFixed(6)},${p.coords.longitude.toFixed(6)}`;
    if (input) { input.value = v; input.dispatchEvent(new Event('input', { bubbles: true })); }
    H().toast('Location added');
  }, err => H().toast(err && err.code === 1 ? 'Allow location permission and try again' : 'Couldn’t get location — paste a map link'), { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
}

/* ---------- data ---------- */
async function load(force) {
  const f = H(); if (!f || !f.sb || !f.user) return;
  if (loading) return; if (!force && loadedUid === f.user.id && leads._ok) return;
  loading = true;
  try {
    const [a, b] = await Promise.all([
      f.sb.from('leads').select('id,data,created_at,updated_at').order('created_at', { ascending: true }).limit(5000),
      f.sb.from('app_settings').select('data').maybeSingle()
    ]);
    if (a.error) throw a.error;
    leads = (a.data || []).map(r => ({ ...(r.data || {}), id: r.id, createdAt: (r.data && r.data.createdAt) || r.created_at, updatedAt: (r.data && r.data.updatedAt) || r.updated_at }));
    leads._ok = true;
    settings = (b && b.data && b.data.data) || {};
    loadedUid = f.user.id;
    try { localStorage.setItem('fst_leads', JSON.stringify({ uid: f.user.id, leads, settings })); } catch (_) {}
  } catch (e) {
    console.warn('leads', e);
    if (loadedUid !== f.user.id) { try { const c = JSON.parse(localStorage.getItem('fst_leads') || 'null'); if (c && c.uid === f.user.id) { leads = c.leads || []; settings = c.settings || {}; } } catch (_) {} }
  } finally { loading = false; }
  if (!chan && f.sb) {
    try { chan = f.sb.channel('leads-live').on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => { clearTimeout(refT); refT = setTimeout(() => refresh(), 400); }).subscribe(); } catch (_) {}
  }
  if (f.view === 'dashboard' || f.view === 'leads') rerender();
  updateBadge();
  scheduleReminders();
}
function refresh() { return load(true); }
function rerender() { const f = H(); if (f.view === 'leads') { const el = f.$('#view'); if (el && f.$('#leadList')) renderList(); else f.render(); } else if (f.view === 'dashboard') f.render(); }
async function saveLead(id, body) {
  const f = H(); body.updatedAt = new Date().toISOString();
  if (id) { const { error } = await f.sb.from('leads').update({ data: body, updated_at: body.updatedAt }).eq('id', id); if (error) throw error; return id; }
  body.createdAt = body.updatedAt;
  const { data, error } = await f.sb.from('leads').insert({ data: body }).select('id').single(); if (error) throw error; return data.id;
}
async function patchLead(id, patch) { const cur = leads.find(l => l.id === id); if (!cur) return; const b = { ...cur, ...patch }; delete b.id; await saveLead(id, b); }
async function saveSettings(data) {
  const f = H();
  const { error } = await f.sb.from('app_settings').upsert({ user_id: f.user.id, data, updated_at: new Date().toISOString() }); if (error) throw error;
  settings = data;
}
function err(e) { const m = String(e && e.message || e); H().toast(/fetch|network|Failed/i.test(m) ? 'No internet — not saved. Try again.' : /relation|does not exist/i.test(m) ? 'Leads table missing in database' : 'Couldn’t save: ' + m.slice(0, 70)); }

/* ---------- counts / filters ---------- */
function counts() {
  const o = leads.filter(isOpen); const c = { open: o.length, today: 0, overdue: 0, week: 0, dmpending: 0, thinking: 0, quoted: 0, bottledue: 0, won: 0, lost: 0, all: leads.length };
  o.forEach(l => { const d = nextDays(l); if (d === 0) c.today++; if (d != null && d < 0) c.overdue++; if (d != null && d >= 0 && d <= 7) c.week++;
    if (!l.dm || l.dm.talk !== 'done') c.dmpending++; if (l.stage === 'thinking') c.thinking++; if (l.stage === 'quoted') c.quoted++;
    const bd = l.bottles && l.bottles.dueDate ? days(l.bottles.dueDate) : null; if (bd != null && bd <= 30) c.bottledue++; });
  leads.forEach(l => { if (l.stage === 'won') c.won++; if (l.stage === 'lost') c.lost++; });
  return c;
}
const FILTERS = [['open', 'All open'], ['today', 'Today'], ['overdue', 'Follow-up missed'], ['week', 'Next 7 days'], ['dmpending', 'Doctor/owner talk pending'], ['thinking', '50-50'], ['quoted', 'Price given'], ['bottledue', 'Their bottles expired / due'], ['won', 'Won'], ['lost', 'Rejected'], ['all', 'All']];
function matchF(l, f) {
  const d = nextDays(l);
  switch (f) {
    case 'open': return isOpen(l);
    case 'today': return isOpen(l) && d === 0;
    case 'overdue': return isOpen(l) && d != null && d < 0;
    case 'week': return isOpen(l) && d != null && d >= 0 && d <= 7;
    case 'dmpending': return isOpen(l) && (!l.dm || l.dm.talk !== 'done');
    case 'thinking': return isOpen(l) && l.stage === 'thinking';
    case 'quoted': return isOpen(l) && l.stage === 'quoted';
    case 'bottledue': { const b = l.bottles && l.bottles.dueDate ? days(l.bottles.dueDate) : null; return isOpen(l) && b != null && b <= 30; }
    case 'won': return l.stage === 'won';
    case 'lost': return l.stage === 'lost';
    default: return true;
  }
}
function matchQ(l, q) {
  if (!q) return true; q = q.toLowerCase().trim();
  const r = l.reception || {}, m = l.dm || {}, c = l.competitor || {};
  const hay = [l.name, l.category, l.area, l.address, r.name, r.phone, m.name, m.phone, m.email, c.name, c.phone, l.notes, (l.visits || []).map(v => v.notes).join(' ')].join(' ').toLowerCase();
  return q.split(/\s+/).every(w => hay.includes(w) || hay.replace(/\s/g, '').includes(w));
}

/* ---------- list rendering ---------- */
function rowHTML(l) {
  const f = H(); const d = nextDays(l); const late = isOpen(l) && d != null && d < 0; const tday = isOpen(l) && d === 0;
  const col = late || tday ? ['#FEECEB', '#D92D20'] : l.stage === 'won' ? ['#E7F6EE', '#067647'] : l.stage === 'lost' ? ['#F1F3F6', '#667085'] : ['#EAF2FF', '#175CD3'];
  const meta = [l.category, l.area, mainPhone(l)].filter(Boolean).map(esc).join(' · ');
  const tags = [];
  if (isOpen(l) && (!l.dm || l.dm.talk !== 'done')) tags.push(`<span class="ltag warn">${esc((l.dm && l.dm.role) || 'Doctor')} talk pending</span>`);
  const bc = bottleCount(l); if (bc) tags.push(`<span class="ltag">${bc}${l.bottles && l.bottles.approx ? '~' : ''} bottles</span>`);
  const bd = l.bottles && l.bottles.dueDate ? days(l.bottles.dueDate) : null; if (isOpen(l) && bd != null && bd <= 30) tags.push(`<span class="ltag red">${bd < 0 ? 'Their refill expired' : 'Their refill in ' + bd + 'd'}</span>`);
  if (l.chance != null && l.chance !== '' && isOpen(l)) tags.push(`<span class="ltag ok">${esc(l.chance)}% chance</span>`);
  return `<div class="row" data-lead="${esc(l.id)}">
    <div class="avatar" style="background:${col[0]};color:${col[1]}">${esc(f.initials(l.name))}</div>
    <div class="mid"><div class="name">${esc(l.name || 'Untitled')}</div><div class="meta">${meta || '&nbsp;'}</div>${tags.length ? `<div style="margin-top:4px">${tags.join('')}</div>` : ''}</div>
    <div class="end"><div class="due" style="${late ? 'color:var(--red)' : ''}">${esc(nextText(l))}</div>${stagePill(l)}</div></div>`;
}
function bindRows(root) { H().$$('[data-lead]', root).forEach(r => r.addEventListener('click', () => openDetail(r.dataset.lead))); }

function dashboardHTML() {
  const f = H(); if (!f || !f.user) return '';
  if (loadedUid !== f.user.id) { load(); }
  const c = counts();
  const att = leads.filter(l => isOpen(l) && nextDays(l) != null && nextDays(l) <= 2).sort((a, b) => (a.next.date || '').localeCompare(b.next.date || '')).slice(0, 4);
  return `<div class="card lstrip"><div class="lstrip-h">${ic('pin', 18)}<h3>Visits & follow-ups</h3><button class="link" data-nav="leads" style="font-size:13px;font-weight:700;color:var(--brand)">Open leads</button></div>
    <div class="lmini">
      <button data-lfilter="today"><b>${c.today}</b><small>Follow-up today</small></button>
      <button data-lfilter="overdue"><b style="${c.overdue ? 'color:var(--red)' : ''}">${c.overdue}</b><small>Follow-up missed</small></button>
      <button data-lfilter="dmpending"><b>${c.dmpending}</b><small>Doctor talk pending</small></button>
      <button data-lfilter="open"><b>${c.open}</b><small>Open leads</small></button>
    </div>
    ${att.length ? `<div class="list">${att.map(rowHTML).join('')}</div>` : leads.length ? '' : `<div style="font-size:13.5px;color:var(--ink3);font-weight:600;padding:6px 2px 10px">Visited a new place? Open “Leads” and tap + to save the visit, contacts, bottles and prices.</div>`}
  </div>`;
}
function bindDashboard(el) {
  bindRows(el);
  H().$$('[data-lfilter]', el).forEach(b => b.addEventListener('click', () => { lfilter = b.dataset.lfilter; H().go('leads'); }));
}

function render(el) {
  const f = H(); if (loadedUid !== (f.user && f.user.id)) load();
  const areas = [...new Set(leads.map(l => l.area).filter(Boolean))].sort();
  el.innerHTML = `<label class="search mobile-search"><span>${f.ic('search', 17)}</span><input id="lSearch" type="search" placeholder="Search place, doctor, reception, mobile…" autocomplete="off" value="${esc(lq)}"></label>
  <div class="toolbar"><div class="chips" id="lchips"></div></div>
  <div class="toolbar" style="margin-top:-4px">
    <select class="sort" id="lArea" style="margin-left:0"><option value="">All areas</option>${areas.map(a => `<option ${a === larea ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
    <select class="sort" id="lSort"><option value="next">Sort: Next follow-up</option><option value="recent">Sort: Recently updated</option><option value="name">Sort: Name A–Z</option><option value="chance">Sort: Best chance</option><option value="bottles">Sort: Most bottles</option></select>
    <button class="btn btn-sm btn-ghost" id="lCsv">${f.ic('down', 15)}Export</button>
    <button class="btn btn-sm btn-primary" id="lNew">${f.ic('plus', 15, 2.4)}New visit</button>
  </div>
  <div class="card"><div class="list" id="leadList"></div></div>`;
  f.$('#lSort', el).value = lsort;
  f.$('#lSort', el).addEventListener('change', e => { lsort = e.target.value; renderList(); });
  f.$('#lArea', el).addEventListener('change', e => { larea = e.target.value; renderList(); });
  f.$('#lSearch', el).addEventListener('input', e => { lq = e.target.value; const g = f.$('#globalSearch'); if (g) g.value = lq; renderList(); });
  f.$('#lNew', el).addEventListener('click', () => openForm());
  f.$('#lCsv', el).addEventListener('click', exportCSV);
  const g = f.$('#globalSearch'); if (g) g.value = lq;
  renderList();
}
function search(q) { lq = q; const s = H().$('#lSearch'); if (s && s.value !== q) s.value = q; renderList(); }
function renderList() {
  const f = H(); const list = f.$('#leadList'); if (!list) return;
  const base = leads.filter(l => (!larea || l.area === larea) && matchQ(l, lq));
  f.$('#lchips').innerHTML = FILTERS.map(([k, t]) => `<button class="chip ${lfilter === k ? 'on' : ''}" data-lf="${k}">${t}<span class="n">${base.filter(l => matchF(l, k)).length}</span></button>`).join('');
  f.$$('[data-lf]', f.$('#lchips')).forEach(b => b.addEventListener('click', () => { lfilter = b.dataset.lf; renderList(); }));
  const r = base.filter(l => matchF(l, lfilter));
  const nk = l => (l.next && l.next.date ? l.next.date + (l.next.time || '') : '9999');
  const cmp = { next: (a, b) => nk(a).localeCompare(nk(b)), recent: (a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''), name: (a, b) => (a.name || '').localeCompare(b.name || ''), chance: (a, b) => num(b.chance) - num(a.chance), bottles: (a, b) => bottleCount(b) - bottleCount(a) }[lsort];
  r.sort(cmp);
  f.$('#pageSub').textContent = `${r.length} place${r.length === 1 ? '' : 's'}${lq ? ' matching “' + lq + '”' : ''}`;
  list.innerHTML = r.length ? r.map(rowHTML).join('') : `<div class="empty"><div class="em-ic">${ic('pin', 22)}</div>${leads.length ? 'Nothing in this list.' : 'No visits saved yet. Tap “New visit” after you visit a place.'}</div>`;
  bindRows(list);
  updateBadge();
}
function updateBadge() { const c = counts(); const n = c.today + c.overdue; H().$$('[data-lbadge]').forEach(b => { b.textContent = n; b.classList.toggle('hidden', !n); }); }

/* ---------- row editors (items / prices / quote lines) ---------- */
function typeOpts(sel) { const T = H().EXT_TYPES || []; return T.concat(T.includes(sel) || !sel ? [] : [sel]).map(o => `<option ${o === sel ? 'selected' : ''}>${esc(o)}</option>`).join(''); }
function linesEditor(box, arr, mode) {
  // mode: 'qty' (type,kg,qty) | 'price' (type,kg,price) | 'quote' (type,kg,qty,price)
  const f = H();
  const draw = () => {
    const head = mode === 'quote' ? '<div class="lrow3 lhead"><span>Type</span><span>Kg</span><span>Qty</span><span>Price ₹</span><span></span></div>'
      : `<div class="lrow3 np lhead"><span>Type</span><span>Kg</span><span>${mode === 'qty' ? 'Qty' : 'Price ₹'}</span><span></span></div>`;
    box.innerHTML = (arr.length ? head : '') + arr.map((x, i) => `<div class="lrow3 ${mode === 'quote' ? '' : 'np'}" data-i="${i}">
      <select data-k="type">${typeOpts(x.type)}</select>
      <input data-k="capacity" type="number" inputmode="decimal" min="0" step="0.5" placeholder="Kg" value="${esc(x.capacity || '')}">
      ${mode !== 'price' ? `<input data-k="qty" type="number" inputmode="numeric" min="0" placeholder="Qty" value="${esc(x.qty == null ? '' : x.qty)}">` : ''}
      ${mode !== 'qty' ? `<input data-k="price" type="number" inputmode="decimal" min="0" placeholder="₹" value="${esc(x.price == null ? '' : x.price)}">` : ''}
      <button type="button" class="icon-btn" data-rm>${f.ic('trash', 15)}</button></div>`).join('');
    f.$$('[data-i]', box).forEach(r => { const i = +r.dataset.i;
      f.$$('[data-k]', r).forEach(inp => inp.addEventListener('input', () => { arr[i][inp.dataset.k] = inp.value; box.dispatchEvent(new Event('lines')); }));
      f.$('[data-rm]', r).addEventListener('click', () => { arr.splice(i, 1); draw(); box.dispatchEvent(new Event('lines')); }); });
  };
  draw();
  return { add(x) { arr.push(x || { type: 'ABC Type', capacity: '6', qty: mode === 'price' ? undefined : 1, price: '' }); draw(); box.dispatchEvent(new Event('lines')); }, redraw: draw };
}
function photosEditor(box, arr, onBusy) {
  const f = H(); let busy = 0;
  const draw = () => {
    box.innerHTML = `<div class="lphoto-btns">
      <label class="btn btn-sm btn-ghost">${ic('camera', 15)}Take photo<input type="file" accept="image/*" capture="environment" hidden data-cam></label>
      <label class="btn btn-sm btn-ghost">${ic('image', 15)}Gallery / PDF<input type="file" accept="image/*,application/pdf" multiple hidden data-gal></label></div>
      <div class="files" style="margin-top:8px">${arr.map((d, i) => `<div class="file"><span class="fi ${f.docKind(d)}">${f.docKind(d) === 'pdf' ? 'PDF' : 'IMG'}</span><span class="fn">${esc(d.name || 'photo')}</span>
      ${d.pending ? '<span class="prog">Uploading…</span>' : `<select data-pk="${i}">${PHOTO_KINDS.map(k => `<option ${k === d.kind ? 'selected' : ''}>${k}</option>`).join('')}</select><button type="button" class="icon-btn" data-prm="${i}" style="width:32px;height:32px">${f.ic('x', 16)}</button>`}</div>`).join('')}</div>`;
    f.$$('[data-pk]', box).forEach(s => s.addEventListener('change', () => { arr[+s.dataset.pk].kind = s.value; }));
    f.$$('[data-prm]', box).forEach(b => b.addEventListener('click', () => { arr.splice(+b.dataset.prm, 1); draw(); }));
    [f.$('[data-cam]', box), f.$('[data-gal]', box)].forEach(inp => inp.addEventListener('change', () => { add(inp.files); inp.value = ''; }));
  };
  async function add(files) {
    for (const file of Array.from(files || [])) {
      if (file.size > 25 * 1024 * 1024) { f.toast('File over 25 MB'); continue; }
      const d = { name: file.name || 'photo.jpg', contentType: file.type, kind: 'Visiting card', pending: true }; arr.push(d); busy++; onBusy(busy); draw();
      try { const r = await f.uploadDoc(file); Object.assign(d, r); delete d.pending; d.fresh = true; } catch (e) { arr.splice(arr.indexOf(d), 1); f.toast('Upload failed'); }
      busy--; onBusy(busy); draw();
    }
  }
  draw();
}

/* ---------- form ---------- */
function openForm(l, prefill) {
  const f = H(); const isEdit = !!l; const s = l || prefill || {};
  const st = {
    name: s.name || '', category: s.category || 'Hospital', address: s.address || '', area: s.area || '', location: s.location || '',
    reception: { name: '', phone: '', ...(s.reception || {}) }, dm: { role: 'Doctor', name: '', phone: '', email: '', talk: 'pending', ...(s.dm || {}) },
    nextAction: s.nextAction || 'visit', stage: s.stage || 'new', chance: s.chance == null ? '' : String(s.chance), lostReason: s.lostReason || '',
    next: { date: '', time: '', action: 'visit', note: '', ...(s.next || {}) },
    bottles: { count: '', approx: false, dueDate: '', items: [], ...(s.bottles || {}) },
    competitor: { name: '', phone: '', notes: '', gst: 'excl', prices: [], ...(s.competitor || {}) },
    quote: { kind: 'refill', gst: 'excl', gstRate: 18, notes: '', lines: [], ...(s.quote || {}) },
    photos: (s.photos || []).map(p => ({ ...p })), notes: s.notes || ''
  };
  st.bottles.items = (st.bottles.items || []).map(x => ({ ...x })); st.competitor.prices = (st.competitor.prices || []).map(x => ({ ...x })); st.quote.lines = (st.quote.lines || []).map(x => ({ ...x }));
  const first = { outcome: '', withWho: 'Reception', notes: '', days: 5 };
  let busy = 0;
  const areas = [...new Set(leads.map(x => x.area).concat((f.entries || []).map(x => x.area)).filter(Boolean))];
  const w = f.openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>${isEdit ? 'Edit place' : 'New visit / lead'}</h2><button class="icon-btn" data-x>${f.ic('x', 20)}</button></div>
   <form class="sheet-b" id="lf" novalidate>
    <details class="lsec" open><summary>${ic('pin', 16)}Place</summary><div class="lbody"><div class="fgrid">
      <div class="f full" id="lfName"><label>Place / firm name <em>*</em></label><input name="name" placeholder="e.g. Shivam Hospital" autocomplete="off"></div>
      <div class="f"><label>Type of place</label><select name="category">${CATS.map(c => `<option>${c}</option>`).join('')}</select></div>
      <div class="f"><label>Area</label><input name="area" list="lareas" placeholder="e.g. Bopal" autocomplete="off"><datalist id="lareas">${areas.map(a => `<option value="${esc(a)}">`).join('')}</datalist></div>
      <div class="f full"><label>Address</label><textarea name="address" rows="2" placeholder="Building, road, landmark"></textarea></div>
      <div class="f full"><label>Google Maps location</label><input name="location" placeholder="Paste map link, or use current location" autocomplete="off">
        <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap"><button type="button" class="btn btn-sm btn-soft" data-geo>${ic('pin', 15)}Use my current location</button><button type="button" class="btn btn-sm btn-ghost" data-mapt>${f.ic('ext', 15)}Check on map</button></div></div>
    </div></div></details>

    ${isEdit ? '' : `<details class="lsec" open><summary>${ic('msg', 16)}What happened today?</summary><div class="lbody">
      <div class="f" style="margin-bottom:10px"><label>Talked with</label><div class="ochips" id="lfWith">${WITH.map(x => `<button type="button" class="ochip ${x === first.withWho ? 'on' : ''}" data-v="${x}">${x}</button>`).join('')}</div></div>
      <div class="f" style="margin-bottom:10px"><label>Result</label><div class="ochips" id="lfOut">${OUTCOMES.map(o => `<button type="button" class="ochip" data-v="${o[0]}">${o[1]}</button>`).join('')}</div></div>
      <div class="f hidden" id="lfDays" style="margin-bottom:10px"><label>Come after how many days?</label><input name="fdays" type="number" min="1" value="5" style="max-width:120px"></div>
      <div class="f"><label>Conversation notes</label><textarea name="fnotes" rows="3" placeholder="e.g. Doctor not available, reception took my card and gave theirs. Bottles expired."></textarea></div>
    </div></details>`}

    <details class="lsec" open><summary>${ic('user', 16)}Contacts</summary><div class="lbody"><div class="fgrid">
      <div class="f"><label>Reception name</label><input name="rname" autocomplete="off"></div>
      <div class="f"><label>Reception mobile</label><input name="rphone" type="tel" inputmode="tel" autocomplete="off"></div>
      <div class="f"><label>Decision maker</label><select name="drole">${ROLES.map(r => `<option>${r}</option>`).join('')}</select></div>
      <div class="f"><label>Name</label><input name="dname" placeholder="e.g. Dr. Shah" autocomplete="off"></div>
      <div class="f"><label>Mobile</label><input name="dphone" type="tel" inputmode="tel" autocomplete="off"></div>
      <div class="f"><label>Email</label><input name="demail" type="email" inputmode="email" autocomplete="off"></div>
      <div class="f full"><label>Talk with doctor / owner</label><div class="seg" id="lfTalk"><button type="button" data-v="pending">Not yet</button><button type="button" data-v="done">Done</button></div></div>
      <div class="f full" id="lfNA"><label>Next step to reach them</label><div class="ochips" id="lfNAc">${ACTIONS.map(a => `<button type="button" class="ochip" data-v="${a[0]}">${a[1]}</button>`).join('')}</div></div>
    </div></div></details>

    <details class="lsec" open><summary>${f.ic('clock', 16)}Status & next follow-up</summary><div class="lbody"><div class="fgrid">
      <div class="f"><label>Status</label><select name="stage">${STAGES.map(x => `<option value="${x[0]}">${x[1]}</option>`).join('')}</select></div>
      <div class="f"><label>Chance of getting work</label><div class="ochips" id="lfChance">${['', '25', '50', '75', '100'].map(x => `<button type="button" class="ochip" data-v="${x}">${x ? x + '%' : '—'}</button>`).join('')}</div></div>
      <div class="f full hidden" id="lfLost"><label>Why rejected?</label><input name="lostReason" placeholder="e.g. Already contract with other vendor"></div>
      <div class="f"><label>Next follow-up / meeting date</label><input name="ndate" type="date"></div>
      <div class="f"><label>Time (optional)</label><input name="ntime" type="time"></div>
      <div class="f"><label>Follow-up by</label><select name="naction">${ACTIONS.map(a => `<option value="${a[0]}">${a[1]}</option>`).join('')}</select></div>
      <div class="f"><label>Quick set</label><div class="ochips">${[[1, 'Tomorrow'], [3, '3 days'], [5, '5 days'], [7, '1 week'], [30, '1 month']].map(x => `<button type="button" class="ochip" data-qd="${x[0]}">${x[1]}</button>`).join('')}</div></div>
      <div class="f full"><label>What to do next</label><input name="nnote" placeholder="e.g. Meet doctor after 5 PM, carry quotation"></div>
    </div></div></details>

    <details class="lsec" ${isEdit && !bottleCount(st) ? '' : 'open'}><summary>${f.ic('fire', 16)}Their bottles <small>(approx is fine)</small></summary><div class="lbody"><div class="fgrid">
      <div class="f"><label>Total bottles</label><input name="bcount" type="number" min="0" inputmode="numeric" placeholder="e.g. 12"></div>
      <div class="f"><label>Refill due date on bottles</label><input name="bdue" type="date"></div>
      <div class="f full"><label style="display:flex;align-items:center;gap:8px;font-weight:700"><input type="checkbox" name="bapprox" style="width:18px;height:18px">Approximate count (could not check all)</label></div>
      <div class="f full"><label>Type-wise (optional)</label><div id="lfBItems"></div><button type="button" class="btn btn-sm btn-soft" data-addb style="align-self:flex-start;margin-top:4px">${f.ic('plus', 15)}Add type</button></div>
    </div></div></details>

    <details class="lsec" ${isEdit && !st.competitor.name ? '' : 'open'}><summary>${ic('tag', 16)}Current vendor <small>(who did their work)</small></summary><div class="lbody"><div class="fgrid">
      <div class="f"><label>Company / person</label><input name="cname" autocomplete="off"></div>
      <div class="f"><label>Mobile</label><input name="cphone" type="tel" inputmode="tel" autocomplete="off"></div>
      <div class="f full"><label>Their rates (per bottle)</label><div id="lfCPrices"></div><button type="button" class="btn btn-sm btn-soft" data-addc style="align-self:flex-start;margin-top:4px">${f.ic('plus', 15)}Add rate</button></div>
      <div class="f full"><label>Their rates are</label><div class="seg" id="lfCGst" style="grid-template-columns:1fr 1fr 1fr"><button type="button" data-v="excl">+ GST</button><button type="button" data-v="incl">GST included</button><button type="button" data-v="none">No GST</button></div></div>
      <div class="f full"><label>Notes about vendor</label><input name="cnotes" placeholder="e.g. Rate found by calling as a customer"></div>
    </div></div></details>

    <details class="lsec" ${isEdit && !st.quote.lines.length ? '' : 'open'}><summary>${f.ic('file', 16)}My price / quotation</summary><div class="lbody"><div class="fgrid">
      <div class="f full"><label>Quote for</label><div class="seg" id="lfQKind"><button type="button" data-v="refill">Refilling</button><button type="button" data-v="new">New bottles</button></div></div>
      <div class="f full"><div id="lfQLines"></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px"><button type="button" class="btn btn-sm btn-soft" data-addq>${f.ic('plus', 15)}Add line</button><button type="button" class="btn btn-sm btn-ghost" data-fillq>Fill from my price list</button></div>
        <div class="ltot" id="lfQTot"></div></div>
      <div class="f"><label>GST</label><select name="qgst"><option value="excl">Price + GST</option><option value="incl">GST included in price</option><option value="none">Without GST</option></select></div>
      <div class="f"><label>GST %</label><input name="qrate" type="number" min="0" step="0.5" inputmode="decimal"></div>
      <div class="f full"><label>Quote notes</label><input name="qnotes" placeholder="e.g. Includes pickup & delivery, valid 15 days"></div>
    </div></div></details>

    <details class="lsec" open><summary>${ic('camera', 16)}Photos <small>(cards, bottle labels, place)</small></summary><div class="lbody"><div id="lfPhotos"></div></div></details>
    <div class="f"><label>Other notes</label><textarea name="notes" rows="2"></textarea></div>
   </form>
   <div class="sheet-f"><button class="btn btn-ghost" data-cancel style="flex:1">Cancel</button><button class="btn btn-primary" data-save style="flex:2">${f.ic('check', 18, 2.4)}${isEdit ? 'Save changes' : 'Save visit'}</button></div></div>`);
  const fm = f.$('#lf', w); const E = fm.elements;
  E.name.value = st.name; E.category.value = CATS.includes(st.category) ? st.category : 'Other'; E.area.value = st.area; E.address.value = st.address; E.location.value = st.location;
  E.rname.value = st.reception.name; E.rphone.value = st.reception.phone; E.drole.value = ROLES.includes(st.dm.role) ? st.dm.role : 'Other'; E.dname.value = st.dm.name; E.dphone.value = st.dm.phone; E.demail.value = st.dm.email || '';
  E.stage.value = st.stage; E.lostReason.value = st.lostReason; E.ndate.value = st.next.date || ''; E.ntime.value = st.next.time || ''; E.naction.value = st.next.action || 'visit'; E.nnote.value = st.next.note || '';
  E.bcount.value = st.bottles.count || ''; E.bdue.value = st.bottles.dueDate || ''; E.bapprox.checked = !!st.bottles.approx;
  E.cname.value = st.competitor.name; E.cphone.value = st.competitor.phone; E.cnotes.value = st.competitor.notes || '';
  E.qgst.value = st.quote.gst || 'excl'; E.qrate.value = st.quote.gstRate == null ? 18 : st.quote.gstRate; E.qnotes.value = st.quote.notes || ''; E.notes.value = st.notes;

  const seg = (id, get, set) => { const s = f.$(id, w); const upd = () => f.$$('button', s).forEach(b => b.classList.toggle('on', b.dataset.v === get())); f.$$('button', s).forEach(b => b.addEventListener('click', () => { set(b.dataset.v); upd(); })); upd(); return upd; };
  seg('#lfTalk', () => st.dm.talk, v => { st.dm.talk = v; f.$('#lfNA', w).classList.toggle('hidden', v === 'done'); });
  f.$('#lfNA', w).classList.toggle('hidden', st.dm.talk === 'done');
  seg('#lfNAc', () => st.nextAction, v => { st.nextAction = v; E.naction.value = v; });
  seg('#lfChance', () => st.chance, v => { st.chance = v; });
  seg('#lfCGst', () => st.competitor.gst, v => { st.competitor.gst = v; });
  seg('#lfQKind', () => st.quote.kind, v => { st.quote.kind = v; });
  const lostToggle = () => f.$('#lfLost', w).classList.toggle('hidden', E.stage.value !== 'lost');
  E.stage.addEventListener('change', lostToggle); lostToggle();
  if (!isEdit) {
    seg('#lfWith', () => first.withWho, v => { first.withWho = v; if (v !== 'Reception' && v !== 'Other') { st.dm.talk = 'done'; f.$$('#lfTalk button', w).forEach(b => b.classList.toggle('on', b.dataset.v === 'done')); f.$('#lfNA', w).classList.add('hidden'); } });
    seg('#lfOut', () => first.outcome, v => {
      first.outcome = first.outcome === v ? '' : v;
      const o = OUT[first.outcome]; if (o && o[2]) { E.stage.value = o[2]; lostToggle(); }
      if (first.outcome === 'thinking') { st.chance = '50'; f.$$('#lfChance button', w).forEach(b => b.classList.toggle('on', b.dataset.v === '50')); }
      f.$('#lfDays', w).classList.toggle('hidden', first.outcome !== 'days');
      if (first.outcome === 'days') E.ndate.value = addDays(num(E.fdays.value) || 5);
      if (first.outcome === 'later' && !E.ndate.value) E.ndate.value = addDays(7);
      if (first.outcome === 'notavail' && !E.ndate.value) E.ndate.value = addDays(2);
      f.$$('#lfOut button', w).forEach(b => b.classList.toggle('on', b.dataset.v === first.outcome));
    });
    E.fdays.addEventListener('input', () => { if (first.outcome === 'days') E.ndate.value = addDays(num(E.fdays.value) || 1); });
  }
  f.$$('[data-qd]', w).forEach(b => b.addEventListener('click', () => { E.ndate.value = addDays(+b.dataset.qd); }));
  f.$('[data-geo]', w).addEventListener('click', () => fillGeo(E.location));
  f.$('[data-mapt]', w).addEventListener('click', () => { const u = mapUrl({ location: E.location.value, name: E.name.value, address: E.address.value }); if (u) f.openExternal(u); else f.toast('Add name, address or location first'); });

  const bEd = linesEditor(f.$('#lfBItems', w), st.bottles.items, 'qty');
  f.$('[data-addb]', w).addEventListener('click', () => bEd.add());
  f.$('#lfBItems', w).addEventListener('lines', () => { const s = st.bottles.items.reduce((a, i) => a + (+i.qty || 0), 0); if (s) E.bcount.value = s; });
  const cEd = linesEditor(f.$('#lfCPrices', w), st.competitor.prices, 'price');
  f.$('[data-addc]', w).addEventListener('click', () => cEd.add({ type: 'ABC Type', capacity: '6', price: '' }));
  const qBox = f.$('#lfQLines', w); const qEd = linesEditor(qBox, st.quote.lines, 'quote');
  const tot = () => { st.quote.gst = E.qgst.value; st.quote.gstRate = num(E.qrate.value); const c = quoteCalc(st.quote); f.$('#lfQTot', w).innerHTML = st.quote.lines.length ? `<span>Subtotal ${rupee(c.sub)}</span><span>GST ${rupee(c.gst)} <small>(${esc(c.label)})</small></span><b>Total ${rupee(c.total)}</b>` : ''; };
  qBox.addEventListener('lines', tot); E.qgst.addEventListener('change', tot); E.qrate.addEventListener('input', tot); tot();
  f.$('[data-addq]', w).addEventListener('click', () => qEd.add());
  f.$('[data-fillq]', w).addEventListener('click', () => {
    const pl = settings.priceList || []; if (!pl.length) { f.toast('Set your price list in More → My price list'); return; }
    const src = st.bottles.items.length ? st.bottles.items : [{ type: 'ABC Type', capacity: '6', qty: num(E.bcount.value) || 1 }];
    st.quote.lines.splice(0, st.quote.lines.length, ...src.map(it => { const p = pl.find(x => x.type === it.type && String(num(x.capacity)) === String(num(it.capacity))); return { type: it.type, capacity: it.capacity, qty: it.qty || 1, price: p ? (st.quote.kind === 'new' ? p.newPrice : p.refill) || '' : '' }; }));
    if (settings.gstRate != null && settings.gstRate !== '') E.qrate.value = settings.gstRate;
    qEd.redraw(); tot();
  });
  photosEditor(f.$('#lfPhotos', w), st.photos, n => { busy = n; });

  const cancel = async () => { f.closeLayer(w); const fresh = st.photos.filter(p => p.fresh && p.path).map(p => p.path); if (!isEdit && fresh.length) await f.removeDocs(fresh); };
  w._close = cancel; f.$('[data-x]', w).addEventListener('click', cancel); f.$('[data-cancel]', w).addEventListener('click', cancel);
  fm.addEventListener('submit', e => e.preventDefault());
  f.$('[data-save]', w).addEventListener('click', async () => {
    const name = E.name.value.trim();
    f.$('#lfName', w).classList.toggle('err', !name);
    if (!name) { f.toast('Please enter the place name'); E.name.focus(); return; }
    if (busy) { f.toast('Wait — photos still uploading'); return; }
    const clean = (arr, keys) => arr.filter(x => x.type).map(x => { const o = { type: x.type, capacity: String(x.capacity || '') }; keys.forEach(k => { o[k] = x[k] === '' || x[k] == null ? '' : num(x[k]); }); return o; });
    const body = {
      ...(isEdit ? l : {}),
      name, category: E.category.value, area: E.area.value.trim(), address: E.address.value.trim(), location: E.location.value.trim(),
      reception: { name: E.rname.value.trim(), phone: E.rphone.value.trim() },
      dm: { role: E.drole.value, name: E.dname.value.trim(), phone: E.dphone.value.trim(), email: E.demail.value.trim(), talk: st.dm.talk },
      nextAction: st.nextAction, stage: E.stage.value, chance: st.chance, lostReason: E.stage.value === 'lost' ? E.lostReason.value.trim() : '',
      next: { date: E.ndate.value, time: E.ntime.value, action: E.naction.value, note: E.nnote.value.trim() },
      bottles: { count: num(E.bcount.value) || '', approx: E.bapprox.checked, dueDate: E.bdue.value, items: clean(st.bottles.items, ['qty']) },
      competitor: { name: E.cname.value.trim(), phone: E.cphone.value.trim(), notes: E.cnotes.value.trim(), gst: st.competitor.gst, prices: clean(st.competitor.prices, ['price']) },
      quote: { kind: st.quote.kind, gst: E.qgst.value, gstRate: num(E.qrate.value), notes: E.qnotes.value.trim(), lines: clean(st.quote.lines, ['qty', 'price']) },
      photos: st.photos.filter(p => p.path).map(p => ({ path: p.path, name: p.name, kind: p.kind, contentType: p.contentType || '' })),
      notes: E.notes.value.trim(),
      visits: (isEdit ? (l.visits || []) : []).slice()
    };
    delete body.id;
    if (!isEdit) {
      const fn = E.fnotes.value.trim();
      if (first.outcome || fn) body.visits.push({ date: todayIso(), at: new Date().toISOString(), mode: 'visit', withWho: first.withWho, outcome: first.outcome, notes: fn });
      if (body.quote.lines.length && body.stage === 'new') body.stage = 'quoted';
    }
    if (body.stage === 'won' || body.stage === 'lost') body.next = { ...body.next, date: '' };
    const btn = f.$('[data-save]', w); btn.disabled = true; btn.style.opacity = .7;
    try {
      const id = await saveLead(isEdit ? l.id : null, body);
      if (isEdit) { const kept = new Set(body.photos.map(p => p.path)); await f.removeDocs((l.photos || []).map(p => p.path).filter(p => p && !kept.has(p))); }
      f.closeLayer(w); f.toast(isEdit ? 'Saved' : body.next.date ? 'Visit saved · follow-up ' + fmtD(body.next.date) : 'Visit saved');
      await refresh();
      if (!isEdit && body.stage === 'won') setTimeout(() => openDetail(id), 200);
    } catch (e) { btn.disabled = false; btn.style.opacity = 1; err(e); }
  });
  if (!isEdit) setTimeout(() => { try { E.name.focus({ preventScroll: true }); } catch (_) {} }, 250);
}

/* ---------- log update (after a call / visit) ---------- */
function openUpdate(l) {
  const f = H(); const st = { mode: 'visit', withWho: 'Reception', outcome: '', chance: l.chance == null ? '' : String(l.chance) };
  const w = f.openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>Update · ${esc(l.name)}</h2><button class="icon-btn" data-x>${f.ic('x', 20)}</button></div>
   <form class="sheet-b" id="uf" novalidate><div class="fgrid">
    <div class="f"><label>Date</label><input name="date" type="date"></div>
    <div class="f"><label>How</label><div class="ochips" id="ufMode">${[['visit', 'Visit'], ['call', 'Call'], ['whatsapp', 'WhatsApp'], ['email', 'Email']].map(m => `<button type="button" class="ochip" data-v="${m[0]}">${m[1]}</button>`).join('')}</div></div>
    <div class="f full"><label>Talked with</label><div class="ochips" id="ufWith">${WITH.map(x => `<button type="button" class="ochip" data-v="${x}">${x}</button>`).join('')}</div></div>
    <div class="f full"><label>Result</label><div class="ochips" id="ufOut">${OUTCOMES.map(o => `<button type="button" class="ochip" data-v="${o[0]}">${o[1]}</button>`).join('')}</div></div>
    <div class="f hidden" id="ufDays"><label>After how many days?</label><input name="days" type="number" min="1" value="5"></div>
    <div class="f full"><label>Chance of getting work</label><div class="ochips" id="ufChance">${['', '25', '50', '75', '100'].map(x => `<button type="button" class="ochip" data-v="${x}">${x ? x + '%' : '—'}</button>`).join('')}</div></div>
    <div class="f full"><label>What was discussed</label><textarea name="notes" rows="3" placeholder="Write the conversation details"></textarea></div>
    <div class="fs-title">Next follow-up</div>
    <div class="f"><label>Date</label><input name="ndate" type="date"></div>
    <div class="f"><label>Time</label><input name="ntime" type="time"></div>
    <div class="f"><label>By</label><select name="naction">${ACTIONS.map(a => `<option value="${a[0]}">${a[1]}</option>`).join('')}</select></div>
    <div class="f"><label>Quick set</label><div class="ochips">${[[1, 'Tomorrow'], [3, '3 days'], [7, '1 week'], [30, '1 month']].map(x => `<button type="button" class="ochip" data-qd="${x[0]}">${x[1]}</button>`).join('')}</div></div>
    <div class="f full"><label>What to do next</label><input name="nnote"></div>
   </div></form>
   <div class="sheet-f"><button class="btn btn-ghost" data-cancel style="flex:1">Cancel</button><button class="btn btn-primary" data-save style="flex:2">${f.ic('check', 18, 2.4)}Save update</button></div></div>`);
  const E = f.$('#uf', w).elements; E.date.value = todayIso(); E.naction.value = (l.next && l.next.action) || 'visit'; E.nnote.value = '';
  const seg = (id, get, set) => { const s = f.$(id, w); const upd = () => f.$$('button', s).forEach(b => b.classList.toggle('on', b.dataset.v === get())); f.$$('button', s).forEach(b => b.addEventListener('click', () => { set(b.dataset.v); upd(); })); upd(); };
  seg('#ufMode', () => st.mode, v => st.mode = v);
  seg('#ufWith', () => st.withWho, v => st.withWho = v);
  seg('#ufChance', () => st.chance, v => st.chance = v);
  seg('#ufOut', () => st.outcome, v => {
    st.outcome = st.outcome === v ? '' : v;
    f.$('#ufDays', w).classList.toggle('hidden', st.outcome !== 'days');
    if (st.outcome === 'days') E.ndate.value = addDays(num(E.days.value) || 5);
    if (st.outcome === 'thinking') { st.chance = '50'; f.$$('#ufChance button', w).forEach(b => b.classList.toggle('on', b.dataset.v === '50')); }
    if ((st.outcome === 'later') && !E.ndate.value) E.ndate.value = addDays(7);
    if (st.outcome === 'won' || st.outcome === 'lost') E.ndate.value = '';
  });
  E.days.addEventListener('input', () => { if (st.outcome === 'days') E.ndate.value = addDays(num(E.days.value) || 1); });
  f.$$('[data-qd]', w).forEach(b => b.addEventListener('click', () => { E.ndate.value = addDays(+b.dataset.qd); }));
  f.$('[data-x]', w).addEventListener('click', w._close); f.$('[data-cancel]', w).addEventListener('click', w._close);
  f.$('[data-save]', w).addEventListener('click', async () => {
    const notes = E.notes.value.trim();
    if (!st.outcome && !notes && !E.ndate.value) { f.toast('Pick a result or write notes'); return; }
    const o = OUT[st.outcome];
    const patch = { visits: (l.visits || []).concat([{ date: E.date.value || todayIso(), at: new Date().toISOString(), mode: st.mode, withWho: st.withWho, outcome: st.outcome, notes }]),
      next: { date: E.ndate.value, time: E.ntime.value, action: E.naction.value, note: E.nnote.value.trim() }, chance: st.chance };
    if (o && o[2]) patch.stage = o[2];
    if (st.withWho !== 'Reception' && st.withWho !== 'Other') patch.dm = { ...(l.dm || {}), talk: 'done' };
    const btn = f.$('[data-save]', w); btn.disabled = true;
    try { await patchLead(l.id, patch); f.closeLayer(w); f.toast(patch.next.date ? 'Saved · next ' + fmtD(patch.next.date) : 'Saved'); await refresh(); openDetail(l.id); }
    catch (e) { btn.disabled = false; err(e); }
  });
}

/* ---------- detail ---------- */
function quoteText(l) {
  const q = l.quote || {}; const c = quoteCalc(q); const biz = H().BIZ || 'Arav Enterprise';
  const lines = (q.lines || []).map(x => `• ${lineLabel(x)} × ${x.qty || 1} @ ${rupee(x.price)} = ${rupee(num(x.qty || 1) * num(x.price))}`).join('\n');
  return `*Quotation – Fire Extinguisher ${q.kind === 'new' ? 'Supply' : 'Refilling'}*\n${l.name}\n\n${lines}\n\nSubtotal: ${rupee(c.sub)}\nGST: ${rupee(c.gst)} (${c.label})\n*Total: ${rupee(c.total)}*${q.notes ? '\n\n' + q.notes : ''}\n\n- ${biz} (Fire Safety)`;
}
function waLink(phone, text) { const p = H().phoneDigits(phone); return p ? 'https://wa.me/' + p + (text ? '?text=' + encodeURIComponent(text) : '') : ''; }
function openDetail(id) {
  const f = H(); const l = leads.find(x => x.id === id); if (!l) return;
  const r = l.reception || {}, m = l.dm || {}, b = l.bottles || {}, c = l.competitor || {}, q = l.quote || {};
  const d = nextDays(l); const late = isOpen(l) && d != null && d < 0;
  const tel = p => String(p || '').replace(/[^\d+]/g, '');
  const bd = b.dueDate ? days(b.dueDate) : null; const qc = quoteCalc(q);
  const visits = (l.visits || []).slice().reverse();
  const photos = l.photos || [];
  const w = f.openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>${esc(l.name)}</h2><button class="icon-btn" data-x>${f.ic('x', 20)}</button></div>
   <div class="sheet-b">
    <div class="d-top">${stagePill(l)}${l.category ? `<span class="d-type">${esc(l.category)}</span>` : ''}${l.area ? `<span class="d-type">${esc(l.area)}</span>` : ''}${l.chance !== '' && l.chance != null ? `<span class="ltag ok">${esc(l.chance)}% chance</span>` : ''}<span class="ltag ${m.talk === 'done' ? 'ok' : 'warn'}">${esc(m.role || 'Doctor')} talk ${m.talk === 'done' ? 'done' : 'pending'}</span></div>
    ${isOpen(l) ? `<div class="lnext ${late ? 'late' : ''}"><div style="flex:1;min-width:0"><div class="t">Next follow-up</div><div class="v" style="${late ? 'color:var(--red)' : ''}">${l.next && l.next.date ? fmtD(l.next.date) + (l.next.time ? ' · ' + esc(l.next.time) : '') + ' · ' + esc(nextText(l)) : 'Not set'}</div><div class="n">${esc([l.next && ACT[l.next.action], l.next && l.next.note].filter(Boolean).join(' — ')) || (m.talk !== 'done' ? 'Next: ' + esc(ACT[l.nextAction] || 'Visit again') + ' to reach ' + esc(m.role || 'doctor') : '')}</div></div><button class="btn btn-sm btn-primary" data-upd>${f.ic('plus', 15, 2.4)}Log update</button></div>` : ''}
    <div class="actions">
      <button class="act ${tel(r.phone) ? '' : 'dis'}" data-tel="${esc(tel(r.phone))}"><i style="background:#E7F6EE;color:#067647">${f.ic('phone', 17)}</i>Reception</button>
      <button class="act ${tel(m.phone) ? '' : 'dis'}" data-tel="${esc(tel(m.phone))}"><i style="background:#E7F6EE;color:#067647">${f.ic('phone', 17)}</i>${esc(m.role || 'Doctor')}</button>
      <button class="act ${mainPhone(l) ? '' : 'dis'}" data-wa><i style="background:#E7F6EE;color:#067647">${f.ic('wa', 17)}</i>WhatsApp</button>
      <button class="act" data-map><i style="background:#EAF2FF;color:#175CD3">${ic('pin', 17)}</i>Map</button>
    </div>
    <div class="kv">
      <div><div class="k">Reception</div><div class="v">${esc(r.name || '—')}<br><small>${esc(r.phone || '')}</small></div></div>
      <div><div class="k">${esc(m.role || 'Doctor')}</div><div class="v">${esc(m.name || '—')}<br><small>${esc(m.phone || '')}</small></div></div>
      ${m.email ? `<div class="full"><div class="k">Email</div><div class="v">${esc(m.email)} <button class="btn btn-sm btn-ghost" data-mail style="margin-left:6px">${ic('mail', 14)}Email</button></div></div>` : ''}
      <div class="full"><div class="k">Address</div><div class="v">${esc(l.address || '—')}</div></div>
      ${l.stage === 'lost' && l.lostReason ? `<div class="full"><div class="k">Reject reason</div><div class="v">${esc(l.lostReason)}</div></div>` : ''}
    </div>
    ${bottleCount(l) || b.dueDate ? `<div class="blk-h">Their bottles</div><div class="kv"><div><div class="k">Bottles</div><div class="v">${bottleCount(l) || '—'}${b.approx ? ' (approx)' : ''}</div></div><div><div class="k">Their refill due</div><div class="v" style="${bd != null && bd < 0 ? 'color:var(--red)' : ''}">${b.dueDate ? fmtD(b.dueDate) + (bd < 0 ? ' · expired' : bd <= 30 ? ' · in ' + bd + ' days' : '') : '—'}</div></div></div>
      ${(b.items || []).length ? `<table class="it"><thead><tr><th>Type</th><th>Kg</th><th>Qty</th></tr></thead><tbody>${b.items.map(x => `<tr><td>${esc(x.type)}</td><td>${esc(x.capacity || '—')}</td><td>${esc(x.qty)}</td></tr>`).join('')}</tbody></table>` : ''}` : ''}
    ${c.name || c.phone || (c.prices || []).length ? `<div class="blk-h">Current vendor</div><div class="kv"><div><div class="k">Company</div><div class="v">${esc(c.name || '—')}</div></div><div><div class="k">Mobile</div><div class="v">${esc(c.phone || '—')}</div></div>${c.notes ? `<div class="full"><div class="k">Notes</div><div class="v">${esc(c.notes)}</div></div>` : ''}</div>
      ${(c.prices || []).length ? `<table class="it"><thead><tr><th>Their rate</th><th>Kg</th><th>Price</th></tr></thead><tbody>${c.prices.map(x => `<tr><td>${esc(x.type)}</td><td>${esc(x.capacity || '—')}</td><td>${rupee(x.price)} <small>${c.gst === 'incl' ? 'incl. GST' : c.gst === 'none' ? 'no GST' : '+ GST'}</small></td></tr>`).join('')}</tbody></table>` : ''}` : ''}
    ${(q.lines || []).length ? `<div class="blk-h">My quotation · ${q.kind === 'new' ? 'New bottles' : 'Refilling'}</div><table class="it"><thead><tr><th>Item</th><th>Qty × Price</th><th>Amount</th></tr></thead><tbody>${q.lines.map(x => `<tr><td>${esc(lineLabel(x))}</td><td>${esc(x.qty || 1)} × ${rupee(x.price)}</td><td>${rupee(num(x.qty || 1) * num(x.price))}</td></tr>`).join('')}</tbody></table>
      <div class="ltot" style="margin:-8px 0 10px"><span>Subtotal ${rupee(qc.sub)}</span><span>GST ${rupee(qc.gst)} <small>(${esc(qc.label)})</small></span><b>Total ${rupee(qc.total)}</b></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px"><button class="btn btn-sm btn-ghost" data-qwa>${f.ic('wa', 15)}Send quote on WhatsApp</button><button class="btn btn-sm btn-ghost" data-qcopy>${ic('copy', 15)}Copy quote</button></div>` : ''}
    <div class="blk-h">Conversation history (${visits.length})</div>
    ${visits.length ? `<div class="tl">${visits.map(v => `<div class="tli"><div class="h">${fmtD(v.date)} · ${esc({ visit: 'Visit', call: 'Call', whatsapp: 'WhatsApp', email: 'Email' }[v.mode] || 'Visit')}${v.withWho ? ' · with ' + esc(v.withWho) : ''}${v.outcome && OUT[v.outcome] ? ' · <span style="color:var(--brand)">' + esc(OUT[v.outcome][1]) + '</span>' : ''}</div>${v.notes ? `<div class="b">${esc(v.notes)}</div>` : ''}</div>`).join('')}</div>` : `<div class="empty" style="padding:12px;border:1px dashed var(--line);border-radius:12px;margin-bottom:16px">No updates yet. Tap “Log update” after each call or visit.</div>`}
    ${photos.length ? `<div class="blk-h">Photos (${photos.length})</div><div class="docs">${photos.map((p, i) => `<button class="doc" data-ph="${i}"><div class="th" data-pth="${i}"><span class="fi ${f.docKind(p)}" style="width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:12px">${f.docKind(p) === 'pdf' ? 'PDF' : 'IMG'}</span></div><div class="dn"><small>${esc(p.kind || 'Photo')}</small><b>${esc(p.name || '')}</b></div></button>`).join('')}</div>` : ''}
    ${l.notes ? `<div class="blk-h">Notes</div><div class="note">${esc(l.notes)}</div>` : ''}
    ${l.convertedEntryId ? `<div class="note" style="background:var(--green-l);border-color:#ABEFC6;color:var(--green)">Added to refill customers ✓</div>` : ''}
   </div>
   <div class="sheet-f">
    <button class="btn btn-danger" data-del title="Delete">${f.ic('trash', 17)}</button>
    <button class="btn btn-ghost" data-edit style="flex:1">${f.ic('edit', 17)}Edit</button>
    ${l.convertedEntryId ? '' : `<button class="btn btn-primary" data-conv style="flex:1.4">${ic('userplus', 17)}Add as customer</button>`}
   </div></div>`);
  f.$('[data-x]', w).addEventListener('click', w._close);
  const up = f.$('[data-upd]', w); if (up) up.addEventListener('click', () => { f.closeLayer(w); openUpdate(l); });
  f.$$('[data-tel]', w).forEach(bt => bt.addEventListener('click', () => { if (bt.dataset.tel) f.openExternal('tel:' + bt.dataset.tel); }));
  f.$('[data-wa]', w).addEventListener('click', () => { const u = waLink(mainPhone(l), `Namaste ${m.name || r.name || ''},\n\n${f.BIZ || 'Arav Enterprise'} (Fire Safety) taraf thi. `); if (u) f.openExternal(u); });
  f.$('[data-map]', w).addEventListener('click', () => { const u = mapUrl(l); if (u) f.openExternal(u); else f.toast('No location saved'); });
  const ml = f.$('[data-mail]', w); if (ml) ml.addEventListener('click', () => f.openExternal(`mailto:${m.email}?subject=${encodeURIComponent('Fire extinguisher service – ' + (f.BIZ || 'Arav Enterprise'))}${(q.lines || []).length ? '&body=' + encodeURIComponent(quoteText(l).replace(/\*/g, '')) : ''}`));
  const qw = f.$('[data-qwa]', w); if (qw) qw.addEventListener('click', () => { const u = waLink(mainPhone(l), quoteText(l)); if (u) f.openExternal(u); else f.toast('Add a mobile number first'); });
  const qcp = f.$('[data-qcopy]', w); if (qcp) qcp.addEventListener('click', async () => { try { await navigator.clipboard.writeText(quoteText(l)); f.toast('Quote copied'); } catch (_) { f.toast('Copy not allowed here'); } });
  f.$$('[data-ph]', w).forEach(bt => bt.addEventListener('click', () => f.openDoc(photos[+bt.dataset.ph])));
  photos.forEach(async (p, i) => { if (f.docKind(p) !== 'img') return; try { const u = await f.signedUrl(p.path); const th = f.$(`[data-pth="${i}"]`, w); if (th) th.innerHTML = `<img src="${esc(u)}" alt="" loading="lazy">`; } catch (_) {} });
  f.$('[data-edit]', w).addEventListener('click', () => { f.closeLayer(w); openForm(l); });
  const cv = f.$('[data-conv]', w); if (cv) cv.addEventListener('click', () => {
    f.closeLayer(w);
    const items = (q.lines || []).length ? q.lines.map(x => ({ type: x.type, capacity: x.capacity, qty: +x.qty || 1 })) : (b.items || []).map(x => ({ type: x.type, capacity: x.capacity, qty: +x.qty || 1 }));
    f.openForm(null, null, { prefill: { shop: l.name, person: m.name || r.name || '', phone: m.phone || r.phone || '', address: l.address || '', area: l.area || '', location: l.location || '', items },
      onSaved: async (entryId) => { await patchLead(l.id, { convertedEntryId: entryId, stage: 'won', next: { ...(l.next || {}), date: '' } }); refresh(); } });
  });
  f.$('[data-del]', w).addEventListener('click', async () => {
    if (!await f.confirmBox('Delete this place?', `“${l.name}” with its ${visits.length} update${visits.length === 1 ? '' : 's'} and ${photos.length} photo${photos.length === 1 ? '' : 's'} will be deleted permanently. Refill customers are not affected.`, 'Delete', true)) return;
    try { const { error } = await f.sb.from('leads').delete().eq('id', l.id); if (error) throw error; f.closeLayer(w); f.toast('Deleted'); await f.removeDocs(photos.map(p => p.path).filter(Boolean)); refresh(); } catch (e) { err(e); }
  });
}

/* ---------- my price list ---------- */
function openPriceList() {
  const f = H(); const list = (settings.priceList || []).map(x => ({ ...x }));
  if (!list.length) [['ABC Type', '2'], ['ABC Type', '4'], ['ABC Type', '6'], ['ABC Type', '9'], ['CO2 Type', '4.5'], ['Automatic ABC Type', '5']].forEach(([t, k]) => list.push({ type: t, capacity: k, refill: '', newPrice: '' }));
  const w = f.openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>My price list</h2><button class="icon-btn" data-x>${f.ic('x', 20)}</button></div>
   <div class="sheet-b"><p style="font-size:13.5px;color:var(--ink2);font-weight:600;margin-bottom:12px">Your standard rate per bottle (before GST). Used to fill quotations quickly.</p>
    <div class="lrow3 lhead"><span>Type</span><span>Kg</span><span>Refill ₹</span><span>New ₹</span><span></span></div><div id="plRows"></div>
    <button class="btn btn-sm btn-soft" data-add style="margin-top:4px">${f.ic('plus', 15)}Add row</button>
    <div class="fgrid" style="margin-top:16px"><div class="f"><label>Default GST %</label><input id="plGst" type="number" min="0" step="0.5" inputmode="decimal"></div></div>
   </div>
   <div class="sheet-f"><button class="btn btn-ghost" data-cancel style="flex:1">Cancel</button><button class="btn btn-primary" data-save style="flex:2">${f.ic('check', 18, 2.4)}Save price list</button></div></div>`);
  const box = f.$('#plRows', w);
  const draw = () => { box.innerHTML = list.map((x, i) => `<div class="lrow3" data-i="${i}"><select data-k="type">${typeOpts(x.type)}</select><input data-k="capacity" type="number" step="0.5" inputmode="decimal" value="${esc(x.capacity || '')}"><input data-k="refill" type="number" inputmode="decimal" placeholder="₹" value="${esc(x.refill == null ? '' : x.refill)}"><input data-k="newPrice" type="number" inputmode="decimal" placeholder="₹" value="${esc(x.newPrice == null ? '' : x.newPrice)}"><button type="button" class="icon-btn" data-rm>${f.ic('trash', 15)}</button></div>`).join('');
    f.$$('[data-i]', box).forEach(r => { const i = +r.dataset.i; f.$$('[data-k]', r).forEach(inp => inp.addEventListener('input', () => { list[i][inp.dataset.k] = inp.value; })); f.$('[data-rm]', r).addEventListener('click', () => { list.splice(i, 1); draw(); }); }); };
  draw();
  f.$('#plGst', w).value = settings.gstRate == null || settings.gstRate === '' ? 18 : settings.gstRate;
  f.$('[data-add]', w).addEventListener('click', () => { list.push({ type: 'ABC Type', capacity: '', refill: '', newPrice: '' }); draw(); });
  f.$('[data-x]', w).addEventListener('click', w._close); f.$('[data-cancel]', w).addEventListener('click', w._close);
  f.$('[data-save]', w).addEventListener('click', async () => {
    const data = { ...settings, gstRate: num(f.$('#plGst', w).value), priceList: list.filter(x => x.type).map(x => ({ type: x.type, capacity: String(x.capacity || ''), refill: x.refill === '' ? '' : num(x.refill), newPrice: x.newPrice === '' ? '' : num(x.newPrice) })) };
    try { await saveSettings(data); f.closeLayer(w); f.toast('Price list saved'); } catch (e) { err(e); }
  });
}
function settingsRowHTML() { const f = H(); return `<div class="set-row"><div class="sic" style="background:var(--brand-l);color:var(--brand)">${ic('tag', 18)}</div><div class="t"><b>My price list</b><small>Refill & new bottle rates, GST — used in quotations</small></div><button class="btn btn-sm btn-ghost" data-pricelist>Edit</button></div>`; }

/* ---------- export ---------- */
function exportCSV() {
  const f = H(); if (!leads.length) { f.toast('No leads to export'); return; }
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const cols = ['Place', 'Type', 'Area', 'Address', 'Location', 'Status', 'Chance %', 'Reception', 'Reception mobile', 'Decision maker', 'DM name', 'DM mobile', 'DM email', 'DM talk', 'Next follow-up', 'Next time', 'Next by', 'Next note', 'Bottles', 'Approx', 'Their refill due', 'Vendor', 'Vendor mobile', 'Vendor rates', 'My quote total', 'Last update', 'Updates'];
  const rows = leads.map(l => { const r = l.reception || {}, m = l.dm || {}, b = l.bottles || {}, c = l.competitor || {}; const v = (l.visits || []).slice(-1)[0];
    return [l.name, l.category, l.area, l.address, l.location, (STAGE[l.stage] || STAGE.new)[1], l.chance, r.name, r.phone, m.role, m.name, m.phone, m.email, m.talk === 'done' ? 'Done' : 'Pending', l.next && l.next.date, l.next && l.next.time, l.next && ACT[l.next.action], l.next && l.next.note, bottleCount(l), b.approx ? 'Yes' : '', b.dueDate, c.name, c.phone, (c.prices || []).map(x => `${lineLabel(x)} ₹${x.price}`).join('; '), (l.quote && (l.quote.lines || []).length) ? Math.round(quoteCalc(l.quote).total) : '', v ? `${v.date}: ${v.notes || (OUT[v.outcome] || [])[1] || ''}` : '', (l.visits || []).length].map(q).join(','); });
  f.saveFile('fire-leads-' + todayIso() + '.csv', '\ufeff' + cols.map(q).join(',') + '\n' + rows.join('\n'), 'text/csv');
}

/* ---------- Android reminders (ids 1000–1999; refill reminders use 1–999) ---------- */
let lastSig = '';
async function scheduleReminders() {
  const f = H(); if (!f || !f.isNative) return; const LN = f.plug('LocalNotifications'); if (!LN) return;
  try {
    const p = await LN.checkPermissions(); if (p.display !== 'granted') return;
    const now = Date.now(); const list = [];
    leads.filter(isOpen).forEach(l => {
      if (l.next && l.next.date) { const d = f.pd(l.next.date); if (d) { const at = new Date(d); if (l.next.time && /^\d\d:\d\d/.test(l.next.time)) at.setHours(+l.next.time.slice(0, 2), +l.next.time.slice(3, 5), 0, 0); else at.setHours(f.REMIND_H, 0, 0, 0);
        if (at.getTime() > now) list.push({ at, title: `📞 Follow-up: ${l.name}`, body: [ACT[l.next.action], l.next.note, (l.dm && l.dm.talk !== 'done') ? (l.dm.role || 'Doctor') + ' talk pending' : ''].filter(Boolean).join(' · ') || 'Time to follow up', id: l.id }); } }
      if (l.bottles && l.bottles.dueDate) { const d = f.pd(l.bottles.dueDate); if (d) { const at = new Date(d); at.setDate(at.getDate() - 7); at.setHours(f.REMIND_H, 30, 0, 0); if (at.getTime() > now) list.push({ at, title: `🔥 Opportunity: ${l.name}`, body: `Their bottles need refill on ${fmtD(l.bottles.dueDate)} — contact them`, id: l.id }); } }
    });
    list.sort((a, b) => a.at - b.at); const top = list.slice(0, 60);
    const sig = top.map(n => n.at.getTime() + n.title + n.body).join('|'); if (sig === lastSig) return;
    const pend = await LN.getPending(); const old = (pend.notifications || []).filter(n => n.id >= 1000 && n.id < 2000);
    if (old.length) await LN.cancel({ notifications: old.map(n => ({ id: n.id })) });
    if (top.length) await LN.schedule({ notifications: top.map((n, i) => ({ id: 1000 + i, title: n.title, body: n.body, schedule: { at: n.at, allowWhileIdle: true }, smallIcon: 'ic_stat_fire', iconColor: '#E23D28', extra: { leadId: n.id } })) });
    lastSig = sig;
  } catch (e) { console.warn('lead reminders', e); }
}

window.FTLeads = { render, search, openForm, openDetail, dashboardHTML, bindDashboard, refresh, scheduleReminders, settingsRowHTML, openPriceList, fillGeo, mapUrl };
})();
