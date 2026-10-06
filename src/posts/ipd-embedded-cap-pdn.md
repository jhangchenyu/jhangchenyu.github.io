---
title: "IPD 與內嵌電容：AI 晶片的 PDN 要分層扛"
description: "從迴路電感看 HPC 的多級去耦合：PCB 上的 MLCC、基板內的 IPD、中介層的 eDTC，以及 on-die 電容各管一段頻率。"
date: "2026-05-03"
category: packaging-sipi
slug: ipd-embedded-cap-pdn
cover: /assets/images/research-ipd-pdn.webp
coverAlt: "晶片封裝內電源路徑與電容配置的概念插畫"
tags: [IPD, PDN, 內嵌電容, eDTC, PI]
status: published
sourceNote: "整理自 2026-05-03 的 X 長文。電壓、電流、頻率範圍與分層，都是該日的觀察。"
---

## 市場還在看 SI

目前市場的焦點幾乎都在訊號完整性（SI）：

- low Dk 玻纖布
- 更低 Df 的 M8 樹脂
- low RA、高平坦銅箔
- HBM 高密度互聯、TSV 縮短距離

電源完整性（PI），以及把電源供應網路（PDN）做低阻抗，可能是 AI 下一個被低估的戰場。

## AI 晶片上正在發生的三件事

HPC 上的 AI 晶片正在發生三件事：

- 電壓越來越低（大約 0.6 V）
- 電流越來越大（上千 A）
- switching 越來越快（GHz）

瞬間抽電（di/dt 暴增）會讓晶片的供電電壓突然降低。為了避免 bit error，系統只能主動降頻，實際算力就被 PDN 吃掉一截。

要解決這個問題，必須把高頻阻抗降下來。電流頻譜已經延伸到 GHz，所以 PDN 阻抗要在全頻段維持低阻抗，而不只是低頻。

## 用迴路電感分層

一個完整的 HPC PDN 不是由單一電容構成，而是 4 到 5 個層級接力的多級去耦合網路。可以用迴路電感（loop inductance）來分：

- 越靠近 die，迴路電感越低，負責越高頻（GHz）
- 越遠離 die，迴路電感越高，只能處理低頻（kHz 到 MHz）

各層大概是這樣分工：

- **PCB 上的 MLCC**：距離 die 要經過 BGA ball、ABF 基板、C4 bump，迴路電感大，只能負責 1 MHz 以下。
- **基板內的 IPD／embedded cap**：距離縮短到 ABF 內層加上 C4 bump，可覆蓋大約 1 到 100 MHz。
- **中介層上的 embedded MIM／eDTC**：透過 fine RDL 連接 die，迴路電感很低，負責 100 MHz 到 GHz。
- **On-die MIM／MOS cap**：直接做在晶片內，迴路電感最小，負責 GHz 以上。

## 越靠近 die，越貴

這裡有一個取捨：越靠近 die，效果越好，成本也越高。

On-die cap 的缺點很明顯：吃掉矽面積、製程成本高、設計彈性低。

中間解就變得很關鍵，也就是中介層或基板上的內嵌式電容。它同時滿足三件事：

- 足夠接近 die，能處理高頻
- 不佔用矽面積
- 成本遠低於 on-die

這也是產業現在很需要內嵌式電容（eDTC、embedded cap）的原因。

## 兩條路線，同一件事

業界目前分成兩條主軸：

- TSMC 路線
- Intel／OSAT 路線（Intel MIM cap、embedded IPD）

共通點都是把電容往 die 推。TSMC 推到 interposer，Intel 推到基板與矽橋。

PDN 已經是 HPC 效能的核心瓶頸之一。價值重心正在往 eDTC、嵌入式電容這類方案移動。

## 原文

[2026-05-03 的 X 長文](https://x.com/SBG_jerry_1006/status/2050978969965719670)。原文附有平台剖面圖，站內不轉載該圖。
