/* =============================================================================
 *  content.js — 网站上「所有会改的东西」都在这一个文件里
 * =============================================================================
 *  改文字、改价格、改联络方式、改图片档名 —— 全部在这里改，不用碰 App.jsx。
 *
 *  目录：
 *    1. 联络资料（WhatsApp / 电话 / Email）
 *    2. 图片路径
 *    3. 单位资料 UNITS（户型、面积、价格、租金、回报率）
 *    4. 相册图片 GALLERY_IMAGES
 *    5. 新闻图片 MEDIA_IMAGES
 *    6. 双语文字 translations（en = 英文，zh = 中文）
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * 1. 联络资料
 * ------------------------------------------------------------------------ */

export const WHATSAPP_NUMBER = "60179436799"; // 国际格式，不要 + 号。目前 = +6017-9436799
export const WHATSAPP_TEXT =
  "Hi, I'm interested in HAUS ON 15, please send me more details"; // 点 WhatsApp 按钮时预填的讯息
/* ---- 广告追踪 ID（没有就留空字串，网站照常跑）----------------------------
 *  META_PIXEL_ID：Meta 企业管理平台 → 事件管理工具 → 你的像素，一串数字
 *  GA4_ID       ：Google Analytics → 管理 → 资料串流，G- 开头
 *  填好之后重新部署一次才会生效。
 * ------------------------------------------------------------------------- */
export const META_PIXEL_ID = "1425633976106146";
export const GA4_ID = "G-GZGMQ2JB12";

/*  Google Ads（投搜寻广告用的，跟 GA4 是两套东西）
 *  GOOGLE_ADS_ID：AW- 开头，就是 Google Ads 给你的那串
 *  GOOGLE_ADS_LABELS：每个「转换动作」会有自己的标签，长得像 AbC-D_efGhIjK
 *    去 Google Ads → 目标 → 转换 → 建立转换动作 → 选「手动安装代码」，
 *    它给你的 send_to 会是 AW-18407900010/AbC-D_efGhIjK，斜线后面那段就是标签。
 *    没填的话广告后台还是收得到流量和再行销名单，只是不会记录转换。 */
export const GOOGLE_ADS_ID = "AW-18407900010";
export const GOOGLE_ADS_LABELS = {
  lead: "",     // 留资表单送出成功
  whatsapp: "", // 点 WhatsApp
};

export const CONTACT_EMAIL = "hauson15residence@gmail.com"; // 页尾的邮箱
export const CONTACT_PHONE_DISPLAY = "+6017-9436799"; // 页尾显示的电话号码
export const CONTACT_PHONE_TEL = "60179436799"; // 点电话时真正拨出去的号码（国际格式，不要 + 号）

// 产生 WhatsApp 链接（extra = 该按钮专属的讯息，不填就用上面的 WHATSAPP_TEXT）
export const waLink = (extra) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(extra || WHATSAPP_TEXT)}`;

/* ---------------------------------------------------------------------------
 * 2. 图片路径
 *    所有图片放在 public/renders/ 里面。这里只写档名。
 * ------------------------------------------------------------------------ */

export const IMG = (name) => `${process.env.PUBLIC_URL || ""}/renders/${name}`;

/* ---------------------------------------------------------------------------
 * 3. 单位资料（户型表 + 平面图页面都用这一份）
 *    size = 平方尺 · price = 售价 RM · rent = 预估月租 RM · yield = 毛回报率 %
 *    keyType = single / dual / triple（单、双、三钥匙）
 *    plan = public/renders/ 里的平面图档名
 * ------------------------------------------------------------------------ */

//  installment = 预估每月供期（假设：贷款 90%、35 年、年利率 4.4%，四舍五入到 RM50）
//  利率或贷款成数变了，直接改下面的数字就行
export const UNITS = [
  { type: "A", beds: 2, baths: 2, size: "690", price: 663120, installment: 2800, rent: 4220, yield: "7.6", keyType: "single", img: "interior-living.jpg", plan: "floorplan-A.jpg" },
  { type: "B", beds: 3, baths: 2, size: "830", price: 826020, installment: 3450, rent: 5760, yield: "8.4", keyType: "dual",   img: "interior-lounge.jpg", plan: "floorplan-B.jpg" },
  { type: "C", beds: 3, baths: 2, size: "905", price: 844020, installment: 3550, rent: 5848, yield: "8.3", keyType: "single", img: "interior-living.jpg", plan: "floorplan-C.jpg" },
  { type: "D", beds: 3, baths: 2, size: "960", price: 874620, installment: 3700, rent: 6464, yield: "8.9", keyType: "dual",   img: "interior-lounge.jpg", plan: "floorplan-D.jpg" },
  { type: "E", beds: 3, baths: 3, size: "980", price: 889020, installment: 3750, rent: 6620, yield: "9.0", keyType: "triple", img: "interior-living.jpg", plan: "floorplan-E.jpg" },
];

/* ---------------------------------------------------------------------------
 * 4. 相册图片（顺序 = 网页上显示的顺序）
 *    图片说明文字在下面 translations 的 gallery.items，顺序要对得上。
 * ------------------------------------------------------------------------ */

export const GALLERY_IMAGES = [
  { img: "birdseye.jpg",   span: "wide" },
  { img: "newgallerypic2.jpeg", span: "tall" },
  { img: "facade.jpg",     span: "normal" },
  { img: "newgallerypic1.jpeg", span: "normal" },
  { img: "walkway.jpg",    span: "wide" },
  { img: "dropoff-a.jpg",  span: "tall" },
  { img: "alfresco-c.jpg", span: "normal" },
  { img: "alfresco-a.jpg", span: "normal" },
];

/* ---------------------------------------------------------------------------
 * 5. 媒体报道配图（顺序对应下面 translations 的 media.items）
 * ------------------------------------------------------------------------ */

export const MEDIA_IMAGES = ["news-1.jpg", "news-2.jpg", "news-3.jpg"];

/* 首屏封面大图。换封面：把新图放进 public/renders/，然后把下面的档名改掉 */
export const HERO_IMAGE = "newbackgroundpic1.jpeg";

/* Gamuda Land × Taylor's 合作区块用的照片。
   换照片：把照片放进 public/renders/，然后把下面的档名改成新的档名。 */
export const PARTNERSHIP_IMAGE = "gamuda-taylors.jpg"; // 2026-07-02 动土礼合照

/* ---------------------------------------------------------------------------
 * 6. 双语文字
 *    en = 英文版，zh = 中文版。两边的结构必须一模一样，只是文字不同。
 *    要加/删一个项目（例如多一个数据卡），记得 en 和 zh 都要改。
 * ------------------------------------------------------------------------ */

export const translations = {
  en: {
    header: { enquire: "Enquire", chat: "Chat" },
    hero: {
      badge: "Gamuda Land · Freehold · SS15",
      tagline: "The Last Piece of Land in SS15 — the final freehold address, engineered for yields up to 9%.",
      cta: "Enquire on WhatsApp",
      explore: "View residences",
      scroll: "Scroll to explore",
    },
    stats: [
      { key: "tenure",     value: "Freehold", label: "Tenure" },
      { key: "size",       value: "690–980", label: "Sq ft built-up" },
      { key: "yield",      value: "8–9%", label: "High rental demand yield" },
      { key: "price",      value: "RM663K", label: "Starting price" },
      { key: "completion", value: "Q4 2029", label: "Estimated completion" },
      { key: "students",   value: "82,628+", label: "Students within 5km" },
    ],
    partnership: {
      title: "Gamuda Land  ×  Taylor's",
      photoCaption: "Groundbreaking Ceremony · 2 July 2026",
      caption: "Team up for |RM540 Million| SS15 mixed use development",  // | 之间的字会变金色
      note: "Backed by Gamuda Land — one of Malaysia's most trusted developers, with a track record of award-winning, high-growth townships.",
    },
    manifesto: {
      eyebrow: "Why invest",
      heading: "Four reasons this address won't wait.",
      chapters: [
        { no: "01", key: "land", title: "The Last Piece of Land in SS15", body: "SS15 Subang Jaya's final freehold development. Land here is finite — once it's gone, it's gone. Own a freehold title in a township that stopped making them." },
        { no: "02", key: "tenants", title: "A built-in tenant base", body: "82,628 students live within a 5km radius, surrounded by universities, colleges and a mature commercial heart. Demand for rooms is structural, not seasonal." },
        { no: "03", key: "layouts", title: "Layouts engineered to earn", body: "Dual-key and triple-key floor plans let a single unit house multiple tenants — pushing achievable gross yields as high as 9% per annum." },
        { no: "04", key: "connectivity", title: "Connected to everything", body: "8 minutes’ walk to LRT SS15, moments from Federal Highway, NPE, KESAS & LDP, Sunway Pyramid, Sunway Medical and Taylor's — all at your doorstep." },
      ],
    },
    units: {
      eyebrow: "The residences",
      heading: "Five layouts. Built to be rented.",
      sub: "Single, dual and triple-key configurations from 690 to 980 sq ft. Swipe to compare.",
      from: "From", perMo: "/mo", cta: "Get the full price list", viewPlan: "View floor plan",
      keyLabels: { single: "Single key", dual: "Dual key", triple: "Triple key" },
      bed: "R", bath: "B",
      roi: "ROI",
      swipeHint: "Swipe to see all 5 layouts",
      rentNote: "*Nett Rental calculated after deduction of Management Fee, Utilities, Maintenance Fee.",
      typeWord: "Type",
      sqft: "SQ FT",
      bedsFull: "Bedrooms",
      bathsFull: "Bathrooms",
      installmentLabel: "Monthly installment",
      nettRental: "Est nett rental*",
      installmentNote: "Monthly installment is an estimate — 90% loan, 35 years, 4.4% p.a.",
      enquireLayout: "Enquire about this layout",
    },
    nav: { residences: "Residences", gallery: "Gallery", location: "Location", register: "Register" },
    floorplans: { enlarge: "Tap to enlarge · pinch to zoom", resetZoom: "Reset" },
    glance: {
      eyebrow: "At a glance",
      heading: "The essentials.",
      rows: [
        { key: "developer",  k: "Developer", v: "Gamuda Land" },
        { key: "location",   k: "Location", v: "SS15, Subang Jaya, Selangor" },
        { key: "land",       k: "Land size", v: "2.88 acres" },
        { key: "units",      k: "Total units", v: "522 serviced apartments" },
        { key: "type",       k: "Development type", v: "Mixed — residences · student suites · retail" },
        { key: "tenure",     k: "Tenure", v: "Freehold" },
        { key: "layouts",    k: "Available layouts", v: "690 – 980 sq ft · Type A–E" },
        { key: "fee",        k: "Maintenance fee", v: "RM0.44 per sq ft" },
        { key: "completion", k: "Estimated completion", v: "Q4 2029" },
        { key: "carpark",    k: "Carpark", v: "1 – 2 bays per unit" },
      ],
    },
    facilities: {
      eyebrow: "Facilities",
      heading: "Amenities that earn their keep.",
      note: "Facilities shown are artist's impressions and indicative only.",
      items: [
        { key: "pool", label: "Infinity Pool" },
        { key: "lounge", label: "Sky Lounge" },
        { key: "gym", label: "Gymnasium" },
        { key: "garden", label: "Sky Garden" },
        { key: "bbq", label: "BBQ" },
        { key: "play", label: "Children's Playground" },
        { key: "cowork", label: "Co-working Space" },
        { key: "hall", label: "Multipurpose Hall" },
        { key: "security", label: "24/7 Security" },
      ],
    },
    rental: {
      eyebrow: "Rental demand",
      heading: "Tenants, guaranteed.",
      body: "Over 82,000 students live within 5km — anchored by INTI, Taylor's, Monash and Sunway. A deep, year-round tenant pool right at your doorstep.",

      /* 下面是「周边院校学生人数」图表。改数字、加减院校都在这里，
         中间圆圈的 total 记得自己加总。clusters 四组 = 左上、左下、右上、右下。 */
      chartTitle: "Institutions surrounding",
      studentLabel: "Student population",
      studentWord: "Students",
      totalLabel: "Total",
      total: "82,628",
      totalSub: "Student Population\nWithin 5KM",
      clusters: [
        { name: "SS15", count: "23,078", items: [
          { name: "Gen Education Malaysia", students: "320+" },
          { name: "Asia E University", students: "4,758+" },
          { name: "INTI International College", students: "10,000+" },
          { name: "UMS Seafield International College", students: "8,000+" },
        ] },
        { name: "USJ", count: "14,650", items: [
          { name: "ALFA University College", students: "950+" },
          { name: "SEGi College", students: "10,000+" },
          { name: "International Medical College", students: "3,700+" },
        ] },
        { name: "Sunway", count: "22,900", items: [
          { name: "The One Academy", students: "2,500+" },
          { name: "Sunway University College", students: "12,000+" },
          { name: "Monash University Malaysia", students: "8,400+" },
        ] },
        { name: "Taylor's Lakeside Campus", count: "22,000", items: [
          { name: "Taylor's Lakeside Campus", students: "22,000+" },
        ] },
      ],
    },
    media: {
      eyebrow: "As featured in",
      heading: "Backed by Gamuda Land.",
      sub: "One of Malaysia's most trusted developers — a track record of award-winning, high-growth townships.",
      items: [
        { source: "The Edge", title: "Gamuda, Taylor's plan RM500mil SS15 redevelopment" },
        { source: "The Star", title: "From Legacy to Future: Reimagining Taylor's SS15 with Gamuda Land" },
        { source: "The Star", title: "Gamuda Land & Taylor's Education Group join forces to bring affordable private education" },
      ],
    },
    register: {
      eyebrow: "Register",
      heading: "Register your interest.",
      sub: "Limited release — register now for priority access to the best units, latest pricing and the full e-brochure.",
      name: "Your name", phone: "Phone number", email: "Email address",
      floorplan: "Interested floor plan", notSure: "Not sure yet",
      submit: "Register now", submitting: "Sending…",
      success: "Thank you!", successSub: "We've received your details and will be in touch shortly.",
      download: "Download price list (PDF)",
      orWhatsapp: "Or chat with us instantly on WhatsApp",
      errRequired: "Please fill in all fields.",
      errFailed: "Something went wrong. Please try again or use WhatsApp.",
    },
    gallery: {
      eyebrow: "The vision",
      heading: "Gallery",
      items: ["Bird's-Eye View", "Landscaped Walkway", "Serviced Apartment Facade", "Residences Drop-Off", "Pedestrian Walkway", "Block A Drop-Off", "Block C Alfresco", "Block A Alfresco"],
    },
    location: {
      eyebrow: "Location & connectivity",
      heading: "At the heart of\nSubang Jaya SS15.", // \n = 强制换行
      students: "students within 5km", lrt: "walk to LRT SS15",
    },
    amenities: {
      eyebrow: "The neighbourhood",
      heading: "Everything within reach.",
      radius: "Radius",
      categories: [
        { key: "shopping", label: "Shopping", items: [
          { name: "SS15 Courtyard", dist: "500m" },
          { name: "Subang Parade", dist: "900m" },
          { name: "NU Empire", dist: "1.1km" },
          { name: "Sunway Pyramid", dist: "1.4km" },
          { name: "Sunway Square Mall", dist: "1.8km" },
          { name: "Sunway GEO Avenue", dist: "2.2km" },
        ] },
        { key: "medical", label: "Medical", items: [
          { name: "Subang Jaya Medical Centre", dist: "500m" },
          { name: "Sunway Medical Centre", dist: "2km" },
        ] },
        { key: "education", label: "Education", items: [
          { name: "INTI International College Subang", dist: "10m" },
          { name: "Sri Kuala Lumpur International School", dist: "10m" },
          { name: "Asia e University", dist: "120m" },
          { name: "Monash University Malaysia", dist: "1.4km" },
          { name: "Sunway University", dist: "1.5km" },
          { name: "SEGi College", dist: "2.3km" },
          { name: "The One Academy", dist: "2.4km" },
          { name: "Taylor's University Lakeside Campus", dist: "2.9km" },
        ] },
        { key: "leisure", label: "Leisure", items: [
          { name: "Subang Ria Recreational Park", dist: "600m" },
          { name: "Kelab Golf Negara Subang", dist: "1km" },
          { name: "Sunway Lagoon", dist: "1.6km" },
        ] },
        { key: "connectivity", label: "Connectivity", items: [
          { name: "SS15 LRT Station", dist: "500m" },
          { name: "LRT Kelana Jaya Line", dist: "Direct" },
          { name: "Federal Highway", dist: "Direct" },
          { name: "NPE · KESAS · LDP", dist: "Direct" },
          { name: "BRT Sunway Line", dist: "Nearby" },
        ] },
      ],
    },
    footer: {
      tagline: "Freehold serviced apartments, student residences & strata shops in the heart of Subang Jaya SS15. Est. completion Q4 2029.",
      contact: "Contact",
      disclaimer: "All visuals are artist's impressions for reference only and do not form part of any offer or contract.",
    },
    plan: { title: "Floor Plan", hint: "Tap image to zoom · drag to pan", close: "Close" },
  },

  zh: {
    header: { enquire: "咨询", chat: "咨询" },
    hero: {
      badge: "金务大 · 永久地契 · SS15",
      tagline: "SS15 最后一块地 —— 最后的永久地契名邸，租金回报高达 9%。",
      cta: "WhatsApp 咨询",
      explore: "查看单位",
      scroll: "向下浏览",
    },
    stats: [
      { key: "tenure",     value: "永久地契", label: "产权保障" },
      { key: "size",       value: "690–980", label: "平方尺 建筑面积" },
      { key: "yield",      value: "8–9%", label: "高租金需求回报" },
      { key: "price",      value: "RM663K", label: "起价" },
      { key: "completion", value: "Q4 2029", label: "预计完工" },
      { key: "students",   value: "82,628+", label: "5 公里内学生" },
    ],
    partnership: {
      title: "Gamuda Land  ×  Taylor's",
      photoCaption: "动土仪式 · 2026 年 7 月 2 日",
      caption: "携手打造 |RM5.4 亿| SS15 综合发展项目",  // | 之间的字会变金色
      note: "由 Gamuda Land 开发 —— 马来西亚最受信赖的发展商之一，屡获殊荣的高增值社区开发纪录。",
    },
    manifesto: {
      eyebrow: "为何投资",
      heading: "四个理由，机不可失。",
      chapters: [
        { no: "01", key: "land", title: "SS15 最后一块地", body: "SS15 梳邦再也最后一块永久地契发展。土地有限，售罄不再。在停止批出永久地契的成熟社区拥有一席之地。" },
        { no: "02", key: "tenants", title: "天然租客群", body: "5 公里内有 82,628 名学生，环绕多所大学、学院与成熟商圈。租房需求稳定而非季节性。" },
        { no: "03", key: "layouts", title: "为收益而生的间隔", body: "双钥匙与三钥匙间隔让单一单位可分租多户，毛租金回报高达每年 9%。" },
        { no: "04", key: "connectivity", title: "四通八达", body: "步行 8 分钟到 SS15 轻快铁，紧邻联邦大道、NPE、KESAS、LDP，以及双威金字塔、双威医疗与泰莱大学。" },
      ],
    },
    units: {
      eyebrow: "精选单位",
      heading: "五款间隔，为出租而生。",
      sub: "单钥匙、双钥匙与三钥匙间隔，690 至 980 平方尺。左右滑动比较。",
      from: "起价", perMo: "/月", cta: "索取完整价目表", viewPlan: "查看平面图",
      keyLabels: { single: "单钥匙", dual: "双钥匙", triple: "三钥匙" },
      bed: "房", bath: "卫",
      roi: "ROI 回报率",
      swipeHint: "左右滑动看完 5 款户型",
      rentNote: "*净租金已扣除管理费、水电费与维护费。",
      typeWord: "户型",
      sqft: "平方尺",
      bedsFull: "房",
      bathsFull: "卫浴",
      installmentLabel: "每月供期",
      nettRental: "预估净租金*",
      installmentNote: "每月供期为预估值 —— 贷款 90%、35 年、年利率 4.4%。",
      enquireLayout: "咨询这个户型",
    },
    nav: { residences: "单位", gallery: "相册", location: "位置", register: "登记" },
    floorplans: { enlarge: "点击放大 · 双指缩放", resetZoom: "复原" },
    glance: {
      eyebrow: "项目速览",
      heading: "核心资料。",
      rows: [
        { key: "developer",  k: "开发商", v: "金务大 Gamuda Land" },
        { key: "location",   k: "地段", v: "梳邦再也 SS15，雪兰莪" },
        { key: "land",       k: "占地面积", v: "2.88 英亩" },
        { key: "units",      k: "总单位数", v: "522 服务式公寓" },
        { key: "type",       k: "物业类型", v: "综合发展 — 住宅 · 学生公寓 · 商铺" },
        { key: "tenure",     k: "产权", v: "永久地契" },
        { key: "layouts",    k: "主力户型", v: "690 – 980 平方尺 · A–E 户型" },
        { key: "fee",        k: "管理费", v: "RM0.44 / 平方尺" },
        { key: "completion", k: "预计完工", v: "2029 年第四季" },
        { key: "carpark",    k: "车位", v: "每单位 1 – 2 个" },
      ],
    },
    facilities: {
      eyebrow: "设施",
      heading: "为生活加值的设施。",
      note: "设施为艺术示意图，仅供参考。",
      items: [
        { key: "pool", label: "无边泳池" },
        { key: "lounge", label: "空中酒廊" },
        { key: "gym", label: "健身房" },
        { key: "garden", label: "空中花园" },
        { key: "bbq", label: "烧烤区" },
        { key: "play", label: "儿童游乐区" },
        { key: "cowork", label: "共享办公空间" },
        { key: "hall", label: "多功能厅" },
        { key: "security", label: "24 小时保安" },
      ],
    },
    rental: {
      eyebrow: "租赁需求",
      heading: "租客无忧。",
      body: "5 公里内逾 82,000 名学生，环绕 INTI、泰莱、莫纳什与双威等院校 —— 全年稳定的庞大租客群，近在咫尺。",

      chartTitle: "周边教育机构",
      studentLabel: "学生人数",
      studentWord: "学生",
      totalLabel: "总计",
      total: "82,628",
      totalSub: "5 公里内\n学生人数",
      clusters: [
        { name: "SS15", count: "23,078", items: [
          { name: "Gen Education Malaysia", students: "320+" },
          { name: "Asia E University", students: "4,758+" },
          { name: "INTI International College", students: "10,000+" },
          { name: "UMS Seafield International College", students: "8,000+" },
        ] },
        { name: "USJ", count: "14,650", items: [
          { name: "ALFA University College", students: "950+" },
          { name: "SEGi College", students: "10,000+" },
          { name: "International Medical College", students: "3,700+" },
        ] },
        { name: "Sunway", count: "22,900", items: [
          { name: "The One Academy", students: "2,500+" },
          { name: "Sunway University College", students: "12,000+" },
          { name: "Monash University Malaysia", students: "8,400+" },
        ] },
        { name: "Taylor's Lakeside Campus", count: "22,000", items: [
          { name: "Taylor's Lakeside Campus", students: "22,000+" },
        ] },
      ],
    },
    media: {
      eyebrow: "媒体报道",
      heading: "由金务大 Gamuda Land 打造。",
      sub: "马来西亚最受信赖的发展商之一 —— 屡获殊荣、增值强劲的城镇开发往绩。",
      items: [
        { source: "The Edge", title: "金务大与泰莱携手，打造 RM5 亿 SS15 重建计划" },
        { source: "The Star", title: "从传承到未来：金务大重塑泰莱 SS15" },
        { source: "The Star", title: "金务大与泰莱教育集团联手，为社区带来可负担的私立教育" },
      ],
    },
    register: {
      eyebrow: "登记",
      heading: "登记您的兴趣。",
      sub: "限量发售 —— 立即登记，优先获取最佳单位、最新价格与完整电子手册。",
      name: "您的姓名", phone: "联系电话", email: "电子邮箱",
      floorplan: "感兴趣的平面图", notSure: "尚未确定",
      submit: "立即登记", submitting: "提交中…",
      success: "感谢您！", successSub: "我们已收到您的资料，将尽快与您联系。",
      download: "下载价目表（PDF）",
      orWhatsapp: "或立即透过 WhatsApp 联系我们",
      errRequired: "请填写所有栏位。",
      errFailed: "提交失败，请再试一次，或直接用 WhatsApp 联系我们。",
    },
    gallery: {
      eyebrow: "项目愿景",
      heading: "相册",
      items: ["鸟瞰图", "绿化步道", "服务式公寓外观", "住宅落客区", "人行步道", "A 座落客区", "C 座露天广场", "A 座露天广场"],
    },
    location: {
      eyebrow: "地理位置与交通",
      heading: "坐落梳邦再也 SS15 核心。",
      students: "5 公里内学生人数", lrt: "步行至 SS15 轻快铁",
    },
    amenities: {
      eyebrow: "周边配套",
      heading: "生活所需，近在咫尺。",
      radius: "距离",
      categories: [
        { key: "shopping", label: "购物", items: [
          { name: "SS15 Courtyard", dist: "500m" },
          { name: "Subang Parade", dist: "900m" },
          { name: "NU Empire", dist: "1.1km" },
          { name: "Sunway Pyramid", dist: "1.4km" },
          { name: "Sunway Square Mall", dist: "1.8km" },
          { name: "Sunway GEO Avenue", dist: "2.2km" },
        ] },
        { key: "medical", label: "医疗", items: [
          { name: "Subang Jaya Medical Centre", dist: "500m" },
          { name: "Sunway Medical Centre", dist: "2km" },
        ] },
        { key: "education", label: "教育", items: [
          { name: "INTI International College Subang", dist: "10m" },
          { name: "Sri Kuala Lumpur International School", dist: "10m" },
          { name: "Asia e University", dist: "120m" },
          { name: "Monash University Malaysia", dist: "1.4km" },
          { name: "Sunway University", dist: "1.5km" },
          { name: "SEGi College", dist: "2.3km" },
          { name: "The One Academy", dist: "2.4km" },
          { name: "Taylor's University Lakeside Campus", dist: "2.9km" },
        ] },
        { key: "leisure", label: "休闲", items: [
          { name: "Subang Ria Recreational Park", dist: "600m" },
          { name: "Kelab Golf Negara Subang", dist: "1km" },
          { name: "Sunway Lagoon", dist: "1.6km" },
        ] },
        { key: "connectivity", label: "交通", items: [
          { name: "SS15 LRT Station", dist: "500m" },
          { name: "LRT Kelana Jaya Line", dist: "直达" },
          { name: "Federal Highway", dist: "直达" },
          { name: "NPE · KESAS · LDP", dist: "直达" },
          { name: "BRT Sunway Line", dist: "邻近" },
        ] },
      ],
    },
    footer: {
      tagline: "永久地契服务式公寓、学生公寓及商铺，坐落梳邦再也 SS15 核心地段。预计 2029 年第四季完工。",
      contact: "联系我们",
      disclaimer: "所有图像均为艺术示意图，仅供参考，不构成任何要约或合约的一部分。",
    },
    plan: { title: "平面图", hint: "点击图片放大 · 拖动平移", close: "关闭" },
  },
};
