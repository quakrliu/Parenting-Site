/**
 * IndexNow submission script for bloom-path.app
 * Submits all sitemap URLs to Bing/Yandex via IndexNow protocol.
 * Run automatically after build via "postbuild" npm script.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../dist');

const INDEXNOW_KEY = 'ef3e58a9-3488-4e40-bbcc-23bcdcf72ba6';
const HOST = 'bloom-path.app';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const API_ENDPOINT = 'https://api.indexnow.org/indexnow';

function extractUrls(xmlContent) {
  const matches = xmlContent.matchAll(/<loc>([^<]+)<\/loc>/g);
  return [...matches].map(m => m[1].trim());
}

function readSitemapUrls() {
  const urls = [];
  const files = readdirSync(DIST_DIR).filter(f => f.startsWith('sitemap') && f.endsWith('.xml') && !f.includes('index'));
  for (const file of files) {
    const content = readFileSync(join(DIST_DIR, file), 'utf-8');
    urls.push(...extractUrls(content));
  }
  // Only include URLs belonging to this host
  const hostUrls = [...new Set(urls)].filter(u => u.startsWith(`https://${HOST}/`));
  return hostUrls;
}

async function submitBatch(urlList) {
  const body = JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList });
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });
  return res.status;
}

async function main() {
  console.log('[IndexNow] Reading sitemap URLs...');
  const urls = readSitemapUrls();
  console.log(`[IndexNow] Found ${urls.length} URLs to submit`);

  if (urls.length === 0) {
    console.log('[IndexNow] No URLs found — skipping submission');
    return;
  }

  // IndexNow allows up to 10,000 URLs per request
  const BATCH_SIZE = 9000;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`[IndexNow] Submitting batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} URLs...`);
    try {
      const status = await submitBatch(batch);
      if (status === 200 || status === 202) {
        console.log(`[IndexNow] Batch accepted (HTTP ${status})`);
      } else if (status === 422) {
        console.warn(`[IndexNow] Invalid URLs in batch (HTTP 422) — check sitemap`);
      } else if (status === 429) {
        console.warn(`[IndexNow] Rate limited (HTTP 429) — too many requests today`);
      } else {
        console.warn(`[IndexNow] Unexpected response: HTTP ${status}`);
      }
    } catch (err) {
      console.error(`[IndexNow] Network error: ${err.message}`);
    }
  }

  console.log('[IndexNow] Done.');
}

main();
