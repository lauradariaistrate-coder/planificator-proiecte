/* ===== Planificator – rulare în afara Claude (GitHub Pages + Supabase), 02.11.2026 =====
   Când pagina NU rulează ca artifact Claude, acest strat imită window.claude (db, user, downloads)
   peste un tabel Supabase (planner_docs). Fiecare echipă are un „cod de echipă” secret (ws):
   toate datele echipei stau sub acel cod, iar regulile RLS din Supabase lasă să se vadă doar
   rândurile cu codul trimis în antetul x-ws. */
(function(){
  if(window.claude&&window.claude.use)return;
  const LS="pp-sb";
  const get=()=>{try{return JSON.parse(localStorage.getItem(LS)||"{}")}catch(_){return {}}};
  const base=window.PLANIFICATOR_CONFIG||{};
  const cfg=Object.assign({},base,get());
  const ready=cfg.url&&cfg.key&&cfg.ws&&cfg.ws.length>=20;
  if(!ready){document.addEventListener("DOMContentLoaded",()=>setup(cfg,!!(base.url&&base.key)));return}
  const URL_=cfg.url.replace(/\/+$/,"")+"/rest/v1/planner_docs";
  const H={"apikey":cfg.key,"Authorization":"Bearer "+cfg.key,"x-ws":cfg.ws,"Content-Type":"application/json"};
  const q=o=>Object.entries(o).map(([k,v])=>k+"=eq."+encodeURIComponent(v)).join("&");
  const cache={},subs={};
  async function load(col){
    const r=await fetch(URL_+"?select=id,data&"+q({ws:cfg.ws,col}),{headers:H});
    if(!r.ok)throw Object.assign(new Error("db "+r.status),{code:r.status===401||r.status===403?"invalid_argument":"unavailable"});
    const rows=await r.json();const m={};rows.forEach(x=>{m[x.id]=x.data});
    const sig=JSON.stringify(m);if(cache[col]&&cache[col].sig===sig)return false;
    cache[col]={m,sig};return true;
  }
  const snap=col=>{const m=(cache[col]||{}).m||{};const docs=Object.entries(m).map(([id,d])=>({id,exists:true,data:()=>JSON.parse(JSON.stringify(d))}));return {docs,size:docs.length,empty:!docs.length}};
  const fire=col=>(subs[col]||[]).forEach(f=>{try{f(snap(col))}catch(e){console.error(e)}});
  async function refresh(col,force){try{if(await load(col)||force)fire(col)}catch(e){(subs[col+"!err"]||[]).forEach(f=>f(e))}}
  setInterval(()=>Object.keys(subs).filter(k=>!k.endsWith("!err")).forEach(c=>refresh(c)),15000);
  async function put(col,id,data){
    const r=await fetch(URL_+"?on_conflict=ws,col,id",{method:"POST",headers:Object.assign({"Prefer":"resolution=merge-duplicates,return=minimal"},H),body:JSON.stringify({ws:cfg.ws,col,id,data,updated_at:new Date().toISOString()})});
    if(!r.ok)throw Object.assign(new Error("db "+r.status),{code:"unavailable"});
    cache[col]=cache[col]||{m:{}};cache[col].m[id]=data;cache[col].sig="";fire(col);setTimeout(()=>refresh(col),300);
  }
  const collection=col=>({
    onSnapshot(cb,err){(subs[col]=subs[col]||[]).push(cb);if(err)(subs[col+"!err"]=subs[col+"!err"]||[]).push(err);
      if(cache[col])setTimeout(()=>cb(snap(col)),0);else refresh(col,true);return()=>{}},
    doc:id=>({
      async set(d){await put(col,id,d)},
      async update(d){await load(col).catch(()=>{});const cur=((cache[col]||{}).m||{})[id]||{};
        const nx=Object.assign({},cur,d);Object.keys(nx).forEach(k=>{if(nx[k]&&nx[k].__delete__)delete nx[k]});await put(col,id,nx)},
      async delete(){const r=await fetch(URL_+"?"+q({ws:cfg.ws,col,id}),{method:"DELETE",headers:H});
        if(!r.ok)throw Object.assign(new Error("db "+r.status),{code:"unavailable"});
        if(cache[col]){delete cache[col].m[id];cache[col].sig=""}fire(col)},
      onSnapshot(cb){setTimeout(()=>{const d=((cache[col]||{}).m||{})[id];cb({exists:!!d,data:()=>d})},0);return()=>{}}
    })});
  const db={doc:()=>({collection}),collection};
  const downloads={async save({filename,data}){const u=URL.createObjectURL(data instanceof Blob?data:new Blob([data]));const a=document.createElement("a");a.href=u;a.download=filename||"fisier";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return {status:"saved"}}};
  const user={async id(){return "ws"},async me(){return {name:""}}};
  window.claude={use:async n=>n==="db"?db:n==="user"?user:n==="downloads"?downloads:null};
  window.PLANIFICATOR_ECHIPA=cfg.ws;
})();
/* ecran de configurare: adresa Supabase + cheia publică + codul echipei */
function setup(cfg,baked){
  const st=document.createElement("div");
  st.style.cssText="position:fixed;inset:0;z-index:100;background:rgba(15,22,27,.6);display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow:auto;font-family:Segoe UI,Arial,sans-serif";
  const rnd=()=>{const a=new Uint8Array(18);crypto.getRandomValues(a);return [...a].map(x=>x.toString(36).padStart(2,"0")).join("").slice(0,28)};
  st.innerHTML=`<div style="background:#fff;color:#1C2830;max-width:560px;width:100%;border:1.5px solid #1C2830;padding:18px 20px;display:flex;flex-direction:column;gap:12px">
    <h2 style="margin:0;font-size:22px;text-transform:uppercase;letter-spacing:.04em">Planificator proiecte – configurare</h2>
    <div style="font-size:13px;color:#55636C">Datele se păstrează în baza de date Supabase a echipei. Fiecare echipă are un <b>cod de echipă</b> secret: cine îl are vede proiectele echipei.</div>
    ${baked?"":`<label style="font-size:12px;font-weight:600">Adresa Supabase (Project URL)<input id="s-url" value="${cfg.url||""}" placeholder="https://xxxx.supabase.co" style="width:100%;padding:8px;margin-top:4px"></label>
    <label style="font-size:12px;font-weight:600">Cheia publică (anon public key)<input id="s-key" value="${cfg.key||""}" style="width:100%;padding:8px;margin-top:4px"></label>`}
    <label style="font-size:12px;font-weight:600">Codul echipei<input id="s-ws" value="${cfg.ws||""}" placeholder="primit de la un coleg sau creat mai jos" style="width:100%;padding:8px;margin-top:4px;font-family:Consolas,monospace"></label>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button id="s-new" style="padding:7px 12px">Creez o echipă nouă (cod nou)</button></div>
    <div id="s-err" style="color:#B63A2B;font-size:13px"></div>
    <div style="display:flex;justify-content:flex-end"><button id="s-ok" style="padding:8px 16px;background:#2C5F86;color:#fff;border:0;font-weight:600">Intru în planificator</button></div>
    <div style="font-size:12px;color:#55636C">Codul echipei se păstrează doar pe acest calculator. Îl trimiți colegilor ca să lucreze în același planificator. Fără cod nu se pot vedea datele.</div></div>`;
  document.body.appendChild(st);
  st.querySelector("#s-new").onclick=()=>{st.querySelector("#s-ws").value=rnd();st.querySelector("#s-err").textContent="Cod nou creat. Notează-l și trimite-l colegilor."};
  st.querySelector("#s-ok").onclick=()=>{const v=id=>{const e=st.querySelector(id);return e?e.value.trim():""};
    const o={ws:v("#s-ws")};if(!baked){o.url=v("#s-url");o.key=v("#s-key")}
    if(!baked&&(!/^https:\/\/.+/.test(o.url)||o.key.length<20)){st.querySelector("#s-err").textContent="Completează adresa și cheia Supabase.";return}
    if(o.ws.length<20){st.querySelector("#s-err").textContent="Codul echipei trebuie să aibă minim 20 de caractere (folosește „Creez o echipă nouă”).";return}
    try{localStorage.setItem("pp-sb",JSON.stringify(o))}catch(_){}location.reload()};
}
