# Beehiiv Welcome Sequence 設定教學

> 給使用者：照著這份 step-by-step 設定中文 + 英文兩條 welcome sequence。
> 預估時間：**中文 30-45 分鐘 + 英文 30-45 分鐘 = 共 1 小時**。
> 來源檔案：
> - `docs/email-sequences/welcome-ebook-meltdown-zh.md`
> - `docs/email-sequences/welcome-ebook-meltdown-en.md`

---

## 🎯 大方向：你要做什麼

```
Landing page 表單（已上線）
       ↓
   送出 email
       ↓
   API → Beehiiv（utm_source = free-ebook-meltdown-zh 或 -en）
       ↓
   Beehiiv 自動化判斷 source
       ↓
   觸發對應的 7 封 email sequence（zh 或 en）
       ↓
   14 天後加入 weekly Thursday cadence
```

**Beehiiv 不會自動分中英文** — 你要建 2 個 automation，trigger condition 不同。

---

## Part 1：中文 Welcome Sequence 設定

### Step 1 — 登入 Beehiiv 後台
https://app.beehiiv.com → 你的 publication（育見未來 / BloomPath）

### Step 2 — 進 Automations
左側 sidebar → **Automations** → **+ New automation**

### Step 3 — 設定 Automation 基本資訊
- **Name**: `Welcome Sequence — Free Ebook 中文`
- **Description**: `Triggered by free-ebook-meltdown-zh signup. 7 emails over 14 days.`
- 點 **Create**

### Step 4 — 設 Trigger
進 automation 後第一個 block 是 **Trigger**：

- 選 **Subscriber created** （或 "When subscriber joins"）
- 加 condition：**utm_source** → `contains` → `free-ebook-meltdown-zh`
- 儲存

### Step 5 — 加 Email 1（D0，立即送出）

點 **+ Add step** → 選 **Send email**

填入：
- **Subject**: `你的《90 秒應對劇本》在這裡` （或選 A/B 候選之一）
- **Preview text**: `下次崩潰之前，先存在手機。再附 3 篇我們最常被分享的文章。`
- **Body**: 從 `docs/email-sequences/welcome-ebook-meltdown-zh.md` 的 Email 1 整段 body 複製貼上

⚠️ Beehiiv 的 body 是 markdown 編輯器 — 直接貼 markdown 它會幫你 render 成 HTML。

⚠️ **連結要更新**：D0 的 PDF 連結目前是 `https://bloom-path.app/free-ebooks/toddler-meltdown-playbook-zh.pdf` ← **這個 URL 還沒生成**。等 PDF 上線後再回來改。

**Delay**: 設 **0 minutes**（訂閱後立即送出）

點 **Save** + **Continue**

### Step 6 — 加 Email 2（D1）

點 **+ Add step** → **Send email**

- Subject + Preview + Body 從 `welcome-ebook-meltdown-zh.md` Email 2 複製
- **Delay**: `1 day` （上一封寄出後 1 天）

### Step 7 — 重複加 Email 3-7

| Email | Delay 設定（距離上一封）|
|---|---|
| Email 3（D3）| `2 days` |
| Email 4（D5）| `2 days` |
| Email 5（D8）| `3 days` |
| Email 6（D11）| `3 days` |
| Email 7（D14）| `3 days` |

每封都從 markdown 檔案複製 Subject / Preview / Body。

### Step 8 — 結尾「畢業」到 weekly newsletter

在 Email 7 之後加：
- **+ Add step** → **Add to audience**
- 選 / 建立 audience: **"Weekly Newsletter ZH"**
- 同時 **Remove from this automation**

⚠️ 如果你還沒建週四 newsletter 的 audience，先去 Audiences → New Audience → 名稱 "Weekly Newsletter ZH"。

### Step 9 — 啟動 Automation

回到 automation 頂部，**狀態切換成 "Active"**。

### Step 10 — 測試一次

用你自己的測試 email 從 Landing page 訂閱：
1. 開 `https://bloom-path.app/zh/free/toddler-meltdown-playbook/`
2. 填 test email（建議用 `gmail+test01@...` 之類的 alias）
3. 收 5 分鐘內：應該收到 Email 1
4. Beehiiv → Automations → 你的 automation → 看 Activity 確認 trigger 生效

✅ 如果 D0 收到 = 設定成功。後面 6 封會自動跟著發。

---

## Part 2：英文 Welcome Sequence 設定

### 重複 Part 1 流程，但：

- Name: `Welcome Sequence — Free Ebook English`
- Trigger condition: **utm_source** `contains` `free-ebook-meltdown-en`
- 7 封 email 改成從 **`welcome-ebook-meltdown-en.md`** 複製
- 結尾畢業到 **"Weekly Newsletter EN"** audience（如果沒建先建）

### ⚠️ 重要：兩個 Automation 同時 active

- 中文 automation → trigger by `free-ebook-meltdown-zh`
- 英文 automation → trigger by `free-ebook-meltdown-en`

訂閱者只會進入符合自己 utm_source 的那一條。**不會同時收到中英文**。

---

## Part 3：常見問題

### Q1：訂閱者填了 email 但什麼都沒收到？

檢查順序：
1. Beehiiv → Audience → 搜尋那個 email → 看 utm_source 欄位
   - 如果 utm_source 是 `free-ebook-meltdown-zh` 或 `-en` → trigger 應該有觸發
   - 如果是 `unknown` → Landing page form 的 source prop 沒傳對（聯絡我）
2. Beehiiv → Automations → 對應的 automation → Activity tab → 看那個 email 有沒有進來
3. 檢查訂閱者的 spam 信夾
4. Beehiiv → 該訂閱者 → 看 status 是否為 `active`（不是 `unconfirmed`）

### Q2：可以同時測中文跟英文嗎？

可以。用 2 個不同的 test email（或 `you+zh@...` 跟 `you+en@...`），分別從 `/zh/free/...` 和 `/en/free/...` 訂閱。

### Q3：Beehiiv 免費版有訂閱戶上限嗎？

Beehiiv 免費版到 **2,500 訂閱**之前免費。超過要付月費（最便宜 $39 USD/月）。
你現在 < 10 訂閱，**6 個月內絕對撐得到**。

### Q4：如果我想暫停 sequence？

Beehiiv → Automations → 那個 automation → 右上角 **Pause** 按鈕。
所有已經在 sequence 中的訂閱者會停在當下，新訂閱者不會進來。隨時可以再 resume。

### Q5：我寫的 sequence 想改怎麼辦？

Beehiiv → Automations → 該 automation → 點某封 email → Edit。
**注意**：已經收到那封 email 的人不會重新收到改過的版本。**只有未來的訂閱者會看到新版本。**

### Q6：怎麼看 sequence 表現？

Beehiiv → Automations → 該 automation → **Analytics** tab。
看每封 email 的：
- Open rate（開信率）
- Click rate（點擊率）
- Unsubscribe rate（退訂率）

健康指標：
- Open rate: 30-50%（welcome sequence 應該偏高）
- Click rate: 3-10%
- Unsubscribe rate: < 2%

---

## Part 4：上線前 checklist（兩個 sequence 都做完後）

- [ ] 中文 sequence 7 封 email 都貼好
- [ ] 英文 sequence 7 封 email 都貼好
- [ ] 兩個 automation 狀態都是 **Active**
- [ ] 用 test email 從中文 Landing page 訂閱 → 5 分鐘內收到 D0
- [ ] 用另一個 test email 從英文 Landing page 訂閱 → 5 分鐘內收到 D0
- [ ] PDF 真實檔案上線後，回來把 D0 email 的連結改掉（中英都要）
- [ ] AI 評估 quiz 上線後，回來把 D8 email 的連結改掉
- [ ] Audience "Weekly Newsletter ZH" 跟 "Weekly Newsletter EN" 都已建立
- [ ] （可選）設好開信率 dashboard，每週看一次

---

## Part 5：什麼時候你會看到第一筆轉換？

**假設你今天上線 sequence + ASO sprint：**

| 天數 | 預期發生 |
|---|---|
| Day 1-7 | App Store 改 metadata + 30 個熟人下載 → 日下載 3 → 10-20，5 星評分 1 → 15+ |
| Day 7-14 | App Store 演算法重新評估你的 app，搜尋曝光增加 |
| Day 14-30 | 第一個從演算法來的陌生人下載 App + 訂閱 Pro |
| Day 21-45 | 第一個從 Free Ebook landing page 來的 email signup |
| Day 35-60 | 第一個從 welcome sequence D11 推上 App Pro 試用的人付費 |

**第一筆 newsletter 來源的 App Pro 訂閱：預期 1-2 個月內**。

---

## 🆘 卡住了？

直接在 session 裡跟 Claude 說「Beehiiv 第 X 步看不懂」/「我這個畫面跟教學不一樣」/「沒收到 test email」——
我可以幫你看截圖排查。

設好以後，記得**在 monetization-roadmap.md 把那兩個任務標 completed**，這樣下次我接手時知道進度。
