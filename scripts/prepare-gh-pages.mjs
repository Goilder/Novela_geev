import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const browserDir = resolve('dist', 'novela', 'browser');
const indexFile = resolve(browserDir, 'index.html');
const notFoundFile = resolve(browserDir, '404.html');
const noJekyllFile = resolve(browserDir, '.nojekyll');

if (!existsSync(indexFile)) {
  throw new Error(`Build output not found: ${indexFile}`);
}

copyFileSync(indexFile, notFoundFile);
writeFileSync(noJekyllFile, '');
console.log(`Created GitHub Pages SPA fallback: ${notFoundFile}`);
console.log(`Created GitHub Pages marker: ${noJekyllFile}`);
