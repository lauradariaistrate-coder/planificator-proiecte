/* Trotuar Liber – strat de compatibilitate pentru rularea în afara Claude (GitHub Pages + Supabase).
 * Imită window.claude.use("db" | "user" | "sample" | "assets" | "downloads").
 * În Claude nu face nimic (window.claude există deja).
 *
 * Securitate:
 *  - login email + parolă (Supabase Auth); înscrierile publice sunt dezactivate din proiectul Supabase;
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
  function gate() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const needCfg = !CFG.supabaseUrl || !CFG.supabaseAnonKey;
    const d = document.createElement("div"); d.className = "tl-gate";
    d.innerHTML = `<form autocomplete="on">
      <h2>Trotuar Liber</h2>
      <p class="hint" style="margin:0">${needCfg ? "Prima pornire: adresa și cheia publică (anon/publishable) a proiectului Supabase. Se salvează doar în acest browser." : "Autentificare"}</p>
      ${needCfg ? `<div><label class="lbl" for="tlU">URL proiect Supabase</label><input type="text" id="tlU" placeholder="https://xxxx.supabase.co" required></div>
      <div><label class="lbl" for="tlK">Cheie publică (anon / publishable)</label><input type="text" id="tlK" required></div>` : ""}
      <div><label class="lbl" for="tlE">E-mail</label><input type="email" id="tlE" autocomplete="username" required></div>
      <div><label class="lbl" for="tlP">Parolă</label><input type="password" id="tlP" autocomplete="current-password" required></div>
      <p class="err" id="tlErr"></p>
      <button class="btn primary" type="submit">Intră</button>
      ${!needCfg && !(window.TL_CONFIG && window.TL_CONFIG.supabaseUrl) ? `<button class="btn small" type="button" id="tlReset">Schimbă proiectul Supabase</button>` : ""}
    </form>`;
    document.body.appendChild(d);
    const f = d.querySelector("form");
    const rs = d.querySelector("#tlReset"); if (rs) rs.onclick = () => { ls.del(LS_CFG); location.reload(); };
    f.addEventListener("submit", async e => {
      e.preventDefault(); const err = d.querySelector("#tlErr"); err.textContent = "";
      if (needCfg) {
        const u = d.querySelector("#tlU").value.trim().replace(/\/+$/, ""), k = d.querySelector("#tlK").value.trim();
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(u)) { err.textContent = "Adresa trebuie să fie de forma https://xxxx.supabase.co"; return; }
        CFG.supabaseUrl = u; CFG.supabaseAnonKey = k; ls.set(LS_CFG, { supabaseUrl: u, supabaseAnonKey: k });
      }
      f.querySelector("button[type=submit]").disabled = true;
      try { keep(await authPost("token?grant_type=password", { email: d.querySelector("#tlE").value.trim(), password: d.querySelector("#tlP").value })); d.remove(); start(); }
      catch (x) { err.textContent = /invalid/i.test(x.message) ? "E-mail sau parolă greșită." : ("Nu mă pot conecta: " + x.message); f.querySelector("button[type=submit]").disabled = false; }
    });
  }
  async function refreshUser() { // profilul (nume, telefon, domiciliu) e în contul Supabase → același pe toate dispozitivele
    try { const r = await api(CFG.supabaseUrl + "/auth/v1/user"); if (r.ok) { const u = await r.json(); session.user.meta = u.user_metadata || {}; session.user.email = u.email || session.user.email; ls.set(LS_SES, session); } } catch {}
  }
  function start() {
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
    isOwner: () => true, canEdit: () => true, can: () => true, profiles: async () => ({})
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

  const boot = () => { if (session && CFG.supabaseUrl && CFG.supabaseAnonKey) fresh().then(start).catch(() => gate()); else gate(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
