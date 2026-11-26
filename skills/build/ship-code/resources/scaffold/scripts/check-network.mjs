// CODE-R21: the deliverable makes no network calls: no remote URLs, fetch, XHR, sockets, beacons.
import { walk, report, lines } from './_walk.mjs';

const hits = [];
for (const f of walk('src', ['.ts', '.tsx', '.css'])) {
  lines(f).forEach((l, i) => {
    const at = `${f}:${i + 1}`;
    if (/\bhttps?:\/\//.test(l) && !/\/\/ allow-url:/.test(l)) hits.push(`${at} remote URL`);
    if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b\s*\(|new\s+(?:WebSocket|EventSource|XMLHttpRequest)\b|sendBeacon/.test(l)) hits.push(`${at} network API`);
    if (/@import\s+url\(/.test(l)) hits.push(`${at} remote stylesheet`);
  });
}
report('check:network', hits);
