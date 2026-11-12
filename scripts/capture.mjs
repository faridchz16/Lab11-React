#!/usr/bin/env node
/*
 * Screenshot helper for the lab evidence (Evidencias_lab11/).
 *
 * Playwright is NOT a project dependency. Run the script through npx so it is
 * downloaded on demand (first time only: `npx -y playwright@1.56.1 install chromium`):
 *
 *   npx -y -p playwright@1.56.1 node scripts/capture.mjs [options]
 *
 * Options (actions run in the order they are written):
 *   --url <path|url>       Page to open (default http://localhost:5173/).
 *   --out <file.png>       Output image (required).
 *   --full                 Capture the full scrollable page.
 *   --selector <css>       Capture only that element (otherwise the visible viewport).
 *   --mobile               Use a 390x844 mobile viewport (default 1440x900 desktop).
 *   --viewport <WxH>       Custom viewport, e.g. 1024x768.
 *   --storage <key=json>   Set a localStorage entry before the page loads (repeatable).
 *   --click <css>          Click an element (repeatable).
 *   --type <css=text>      Type text into an element, key by key (repeatable).
 *   --fill <css=text>      Fill an element at once (repeatable).
 *   --press <key>          Press a key, e.g. Enter or Escape (repeatable).
 *   --hover <css>          Hover an element (repeatable).
 *   --wait <css>           Wait until an element is visible, e.g. a toast (repeatable).
 *   --wait-text <text>     Wait until some text is visible (repeatable).
 *   --sleep <ms>           Pause, e.g. to let a debounce or animation finish (repeatable).
 *   --eval <js>            Run JavaScript in the page (repeatable). Only for forcing states
 *                          during a capture; production code is never changed.
 *   --console <file.txt>   Save the browser console messages and page errors to a file.
 *   --delay <ms>           Typing delay per key for --type (default 120).
 *
 * Example:
 *   npx -y -p playwright@1.56.1 node scripts/capture.mjs --mobile \
 *     --type "input[type=search]=marte" --sleep 400 \
 *     --out Evidencias_lab11/05_busqueda.png --console Evidencias_lab11/05_consola.txt
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { delimiter, dirname, join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const BASE_URL = 'http://localhost:5173/';
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const ACTIONS = new Set([
  'click', 'type', 'fill', 'press', 'hover', 'wait', 'wait-text', 'sleep', 'eval',
]);

function parseArgs(argv) {
  const options = { url: BASE_URL, viewport: DESKTOP, storage: [], steps: [], delay: 120 };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i].replace(/^--/, '');
    const needsValue = !['full', 'mobile', 'help'].includes(flag);
    const value = needsValue ? argv[++i] : true;
    if (needsValue && value === undefined) fail(`Missing value for --${flag}`);

    if (ACTIONS.has(flag)) options.steps.push({ action: flag, value });
    else if (flag === 'storage') options.storage.push(splitPair(value, 'storage'));
    else if (flag === 'mobile') options.viewport = MOBILE;
    else if (flag === 'viewport') {
      const [width, height] = value.split('x').map(Number);
      options.viewport = { width, height };
    } else if (['url', 'out', 'selector', 'console'].includes(flag)) options[flag] = value;
    else if (flag === 'full') options.full = true;
    else if (flag === 'delay') options.delay = Number(value);
    else if (flag === 'help') options.help = true;
    else fail(`Unknown option --${flag}`);
  }
  return options;
}

/* Splits "<left>=<right>" at the first "=" outside [brackets], so CSS attribute selectors work. */
function splitPair(text, name) {
  let depth = 0;
  let index = -1;
  for (let i = 0; i < text.length && index < 0; i += 1) {
    if (text[i] === '[') depth += 1;
    else if (text[i] === ']') depth -= 1;
    else if (text[i] === '=' && depth === 0) index = i;
  }
  if (index < 1) fail(`--${name} expects <left>=<right>, got "${text}"`);
  return [text.slice(0, index), text.slice(index + 1)];
}

function fail(message) {
  console.error(`capture: ${message}`);
  process.exit(1);
}

/* Finds Playwright in the npx cache, since it is not installed in the project. */
async function loadPlaywright() {
  const candidates = [];
  for (const entry of (process.env.PATH ?? '').split(delimiter)) {
    if (entry.endsWith(join('node_modules', '.bin'))) candidates.push(dirname(entry));
  }
  try {
    const npxCache = join(execSync('npm config get cache').toString().trim(), '_npx');
    for (const hash of readdirSync(npxCache)) candidates.push(join(npxCache, hash, 'node_modules'));
  } catch {
    // No npx cache yet: fall through to the error below.
  }
  for (const modules of candidates) {
    if (existsSync(join(modules, 'playwright', 'package.json'))) {
      return createRequire(join(modules, 'noop.js'))('playwright');
    }
  }
  fail('Playwright not found. Run: npx -y playwright@1.56.1 install chromium');
}

async function runStep(page, { action, value }, delay) {
  switch (action) {
    case 'click':
      return page.locator(value).first().click();
    case 'hover':
      return page.locator(value).first().hover();
    case 'type': {
      const [selector, text] = splitPair(value, 'type');
      return page.locator(selector).first().pressSequentially(text, { delay });
    }
    case 'fill': {
      const [selector, text] = splitPair(value, 'fill');
      return page.locator(selector).first().fill(text);
    }
    case 'press':
      return page.keyboard.press(value);
    case 'wait':
      return page.locator(value).first().waitFor({ state: 'visible', timeout: 10000 });
    case 'wait-text':
      return page.getByText(value).first().waitFor({ state: 'visible', timeout: 10000 });
    case 'sleep':
      return page.waitForTimeout(Number(value));
    case 'eval':
      return page.evaluate(value);
    default:
      return undefined;
  }
}

/* Scrolls through the page so lazy images load, waits for them, then returns to the top. */
async function loadLazyImages(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((done) => setTimeout(done, ms));
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await pause(100);
    }
    await Promise.all(
      Array.from(document.images, (image) => {
        if (image.complete) return null;
        return new Promise((done) => {
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
        });
      }),
    );
    window.scrollTo({ top: 0, behavior: 'instant' });
    await pause(100);
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || !options.out) {
    console.log('Usage: npx -y -p playwright@1.56.1 node scripts/capture.mjs --out <file.png> [options]');
    console.log('See the header of scripts/capture.mjs for every option.');
    process.exit(options.help ? 0 : 1);
  }

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: options.viewport,
    deviceScaleFactor: 1,
    isMobile: options.viewport.width < 600,
    hasTouch: options.viewport.width < 600,
  });

  if (options.storage.length > 0) {
    await context.addInitScript((entries) => {
      for (const [key, value] of entries) window.localStorage.setItem(key, value);
    }, options.storage);
  }

  const page = await context.newPage();
  const logs = [];
  page.on('console', (message) => logs.push(`[${message.type()}] ${message.text()}`));
  page.on('pageerror', (error) => logs.push(`[pageerror] ${error.message}`));

  const url = new URL(options.url, BASE_URL).href;
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    for (const step of options.steps) await runStep(page, step, options.delay);

    const out = resolve(options.out);
    mkdirSync(dirname(out), { recursive: true });
    if (options.selector) {
      await page.locator(options.selector).first().screenshot({ path: out });
    } else {
      if (options.full) await loadLazyImages(page);
      await page.screenshot({ path: out, fullPage: Boolean(options.full) });
    }
    console.log(`Saved ${options.out}`);
  } finally {
    if (options.console) {
      const file = resolve(options.console);
      mkdirSync(dirname(file), { recursive: true });
      const header = `# Console of ${url} (${options.viewport.width}x${options.viewport.height})\n`;
      writeFileSync(file, header + (logs.length ? logs.join('\n') : '(no messages)') + '\n');
      console.log(`Saved ${options.console} (${logs.length} messages)`);
    }
    await browser.close();
  }
}

main().catch((error) => fail(error.message));
