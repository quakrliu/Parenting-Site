const fs = require("fs");
const path = require("path");
const BLOG_DIR = "C:/shu-guo/parenting-site/src/content/blog";
const linkMap = require("./linkdata.js");

function processFile(fileSlug, links) {
  const filePath = path.join(BLOG_DIR, fileSlug + ".md");
  if (!fs.existsSync(filePath)) return {slug:fileSlug,added:0,status:"NOT_FOUND"};
  let content = fs.readFileSync(filePath, "utf8");
  const fmEnd = content.indexOf("---", 3);
  if (fmEnd === -1) return {slug:fileSlug,added:0,status:"NO_FM"};
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
      if (lastOpen > lastClose) { idx = body.indexOf(phrase, idx + phrase.length); continue; }
      body = body.slice(0, idx) + mdLink + body.slice(idx + phrase.length);
      added++; break;
    }
  }
  if (added > 0) fs.writeFileSync(filePath, frontmatter + body, "utf8");
  return {slug:fileSlug,added,status:added>0?"OK":"NO_MATCH"};
}

let total = 0, modified = 0;
for (const [slug, links] of Object.entries(linkMap)) {
  const r = processFile(slug, links);
  console.log(r.status + " " + r.slug + ": +" + r.added);
  if (r.status === "OK") { modified++; total += r.added; }
}
console.log("");
console.log("SUMMARY: " + total + " links added across " + modified + " files");
