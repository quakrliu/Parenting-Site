const fs = require("fs");
const path = require("path");
const BLOG_DIR = "C:/shu-guo/parenting-site/src/content/blog";

// Articles still at <3 links after third pass
// Using phrases verified from body inspection
const linkMap = {
  // aap has 正向教養 inside existing link anchor text - try different phrase
  "aap-screen-time-guidelines-2026": [
    ["就寢前", "0-6歲發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  // baby-nutrition already has child-development-milestones-zh, try different target
  "baby-nutrition-health-guide-zh": [
    ["嬰兒", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // bedtime-reading-zh already has montessori-at-home and child-development, need different
  "bedtime-reading-empathy-creativity-zh": [
    ["品質", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  // child-development-en already has screen-time and toddler-meltdowns, need Montessori or positive
  "child-development-milestones-en": [
    ["language", "positive parenting guide", "positive-parenting-guide-en", "en"]
  ],
  // child-development-zh has montessori-home-environment, need different target
  "child-development-milestones-zh": [
    ["發展", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // children-internet-en has australia and screen-time, no 'parenting' alone
  "children-internet-safety-2026-en": [
    ["parent", "positive parenting complete guide", "positive-parenting-guide-en", "en"]
  ],
  // children-internet-zh has aap and zh-teen, need different
  "children-internet-safety-2026-zh": [
    ["孩子的", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  // gentle-parenting-en has 'gentle parenting and Montessori' and 'gentle parenting complete guide' inside links
  "gentle-parenting-burnout-empathy-limits-en": [
    ["exhausted", "parental burnout solutions", "parental-burnout-solutions-2026", "en"]
  ],
  // gentle-sleep-training-zh has montessori-at-home and child-development - need different
  "gentle-sleep-training-montessori-zh": [
    ["孩子", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  // hybrid has montessori-at-home and positive-parenting-guide-zh - already 3!
  // kindergarten-guide-taiwan has montessori-at-home and montessori-national - already 3!
  // kindergarten-readiness has kindergarten-guide and child-development - already 3!
  // lighthouse has montessori-at-home and positive-parenting - already 3!
  // montessori-at-home-zh has montessori-home and children-internet
  "montessori-at-home-guide-zh": [
    ["孩子", "0-6歲發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  // montessori-home-env has montessori-at-home and aap
  "montessori-home-environment-zh": [
    ["孩子", "幼兒發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  // montessori-national-zh has kindergarten-guide and child-development
  "montessori-national-study-2026-results-zh": [
    ["教育", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // parental-phubbing has positive-parenting-zh and aap
  "parental-phubbing-child-screen-addiction-zh": [
    ["孩子的螢幕", "兒童網路安全指南", "children-internet-safety-2026-zh", "zh"]
  ],
  // parenting-trends has children-internet-zh and child-development-zh
  "parenting-trends-2026-in-out": [
    ["教養", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  // positive-parenting-en has only toddler-meltdowns
  "positive-parenting-guide-en": [
    ["research", "Montessori national study 2026", "montessori-national-study-2026-results-en", "en"]
  ],
  // positive-parenting-zh has toddler-tantrum and gentle-parenting
  "positive-parenting-guide-zh": [
    ["界限", "家長職業倦怠指南", "parental-burnout-solutions-2026", "en"]
  ],
  // sunlight-zh has only child-development
  "sunlight-child-development-outdoors-zh": [
    ["蒙特梭利", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // taipei-montessori has kindergarten-guide and montessori-national
  "taipei-montessori-schools-2026-zh": [
    ["教育", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // toddler-meltdowns has child-development and positive-parenting-boundaries (custom)
  "toddler-meltdowns-montessori-en": [
    ["sleep", "toddler sleep regression guide", "toddler-sleep-regression-guide-en", "en"]
  ],
  // toddler-tantrum has positive-parenting-zh and child-development
  "toddler-tantrum-positive-parenting-zh": [
    ["界線", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
  ],
  // unstructured-play has child-development and montessori-at-home (twice in text)
  "unstructured-play-benefits-zh": [
    ["遊戲", "0-6歲發展里程碑", "child-development-milestones-zh", "zh"]
  ],
  // zh-teen has zh-teen-communication-script and child-development
  "zh-teen-not-wanting-school": [
    ["爸媽", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
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
