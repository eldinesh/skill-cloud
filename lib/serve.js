'use strict';
// koru board --serve: the board on this computer, so people can read and edit draft cards in a
// browser. Edits go through the same checks as Claude's edits (lib/guard.js checkCardWrite):
// status, signatures, versions and contract fields cannot be changed here. Signing and gates stay
// in Claude Code, typed by a person. Listens on 127.0.0.1 only.

const fs = require('fs');
const path = require('path');
const http = require('http');
const K = require('./core');

function serve(root, opt, health) {
  const port = Number(opt.port || 4321);
  const build = () => require('./board').generate(root, { health })[0];
  const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };
  const readBody = (req) => new Promise((ok, bad) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > 2e6) req.destroy(); }); req.on('end', () => { try { ok(JSON.parse(b || '{}')); } catch (e) { bad(e); } }); });
  const editor = () => { try { return require('child_process').execSync('git config user.name', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { return process.env.USER || 'person'; } };

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      // Same-origin only: refuse requests a web page elsewhere could forge.
      if (req.method === 'POST' && req.headers.origin && req.headers.origin !== `http://127.0.0.1:${port}` && req.headers.origin !== `http://localhost:${port}`) return send(res, 403, { error: 'Wrong origin.' });
      if (url.pathname === '/' || url.pathname === '/board.html') return send(res, 200, fs.readFileSync(build(), 'utf8'), 'text/html; charset=utf-8');
      if (url.pathname === '/api/ping') return send(res, 200, { koru: true });
      // The live board: tickets, agents at work, the activity feed, and the queue people control.
      if (url.pathname === '/live' || url.pathname === '/live.html') return send(res, 200, require('./live').page(root), 'text/html; charset=utf-8');
      if (url.pathname === '/api/live') return send(res, 200, require('./live').snapshot(root));
      if (url.pathname === '/api/order') {
        const r = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'koru.js'), 'next', '--order', String(url.searchParams.get('step') || ''), ...(url.searchParams.get('package') ? ['--package', url.searchParams.get('package')] : []), '--peek'], { cwd: root, encoding: 'utf8' });
        return send(res, r.status ? 422 : 200, (r.stdout || r.stderr).trim(), 'text/plain; charset=utf-8');
      }
      if (req.method === 'POST' && (url.pathname === '/api/queue' || url.pathname === '/api/unqueue')) {
        const { step, package: pkg } = await readBody(req);
        const L = require('./live');
        if (url.pathname === '/api/unqueue') { K.appendJsonl(K.stateFile(root, 'runs.jsonl'), { at: K.now(), event: 'unqueued', step: String(step || '').toUpperCase(), package: pkg || '', by: editor() }); return send(res, 200, { ok: true }); }
        try { return send(res, 200, { ok: true, key: L.queue(root, step, pkg, editor()) }); } catch (e) { return send(res, 422, { error: e.message }); }
      }
      if (req.method === 'POST' && url.pathname === '/api/save') {
        const { id, title, body } = await readBody(req);
        const cards = K.loadCards(root);
        const c = cards[String(id || '').toUpperCase()];
        if (!c) return send(res, 404, { error: `No card ${id}.` });
        if (c.status === 'final' || c.status === 'superseded') return send(res, 409, { error: `${c.id} is ${c.status}. Start a new version first.` });
        let text = c.text;
        const { meta } = K.splitCard(text);
        const head = text.slice(0, text.indexOf('\n---', 4) + 4);
        if (title && title !== meta.title) text = K.setField(text, 'title', String(title).replace(/\n/g, ' '));
        const newHead = text.slice(0, text.indexOf('\n---', 4) + 4);
        const heading = `# ${c.id} · ${title || meta.title}`;
        text = `${newHead}\n${heading}\n\n${String(body || '').replace(/^# .*\n+/, '').trim()}\n`;
        text = K.setField(text, 'updated', K.now());
        void head;
        const why = require('./guard').checkCardWrite(root, c.file, c.text, text);
        if (why) return send(res, 422, { error: why });
        fs.writeFileSync(c.file, text);
        const dir = path.join(K.paths(root).history, c.id);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${K.now().replace(/[:]/g, '')}-v${c.version}-board.md`), text);
        K.log(root, 'board-edit', { id: c.id, title: title || meta.title, by: editor() });
        return send(res, 200, { ok: true });
      }
      if (req.method === 'POST' && url.pathname === '/api/revise') {
        const { id, reason } = await readBody(req);
        if (!reason) return send(res, 400, { error: 'Say what changes.' });
        const r = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'koru.js'), 'revise', String(id), '--reason', String(reason)], { cwd: root, encoding: 'utf8' });
        return r.status ? send(res, 422, { error: (r.stderr || r.stdout).trim() }) : send(res, 200, { ok: true, message: r.stdout.trim() });
      }
      const gen = path.resolve(K.paths(root).generated, '.' + url.pathname);
      if (gen.startsWith(K.paths(root).generated) && fs.existsSync(gen) && fs.statSync(gen).isFile()) return send(res, 200, fs.readFileSync(gen), /\.png$/.test(gen) ? 'image/png' : /\.html$/.test(gen) ? 'text/html; charset=utf-8' : 'text/plain');
      return send(res, 404, { error: 'Not found' });
    } catch (e) { return send(res, 500, { error: e.message }); }
  });
  server.listen(port, '127.0.0.1', () => console.log(`Koru board: http://127.0.0.1:${port}/   Live board: http://127.0.0.1:${port}/live   (Ctrl+C to stop). Draft cards can be edited there; signing stays in Claude Code.`));
  return server;
}

module.exports = { serve };
