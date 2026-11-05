/* Trotuar Liber – strat de compatibilitate pentru rularea în afara Claude (GitHub Pages + Supabase).
 * Imită window.claude.use("db" | "user" | "sample" | "assets" | "downloads").
 * În Claude nu face nimic (window.claude există deja).
 *
 * Securitate:
 *  - login email + parolă (Supabase Auth); înscriere liberă, dar contul nou rămâne „în așteptare”
 *    până îl aprobă un administrator (tabelul tl_members); fără aprobare nu poate analiza, salva sau urca poze;
 *  - toate cererile poartă tokenul utilizatorului; RLS lasă fiecare utilizator doar pe rândurile/pozele lui;
 *  - pozele stau într-un bucket privat, afișate prin linkuri semnate valabile 1 oră;
 *  - cheia Anthropic NU ajunge niciodată în browser: analiza trece prin funcția Supabase „analiza”.
 */
(function () {
  "use strict";
  if (window.claude) return;
  const CFG = Object.assign({ supabaseUrl: "", supabaseAnonKey: "", functionName: "analiza", bucket: "tl-foto", table: "tl_sesizari" }, window.TL_CONFIG || {});
  const LS_CFG = "tl-cfg", LS_SES = "tl-session";
  const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }, del(k) { try { localStorage.removeItem(k); } catch {} } };
  const saved = ls.get(LS_CFG) || {};
  if (!CFG.supabaseUrl) CFG.supabaseUrl = saved.supabaseUrl || "";
  if (!CFG.supabaseAnonKey) CFG.supabaseAnonKey = saved.supabaseAnonKey || "";
  CFG.supabaseUrl = CFG.supabaseUrl.replace(/\/+$/, "");

  /* ---------- sesiune ---------- */
  let session = ls.get(LS_SES);
  let readyResolve; const ready = new Promise(r => (readyResolve = r));
  const H = (extra) => Object.assign({ apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + (session ? session.access_token : CFG.supabaseAnonKey) }, extra || {});

  async function authPost(path, body) {
    const r = await fetch(CFG.supabaseUrl + "/auth/v1/" + path, { method: "POST", headers: { apikey: CFG.supabaseAnonKey, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error_description || j.msg || j.message || ("Eroare " + r.status));
    return j;
  }
  function keep(j) { session = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: { id: j.user.id, email: j.user.email, meta: j.user.user_metadata || {} } }; ls.set(LS_SES, session); }
  let refreshing = null;
  async function fresh() {
    if (!session) throw new Error("neautentificat");
    if (session.expires_at - 60 > Date.now() / 1000) return;
    if (!refreshing) refreshing = authPost("token?grant_type=refresh_token", { refresh_token: session.refresh_token }).then(keep).catch(e => { logout(); throw e; }).finally(() => (refreshing = null));
    return refreshing;
  }
  async function api(url, opts = {}) {
    await fresh();
    const r = await fetch(url, Object.assign({}, opts, { headers: H(opts.headers) }));
    if (r.status === 401) { logout(); throw { code: "revoked", message: "Sesiune expirată" }; }
    return r;
  }
  function logout() {
    if (session) fetch(CFG.supabaseUrl + "/auth/v1/logout", { method: "POST", headers: H() }).catch(() => {});
    session = null; ls.del(LS_SES); location.reload();
  }

  /* ---------- ecran de login / configurare ---------- */
  const css = `.tl-gate{position:fixed;inset:0;z-index:50;background:var(--bg,#f3f2ee);display:grid;place-items:center;padding:16px}
  .tl-gate form{width:min(420px,100%);background:var(--surface,#fff);border:1px solid var(--line,#ddd);border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:12px}
  .tl-gate h2{margin:0;font-family:var(--f-display,sans-serif);text-transform:uppercase;letter-spacing:.03em}
  .tl-gate .err{color:var(--bad,#c0392b);font-size:.9rem;min-height:1.2em;margin:0}
  .tl-out{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:6;font:500 .8rem var(--f-mono,monospace);background:var(--surface,#fff);color:var(--muted,#555);border:1px solid var(--line,#ddd);border-radius:999px;padding:6px 12px;cursor:pointer}`;
  const APP_URL = () => location.origin + location.pathname;
  function gate(msg) {
    if (!document.getElementById("tl-css")) { const st = document.createElement("style"); st.id = "tl-css"; st.textContent = css; document.head.appendChild(st); }
    const old = document.querySelector(".tl-gate"); if (old) old.remove();
    const needCfg = !CFG.supabaseUrl || !CFG.supabaseAnonKey;
    const d = document.createElement("div"); d.className = "tl-gate"; document.body.appendChild(d);
    let mode = "login";
    const cfgFields = needCfg ? `<div><label class="lbl" for="tlU">URL proiect Supabase</label><input type="text" id="tlU" placeholder="https://xxxx.supabase.co" required></div>
      <div><label class="lbl" for="tlK">Cheie publică (anon / publishable)</label><input type="text" id="tlK" required></div>` : "";
    const draw = (note) => {
      const T = { login: "Autentificare", signup: "Cont nou", forgot: "Resetare parolă" }[mode];
      d.innerHTML = `<form autocomplete="on" novalidate>
        <h2>Trotuar Liber</h2>
        <p class="hint" style="margin:0"><b>${T}</b>${needCfg ? " · prima pornire: adresa și cheia publică a proiectului Supabase" : ""}</p>
        ${note ? `<p class="note" style="margin:0">${note}</p>` : ""}
        ${cfgFields}
        ${mode === "signup" ? `<div><label class="lbl" for="tlN">Nume și prenume</label><input type="text" id="tlN" autocomplete="name" required></div>` : ""}
        <div><label class="lbl" for="tlE">E-mail</label><input type="email" id="tlE" autocomplete="username" required></div>
        ${mode !== "forgot" ? `<div><label class="lbl" for="tlP">${mode === "signup" ? "Alege o parolă (minim 10 caractere)" : "Parolă"}</label><input type="password" id="tlP" autocomplete="${mode === "signup" ? "new-password" : "current-password"}" required></div>` : ""}
        ${mode === "signup" ? `<div><label class="lbl" for="tlP2">Repetă parola</label><input type="password" id="tlP2" autocomplete="new-password" required></div>` : ""}
        <p class="err" id="tlErr"></p>
        <button class="btn primary" type="submit">${{ login: "Intră", signup: "Creează contul", forgot: "Trimite linkul de resetare" }[mode]}</button>
        <div class="row" style="justify-content:space-between">
          ${mode !== "login" ? `<button class="btn small" type="button" data-m="login">Am deja cont</button>` : `<button class="btn small" type="button" data-m="signup">Creează cont nou</button><button class="btn small" type="button" data-m="forgot">Ai uitat parola?</button>`}
        </div>
        ${!needCfg && !(window.TL_CONFIG && window.TL_CONFIG.supabaseUrl) ? `<button class="btn small" type="button" id="tlReset">Schimbă proiectul Supabase</button>` : ""}
      </form>`;
      d.querySelectorAll("[data-m]").forEach(x => x.onclick = () => { mode = x.dataset.m; draw(); });
      const rs = d.querySelector("#tlReset"); if (rs) rs.onclick = () => { ls.del(LS_CFG); location.reload(); };
      const f = d.querySelector("form"), err = d.querySelector("#tlErr"), val = id => (d.querySelector(id) || {}).value || "";
      f.addEventListener("submit", async e => {
        e.preventDefault(); err.textContent = "";
        if (needCfg) {
          const u = val("#tlU").trim().replace(/\/+$/, ""), k = val("#tlK").trim();
          if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(u)) { err.textContent = "Adresa trebuie să fie de forma https://xxxx.supabase.co"; return; }
          CFG.supabaseUrl = u; CFG.supabaseAnonKey = k; ls.set(LS_CFG, { supabaseUrl: u, supabaseAnonKey: k });
        }
        const email = val("#tlE").trim(), pw = val("#tlP");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = "Scrie o adresă de e-mail validă."; return; }
        const btn = f.querySelector("button[type=submit]"); btn.disabled = true;
        try {
          if (mode === "login") { keep(await authPost("token?grant_type=password", { email, password: pw })); d.remove(); start(); return; }
          if (mode === "signup") {
            const nume = val("#tlN").trim();
            if (nume.split(/\s+/).filter(Boolean).length < 2) throw new Error("§Scrie numele și prenumele.");
            if (pw.length < 10) throw new Error("§Parola trebuie să aibă minim 10 caractere.");
            if (pw !== val("#tlP2")) throw new Error("§Cele două parole nu coincid.");
            const j = await authPost("signup?redirect_to=" + encodeURIComponent(APP_URL()), { email, password: pw, data: { full_name: nume } });
            if (j.access_token) { keep(j); d.remove(); start(); return; }
            mode = "login"; draw(`Contul a fost creat. <b>Deschide e-mailul de confirmare</b> trimis la ${esc(email)} și apasă linkul, apoi intră aici. După confirmare, contul așteaptă aprobarea administratorului.`); return;
          }
          if (mode === "forgot") {
            await authPost("recover?redirect_to=" + encodeURIComponent(APP_URL()), { email });
            mode = "login"; draw(`Dacă ${esc(email)} are cont, primești un e-mail cu linkul de resetare. Linkul te aduce înapoi aici, unde îți alegi parola nouă.`); return;
          }
        } catch (x) {
          const m = String(x.message || "");
          err.textContent = m.startsWith("§") ? m.slice(1)
            : /invalid login|invalid_grant|invalid credentials/i.test(m) ? "E-mail sau parolă greșită."
            : /not confirmed/i.test(m) ? "E-mailul nu e confirmat încă. Deschide linkul din e-mailul de confirmare."
            : /already registered|already exists/i.test(m) ? "Există deja un cont cu acest e-mail. Folosește „Ai uitat parola?” dacă nu o mai știi."
            : /signups? not allowed|disabled/i.test(m) ? "Înscrierile sunt închise. Cere administratorului să le deschidă."
            : /rate limit|too many|security purposes/i.test(m) ? "Prea multe încercări. Așteaptă câteva minute."
            : /weak|password should/i.test(m) ? "Parola e prea slabă. Folosește litere, cifre și simboluri."
            : "Nu mă pot conecta: " + m;
          btn.disabled = false;
        }
      });
    };
    draw(msg);
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- aprobare: tl_members (pending / approved / blocked) ---------- */
  let member = { status: "approved", is_admin: false };
  async function loadMember() {
    try {
      const r = await api(CFG.supabaseUrl + "/rest/v1/tl_members?select=status,is_admin&user_id=eq." + session.user.id);
      if (r.status === 404) return; // schema veche, fără aprobare → acces ca până acum
      if (!r.ok) return;
      const rows = await r.json(); member = rows[0] || { status: "pending", is_admin: false };
    } catch {}
  }
  function waitScreen() {
    const d = document.createElement("div"); d.className = "tl-gate"; document.body.appendChild(d);
    const blocked = member.status === "blocked";
    d.innerHTML = `<form><h2>Trotuar Liber</h2>
      <p class="note ${blocked ? "bad" : "warn"}" style="margin:0">${blocked ? "Accesul acestui cont a fost oprit de administrator." : `Contul <b>${esc(session.user.email)}</b> e creat și <b>așteaptă aprobarea</b> administratorului. Revino după ce primești confirmarea.`}</p>
      ${blocked ? "" : `<button class="btn primary" type="button" id="tlAgain">Verifică din nou</button>`}
      <button class="btn small" type="button" id="tlOut">Ieșire</button></form>`;
    const a = d.querySelector("#tlAgain"); if (a) a.onclick = async () => { await loadMember(); if (member.status === "approved") { d.remove(); location.reload(); } else a.textContent = "Încă în așteptare – verifică din nou"; };
    d.querySelector("#tlOut").onclick = logout;
  }
  async function refreshUser() { // profilul (nume, telefon, domiciliu) e în contul Supabase → același pe toate dispozitivele
    try { const r = await api(CFG.supabaseUrl + "/auth/v1/user"); if (r.ok) { const u = await r.json(); session.user.meta = u.user_metadata || {}; session.user.email = u.email || session.user.email; ls.set(LS_SES, session); } } catch {}
  }
  async function start() {
    if (!document.getElementById("tl-css")) { const st = document.createElement("style"); st.id = "tl-css"; st.textContent = css; document.head.appendChild(st); }
    await loadMember();
    if (member.status !== "approved") { waitScreen(); return; }
    const b = document.createElement("button"); b.className = "tl-out"; b.type = "button";
    b.textContent = "Ieșire · " + (session.user.email || ""); b.onclick = logout; document.body.appendChild(b);
    refreshUser().finally(readyResolve);
  }

  /* ---------- db (tabelul tl_sesizari, rânduri {id, data}) ---------- */
  const T = () => CFG.supabaseUrl + "/rest/v1/" + CFG.table;
  const cache = new Map(); const listeners = new Set(); let pollT = null;
  const rid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "").slice(0, 20) : Math.random().toString(36).slice(2) + Date.now().toString(36));
  async function pull() {
    const r = await api(T() + "?select=id,data&order=created_at.desc&limit=1000");
    if (!r.ok) throw { code: "unavailable", message: "db " + r.status };
    const rows = await r.json(); cache.clear(); rows.forEach(x => cache.set(x.id, x.data)); emit(false);
  }
  function emit(pending) { listeners.forEach(l => { try { l(pending); } catch {} }); }
  function poll() { clearTimeout(pollT); pollT = setTimeout(() => pull().catch(() => {}).finally(poll), 15000); }
  function snapDoc(id, data) { return { id, exists: true, data: () => data, metadata: { fromCache: false, hasPendingWrites: false } }; }
  async function write(method, id, data) {
    let r;
    if (method === "set") r = await api(T() + "?on_conflict=id", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id, data }) });
    else if (method === "update") r = await api(T() + "?id=eq." + encodeURIComponent(id), { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ data, updated_at: new Date().toISOString() }) });
    else r = await api(T() + "?id=eq." + encodeURIComponent(id), { method: "DELETE", headers: { Prefer: "return=minimal" } });
    if (!r.ok) throw { code: r.status === 413 ? "quota_exceeded" : "invalid_argument", message: "db " + r.status };
  }
  function docRef(id) {
    return {
      id, path: CFG.table + "/" + id,
      async get() { await pull(); return cache.has(id) ? snapDoc(id, cache.get(id)) : { id, exists: false, data: () => undefined, metadata: { fromCache: false, hasPendingWrites: false } }; },
      async set(data) { cache.set(id, data); emit(true); await write("set", id, data); pull().catch(() => {}); },
      async update(patch) { const cur = cache.get(id); if (!cur) throw { code: "invalid_argument", message: "document inexistent" }; const nx = Object.assign({}, cur, patch); cache.set(id, nx); emit(true); await write("update", id, nx); },
      async delete() { cache.delete(id); emit(true); await write("delete", id); }
    };
  }
  function query(order) {
    return {
      orderBy(f, dir) { return query({ f, dir: dir || "asc" }); }, where() { return this; }, limit() { return this; },
      async get() { await pull(); return snapQ(order, false); },
      onSnapshot(next, error) {
        const l = pending => next(snapQ(order, pending)); listeners.add(l);
        pull().then(poll).catch(e => error && error({ code: e.code || "unavailable", message: e.message || "" }));
        return () => listeners.delete(l);
      },
      doc(id) { return docRef(id || rid()); },
      async add(data) { const d = docRef(rid()); await d.set(data); return d; }
    };
  }
  function snapQ(order, pending) {
    let docs = [...cache.entries()].map(([id, d]) => snapDoc(id, d));
    if (order) docs.sort((a, b) => { const x = a.data()[order.f], y = b.data()[order.f]; const c = x < y ? -1 : x > y ? 1 : 0; return order.dir === "desc" ? -c : c; });
    return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: pending } };
  }
  const db = { collection: () => query(null), doc: p => docRef(String(p).split("/").pop()) };

  /* ---------- poze: bucket privat, folder = id utilizator ---------- */
  const S = () => CFG.supabaseUrl + "/storage/v1/object";
  const signed = new Map();
  const assets = {
    async upload(blob) {
      const path = session.user.id + "/" + rid() + ".jpg";
      const r = await api(S() + "/" + CFG.bucket + "/" + path, { method: "POST", headers: { "Content-Type": "image/jpeg", "x-upsert": "false" }, body: blob });
      if (!r.ok) throw { code: r.status === 413 ? "too_large" : "upstream_error", message: "upload " + r.status };
      return { id: path, url: URL.createObjectURL(blob), sizeBytes: blob.size, contentType: "image/jpeg" };
    },
    async delete(path) { const r = await api(S() + "/" + CFG.bucket + "/" + path, { method: "DELETE" }); return { deleted: r.ok }; },
    async list() { return { assets: [], usage: {} }; }
  };
  window.TL_PHOTO_URL = async function (path) {
    const c = signed.get(path); if (c && c.exp > Date.now()) return c.url;
    const r = await api(S() + "/sign/" + CFG.bucket + "/" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expiresIn: 3600 }) });
    if (!r.ok) return null;
    const j = await r.json(); const u = CFG.supabaseUrl + "/storage/v1" + (j.signedURL || j.signedUrl);
    signed.set(path, { url: u, exp: Date.now() + 3300 * 1000 }); return u;
  };

  /* ---------- analiza: funcția Supabase (cheia Anthropic rămâne pe server) ---------- */
  const b64 = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = rej; fr.readAsDataURL(blob); });
  function parseJSON(t) {
    try { return JSON.parse(t); } catch {}
    const m = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (m) { try { return JSON.parse(m[1]); } catch {} }
    const a = t.indexOf("{"), b = t.lastIndexOf("}"); if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
    throw { code: "invalid_json", message: "răspuns nevalid: " + t.slice(0, 120).replace(/\s+/g, " "), text: t };
  }
  async function callAI(prompt, opts = {}) {
    const imgs = opts.images ? (Array.isArray(opts.images) ? opts.images : [opts.images]) : [];
    const body = { prompt, images: await Promise.all(imgs.slice(0, 1).map(b64)) };
    let r;
    try { r = await api(CFG.supabaseUrl + "/functions/v1/" + CFG.functionName, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: opts.signal }); }
    catch (e) { if (e && e.name === "AbortError") throw { code: "cancelled", message: "oprit" }; throw e && e.code ? e : { code: "upstream_error", message: String(e) }; }
    const j = await r.json().catch(() => ({}));
    if (r.status === 429) throw { code: "rate_limited", message: j.error || "limită zilnică" };
    if (r.status === 403) throw { code: "not_granted", message: j.error || "neautorizat" };
    if (r.status === 413) throw { code: "image_rejected", message: j.error || "imagine prea mare" };
    if (!r.ok || !j.text) throw { code: "upstream_error", message: j.error || ("funcție " + r.status + ", fără text") };
    if (j.stop === "max_tokens") throw { code: "invalid_json", message: "răspuns tăiat la limita de lungime", text: j.text };
    return j.text;
  }
  const sample = async (prompt, opts) => { const text = await callAI(prompt, opts); return { text, truncated: false, modelTierApplied: "default" }; };
  sample.json = async (prompt, opts) => parseJSON(await callAI(prompt, opts));
  sample.limits = async () => ({ maxPromptBytes: 60000, images: { maxCount: 1, maxInputBytes: 5 * 1024 * 1024, mediaTypes: ["image/jpeg"] } });

  /* ---------- user / downloads ---------- */
  const meta = () => (session && session.user.meta) || {};
  const user = {
    id: async () => session.user.id,
    me: async () => ({ id: session.user.id, isMe: true, name: meta().full_name || "", email: meta().contact_email || session.user.email || null, tel: meta().tel || "", domiciliu: meta().domiciliu || "" }),
    async saveProfile(data) {
      const r = await api(CFG.supabaseUrl + "/auth/v1/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
      if (r.ok) { const u = await r.json(); session.user.meta = u.user_metadata || data; ls.set(LS_SES, session); }
    },
    async changePassword(password) {
      const r = await api(CFG.supabaseUrl + "/auth/v1/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(/same|different/i.test(j.msg || j.message || "") ? "Parola nouă trebuie să fie diferită de cea veche." : /weak|short|characters/i.test(j.msg || j.message || "") ? "Parola e prea slabă. Folosește litere, cifre și simboluri." : "Parola nu a putut fi schimbată (" + r.status + ")."); }
    },
    isOwner: () => true, canEdit: () => true, can: () => true, profiles: async () => ({}),
    recovery: () => !!window.__tlRecovery,
    isAdmin: () => !!member.is_admin,
    async listMembers() {
      const r = await api(CFG.supabaseUrl + "/rest/v1/tl_members?select=user_id,email,nume,status,is_admin,created_at&order=created_at.desc");
      if (!r.ok) throw new Error("Lista nu poate fi citită (" + r.status + ").");
      return r.json();
    },
    async setMemberStatus(userId, status) {
      const r = await api(CFG.supabaseUrl + "/rest/v1/rpc/tl_set_member_status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ p_user: userId, p_status: status }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || ("Eroare " + r.status)); }
    }
  };
  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data]);
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); return { status: "saved" };
    }
  };

  const NS = { db, assets, sample, user, downloads };
  window.claude = { __shim: true, use: async name => { await ready; return NS[name] || null; } };

  async function fromEmailLink() { // linkurile din e-mail (confirmare cont / resetare parolă) aduc sesiunea în #fragment
    const h = new URLSearchParams(location.hash.replace(/^#/, ""));
    if (h.get("error_description")) { history.replaceState(null, "", APP_URL()); return { msg: "Linkul din e-mail nu mai e valid (" + esc(h.get("error_description")) + "). Cere unul nou." }; }
    const at = h.get("access_token"); if (!at) return null;
    history.replaceState(null, "", APP_URL());
    try {
      const r = await fetch(CFG.supabaseUrl + "/auth/v1/user", { headers: { apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + at } });
      if (!r.ok) throw 0;
      const u = await r.json();
      keep({ access_token: at, refresh_token: h.get("refresh_token"), expires_in: +h.get("expires_in") || 3600, user: u });
      if (h.get("type") === "recovery") window.__tlRecovery = true;
      return { ok: true };
    } catch { return { msg: "Linkul din e-mail nu a putut fi folosit. Intră cu e-mailul și parola." }; }
  }
  const boot = async () => {
    if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) { gate(); return; }
    const link = await fromEmailLink();
    if (link && link.msg) { gate(link.msg); return; }
    if (session) fresh().then(start).catch(() => gate()); else gate();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
