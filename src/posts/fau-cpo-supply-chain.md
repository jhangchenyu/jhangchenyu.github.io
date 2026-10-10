---
title: "FAU 與 CPO：光纖接到晶片之後，還要驗證什麼？"
description: "從交付介面、公開證據和量產關卡，整理 FAU 在 CPO 供應鏈的位置與台灣公司的研究線索。"
date: "2026-10-10"
category: cpo
slug: fau-cpo-supply-chain
tags: [FAU, CPO, 矽光子, 光纖陣列, 供應鏈]
status: published
sourceNote: "依據 CPO 專案的《FAU_全球供應鏈與台股研究_2026-10-09.html》整理；原報告保留完整 26 筆來源與公司查核表。資料查核基準為 2026-10-09。"
---

> **資料整理｜資料查核基準：2026-10-09。** 本文整理公開資料中的供應鏈角色與後續驗證問題。產品規格、合作公告、送樣與工程生產，各自代表不同進度；文中提到的預計時程不是已完成量產或已實現收入。

矽光子把光學元件放到交換晶片附近，仍須解決一個很實際的問題：**晶片上的光，怎麼穩定地進出光纖？** FAU（fiber array unit，光纖陣列單元）是其中一種交付介面。它把多根光纖排列、固定，並配合光子積體電路（PIC）的耦合結構；整個光路還可能包含透鏡、連接器、外置雷射與封裝測試工站。

NVIDIA 的[矽光子交換器供應鏈說明](https://developer.nvidia.com/blog/a-new-era-in-data-center-networking-with-nvidia-silicon-photonics-based-network-switching/)把晶片製程與封裝、雷射組件、光纖連接，以及系統組裝列成不同分工。這份名單證明各公司的**生態系位置**，沒有揭露每一家供應商的 FAU 料號、採購額或市占率。因此，不能把所有被點名的公司都當成同一種「FAU 供應商」。

## 先分清楚交付的是哪一段

| 位置 | 交付內容 | 最容易混淆的地方 |
| --- | --- | --- |
| 平台與封裝 | PIC、交換晶片、封裝與測試介面 | 平台採用不等於某個 FAU 料號已放量 |
| 光纖、FAU 與連接器 | 將光送入或送出 PIC，並處理多通道排列與維修需求 | 光纖組件、FAU、可拆卸連接器不是同一件產品 |
| 對位與測試設備 | 光學對準、貼合、固化、電光測試 | 設備規格或接單不等於客戶良率、整站產能或設備收入已實現 |

不同架構還可能選擇固定式 FAU、擴束式連接，或玻璃波導等介面。像 [Corning GlassBridge](https://www.corning.com/oem-solutions/worldwide/en/home/products-solutions/optical-communication-components/next-generation-optics/glassbridge-connector.html)所描述的光纖到 PIC 方案，應放在具體封裝條件下比較；光路相鄰，不代表產品可以直接互相替代。

## 台灣公司：把合作、產品與驗證分開看

**上詮（3363）**的研究重點是透鏡式光纖介面能否從工程階段走向持續交付。[Himax 2026 年第二季財報新聞稿](https://www.himax.com.tw/wp-content/uploads/2026/08/2Q26-Earnings-PR-Final.pdf)具名提及與 FOCI 的合作，並表示相關產品於第三季開始工程生產爬坡；正式量產時間仍取決於客戶部署。這是合作及進度證據，還需要客戶認證、良率、出貨與收入拆分來判斷商業成果。NVIDIA 的公開夥伴名單未具名上詮，兩條證據鏈不能互換。

**波若威（3163）**出現在 NVIDIA 的光纖與連接夥伴名單。[公司法說簡報](https://www.browave.com/uploads/images/115%20%E6%B3%95%E8%AA%AA%28%E4%B8%AD%291150310.pdf)也展示高通道、擴束及多排陣列方案。公開產品廣度值得追蹤，但仍須確認哪個 CPO 專用料號通過客戶驗收、持續出貨，以及相關收入是否能與可插拔模組區分。

**連訊（6820）**已有[FAU 產品頁](https://www.aconoptics.com/en/product/overview/Passive/CPO/Fiber_Array_Unit__FAU_)。公司網站[轉載的 2026 年 9 月報導](https://www.aconoptics.com/tw/news/detail/%E9%80%A3%E8%A8%8A_7_%E6%9C%88%E7%87%9F%E6%94%B6%E5%89%B5%E6%AD%B7%E5%8F%B2%E6%96%B0%E9%AB%98_AI_%E5%85%89%E4%BA%92%E9%80%A3%E9%9C%80%E6%B1%82%E6%8E%A8%E5%8D%87%E7%87%9F%E9%81%8B%E5%8B%95%E8%83%BD)提到 DVT、送樣、PVT 準備及後續試產、量產規劃。這些是待檢驗的公司預期，不能提前寫成已量產；下一步要看試產是否如期、合格出貨量，以及 FAU 與 MPO 的營收拆分。

**合聖科技（7928）**的[可拆卸式 2D FAU 產品](https://www.authenxinc.com/zh-TW/product_detail.php?id=54&p=1)提供另一條介面路線。產品頁及[OFC 論文摘要](https://opg.optica.org/abstract.cfm?uri=OFC-2026-Th2A.8)足以支持技術研究，卻不足以推出量產良率或客戶採用。[櫃買中心登錄資料](https://www.tpex.org.tw/storage/emerging_register/2026/06/1781576323_CH_7928.pdf)也未把 FAU 營收單獨列出；要形成商業判斷，仍需逐通道插損、重插壽命、客戶認證與可辨識收入。

設備端則要另設觀察欄。[萬潤的光學耦合設備](https://www.allring-tech.com.tw/product-detail20.htm)與[惠特的矽光子耦光貼合機](https://zh-tw.fittech.com.tw/photonic-device-assembly-system)說明了對位、貼合工站的供應可能性。若要估算受益，還得拿到實際設備驗收、固化後精度、良品產能及收入權重；不能把設備平台精度當成整段光路的插損或量產良率。

## 下一輪最需要的證據

1. **交付邊界：**同一個料號究竟交付 FAU、連接器、整段光路，還是製造設備？避免重複計算。
2. **可比的光學數據：**在相同參考平面、波長、偏振與溫度條件下，看逐通道插損、回損與固化或重插後的分布。
3. **量產關卡：**分開記錄展示、送樣、DVT／PVT、客戶認證、持續出貨與最終良率。
4. **財務連結：**確認 FAU 或設備的出貨量、售價、毛利與營收占比，並和 MPO、收發模組、外置雷射等其他收入隔開。

現階段可以排序的是**研究工作**：先追有具名合作或明確驗證節點的公司，再追設備工站和替代介面的採用情況。缺少客戶量產、收入拆分與同日估值資料時，這份清單不構成買賣或預期報酬排序。
