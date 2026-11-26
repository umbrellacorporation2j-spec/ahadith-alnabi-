const V="ahadith-v8",DATA="ahadith-data";
const SHELL=["./","index.html","offline.html","manifest.json","icon-180.png","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("ahadith-v")&&x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(q,r)=>{if(r&&(r.ok||r.type=="opaque")){const cl=r.clone();caches.open(DATA).then(c=>c.put(q,cl))}return r};
self.addEventListener("fetch",e=>{
const q=e.request,u=new URL(q.url);if(q.method!="GET")return;
if(q.mode=="navigate"){e.respondWith(fetch(q).then(r=>{if(r.ok){const cl=r.clone();caches.open(V).then(c=>c.put(q,cl))}return r}).catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match("index.html")).then(r=>r||caches.match("offline.html"))));return}
if(u.origin==location.origin){e.respondWith(caches.match(q).then(c=>{const n=fetch(q).then(r=>{if(r.ok){const cl=r.clone();caches.open(V).then(x=>x.put(q,cl))}return r}).catch(()=>c);return c||n}));return}
if(["cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"].includes(u.host)){e.respondWith(caches.match(q).then(c=>c||fetch(q).then(r=>put(q,r))))}
});
