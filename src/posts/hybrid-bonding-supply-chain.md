---
title: "Hybrid Bonding：規格、應用、製程與設備／股票矩陣"
description: "把 Hybrid Bonding 拆成 CMP、金屬化、清洗活化、疊對鍵合、退火、量測檢測六段製程鏈，整理目前規格、應用成熟度，以及對應的設備與個股名單。"
date: "2026-06-09"
category: packaging-sipi
slug: hybrid-bonding-supply-chain
cover: /assets/images/hybrid-bonding-process.webp
coverAlt: "兩片晶片的介電層與銅接點精密對位、準備接合的概念插畫"
tags: [Hybrid Bonding, 先進封裝, 供應鏈, 半導體設備]
status: published
sourceNote: "整理自 2026-06-09 的筆記 v4。表格中的量產／驗證／樣品狀態與時程，都以當天能查到的公開資料為準，不是事後回補；個股資訊僅為研究筆記，不構成投資建議。"
---

<div class="callout">
  <span class="tag">核心判斷</span>
  <p>Hybrid bonding 不是只買一台鍵合機，而是一整條前段級封裝製程鏈。投資拆法應分為：CMP／薄膜與金屬化／清洗活化／疊對鍵合／退火／量測檢測。最直接 pure-play 是 <strong>Besi</strong>；最完整平台型設備是 <strong>AMAT</strong>；<strong>TEL</strong> 是 W2W wafer bonder 與前段製程整合重點；<strong>EBARA</strong> 是 CMP 表面工程重點；常被點名的 <strong>Rigaku</strong> 屬 X-ray metrology／inspection，而非鍵合本機。應用端要補上三條新線：<strong>NAND</strong> 撐量、<strong>HBF</strong> 拉 AI 記憶體階層、<strong>LogicFolding</strong> 拉 logic scaling 想像空間。</p>
</div>

## 1. 目前規格

| 規格項目 | 目前量產／準量產區間 | 下一代／R&D 指標 | 投資含意 |
| --- | --- | --- | --- |
| 接合結構 | Cu-Cu + dielectric-dielectric；常見介電層為 SiO₂／SiCN。 | SiCN 受重視，因 bonding strength 與 Cu diffusion barrier 較佳。 | 薄膜、清洗、表面活化會比傳統封裝更接近前段設備要求。 |
| Pitch | TSMC SoIC 官方說明 bond pitch 從 sub-10µm 起跳；AMD 3D V-Cache 已商用。 | imec／EVG 2026 展示 W2W 200nm Cu pad pitch，屬研究前沿。 | pitch 越小，CMP、overlay、defect inspection 的價值越高。 |
| 對位精度 | Besi 最新訂單等級可到 100nm placement accuracy；EVG W2W SmartView NT3 標榜 sub-50nm alignment；TEL 論文展示 0.5µm pitch W2W、Ds&lt;50nm。 | D2W 將從高精度 pick-and-place 走向更高 throughput 與更低 defectivity；W2W 則看 bonder alignment 與 wafer-level compensation。 | Besi、TEL、EVG、SUSS、ASMPT 是鍵合／疊對端核心名單。 |
| 表面平坦度 | 要求通常 &lt;1nm；Cu recess／dishing 需控制在幾 nm；Cu/polymer 研究中 optimized CMP 後 Cu roughness 可降至 &lt;3nm、height variation &lt;20nm。 | inline metrology 將變成良率閉環的一部分；CMP recipe、slurry、pad、post-clean 都會影響 bonding interface。 | AMAT／EBARA CMP、Nova metrology、Rigaku／SAM／3D X-ray 檢測需求增加。 |
| 熱處理 | 室溫預接合後，再以約 300–400°C 退火促進 Cu-Cu 擴散。 | 量產關鍵是低溫化、縮短 anneal、控制 wafer／die warpage。 | 退火設備、熱預算控制、材料相容性都是 HBM 導入瓶頸。 |

## 2. 目前應用

| 應用 | 成熟度 | 代表公司／平台 | 重點判斷 |
| --- | --- | --- | --- |
| CIS 影像感測器 | <span class="chip c-mass">已成熟量產</span> | Sony、Samsung、Tower | W2W 最早成熟應用，投資故事性低於 AI/HPC，但證明技術可量產。 |
| SoIC／3D logic | <span class="chip c-mass">量產／擴產</span> | TSMC SoIC-X、AMD、NVIDIA、Broadcom、Apple | AI/HPC 先進封裝主線；D2W、KGD 與良率管理是核心。 |
| 3D V-Cache | <span class="chip c-mass">已量產</span> | AMD + TSMC | AMD 官方以 direct copper-to-copper bond 描述，是最清楚的商用案例之一。 |
| Intel Foveros Direct | <span class="chip c-mass">量產導入／平台化</span> | Intel | Intel 將其定義為 hybrid bonding，用於 active chips 高密度 direct stacking。 |
| HBM | <span class="chip c-ramp">驗證／導入期</span> | SK hynix、Samsung、Micron | 不能直接當全面量產；HBM4／HBM4E 才是擴大導入觀察點。 |
| 3D NAND CBA／Xtacking | <span class="chip c-mass">已量產／快速擴散</span> | Kioxia／SanDisk CBA、YMTC Xtacking、SK hynix V10、Samsung V10 | NAND 是 HB 設備的「片數基本盤」：cell array 與 CMOS/periphery 分片製作後 W2W 鍵合，層數往 300–500+ 推時重要性升高。 |
| HBF／High Bandwidth Flash | <span class="chip c-sample">標準化／樣品前期</span> | SanDisk + SK hynix + OCP | AI inference 的高容量中介記憶體層，定位在 HBM 與 SSD 之間；對 NAND、先進封裝、controller/interface IP 形成新觀察線。 |
| LogicFolding／τ law | <span class="chip c-concept">概念／早期商用敘事</span> | Huawei／HiSilicon、北大 3D EDA 原型 | 把 HB 從封裝製程提升到後 EUV logic scaling 敘事；但 yield、thermal、EDA closure 與 PPA 仍需外部驗證，先列高潛力觀察項。 |
| CPO／SiPh／sensor integration | <span class="chip c-sample">早期應用與樣品線</span> | TSMC 生態系、AMAT／Besi 平台 | 偏先進封裝延伸題材，仍須區分 sample、qualification、production。 |

## 3. 製程流程與機台

<ul class="flow">
  <li><div class="n">01</div><div class="t">Wafer／die preparation</div><div class="d">晶圓薄化、切割、KGD 測試；D2W 尤其需要已知良裸晶。</div></li>
  <li><div class="n">02</div><div class="t">介電層沉積</div><div class="d">SiO₂／SiCN，使用 CVD／PECVD／ALD；AMAT Inspera SiCN 屬此段。</div></li>
  <li><div class="n">03</div><div class="t">金屬化</div><div class="d">barrier／seed PVD、Cu ECD 電鍍、蝕刻與圖形化。</div></li>
  <li><div class="n">04</div><div class="t">CMP 平坦化</div><div class="d">控制 Cu dishing／recess 與表面粗糙度，是良率核心瓶頸。</div></li>
  <li><div class="n">05</div><div class="t">Post-CMP clean + plasma activation</div><div class="d">去顆粒、去氧化、活化介電層表面。</div></li>
  <li><div class="n">06</div><div class="t">Alignment + bonding</div><div class="d">W2W 使用 wafer bonder；D2W 使用高精度 die bonder／pick-and-place。</div></li>
  <li><div class="n">07</div><div class="t">Anneal</div><div class="d">促進 Cu-Cu 擴散接合與 dielectric bond 強化。</div></li>
  <li><div class="n">08</div><div class="t">Inspection／metrology</div><div class="d">檢查 overlay、void、delamination、Cu recess、bump／TSV／RDL 結構。</div></li>
</ul>

| 流程段 | 需要機台／能力 | 代表供應商 | 投資觀察點 |
| --- | --- | --- | --- |
| 薄膜沉積 | PECVD／CVD／ALD，SiO₂／SiCN | AMAT、Lam、TEL、ASM Intl | SiCN、低缺陷薄膜、前段級潔淨度 |
| 金屬化 | PVD／ECD／etch | AMAT、Lam、TEL、EBARA plating | Cu pad、barrier、fine pitch 可靠度 |
| CMP | Cu／dielectric CMP、recess／dishing 控制 | AMAT、EBARA、華海清科 | hybrid bonding 的良率控制核心；EBARA 應列核心而非旁支 |
| 清洗活化 | Post-CMP clean、plasma activation、surface treatment | TEL、SUSS、EVG、AMAT、SCREEN | 顆粒、氧化層、表面能控制 |
| W2W bonding | wafer alignment + wafer bonding | TEL、EVG、SUSS | CIS、3D NAND、W2W logic demo；TEL Synapse Si 支援 Cu hybrid bonding |
| D2W bonding | KGD pick-and-place、high-accuracy die bonding | Besi、AMAT Kinex、ASMPT、Hanmi、NAURA | AI/HPC 與 HBM 最值得追的主線 |
| 退火 | low-temp anneal、hydrogen／thermal treatment | HPSP、TEL、Kokusai 等 | 低熱預算、warpage、bond strength |
| 量測檢測 | X-ray、SAM、scatterometry、e-beam、FIB/TEM | Rigaku、Nova、Onto、Camtek、閎康 | void、Cu recess、overlay、RDL／TSV 結構 |

## 4. 相關股票矩陣

| 股票／公司 | 環節 | 對應產品／角色 | 判斷 |
| --- | --- | --- | --- |
| AMAT（AMAT US） | CMP + 薄膜 + 金屬化 + D2W 平台 | Catalyst CMP、Inspera SiCN、PVD/ECD、Kinex D2W hybrid bonding | 最完整平台型設備股；不是只有 CMP，而是把 pre-bond 到 bonding 的前段能力包起來。 |
| TEL（8035 JP） | W2W bonder + deposition／etch／clean | Synapse Si wafer bonder 支援 fusion bonding 與 Cu hybrid bonding；論文用 Tokyo Electron bonder 展示 0.5µm pitch／Ds&lt;50nm | 應升級為第二核心：W2W hybrid bonding、surface activation、clean 與前段製程整合都卡得到。 |
| BESI（BESIY） | D2W hybrid bonder | Datacon 8800 CHAMEO 系列，高精度 die placement／hybrid bonding | 最直接 pure-play；若 D2W 放量，彈性最大，但也最受訂單週期影響。 |
| EBARA（6361 JP） | CMP + plating + bevel／post-polish clean | F-REX CMP；參與 Cu/polymer low-temperature hybrid bonding optimized CMP 研究 | hybrid bonding 的表面工程關鍵股：Cu recess、roughness、height variation 直接決定 bonding quality。 |
| ASMPT（0522 HK） | 高精度 die placement | 與 EVG 合作 D2W hybrid bonding；0.2µm die placement 能力 | D2W 裝配端選項，與手機／OSAT 景氣也有關。 |
| SUSS（SMHN GR） | W2W／collective D2W／sequential D2W bonding | XBC300 Gen2；也有 wafer cleaning／surface prep | 歐系中小型設備股，定位介於 bonder 與清洗活化。 |
| Rigaku（268A JP） | X-ray metrology／inspection | ONYX 3200；advanced packaging 應用含 microbumps、TSV、hybrid bonding | 常被點名的 X 光檢測對應股；偏量測檢測，不是鍵合機。 |
| Nova（NVMI） | inline metrology | Cu recess、surface planarity、scatterometry／ML metrology | pitch 越小，CMP 後 inline metrology 價值越高。 |
| NAURA（002371 CH） | D2W hybrid bonding | 12 吋 Qomola HPD30 D2W，據報通過客戶端製程驗證 | 陸系題材最直接；但驗證不等於放量，須追客戶與營收化。 |
| Hanmi（042700 KS） | HBM 後段設備／hybrid bonder | TC bonder 延伸到 hybrid bonding；與 TES／HPSP 合作線索 | 韓系 HBM 設備選項，仍偏導入與驗證。 |
| TES（095610 KQ） | 乾式清洗／表面處理 | Hanmi 合作環節 | 輔助製程股，不是鍵合主機。 |
| HPSP（403870 KQ） | 退火／氫氣相關熱處理 | Hanmi 合作環節 | HBM hybrid bonding 的低熱預算與表面處理題材。 |
| Hanwha Vision（489790 KS） | Hanwha Semitech 間接窗口 | Hanwha Semitech 為事業部，與 SK hynix 導入線索 | 非純上市設備股；下單前需核對券商端標的與事業部曝險。 |
| Kioxia（285A JP） | NAND CBA／需求端 | BiCS FLASH CBA；CMOS wafer 與 cell array wafer 以 Cu direct bonding 連接 | NAND HB 量的代表標的之一；屬需求端／memory maker，不是設備股。 |
| SanDisk（SNDK US） | NAND／HBF 標準化 | 與 SK hynix 推 HBF 標準化；Kioxia 共同體系也推進 CBA／BiCS | HBF 讓 NAND 從冷儲存往 AI inference 記憶體階層上移。 |
| YMTC（長江存儲） | Xtacking／NAND | W2W array 與 periphery 獨立製作後 wafer bonding；未上市 | NAND hybrid bonding 技術重要案例，但不是可直接買的上市標的。 |
| 閎康（3587 TT） | 材料分析／失效分析服務 | SAM、3D X-ray、FIB/TEM 等分析服務 | 台股檢測服務窗口；不是設備製造商。 |

## 5. 投資排序與成熟度提醒

| 層級 | 標的 | 理由 |
| --- | --- | --- |
| <span class="tier t1">最核心</span> | Besi、AMAT、TEL、EBARA | Besi 是 D2W bonder pure-play；AMAT 是完整製程平台；TEL 是 W2W bonder／clean／process integration；EBARA 是 CMP 表面工程核心。 |
| <span class="tier t2">第二層設備</span> | ASMPT、SUSS、Hanmi、NAURA | 有明確 bonding／placement／HBM 導入題材，但商業化程度差異大。 |
| <span class="tier t3">量測檢測</span> | Rigaku、Nova、Onto、Camtek、閎康 | pitch 縮小後，Cu recess、void、overlay、RDL/TSV inspection 變成良率瓶頸。 |
| <span class="tier t4">需求端</span> | TSMC、AMD、Intel、SK hynix、Samsung、Micron、Kioxia、SanDisk | 不是設備 pure-play；適合用來確認採用節奏與產能路線。NAND/HBF 是 HB 片數與 AI 記憶體階層的新缺角。 |

> 注意：HBM hybrid bonding 目前應視為驗證／導入期，而不是全面量產。NAURA、Hanmi、Hanwha 這類題材股，應把「客戶端驗證」「送樣」「共同開發」與「營收放量」分開看。LogicFolding 目前也應標成高潛力但未充分外部驗證的 roadmap／architecture thesis；相較之下，NAND CBA／Xtacking 是更接近出貨量的 HB 基本盤。

## 6. 來源備註

<details>
<summary>展開全部來源（22 則）</summary>

- [tomshardware.com · Peking University 3D chip design tool](https://www.tomshardware.com/tech-industry/semiconductors/peking-university-builds-3d-chip-design-tool-tailored-to-huaweis-logicfolding-architecture) — LogicFolding／Tau law（secondary source）
- [actuia.com · Huawei LogicFolding 3D density without EUV](https://www.actuia.com/en/news/huawei-announces-logicfolding-3d-density-without-euv-machines-targeting-14-nm-by-2031/) — LogicFolding caveat source
- [sandisk.com · HBF global standardization press release](https://www.sandisk.com/company/newsroom/press-releases/2026/2026-02-25-sandisk-and-sk-hynix-begin-global-standardization-of-next-generation-memory-solution-high-bandwidth-flash-hbf) — SanDisk + SK hynix HBF 官方新聞稿
- [trendforce.com · SK hynix 300-layer V10 NAND, 2027 MP](https://www.trendforce.com/news/2025/12/08/news-sk-hynix-reportedly-accelerates-hybrid-bonding-for-300-layer-v10-nand-eying-2027-mass-production/) — SK hynix V10 NAND／hybrid bonding report
- [kioxia.com · CBA technology explainer](https://www.kioxia.com/en-jp/rd/technology/cba.html) — Kioxia CBA 官方說明
- [ymtc.com · Xtacking technical introduction](https://www.ymtc.com/en/technicalintroduction.html) — YMTC Xtacking 官方說明
- TEL ECTC 2023，0.5µm pitch hybrid bonding（使用者提供 PDF）— 0.25µm pads at 0.5µm pitch、Ds&lt;50nm、Tokyo Electron bonder
- Low-Temperature Epoxy-based Cu/Polymer Hybrid Bonding with Optimized CMP（使用者提供 PDF）— Ebara 參與、optimized CMP、200°C bonding、Cu roughness／height variation
- [matek.com · hybrid bonding technical article](https://www.matek.com/zh-TW/Tech_Article/detail/all/all/202207-IAR) — MA-tek hybrid bonding 技術文章
- [tel.com/product](https://www.tel.com/product/) — TEL product line／Synapse Si wafer bonder
- [ebara.com · precision／CMP](https://www.ebara.com/global-en/precision/cmp/) — EBARA semiconductor manufacturing equipment／CMP
- [3dfabric.tsmc.com · SoIC](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/SoIC.htm) — TSMC SoIC 官方頁
- [amd.com · 3D V-Cache](https://www.amd.com/en/products/processors/technologies/3d-v-cache.html) — AMD 3D V-Cache 官方頁
- [intel.com · advanced process technologies for data center](https://www.intel.com/content/www/us/en/foundry/library/advanced-process-technologies-for-data-center.html) — Intel Foundry advanced packaging／Foveros Direct
- [besi.com · order for 26 hybrid bonding systems](https://www.besi.com/investor-relations/press-releases/2024/details/be-semiconductor-industries-nv-announces-order-for-26-hybrid-bonding-systems/) — Besi hybrid bonding order／placement accuracy
- [evgroup.com · SmartView NT3 wafer bonding](https://www.evgroup.com/company/news/detail/ev-group-accelerates-3d-ic-packaging-roadmap-with-breakthrough-wafer-bonding-technology-1549022748) — EVG SmartView NT3 W2W alignment
- [suss.com · permanent bonding](https://www.suss.com/en/products-solutions/bonding-solutions/permanent-bonding) — SUSS permanent bonding／XBC300 Gen2
- [asmpt.com · ASMPT & EV Group collaboration](https://www.asmpt.com/en/investor-relations/news-events/asmpt-and-ev-group-collaboration/) — ASMPT + EVG D2W collaboration
- [rigaku.com · advanced packaging metrology](https://rigaku.com/products/semiconductor-metrology/application-notes/packaging) — Rigaku advanced packaging metrology
- [novami.com · inline monitoring of Cu recess](https://www.novami.com/publications/inline-monitoring-of-hybrid-bonding-cu-recess-with-vertical-traveling-scatterometry-machine-learning/) — Nova Cu recess metrology
- [trendforce.com · NAURA hybrid bonding tool at SEMICON China](https://www.trendforce.com/news/2026/03/26/news-naura-reportedly-unveils-hybrid-bonding-tool-at-semiconchina-sicarrier-last-years-lithography-standout-misses-show/) — TrendForce／NAURA hybrid bonding tool report
- [trendforce.com · SK hynix 12-Hi HBM hybrid bonding validation](https://www.trendforce.com/news/2026/04/29/news-sk-hynix-reportedly-completes-12-high-hybrid-bonding-hbm-validation-works-to-raise-yields-for-mass-production/) — TrendForce／SK hynix HBM hybrid bonding validation
- [rigaku-holdings.com · IR FAQ](https://rigaku-holdings.com/english/ir/faq/) — Rigaku Holdings IR FAQ／ticker

</details>
