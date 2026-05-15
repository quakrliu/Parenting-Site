const fs = require("fs");
const path = require("path");
const BLOG_DIR = "C:/shu-guo/parenting-site/src/content/blog";

const linkMap = {
  // gentle-sleep: use '產後憂鬱' or '睡眠剝奪' - neither in existing links
  "gentle-sleep-training-montessori-zh": [
    ["睡眠剝奪", "家長職業倦怠指南", "parental-burnout-solutions-2026", "en"]
  ],
  // sunlight: use '孩子帶出去' at pos 6490 which is free
  "sunlight-child-development-outdoors-zh": [
    ["帶出去", "蒙特梭利居家實踐", "montessori-at-home-guide-zh", "zh"]
  ],
  // toddler-tantrum: use '幼兒' which is free at pos 271
  "toddler-tantrum-positive-parenting-zh": [
    ["幼兒發脾氣", "幼兒睡眠退化指南", "toddler-sleep-regression-guide-en", "en"]
  ],
  // unstructured-play: use '心靈強壯' which should be free
  "unstructured-play-benefits-zh": [
    ["心靈強壯", "正向教養完整指南", "positive-parenting-guide-zh", "zh"]
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
