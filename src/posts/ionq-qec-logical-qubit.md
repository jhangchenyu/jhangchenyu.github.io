---
title: "IonQ 的 QEC：一個 logical qubit 要幾顆 physical qubit"
description: "看容錯量子計算時，問題不是有幾顆 qubit，而是要花多少 physical qubit，才能做出一顆可靠的 logical qubit。"
date: "2026-09-24"
category: quantum
slug: ionq-qec-logical-qubit
tags: [QEC, logical qubit, qLDPC, 離子阱]
status: published
sourceNote: "整理自 2026-09-24 的 X 長文，談的是 IonQ 的 QEC 路線，不是該公司當日其他新聞稿的逐句翻譯。"
---

很多人看量子電腦只看有多少 qubit。

真正進入容錯量子運算（fault-tolerant logical gate）之後，更重要的可能不是 physical qubit 的數量，而是：要花多少 physical qubit，才能做出 1 顆真正可靠的 logical qubit。這也是 IonQ 這條 QEC 路線值得看的地方。

## Stabilizer：不要直接問 0 或 1

量子資訊最大的麻煩是，你不能直接量 data qubit，問它現在是不是出錯。一量測，原本的疊加態就可能被破壞。

所以 QEC 不問「這顆 qubit 是 0 還是 1」，而問「這幾顆 qubit 之間，原本該成立的關係有沒有被破壞」。這些關係就是 stabilizer。

例如某個編碼要求：

- Z₁Z₂ = +1
- Z₂Z₃ = +1

如果其中一個結果變成 −1，就代表某處可能發生了錯誤。這些錯誤訊號叫做 syndrome。

## Ancilla 是探針

Stabilizer 要靠 ancilla qubit 來量。

Ancilla 通常不承載演算法資訊。它先和多個 data qubit 互動，把 stabilizer 的資訊帶到自己身上。接著量的是 ancilla，不是 data qubit：

data qubits → ancilla → measurement → syndrome → classical decoder

Decoder 依照一整組 syndrome，推斷哪裡最可能出錯，然後修正，或在軟體裡更新 Pauli frame。這就是 QEC 的核心循環。

## Physical qubit 不會沒有錯

Physical qubit 就是實際存在的量子自由度。在 IonQ 裡，就是一顆顆 trapped ion。

單量子位元閘、雙量子位元閘、量測、idle、ion shuttling、leakage，全部都可能出錯。就算 two-qubit gate fidelity 做到 99.99%，error rate 仍大約是 10⁻⁴。

大型量子演算法如果要跑數十億、甚至數兆次 logical operations，單靠 physical fidelity 不夠。路線一定是：

physical qubit → QEC → logical qubit

## Logical qubit 不是一顆更好的 qubit

Logical qubit 是把一個量子資訊分散編碼到很多 physical qubit 上。α|0⟩ + β|1⟩ 經過編碼，變成一個多 qubit 的集體態。

單一 physical qubit 出錯，不代表邏輯資訊立刻消失。只要錯誤還沒超過這個 code 能處理的範圍，stabilizer、ancilla、decoder 就有機會把錯誤認出來。

所以真正要問的不是「這顆 physical qubit 有多準」，而是 QEC 之後的 logical error rate 能壓到多低。

Physical fidelity 描述的是某一次 physical gate 有多準。Logical fidelity 描述的是，經過編碼和反覆 QEC 之後，真正承載演算法的那顆 logical qubit 有多可靠。

要的是 pL ≪ pP。pP 是 physical error rate，pL 是 logical error rate。Physical error rate 低於 QEC threshold 之後，把 code distance 拉高，理論上可以讓 logical error rate 從 10⁻⁴ 往 10⁻⁶、10⁻⁹、10⁻¹² 走。這才是容錯量子計算要的東西。

## QEC 犧牲的是資訊密度

QEC 不是免費的。它大量消耗 physical qubit。更精確地說，它犧牲的是 Hilbert space 的承載效率。

n 個 physical qubit 原本有 2ⁿ 維。若使用 [[n, k, d]] quantum error correcting code，真正能自由承載量子資訊的只有 k 個 logical qubit，也就是 2ᵏ 維。其餘自由度拿去建立 stabilizer、syndrome、冗餘和保護。

一句話：犧牲量子資訊密度，換取可靠度。

## qLDPC 在壓 overhead

IonQ 這段時間的核心之一是 qLDPC（quantum low-density parity-check code）。

傳統 surface code 的問題是 physical qubit overhead 很高。要做出 1 顆非常可靠的 logical qubit，可能要數百甚至上千顆 physical qubit。若未來需要幾千顆 logical qubit，整台機器會膨脹到數百萬顆 physical qubit。

競爭問題就變成：誰能把 physical／logical 的比例壓低。

IonQ 實驗過的例子包括 [[18, 4, 3]]：18 個 physical data qubit，編碼出 4 個 logical qubit。只看 data qubit，18／4 = 4.5，平均每個 logical qubit 約用 4.5 個 data qubit。

實際系統還要加上 ancilla、量測、magic state、routing。整機比例一定更高。但它說明 qLDPC 要的是 encoding rate：logical qubit 除以 physical qubit，越高越好。

## 為什麼離子阱可能走得通

qLDPC 通常需要比 surface code 更複雜的連接。超導 qubit 受平面佈線和 nearest-neighbor 限制。Trapped ion 可以用 ion shuttling、較彈性的連接，以及高保真度的閘，重新安排哪些離子要互動。

所以這條路線可以收成三件事：高 physical fidelity、高連接度、高 encoding rate 的 qLDPC。目標是用更少的 physical qubit，得到更可靠的 logical qubit。

## 之後該問的數字

以後看量子電腦，我不只看 100、1,000、10,000 qubit。該問的是：

- 有多少 logical qubit
- logical error rate 多低
- 一顆 logical qubit 要多少 physical qubit
- logical gate 的成本是多少
- 能不能持續做 fault-tolerant logical operations

Physical qubit 的數量最後比較像原材料。Logical qubit 才是可以拿來跑大型演算法的計算資源。

IonQ 這次 QEC 的意義，不只是「也開始做錯誤更正」。它在驗證一個假設：如果 trapped ion 的 physical fidelity 夠高，再加上全連接和 qLDPC，能不能用比其他架構更低的 physical qubit overhead，走進容錯量子計算。

如果可以，競爭指標就不會是誰的 physical qubit 最多，而是誰能用較低的成本，做出更多、更可靠、真的能運算的 logical qubit。

## 原文

[2026-09-24 的 X 長文](https://x.com/SBG_jerry_1006/status/2102959397714735137)。
