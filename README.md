# jimjcy｜研究與日常

個人網站以 Markdown 管理文章，使用 Eleventy 產生靜態網頁，再由 GitHub Actions 發布到 GitHub Pages。

修改網站內容或文章，請先看 [網站內容與文章更新中文教學](文章更新教學.md)，內含首頁、個人介紹、研究分類、推薦網站與文章的修改位置、範例及發布步驟。

- 網站：https://jhangchenyu.github.io/
- 發布狀態：https://github.com/jhangchenyu/jhangchenyu.github.io/actions

## 修改首頁後怎麼更新

修改 `src/index.njk` 後按 Ctrl+S，雙擊 **發布首頁.cmd**，確認列出的修改後按 Enter。等本次 GitHub Actions 部署成功，再重新整理線上首頁。這個按鈕只提交首頁，不會把其他尚未提交的檔案一起提交；推送時會包含先前已提交但尚未推送的版本。

首頁最上方的 `description:` 是網頁摘要，不是畫面上的自我介紹。要修改訪客看到的文字，請用 Ctrl+F 找到目前顯示的句子，例如「我是 Jim」或「從量子實驗」，修改該段文字後發布。

## 寫文章：平常只要兩個步驟

1. 雙擊 **新增文章.cmd**，輸入標題、選分類。記事本會開啟新草稿；填好摘要、標籤及文章內容後存檔。
2. 雙擊 **發布文章.cmd**，選擇文章並確認。工具會檢查內容與連結、提交版本並推送；GitHub Actions 完成後，文章就會出現在網站上。

草稿在 `drafts/`，只留在本機，不會推送或出現在網站。公開後的正式文章在 `src/posts/`；修改這裡的 `.md`，再執行「發布文章.cmd」即可更新。`drafts/` 裡已發布的副本會標記完成，之後請編輯正式文章。

推送若因網路失敗，可再執行「發布文章.cmd」選擇重試推送，或執行 `node tools/write.cjs publish --push`。推送完成代表已送出原始碼；請以上方 Actions 的綠色成功狀態確認部署完成。

## 文章格式

每篇一個 `.md`，開頭是一段基本資料：

```yaml
---
title: "文章標題"
description: "一兩句摘要，會出現在文章列表。"
date: "2026-10-06"
category: packaging-sipi
slug: my-first-note
tags: [先進封裝, PI]
status: draft
---
```

接著用 `## 小標題`、一般段落、`- 條列`、`[名稱](網址)` 寫內文。`slug` 決定固定網址 `/articles/my-first-note/`，發布後請保留。新文章用 `draft`；發布工具會改成 `published`。`date` 是你決定的公開日期，不支援未來排程發布。可選填 `sourceNote` 說明來源或整理日期。

文章的標題、日期、分類、標籤、目錄、閱讀時間、相關文章與搜尋索引都會自動產生，不必修改網頁。

| 網站分類 | category |
| --- | --- |
| 研究／量子計算 | `quantum` |
| 研究／先進封裝 SI/PI | `packaging-sipi` |
| 研究／AI | `ai` |
| 研究／軍工 | `defense` |
| 研究／奇點研究 | `singularity` |
| 研究／AI＋生計 | `ai-livelihood` |
| 日誌／工作 | `work` |
| 日誌／旅遊 | `travel` |
| 日誌／亂寫 | `notes` |

## 圖片

新草稿的圖片放在 `drafts/assets/文章slug/`，例如 `drafts/assets/my-first-note/figure.jpg`。文章寫：

```markdown
![圖片的文字說明](/assets/articles/my-first-note/figure.jpg)
```

發布工具會一起複製與推送這篇文章的圖片。更新已公開的圖片時，請編輯 `src/assets/articles/文章slug/`，並修改該篇文章後再發布。勿使用電腦磁碟路徑作為圖片網址。

## 預覽與檔案位置

雙擊 **預覽網站.cmd**，然後開啟 http://localhost:4173/。保留終端機視窗以維持預覽；完成後按 Ctrl+C。預覽顯示公開文章，草稿仍保留在本機。

| 想修改的內容 | 檔案 |
| --- | --- |
| 個人介紹、經歷 | `src/index.njk` |
| 過往研究經驗 | `src/research-experience.njk` |
| 名稱、社群連結、網站網址 | `src/_data/site.json` |
| 分類名稱、描述及排序 | `src/_data/topics.json` |
| 推薦網站 | `src/_data/resources.json` |
| 文章 | `src/posts/*.md` |
| 樣式、動畫、搜尋 | `src/assets/` |

新增推薦網站請編輯 `resources.json`，填入名稱 `name`、網址 `url`、顯示網域 `host`、分組 `group`、網站類型 `type` 與簡介 `description`。沿用既有分組時只需改這個檔案；新增分組還要在 `src/links.njk` 的 `resourceGroups` 加入同名分組。首頁可用「發布首頁.cmd」；其他網站設定或版面修改，需要提交相關檔案並 `git push`，不會由文章發布工具代為提交。完整指令與範例見中文教學。

## 換電腦或重新安裝

安裝 Node.js 24 與 Git，登入具有此儲存庫推送權限的 GitHub 帳號，下載儲存庫後執行：

```powershell
npm ci
npm run build
npm start
```

`npm run build` 會驗證文章並輸出 `_site/`。GitHub Pages 設定使用 **GitHub Actions**；工作流程只上傳 `_site/`。原始履歷、私人聯絡資料、本機草稿、`node_modules/` 不包含在發布內容中。

網站品牌為 jimjcy。目前免費主機名稱沿用 GitHub 帳號 `jhangchenyu`；品牌改名不會自動變更 GitHub 帳號或取得 `jimjcy.github.io`。網址確定後可調整 `site.json` 中的 `url`、`basePath`，再配合對應的 Pages 設定。

動態效果支援右上角暫停、跨頁記憶與系統「減少動態」設定；未啟用 JavaScript 時仍能閱讀文章、瀏覽分類與導覽。
