/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// CODE-R24: restrictive CSP in the built page (dev keeps Vite's inline HMR preamble working).
const csp: Plugin = {
  name: 'skillcloud-csp',
  apply: 'build',
  transformIndexHtml(html) {
    const policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
    return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}">`);
  },
};

export default defineConfig({
  plugins: [react(), csp],
  build: { sourcemap: true, reportCompressedSize: true },
  test: { include: ['src/**/*.unit.ts'], environment: 'node' },
});
