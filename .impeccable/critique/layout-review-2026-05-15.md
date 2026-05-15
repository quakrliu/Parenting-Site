# BloomPath Layout Review -- 2026-05-15

## Summary

The site has a solid visual foundation: brand colors consistent, typography scale well-defined, component hierarchy logical. Several structural issues undermine reading experience and conversion. Four most critical: (1) two regex escape bugs in BlogPost.astro cause wrong reading times and broken TOC anchor IDs on every post; (2) blog post content column has max-width 70ch but sits left-aligned in a 927px grid area; (3) five production-ready homepage components not assembled on either homepage -- AgeNavigator, TopicsSection, PhilosophyPillars, CommunitySection, DailyStickiness; (4) BooksSection uses hardcoded colors outside the CSS token system and shows English-only content on ZH homepage.

---

## A. Blog Post Page (BlogPost.astro)

### What Working
- Mobile TOC collapsible button with ARIA aria-expanded toggle is correct
- Desktop sticky TOC with scroll-spy IntersectionObserver is well-implemented
- TL;DR card detection via blockquote text content is functional
- Key Takeaway card wrapper injection is clean
- Mid-article CTA inserted at the 50% H2 mark is correct
- Prose styles are thorough: 1.8 line-height, 1.0625rem base, complete element coverage
- Table horizontal scroll with -webkit-overflow-scrolling: touch is correct

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| A1 | Content column not centered in grid area. blog-layout is main+sidebar at 1fr+240px. Main column is ~927px wide but .post-content max-width is 70ch (~672px), leaving 255px blank right-side space. Article reads left-aligned. | High | Add margin: 0 auto to .post-content, or move max-width: 70ch to .blog-main. |
| A2 | TOC sticky top offset is wrong. top: 5rem assumes header-only height. .app-banner (~40px) plus .site-header (~64px) = ~104px combined. TOC is partially obscured on scroll. | High | Change top: 5rem to top: 7rem. Define --header-height: 104px as a CSS variable. |
| A3 | Regex escape missing in reading time. EN: rawBody.trim().split(/s+/) uses literal s not backslash-s. ZH: rawBody.replace(/s+/g) same bug. Both reading times wildly incorrect on every post. | Critical | Fix both instances to /\s+/ in BlogPost.astro frontmatter. |
| A4 | Regex escape missing in TOC slug generation. Character class uses literal w and s not escaped word/space patterns. ZH headings produce malformed anchor IDs; in-page TOC links fail. | High | Fix character class to use escaped patterns: /[^\w\s-]/g and /\s+/g in the TOC script. |
| A5 | No scroll-margin-top on H2 elements. TOC anchor click scrolls H2 behind the sticky header (~104px). | High | Add scroll-margin-top: 7rem to .post-content h2 in BlogPost.astro styles. |
| A6 | Mobile TOC collapsed state renders margin-bottom: 1.5rem as dead space regardless of open/closed state. | Low | Reduce to margin-bottom: 0.75rem or apply only when .open class is present. |
| A7 | Mid-article CTA button can overflow on viewports narrower than ~360px. .mid-cta-btn has flex-shrink: 0 and white-space: nowrap. | Low | Add @media (max-width: 400px) rule to set width: 100% and justify-content: center on the button. |
| A8 | BookCTA 3-column grid collapses at 768px, but inside blog layout the article column is already narrower than 768px. BookCTA renders as 1-column on desktop inside blog posts. | Medium | Change .book-cta__grid breakpoint from 768px to 600px. |
| A9 | Images inside post content are capped at the 70ch column width. No breakout option for wide images. | Medium | Add .post-content img rule for width: 100%. Consider a .breakout utility class for images wider than the text column. |

---

## B. Blog Listing Page

### What Working
- Featured card switches from stacked to side-by-side at 768px correctly
- 3-section categorization (Popular / Guides / All) provides good hierarchy
- Topic filter buttons are prominent
- Post grid responsive: 1-col mobile, 2-col at 640px
- Featured label badge contrast (white on forest) is accessible

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| B1 | Post grid is 2-column maximum on all desktop sizes. On 1400px viewports the grid looks sparse. | Medium | Add @media (min-width: 1024px) to blog-index.css: .posts-grid { grid-template-columns: repeat(3, 1fr); }. |
| B2 | Featured image has fixed height: 240px on mobile. Portrait images squashed to short banner strip. | Medium | Change to aspect-ratio: 16/9 on the mobile image wrapper. |
| B3 | section-title hardcodes border-bottom: 2px solid #C4A882 instead of var(--color-orange). Breaks token system. | Low | Replace #C4A882 with var(--color-orange). |
| B4 | Empty state logic bug in All Articles. If allRemainingPosts is empty but total posts is not, section shows a dangling heading with neither a grid nor an empty-state message. | Medium | Show empty state whenever allRemainingPosts.length === 0 regardless of posts.length. |
| B5 | No pagination or load-more. All Articles becomes unusable at 50+ articles. | Medium | Add pagination or slice(0, 12) with Show more button. |

---

## C. Homepage

### What Working
- Section order is logical: Hero, Articles, Books, Podcast, Newsletter, About
- FeaturedArticles shows latest 6 posts filtered by language correctly
- EN and ZH homepages are structurally symmetrical

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| C1 | Five production-ready components are not on the homepage. AgeNavigator, TopicsSection, PhilosophyPillars, CommunitySection, and DailyStickiness are not imported or rendered on either en/index.astro or zh/index.astro. These represent major SEO depth and conversion surface. | Critical | Import and assemble on both homepages in order: Hero, AgeNavigator, FeaturedArticles, TopicsSection, PhilosophyPillars, DailyStickiness, BooksSection, CommunitySection, Newsletter, About. |
| C2 | BooksSection uses a different design language. It references --color-accent: #3d7a6b, --color-heading: #1a1a1a, --color-text-muted: #666, --color-border: #e5e0d8 -- none defined in global.css. Dark mode does not work for this section. | High | Replace all BooksSection internal variables with global tokens: --color-forest, --color-text, --color-text-light, --color-cream, --color-white. |
| C3 | BooksSection shows English-only book titles on the ZH homepage. The books array has no ZH strings. | High | Add ZH translations for all book titles, subtitles, and CTA text in BooksSection.astro. |
| C4 | Hero image hidden on tablet and mobile. .hero__aside has display: none below 1023px. Hero is pure text on phones. | Medium | Add a smaller app screenshot or decorative element visible below hero text on mobile. |
| C5 | BooksSection bakes horizontal padding into .books-section (padding: 5rem 1.5rem) instead of using .container. On wide screens this misaligns with other sections. | Medium | Remove horizontal padding from .books-section and wrap content in a .container div inside the component. |
| C6 | CommunitySection has a broken placeholder Discord link live in production: https://discord.gg/INVITE_LINK_HERE. | High | Replace with the actual Discord invite URL or remove the button. |

---

## D. Header

### What Working
- Sticky header with backdrop-filter blur is visually correct
- Mobile hamburger opens a full-width dropdown correctly
- ARIA aria-expanded on mobile toggle is correct
- Language switch pill is visually distinct and accessible

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| D1 | No CSS variable for combined header height. App banner (~40px) + site header (~64px) = ~104px total. Multiple components depend on this value (TOC top, scroll-margin-top, anchor offsets) but the dependency is implicit. | Medium | Define --header-height: 104px in global.css :root and reference it in .toc-sticky top, scroll-margin-top, and JS offset calculations. |
| D2 | Topic dropdown uses CSS :hover only. On tablets in landscape (768px+ with touch), tapping Topics navigates directly without showing the sub-items. | Medium | Add a click handler that toggles dropdown on tap separately from the CSS hover behavior. |
| D3 | Mobile menu uses inline JS style strings (nav.style.display, nav.style.padding, etc.) instead of CSS class toggles. Any CSS change to .main-nav requires parallel JS updates. | Low | Toggle a .nav--open class on the header and move all mobile open-state styles into CSS. |
| D4 | Mobile toggle touch target is ~32px (bar height + 4px padding each side). Below the 44x44px minimum. | Medium | Increase .mobile-toggle padding to 10px on all sides. |

---

## E. Footer

### What Working
- Dark footer with correct brand color
- Two-column link organization is clean
- Responsive grid at 768px is correct
- Tagline max-width: 32ch is well-chosen

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| E1 | Footer anchor links (#categories, #tools) point to IDs that do not exist on the homepage. These links navigate to the homepage but scroll nowhere. | Medium | Add id=categories to TopicsSection and id=tools to the tools area on the homepage, or update hrefs to actual route paths like /en/tools/milestone-checker. |
| E2 | Footer margin-top: 6rem is unconditional. On blog post pages this stacks with post-nav bottom margin creating excessive whitespace. | Low | Use padding-bottom on main elements instead of margin-top on the footer. |
| E3 | On wide screens the footer brand and links columns are equal width (1fr each). The logo/tagline block does not need 700px of width. | Low | Add @media (min-width: 1024px): .footer-inner { grid-template-columns: 1.5fr 1fr; }. |

---

## F. Topic Pages

### What Working
- Pillar card with gradient background is visually distinctive
- Section hierarchy (Complete Guide then All Articles) is clear
- ZH and EN versions have good structural parity

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| F1 | No breadcrumb navigation. Users arriving from search have no visible path hierarchy beyond the header. | Medium | Add a breadcrumb: Home > Topics > Montessori above .topic-header. |
| F2 | Hardcoded hex colors throughout topic page styles. color: #8D9B8E and color: #C4A882 appear multiple times. Dark mode will not adapt. | Medium | Replace all hardcoded hex with var(--color-forest) and var(--color-orange). |
| F3 | Identical style blocks duplicated in every topic file. EN and ZH montessori pages share byte-for-byte identical styles. Same duplication in positive-parenting pages. | Low | Extract to src/styles/topic-page.css and import, same pattern as blog-index.css. |
| F4 | Topic page post cards have no image. Blog listing shows images; topic pages show only date, title, description. Visual inconsistency. | Low | Add image rendering to topic page post cards. |
| F5 | topic-nav bottom links look like footnotes with no visual weight. | Low | Style as ghost buttons or pill links using the design system. |

---

## G. Responsive (Cross-page)

### Issues Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| G1 | Inconsistent breakpoints across the codebase. Six different values: 600px, 639px, 640px, 768px, 900px, 1023px/1024px. Mixed min-width and max-width approaches. | High | Standardize to three min-width breakpoints: sm (640px), md (768px), lg (1024px). Document in global.css as comments. |
| G2 | --max-width: 1400px in global.css but .blog-layout uses hardcoded max-width: 1200px. Homepage sections and blog posts have different max widths. | Medium | Define --max-width-content: 1200px as a second token, or align all layouts to one value. |
| G3 | Touch targets below 44px minimum. .back-link is ~22px tall (text only). .topic-link anchors have no padding. .mobile-toggle is ~32px. | Medium | Add min-height: 44px and padding: 0.75rem 0 to .back-link and .topic-link. Increase .mobile-toggle padding to 10px. |
| G4 | Dark mode partially implemented. global.css and BlogPost.astro have dark mode rules. BooksSection, topic pages, and Header use hardcoded hex values that will not adapt. | Medium | Resolved after fixing C2 and F2 by replacing hardcoded hex with CSS custom properties. |
| G5 | scroll-margin-top missing site-wide. Any anchor link targeting a page section scrolls content under the sticky header. | High | Add [id] { scroll-margin-top: 7rem; } to global.css as a baseline rule. |

---

## Priority Fix List (sorted by impact)

1. [A3] Fix regex escapes in reading time -- /s+/ to proper /\s+/ in both instances in BlogPost.astro. Reading time is wrong on every post in production.

2. [A4] Fix regex escapes in TOC slug generation. ZH TOC links produce broken anchor IDs causing in-page navigation to fail silently.

3. [C1] Assemble 5 missing homepage components -- AgeNavigator, TopicsSection, PhilosophyPillars, CommunitySection, DailyStickiness are all production-ready but not on the homepage. Highest-impact SEO and UX improvement available.

4. [A5 + G5] Add scroll-margin-top globally -- Add [id] { scroll-margin-top: 7rem; } to global.css. All TOC and anchor navigation currently obscured by sticky header.

5. [C6] Fix broken Discord link -- https://discord.gg/INVITE_LINK_HERE is live in production.

6. [A1] Center blog post content column -- Add margin: 0 auto to .post-content or move max-width: 70ch to .blog-main.

7. [A2] Fix TOC sticky top offset -- Change top: 5rem to top: 7rem.

8. [C2] Remap BooksSection to global CSS tokens -- 6 non-system color variables; dark mode broken for this section.

9. [C3] Add ZH book translations to BooksSection -- ZH homepage shows English-only content.

10. [G1] Standardize breakpoints -- Document sm/md/lg in global.css, eliminate mixed max-width and inconsistent values.

11. [E1] Fix footer anchor links -- Add id attributes to homepage sections or update hrefs to valid routes.

12. [D2] Fix topic dropdown for touch devices -- Add click handler alongside CSS hover.

13. [B1] Expand blog grid to 3-column on desktop -- 2-column max at all desktop widths.

14. [B4] Fix empty-state logic in All Articles -- Silent empty body when posts fill other buckets.

15. [G3] Fix touch target sizes -- .back-link and .topic-link are below the 44px minimum.

16. [B5] Add pagination or load-more to blog listing -- Will degrade as article count grows.

17. [F3] Extract topic page styles to shared CSS file -- Identical style blocks duplicated per file.

18. [D3] Refactor mobile menu to CSS class toggle -- JS inline style manipulation is fragile and hard to maintain.
