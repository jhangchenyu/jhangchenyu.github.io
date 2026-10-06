---
title: "矽光子入門（一）：光波導、耦合器與光纖介面"
description: "從 SOI 光波導出發，理解光如何留在晶片、如何分流，以及光纖怎麼與晶片對接。"
date: "2026-10-06"
category: cpo
slug: silicon-photonics-passive-devices
cover: /assets/images/silicon-waveguide.svg
coverAlt: "光從光纖進入矽光子晶片，經波導及方向耦合器分成兩路的概念圖"
tags: [矽光子, 光波導, 耦合器, 光纖介面]
status: published
sourceNote: "依據《Silicon Photonics》30 張投影片重新編寫；PDF 與 PPTX 是同一份內容的兩種格式。本文為原理整理，示意圖重新繪製，並非元件截面或量測結果。"
---

矽光子把導光、分光、調變與偵測等功能整合到光子積體電路（PIC）。這篇先看**被動光路**：光進入晶片後，如何沿著波導走、如何分到另一條路、如何再回到光纖。後篇再談調變器、偵測器和多工。

## SOI 光波導：把光限制在晶片上

投影片以 SOI（silicon-on-insulator，絕緣層上矽）為例：矽導光層與周圍二氧化矽的折射率不同，設計合適的截面後，光場可形成受侷限的導引模態。這讓波導能在晶片上轉彎、分岔，並連接其他光學元件。

「能導光」不等於「沒有損耗」。波導幾何、側壁粗糙度、彎曲、波長與製程偏差，都要納入設計與量測。實際系統還得加上耦合、接點和其他元件的損失，才能計算整段光路的功率預算。[imec 的矽光子平台介紹](https://www.imec-int.com/en/imec-magazine/imec-magazine-may-2017/new-silicon-photonics-technology-delivers-faster-data-traffic-in-data-centers)展示了波導、分光器、光纖耦合器與主動元件如何共同整合。

## 方向耦合器：相鄰波導可以交換光

兩條波導靠近時，光場會延伸到另一條波導附近，能量便可能在兩條路徑間轉移。**間距與平行耦合長度**是決定分光比例的重要設計參數；[Ansys 的方向耦合器模型](https://optics.ansys.com/hc/en-us/articles/360034179494-directional-coupler-parameterized-CML-Compiler-Model)也以這兩個參數描述元件。

這恰好說明，不能籠統地說「光路之間不會互相干擾」。有時我們刻意利用耦合來分光；不想耦合時，則要控制波導間距與佈局。普通方向耦合器的幾何尺寸在製造時已固定，不能把「調整設計間距」當成晶片運作時的即時控制方式。

## 光纖與晶片怎麼接

光纖的光場尺寸與晶片波導不同，直接對接往往會損失能量。投影片列出邊緣耦合（edge coupling）、光柵耦合（grating coupling），以及其他轉接形式；真正要選哪一種，須看封裝、對準、波長範圍和量產測試需求。

| 方式 | 光進出的位置 | 設計時要看什麼 |
| --- | --- | --- |
| 邊緣耦合 | 從晶片側邊與波導對接 | 端面、模式轉換、封裝對準與頻寬 |
| 光柵耦合 | 從晶片表面與波導對接 | 光柵週期、入射角、波長敏感度與對準 |

[Ansys 的邊緣耦合範例](https://optics.ansys.com/hc/en-us/articles/360042305354-Edge-coupler)與[光柵耦合範例](https://optics.ansys.com/hc/en-us/articles/360042305334-Grating-coupler)都把模式匹配與耦合效率列為設計核心。投影片末段另提到次波長光柵（SWG）波導：它利用比工作波長尺度更小的週期結構調整有效光學特性；它和用來從晶片表面接入光纖的光柵耦合器，功能不必然相同。

## 看一個被動光路時，我會先問

1. 光從哪裡進入晶片？從側邊還是表面？
2. 各段波導與耦合器的損失如何相加？
3. 需要固定分光，還是運作時可調的分光？
4. 波長、偏振與溫度變化會怎樣影響結果？

把這些問題釐清，才有基礎討論後續調變、偵測或 CPO 封裝。下一篇接著整理[矽光子收發鏈：調變、偵測與多工](/articles/silicon-photonics-transceiver/)。

## 原始資料

這份簡報有兩種格式，內容相同：[閱讀 PDF](/assets/documents/silicon-photonics.pdf)或[下載可編輯的 PPTX](/assets/documents/silicon-photonics.pptx)。簡報中的外部圖表與連結保留在原檔；本文圖示為重新繪製。
