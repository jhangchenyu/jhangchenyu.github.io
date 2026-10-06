# jimjcy｜研究與日常

- 網站：https://sbgjim1006.github.io/
- 部署狀態：https://github.com/sbgjim1006/sbgjim1006.github.io/actions
- 完整說明：[網站內容與文章更新中文教學](文章更新教學.md)

## 平常只用兩個入口

| 入口 | 用途 |
| --- | --- |
| **預覽網站.cmd** | 在電腦上預覽，網址為 http://localhost:4173/。 |
| **發布網站.cmd** | 檢查、建置並提交推送所有網站修改。 |

修改後按 **Ctrl+S**，再雙擊「發布網站.cmd」。等 GitHub Actions 部署成功，回網站按 **Ctrl+F5**。發布失敗會停止並保留修改；推送失敗時，處理網路或登入問題後，再執行同一入口重試。

也可以在網站資料夾執行 `npm run publish:site`。發布會包含目前所有網站來源修改；`drafts/` 的草稿不會自動公開。

## 修改哪個檔案

| 內容 | 來源 |
| --- | --- |
| 首頁、個人介紹與經歷 | `src/index.njk` |
| 社群連結、網站設定 | `src/_data/site.json` |
| 研究與日誌分類 | `src/_data/topics.json` |
| 推薦網站 | `src/_data/resources.json` |
| 正式文章 | `src/posts/*.md` |
| 小工具列表 | `src/tools.njk` |
| 退休模擬器 | `src/tools/retirement/index.html` |
| 圖片、樣式與動畫 | `src/assets/` |

`_site/` 是建置結果，請編輯 `src/` 裡的來源檔。

## 新增文章

1. 複製 `templates/article.md` 到 `drafts/英文代稱.md`，編輯標題、摘要、日期、分類、slug 與正文。
2. 寫好後複製到 `src/posts/同名.md`，把 `status` 改為 `published`；日期使用今天或過去的日期，slug 與檔名一致。
3. 如有圖片，把 `drafts/assets/英文代稱/` 的圖片複製到 `src/assets/articles/英文代稱/`；正文使用 `/assets/articles/英文代稱/圖片檔名`。
4. 預覽確認後，雙擊「發布網站.cmd」。

後續修改正式文章與正式圖片；草稿可以留在本機備份。

## 換電腦或重新安裝

安裝 Node.js 24 與 Git，登入有權限的 GitHub 帳號，下載儲存庫後執行 `npm ci`，即可使用上述兩個入口。

技術：Eleventy 3.x、Markdown、GitHub Actions、GitHub Pages。Pages 發布來源維持 GitHub Actions，產物為 `_site/`。網站設定的 `url` 為 `https://sbgjim1006.github.io`，`basePath` 為 `/`。
