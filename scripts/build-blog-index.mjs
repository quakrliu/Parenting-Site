#!/usr/bin/env node
/**
 * Build blog-titles-index.json from all src/content/blog/*.md files.
 *
 * Why this exists:
 *   龐統 (Pang Tong) was reading every single blog .md file to (a) check
 *   for duplicate topics and (b) build internal links. With 320+ posts,
 *   that's ~40k tokens of overhead per run. This script writes a compact
 *   index (~50KB JSON) that the agent can read once for both purposes.
 *
 * Usage:
 *   node scripts/build-blog-index.mjs
 *
 * Output:
 *   data/blog-titles-index.json
 *
 * The output JSON should be committed. Re-run this script after publishing
 * a new article (or hook into the build).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'data');
const OUT_FILE = path.join(OUT_DIR, 'blog-titles-index.json');

/**
 * Naive YAML frontmatter parser — handles the small subset of YAML we use:
 *   - quoted strings:        title: "..."
 *   - simple keys:           pubDate: "2026-05-24"
 *   - JSON-style arrays:     tags: ["a", "b"]
 *   - booleans:              draft: false
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return null;

  const body = match[1];
  const data = {};

  for (const line of body.split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    let val = rawVal.trim();

    // Strip surrounding quotes (single or double)
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    // Array form: ["a", "b"] or ['a', 'b']
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        const arr = JSON.parse(val.replace(/'/g, '"'));
        data[key] = arr;
        continue;
      } catch {
        // fall through to raw string
      }
    }

    // Booleans
    if (val === 'true') {
      data[key] = true;
      continue;
    }
    if (val === 'false') {
      data[key] = false;
      continue;
    }

    data[key] = val;
  }

  return data;
}

/**
 * Convert a blog filename into a public URL.
 *   toddler-meltdown-in-public-zh.md  -> /zh/blog/toddler-meltdown-in-public-zh
 *   toddler-meltdown-in-public-en.md  -> /en/blog/toddler-meltdown-in-public-en
 * Falls back to inspecting frontmatter `lang` if filename suffix is missing.
 */
function buildUrl(slug, lang) {
  const langSegment = lang === 'zh-TW' || lang === 'zh' ? 'zh' : 'en';
  return `/${langSegment}/blog/${slug}`;
}

async function main() {
  const entries = await fs.readdir(BLOG_DIR);
  const mdFiles = entries.filter((f) => f.endsWith('.md'));

  const posts = [];
  let skipped = 0;
  let drafts = 0;

  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(BLOG_DIR, file);
    let content;
    try {
      content = await fs.readFile(fullPath, 'utf8');
    } catch (err) {
      console.warn(`[skip] cannot read ${file}: ${err.message}`);
      skipped++;
      continue;
    }

    const fm = parseFrontmatter(content);
    if (!fm) {
      console.warn(`[skip] no frontmatter: ${file}`);
      skipped++;
      continue;
    }

    if (fm.draft === true) {
      drafts++;
      continue;
    }

    posts.push({
      slug,
      lang: fm.lang || (slug.endsWith('-en') ? 'en' : 'zh-TW'),
      title: fm.title || '',
      description: fm.description || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      ageGroup: Array.isArray(fm.ageGroup) ? fm.ageGroup : [],
      pubDate: fm.pubDate || '',
      author: fm.author || '',
      youtubeId: fm.youtubeId || null,
      url: buildUrl(slug, fm.lang),
    });
  }

  // Sort: newest pubDate first (helps the agent grab recent context)
  posts.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));

  const out = {
    generated: new Date().toISOString(),
    counts: {
      total: posts.length,
      en: posts.filter((p) => p.lang === 'en').length,
      zh: posts.filter((p) => p.lang === 'zh-TW' || p.lang === 'zh').length,
      drafts,
      skipped,
    },
    posts,
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2));

  console.log(`✓ Wrote ${OUT_FILE}`);
  console.log(`  ${out.counts.total} posts (${out.counts.en} EN, ${out.counts.zh} ZH)`);
  if (drafts) console.log(`  ${drafts} drafts skipped`);
  if (skipped) console.log(`  ${skipped} files skipped (parse error)`);

  const sizeKB = (JSON.stringify(out).length / 1024).toFixed(1);
  console.log(`  ~${sizeKB} KB on disk`);
}

main().catch((err) => {
  console.error('build-blog-index failed:', err);
  process.exit(1);
});
