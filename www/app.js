/* Arav Fire Safety · Refill Tracker
   Works as: installable web app (iPhone / PC / Android browser) and Android APK (Capacitor).
   Data + documents live in your own Supabase project. */
(function () {
"use strict";

/* ---------------- Icons ---------------- */
const P = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  down:'<path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  alert:'<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  fire:'<path d="M12 22c4 0 7-2.8 7-7 0-3.5-2.2-6-4-8-.4 2-1.5 3.5-3 4 .5-3-1-6.5-4-9 0 3.5-3 6-3 10 0 5.5 3 10 7 10z"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  wa:'<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 1.9H8A2 2 0 0 1 6 20L5 6"/>',
  refresh:'<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5"/>',
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  upload:'<path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  chevL:'<path d="m15 18-6-6 6-6"/>', chevR:'<path d="m9 18 6-6-6-6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  more:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  android:'<path d="M5 16V9a7 7 0 0 1 14 0v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM8 4 6.5 2M16 4l1.5-2M9 9h.01M15 9h.01M3 10v4M21 10v4"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  wifi:'<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 20h.01"/>'
};
function ic(n, s = 20, w = 2) { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`; }

/* ---------------- Helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_L = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function pd(s) { if (!s || typeof s !== 'string') return null; const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!m) return null; return new Date(+m[1], +m[2] - 1, +m[3]); }
function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function today() { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
function fmt(s) { const d = pd(s); return d ? String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : '—'; }
function addYearMinusDay(s) { const d = pd(s); if (!d) return ''; const n = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()); n.setDate(n.getDate() - 1); return iso(n); }
function daysUntil(s) { const d = pd(s); if (!d) return null; return Math.round((d - today()) / 86400000); }
function initials(n) { const w = String(n || '?').replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/); return ((w[0] || '?')[0] + ((w[1] || '')[0] || '')).toUpperCase(); }
function qtyOf(e) { return (Array.isArray(e.items) ? e.items : []).reduce((a, i) => a + (+i.qty || 0), 0); }
function phoneDigits(p) { let d = String(p || '').replace(/\D/g, ''); if (d.length === 10) d = '91' + d; if (d.length === 11 && d[0] === '0') d = '91' + d.slice(1); return d; }
function money(n) { n = +n || 0; return '₹' + n.toLocaleString('en-IN'); }
function itemLabel(i) { return [i.type, i.capacity ? i.capacity + ' Kg' : ''].filter(Boolean).join(' · '); }
function lsGet(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
function lsDel(k) { try { localStorage.removeItem(k); } catch (_) {} }
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

const STATUS = { overdue: ['Overdue','s-overdue'], today: ['Due today','s-today'], soon: ['Due soon','s-soon'], upcoming: ['Upcoming','s-upcoming'], active: ['Active','s-active'], renewed: ['Refilled','s-renewed'] };
function statusOf(e) { if (e.status === 'renewed') return 'renewed'; const d = daysUntil(e.dueDate); if (d == null) return 'active'; if (d < 0) return 'overdue'; if (d === 0) return 'today'; if (d <= 7) return 'soon'; if (d <= 30) return 'upcoming'; return 'active'; }
function pill(e) { const s = STATUS[statusOf(e)]; return `<span class="pill ${s[1]}">${s[0]}</span>`; }
function dueText(e) { if (e.status === 'renewed') return 'Refilled'; const d = daysUntil(e.dueDate); if (d == null) return '—'; if (d < 0) return `${-d} day${d === -1 ? '' : 's'} overdue`; if (d === 0) return 'Due today'; if (d === 1) return 'Due tomorrow'; if (d <= 45) return `in ${d} days`; return fmt(e.dueDate); }
const AV = { overdue: ['#FEECEB','#D92D20'], today: ['#FEECEB','#D92D20'], soon: ['#FEF4E6','#B54708'], upcoming: ['#EAF2FF','#175CD3'], active: ['#E7F6EE','#067647'], renewed: ['#F1F3F6','#667085'] };
const EXT_TYPES = ['ABC Type','Automatic ABC Type','CO2 Type','Water / Foam Type','Clean Agent Type','K Type (Kitchen)','DCP Type','Other'];

/* ---------------- Platform ---------------- */
const CFG = window.APP_CONFIG || {};
const Cap = window.Capacitor;
const isNative = !!(Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform());
const plug = n => (isNative && Cap.Plugins && Cap.Plugins[n]) || null;
const BIZ = CFG.businessName || 'Arav Enterprise';
const REMIND_H = Number.isFinite(+CFG.reminderHour) ? +CFG.reminderHour : 9;

function openExternal(url) {
  if (!url) return;
  if (isNative) { window.location.href = url; return; }           // Android opens dialer / WhatsApp / Calendar / browser
  if (/^(tel|mailto):/.test(url)) { window.location.href = url; return; }
  const w = window.open(url, '_blank', 'noopener'); if (!w) window.location.href = url;
}

/* ---------------- State ---------------- */
let sb = null, user = null;
let entries = [], loaded = false, offline = false;
let view = 'dashboard', query = '', filter = 'all', sortBy = 'due';
let monthSel = { y: today().getFullYear(), m: today().getMonth() };
let channel = null, refetchT = null;
const toastEl = $('#toast'); let toastT;
function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600); }

/* ---------------- Boot ---------------- */
function conf() { return { url: (CFG.supabaseUrl || lsGet('fst_url') || '').trim(), key: (CFG.supabaseKey || lsGet('fst_key') || '').trim() }; }

async function boot() {
  if ('serviceWorker' in navigator && !isNative && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(() => {}); }
  const c = conf();
  if (!c.url || !c.key) { renderSetup(); return; }
  if (!window.supabase || !window.supabase.createClient) { renderFatal('Could not load the app files. Check internet and reopen.'); return; }
  try {
    sb = window.supabase.createClient(c.url, c.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'fst-auth' } });
  } catch (e) { renderSetup('Supabase URL or key looks wrong.'); return; }
  let session = null;
  try { session = (await sb.auth.getSession()).data.session; } catch (_) {}
  sb.auth.onAuthStateChange((ev, s) => {
    if (ev === 'SIGNED_OUT') { user = null; entries = []; loaded = false; lsDel('fst_cache'); renderLogin(); }
  });
  if (session && session.user) { user = session.user; startApp(); }
  else renderLogin();
}

function renderFatal(msg) {
  $('#root').innerHTML = `<div class="auth"><div class="card auth-card"><div class="brand-mark">${ic('fire', 28, 2.2)}</div><h2>Something went wrong</h2><p class="sub">${esc(msg)}</p><button class="btn btn-primary btn-block" onclick="location.reload()">Try again</button></div></div>`;
}

function renderSetup(err) {
  const c = conf();
  $('#root').innerHTML = `<div class="auth"><form class="card auth-card" id="setupF">
    <div class="brand-mark">${ic('fire', 28, 2.2)}</div><h2>Connect your database</h2>
    <p class="sub">One-time setup. Paste the values from Supabase → Project Settings → API.</p>
    ${err ? `<div class="auth-err">${esc(err)}</div>` : ''}
    <div class="f"><label>Project URL</label><input name="url" placeholder="https://xxxx.supabase.co" value="${esc(c.url)}" autocomplete="off" autocapitalize="off"></div>
    <div class="f"><label>Anon / publishable key</label><input name="key" placeholder="eyJ… or sb_publishable_…" value="${esc(c.key)}" autocomplete="off" autocapitalize="off"></div>
    <button class="btn btn-primary btn-block" type="submit">Save & continue</button></form></div>`;
  $('#setupF').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    const url = f.url.value.trim().replace(/\/+$/, ''), key = f.key.value.trim();
    if (!/^https:\/\/.+/.test(url) || key.length < 20) { renderSetup('Please paste a valid URL and key.'); return; }
    lsSet('fst_url', url); lsSet('fst_key', key); location.reload();
  });
}

function renderLogin(err) {
  $('#layer').innerHTML = ''; document.body.style.overflow = '';
  $('#root').innerHTML = `<div class="auth"><form class="card auth-card" id="loginF" novalidate>
    <div class="brand-mark">${ic('fire', 28, 2.2)}</div><h2>Arav Fire Safety</h2>
    <p class="sub">Refill Tracker · sign in once on each device</p>
    ${err ? `<div class="auth-err">${esc(err)}</div>` : ''}
    <div class="f"><label>Email</label><input name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" required></div>
    <div class="f"><label>Password</label><input name="password" type="password" autocomplete="current-password" required></div>
    <button class="btn btn-primary btn-block" type="submit" id="loginBtn">${ic('lock', 17)}Sign in</button>
    ${CFG.supabaseUrl ? '' : `<button type="button" class="btn btn-block" style="margin-top:8px;color:var(--ink3)" id="resetConn">Change database connection</button>`}
  </form></div>`;
  const f = $('#loginF');
  const rc = $('#resetConn'); if (rc) rc.addEventListener('click', () => { lsDel('fst_url'); lsDel('fst_key'); location.reload(); });
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const email = f.email.value.trim(), password = f.password.value;
    if (!email || !password) { renderLogin('Enter email and password.'); return; }
    const b = $('#loginBtn'); b.disabled = true; b.innerHTML = '<span class="spin"></span>';
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      user = data.user; startApp();
    } catch (er) {
      const m = String(er && er.message || er);
      renderLogin(/invalid login/i.test(m) ? 'Wrong email or password.' : /fetch|network/i.test(m) ? 'No internet / cannot reach database.' : m);
    }
  });
}

/* ---------------- App shell ---------------- */
const NAV = { dashboard: ['home','Dashboard','Home'], entries: ['list','All entries','Entries'], monthly: ['cal','Monthly view','Monthly'] };

function renderShell() {
  $('#root').innerHTML = `<div class="app">
  <aside class="sidebar">
    <div class="brand"><div class="brand-mark">${ic('fire', 20, 2.2)}</div><div><b>Arav Fire Safety</b><small>Refill Tracker</small></div></div>
    ${Object.keys(NAV).map(k => `<button class="nav-btn" data-nav="${k}">${ic(NAV[k][0], 19)}<span>${NAV[k][1]}</span>${k === 'dashboard' ? '<span class="count hidden" data-badge></span>' : ''}</button>`).join('')}
    <button class="nav-btn" data-action="settings">${ic('gear', 19)}<span>Settings & backup</span></button>
    <div class="side-foot">
      <button class="btn btn-primary btn-block" data-action="new">${ic('plus', 18, 2.4)}New entry</button>
      <div class="sync"><span class="dot" id="syncDot"></span><span id="syncTxt">Connecting…</span></div>
    </div>
  </aside>
  <div class="main">
    <header class="topbar">
      <div><h1 id="pageTitle">Dashboard</h1><div class="sub" id="pageSub"></div></div>
      <label class="search"><span>${ic('search', 17)}</span><input id="globalSearch" type="search" placeholder="Search shop, person, mobile, area…" autocomplete="off"></label>
      <button class="btn btn-primary desk" data-action="new">${ic('plus', 18, 2.4)}New entry</button>
    </header>
    <div class="content" id="view"></div>
  </div></div>
  <nav class="tabbar">
    <button class="tab" data-nav="dashboard">${ic('home', 22)}Home<span class="badge hidden" data-badge></span></button>
    <button class="tab" data-nav="entries">${ic('list', 22)}Entries</button>
    <button class="tab" data-action="new"><span class="fab">${ic('plus', 24, 2.4)}</span></button>
    <button class="tab" data-nav="monthly">${ic('cal', 22)}Monthly</button>
    <button class="tab" data-action="settings">${ic('gear', 22)}More</button>
  </nav>`;
  $('#globalSearch').addEventListener('input', e => { query = e.target.value; if (view !== 'entries') go('entries'); else renderList(); });
}

document.addEventListener('click', e => {
  const n = e.target.closest('[data-nav]'); if (n) { go(n.dataset.nav); return; }
  const a = e.target.closest('[data-action]'); if (!a) return;
  const act = a.dataset.action;
  if (act === 'new') openForm();
  else if (act === 'settings') openSettings();
});

function go(v, keepScroll) {
  if (!NAV[v]) v = 'dashboard';
  view = v;
  if (!isNative && location.hash !== '#' + v) { try { history.replaceState(null, '', '#' + v); } catch (_) {} }
  $$('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === v));
  render(); if (!keepScroll) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h && h !== view && NAV[h] && $('#view')) go(h); });

function setSync(state, txt) { const d = $('#syncDot'); if (!d) return; d.className = 'dot ' + (state || ''); $('#syncTxt').textContent = txt; }

async function startApp() {
  renderShell();
  try { const c = JSON.parse(lsGet('fst_cache') || 'null'); if (c && Array.isArray(c.entries) && c.uid === user.id) { entries = c.entries; loaded = true; } } catch (_) {}
  const h = (location.hash || '').slice(1);
  go(NAV[h] ? h : 'dashboard');
  await fetchAll();
  subscribeLive();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') fetchAll(); });
  window.addEventListener('online', () => fetchAll());
  window.addEventListener('offline', () => { offline = true; setSync('warn', 'Offline · showing saved copy'); render(); });
  if (isNative) setupNative();
}

function rowToEntry(r) { const d = r.data || {}; return { ...d, id: r.id, createdAt: d.createdAt || r.created_at, updatedAt: d.updatedAt || r.updated_at }; }

async function fetchAll() {
  if (!sb || !user) return;
  try {
    const { data, error } = await sb.from('entries').select('id,data,created_at,updated_at').order('created_at', { ascending: true }).limit(5000);
    if (error) throw error;
    entries = (data || []).map(rowToEntry);
    offline = false; loaded = true;
    lsSet('fst_cache', JSON.stringify({ uid: user.id, at: Date.now(), entries }));
    setSync('ok', 'Synced · all devices');
  } catch (e) {
    const m = String(e && e.message || e);
    if (/JWT|token|auth/i.test(m) && !/fetch/i.test(m)) { try { await sb.auth.signOut(); } catch (_) {} return; }
    offline = true; loaded = true;
    setSync('warn', /relation|does not exist|schema/i.test(m) ? 'Database table missing — run setup.sql' : 'Offline · showing saved copy');
  }
  if (view === 'entries' && $('#entryList')) renderList(); else render();
  scheduleReminders();
}

function subscribeLive() {
  if (!sb || channel) return;
  try {
    channel = sb.channel('entries-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, () => { clearTimeout(refetchT); refetchT = setTimeout(fetchAll, 400); })
      .subscribe();
  } catch (_) {}
}

/* ---------------- Data writes ---------------- */
function writeErr(err) {
  const m = String(err && err.message || err);
  toast(/fetch|network|Failed/i.test(m) ? 'No internet — couldn’t save. Try again.' : 'Couldn’t save: ' + m.slice(0, 80));
}
async function dbInsert(body) {
  const { data, error } = await sb.from('entries').insert({ data: body }).select('id').single();
  if (error) throw error; return data.id;
}
async function dbUpdate(id, body) {
  const { error } = await sb.from('entries').update({ data: body, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
async function dbPatch(id, patch) {
  const cur = entries.find(e => e.id === id); if (!cur) return;
  const body = { ...cur, ...patch }; delete body.id;
  await dbUpdate(id, body);
}
async function dbDelete(id) { const { error } = await sb.from('entries').delete().eq('id', id); if (error) throw error; }

function safeName(n) { return String(n || 'file').normalize('NFKD').replace(/[^\w.\-]+/g, '_').slice(-80); }
async function uploadDoc(file, nameOverride) {
  const name = nameOverride || file.name || 'file';
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName(name)}`;
  const { error } = await sb.storage.from('docs').upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });
  if (error) throw error;
  return { path, name, contentType: file.type || '', size: file.size || 0 };
}
const urlCache = {};
async function signedUrl(path) {
  const c = urlCache[path]; if (c && c.exp > Date.now()) return c.url;
  const { data, error } = await sb.storage.from('docs').createSignedUrl(path, 3600);
  if (error) throw error;
  urlCache[path] = { url: data.signedUrl, exp: Date.now() + 50 * 60 * 1000 }; return data.signedUrl;
}
async function removeDocs(paths) { if (!paths.length) return; try { await sb.storage.from('docs').remove(paths); } catch (_) {} }

/* ---------------- Render ---------------- */
function greeting() { const h = new Date().getHours(); return (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ' · ' + fmt(iso(today())); }
function render() {
  const el = $('#view'); if (!el) return;
  const titles = { dashboard: 'Dashboard', entries: 'All entries', monthly: 'Monthly view' };
  $('#pageTitle').innerHTML = esc(titles[view]) + (offline && loaded ? `<span class="offline-tag">${ic('wifi', 13)}Offline</span>` : '');
  updateBadges();
  if (!loaded) { el.innerHTML = skeleton(); $('#pageSub').textContent = 'Loading…'; return; }
  if (view === 'dashboard') renderDashboard(el);
  else if (view === 'entries') renderEntries(el);
  else renderMonthly(el);
}
function skeleton() { let r = ''; for (let i = 0; i < 5; i++) r += `<div class="row" style="cursor:default"><div class="avatar skel" style="height:42px"></div><div class="mid"><div class="skel" style="width:55%;margin-bottom:8px"></div><div class="skel" style="width:35%;height:11px"></div></div></div>`; return `<div class="stats">${'<div class="card stat"><div class="skel" style="width:60%"></div><div class="skel" style="width:40%;height:26px;margin-top:12px"></div></div>'.repeat(4)}</div><div class="card"><div class="section-h"><div class="skel" style="width:140px"></div></div>${r}</div>`; }

function active() { return entries.filter(e => e.status !== 'renewed'); }
function counts() {
  const a = active(); const t = today(); const c = { overdue: 0, week: 0, month: 0, bottles: 0, customers: 0, pending: 0 };
  const names = new Set();
  a.forEach(e => { const d = daysUntil(e.dueDate); if (d != null && d < 0) c.overdue++; if (d != null && d >= 0 && d <= 7) c.week++; const dd = pd(e.dueDate); if (dd && dd.getFullYear() === t.getFullYear() && dd.getMonth() === t.getMonth()) c.month++; c.bottles += qtyOf(e); names.add((e.shop || '').trim().toLowerCase()); });
  entries.forEach(e => { if (e.payment === 'Pending') c.pending += (+e.amount || 0); });
  c.customers = names.size; return c;
}
function updateBadges() { const c = counts(); const n = c.overdue + c.week; $$('[data-badge]').forEach(b => { b.textContent = n; b.classList.toggle('hidden', !n || !loaded); }); }

function rowHTML(e, opts = {}) {
  const s = statusOf(e); const a = AV[s]; const q = qtyOf(e);
  const meta = [e.person, e.phone, e.area].filter(Boolean).map(esc).join(' · ') || esc(e.type || '');
  return `<div class="row" data-open="${esc(e.id)}">
    <div class="avatar" style="background:${a[0]};color:${a[1]}">${esc(initials(e.shop))}</div>
    <div class="mid"><div class="name">${esc(e.shop || 'Untitled')}</div><div class="meta">${meta}<span class="hide-sm"> · ${q} bottle${q === 1 ? '' : 's'}</span></div></div>
    <div class="end"><div class="due">${opts.showDate ? fmt(e.dueDate) : esc(dueText(e))}</div>${pill(e)}</div></div>`;
}
function bindRows(root) { $$('[data-open]', root).forEach(r => r.addEventListener('click', () => openDetail(r.dataset.open))); }
function emptyBox(t, icn = 'box') { return `<div class="empty"><div class="em-ic">${ic(icn, 22)}</div>${esc(t)}</div>`; }
function stat(k, l, n, h, c, icn) { return `<div class="card stat" data-stat="${k}"><div class="lbl"><i style="background:${c[0]};color:${c[1]}">${ic(icn, 15, 2.2)}</i>${esc(l)}</div><div class="num">${n}</div><div class="hint">${esc(h)}</div></div>`; }

function renderDashboard(el) {
  $('#pageSub').textContent = greeting();
  const c = counts(); const a = active(); const t = today();
  const attention = a.filter(e => { const d = daysUntil(e.dueDate); return d != null && d <= 7; }).sort((x, y) => (x.dueDate || '').localeCompare(y.dueDate || ''));
  const upcoming = a.filter(e => { const d = daysUntil(e.dueDate); return d != null && d > 7 && d <= 60; }).sort((x, y) => (x.dueDate || '').localeCompare(y.dueDate || ''));
  const recent = [...entries].sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || '')).slice(0, 5);
  let alert = '';
  if (c.overdue || c.week) alert = `<div class="alert"><div class="ic">${ic('bell', 19)}</div><div><b>${c.overdue ? c.overdue + ' overdue' : ''}${c.overdue && c.week ? ' · ' : ''}${c.week ? c.week + ' due in next 7 days' : ''}</b><p>Call or WhatsApp these customers to book their refilling.</p></div><button class="btn btn-sm btn-primary" id="seeAtt">View list</button></div>`;
  const firstRun = !entries.length ? `<div class="card" style="padding:22px;margin-bottom:18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b style="font-size:16px">Welcome! Your tracker is empty.</b><p style="color:var(--ink2);font-size:14px;margin-top:4px">Tap “New entry” to add your first sale with its certificate.</p></div><button class="btn btn-primary" data-action="new">${ic('plus', 17, 2.4)}New entry</button></div>` : '';
  el.innerHTML = `
  <label class="search mobile-search"><span>${ic('search', 17)}</span><input id="mSearch" type="search" placeholder="Search shop, person, mobile…" autocomplete="off"></label>
  ${firstRun}${alert}
  <div class="stats">
    ${stat('overdue', 'Overdue', c.overdue, 'Refill date passed', ['#FEECEB','#D92D20'], 'alert')}
    ${stat('soon', 'Due in 7 days', c.week, 'Reminder window', ['#FEF4E6','#B54708'], 'clock')}
    ${stat('month', 'Due in ' + MONTHS_L[t.getMonth()], c.month, 'This month', ['#EAF2FF','#175CD3'], 'cal')}
    ${stat('all', 'Bottles in service', c.bottles, c.customers + ' customer' + (c.customers === 1 ? '' : 's'), ['#E7F6EE','#067647'], 'fire')}
  </div>
  <div class="grid2">
    <div class="card"><div class="section-h"><h3>Needs attention</h3><button class="link" data-nav="entries">See all</button></div>
      <div class="list">${attention.length ? attention.map(e => rowHTML(e)).join('') : emptyBox('Nothing overdue or due this week. All good!', 'check')}</div></div>
    <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
      <div class="card"><div class="section-h"><h3>Coming up · 60 days</h3><button class="link" data-nav="monthly">Monthly</button></div>
        <div class="list">${upcoming.length ? upcoming.slice(0, 6).map(e => rowHTML(e)).join('') : emptyBox('No refills due in the next 2 months.', 'cal')}</div></div>
      <div class="card"><div class="section-h"><h3>Recently added</h3>${c.pending ? `<span class="pill s-soon">${money(c.pending)} pending</span>` : ''}</div>
        <div class="list">${recent.length ? recent.map(e => rowHTML(e)).join('') : emptyBox('No entries yet.', 'plus')}</div></div>
    </div>
  </div>`;
  bindRows(el);
  $$('[data-stat]', el).forEach(s => s.addEventListener('click', () => { const k = s.dataset.stat; if (k === 'month') { monthSel = { y: t.getFullYear(), m: t.getMonth() }; go('monthly'); } else { filter = k === 'all' ? 'all' : k; go('entries'); } }));
  const sa = $('#seeAtt', el); if (sa) sa.addEventListener('click', () => { filter = 'attention'; go('entries'); });
  const is = $('#impSeed', el); if (is) is.addEventListener('click', importSeed);
  const ms = $('#mSearch', el); if (ms) ms.addEventListener('input', () => { query = ms.value; $('#globalSearch').value = query; go('entries'); setTimeout(() => { const x = $('#mSearch2'); if (x) { x.focus(); x.setSelectionRange(x.value.length, x.value.length); } }, 0); });
}

const FILTERS = [['all','All'],['attention','Needs attention'],['overdue','Overdue'],['soon','Due in 7 days'],['upcoming','Next 30 days'],['active','Active'],['renewed','Refilled'],['pending','Payment pending']];
function matchFilter(e, f) { const s = statusOf(e);
  if (f === 'all') return s !== 'renewed'; if (f === 'attention') return s === 'overdue' || s === 'today' || s === 'soon';
  if (f === 'soon') return s === 'today' || s === 'soon'; if (f === 'pending') return e.payment === 'Pending'; return s === f; }
function matchQuery(e, q) { if (!q) return true; q = q.toLowerCase().trim(); const hay = [e.shop, e.person, e.phone, e.area, e.address, e.billNo, e.notes, (e.items || []).map(itemLabel).join(' ')].join(' ').toLowerCase(); return q.split(/\s+/).every(w => hay.includes(w) || hay.replace(/\s/g, '').includes(w)); }
function renderEntries(el) {
  $('#pageSub').textContent = '';
  el.innerHTML = `<label class="search mobile-search"><span>${ic('search', 17)}</span><input id="mSearch2" type="search" placeholder="Search shop, person, mobile, area…" autocomplete="off" value="${esc(query)}"></label>
  <div class="toolbar"><div class="chips" id="chips"></div>
  <select class="sort" id="sortSel"><option value="due">Sort: Due date</option><option value="name">Sort: Name A–Z</option><option value="recent">Sort: Recently added</option><option value="service">Sort: Service date</option></select></div>
  <div class="card"><div class="list" id="entryList"></div></div>`;
  $('#sortSel', el).value = sortBy;
  $('#sortSel', el).addEventListener('change', e => { sortBy = e.target.value; renderList(); });
  $('#mSearch2', el).addEventListener('input', e => { query = e.target.value; $('#globalSearch').value = query; renderList(); });
  renderList();
}
function renderList() {
  const list = $('#entryList'); if (!list) return;
  const chips = $('#chips');
  chips.innerHTML = FILTERS.map(([k, l]) => { const n = entries.filter(e => matchFilter(e, k) && matchQuery(e, query)).length; return `<button class="chip ${filter === k ? 'on' : ''}" data-f="${k}">${l}<span class="n">${n}</span></button>`; }).join('');
  $$('[data-f]', chips).forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; renderList(); }));
  const r = entries.filter(e => matchFilter(e, filter) && matchQuery(e, query));
  const cmp = { due: (a, b) => (a.dueDate || '9').localeCompare(b.dueDate || '9'), name: (a, b) => (a.shop || '').localeCompare(b.shop || ''), recent: (a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''), service: (a, b) => (b.date || '').localeCompare(a.date || '') }[sortBy];
  r.sort(cmp);
  $('#pageSub').textContent = r.length + ' entr' + (r.length === 1 ? 'y' : 'ies') + (query ? ' matching “' + query + '”' : '');
  list.innerHTML = r.length ? r.map(e => rowHTML(e, { showDate: sortBy !== 'due' })).join('') : emptyBox(query ? 'No match for “' + query + '”. Try shop name, person or mobile.' : 'No entries in this list.', 'search');
  bindRows(list);
}

function renderMonthly(el) {
  const { y, m } = monthSel; const a = active();
  const byM = Array.from({ length: 12 }, () => ({ n: 0, b: 0 }));
  a.forEach(e => { const d = pd(e.dueDate); if (d && d.getFullYear() === y) { byM[d.getMonth()].n++; byM[d.getMonth()].b += qtyOf(e); } });
  const t = today();
  const sel = a.filter(e => { const d = pd(e.dueDate); return d && d.getFullYear() === y && d.getMonth() === m; }).sort((p, q) => (p.dueDate || '').localeCompare(q.dueDate || ''));
  const bottles = sel.reduce((s, e) => s + qtyOf(e), 0);
  const byType = {}; sel.forEach(e => (e.items || []).forEach(i => { const k = itemLabel(i) || 'Other'; byType[k] = (byType[k] || 0) + (+i.qty || 0); }));
  $('#pageSub').textContent = `${MONTHS_L[m]} ${y} · ${sel.length} customer${sel.length === 1 ? '' : 's'} · ${bottles} bottle${bottles === 1 ? '' : 's'}`;
  el.innerHTML = `<div class="card" style="margin-bottom:18px">
    <div class="section-h"><h3>Refills due in ${y}</h3><div class="yearbar"><button class="icon-btn" id="yPrev">${ic('chevL', 18)}</button><b>${y}</b><button class="icon-btn" id="yNext">${ic('chevR', 18)}</button></div></div>
    <div class="months">${byM.map((v, i) => `<button class="mt ${i === m ? 'sel' : ''} ${v.n ? '' : 'zero'} ${y === t.getFullYear() && i === t.getMonth() ? 'now' : ''}" data-m="${i}"><div class="m">${MONTHS[i]}</div><div class="c">${v.n}</div><div class="b">${v.b} bottle${v.b === 1 ? '' : 's'}</div></button>`).join('')}</div>
  </div>
  <div class="card"><div class="section-h"><h3>${MONTHS_L[m]} ${y} — refill list</h3><span class="pill s-upcoming">${bottles} bottles</span></div>
    ${Object.keys(byType).length ? `<div style="padding:0 18px 12px;display:flex;gap:6px;flex-wrap:wrap">${Object.entries(byType).map(([k, v]) => `<span class="d-type">${esc(k)} × ${v}</span>`).join('')}</div>` : ''}
    <div class="list">${sel.length ? sel.map(e => rowHTML(e, { showDate: true })).join('') : emptyBox('No refills due in ' + MONTHS_L[m] + ' ' + y + '.', 'cal')}</div></div>`;
  bindRows(el);
  $$('[data-m]', el).forEach(b => b.addEventListener('click', () => { monthSel.m = +b.dataset.m; render(); }));
  $('#yPrev', el).addEventListener('click', () => { monthSel.y--; render(); });
  $('#yNext', el).addEventListener('click', () => { monthSel.y++; render(); });
}

/* ---------------- Layers ---------------- */
function openLayer(html, cls = '') {
  const wrap = document.createElement('div'); wrap.className = 'overlay ' + cls; wrap.innerHTML = html;
  $('#layer').appendChild(wrap); document.body.style.overflow = 'hidden';
  wrap.addEventListener('mousedown', e => { if (e.target === wrap) wrap._close && wrap._close(); });
  wrap._close = () => closeLayer(wrap);
  return wrap;
}
function closeLayer(w) { if (w && w.parentNode) w.parentNode.removeChild(w); if (!$('#layer').children.length) document.body.style.overflow = ''; }
function closeTop() { const l = $('#layer').lastElementChild; if (l) { (l._close || (() => closeLayer(l)))(); return true; } return false; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTop(); });

function confirmBox(title, msg, okTxt, danger) {
  return new Promise(res => {
    const w = openLayer(`<div class="sheet confirm"><div class="grab"></div><div class="sheet-h"><h2>${esc(title)}</h2></div><div class="sheet-b"><p>${esc(msg)}</p></div><div class="sheet-f"><button class="btn btn-ghost" style="flex:1" data-r="0">Cancel</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" style="flex:1" data-r="1">${esc(okTxt)}</button></div></div>`, 'center');
    w._close = () => { closeLayer(w); res(false); };
    $$('[data-r]', w).forEach(b => b.addEventListener('click', () => { closeLayer(w); res(b.dataset.r === '1'); }));
  });
}

function docKind(d) { const t = (d.contentType || '') + ' ' + (d.name || ''); if (/pdf/i.test(t)) return 'pdf'; if (/image|\.(png|jpe?g|webp|gif|heic)$/i.test(t)) return 'img'; return 'oth'; }
async function openDoc(d) {
  let url; try { url = await signedUrl(d.path); } catch (e) { toast('Couldn’t open — check internet'); return; }
  const k = docKind(d);
  const small = window.innerWidth < 760;
  if (k !== 'img' && (isNative || small)) {           // PDFs on phones: open in the phone's PDF viewer / browser
    const B = plug('Browser'); if (B) { try { await B.open({ url }); return; } catch (_) {} }
    openExternal(url); return;
  }
  const v = document.createElement('div'); v.className = 'viewer';
  v.innerHTML = `<div class="viewer-h"><button class="icon-btn" data-x>${ic('x', 22)}</button><b>${esc(d.name || 'Document')}</b><button class="btn" data-ext style="height:36px;font-size:13px;background:rgba(255,255,255,.12);color:#fff">${ic('ext', 15)}Open</button></div>
  <div class="viewer-b">${k === 'img' ? `<img src="${esc(url)}" alt="">` : k === 'pdf' ? `<iframe src="${esc(url)}" title="Document"></iframe>` : `<div style="color:#fff;text-align:center">${ic('file', 40)}<p style="margin-top:10px">Preview not available — tap Open.</p></div>`}</div>`;
  $('#layer').appendChild(v); document.body.style.overflow = 'hidden';
  v._close = () => closeLayer(v);
  $('[data-x]', v).addEventListener('click', v._close);
  $('[data-ext]', v).addEventListener('click', () => { const B = plug('Browser'); if (B) B.open({ url }); else openExternal(url); });
}

/* ---------------- Detail ---------------- */
function gcalLink(e, offsetDays, label) {
  const d = pd(e.dueDate); if (!d) return '';
  const s = new Date(d); s.setDate(s.getDate() + offsetDays); const en = new Date(s); en.setDate(en.getDate() + 1);
  const f = x => iso(x).replace(/-/g, '');
  const items = (e.items || []).map(i => `${itemLabel(i)} × ${i.qty}`).join(', ');
  const det = `Fire extinguisher refilling ${label}\nShop: ${e.shop || ''}\nPerson: ${e.person || ''}\nMobile: ${e.phone || ''}\nAddress: ${e.address || ''}\nItems: ${items}\nDue date: ${fmt(e.dueDate)}`;
  const p = new URLSearchParams({ action: 'TEMPLATE', text: (offsetDays < 0 ? '⏰ Refill in 7 days: ' : '🔥 Refill due: ') + (e.shop || ''), dates: f(s) + '/' + f(en), details: det, location: e.address || '' });
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}
function waLink(e) {
  const ph = phoneDigits(e.phone); if (!ph) return '';
  const msg = `Namaste ${e.person || ''},\n\nAapna ${e.shop || ''} na fire extinguisher nu refilling ${fmt(e.dueDate)} na roj due che. Refilling mate aapno convenient time janavsho.\n\n- ${BIZ} (Fire Safety)`;
  return 'https://wa.me/' + ph + '?text=' + encodeURIComponent(msg);
}
function openDetail(id) {
  const e = entries.find(x => x.id === id); if (!e) return;
  const q = qtyOf(e); const docs = Array.isArray(e.docs) ? e.docs : [];
  const wa = waLink(e); const tel = String(e.phone || '').replace(/[^\d+]/g, '');
  const d7 = pd(e.dueDate) ? fmt(iso(new Date(pd(e.dueDate).getTime() - 7 * 864e5))) : '';
  const w = openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>${esc(e.shop || 'Entry')}</h2><button class="icon-btn" data-x>${ic('x', 20)}</button></div>
   <div class="sheet-b">
     <div class="d-top">${pill(e)}<span class="d-type">${esc(e.type || '')}</span><span class="d-type">${q} bottle${q === 1 ? '' : 's'}</span>${e.payment ? `<span class="pill ${e.payment === 'Paid' ? 's-active' : 's-soon'}">${esc(e.payment)}${e.amount ? ' · ' + money(e.amount) : ''}</span>` : ''}</div>
     <div class="timeline"><div><div class="t">${e.type === 'New Installation' ? 'Supply date' : 'Refilling date'}</div><div class="v">${fmt(e.date)}</div></div>
       <div class="arrow">${ic('chevR', 18, 2.4)}<div>1 year</div></div>
       <div class="right"><div class="t">Refill due</div><div class="v" style="color:${['overdue','today'].includes(statusOf(e)) ? 'var(--red)' : 'inherit'}">${fmt(e.dueDate)}</div><div style="font-size:12px;font-weight:700;color:var(--ink3)">${esc(dueText(e))}</div></div></div>
     <div class="actions">
       <button class="act ${tel ? '' : 'dis'}" data-call><i style="background:#E7F6EE;color:#067647">${ic('phone', 17)}</i>Call</button>
       <button class="act ${wa ? '' : 'dis'}" data-wa><i style="background:#E7F6EE;color:#067647">${ic('wa', 17)}</i>WhatsApp</button>
       <button class="act" data-cal><i style="background:#EAF2FF;color:#175CD3">${ic('bell', 17)}</i>Calendar</button>
       <button class="act" data-edit><i style="background:var(--line2);color:var(--ink)">${ic('edit', 17)}</i>Edit</button>
     </div>
     <div class="hidden" id="calBox" style="margin:-8px 0 18px;padding:12px;border:1px solid var(--line);border-radius:12px;background:#FAFBFC">
       <div style="font-size:13px;font-weight:700;color:var(--ink2);margin-bottom:8px">${isNative ? 'Phone reminders are automatic in this app. Also add to Google Calendar:' : 'Add to Google Calendar — you’ll get a phone notification:'}</div>
       <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm btn-ghost" data-g="-7">${ic('clock', 15)}7 days before · ${d7}</button>
       <button class="btn btn-sm btn-ghost" data-g="0">${ic('cal', 15)}On due date</button></div>
     </div>
     <div class="kv">
       <div><div class="k">Contact person</div><div class="v">${esc(e.person || '—')}</div></div>
       <div><div class="k">Mobile</div><div class="v">${esc(e.phone || '—')}</div></div>
       <div class="full"><div class="k">Address</div><div class="v">${esc(e.address || '—')}${e.area ? ` <span class="d-type">${esc(e.area)}</span>` : ''}</div></div>
       ${e.billNo || e.amount ? `<div><div class="k">Bill no.</div><div class="v">${esc(e.billNo || '—')}</div></div><div><div class="k">Amount</div><div class="v">${e.amount ? money(e.amount) : '—'}</div></div>` : ''}
     </div>
     ${(e.items || []).length ? `<div class="blk-h">Extinguishers</div><table class="it"><thead><tr><th>Type</th><th>Capacity</th><th>Qty</th></tr></thead><tbody>${e.items.map(i => `<tr><td>${esc(i.type || '')}</td><td>${i.capacity ? esc(i.capacity) + ' Kg' : '—'}</td><td>${esc(i.qty || 0)}</td></tr>`).join('')}</tbody></table>` : ''}
     <div class="blk-h">Documents (${docs.length})</div>
     ${docs.length ? `<div class="docs">${docs.map((d, i) => { const k = docKind(d); return `<button class="doc" data-doc="${i}"><div class="th" data-th="${i}">${k === 'img' ? '' : `<span class="fi ${k}" style="width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:12px">${k === 'pdf' ? 'PDF' : 'FILE'}</span>`}</div><div class="dn"><small>${esc(d.kind || 'Document')}</small><b>${esc(d.name || 'file')}</b></div></button>`; }).join('')}</div>` : `<div class="empty" style="padding:14px;border:1px dashed var(--line);border-radius:12px;margin-bottom:18px">No documents. Use Edit to add certificate / bill.</div>`}
     ${e.notes ? `<div class="blk-h">Notes</div><div class="note">${esc(e.notes)}</div>` : ''}
   </div>
   <div class="sheet-f">
     <button class="btn btn-danger" data-del title="Delete">${ic('trash', 17)}</button>
     ${e.status === 'renewed' ? `<button class="btn btn-ghost" style="flex:1" data-reopen>${ic('refresh', 17)}Mark as not refilled</button>` : `<button class="btn btn-primary" style="flex:1" data-renew>${ic('refresh', 17)}Mark refilled · start next year</button>`}
   </div></div>`);
  $('[data-x]', w).addEventListener('click', w._close);
  $('[data-call]', w).addEventListener('click', () => tel && openExternal('tel:' + tel));
  $('[data-wa]', w).addEventListener('click', () => wa && openExternal(wa));
  $('[data-cal]', w).addEventListener('click', () => $('#calBox', w).classList.toggle('hidden'));
  $$('[data-g]', w).forEach(b => b.addEventListener('click', () => openExternal(gcalLink(e, +b.dataset.g, b.dataset.g === '0' ? '(due today)' : '(7 day reminder)'))));
  $('[data-edit]', w).addEventListener('click', () => { closeLayer(w); openForm(e); });
  $$('[data-doc]', w).forEach(b => b.addEventListener('click', () => openDoc(docs[+b.dataset.doc])));
  docs.forEach(async (d, i) => { if (docKind(d) !== 'img') return; try { const u = await signedUrl(d.path); const th = $(`[data-th="${i}"]`, w); if (th) th.innerHTML = `<img src="${esc(u)}" alt="" loading="lazy">`; } catch (_) {} });
  const rn = $('[data-renew]', w); if (rn) rn.addEventListener('click', () => { closeLayer(w); openForm(null, e); });
  const ro = $('[data-reopen]', w); if (ro) ro.addEventListener('click', async () => { try { await dbPatch(e.id, { status: 'active', updatedAt: new Date().toISOString() }); toast('Marked as not refilled'); closeLayer(w); fetchAll(); } catch (err) { writeErr(err); } });
  $('[data-del]', w).addEventListener('click', async () => {
    if (!await confirmBox('Delete this entry?', `“${e.shop}” and its ${docs.length} document${docs.length === 1 ? '' : 's'} will be deleted permanently. This can’t be undone.`, 'Delete', true)) return;
    try { await dbDelete(e.id); closeLayer(w); toast('Entry deleted'); await removeDocs(docs.map(d => d.path).filter(Boolean)); fetchAll(); } catch (err) { writeErr(err); }
  });
}

/* ---------------- Form ---------------- */
function openForm(e, renewFrom) {
  const isEdit = !!e; const src = e || renewFrom || {};
  const t = iso(today());
  const f = {
    type: isEdit ? (e.type || 'Refilling') : (renewFrom ? 'Refilling' : 'New Installation'),
    shop: src.shop || '', person: src.person || '', phone: src.phone || '', address: src.address || '', area: src.area || '',
    date: isEdit ? (e.date || t) : t, dueDate: isEdit ? (e.dueDate || addYearMinusDay(e.date || t)) : addYearMinusDay(t), dueManual: isEdit,
    items: (src.items && src.items.length ? src.items : [{ type: 'ABC Type', capacity: '6', qty: 1 }]).map(i => ({ ...i })),
    billNo: isEdit ? (e.billNo || '') : '', amount: isEdit ? (e.amount || '') : '', payment: isEdit ? (e.payment || 'Paid') : 'Paid', notes: isEdit ? (e.notes || '') : '',
    docs: isEdit ? (e.docs || []).map(d => ({ ...d })) : []
  };
  const newUploads = []; let uploading = 0;
  const title = isEdit ? 'Edit entry' : renewFrom ? 'Refilled · new entry' : 'New entry';
  const w = openLayer(`<div class="sheet"><div class="grab"></div>
    <div class="sheet-h"><h2>${title}</h2><button class="icon-btn" data-x>${ic('x', 20)}</button></div>
    <form class="sheet-b" id="fm" novalidate>
      ${renewFrom ? `<div class="alert" style="margin-bottom:16px"><div class="ic">${ic('refresh', 18)}</div><div><b>Next cycle for ${esc(renewFrom.shop)}</b><p>Old entry will be marked “Refilled”. Upload the new certificate below.</p></div></div>` : ''}
      <div class="fgrid">
        <div class="f full"><label>Service type</label><div class="seg" id="segType"><button type="button" data-v="New Installation">New sale / Installation</button><button type="button" data-v="Refilling">Refilling</button></div></div>
        <div class="f full" id="fShop"><label>Shop / Firm name <em>*</em></label><input name="shop" placeholder="e.g. Pinki Xerox" autocomplete="off"></div>
        <div class="f"><label>Contact person</label><input name="person" placeholder="Name" autocomplete="off"></div>
        <div class="f"><label>Mobile number</label><input name="phone" type="tel" inputmode="tel" placeholder="98XXXXXXXX" autocomplete="off"></div>
        <div class="f full"><label>Address</label><textarea name="address" rows="2" placeholder="Shop no., complex, road, city"></textarea></div>
        <div class="f"><label>Area</label><input name="area" placeholder="e.g. Satellite, Bopal" list="areas" autocomplete="off"><datalist id="areas">${[...new Set(entries.map(x => x.area).filter(Boolean))].map(a => `<option value="${esc(a)}">`).join('')}</datalist></div>
        <div class="f"></div>
        <div class="f" id="fDate"><label>Sale / Refill date <em>*</em></label><input name="date" type="date"></div>
        <div class="f"><label>Refill due date</label><input name="dueDate" type="date"><span class="help" id="dueHelp">Auto: 1 year from service date</span></div>
        <div class="fs-title">Extinguishers</div>
        <div class="f full"><div class="ihead"><span>Type</span><span>Kg</span><span>Qty</span><span></span></div><div class="items" id="items"></div>
          <button type="button" class="btn btn-sm btn-soft" id="addItem" style="align-self:flex-start;margin-top:4px">${ic('plus', 15)}Add another type</button></div>
        <div class="fs-title">Bill & documents</div>
        <div class="f"><label>Bill / Invoice no.</label><input name="billNo" autocomplete="off"></div>
        <div class="f"><label>Amount (₹)</label><input name="amount" type="number" inputmode="decimal" min="0" placeholder="0"></div>
        <div class="f full"><label>Payment</label><div class="seg" id="segPay"><button type="button" data-v="Paid">Paid</button><button type="button" data-v="Pending">Pending</button></div></div>
        <div class="f full">
          <label class="drop" id="drop">${ic('upload', 22)}<div style="margin-top:4px">Upload certificate, bill, photos</div><small>PDF or image · tap to choose or take a photo</small><input type="file" id="fileIn" multiple accept="application/pdf,image/*" hidden></label>
          <div class="files" id="files"></div>
        </div>
        <div class="f full"><label>Notes</label><textarea name="notes" rows="2" placeholder="Anything to remember…"></textarea></div>
      </div>
    </form>
    <div class="sheet-f"><button class="btn btn-ghost" data-cancel style="flex:1">Cancel</button><button class="btn btn-primary" data-save style="flex:2">${ic('check', 18, 2.4)}${isEdit ? 'Save changes' : 'Save entry'}</button></div>
  </div>`);
  const fm = $('#fm', w);
  const FIELDS = ['shop','person','phone','address','area','date','dueDate','billNo','amount','notes'];
  FIELDS.forEach(k => { if (fm.elements[k]) fm.elements[k].value = f[k] == null ? '' : f[k]; });
  function seg(id, key) { const s = $(id, w); const upd = () => $$('button', s).forEach(b => b.classList.toggle('on', b.dataset.v === f[key])); $$('button', s).forEach(b => b.addEventListener('click', () => { f[key] = b.dataset.v; upd(); })); upd(); }
  seg('#segType', 'type'); seg('#segPay', 'payment');
  fm.elements.date.addEventListener('change', () => { f.date = fm.elements.date.value; if (!f.dueManual) { f.dueDate = addYearMinusDay(f.date); fm.elements.dueDate.value = f.dueDate; } });
  fm.elements.dueDate.addEventListener('change', () => { f.dueDate = fm.elements.dueDate.value; f.dueManual = true; $('#dueHelp', w).textContent = 'Set manually'; });
  if (isEdit) $('#dueHelp', w).textContent = 'Change if needed';

  function renderItems() {
    const box = $('#items', w);
    box.innerHTML = f.items.map((it, i) => `<div class="item-row" data-i="${i}">
      <select data-k="type">${EXT_TYPES.concat(EXT_TYPES.includes(it.type) || !it.type ? [] : [it.type]).map(o => `<option ${o === it.type ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>
      <input data-k="capacity" type="number" inputmode="decimal" min="0" step="0.5" value="${esc(it.capacity || '')}" placeholder="Kg">
      <input data-k="qty" type="number" inputmode="numeric" min="1" value="${esc(it.qty || 1)}">
      <button type="button" class="icon-btn" data-rm ${f.items.length < 2 ? 'disabled style="opacity:.3"' : ''}>${ic('trash', 16)}</button></div>`).join('');
    $$('.item-row', box).forEach(r => { const i = +r.dataset.i;
      $$('[data-k]', r).forEach(inp => inp.addEventListener('input', () => { f.items[i][inp.dataset.k] = inp.dataset.k === 'qty' ? Math.max(0, parseInt(inp.value) || 0) : inp.value; }));
      $('[data-rm]', r).addEventListener('click', () => { if (f.items.length > 1) { f.items.splice(i, 1); renderItems(); } }); });
  }
  renderItems();
  $('#addItem', w).addEventListener('click', () => { f.items.push({ type: 'ABC Type', capacity: '', qty: 1 }); renderItems(); });

  function renderFiles() {
    $('#files', w).innerHTML = f.docs.map((d, i) => { const k = docKind(d); return `<div class="file"><span class="fi ${k}">${k === 'pdf' ? 'PDF' : k === 'img' ? 'IMG' : 'FILE'}</span><span class="fn">${esc(d.name || 'file')}</span>
      ${d.pending ? `<span class="prog">Uploading…</span>` : `<select data-kind="${i}">${['Certificate','Bill','Photo','Other'].map(o => `<option ${o === d.kind ? 'selected' : ''}>${o}</option>`).join('')}</select><button type="button" class="icon-btn" data-rmf="${i}" style="width:32px;height:32px">${ic('x', 16)}</button>`}</div>`; }).join('');
    $$('[data-kind]', w).forEach(s => s.addEventListener('change', () => { f.docs[+s.dataset.kind].kind = s.value; }));
    $$('[data-rmf]', w).forEach(b => b.addEventListener('click', () => { f.docs.splice(+b.dataset.rmf, 1); renderFiles(); }));
  }
  renderFiles();
  async function addFiles(list) {
    for (const file of Array.from(list)) {
      if (file.size > 25 * 1024 * 1024) { toast(file.name + ' is over 25 MB'); continue; }
      const kind = /bill|invoice/i.test(file.name) ? 'Bill' : /^image\//.test(file.type) ? 'Photo' : 'Certificate';
      const d = { name: file.name || 'photo.jpg', contentType: file.type, kind, pending: true }; f.docs.push(d); renderFiles(); uploading++;
      try { const r = await uploadDoc(file); Object.assign(d, r); delete d.pending; newUploads.push(r.path); }
      catch (err) { f.docs.splice(f.docs.indexOf(d), 1); toast('Upload failed: ' + (file.name || 'file')); }
      uploading--; renderFiles();
    }
  }
  const fi = $('#fileIn', w), dr = $('#drop', w);
  fi.addEventListener('change', () => { addFiles(fi.files); fi.value = ''; });
  dr.addEventListener('dragover', ev => { ev.preventDefault(); dr.classList.add('over'); });
  dr.addEventListener('dragleave', () => dr.classList.remove('over'));
  dr.addEventListener('drop', ev => { ev.preventDefault(); dr.classList.remove('over'); addFiles(ev.dataTransfer.files); });

  const cancel = async () => { closeLayer(w); const kept = new Set(f.docs.map(d => d.path)); await removeDocs(newUploads.filter(p => !kept.has(p))); };
  w._close = cancel;
  $('[data-x]', w).addEventListener('click', cancel); $('[data-cancel]', w).addEventListener('click', cancel);
  fm.addEventListener('submit', ev => ev.preventDefault());
  $('[data-save]', w).addEventListener('click', async () => {
    FIELDS.forEach(k => f[k] = fm.elements[k].value.trim());
    $('#fShop', w).classList.toggle('err', !f.shop); $('#fDate', w).classList.toggle('err', !pd(f.date));
    if (!f.shop || !pd(f.date)) { toast('Please fill shop name and date'); return; }
    if (uploading) { toast('Wait — files still uploading'); return; }
    if (!pd(f.dueDate)) f.dueDate = addYearMinusDay(f.date);
    const now = new Date().toISOString();
    const body = { type: f.type, shop: f.shop, person: f.person, phone: f.phone, address: f.address, area: f.area, date: f.date, dueDate: f.dueDate,
      items: f.items.filter(i => i.type).map(i => ({ type: i.type, capacity: String(i.capacity || ''), qty: +i.qty || 0 })),
      billNo: f.billNo, amount: f.amount ? +f.amount : 0, payment: f.payment, notes: f.notes,
      docs: f.docs.filter(d => d.path).map(d => ({ path: d.path, name: d.name, kind: d.kind, contentType: d.contentType || '', size: d.size || 0 })),
      status: isEdit ? (e.status || 'active') : 'active', updatedAt: now, createdAt: isEdit ? (e.createdAt || now) : now };
    if (isEdit) ['renewedFrom','renewedBy','seedId'].forEach(k => { if (e[k]) body[k] = e[k]; });
    const btn = $('[data-save]', w); btn.disabled = true; btn.style.opacity = .7;
    try {
      if (isEdit) {
        await dbUpdate(e.id, body);
        const kept = new Set(body.docs.map(d => d.path));
        await removeDocs((e.docs || []).map(d => d.path).filter(p => p && !kept.has(p)));
      } else {
        if (renewFrom) body.renewedFrom = renewFrom.id;
        const newId = await dbInsert(body);
        if (renewFrom) await dbPatch(renewFrom.id, { status: 'renewed', renewedBy: newId, updatedAt: now });
      }
      closeLayer(w);
      toast(isEdit ? 'Changes saved' : renewFrom ? 'Refill saved · next due ' + fmt(body.dueDate) : 'Entry saved · due ' + fmt(body.dueDate));
      fetchAll();
    } catch (err) { btn.disabled = false; btn.style.opacity = 1; writeErr(err); }
  });
}

/* ---------------- Settings ---------------- */
function openSettings() {
  const LN = plug('LocalNotifications');
  const w = openLayer(`<div class="sheet"><div class="grab"></div>
   <div class="sheet-h"><h2>Settings & backup</h2><button class="icon-btn" data-x>${ic('x', 20)}</button></div>
   <div class="sheet-b">
     <div class="set-row"><div class="sic">${ic('lock', 18)}</div><div class="t"><b>Signed in</b><small>${esc(user && user.email || '')}</small></div><button class="btn btn-sm btn-ghost" data-logout>${ic('logout', 15)}Sign out</button></div>
     ${isNative ? `<div class="set-row"><div class="sic" style="background:var(--brand-l);color:var(--brand)">${ic('bell', 18)}</div><div class="t"><b>Phone reminders</b><small id="nStat">Checking…</small></div><button class="btn btn-sm btn-ghost" data-ntest>Test</button></div>`
       : `<div class="set-row"><div class="sic" style="background:var(--brand-l);color:var(--brand)">${ic('bell', 18)}</div><div class="t"><b>Reminders</b><small>Automatic phone reminders work in the Android app. On iPhone / PC, open an entry → Calendar to add Google Calendar reminders.</small></div></div>`}
     ${!isNative ? `<div class="set-row"><div class="sic">${ic('android', 18)}</div><div class="t"><b>Android app (APK)</b><small>Install on Android for automatic reminders</small></div><a class="btn btn-sm btn-primary" href="app/arav-fire-tracker.apk" download>${ic('down', 15)}Download</a></div>` : ''}
     ${!isNative && isIOS && !isStandalone ? `<div class="set-row"><div class="sic">${ic('upload', 18)}</div><div class="t"><b>Install on iPhone</b><small>Safari → Share ⬆ → “Add to Home Screen”</small></div></div>` : ''}
     <div class="set-row"><div class="sic">${ic('down', 18)}</div><div class="t"><b>Backup to Excel (CSV)</b><small>All entries in one sheet</small></div><button class="btn btn-sm btn-ghost" data-csv>Export</button></div>
     <div class="set-row"><div class="sic">${ic('file', 18)}</div><div class="t"><b>Full backup (JSON)</b><small>Every field, for safe keeping</small></div><button class="btn btn-sm btn-ghost" data-json>Export</button></div>
     <div class="set-row"><div class="sic">${ic('refresh', 18)}</div><div class="t"><b>Sync now</b><small id="syncInfo">${offline ? 'Offline — showing saved copy' : 'Connected'} · ${entries.length} entries</small></div><button class="btn btn-sm btn-ghost" data-sync>Refresh</button></div>
   </div></div>`);
  $('[data-x]', w).addEventListener('click', w._close);
  $('[data-logout]', w).addEventListener('click', async () => { if (!await confirmBox('Sign out?', 'You’ll need your email and password to sign in again on this device. Your data stays safe online.', 'Sign out')) return; closeLayer(w); try { await sb.auth.signOut(); } catch (_) { renderLogin(); } });
  $('[data-csv]', w).addEventListener('click', exportCSV);
  $('[data-json]', w).addEventListener('click', exportJSON);
  $('[data-sync]', w).addEventListener('click', async () => { await fetchAll(); toast(offline ? 'Still offline' : 'Synced'); const s = $('#syncInfo', w); if (s) s.textContent = (offline ? 'Offline' : 'Connected') + ' · ' + entries.length + ' entries'; });
  if (isNative && LN) {
    const st = $('#nStat', w);
    LN.checkPermissions().then(p => { st.textContent = p.display === 'granted' ? `On · 7 days before and on due date at ${REMIND_H}:00` : 'Off — tap Test to allow notifications'; }).catch(() => { st.textContent = 'Not available'; });
    $('[data-ntest]', w).addEventListener('click', async () => {
      try {
        let p = await LN.checkPermissions(); if (p.display !== 'granted') p = await LN.requestPermissions();
        if (p.display !== 'granted') { toast('Allow notifications in phone Settings → Apps → Fire Tracker'); return; }
        await LN.schedule({ notifications: [{ id: 99999, title: '🔥 Fire Tracker', body: 'Reminders are working. You’ll be notified 7 days before and on each refill due date.', schedule: { at: new Date(Date.now() + 4000), allowWhileIdle: true }, smallIcon: 'ic_stat_fire', iconColor: '#E23D28' }] });
        st.textContent = `On · 7 days before and on due date at ${REMIND_H}:00`; toast('Test notification in 4 seconds…'); scheduleReminders();
      } catch (e) { toast('Couldn’t set notification'); }
    });
  }
}

function csvText() {
  const cols = ['Shop','Contact person','Mobile','Area','Address','Service type','Service date','Refill due date','Status','Extinguishers','Total bottles','Bill no','Amount','Payment','Notes','Documents'];
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const rows = [...entries].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')).map(e => [e.shop, e.person, e.phone, e.area, e.address, e.type, e.date, e.dueDate, STATUS[statusOf(e)][0], (e.items || []).map(i => itemLabel(i) + ' x' + i.qty).join('; '), qtyOf(e), e.billNo, e.amount, e.payment, e.notes, (e.docs || []).map(d => d.name).join('; ')].map(q).join(','));
  return '﻿' + cols.map(q).join(',') + '\n' + rows.join('\n');
}
async function saveFile(name, text, mime) {
  if (isNative) {
    const FS = plug('Filesystem'), SH = plug('Share');
    if (!FS || !SH) { toast('Export not available'); return; }
    try {
      const r = await FS.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      await SH.share({ title: name, url: r.uri, dialogTitle: 'Save or send backup' });
    } catch (e) { if (!/cancel/i.test(String(e && e.message))) toast('Couldn’t export'); }
    return;
  }
  const blob = new Blob([text], { type: mime });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('Backup downloaded');
}
function exportCSV() { if (!entries.length) { toast('No entries to export'); return; } saveFile('fire-refill-backup-' + iso(today()) + '.csv', csvText(), 'text/csv'); }
function exportJSON() { if (!entries.length) { toast('No entries to export'); return; } saveFile('fire-refill-backup-' + iso(today()) + '.json', JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 1), 'application/json'); }

async function importSeed() {
  if (offline) { toast('Connect to internet first'); return; }
  let seed;
  try { seed = await (await fetch('seed/seed.json', { cache: 'no-store' })).json(); } catch (_) { toast('Starter data not found'); return; }
  const have = new Set(entries.map(e => e.seedId).filter(Boolean));
  const todo = seed.filter(s => !have.has(s.seedId));
  if (!todo.length) { toast('All 5 certificates are already imported'); return; }
  if (!await confirmBox('Import certificates?', `${todo.length} entr${todo.length === 1 ? 'y' : 'ies'} with their PDF certificate will be added.`, 'Import')) return;
  let ok = 0; toast('Importing…');
  for (const s of todo) {
    try {
      const blob = await (await fetch('seed/' + s.file)).blob();
      const file = new File([blob], s.file, { type: 'application/pdf' });
      const nice = 'Certificate - ' + s.data.shop.replace(/[^\w &'-]/g, '').trim() + '.pdf';
      const doc = await uploadDoc(file, nice);
      const now = new Date().toISOString();
      await dbInsert({ ...s.data, seedId: s.seedId, docs: [{ ...doc, kind: 'Certificate' }], createdAt: now, updatedAt: now });
      ok++;
    } catch (e) { console.warn(e); }
  }
  toast(ok ? `Imported ${ok} certificate${ok === 1 ? '' : 's'}` : 'Import failed — check setup.sql was run');
  fetchAll();
}

/* ---------------- Android: reminders, back button ---------------- */
let schedBusy = false, lastSchedSig = '';
async function scheduleReminders() {
  const LN = plug('LocalNotifications'); if (!LN || !loaded || offline || schedBusy) return;
  schedBusy = true;
  try {
    const p = await LN.checkPermissions(); if (p.display !== 'granted') return;
    const now = Date.now(); const list = [];
    active().forEach(e => {
      const d = pd(e.dueDate); if (!d) return; const q = qtyOf(e);
      const who = [e.person, e.phone].filter(Boolean).join(' · ');
      const at7 = new Date(d); at7.setDate(at7.getDate() - 7); at7.setHours(REMIND_H, 0, 0, 0);
      const at0 = new Date(d); at0.setHours(REMIND_H, 0, 0, 0);
      if (at7.getTime() > now) list.push({ at: at7, title: '⏰ Refill in 7 days — ' + (e.shop || ''), body: `Due ${fmt(e.dueDate)} · ${q} bottle${q === 1 ? '' : 's'}${who ? ' · ' + who : ''}`, id: e.id });
      if (at0.getTime() > now) list.push({ at: at0, title: '🔥 Refill due today — ' + (e.shop || ''), body: `1 year completed · ${q} bottle${q === 1 ? '' : 's'}${who ? ' · ' + who : ''}`, id: e.id });
    });
    list.sort((a, b) => a.at - b.at);
    const top = list.slice(0, 60);
    const sig = top.map(n => n.at.getTime() + n.title + n.body).join('|');
    if (sig === lastSchedSig) return;
    const pend = await LN.getPending();
    const old = (pend.notifications || []).filter(n => n.id !== 99999);
    if (old.length) await LN.cancel({ notifications: old.map(n => ({ id: n.id })) });
    if (top.length) await LN.schedule({ notifications: top.map((n, i) => ({ id: i + 1, title: n.title, body: n.body, schedule: { at: n.at, allowWhileIdle: true }, smallIcon: 'ic_stat_fire', iconColor: '#E23D28', extra: { entryId: n.id } })) });
    lastSchedSig = sig;
  } catch (e) { console.warn('reminders', e); }
  finally { schedBusy = false; }
}

async function setupNative() {
  const LN = plug('LocalNotifications'), App = plug('App');
  if (LN) {
    try {
      let p = await LN.checkPermissions();
      if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await LN.requestPermissions();
      try { await LN.createChannel({ id: 'default', name: 'Refill reminders', importance: 4, visibility: 1, vibration: true }); } catch (_) {}
      LN.addListener('localNotificationActionPerformed', a => { const id = a && a.notification && a.notification.extra && a.notification.extra.entryId; if (id) { go('dashboard'); setTimeout(() => openDetail(id), 300); } });
      scheduleReminders();
    } catch (_) {}
  }
  if (App) {
    App.addListener('backButton', () => { if (closeTop()) return; if (view !== 'dashboard') { go('dashboard'); return; } App.minimizeApp ? App.minimizeApp() : App.exitApp(); });
    App.addListener('resume', () => fetchAll());
  }
}

boot();
})();
