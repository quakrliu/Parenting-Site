const fs = require("fs");
const path = require("path");
const BLOG_DIR = "C:/shu-guo/parenting-site/src/content/blog";

// [phrase, linkText, targetSlug, lang]
// Only add 1 link per article to get it to 3+
const linkMap = {
  "aap-screen-time-guidelines-2026": [
    ["正向教養", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "baby-nutrition-health-guide-zh": [
    ["學步兒", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "bedtime-reading-benefits-empathy-creativity-en": [
    ["toddler", "toddler meltdowns guide", "toddler-meltdowns-montessori-en", "en"]
  ],
  "bedtime-reading-empathy-creativity-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "best-bilingual-learning-apps-2026": [
    ["螢幕", "兒童網路安全指南", "children-internet-safety-2026-zh", "zh"]
  ],
  "child-abuse-prevention-april-2026-zh": [
    ["孩子", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "child-development-milestones-en": [
    ["Montessori", "Montessori at home guide", "montessori-at-home-guide-en", "en"]
  ],
  "child-development-milestones-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "children-internet-safety-2026-en": [
    ["parenting", "positive parenting guide", "positive-parenting-guide-en", "en"]
  ],
  "children-internet-safety-2026-zh": [
    ["教養", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "daddy-role-in-parenting-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "en-montessori-pnas-research-2026": [
    ["social", "Montessori SEL and CASEL skills", "montessori-sel-casel-skills-en", "en"]
  ],
  "gentle-parenting-burnout-empathy-limits-en": [
    ["parental burnout", "parental burnout solutions", "parental-burnout-solutions-2026", "en"]
  ],
  "gentle-parenting-burnout-empathy-limits-zh": [
    ["倦怠", "家長職業倦怠指南", "parental-burnout-solutions-2026", "en"]
  ],
  "gentle-sleep-training-montessori-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "hybrid-parenting-2026-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "kindergarten-guide-taiwan-2026-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "kindergarten-readiness-complete-guide": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "lighthouse-parenting-montessori-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "montessori-at-home-guide-en": [
    ["sleep", "toddler sleep regression guide", "toddler-sleep-regression-guide-en", "en"]
  ],
  "montessori-at-home-guide-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "montessori-home-environment-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "montessori-national-study-2026-results-en": [
    ["social", "Montessori SEL and CASEL skills", "montessori-sel-casel-skills-en", "en"]
  ],
  "montessori-national-study-2026-results-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "montessori-sel-casel-skills-en": [
    ["toddler", "toddler meltdowns Montessori guide", "toddler-meltdowns-montessori-en", "en"]
  ],
  "parental-burnout-solutions-2026": [
    ["孩子", "孩子發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "parental-phubbing-child-screen-addiction-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "parenting-trends-2026-in-out": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "positive-parenting-guide-en": [
    ["Montessori", "Montessori at home guide", "montessori-at-home-guide-en", "en"]
  ],
  "positive-parenting-guide-zh": [
    ["孩子", "幼兒情緒與正向教養", "toddler-tantrum-positive-parenting-zh", "zh"]
  ],
  "postpartum-depression-complete-guide-2026": [
    ["父母", "家長職業倦怠", "parental-burnout-solutions-2026", "en"]
  ],
  "screen-time-2026-guide-en": [
    ["child", "children internet safety 2026", "children-internet-safety-2026-en", "en"]
  ],
  "sunlight-child-development-outdoors-zh": [
    ["孩子", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "taipei-montessori-schools-2026-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "taiwan-birth-subsidy-2026-complete-guide": [
    ["孩子", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "toddler-meltdowns-montessori-en": [
    ["positive parenting", "positive parenting guide", "positive-parenting-guide-en", "en"]
  ],
  "toddler-sleep-regression-guide-en": [
    ["parenting", "positive parenting guide", "positive-parenting-guide-en", "en"]
  ],
  "toddler-tantrum-positive-parenting-zh": [
    ["孩子", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  "unstructured-play-benefits-zh": [
    ["正向", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  "zh-teen-not-wanting-school": [
    ["孩子", "孩子發展里程碑", "child-development-milestones-zh", "zh"]
  ]
};

function processFile(fileSlug, links) {
  const filePath = path.join(BLOG_DIR, fileSlug + ".md");
  if (!fs.existsSync(filePath)) return { slug: fileSlug, added: 0, status: "NOT_FOUND" };
  let content = fs.readFileSync(filePath, "utf8");
  const fmEnd = content.indexOf("---", 3);
  if (fmEnd === -1) return { slug: fileSlug, added: 0, status: "NO_FM" };
  const frontmatter = content.slice(0, fmEnd + 3);
  let body = content.slice(fmEnd + 3);
  let added = 0;

  for (const [phrase, linkText, targetSlug, lang] of links) {
    if (targetSlug === fileSlug) continue;
    const linkUrl = "/" + lang + "/blog/" + targetSlug;
    const mdLink = "[" + linkText + "](" + linkUrl + ")";
    if (body.includes(lang + "/blog/" + targetSlug)) continue;
    let idx = body.indexOf(phrase);
    while (idx !== -1) {
      const before = body.slice(0, idx);
      const lastOpen = before.lastIndexOf("[");
      const lastClose = before.lastIndexOf("]");
      if (lastOpen > lastClose) {
        idx = body.indexOf(phrase, idx + phrase.length);
        continue;
      }
      body = body.slice(0, idx) + mdLink + body.slice(idx + phrase.length);
      added++;
      break;
    }
  }

  if (added > 0) fs.writeFileSync(filePath, frontmatter + body, "utf8");
  return { slug: fileSlug, added, status: added > 0 ? "OK" : "NO_MATCH" };
}

let total = 0, modified = 0;
for (const [slug, links] of Object.entries(linkMap)) {
  const r = processFile(slug, links);
  console.log(r.status + " " + r.slug + ": +" + r.added);
  if (r.status === "OK") { modified++; total += r.added; }
}
console.log("SUMMARY: " + total + " links added across " + modified + " files");
