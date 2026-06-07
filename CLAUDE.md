<!-- QR:START -->
**App**: 育見未來 BloomPath（bloom-path.app）
**類型**: Web App (Astro 6 + MDX, multilingual)
**描述**: BloomPath 的部落格 + iOS app landing page。台灣 + 北美華人 + 英文圈三市場 SEO 漏斗，把流量導進 Newsletter 跟 App Pro 訂閱。
**技術棧**: Astro 6 · Vanilla CSS（landing）+ Tailwind 4（blog）· i18n (zh/en) · Cloudflare Pages Functions
**資料庫**: 無
**外部服務**: Beehiiv（Newsletter）· GA4 · YouTube @bloompath · App Store · Gumroad（規劃中）
**狀態**: 🟡 開發中（M1 of 6-month monetization roadmap）
<!-- QR:END -->

# BloomPath Parenting Site — Project Rules

## 商業背景（永遠記住）

- **目標**：18-36 個月內穩定賺 **$10K AUD/月 = NT$210K/月**
- **路徑**：不靠單一 iOS App，靠 **7 個 monetization bucket 並行**
- **完整計畫**：見 `docs/monetization-roadmap.md`（必讀，每次 session 開始前自己讀過）
- **目前現況**：日下載 < 3、Newsletter < 10、Blog 320 篇但 UV 低、GA4 剛裝
- **Runway**：~6 個月（建議搭 consulting bridge 延長到 24-36 個月）

## 創辦人（真實 framing — 詳見 `docs/brand/positioning.md`）

**Ethan 跟 Mei 都是 AI 角色（cartoon avatar），背後是真實家長**。為了保護孩子隱私，所有對外露出用 AI 角色呈現。所有 marketing / content 必須遵守 `docs/brand/positioning.md` 的 truth boundaries。

- **Ethan**：真實 BloomPath 創辦人的 AI 化身。軟體工程師（10+ 年）· 實戰爸爸 · 自學整合 AI 技術做 BloomPath。**禁用**：矽谷、AI/ML 學位 / 職歷、全職奶爸、具體育兒年數。
- **Mei**：真實家長（Ethan 太太）的 AI 化身。實戰媽媽 · 蒙特梭利小學家長 · 自學 Montessori 與正向教養。**禁用**：蒙特梭利老師 / 教師 / educator、6 年教學經驗、學位 / 證照、具體育兒年數。
- **Luna**：真實女兒的 AI 化身。**禁用**：任何具體年齡（如「11 歲」「4 歲」「2.5 歲」）、Luna 自己發言。可作為品牌靈感來源帶過。
- **landing page 規則**：使用 AI 角色（Mei + Ethan）視覺即可，但**必須在 footer + about page 公開揭露 AI 角色**。**禁用** stock photo 西方家庭照（`about-family.jpg`, `hero-family.jpg` 等）。

## Auto-Reiterate 規則（**最重要**）

使用者明確要求：「持續不斷主動提醒我還可以做什麼來加速賺錢速度」。

**每次 session 我必須主動做的事**（不需使用者提醒）：

1. **Session 開始時**：讀 `docs/monetization-roadmap.md` 的「進度追蹤」段，告訴使用者：
   - 目前在 M1-M6 的哪一個月、哪一週
   - 上次離開時做到哪一步
   - 接下來 1-2 個最該做的具體動作

2. **每次完成一個任務後**（不管是改 code、寫文案、設計頁面）：
   - 主動提示：「這個成果還可以怎麼用？」
   - 給出 **2-3 個延伸 leverage 點**（CLAUDE.md 全域的 Data Leverage 規則）
   - 如果是 monetization 相關，直接指向 roadmap 的下一步

3. **每週至少一次**（如果 session 跨週）：
   - Review 上週進度
   - 對齊月度目標
   - 提示是否落後 / 需要 pivot

4. **看到可加速的機會時**：
   - 不等使用者問，主動提
   - 例如：blog post 寫完 → 主動建議「這篇要不要做成 lead magnet ebook？」
   - 例如：YouTube 影片上線 → 主動建議「描述欄要不要加 free ebook 的 CTA？」

## 技術規則

### Landing page（`/zh/app/`, `/en/app/`）
- **純 vanilla CSS**（`src/styles/landing.css`），不依賴 Tailwind class
- 強制 `color-scheme: light` + `html:has(.landing-root) body` 強制 cream 背景
- 每個 `<a>` 必須自己設 color（不繼承），避免 specificity 衝突

### Blog（`/zh/blog/`, `/en/blog/`）
- Tailwind 4 + 既有 global.css
- 每篇文章必有 `ageGroup` frontmatter（影響 age navigator 篩選）
- Pinyin slug 已 rename，301 重導見 `public/_redirects`

### Deployment
- GitHub `quakrliu/Parenting-Site` push 後 Cloudflare Pages 自動 deploy
- 環境變數：`BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `PUBLIC_GA4_ID`
- IndexNow 自動 ping 在 `scripts/indexnow.mjs`（build 後跑）

### 測試完成才算完成（全域規則）
- 改完 landing page 必須開瀏覽器（dark mode + light mode）看過
- 改完 Cloudflare Function 必須實際發 request 確認 200
- TypeScript / build pass ≠ 功能正常

## 行銷誠信規則（**底線**）

- **不可使用 AI 生成的人像照片冒充創辦人或真實用戶**
- 截圖必須是 App 內真實畫面
- 廣告 before/after 必須有時間戳
- 數據引用必須能驗證來源（例如「1,247 個家庭」必須真的有 1,247 個 newsletter / waitlist）

## 不做清單

- ❌ Printables（Etsy + Pinterest 通路沒做，CP 值低）
- ❌ 純翻譯式 i18n（每個市場文案要在地化）
- ❌ Dark pattern 訂閱漏斗（學 Glam Up 的反面教材）
- ❌ 在沒 traffic 時開付費社群（必死）
- ❌ AI 生成「假家長見證」（trust killer）
