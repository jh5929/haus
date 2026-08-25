/* =============================================================================
 *  App.jsx — 整个网站的所有画面，全部在这一个文件里
 * =============================================================================
 *  文字和数据不在这里，在 content.js。这里只有「长什么样」。
 *
 *  由上到下的顺序 = 网页由上到下的顺序：
 *
 *    §0  Supabase 连接（表单送出去的地方）
 *    §1  语言切换（中/英）
 *    §2  共用小组件（WhatsApp 图标 / 按钮 / 滚动出现动画）
 *    §3  Header      顶部导航栏
 *    §4  Hero        首屏大图 + HAUS on 15 标题
 *    §5  StatsBento  六个数据卡（永久地契 / 面积 / 回报…）
 *    §6  Partnership Gamuda Land x Taylor's 合作区块
 *    §7  Manifesto   为何投资 · 四个理由
 *    §8  AtAGlance   项目速览表格
 *    §9  FloorPlans  户型 A–E + 平面图放大弹窗
 *    §10 Gallery     相册
 *    §11 Amenities   位置地图 + 周边配套手风琴
 *    §12 RentalDemand 租赁需求 + 周边院校学生人数图
 *    §13 MediaCoverage 媒体报道
 *    §14 RegisterForm 登记表单（写入 Supabase leads 表）
 *    §15 Footer      页尾
 *    §16 FloatingWhatsApp 右下角浮动 WhatsApp 按钮
 *    §17 Facilities  设施（原项目写了但没显示，想用就看 §18 说明）
 *    §18 App         把上面所有区块排在一起 ← 想调换顺序改这里
 * ========================================================================== */

import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { createClient } from "@supabase/supabase-js";
import { initAnalytics, trackLead } from "./analytics";
import {
  ArrowDown, Baby, Building2, CalendarDays, Car, CheckCircle2, ChevronLeft, ChevronRight, Download, Dumbbell,
  Expand, Flame, GraduationCap, HeartPulse, Landmark, Laptop, LayoutGrid, Loader2,
  Mail, MapPin, Menu, Minus, Newspaper, Phone, Plus, Scan, ShoppingCart, ShieldCheck,
  Tag, TrainFront, Trees, TreePine, TrendingUp, Users, Waves, Wine, Wrench, X, ZoomIn, ZoomOut,
} from "lucide-react";

import {
  CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, GALLERY_IMAGES, HERO_IMAGE, IMG, MEDIA_IMAGES,
  PARTNERSHIP_IMAGE, translations, UNITS, waLink,
} from "./content";

/* =============================================================================
 * §0  SUPABASE — 登记表单送出去的地方
 * =============================================================================
 *  网址和金钥放在 .env 文件（本机）和 Vercel 的 Environment Variables（线上）：
 *      REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
 *      REACT_APP_SUPABASE_ANON_KEY=xxxx
 *  改完环境变数一定要重新 build / redeploy 才会生效。
 * ========================================================================== */

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 注意：环境变数没设的时候不能直接呼叫 createClient，它会丢错误，
// 整个页面会变成一片空白。这里改成先检查，没设就让 supabase = null，
// 页面照常显示，只有登记表单送不出去（会显示错误讯息）。
let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase 环境变数没设定：请在 Vercel 设定 REACT_APP_SUPABASE_URL 和 REACT_APP_SUPABASE_ANON_KEY，然后重新部署。"
  );
}

export const supabase = supabaseClient;

/* =============================================================================
 * §1  语言切换（中 / 英）
 * =============================================================================
 *  任何组件里写 const { t, lang, setLang } = useLang();
 *  然后 t.hero.cta 就会自动拿到当前语言的文字。
 *  选择会记在浏览器里（localStorage），下次进来还是同一个语言。
 * ========================================================================== */

const LangContext = createContext(null);

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("haus_lang") || "en");
  const change = useCallback((l) => {
    setLang(l);
    localStorage.setItem("haus_lang", l);
  }, []);
  const t = translations[lang];
  return <LangContext.Provider value={{ lang, setLang: change, t }}>{children}</LangContext.Provider>;
}

function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

/* =============================================================================
 * §2  共用小组件
 * ========================================================================== */

// WhatsApp 的绿色小图标（SVG，不是图片档）
const WhatsappIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.001 3.2C9.06 3.2 3.4 8.86 3.4 15.8c0 2.23.59 4.4 1.71 6.31L3.2 28.8l6.86-1.8a12.56 12.56 0 0 0 5.94 1.51h.01c6.94 0 12.6-5.66 12.6-12.6S22.94 3.2 16 3.2Zm0 22.94h-.01a10.4 10.4 0 0 1-5.3-1.45l-.38-.23-3.97 1.04 1.06-3.87-.25-.4a10.36 10.36 0 0 1-1.59-5.56c0-5.77 4.7-10.47 10.48-10.47 2.8 0 5.42 1.09 7.4 3.07a10.4 10.4 0 0 1 3.06 7.41c0 5.77-4.7 10.46-10.47 10.46Zm5.74-7.84c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.82 1.02-1 1.24-.19.21-.37.24-.68.08-.31-.16-1.33-.49-2.53-1.56-.94-.83-1.57-1.86-1.75-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.19.21-.32.31-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.76.75.32 1.34.52 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.86-.76 2.12-1.5.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
  </svg>
);

// 绿色 WhatsApp 按钮。dark=true 变成黑底按钮。text=这个按钮专属的预填讯息
const WAButton = ({ children = "Enquire on WhatsApp", text, dark = false, testId, className = "" }) => (
  <motion.a
    href={waLink(text)}
    target="_blank"
    rel="noopener noreferrer"
    data-testid={testId}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.94 }}
    transition={{ type: "spring", stiffness: 320, damping: 14 }}
    className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-display font-semibold text-[15px] ${
      dark
        ? "bg-[#14110E] text-white hover:bg-[#C8A24C]"
        : "bg-[#25D366] text-[#062e14] hover:brightness-105"
    } ${className}`}
  >
    <WhatsappIcon className="w-5 h-5" />
    {children}
  </motion.a>
);

// 包住任何东西，滚动到画面时淡入上浮
// 文字里用 | 包起来的部分会变成金色，例如 "Team up for |RM540 Million| SS15..."
const goldParts = (text = "") =>
  text.split("|").map((part, i) => (i % 2 ? <span key={i} className="text-[var(--gold)]">{part}</span> : part));

// 每个区块最上面那行金色小标题（底下带一条短金线，参考图的样式）
const Eyebrow = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)]">{children}</p>
    <span className="mt-2 block w-14 h-px bg-[#C0A063B3]" />
  </div>
);

/* 双指捏合缩放 + 放大后单指拖动。回传的东西直接摊在要缩放的元素上：
 *   const pinch = usePinchZoom();
 *   <div {...pinch.handlers} style={pinch.style}> <img/> </div>
 * scale = 1 时不拦截手势，页面照常上下滚动、左右滑动换户型。 */
function usePinchZoom({ max = 4 } = {}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const st = useRef({ pointers: new Map(), startDist: 0, startScale: 1, pan: null, pinched: false });

  const reset = useCallback(() => { setScale(1); setPos({ x: 0, y: 0 }); }, []);

  const dist = () => {
    const [a, b] = [...st.current.pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (e) => {
    st.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (st.current.pointers.size === 2) {
      st.current.startDist = dist();
      st.current.startScale = scale;
      st.current.pinched = true;
      st.current.pan = null;
    } else if (st.current.pointers.size === 1 && scale > 1) {
      st.current.pan = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    }
  };

  const onPointerMove = (e) => {
    if (!st.current.pointers.has(e.pointerId)) return;
    st.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (st.current.pointers.size >= 2 && st.current.startDist > 0) {
      const next = Math.min(max, Math.max(1, st.current.startScale * (dist() / st.current.startDist)));
      setScale(next);
      if (next === 1) setPos({ x: 0, y: 0 });
    } else if (st.current.pan && scale > 1) {
      setPos({ x: e.clientX - st.current.pan.x, y: e.clientY - st.current.pan.y });
    }
  };

  const endPointer = (e) => {
    st.current.pointers.delete(e.pointerId);
    if (st.current.pointers.size < 2) st.current.startDist = 0;
    if (st.current.pointers.size === 0) {
      st.current.pan = null;
      if (scale <= 1.05) reset();
      setTimeout(() => { st.current.pinched = false; }, 60); // 让紧接着的 click 知道刚刚是在捏合
    }
  };

  return {
    scale,
    pos,
    setScale,
    reset,
    zoomed: scale > 1.05,
    didPinch: () => st.current.pinched,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      onPointerLeave: endPointer,
    },
    // 没放大时不拦截手势（pan-y 让页面还能上下滚），放大后才吃掉手势用来拖动
    style: { touchAction: scale > 1.05 ? "none" : "pan-y" },
  };
}

const Reveal = ({ children, delay = 0, y = 40, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ type: "spring", stiffness: 90, damping: 18, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* =============================================================================
 * §3  HEADER — 顶部导航栏（固定在最上面，往下滚会变白色毛玻璃）
 * ========================================================================== */

function Header() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // 滚过封面（约一个屏幕高）之后，顶栏才变成深色横条；在封面上是全透明的
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 导航项目。href 要对得上各区块的 id（例如 #floorplans 对应 §9 的 <section id="floorplans">）
  const nav = [
    { href: "#floorplans", label: t.nav.residences },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#location", label: t.nav.location },
    { href: "#register", label: t.nav.register },
  ];

  const LangToggle = ({ idSuffix = "" }) => (
    <div className="flex items-center rounded-full bg-white/10 border border-white/15 p-0.5 text-sm font-display" data-testid={`lang-toggle${idSuffix}`}>
      <button
        data-testid={`lang-en${idSuffix}`}
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full transition-colors ${lang === "en" ? "bg-[var(--gold)] text-[var(--ink)]" : "text-white/65"}`}
      >
        EN
      </button>
      <button
        data-testid={`lang-zh${idSuffix}`}
        onClick={() => setLang("zh")}
        className={`px-3 py-1.5 rounded-full transition-colors ${lang === "zh" ? "bg-[var(--gold)] text-[var(--ink)]" : "text-white/65"}`}
      >
        中
      </button>
    </div>
  );

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
      data-testid="site-header"
    >
      <div
        data-testid="header-bar"
        className={`flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 border-b transition-colors duration-500 ${
          scrolled || open
            ? "bg-[var(--ink)] border-white/10 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* SS15 | Haus On 15 / SUBANG JAYA */}
        <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-3 sm:gap-4" data-testid="brand-logo">
          <span className="font-serif-accent text-2xl sm:text-3xl leading-none tracking-tight">
            <span className="text-white">SS</span>
            <span className="text-[var(--gold)]">15</span>
          </span>
          <span className="w-px h-8 sm:h-9 bg-[#C0A063]/45" />
          <span className="leading-none">
            <span className="block font-serif-accent text-xl sm:text-2xl leading-none">
              <span className="text-white">Haus </span>
              <span className="italic text-[var(--gold)]">On 15</span>
            </span>
            <span className="block mt-1 font-display text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#C0A063]/85">
              Subang Jaya
            </span>
          </span>
        </a>

        {/* 电脑版导航 */}
        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`nav-${n.href.slice(1)}`}
              className="font-display text-sm tracking-wide text-white/85 transition-colors hover:text-[var(--gold)]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block"><LangToggle /></div>
          <div className="hidden lg:block">
            <WAButton testId="header-whatsapp-btn" className="!px-5 !py-2.5 !text-sm">{t.header.enquire}</WAButton>
          </div>
          {/* 手机版汉堡按钮 */}
          <button
            data-testid="menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-11 h-11 rounded-xl bg-[var(--gold)] text-[var(--ink)] flex items-center justify-center"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 手机版下拉选单 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="lg:hidden px-5 sm:px-8 py-4 bg-[var(--ink)] border-b border-white/10"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-${n.href.slice(1)}`}
                  className="font-display text-lg text-white/85 py-3 border-b border-white/10 last:border-0"
                >
                  {n.label}
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 mt-4">
              <LangToggle idSuffix="-mobile" />
              <WAButton testId="mobile-whatsapp-btn" className="!px-5 !py-2.5 !text-sm">{t.header.enquire}</WAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* =============================================================================
 * §4  HERO — 首屏（背景大图 hero-aerial.jpg + 视差滚动 + 标题逐行浮现）
 * ========================================================================== */

const lineParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};
const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { type: "spring", stiffness: 90, damping: 16 } },
};

function Hero() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);       // 背景图往下移
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);    // 背景图放大
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);  // 文字往上移
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);            // 文字淡出

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full min-h-[100svh] overflow-hidden rounded-b-[2rem] grain"
      data-testid="hero-section"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 z-0">
        <img src={IMG(HERO_IMAGE)} alt="HAUS on 15 aerial view over Subang Jaya SS15" className="w-full h-full object-cover object-[50%_42%] lg:object-[50%_55%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 flex flex-col justify-between min-h-[100svh] px-6 sm:px-12 pt-28 pb-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="inline-flex self-start items-center gap-3 rounded-xl bg-[#14110EE6] backdrop-blur-md border border-[#C8A24C]/55 px-4 py-2 shadow-[0_14px_34px_-20px_rgba(0,0,0,0.9)]"
        >
          <span className="w-2 h-2 bg-[#C8A24C]" />
          <span className="text-[11px] sm:text-xs tracking-mega uppercase font-display text-[#C8A24C]">{t.hero.badge}</span>
        </motion.div>

        <div className="max-w-4xl">
          <motion.h1
            variants={lineParent}
            initial="hidden"
            animate="show"
            className="font-display font-extrabold text-white leading-[0.94] tracking-tight text-[19vw] sm:text-8xl lg:text-[9rem]"
          >
            <span className="mask-line"><motion.span variants={line} className="block">HAUS</motion.span></span>
            <span className="mask-line">
              <motion.span variants={line} className="block">
                on <span className="font-serif-accent italic font-medium text-[#C8A24C]">15</span>
              </motion.span>
            </span>
          </motion.h1>

          <div className="mask-line mt-5 max-w-md">
            <motion.p
              variants={line}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.7 }}
              className="text-white/85 text-base sm:text-lg font-body"
            >
              {t.hero.tagline}
            </motion.p>
          </div>

        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-2 text-white/60 text-xs font-display tracking-widest uppercase"
        >
          <ArrowDown className="w-4 h-4" /> {t.hero.scroll}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* =============================================================================
 * §5  STATS BENTO — 六个数据卡（文字改 content.js 的 stats）
 * ========================================================================== */

// 六个数据卡各用哪个图标。content.js 的 stats.key 要对得上
const STAT_ICONS = {
  tenure: ShieldCheck,
  size: LayoutGrid,
  yield: TrendingUp,
  price: Tag,
  completion: CalendarDays,
  students: Users,
};
const STAT_GOLD = ["price", "yield"]; // 这两个数字用金色

function StatsBento() {
  const { t } = useLang();
  return (
    <section className="relative z-20 px-4 sm:px-8 -mt-16 sm:-mt-20" data-testid="stats-section">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {t.stats.map((s, i) => (
          <motion.div
            key={i}
            data-testid={`stat-card-${i}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.08 }}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 12 } }}
            className="glass rounded-2xl p-5 sm:p-6"
          >
            {STAT_ICONS[s.key]
              ? createElement(STAT_ICONS[s.key], { className: "w-7 h-7 sm:w-8 sm:h-8 text-[var(--taupe-deep)] mb-4", strokeWidth: 1.4 })
              : null}
            <div
              className={`font-display font-extrabold text-2xl sm:text-3xl tracking-tight ${
                STAT_GOLD.includes(s.key) ? "text-[var(--taupe-deep)]" : "text-[#14110E]"
              }`}
            >
              {s.value}
            </div>
            <div className="mt-1.5 text-[13px] sm:text-sm text-black/55 font-body leading-snug">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
 * §6  PARTNERSHIP — Gamuda Land x Taylor's 合作区块
 *     文字改 content.js 的 partnership，照片改 content.js 的 PARTNERSHIP_IMAGE
 * ========================================================================== */

function Partnership() {
  const { t } = useLang();
  return (
    <section
      className="relative marble-dark mt-16 sm:mt-24"
      style={{ backgroundImage: "url(/renders/marble-dark.jpg)" }}
      data-testid="partnership-section"
    >
      <div className="absolute inset-0 bg-[#33281ED9]" />

      <Reveal className="relative z-10 max-w-3xl mx-auto text-center px-5 sm:px-8 py-16 sm:py-24">
        {/* 手机版：两个小 logo 排在标题上面（并排放不下） */}
        <div className="flex sm:hidden items-center justify-center gap-4 mb-5">
          <img src={IMG("logo-gamuda.png")} alt="Gamuda Land" className="h-4 w-auto opacity-90" />
          <span className="font-serif-accent italic text-[var(--gold)] text-lg leading-none">&times;</span>
          <img src={IMG("logo-taylors.png")} alt="Taylor's Assets" className="h-7 w-auto opacity-90" />
        </div>

        {/* 两边金线 + 中间标题；电脑版标题左右各放一个小 logo */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="flex-1 h-px bg-[#C0A063]/40" />
          <img src={IMG("logo-gamuda.png")} alt="" aria-hidden="true" className="hidden sm:block h-4 w-auto shrink-0" />
          <h2 className="font-serif-accent italic text-white text-2xl sm:text-4xl lg:text-5xl leading-tight whitespace-nowrap">
            {t.partnership.title}
          </h2>
          <img src={IMG("logo-taylors.png")} alt="" aria-hidden="true" className="hidden sm:block h-8 w-auto shrink-0" />
          <span className="flex-1 h-px bg-[#C0A063]/40" />
        </div>

        <div className="mt-7 sm:mt-10 rounded-2xl overflow-hidden border border-[#C8A24C]/30 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
          <img
            src={IMG(PARTNERSHIP_IMAGE)}
            alt={t.partnership.title}
            loading="lazy"
            width={1400}
            height={939}
            className="w-full h-auto"
          />
        </div>

        <p className="mt-3 font-body text-[13px] sm:text-sm text-white/45">{t.partnership.photoCaption}</p>

        <p className="mt-6 sm:mt-8 font-display font-semibold text-2xl sm:text-3xl tracking-tight leading-snug text-white max-w-2xl mx-auto">
          {goldParts(t.partnership.caption)}
        </p>

        <p className="mt-4 font-body text-sm sm:text-base text-white/50 leading-relaxed max-w-xl mx-auto">
          {t.partnership.note}
        </p>
      </Reveal>
    </section>
  );
}

/* =============================================================================
 * §7  MANIFESTO — 为何投资 · 01-04 四个理由（手风琴，点标题才展开说明）
 * ========================================================================== */

// 每个理由用哪个图标。content.js 里 chapters 的 key 要对得上这里
const MANIFESTO_ICONS = {
  land: MapPin,
  tenants: GraduationCap,
  layouts: TrendingUp,
  connectivity: TrainFront,
};

function Manifesto() {
  const { t } = useLang();
  const [open, setOpen] = useState(null); // 一进来全部收起来，点了才展开

  return (
    <section className="px-5 sm:px-8 py-8 max-w-3xl mx-auto" data-testid="manifesto-section">
      <Reveal>
        <Eyebrow>{t.manifesto.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.03] max-w-2xl">
          {t.manifesto.heading}
        </h2>
      </Reveal>

      <div className="mt-10 sm:mt-14 border-t border-black/10" data-testid="manifesto-accordion">
        {t.manifesto.chapters.map((c) => {
          const Icon = MANIFESTO_ICONS[c.key];
          const isOpen = open === c.key;
          return (
            <div key={c.no} className="border-b border-black/12" data-testid={`chapter-${c.no}`}>
              <button
                data-testid={`chapter-toggle-${c.no}`}
                onClick={() => setOpen(isOpen ? null : c.key)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 py-5 text-left group"
              >
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--ink)] flex items-center justify-center text-[var(--gold)] shrink-0 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)]">
                  {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-serif-accent italic text-sm text-[var(--taupe-deep)] leading-none mb-1">{c.no} &mdash;</span>
                  <span className="block font-display font-semibold text-lg sm:text-2xl tracking-tight leading-snug text-[#14110E]/90">
                    {c.title}
                  </span>
                </span>
                <span className="text-[var(--taupe-deep)] shrink-0">
                  {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    data-testid={`chapter-panel-${c.no}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="overflow-hidden"
                  >
                    <p className="pl-[3.75rem] pr-2 pb-6 font-body text-black/60 text-[15px] sm:text-base leading-relaxed">
                      {c.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =============================================================================
 * §8  AT A GLANCE — 项目速览表格（改 content.js 的 glance.rows）
 * ========================================================================== */

// 速览表格每一行的图标。content.js 里 glance.rows 的 key 要对得上这里
const GLANCE_ICONS = {
  developer: Landmark,
  location: MapPin,
  land: Scan,
  units: Users,
  type: Building2,
  tenure: ShieldCheck,
  layouts: LayoutGrid,
  fee: Wrench,
  completion: CalendarDays,
  carpark: Car,
};

function AtAGlance() {
  const { t } = useLang();
  return (
    <section id="glance" className="px-5 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto scroll-mt-24" data-testid="glance-section">
      <Reveal>
        <Eyebrow>{t.glance.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03]">{t.glance.heading}</h2>
      </Reveal>

      <div className="mt-10 rounded-3xl bg-white border border-black/5 overflow-hidden shadow-[0_20px_60px_-32px_rgba(0,0,0,0.3)]">
        {t.glance.rows.map((row, i) => (
          <motion.div
            key={row.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.04 }}
            data-testid={`glance-row-${i}`}
            className="flex items-center gap-3 sm:gap-5 px-4 sm:px-7 py-4 border-b border-black/8 last:border-0"
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--ink)] text-[var(--gold)] flex items-center justify-center shrink-0">
              {GLANCE_ICONS[row.key] ? createElement(GLANCE_ICONS[row.key], { className: "w-5 h-5" }) : null}
            </span>
            <span className="w-24 sm:w-44 shrink-0 font-display text-[10px] sm:text-xs uppercase tracking-[0.16em] leading-tight text-[var(--taupe-deep)]">
              {row.k}
            </span>
            <span className="w-px self-stretch bg-black/10 shrink-0" />
            <span className="flex-1 font-body text-[15px] sm:text-base text-[#14110E]/85 leading-snug">{row.v}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
 * §9  FLOOR PLANS — 户型 A–E（数据改 content.js 的 UNITS）
 *     下面还有一个 FloorPlanModal = 点平面图后放大的全屏弹窗
 * ========================================================================== */

// 全屏平面图弹窗：点一下放大 2.2 倍，可以拖动
function FloorPlanModal({ unit, onClose }) {
  const { t } = useLang();
  const pinch = usePinchZoom({ max: 5 });
  const { scale: zoom, pos, setScale, reset } = pinch;

  const toggleZoom = () => {
    if (zoom > 1.05) reset();
    else setScale(2.2);
  };

  // 每次换户型 / 重新打开都回到原始大小
  useEffect(() => { reset(); }, [unit, reset]);

  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          data-testid="floorplan-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[#14110E]/92 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-display text-[#C8A24C] text-xs tracking-mega uppercase">{t.plan.title}</p>
              <p className="font-display font-bold text-white text-2xl">
                Type {unit.type} <span className="text-white/40 text-base font-body">· {unit.size} sf</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                data-testid="floorplan-zoom-btn"
                onClick={toggleZoom}
                className="w-11 h-11 rounded-full glass-dark text-white flex items-center justify-center"
                aria-label="Zoom"
              >
                {zoom > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                data-testid="floorplan-close-btn"
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-white text-[#14110E] flex items-center justify-center"
                aria-label={t.plan.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 点图片以外的空白处 = 关掉（拇指不用够到最上面那颗 X） */}
          <div
            className="flex-1 overflow-hidden flex items-center justify-center px-3 pb-3 select-none"
            data-testid="floorplan-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={pinch.style}
            {...pinch.handlers}
          >
            <motion.img
              src={IMG(unit.plan)}
              alt={`Type ${unit.type} floor plan`}
              onDoubleClick={toggleZoom}
              onClick={(e) => { e.stopPropagation(); if (!pinch.didPinch() && zoom <= 1.05) toggleZoom(); }}
              animate={{ scale: zoom, x: pos.x, y: pos.y }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`max-h-full max-w-full w-auto rounded-xl bg-white ${zoom > 1.05 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
              draggable={false}
            />
          </div>

          <p className="text-center text-white/45 text-xs font-body pb-5" onClick={(e) => e.stopPropagation()}>
            {t.plan.hint}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloorPlans() {
  const { t } = useLang();
  const [active, setActive] = useState(0);        // 目前选中第几个户型
  const [dir, setDir] = useState(1);              // 切换方向：1 = 往右，-1 = 往左
  const [zoomUnit, setZoomUnit] = useState(null); // 不是 null 就会弹出放大视窗
  const [swiped, setSwiped] = useState(false);    // 用户滑过一次之后就不再提示
  const pinch = usePinchZoom({ max: 4 });         // 小图上的双指缩放
  const u = UNITS[active];

  const go = (i) => {
    if (i < 0 || i > UNITS.length - 1 || i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
    pinch.reset();
  };

  // 手机上左右滑动换户型（拖超过 60px 就换下一个）
  const onDragEnd = (_e, info) => {
    if (Math.abs(info.offset.x) > 30) setSwiped(true);
    if (info.offset.x < -60) go(active + 1);
    else if (info.offset.x > 60) go(active - 1);
  };

  // 「TYPE A | 690 SQ FT」那一块。手机排在最上面，电脑排在右栏，共用这一份
  const titleBlock = (
    <div>
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight uppercase">
          {t.units.typeWord} {u.type}
        </span>
        <span className="w-px h-7 bg-[#C0A06366]" />
        <span className="font-display font-semibold text-lg sm:text-xl tracking-tight text-[var(--taupe-deep)]">
          {u.size} {t.units.sqft}
        </span>
      </div>
      <p className="mt-2 font-body text-sm sm:text-base text-black/55">
        {u.beds} {t.units.bedsFull} · {u.baths} {t.units.bathsFull} · {t.units.keyLabels[u.keyType]}
      </p>
    </div>
  );

  const stat = (label, value, gold = false) => (
    <div className="px-3 first:pl-0 last:pr-0 text-center first:text-left last:text-right">
      <p className="font-display text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-black/40 leading-tight">{label}</p>
      <p className={`mt-1.5 font-display font-bold text-lg sm:text-2xl tracking-tight ${gold ? "text-[var(--taupe-deep)]" : ""}`}>
        {value}
      </p>
    </div>
  );

  return (
    <section
      id="floorplans"
      className="px-5 sm:px-8 py-20 sm:py-28 max-w-3xl lg:max-w-6xl mx-auto scroll-mt-24"
      data-testid="floorplans-section"
    >
      <div>
        <Eyebrow>{t.units.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl">{t.units.heading}</h2>
        <p className="mt-4 text-black/55 max-w-lg font-body">{t.units.sub}</p>
      </div>

      {/* TYPE A – E 分页（等宽，手机上也能一行放下） */}
      <div className="mt-8 flex rounded-2xl bg-white border border-black/10 p-1" data-testid="plan-tabs">
        {UNITS.map((unit, i) => (
          <button
            key={unit.type}
            data-testid={`plan-tab-${unit.type}`}
            onClick={() => go(i)}
            className={`flex-1 py-2.5 sm:py-3 rounded-xl font-display font-semibold text-[11px] sm:text-sm tracking-[0.1em] uppercase transition-colors ${
              i === active ? "bg-[var(--gold)] text-[var(--ink)]" : "text-black/50 hover:text-black/80"
            }`}
          >
            {t.units.typeWord} {unit.type}
          </button>
        ))}
      </div>

      {/* 手机版的滑动提示：小圆点标示位置，滑过一次之后提示文字就消失 */}
      <div className="mt-4 flex items-center justify-center gap-3 lg:hidden" data-testid="plan-swipe-hint">
        <ChevronLeft className={`w-4 h-4 text-[var(--taupe-deep)] transition-opacity ${active === 0 ? "opacity-20" : "opacity-70"}`} />
        <div className="flex items-center gap-1.5">
          {UNITS.map((unit, i) => (
            <span
              key={unit.type}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-[var(--taupe-deep)]" : "w-1.5 bg-black/20"}`}
            />
          ))}
        </div>
        <ChevronRight className={`w-4 h-4 text-[var(--taupe-deep)] transition-opacity ${active === UNITS.length - 1 ? "opacity-20" : "opacity-70"}`} />
      </div>
      {!swiped && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="mt-2 text-center text-[11px] font-display tracking-[0.14em] uppercase text-[var(--taupe-deep)] lg:hidden"
        >
          {t.units.swipeHint}
        </motion.p>
      )}

      {/* 户型卡（可以左右滑动切换） */}
      <div className="mt-4 overflow-hidden">
        {/* key = 户型代号，换户型时 React 会重新挂载这张卡，顺便播一次滑入动画 */}
        <motion.div
          key={u.type}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          drag={pinch.zoomed ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
          data-testid={`plan-card-${u.type}`}
          className="rounded-3xl bg-white border border-black/5 p-5 sm:p-7 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.45)] cursor-grab active:cursor-grabbing"
        >
          {/* 手机版：标题在最上面；电脑版这块会藏起来，改用右栏那一份 */}
          <div className="lg:hidden">{titleBlock}</div>

          <div className="lg:flex lg:gap-8 lg:items-stretch">
            {/* 平面图（点一下放大）—— 电脑版在左边 */}
            <div
              data-testid="plan-image-enlarge"
              role="button"
              tabIndex={0}
              onClick={() => { if (!pinch.didPinch() && !pinch.zoomed) setZoomUnit(u); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setZoomUnit(u); }}
              style={pinch.style}
              {...pinch.handlers}
              className="group relative mt-5 lg:mt-0 block w-full lg:w-[54%] shrink-0 rounded-2xl overflow-hidden bg-white cursor-zoom-in select-none"
            >
              <motion.img
                src={IMG(u.plan)}
                alt={`Type ${u.type} floor plan`}
                animate={{ scale: pinch.scale, x: pinch.pos.x, y: pinch.pos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full h-full max-h-[420px] lg:max-h-none object-contain"
                draggable={false}
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#14110E]/80 text-white text-xs font-display px-3 py-1.5">
                <Expand className="w-3.5 h-3.5" /> {t.floorplans.enlarge}
              </span>
              {/* 捏放大之后给个回到原状的按钮 */}
              {pinch.zoomed && (
                <button
                  data-testid="plan-pinch-reset"
                  onClick={(e) => { e.stopPropagation(); pinch.reset(); }}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#14110E]/80 text-white text-xs font-display px-3 py-1.5"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> {t.floorplans.resetZoom}
                </button>
              )}
            </div>

            {/* 右栏：标题 + 售价 + 三个数据 + 备注 */}
            <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center">
              <div className="hidden lg:block lg:mb-6">{titleBlock}</div>

              {/* 售价（深色横条） */}
              <div className="mt-5 lg:mt-0 rounded-2xl bg-[#14110E] px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-display text-[10px] tracking-[0.22em] uppercase text-[#C8A24C]/85">{t.units.from}</p>
                <p className="mt-1 font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#C8A24C]">
                  RM {u.price.toLocaleString("en-US")}
                </p>
              </div>

              {/* 每月供期 · 预估净租金 · ROI */}
              <div className="mt-5 grid grid-cols-3 divide-x divide-black/10">
                {stat(t.units.installmentLabel, `RM ${u.installment.toLocaleString("en-US")}`)}
                {stat(t.units.nettRental, `RM ${u.rent.toLocaleString("en-US")}`)}
                {stat(t.units.roi, `${u.yield}%`, true)}
              </div>

              {/* 备注 + 咨询这个户型 */}
              <div className="mt-5 pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start gap-4">
                <div className="max-w-sm">
                  <p className="font-body text-[11px] leading-snug text-black/40">{t.units.rentNote}</p>
                  <p className="mt-1 font-body text-[11px] leading-snug text-black/35">{t.units.installmentNote}</p>
                </div>
                <a
                  href={waLink(`Hi, I'm interested in Type ${u.type} (${u.size} sq ft) at HAUS ON 15. Please send me more details.`)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="plan-enquire-link"
                  className="group inline-flex items-center gap-2 font-display font-semibold text-xs sm:text-sm tracking-[0.12em] uppercase text-[var(--taupe-deep)] border-b border-[#C0A06380] pb-1 shrink-0"
                >
                  {t.units.enquireLayout}
                  <span className="transition-transform group-hover:translate-x-1">&#8594;</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <WAButton testId="units-whatsapp-btn" text="Hi, I'd like the full HAUS ON 15 price list and floor plans">
          {t.units.cta}
        </WAButton>
      </div>

      <FloorPlanModal unit={zoomUnit} onClose={() => setZoomUnit(null)} />
    </section>
  );
}

/* =============================================================================
 * §10  GALLERY — 相册（图片改 content.js 的 GALLERY_IMAGES，
 *      说明文字改 gallery.items，两边顺序要一致）
 * ========================================================================== */

function Gallery() {
  const { t } = useLang();
  return (
    <section id="gallery" className="px-4 sm:px-8 py-20 sm:py-28 max-w-5xl mx-auto scroll-mt-24" data-testid="gallery-section">
      <div className="mb-8 text-center">
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03]">{t.gallery.heading}</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {GALLERY_IMAGES.map((g, i) => (
          <figure
            key={g.img}
            data-testid={`gallery-item-${i}`}
            className="relative overflow-hidden rounded-lg aspect-[4/3] bg-black/5"
          >
            <img
              src={IMG(g.img)}
              alt={t.gallery.items[i]}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
 * §11  AMENITIES — 位置地图 + 周边配套手风琴（改 content.js 的 amenities.categories）
 * ========================================================================== */

// 每个分类用哪个图标。content.js 里的 key 要对得上这里
const AMENITY_ICONS = {
  shopping: ShoppingCart,
  medical: HeartPulse,
  education: GraduationCap,
  leisure: TreePine,
  connectivity: TrainFront,
};

function Amenities() {
  const { t } = useLang();
  const [open, setOpen] = useState(null); // 一进来全部收起来，点了才展开

  return (
    <section id="location" className="px-5 sm:px-8 py-20 sm:py-28 max-w-3xl mx-auto scroll-mt-24" data-testid="amenities-section">
      <Reveal>
        <Eyebrow>{t.location.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl whitespace-pre-line">{t.location.heading}</h2>
      </Reveal>

      {/* 两个小数据卡：82,628 学生 / 8 分钟到 LRT（数字是写死在这里的） */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F2EDE4] border border-black/5 px-5 py-4">
          <GraduationCap className="w-6 h-6 text-[var(--taupe-deep)]" />
          <div>
            <p className="font-display font-extrabold text-2xl sm:text-3xl leading-none">82,628</p>
            <p className="text-black/50 text-xs mt-1 font-body">{t.location.students}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F2EDE4] border border-black/5 px-5 py-4">
          <MapPin className="w-6 h-6 text-[var(--taupe-deep)]" />
          <div>
            <p className="font-display font-extrabold text-2xl sm:text-3xl leading-none">8 min</p>
            <p className="text-black/50 text-xs mt-1 font-body">{t.location.lrt}</p>
          </div>
        </div>
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div className="rounded-2xl overflow-hidden border border-black/10">
          <img src={IMG("location-map.jpg")} alt="HAUS on 15 location map" className="w-full object-cover" />
        </div>
      </Reveal>

      <div className="mt-10" data-testid="amenities-accordion">
        {t.amenities.categories.map((cat) => {
          const Icon = AMENITY_ICONS[cat.key];
          const isOpen = open === cat.key;
          return (
            <div key={cat.key} className="border-b border-black/12">
              <button
                data-testid={`amenity-toggle-${cat.key}`}
                onClick={() => setOpen(isOpen ? null : cat.key)}
                className="w-full flex items-center gap-4 py-5 text-left"
              >
                <span className="w-12 h-12 rounded-2xl bg-[var(--ink)] flex items-center justify-center text-[var(--gold)] shrink-0 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)]">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1 font-display font-semibold text-xl sm:text-2xl tracking-tight uppercase text-[#14110E]/85">{cat.label}</span>
                {isOpen && <span className="hidden sm:block font-display font-semibold text-sm text-[#14110E] mr-2">{t.amenities.radius}</span>}
                <span className="text-[var(--gold)]">{isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    data-testid={`amenity-panel-${cat.key}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-[3.75rem] pr-2 pb-6 space-y-3">
                      {cat.items.map((it) => (
                        <li key={it.name} className="flex items-baseline justify-between gap-4">
                          <span className="font-body text-black/70 text-[15px] leading-snug">{it.name}</span>
                          <span className="font-body text-black/55 text-sm whitespace-nowrap tabular-nums">{it.dist}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =============================================================================
 * §12  RENTAL DEMAND — 租赁需求 + 周边院校学生人数图
 *      数字 / 院校名单改 content.js 的 rental.clusters，中间圆圈改 rental.total
 *      圆圈里的照片 = public/renders/rental-demand.jpg
 * ========================================================================== */

// 一组院校（SS15 / USJ / Sunway / Taylor's）。side = 桌面版排在圆圈的哪一边
function CatchmentCluster({ cluster, side, studentLabel, studentWord, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay }}
      data-testid={`cluster-${cluster.name}`}
      className={`rounded-3xl bg-white/70 border border-black/5 px-5 py-4 sm:py-5 lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 ${
        side === "left" ? "lg:text-right" : "lg:text-left"
      }`}
    >
      <p className="font-display font-extrabold text-xl sm:text-2xl tracking-tight uppercase leading-none">{cluster.name}</p>
      <p className="mt-2 font-display font-extrabold text-4xl sm:text-5xl leading-none tracking-tight text-[var(--taupe-deep)]">
        {cluster.count}
      </p>
      <p className="mt-2 font-display text-[11px] tracking-[0.18em] uppercase text-[#A07C3EBF]">{studentLabel}</p>

      <ul className="mt-3 space-y-1.5">
        {cluster.items.map((it) => (
          <li key={it.name} className="font-body text-[13px] sm:text-sm leading-snug">
            <span className="font-semibold text-black/80">{it.name}</span>
            <span className="text-black/45"> · {studentWord} {it.students}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function RentalDemand() {
  const { t } = useLang();
  const r = t.rental;
  const left = r.clusters.slice(0, 2);
  const right = r.clusters.slice(2);

  return (
    <section id="rental-demand" className="px-5 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto scroll-mt-24" data-testid="rental-demand-section">
      <Reveal className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-[var(--taupe-deep)]">
          <GraduationCap className="w-5 h-5" />
          <p className="font-display text-xs tracking-mega uppercase">{r.eyebrow}</p>
        </div>
        <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03]">{r.heading}</h2>
        <p className="mt-5 text-black/60 text-lg font-body leading-relaxed">{r.body}</p>
      </Reveal>

      <p className="mt-12 sm:mt-16 text-center font-display font-bold text-sm sm:text-base tracking-[0.18em] uppercase text-[#14110E]/70">
        {r.chartTitle}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:items-center" data-testid="catchment-graphic">
        {/* 左边两组（手机上排在圆圈下面） */}
        <div className="order-2 lg:order-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-14">
          {left.map((c, i) => (
            <CatchmentCluster key={c.name} cluster={c} side="left" studentLabel={r.studentLabel} studentWord={r.studentWord} delay={i * 0.05} />
          ))}
        </div>

        {/* 中间圆圈（手机上排最前面） */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="order-1 lg:order-2 relative mx-auto"
          data-testid="catchment-total"
        >
          {/* 桌面版从圆圈射出去的四条细斜线 */}
          {[-45, -135, 45, 135].map((deg) => (
            <span
              key={deg}
              aria-hidden="true"
              className="hidden lg:block absolute left-1/2 top-1/2 h-px w-[110px] bg-[#14110E]/20 origin-left"
              style={{ transform: `rotate(${deg}deg) translateX(172px)` }}
            />
          ))}

          <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden">
            <img
              src={IMG("rental-demand.jpg")}
              alt="University students near HAUS on 15"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#33281E]/72" />
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-8">
              <span className="font-serif-accent italic text-xl sm:text-2xl text-white/85">{r.totalLabel}</span>
              <span className="font-display font-extrabold text-5xl sm:text-6xl leading-none tracking-tight mt-1">{r.total}</span>
              <span className="mt-2 font-serif-accent italic text-lg sm:text-xl leading-snug whitespace-pre-line text-white/90">
                {r.totalSub}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 右边两组 */}
        <div className="order-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-14">
          {right.map((c, i) => (
            <CatchmentCluster key={c.name} cluster={c} side="right" studentLabel={r.studentLabel} studentWord={r.studentWord} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 * §13  MEDIA COVERAGE — 三则媒体报道
 *      文字改 content.js 的 media.items，配图改 MEDIA_IMAGES（顺序对应）
 * ========================================================================== */

function MediaCoverage() {
  const { t } = useLang();
  return (
    <section id="media" className="px-5 sm:px-8 py-16 sm:py-24 max-w-5xl mx-auto scroll-mt-24" data-testid="media-section">
      <Reveal>
        <Eyebrow>{t.media.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl">{t.media.heading}</h2>
        <p className="mt-4 text-black/55 max-w-lg font-body">{t.media.sub}</p>
      </Reveal>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {t.media.items.map((m, i) => (
          <motion.article
            key={i}
            data-testid={`media-item-${i}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: i * 0.07 }}
            className="bg-white border border-black/10 border-t-2 border-t-[var(--gold)] overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden bg-black/5">
              <img src={IMG(MEDIA_IMAGES[i])} alt={m.source} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[var(--taupe-deep)]">
                <Newspaper className="w-4 h-4" />
                <span className="font-display font-bold text-sm tracking-wide uppercase">{m.source}</span>
              </div>
              <p className="font-serif-accent text-[1.3rem] leading-snug text-[#14110E]/85">{m.title}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// 防止打包工具把没用到的 MediaCoverage 当成错误（它是留着备用的）
export { MediaCoverage };

/* =============================================================================
 * §14  REGISTER FORM — 登记表单
 * =============================================================================
 *  送出后会写进 Supabase 的 leads 表，栏位：name / phone / email / floorplan / lang
 *  要看收到的名单：Supabase 后台 → Table Editor → leads
 *  如果送出一直失败，先检查：
 *    1) Vercel 的环境变数有没有设（见 §0）
 *    2) Supabase leads 表的 RLS policy 有没有允许 anon 角色 INSERT
 * ========================================================================== */

function RegisterForm() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", floorplan: "" });
  const [status, setStatus] = useState("idle"); // idle 待填 | sending 送出中 | done 成功 | error 失败
  const [err, setErr] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setErr(t.register.errRequired);
      return;
    }
    setErr("");
    setStatus("sending");
    try {
      if (!supabase) throw new Error("Supabase 环境变数没设定");
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        floorplan: form.floorplan || null,
        lang,
      });
      if (error) throw error;
      setStatus("done");
      trackLead(); // 回报给 Meta / GA4：这是一个成交线索
    } catch {
      // 资料库挂掉 / 被暂停的时候，不能让线索就这样消失 —— 改走 WhatsApp
      setStatus("error");
      setErr(t.register.errFailed);
    }
  };

  // 把使用者已经填好的资料组成 WhatsApp 讯息，一个字都不用重打
  const fallbackWaLink = () =>
    waLink(
      [
        "Hi, I'd like to register my interest in HAUS ON 15.",
        `Name: ${form.name.trim()}`,
        `Phone: ${form.phone.trim()}`,
        form.email.trim() ? `Email: ${form.email.trim()}` : "",
        form.floorplan ? `Interested in: Type ${form.floorplan}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );

  return (
    <section id="register" className="relative px-3 sm:px-8 py-16 scroll-mt-24" data-testid="register-section">
      <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden marble-dark" style={{ backgroundImage: "url(/renders/marble-dark.jpg)" }}>
        <div className="absolute inset-0 bg-[#33281ED9]" />

        <div className="relative z-10 px-6 sm:px-16 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <p className="font-display text-xs tracking-mega uppercase text-[#E4C87E] mb-3">{t.register.eyebrow}</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.02]">{t.register.heading}</h2>
            <p className="mt-5 text-white/75 max-w-md font-body">{t.register.sub}</p>
          </div>

          <div className="rounded-3xl bg-[#F7F4EF] p-6 sm:p-8">
            {status === "done" ? (
              /* ---- 送出成功后显示的画面：谢谢 + 下载价目表 + WhatsApp ---- */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
                data-testid="register-success"
              >
                <CheckCircle2 className="w-14 h-14 text-[var(--taupe-deep)] mx-auto" />
                <p className="mt-4 font-display font-bold text-2xl">{t.register.success}</p>
                <p className="mt-2 text-black/55 font-body">{t.register.successSub}</p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <a
                    href="/HAUS-on-15-Price-List.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    data-testid="register-download-pricelist"
                    className="inline-flex items-center gap-2 bg-[var(--taupe-deep)] text-white font-display font-semibold px-6 py-3"
                  >
                    <Download className="w-5 h-5" /> {t.register.download}
                  </a>
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="register-success-whatsapp"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-[#062e14] font-display font-semibold px-6 py-3"
                  >
                    <WhatsappIcon className="w-5 h-5" /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              /* ---- 表单本体 ---- */
              <form onSubmit={submit} className="space-y-4" data-testid="register-form">
                <div>
                  <label className="block text-xs font-display uppercase tracking-widest text-black/50 mb-1.5">{t.register.name} *</label>
                  <input
                    data-testid="register-name"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-[var(--taupe-deep)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-widest text-black/50 mb-1.5">{t.register.phone} *</label>
                  <input
                    data-testid="register-phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-[var(--taupe-deep)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-widest text-black/50 mb-1.5">{t.register.email} *</label>
                  <input
                    data-testid="register-email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-[var(--taupe-deep)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display uppercase tracking-widest text-black/50 mb-1.5">{t.register.floorplan}</label>
                  <select
                    data-testid="register-floorplan"
                    value={form.floorplan}
                    onChange={update("floorplan")}
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-[var(--taupe-deep)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">{t.register.notSure}</option>
                    {UNITS.map((u) => (
                      <option key={u.type} value={`Type ${u.type}`}>Type {u.type} · {u.size} sf · {u.beds}{t.units.bed}{u.baths}{t.units.bath}</option>
                    ))}
                  </select>
                </div>

                {err && <p className="text-sm text-red-600 font-body" data-testid="register-error">{err}</p>}

                {/* 送出失败时的救援按钮：带着已填资料直接开 WhatsApp，不让线索掉在这里 */}
                {status === "error" && (
                  <a
                    href={fallbackWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="register-whatsapp-fallback"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white font-display font-semibold tracking-wide"
                  >
                    <WhatsappIcon className="w-5 h-5" />
                    {t.register.sendViaWhatsApp}
                  </a>
                )}

                <motion.button
                  type="submit"
                  data-testid="register-submit"
                  disabled={status === "sending"}
                  whileTap={{ scale: 0.97 }}
                  className="w-full rounded-full bg-[var(--taupe-deep)] text-white font-display font-semibold text-[15px] py-4 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === "sending" ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t.register.submitting}</>) : t.register.submit}
                </motion.button>

                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="register-whatsapp-link"
                  className="flex items-center justify-center gap-2 text-sm text-black/55 hover:text-[#14110E] font-body pt-1"
                >
                  <WhatsappIcon className="w-4 h-4 text-[#25D366]" /> {t.register.orWhatsapp}
                </a>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 * §15  FOOTER — 页尾（电话/邮箱改 content.js 最上面）
 * ========================================================================== */

function Footer() {
  const { t } = useLang();
  return (
    <footer className="px-6 sm:px-12 py-12 border-t border-black/10" data-testid="site-footer">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold tracking-tight text-2xl">HAUS</span>
            <span className="font-serif-accent italic text-[#C8A24C] text-xl">on 15</span>
          </div>
          <p className="mt-3 text-black/50 text-sm max-w-sm font-body">{t.footer.tagline}</p>
        </div>

        <div className="sm:text-right">
          <p className="font-display text-xs tracking-mega uppercase text-[#C8A24C] mb-3">{t.footer.contact}</p>
          <div className="flex flex-col gap-2 text-sm text-black/70 sm:items-end">
            <a href={`tel:+${CONTACT_PHONE_TEL}`} className="inline-flex items-center gap-2 hover:text-black transition-colors" data-testid="footer-phone-link">
              <Phone className="w-4 h-4 text-[#C8A24C]" /> {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-black transition-colors" data-testid="footer-email-link">
              <Mail className="w-4 h-4 text-[#C8A24C]" /> {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-black/10 text-black/40 text-xs font-body leading-relaxed">
        <p>{t.footer.disclaimer}</p>
        <p className="mt-2">© {new Date().getFullYear()} HAUS on 15.</p>
      </div>
    </footer>
  );
}

/* =============================================================================
 * §16  FLOATING WHATSAPP — 右下角一直跟着的绿色圆钮
 * ========================================================================== */

function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="floating-whatsapp-btn"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      className="wa-fab pulse-ring fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] text-white flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <WhatsappIcon className="w-7 h-7" />
    </motion.a>
  );
}

/* =============================================================================
 * §17  FACILITIES — 设施九宫格
 * =============================================================================
 *  注意：原本的项目就写好了这一段，但没有放进页面里，所以网站上看不到。
 *  想显示的话，到下面 §18 的 <main> 里加一行 <Facilities />（建议放在
 *  <Amenities /> 前后）。文字在 content.js 的 facilities。
 * ========================================================================== */

const FACILITY_ICONS = {
  pool: Waves,
  lounge: Wine,
  gym: Dumbbell,
  garden: Trees,
  bbq: Flame,
  play: Baby,
  cowork: Laptop,
  hall: Users,
  security: ShieldCheck,
};

function Facilities() {
  const { t } = useLang();
  return (
    <section id="facilities" className="px-5 sm:px-8 py-16 sm:py-24 max-w-5xl mx-auto scroll-mt-24" data-testid="facilities-section">
      <Reveal>
        <Eyebrow>{t.facilities.eyebrow}</Eyebrow>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl">{t.facilities.heading}</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {t.facilities.items.map((f, i) => {
          const Icon = FACILITY_ICONS[f.key];
          return (
            <motion.div
              key={f.key}
              data-testid={`facility-${f.key}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: (i % 3) * 0.06 }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 12 } }}
              className="rounded-2xl bg-[#F2EDE4] border border-black/5 p-5 sm:p-6 flex flex-col gap-4"
            >
              <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--taupe-deep)]">
                <Icon className="w-6 h-6" />
              </span>
              <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-[#14110E]/85 leading-snug">
                {f.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-black/40 text-xs font-body">{t.facilities.note}</p>
    </section>
  );
}

// 防止打包工具把没用到的 Facilities 当成错误（它是留着备用的）
export { Facilities };

/* =============================================================================
 * §18  APP — 网页的组装处
 * =============================================================================
 *  ★ 想调换区块顺序 / 加一段 / 删一段，就改下面 <main> 里面那几行。
 *  useEffect 那一段是 Lenis 平滑滚动，还有点导航连结时平顺卷过去的效果。
 * ========================================================================== */

export default function App() {
  useEffect(() => { initAnalytics(); }, []); // 广告追踪（ID 没填就什么都不做）

  useEffect(() => {
    // 平滑滚动（duration 越大滚得越「黏」）
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // 点 #floorplans 这类连结时，平顺卷到该区块（-80 是留给固定导航栏的空间）
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="App relative bg-[#F7F4EF]" data-testid="landing-root">
        <Header />
        <main>
          <Hero />
          <StatsBento />
          <Partnership />
          <Manifesto />
          <AtAGlance />
          <FloorPlans />
          <Gallery />
          <Amenities />
          <RentalDemand />
          {/* <MediaCoverage />  ← 已停用：内容和上面的 Gamuda Land × Taylor's 区块重复。
              想放回来就把这一行前后的注解符号拿掉 */}
          <RegisterForm />
          {/* <Facilities />  ← 想显示设施九宫格就把这一行前后的注解符号拿掉 */}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  );
}
