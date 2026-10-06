---
title: "矽光子入門（二）：調變、偵測與多工"
description: "用一條光收發鏈，串起微環與 Mach–Zehnder 調變器、鍺光偵測器、多工方式和可程式光路。"
date: "2026-10-06"
category: cpo
slug: silicon-photonics-transceiver
cover: /assets/images/silicon-transceiver.svg
coverAlt: "雷射、調變器、光路、鍺光偵測器和電子輸出依序連接的概念圖"
tags: [矽光子, 調變器, 光偵測器, WDM]
status: published
sourceNote: "依據《Silicon Photonics》30 張投影片重新編寫；PDF 與 PPTX 是同一份內容的兩種格式。本文將投影片中的示意轉成文字，不把特定元件規格當成所有設計的通則。"
---

上一篇談[光波導、耦合器與光纖介面](/articles/silicon-photonics-passive-devices/)。接下來沿著收發鏈看：連續光從雷射進來，電訊號透過調變器寫入光，光經過晶片與光纖，最後由光偵測器轉回電訊號。

## 調變器：讓光帶上資料

**Mach–Zehnder 調變器（MZM）**先把光分成兩臂，再利用相位變化控制合波時的干涉，將電訊號映射到輸出光強。矽光子設計可藉由電壓改變波導的有效折射率；[Ansys 的 MZM 範例](https://optics.ansys.com/hc/en-us/articles/360042327954-Calculating-modulation-response-MZM-example)以 PN 結與兩條光路說明這個機制。輸出端的明暗取決於相對相位、耦合器與所觀察的埠，不能只用一個固定相位角概括所有架構。

**微環調變器（MRM）**則利用環形共振器的共振波長對條件變化敏感這件事，改變特定波長的傳輸。它可以做得緊湊，但要留意共振位置、可用波長範圍和溫度漂移；[Ansys 的環形調變器範例](https://optics.ansys.com/hc/en-us/articles/360042322794-Ring-Modulator)將耦合區、被動波導與主動波導分開建模。

| 比較 | MZM | 微環調變器 |
| --- | --- | --- |
| 核心機制 | 兩臂相位差與合波干涉 | 共振條件改變透射 |
| 常見設計取向 | 較寬的光學工作範圍 | 較小的元件面積 |
| 特別留意 | 長度、驅動與損失 | 波長對準與溫度控制 |

這是架構層級的比較；速度、功耗與損失都應回到具體製程、驅動和量測條件評估。

## 偵測器：把光轉回電

在接收端，光偵測器將入射光轉成電流，再由電子電路處理。投影片用矽上鍺（Ge-on-Si）光偵測器作例子；[imec 的整合平台說明](https://www.imec-int.com/en/imec-magazine/imec-magazine-may-2017/new-silicon-photonics-technology-delivers-faster-data-traffic-in-data-centers)也列出鍺光偵測器和分立電子驅動／跨阻放大電路的分工。

若要評估整段鏈路，不能只看光晶片。雷射、調變器、耦合損失、光纖、偵測器與後段電子電路都會影響最後的訊號品質。原投影片以光譜分析儀（OSA）觀察光譜、以光電轉換後的訊號觀察品質，這是兩種不同量測視角。

## 多工：同一條鏈路如何承載更多通道

| 方法 | 區分通道的方式 |
| --- | --- |
| WDM | 不同波長 |
| SDM | 不同空間路徑或纖芯 |
| MDM | 不同傳播模態 |
| PDM | 不同偏振狀態 |

這些是**多工維度**，可以視系統設計組合使用。[imec 的 WDM 說明](https://www.imec-int.com/en/imec-magazine/imec-magazine-may-2017/new-silicon-photonics-technology-delivers-faster-data-traffic-in-data-centers)以不同載波波長共用同一條光纖為例。投影片也提到 PAM 和相干傳輸；它們分別牽涉訊號調變格式與收發架構，不宜和 WDM、SDM 等直接當作同一類名詞。

## 可程式光路：調的是狀態

把耦合器、干涉器與相位控制元件組成網格，就能重設分光比例或光路連接方式。[Optica 的可程式光子電路論文](https://opg.optica.org/aop/abstract.cfm?uri=aop-12-3-709)討論了 MZI、可調耦合器與波導網格。一般情況下，運作時調的是相位或元件狀態，**不是讓已製成的兩條波導實體間距改變**；特別的機電可動結構則需另行說明。

從單一元件走到實際產品，關鍵是把光路、電子驅動、封裝與量測一起看。這也是閱讀[矽光子與 CPO 的較早筆記](/articles/cpo-silicon-photonics/)時值得帶著的問題。

## 原始資料

兩份檔案是同一份 30 張投影片：[閱讀 PDF](/assets/documents/silicon-photonics.pdf)或[下載可編輯的 PPTX](/assets/documents/silicon-photonics.pptx)。
