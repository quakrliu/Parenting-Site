#!/usr/bin/env node
/**
 * Generate PDF versions of the free ebooks by rendering the /read/ pages
 * with Puppeteer and printing to PDF.
 *
 * Usage:
 *   # 1. Install puppeteer (only once, ~170MB chromium download):
 *   npm install --save-dev puppeteer
 *
 *   # 2. Start the dev server (or use prod):
 *   npm run dev    # runs on http://localhost:4321
 *
 *   # 3. In another terminal, generate PDFs:
 *   node scripts/generate-ebook-pdf.mjs
 *
 *   # Output:
 *   public/free-ebooks/toddler-meltdown-playbook-zh.pdf
 *   public/free-ebooks/toddler-meltdown-playbook-en.pdf
 *
 * Once generated, the PDFs will be served at:
 *   https://bloom-path.app/free-ebooks/toddler-meltdown-playbook-zh.pdf
 *   https://bloom-path.app/free-ebooks/toddler-meltdown-playbook-en.pdf
 *
 * Re-run this script whenever the /read/ page content changes.
 */

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve from /scripts → project root
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const outputDir = resolve(projectRoot, 'public', 'free-ebooks');

// Default base URL — override with env: BASE_URL=https://bloom-path.app
const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

const ebooks = [
  {
    lang: 'zh',
    url: `${BASE_URL}/zh/free/toddler-meltdown-playbook/read/`,
    output: 'toddler-meltdown-playbook-zh.pdf',
    title: '幼兒情緒崩潰 90 秒應對劇本',
  },
  {
    lang: 'en',
    url: `${BASE_URL}/en/free/toddler-meltdown-playbook/read/`,
    output: 'toddler-meltdown-playbook-en.pdf',
    title: 'The 90-Second Toddler Meltdown Playbook',
  },
];

async function main() {
  // Lazy-load puppeteer so the script can be linted/parsed without it installed
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (err) {
    console.error('\n❌ puppeteer is not installed.');
    console.error('   Install it with: npm install --save-dev puppeteer');
    console.error('   (Chromium download is ~170MB — one-time install.)\n');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created ${outputDir}`);
  }

  console.log(`\n🎨 Generating ebook PDFs from ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;
  let failCount = 0;

  for (const ebook of ebooks) {
    console.log(`→ ${ebook.lang.toUpperCase()}: ${ebook.title}`);
    console.log(`  URL: ${ebook.url}`);

    try {
      const page = await browser.newPage();

      // Emulate print media so @media print CSS kicks in
      await page.emulateMediaType('print');

      // Set viewport to A4 dimensions at 96 DPI for consistent rendering
      await page.setViewport({ width: 1024, height: 1400, deviceScaleFactor: 2 });

      // Navigate
      const response = await page.goto(ebook.url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status() || 'unknown'} fetching ${ebook.url}`);
      }

      // Wait for fonts to load
      await page.evaluateHandle('document.fonts.ready');

      // Generate PDF
      const outputPath = resolve(outputDir, ebook.output);
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '18mm',
          right: '18mm',
        },
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 8px; color: #8E8780; padding: 0 12mm; width: 100%; text-align: right;">
            <span>BloomPath · ${ebook.title}</span>
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 8px; color: #8E8780; padding: 0 12mm; width: 100%; display: flex; justify-content: space-between;">
            <span>bloom-path.app</span>
            <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
          </div>
        `,
      });

      await page.close();
      console.log(`  ✅ Saved → ${outputPath}\n`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}\n`);
      failCount++;
    }
  }

  await browser.close();

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Done. ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Output: ${outputDir}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
