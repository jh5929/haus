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
 *    §6  Marquee     跑马灯文字
 *    §7  Manifesto   为何投资 · 四个理由
 *    §8  AtAGlance   项目速览表格
 *    §9  FloorPlans  户型 A–E + 平面图放大弹窗
 *    §10 Gallery     相册
 *    §11 Amenities   位置地图 + 周边配套手风琴
 *    §12 RentalDemand 租赁需求
 *    §13 MediaCoverage 媒体报道
 *    §14 RegisterForm 登记表单（写入 Supabase leads 表）
 *    §15 Footer      页尾
 *    §16 FloatingWhatsApp 右下角浮动 WhatsApp 按钮
 *    §17 Facilities  设施（原项目写了但没显示，想用就看 §18 说明）
 *    §18 App         把上面所有区块排在一起 ← 想调换顺序改这里
 * ========================================================================== */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowDown, Baby, BedDouble, CheckCircle2, Download, Dumbbell, Expand, Flame,
  GraduationCap, HeartPulse, Laptop, Loader2, Mail, MapPin, Maximize, Menu, Minus,
  Newspaper, Phone, Plus, ShoppingCart, ShieldCheck, TrainFront, Trees, TreePine,
  TrendingUp, Users, Waves, Wine, X, ZoomIn, ZoomOut,
} from "lucide-react";

import {
  CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, GALLERY_IMAGES, IMG, MEDIA_IMAGES,
  translations, UNITS, waLink, WHATSAPP_NUMBER,
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 环境变数没设定：请设定 REACT_APP_SUPABASE_URL 和 REACT_APP_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

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
        ? "bg-[#0E0E0F] text-white hover:bg-[#C6A15B]"
        : "bg-[#25D366] text-[#062e14] hover:brightness-105"
    } ${className}`}
  >
    <WhatsappIcon className="w-5 h-5" />
    {children}
  </motion.a>
);

// 包住任何东西，滚动到画面时淡入上浮
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 导航项目。href 要对得上各区块的 id（例如 #floorplans 对应 §9 的 <section id="floorplans">）
  const nav = [
    { href: "#floorplans", label: t.nav.residences },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#location", label: t.nav.location },
    { href: "#register", label: t.nav.register },
  ];

  const LangToggle = ({ idSuffix = "" }) => (
    <div className="flex items-center rounded-full bg-black/10 p-0.5 text-sm font-display" data-testid={`lang-toggle${idSuffix}`}>
      <button
        data-testid={`lang-en${idSuffix}`}
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full transition-colors ${lang === "en" ? "bg-[#0E0E0F] text-white" : "text-black/55"}`}
      >
        EN
      </button>
      <button
        data-testid={`lang-zh${idSuffix}`}
        onClick={() => setLang("zh")}
        className={`px-3 py-1.5 rounded-full transition-colors ${lang === "zh" ? "bg-[#0E0E0F] text-white" : "text-black/55"}`}
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
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6"
      data-testid="site-header"
    >
      <div
        className={`mt-3 flex items-center justify-between rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 sm:py-3.5 transition-all duration-500 ${
          scrolled || open ? "glass" : "bg-white/10 backdrop-blur-md border border-white/15"
        }`}
      >
        <a href="#top" onClick={() => setOpen(false)} className="flex items-baseline gap-1.5" data-testid="brand-logo">
          <span className={`font-display font-extrabold tracking-tight text-xl sm:text-2xl ${scrolled || open ? "text-[#0E0E0F]" : "text-white"}`}>HAUS</span>
          <span className="font-serif-accent italic text-[#C6A15B] text-lg sm:text-xl">on 15</span>
        </a>

        {/* 电脑版导航 */}
        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`nav-${n.href.slice(1)}`}
              className={`font-display text-sm tracking-wide transition-colors hover:text-[#C6A15B] ${scrolled ? "text-[#0E0E0F]/80" : "text-white/90"}`}
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
            className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center ${scrolled || open ? "bg-[#0E0E0F] text-white" : "bg-white/20 text-white backdrop-blur"}`}
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
            className="lg:hidden glass rounded-2xl mt-2 p-4"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-${n.href.slice(1)}`}
                  className="font-display text-lg text-[#0E0E0F]/85 py-3 border-b border-black/5 last:border-0"
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
        <img src={IMG("hero-aerial.jpg")} alt="HAUS on 15 aerial view over Subang Jaya SS15" className="w-full h-full object-cover" />
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
          className="glass-dark inline-flex self-start items-center gap-2 rounded-full px-4 py-1.5 text-white/90"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
          <span className="text-[11px] sm:text-xs tracking-mega uppercase font-display">{t.hero.badge}</span>
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
                on <span className="font-serif-accent italic font-medium text-[#C6A15B]">15</span>
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, type: "spring", stiffness: 90, damping: 16 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <WAButton testId="hero-whatsapp-btn">{t.hero.cta}</WAButton>
            <a
              href="#floorplans"
              data-testid="hero-explore-link"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-display font-semibold text-[15px] text-white border border-white/40 hover:bg-white/10 transition-colors"
            >
              {t.hero.explore}
            </a>
          </motion.div>
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
            className="glass rounded-3xl p-5 sm:p-6"
          >
            <div className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-[#0E0E0F]">
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
 * §6  MARQUEE — 一直往左跑的大字（速度改 index.css 的 .marquee-track）
 * ========================================================================== */

function Marquee() {
  const { t } = useLang();
  const items = [...t.marquee, ...t.marquee]; // 复制一份，跑到底才能无缝接回
  return (
    <section className="py-16 sm:py-24 overflow-hidden" data-testid="marquee-section">
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="font-serif-accent italic text-[#0E0E0F] text-5xl sm:text-7xl px-6 sm:px-10">{w}</span>
            <span className="text-[#C6A15B] text-4xl sm:text-6xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
 * §7  MANIFESTO — 为何投资 · 01–04 四个理由
 * ========================================================================== */

function Manifesto() {
  const { t } = useLang();
  return (
    <section className="px-5 sm:px-8 py-8 max-w-5xl mx-auto" data-testid="manifesto-section">
      <Reveal>
        <p className="font-display text-xs tracking-mega uppercase text-[#C6A15B] mb-3">{t.manifesto.eyebrow}</p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.03] max-w-2xl">
          {t.manifesto.heading}
        </h2>
      </Reveal>

      <div className="mt-14 sm:mt-20 divide-y divide-black/10 border-t border-black/10">
        {t.manifesto.chapters.map((c) => (
          <motion.div
            key={c.no}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            data-testid={`chapter-${c.no}`}
            className="grid grid-cols-[auto,1fr] sm:grid-cols-[7rem,1fr] gap-4 sm:gap-10 py-8 sm:py-12 group"
          >
            <span className="font-serif-accent italic text-5xl sm:text-7xl text-[#C6A15B]/40 group-hover:text-[#C6A15B] transition-colors duration-500">
              {c.no}
            </span>
            <div>
              <h3 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">{c.title}</h3>
              <p className="mt-3 text-black/60 text-base sm:text-lg leading-relaxed max-w-2xl font-body">{c.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
 * §8  AT A GLANCE — 项目速览表格（改 content.js 的 glance.rows）
 * ========================================================================== */

function AtAGlance() {
  const { t } = useLang();
  return (
    <section id="glance" className="px-5 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto scroll-mt-24" data-testid="glance-section">
      <Reveal>
        <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)] mb-3">{t.glance.eyebrow}</p>
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
            className="grid grid-cols-[1fr,1.3fr] sm:grid-cols-[1fr,2fr] gap-4 px-5 sm:px-8 py-4 border-b border-black/8 last:border-0 items-baseline"
          >
            <span className="font-display text-xs sm:text-sm uppercase tracking-widest text-[var(--taupe-deep)]">{row.k}</span>
            <span className="font-body text-[15px] sm:text-base text-[#0E0E0F]/85">{row.v}</span>
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
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(null);

  const toggleZoom = () => {
    if (zoom > 1) { setZoom(1); setPos({ x: 0, y: 0 }); }
    else setZoom(2.2);
  };

  const onPointerDown = (e) => {
    if (zoom === 1) return;
    dragging.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y });
  };
  const onPointerUp = () => { dragging.current = null; };

  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          data-testid="floorplan-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[#0E0E0F]/92 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="font-display text-[#C6A15B] text-xs tracking-mega uppercase">{t.plan.title}</p>
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
                className="w-11 h-11 rounded-full bg-white text-[#0E0E0F] flex items-center justify-center"
                aria-label={t.plan.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-hidden flex items-center justify-center px-3 pb-3 select-none"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <motion.img
              src={IMG(unit.plan)}
              alt={`Type ${unit.type} floor plan`}
              onDoubleClick={toggleZoom}
              onClick={() => zoom === 1 && toggleZoom()}
              animate={{ scale: zoom, x: pos.x, y: pos.y }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`max-h-full max-w-full w-auto rounded-xl bg-white ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
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
  const [active, setActive] = useState(0);       // 目前选中第几个户型
  const [zoomUnit, setZoomUnit] = useState(null); // 不是 null 就会弹出上面的放大视窗
  const u = UNITS[active];

  return (
    <section id="floorplans" className="px-5 sm:px-8 py-20 sm:py-28 max-w-5xl mx-auto scroll-mt-24" data-testid="floorplans-section">
      <div>
        <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)] mb-3">{t.units.eyebrow}</p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl">{t.units.heading}</h2>
        <p className="mt-4 text-black/55 max-w-lg font-body">{t.units.sub}</p>
      </div>

      {/* Type A / B / C / D / E 分页按钮 */}
      <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {UNITS.map((unit, i) => (
          <button
            key={unit.type}
            data-testid={`plan-tab-${unit.type}`}
            onClick={() => setActive(i)}
            className={`shrink-0 px-5 py-2.5 rounded-full font-display font-semibold text-sm tracking-wide transition-colors border ${
              i === active
                ? "bg-[var(--taupe-deep)] text-white border-[var(--taupe-deep)]"
                : "bg-transparent text-black/55 border-black/15 hover:border-[var(--taupe)]"
            }`}
          >
            Type {unit.type}
          </button>
        ))}
      </div>

      {/* 左边平面图，右边规格卡 */}
      <div className="mt-6 grid lg:grid-cols-[1.6fr,1fr] gap-6 items-start">
        <button
          data-testid="plan-image-enlarge"
          onClick={() => setZoomUnit(u)}
          className="group relative block w-full rounded-2xl overflow-hidden bg-white border border-black/10"
        >
          <img
            key={u.type}
            src={IMG(u.plan)}
            alt={`Type ${u.type} floor plan`}
            className="w-full h-auto object-contain"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#0E0E0F]/80 text-white text-xs font-display px-3 py-1.5">
            <Expand className="w-3.5 h-3.5" /> {t.floorplans.enlarge}
          </span>
        </button>

        <div className="rounded-2xl bg-[#F0ECE3] border border-black/5 p-6">
          <div className="flex items-baseline justify-between">
            <span className="font-display font-extrabold text-5xl tracking-tight">{u.type}</span>
            <span className="text-xs font-display uppercase tracking-widest text-[var(--taupe-deep)] bg-white rounded-full px-3 py-1">
              {t.units.keyLabels[u.keyType]}
            </span>
          </div>
          <div className="mt-6 space-y-4 text-black/70 font-body">
            <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-[var(--taupe-deep)]" /> {u.beds}{t.units.bed} · {u.baths}{t.units.bath}</div>
            <div className="flex items-center gap-2"><Maximize className="w-5 h-5 text-[var(--taupe-deep)]" /> {u.size} sq ft</div>
            <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[var(--taupe-deep)]" /> {u.yield}% gross yield</div>
          </div>
          <div className="mt-6 pt-5 border-t border-black/10">
            <p className="text-[11px] uppercase tracking-widest text-black/40 font-display">{t.units.from}</p>
            <p className="font-display font-bold text-3xl tracking-tight">RM {u.price.toLocaleString("en-US")}</p>
            <p className="text-sm text-black/45 font-body mt-1">~RM{u.rent.toLocaleString("en-US")}{t.units.perMo}</p>
          </div>
        </div>
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
  const [open, setOpen] = useState("education"); // 一进来预设展开「教育」

  return (
    <section id="location" className="px-5 sm:px-8 py-20 sm:py-28 max-w-3xl mx-auto scroll-mt-24" data-testid="amenities-section">
      <Reveal>
        <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)] mb-3">{t.location.eyebrow}</p>
        <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03] max-w-xl">{t.location.heading}</h2>
      </Reveal>

      {/* 两个小数据卡：82,628 学生 / 12 分钟到 LRT（数字是写死在这里的） */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F0ECE3] border border-black/5 px-5 py-4">
          <GraduationCap className="w-6 h-6 text-[var(--taupe-deep)]" />
          <div>
            <p className="font-display font-extrabold text-2xl sm:text-3xl leading-none">82,628</p>
            <p className="text-black/50 text-xs mt-1 font-body">{t.location.students}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F0ECE3] border border-black/5 px-5 py-4">
          <MapPin className="w-6 h-6 text-[var(--taupe-deep)]" />
          <div>
            <p className="font-display font-extrabold text-2xl sm:text-3xl leading-none">12 min</p>
            <p className="text-black/50 text-xs mt-1 font-body">{t.location.lrt}</p>
          </div>
        </div>
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div className="rounded-2xl overflow-hidden border border-black/10">
          <img src={IMG("location-map.jpg")} alt="HAUS on 15 location map" className="w-full object-cover" />
        </div>
      </Reveal>

      <div className="mt-8" data-testid="amenities-accordion">
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
                <span className="w-11 h-11 rounded-full border border-[var(--taupe)]/50 flex items-center justify-center text-[var(--taupe-deep)] shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1 font-display font-semibold text-xl sm:text-2xl tracking-tight uppercase text-[#0E0E0F]/85">{cat.label}</span>
                {isOpen && <span className="hidden sm:block font-display font-semibold text-sm text-[#0E0E0F] mr-2">{t.amenities.radius}</span>}
                <span className="text-[var(--taupe-deep)]">{isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}</span>
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
 * §12  RENTAL DEMAND — 左图右文（图 = rental-demand.jpg）
 * ========================================================================== */

function RentalDemand() {
  const { t } = useLang();
  return (
    <section id="rental-demand" className="px-5 sm:px-8 py-16 sm:py-24 max-w-5xl mx-auto scroll-mt-24" data-testid="rental-demand-section">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="overflow-hidden border border-black/10"
        >
          <img src={IMG("rental-demand.jpg")} alt="University students near HAUS on 15" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-[var(--taupe-deep)]">
            <GraduationCap className="w-5 h-5" />
            <p className="font-display text-xs tracking-mega uppercase">{t.rental.eyebrow}</p>
          </div>
          <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.03]">{t.rental.heading}</h2>
          <p className="mt-5 text-black/60 text-lg font-body leading-relaxed">{t.rental.body}</p>
        </motion.div>
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
        <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)] mb-3">{t.media.eyebrow}</p>
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
              <p className="font-serif-accent text-[1.3rem] leading-snug text-[#0E0E0F]/85">{m.title}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

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
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        floorplan: form.floorplan || null,
        lang,
      });
      if (error) throw error;
      setStatus("done");
    } catch {
      setStatus("error");
      setErr(t.register.errFailed);
    }
  };

  return (
    <section id="register" className="relative px-3 sm:px-8 py-16 scroll-mt-24" data-testid="register-section">
      <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden marble-dark" style={{ backgroundImage: "url(/renders/marble-dark.jpg)" }}>
        <div className="absolute inset-0 bg-[var(--espresso)]/85" />

        <div className="relative z-10 px-6 sm:px-16 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <p className="font-display text-xs tracking-mega uppercase text-[#E4C87E] mb-3">{t.register.eyebrow}</p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.02]">{t.register.heading}</h2>
            <p className="mt-5 text-white/75 max-w-md font-body">{t.register.sub}</p>
          </div>

          <div className="rounded-3xl bg-[#F4F1EA] p-6 sm:p-8">
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
                  className="flex items-center justify-center gap-2 text-sm text-black/55 hover:text-[#0E0E0F] font-body pt-1"
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
            <span className="font-serif-accent italic text-[#C6A15B] text-xl">on 15</span>
          </div>
          <p className="mt-3 text-black/50 text-sm max-w-sm font-body">{t.footer.tagline}</p>
        </div>

        <div className="sm:text-right">
          <p className="font-display text-xs tracking-mega uppercase text-[#C6A15B] mb-3">{t.footer.contact}</p>
          <div className="flex flex-col gap-2 text-sm text-black/70 sm:items-end">
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-2 hover:text-black transition-colors" data-testid="footer-phone-link">
              <Phone className="w-4 h-4 text-[#C6A15B]" /> {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 hover:text-black transition-colors" data-testid="footer-email-link">
              <Mail className="w-4 h-4 text-[#C6A15B]" /> {CONTACT_EMAIL}
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
      className="pulse-ring fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)]"
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
        <p className="font-display text-xs tracking-mega uppercase text-[var(--taupe-deep)] mb-3">{t.facilities.eyebrow}</p>
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
              className="rounded-2xl bg-[#F0ECE3] border border-black/5 p-5 sm:p-6 flex flex-col gap-4"
            >
              <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--taupe-deep)]">
                <Icon className="w-6 h-6" />
              </span>
              <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-[#0E0E0F]/85 leading-snug">
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
      <div className="App relative bg-[#F4F1EA]" data-testid="landing-root">
        <Header />
        <main>
          <Hero />
          <StatsBento />
          <Marquee />
          <Manifesto />
          <AtAGlance />
          <FloorPlans />
          <Gallery />
          <Amenities />
          <RentalDemand />
          <MediaCoverage />
          <RegisterForm />
          {/* <Facilities />  ← 想显示设施九宫格就把这一行前后的注解符号拿掉 */}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </LanguageProvider>
  );
}
