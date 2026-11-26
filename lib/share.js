'use strict';
// koru share: wrap a deliverable (one HTML file) in a password-protected page, record what was
// shared, and publish it to Koru's hosted service when one is configured. Clients get links, not files.
//
// Encryption: AES-256-GCM with a key derived by PBKDF2-SHA256 (310,000 rounds). The page decrypts in
// the browser with Web Crypto, so the password never leaves the viewer's machine.
// Hosting: set KORU_SHARE_URL (an endpoint that accepts a POST of the HTML and returns {"url": "..."})
// and KORU_SHARE_TOKEN. Without them, the protected file is written locally for upload by hand.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const K = require('./core');

const ROUNDS = 310000;

function words() {
  const a = 'amber birch cedar delta ember fjord grove harbor indigo juniper kelp lumen maple north orbit pebble quartz river sable tidal umber violet willow xenon yarrow zephyr'.split(' ');
  const pick = () => a[crypto.randomInt(a.length)];
  return `${pick()}-${pick()}-${pick()}-${crypto.randomInt(10, 99)}`;
}

function encrypt(html, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ROUNDS, 32, 'sha256');
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(Buffer.from(html, 'utf8')), c.final(), c.getAuthTag()]);
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), data: body.toString('base64'), rounds: ROUNDS };
}

function page(title, payload) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title.replace(/</g, '&lt;')}</title>
<style>:root{--bg:#f6f7f9;--ink:#16202a;--muted:#5b6672;--line:#d5dbe1;--accent:#1f6f8b}@media (prefers-color-scheme:dark){:root{--bg:#0f1418;--ink:#e6edf3;--muted:#9aa7b3;--line:#2a3640;--accent:#5fb3cf}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif}
form{width:min(360px,calc(100vw - 32px))}h1{font-size:18px;margin:0 0 6px}p{color:var(--muted);margin:0 0 16px}
input,button{width:100%;font:inherit;padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:transparent;color:inherit}button{margin-top:10px;background:var(--accent);border-color:var(--accent);color:#fff;cursor:pointer}#e{color:#c0392b;min-height:1.5em;margin-top:8px}</style></head>
<body><form id="f"><h1>${title.replace(/</g, '&lt;')}</h1><p>Shared privately by Koru. Enter the password you were given.</p>
<label for="p" class="sr">Password</label><input id="p" type="password" autocomplete="off" autofocus required><button>Open</button><div id="e" role="alert"></div></form>
<script>const P=${JSON.stringify(payload)};const b=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
document.getElementById('f').onsubmit=async ev=>{ev.preventDefault();try{const pw=new TextEncoder().encode(document.getElementById('p').value);
const base=await crypto.subtle.importKey('raw',pw,'PBKDF2',false,['deriveKey']);
const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b(P.salt),iterations:P.rounds,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
const out=await crypto.subtle.decrypt({name:'AES-GCM',iv:b(P.iv)},key,b(P.data));const html=new TextDecoder().decode(out);document.open();document.write(html);document.close();}
catch(e){document.getElementById('e').textContent='That password did not open it.';}};</script></body></html>`;
}

// The feedback layer: injected into the shared page so a client can pin a comment to the screen,
// state or component they are looking at. Comments stay in the viewer's browser until they press
// "Download feedback"; the file imports with  koru playback import feedback.json .
function feedbackLayer(title) {
  const t = JSON.stringify(String(title));
  return `<div id="kfb" data-koru-ignore><style>
#kfb{--k-bg:#fff;--k-ink:#16202a;--k-mut:#5b6672;--k-line:#d5dbe1;--k-acc:#1f6f8b;font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;color:var(--k-ink)}
@media (prefers-color-scheme:dark){#kfb{--k-bg:#141b21;--k-ink:#e6edf3;--k-mut:#9aa7b3;--k-line:#2a3640;--k-acc:#5fb3cf}}
#kfb .kb{position:fixed;right:16px;bottom:16px;z-index:2147483646;display:flex;gap:8px}
#kfb button{font:inherit;min-height:36px;padding:6px 12px;border-radius:8px;border:1px solid var(--k-line);background:var(--k-bg);color:var(--k-ink);cursor:pointer}
#kfb button.pri{background:var(--k-acc);border-color:var(--k-acc);color:#fff}
#kfb button:focus-visible,#kfb input:focus-visible,#kfb select:focus-visible,#kfb textarea:focus-visible{outline:2px solid var(--k-acc);outline-offset:2px}
#kfb .kp{position:fixed;right:16px;bottom:64px;z-index:2147483646;width:min(360px,calc(100vw - 32px));max-height:70vh;overflow:auto;background:var(--k-bg);border:1px solid var(--k-line);border-radius:12px;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,.18)}
#kfb .kp[hidden]{display:none}#kfb label{display:block;font-size:12px;color:var(--k-mut);margin:8px 0 2px}
#kfb input,#kfb select,#kfb textarea{width:100%;box-sizing:border-box;font:inherit;padding:7px 9px;border-radius:8px;border:1px solid var(--k-line);background:transparent;color:inherit}
#kfb textarea{min-height:72px}#kfb ol{padding-left:18px;margin:8px 0}#kfb li{margin:6px 0}#kfb .a{font-size:12px;color:var(--k-mut)}
#kfb h2{font-size:15px;margin:0 0 4px}#kfb p{margin:0 0 6px;color:var(--k-mut);font-size:13px}
.kfb-pick *{cursor:crosshair!important}.kfb-hl{outline:2px dashed #1f6f8b!important;outline-offset:2px!important}
</style>
<div class="kp" id="kfb-p" hidden role="dialog" aria-label="Feedback"><h2>Feedback</h2><p id="kfb-at">Choose "Pin to…" and click the part of the page you mean, or write about the page as a whole.</p>
<label for="kfb-n">Your name</label><input id="kfb-n" autocomplete="name">
<label for="kfb-t">This is</label><select id="kfb-t"><option value="">(choose)</option><option value="evidence">something we saw or know happens</option><option value="constraint">a rule or limit we must work within</option><option value="idea">an idea</option><option value="preference">a preference</option><option value="question">a question</option></select>
<label for="kfb-x">Comment</label><textarea id="kfb-x"></textarea>
<div style="display:flex;gap:8px;margin-top:10px"><button type="button" id="kfb-pin">Pin to…</button><button type="button" class="pri" id="kfb-add">Add comment</button></div>
<ol id="kfb-l"></ol><div style="display:flex;gap:8px"><button type="button" id="kfb-dl">Download feedback</button></div><p class="a" id="kfb-s" role="status"></p></div>
<div class="kb"><button type="button" class="pri" id="kfb-o" aria-expanded="false" aria-controls="kfb-p">Feedback <span id="kfb-c"></span></button></div>
<script>(()=>{const T=${t},K='koru-feedback:'+T,$=i=>document.getElementById(i);let L=[];try{L=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}
let anchor='';const st=()=>new URLSearchParams(location.search).get('state')||'';const save=()=>{try{localStorage.setItem(K,JSON.stringify(L))}catch(e){}};
try{$('kfb-n').value=localStorage.getItem('koru-feedback:name')||''}catch(e){}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const draw=()=>{$('kfb-c').textContent=L.length?'('+L.length+')':'';$('kfb-l').innerHTML=L.map((c,i)=>'<li>'+esc(c.text)+'<div class="a">'+esc([c.anchor,c.state,c.type,c.author].filter(Boolean).join(' · '))+' <button type="button" data-del="'+i+'" aria-label="Remove comment '+(i+1)+'">Remove</button></div></li>').join('')};
const find=el=>{for(let n=el;n&&n!==document.body;n=n.parentElement){if(n.closest&&n.closest('#kfb'))return '';const d=n.dataset||{};if(d.koruState)return d.koruState;if(d.koruScreen)return d.koruScreen;if(/^(SCR|STA|DIR)-\\d{3}$/.test(n.id||''))return n.id;if(d.ds)return 'component '+d.ds}
const h=document.querySelector('[data-koru-screen]');return h?h.dataset.koruScreen:''};
$('kfb-o').onclick=()=>{const p=$('kfb-p');p.hidden=!p.hidden;$('kfb-o').setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)$('kfb-x').focus()};
$('kfb-pin').onclick=()=>{document.documentElement.classList.add('kfb-pick');$('kfb-s').textContent='Click the part of the page you mean. Esc cancels.';let last;
const over=e=>{if(last)last.classList.remove('kfb-hl');if(!e.target.closest('#kfb')){last=e.target;last.classList.add('kfb-hl')}};
const end=()=>{document.documentElement.classList.remove('kfb-pick');if(last)last.classList.remove('kfb-hl');document.removeEventListener('mouseover',over,true);document.removeEventListener('click',pick,true);document.removeEventListener('keydown',key,true)};
const pick=e=>{if(e.target.closest('#kfb'))return;e.preventDefault();e.stopPropagation();anchor=find(e.target)||'page';end();$('kfb-at').textContent='Pinned to '+anchor+(st()?' ('+st()+')':'')+'.';$('kfb-s').textContent='';$('kfb-x').focus()};
const key=e=>{if(e.key==='Escape'){end();$('kfb-s').textContent='Cancelled.'}};
document.addEventListener('mouseover',over,true);document.addEventListener('click',pick,true);document.addEventListener('keydown',key,true)};
$('kfb-add').onclick=()=>{const text=$('kfb-x').value.trim();if(!text){$('kfb-s').textContent='Write a comment first.';return}const author=$('kfb-n').value.trim();try{localStorage.setItem('koru-feedback:name',author)}catch(e){}
L.push({anchor:anchor||find(document.body)||'page',state:st(),text,author,role:'',type:$('kfb-t').value,at:new Date().toISOString()});save();draw();$('kfb-x').value='';anchor='';$('kfb-at').textContent='Added. Keep going, then download.';$('kfb-s').textContent=L.length+' comment(s) saved in this browser.'};
$('kfb-l').onclick=e=>{const i=e.target.dataset&&e.target.dataset.del;if(i!==undefined){L.splice(+i,1);save();draw()}};
$('kfb-dl').onclick=()=>{if(!L.length){$('kfb-s').textContent='No comments yet.';return}const blob=new Blob([JSON.stringify({page:T,exported_at:new Date().toISOString(),comments:L},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='feedback-'+T.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.json';document.body.appendChild(a);a.click();a.remove();$('kfb-s').textContent='Downloaded. Send the file back to the team.'};
draw()})();</scr`+`ipt></div>`;
}

function withFeedback(html, title) {
  const layer = feedbackLayer(title);
  return /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${layer}</body>`) : html + layer;
}

async function cmdShare(root, pos, opt) {
  const p = K.paths(root);
  const target = pos[0] === 'client' || !pos[0] ? path.join(p.generated, 'client', 'index.html') : path.resolve(pos[0]);
  if (!fs.existsSync(target)) {
    console.error(pos[0] === 'client' || !pos[0] ? 'No client page yet. Run: koru index' : `No file at ${pos[0]}.`);
    process.exit(1);
  }
  let file = target;
  if (fs.statSync(target).isDirectory()) {
    file = path.join(target, 'index.html');
    if (!fs.existsSync(file)) { console.error('A folder share needs an index.html. Build the front end as one self-contained HTML file first.'); process.exit(1); }
    console.error('Note: only index.html is shared. Inline its scripts, styles and images so it works on its own.');
  }
  const html = fs.readFileSync(file, 'utf8');
  if (/status:\s*draft/.test(html) || /\bDRAFT\b/.test(html)) {
    if (!opt['allow-draft']) { console.error('This file looks like a draft. Clients see signed work only. (Override for an internal review: --allow-draft)'); process.exit(1); }
  }
  const eng = K.readEngagement(root);
  const password = opt.password && opt.password !== true ? String(opt.password) : words();
  if (password.length < 10) { console.error('Use a password of at least 10 characters.'); process.exit(1); }
  // Name the page after what it is: --title, else the file's own <title>, else its folder or file name.
  const own = (html.match(/<title>([^<]{1,120})<\/title>/i) || [])[1];
  const base = path.basename(file, '.html') === 'index' ? path.basename(path.dirname(file)) : path.basename(file, '.html');
  const title = opt.title && opt.title !== true ? opt.title : `${eng.client || 'Koru'} · ${base === 'client' ? 'project page' : (own || base).trim()}`;
  const shown = opt['no-feedback'] ? html : withFeedback(html, title);
  const protectedHtml = page(title, encrypt(shown, password));
  const outDir = path.join(p.generated, 'share');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = K.now().replace(/[:]/g, '');
  const outFile = path.join(outDir, `${base}-${stamp}.html`);
  fs.writeFileSync(outFile, protectedHtml);

  // What this link shows: the version of every final card at the time of sharing.
  const cards = K.loadCards(root);
  const versions = Object.values(cards).filter((c) => c.status === 'final').map((c) => `${c.id}@${c.version}`);
  let url = null;
  if (opt.publish) {
    const endpoint = process.env.KORU_SHARE_URL;
    if (!endpoint) {
      console.error('KORU_SHARE_URL is not set, so nothing was published. The protected file is ready to upload: ' + path.relative(process.cwd(), outFile));
    } else {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'text/html', authorization: `Bearer ${process.env.KORU_SHARE_TOKEN || ''}`, 'x-koru-client': eng.project || '', 'x-koru-title': title },
        body: protectedHtml,
      });
      if (!res.ok) { console.error(`Publishing failed: ${res.status} ${await res.text()}`); process.exit(1); }
      url = (await res.json()).url;
    }
  }
  K.appendJsonl(K.stateFile(root, 'shares.jsonl'), { at: K.now(), file: path.relative(p.koru, file), protected: path.relative(p.koru, outFile), url, to: opt.to || '', by: opt.name || '', teachback: opt.teachback || '', cards: versions });
  K.log(root, 'share', { file: path.relative(p.koru, file), to: opt.to || '', url });
  console.log(`Protected page: ${path.relative(process.cwd(), outFile)}${url ? `\nLink: ${url}` : ''}`);
  console.log(`Password: ${password}`);
  console.log('Send the password separately from the link. It is not stored anywhere.');
}

module.exports = { cmdShare, encrypt, page, withFeedback };
