// Rebuilds booklet/programme-booklet.pdf from booklet/index.html (A5, one page per booklet page).
// Needs the `playwright` package; set CHROMIUM_PATH to use a specific Chromium.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = pathToFileURL(path.join(root, 'booklet', 'index.html')).href + '?print';
const out = path.join(root, 'booklet', 'programme-booklet.pdf');

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.goto(src, { waitUntil: 'load' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, width: '148mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('Wrote', out);
