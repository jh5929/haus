/* =============================================================================
 *  analytics.js — Meta Pixel（脸书广告）+ GA4（Google 分析）
 * =============================================================================
 *  两个 ID 都写在 content.js 最上面。没填 = 什么都不载入，网站照常跑，
 *  所以现在没有 ID 也可以先合并上线，之后填了再部署一次就生效。
 *
 *  追踪三件事：
 *    1. 点 WhatsApp（任何一个入口，包含右下角浮动按钮）
 *    2. 送出留资表单成功
 *    3. 下载价格表 PDF
 *
 *  这三个就是广告后台要看的「转换」。有了它们，Meta / Google 才知道
 *  该把广告推给什么样的人，你也才看得出哪条广告真的带来询问。
 * ========================================================================== */

import { META_PIXEL_ID, GA4_ID, GOOGLE_ADS_ID, GOOGLE_ADS_LABELS } from "./content";

let started = false;

// ---- Google 的两个标签（GA4 和 Google Ads 共用同一支 gtag.js）--------------
function loadGtag(ids) {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  ids.forEach((id) => window.gtag("config", id));
}

// ---- Meta Pixel -----------------------------------------------------------
function loadPixel(id) {
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq("init", id);
  window.fbq("track", "PageView");
}

// ---- 送出事件 --------------------------------------------------------------
// gaName = GA4 里的事件名；fbName = Meta 的事件名；fbStandard = 是不是 Meta 的标准事件
function send(gaName, fbName, fbStandard = true, params = {}, adsLabel = "") {
  if (window.gtag) {
    window.gtag("event", gaName, params);
    // Google Ads 的转换要另外送一笔，而且一定要有标签才算数
    if (GOOGLE_ADS_ID && adsLabel) {
      window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${adsLabel}` });
    }
  }
  if (window.fbq) window.fbq(fbStandard ? "track" : "trackCustom", fbName, params);
}

export const trackWhatsApp = (where) =>
  send("whatsapp_click", "Contact", true, { source: where }, GOOGLE_ADS_LABELS.whatsapp);
export const trackLead = () => send("generate_lead", "Lead", true, {}, GOOGLE_ADS_LABELS.lead);
export const trackPriceList = () => send("file_download", "PriceListDownload", false);

// ---- 启动 ------------------------------------------------------------------
export function initAnalytics() {
  if (started) return;
  started = true;

  const googleIds = [GA4_ID, GOOGLE_ADS_ID].filter(Boolean);
  if (googleIds.length) loadGtag(googleIds);
  if (META_PIXEL_ID) loadPixel(META_PIXEL_ID);
  if (!googleIds.length && !META_PIXEL_ID) return; // 全都没设就不用挂监听了

  // 用一个监听器接住全站所有 WhatsApp 连结和价格表下载，
  // 这样以后新增按钮不用再记得补追踪码。
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.includes("wa.me") || href.includes("whatsapp")) {
      trackWhatsApp(a.dataset.testid || "unknown");
    } else if (href.toLowerCase().endsWith(".pdf")) {
      trackPriceList();
    }
  });
}
