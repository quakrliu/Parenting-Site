/**
 * Infer ageGroup frontmatter for blog posts that lack it.
 *
 * Strategy: keyword match against filename + content (lowercased).
 * Outputs dry-run by default — pass --write to apply changes.
 *
 * Usage:
 *   node scripts/infer-age-group.mjs              # dry-run
 *   node scripts/infer-age-group.mjs --write      # write to .md files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');
const WRITE_MODE = process.argv.includes('--write');

// Multi-age content (parenting philosophy, policy, trends) → ['all']
const UNIVERSAL_KEYWORDS = [
  'parenting-trends',
  'cycle-breaking',
  'hybrid-parenting',
  'gentle-parenting-burnout',
  'gentle-parenting-montessori-boundaries',
  'how-to-stop-yelling',
  'parental-burnout',
  'parental-phubbing',
  'aap-screen-time-guidelines',
  'taiwan-birth-subsidy',
  'taiwan-children-wellbeing',
  'sunlight-child-development',
  'unstructured-play-benefits',
  'bedtime-reading',
  'best-bilingual-learning-apps',
  'analog-childhood',
  'grandparent-parenting-conflict',
  'daddy-role-in-parenting',
];

const AGE_KEYWORDS = {
  infant: [
    'newborn', 'infant', 'breastfeeding', '嬰兒',
    'baby-formula', 'formula-recall', 'baby-nutrition', 'baby-product',
    'postpartum', '產後',
    '0-1',
  ],
  toddler: [
    'toddler', 'tantrum', 'meltdown', '學步', '幼兒',
    'wont-brush', 'wont-share', 'wont-sit', 'wont-clean', 'wont-get-dressed',
    'biting', 'hitting', 'morning-routine', 'sleep-regression',
    'gentle-sleep-training', 'hates-hair-washing', 'refuses-medicine',
    'wakes-every-2-hours', 'bedtime-fears', 'afraid-of-dark',
    'clingy', 'wfh-clingy', 'parent-preference', 'only-wants-mommy',
    'potty-training', 'refuses-nap', 'practical-life',
    '2-year', '3-year', '1-3',
  ],
  preschool: [
    'preschool', 'kindergarten', '學齡前', '幼兒園',
    'picky-eater', 'playground', 'siblings', 'separation-anxiety',
    'imaginative', 'power-struggle', 'emotional-intelligence',
    'teaching-emotions', 'positive-discipline-strong-willed',
    'lighthouse-parenting', 'taipei-montessori', 'taiwan-montessori',
    'montessori-schools', 'kindergarten-readiness', 'kindergarten-guide',
    'bilingual-4-year', 'why-toddler-lies', 'practical-life',
    'executive-function', 'sel-casel', 'tuition',
    '4-year', '5-year', '3-6',
  ],
  school: [
    'school-age', 'screen-time-rules-school', '6-12',
    'children-internet-safety', 'screen-time-2026-guide',
    'siblings-fighting',
  ],
  teen: [
    'teen', 'adolescent', '青少年', 'teenager',
    'australia-teen', 'teen-mental-health', 'teen-communication',
    'teen-not-wanting-school', 'teen-social-media',
    '12-18',
  ],
};

function inferAgeGroups(filename, _content) {
  // Match only against filename — content matching is too aggressive
  // (e.g. articles reference "gentle parenting" or "teen" in passing).
  const fileLower = filename.toLowerCase();

  for (const kw of UNIVERSAL_KEYWORDS) {
    if (fileLower.includes(kw.toLowerCase())) {
      return ['all'];
    }
  }

  const matched = [];
  for (const [age, keywords] of Object.entries(AGE_KEYWORDS)) {
    if (keywords.some((kw) => fileLower.includes(kw.toLowerCase()))) {
      matched.push(age);
    }
  }

  return matched.length ? matched : ['all'];
}

function hasAgeGroup(content) {
  return /^ageGroup:/m.test(content);
}

function insertAgeGroup(content, ageGroup) {
  const yaml = `ageGroup: [${ageGroup.map((a) => `"${a}"`).join(', ')}]`;
  const lines = content.split('\n');
  let firstDash = -1;
  let secondDash = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (firstDash === -1) firstDash = i;
      else { secondDash = i; break; }
    }
  }
  if (secondDash === -1) return null;
  lines.splice(secondDash, 0, yaml);
  return lines.join('\n');
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

const stats = {
  total: files.length,
  hasAg: 0,
  byAge: { infant: 0, toddler: 0, preschool: 0, school: 0, teen: 0, all: 0, multi: 0 },
};

const results = [];

for (const file of files) {
  const filepath = join(BLOG_DIR, file);
  const content = readFileSync(filepath, 'utf8');

  if (hasAgeGroup(content)) {
    stats.hasAg++;
    continue;
  }

  const ages = inferAgeGroups(file, content);
  results.push({ file, ages });

  if (ages.length === 1) stats.byAge[ages[0]]++;
  else stats.byAge.multi++;
}

results.sort((a, b) => {
  const aKey = a.ages.join(',');
  const bKey = b.ages.join(',');
  if (aKey !== bKey) return aKey.localeCompare(bKey);
  return a.file.localeCompare(b.file);
});

console.log(`\nTotal .md: ${stats.total}  |  Has ageGroup: ${stats.hasAg}  |  To infer: ${results.length}\n`);

for (const { file, ages } of results) {
  const tag = `[${ages.join(', ')}]`.padEnd(32);
  console.log(`  ${tag} ${file}`);
}

console.log(`\nBreakdown of inferred:`);
console.log(`  infant     : ${stats.byAge.infant}`);
console.log(`  toddler    : ${stats.byAge.toddler}`);
console.log(`  preschool  : ${stats.byAge.preschool}`);
console.log(`  school     : ${stats.byAge.school}`);
console.log(`  teen       : ${stats.byAge.teen}`);
console.log(`  all        : ${stats.byAge.all}`);
console.log(`  multi-age  : ${stats.byAge.multi}`);

if (WRITE_MODE) {
  let written = 0;
  const errors = [];
  for (const { file, ages } of results) {
    const filepath = join(BLOG_DIR, file);
    const content = readFileSync(filepath, 'utf8');
    const updated = insertAgeGroup(content, ages);
    if (updated === null) {
      errors.push(file);
      continue;
    }
    writeFileSync(filepath, updated);
    written++;
  }
  console.log(`\n✓ Wrote ageGroup to ${written} files.`);
  if (errors.length) {
    console.log(`✗ Could not parse frontmatter for:`);
    errors.forEach((f) => console.log(`  ${f}`));
  }
} else {
  console.log(`\n(Dry-run. Pass --write to apply.)`);
}
