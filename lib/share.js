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
  const protectedHtml = page(title, encrypt(html, password));
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

module.exports = { cmdShare, encrypt, page };
