# jimjcy｜研究與日常

個人網站以 Markdown 管理文章，使用 Eleventy 產生靜態網頁，再由 GitHub Actions 發布到 GitHub Pages。

修改網站內容或文章，請先看 [網站內容與文章更新中文教學](文章更新教學.md)，內含首頁、個人介紹、研究分類、推薦網站與文章的修改位置、範例及發布步驟。

- 網站：https://sbgjim1006.github.io/jhangchenyu.github.io/
- 發布狀態：https://github.com/sbgjim1006/jhangchenyu.github.io/actions

## 修改網站後，一次發布全部更新

修改檔案後按 **Ctrl+S**，回到 `C:\AI\personal-website`，雙擊 **發布網站.cmd**。也可以在網站資料夾的終端機執行：

```powershell
npm run publish:site
```

這個入口會建置與檢查網站，成功後才提交並推送目前所有網站來源修改，包括首頁、社群連結、研究與日誌頁、已發布文章、個人小工具、樣式及設定。不需要再手動執行 `git add`、`git commit`、`git push`；執行前請先存檔，並確認這些修改都準備好公開。

若失敗，程式會停止並保留修改；網路或登入造成推送失敗時，處理問題後再執行同一入口即可重試。推送成功後，仍要到上方 **GitHub Actions** 確認本次部署成功，再回網站按 **Ctrl+F5**。發布程式不會自動等待部署完成。

`drafts/` 的未完成草稿不會因此公開。新草稿首次發布仍使用 **發布文章.cmd**；之後修改正式文章，就能和其他網站內容一起用 **發布網站.cmd** 更新。原本的 **發布首頁.cmd** 與 **發布文章.cmd** 仍可用於個別發布。

首頁最上方的 `description:` 是網頁摘要，不是畫面上的自我介紹。要修改訪客看到的文字，請用 Ctrl+F 找到目前顯示的句子，例如「我是 Jim」或「從量子實驗」，修改該段文字後發布。

## 寫文章：平常只要兩個步驟

1. 雙擊 **新增文章.cmd**，輸入標題、選分類。記事本會開啟新草稿；填好摘要、標籤及文章內容後存檔。
2. 雙擊 **發布文章.cmd**，選擇文章並確認。工具會檢查內容與連結、提交版本並推送；GitHub Actions 完成後，文章就會出現在網站上。

草稿在 `drafts/`，只留在本機，不會推送或出現在網站。公開後的正式文章在 `src/posts/`；修改這裡的 `.md`，再執行「發布網站.cmd」即可更新。`drafts/` 裡已發布的副本會標記完成，之後請編輯正式文章。

推送若因網路失敗，處理問題後可再執行「發布網站.cmd」重試；原文章工具也保留重試推送功能。推送完成代表已送出原始碼；請以上方 Actions 的綠色成功狀態確認部署完成。

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
![圖片的文字說明](/jhangchenyu.github.io/assets/articles/my-first-note/figure.jpg)
```

首次發布工具會一起複製與推送這篇文章的圖片。更新已公開的圖片時，請編輯 `src/assets/articles/文章slug/`，再執行「發布網站.cmd」；只替換圖片也能發布。勿使用電腦磁碟路徑作為圖片網址。

## 預覽與檔案位置

雙擊 **預覽網站.cmd**，然後開啟 http://localhost:4173/jhangchenyu.github.io/。保留終端機視窗以維持預覽；完成後按 Ctrl+C。預覽顯示公開文章，草稿仍保留在本機。

| 想修改的內容 | 檔案 |
| --- | --- |
| 個人介紹、經歷 | `src/index.njk` |
| 過往研究經驗 | `src/research-experience.njk` |
| 名稱、社群連結、網站網址 | `src/_data/site.json` |
| 分類名稱、描述及排序 | `src/_data/topics.json` |
| 推薦網站 | `src/_data/resources.json` |
| 文章 | `src/posts/*.md` |
| 個人小工具列表 | `src/tools.njk` |
| 退休計畫模擬器 | `src/tools/retirement/index.html` |
| 樣式、動畫、搜尋 | `src/assets/` |

新增推薦網站請編輯 `resources.json`，填入名稱 `name`、網址 `url`、顯示網域 `host`、分組 `group`、網站類型 `type` 與簡介 `description`。沿用既有分組時只需改這個檔案；新增分組還要在 `src/links.njk` 的 `resourceGroups` 加入同名分組。以上內容存檔後，統一用「發布網站.cmd」更新。完整範例見中文教學。

## 換電腦或重新安裝

安裝 Node.js 24 與 Git，登入具有此儲存庫推送權限的 GitHub 帳號，下載儲存庫後執行：

```powershell
npm ci
npm run build
npm start
```

`npm run build` 會驗證文章並輸出 `_site/`。GitHub Pages 設定使用 **GitHub Actions**；工作流程只上傳 `_site/`。原始履歷、私人聯絡資料、本機草稿、`node_modules/` 不包含在發布內容中。

網站品牌為 jimjcy。GitHub 帳號為 `sbgjim1006`，儲存庫名稱為 `jhangchenyu.github.io`，目前網址是 `https://sbgjim1006.github.io/jhangchenyu.github.io/`。`site.json` 的 `url` 設為 `https://sbgjim1006.github.io`，`basePath` 設為 `/jhangchenyu.github.io/`；未來更換網址時，這兩項與 Pages 設定需一併更新。

動態效果支援右上角暫停、跨頁記憶與系統「減少動態」設定；未啟用 JavaScript 時仍能閱讀文章、瀏覽分類與導覽。
