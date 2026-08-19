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

export const WHATSAPP_NUMBER = "60126501692"; // 国际格式，不要 + 号。目前 = +6012-6501692
export const WHATSAPP_TEXT =
  "Hi, I'm interested in HAUS ON 15, please send me more details"; // 点 WhatsApp 按钮时预填的讯息
export const CONTACT_EMAIL = "sales@hauson15.com"; // TODO: 换成你真正的邮箱
export const CONTACT_PHONE_DISPLAY = "+6012-6501692"; // 页尾显示的电话号码

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

export const UNITS = [
  { type: "A", beds: 2, baths: 2, size: "690", price: 663120, rent: 4220, yield: "7.6", keyType: "single", img: "interior-living.jpg", plan: "floorplan-A.jpg" },
  { type: "B", beds: 3, baths: 2, size: "830", price: 826020, rent: 5760, yield: "8.4", keyType: "dual",   img: "interior-lounge.jpg", plan: "floorplan-B.jpg" },
  { type: "C", beds: 3, baths: 2, size: "905", price: 844020, rent: 5848, yield: "8.3", keyType: "single", img: "interior-living.jpg", plan: "floorplan-C.jpg" },
  { type: "D", beds: 3, baths: 2, size: "960", price: 874620, rent: 6464, yield: "8.9", keyType: "dual",   img: "interior-lounge.jpg", plan: "floorplan-D.jpg" },
  { type: "E", beds: 3, baths: 3, size: "980", price: 889020, rent: 6620, yield: "9.0", keyType: "triple", img: "interior-living.jpg", plan: "floorplan-E.jpg" },
];

/* ---------------------------------------------------------------------------
 * 4. 相册图片（顺序 = 网页上显示的顺序）
 *    图片说明文字在下面 translations 的 gallery.items，顺序要对得上。
 * ------------------------------------------------------------------------ */

export const GALLERY_IMAGES = [
  { img: "birdseye.jpg",   span: "wide" },
  { img: "birdseye2.jpg",  span: "tall" },
  { img: "facade.jpg",     span: "normal" },
  { img: "dropoff-c.jpg",  span: "normal" },
  { img: "walkway.jpg",    span: "wide" },
  { img: "dropoff-a.jpg",  span: "tall" },
  { img: "alfresco-c.jpg", span: "normal" },
  { img: "alfresco-a.jpg", span: "normal" },
];

/* ---------------------------------------------------------------------------
 * 5. 媒体报道配图（顺序对应下面 translations 的 media.items）
 * ------------------------------------------------------------------------ */

export const MEDIA_IMAGES = ["news-1.jpg", "news-2.jpg", "news-3.jpg"];

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
      { value: "Freehold", label: "Freehold tenure" },
      { value: "690–980", label: "Sq ft built-up" },
      { value: "8–9%", label: "High rental demand yield" },
      { value: "RM663K", label: "Starting price" },
      { value: "Q4 2029", label: "Estimated completion" },
      { value: "82,000+", label: "Students within 5km" },
    ],
    marquee: ["Freehold", "Subang Jaya SS15", "Serviced Apartments", "High Yield", "The Last of Its Kind"],
    manifesto: {
      eyebrow: "Why invest",
      heading: "Four reasons this address won't wait.",
      chapters: [
        { no: "01", title: "The Last Piece of Land in SS15", body: "SS15 Subang Jaya's final freehold development. Land here is finite — once it's gone, it's gone. Own a freehold title in a township that stopped making them." },
        { no: "02", title: "A built-in tenant base", body: "82,628 students live within a 5km radius, surrounded by universities, colleges and a mature commercial heart. Demand for rooms is structural, not seasonal." },
        { no: "03", title: "Layouts engineered to earn", body: "Dual-key and triple-key floor plans let a single unit house multiple tenants — pushing achievable gross yields as high as 9% per annum." },
        { no: "04", title: "Connected to everything", body: "12 minutes to LRT SS15, moments from Federal Highway, NPE, KESAS & LDP, Sunway Pyramid, Sunway Medical and Taylor's — all at your doorstep." },
      ],
    },
    units: {
      eyebrow: "The residences",
      heading: "Five layouts. Built to be rented.",
      sub: "Single, dual and triple-key configurations from 690 to 980 sq ft. Swipe to compare.",
      from: "From", perMo: "/mo", cta: "Get the full price list", viewPlan: "View floor plan",
      keyLabels: { single: "Single key", dual: "Dual key", triple: "Triple key" },
      bed: "R", bath: "B",
    },
    nav: { residences: "Residences", gallery: "Gallery", location: "Location", register: "Register" },
    floorplans: { enlarge: "Tap plan to enlarge" },
    glance: {
      eyebrow: "At a glance",
      heading: "The essentials.",
      rows: [
        { k: "Developer", v: "Gamuda Land" },
        { k: "Location", v: "SS15, Subang Jaya, Selangor" },
        { k: "Land size", v: "2.88 acres" },
        { k: "Total units", v: "522 serviced apartments" },
        { k: "Development type", v: "Mixed — residences · student suites · retail" },
        { k: "Tenure", v: "Freehold" },
        { k: "Available layouts", v: "690 – 980 sq ft · Type A–E" },
        { k: "Maintenance fee", v: "On request" },
        { k: "Estimated completion", v: "Q4 2029" },
        { k: "Carpark", v: "1 – 2 bays per unit" },
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
      items: ["Bird's-Eye View", "Aerial Masterplan", "Serviced Apartment Facade", "Block C Drop-Off", "Pedestrian Walkway", "Block A Drop-Off", "Block C Alfresco", "Block A Alfresco"],
    },
    location: {
      eyebrow: "Location & connectivity",
      heading: "At the heart of Subang Jaya SS15.",
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
      { value: "永久地契", label: "产权保障" },
      { value: "690–980", label: "平方尺 建筑面积" },
      { value: "8–9%", label: "高租金需求回报" },
      { value: "RM663K", label: "起价" },
      { value: "Q4 2029", label: "预计完工" },
      { value: "82,000+", label: "5 公里内学生" },
    ],
    marquee: ["永久地契", "梳邦再也 SS15", "服务式公寓", "高租金回报", "绝版之作"],
    manifesto: {
      eyebrow: "为何投资",
      heading: "四个理由，机不可失。",
      chapters: [
        { no: "01", title: "SS15 最后一块地", body: "SS15 梳邦再也最后一块永久地契发展。土地有限，售罄不再。在停止批出永久地契的成熟社区拥有一席之地。" },
        { no: "02", title: "天然租客群", body: "5 公里内有 82,628 名学生，环绕多所大学、学院与成熟商圈。租房需求稳定而非季节性。" },
        { no: "03", title: "为收益而生的间隔", body: "双钥匙与三钥匙间隔让单一单位可分租多户，毛租金回报高达每年 9%。" },
        { no: "04", title: "四通八达", body: "步行 12 分钟到 SS15 轻快铁，紧邻联邦大道、NPE、KESAS、LDP，以及双威金字塔、双威医疗与泰莱大学。" },
      ],
    },
    units: {
      eyebrow: "精选单位",
      heading: "五款间隔，为出租而生。",
      sub: "单钥匙、双钥匙与三钥匙间隔，690 至 980 平方尺。左右滑动比较。",
      from: "起价", perMo: "/月", cta: "索取完整价目表", viewPlan: "查看平面图",
      keyLabels: { single: "单钥匙", dual: "双钥匙", triple: "三钥匙" },
      bed: "房", bath: "卫",
    },
    nav: { residences: "单位", gallery: "相册", location: "位置", register: "登记" },
    floorplans: { enlarge: "点击平面图放大" },
    glance: {
      eyebrow: "项目速览",
      heading: "核心资料。",
      rows: [
        { k: "开发商", v: "金务大 Gamuda Land" },
        { k: "地段", v: "梳邦再也 SS15，雪兰莪" },
        { k: "占地面积", v: "2.88 英亩" },
        { k: "总单位数", v: "522 服务式公寓" },
        { k: "物业类型", v: "综合发展 — 住宅 · 学生公寓 · 商铺" },
        { k: "产权", v: "永久地契" },
        { k: "主力户型", v: "690 – 980 平方尺 · A–E 户型" },
        { k: "管理费", v: "洽询" },
        { k: "预计完工", v: "2029 年第四季" },
        { k: "车位", v: "每单位 1 – 2 个" },
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
      items: ["鸟瞰图", "航拍总平面", "服务式公寓外观", "C 座落客区", "人行步道", "A 座落客区", "C 座露天广场", "A 座露天广场"],
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
