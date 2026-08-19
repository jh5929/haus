# HAUS on 15 — 精简版说明

原本 80+ 个文件的项目，现在只剩 **4 个源码文件**。网页外观、动画、功能完全没变。

---

## 一、整个项目长这样

```
haus-clean/
├─ src/
│  ├─ App.jsx        ← 所有画面（Header、Hero、户型、表单…全部在这一个文件）
│  ├─ content.js     ← 所有文字和数据（中英文、价格、图片档名、联络方式）
│  ├─ index.css      ← 全站样式（颜色、字体、动画）
│  └─ index.js       ← 程式进入点，基本不用动
├─ public/
│  ├─ index.html     ← 网页外壳（标题、SEO 描述）
│  ├─ renders/       ← 所有图片
│  └─ HAUS-on-15-Price-List.pdf
├─ package.json      ← 用到哪些套件
├─ tailwind.config.js
├─ vercel.json       ← Vercel 部署设定
└─ .env.example      ← Supabase 金钥范本
```

---

## 二、想改东西，去哪里改？

| 我想改… | 改哪个文件 | 找什么 |
|---|---|---|
| 任何文字（中文或英文） | `src/content.js` | 最下面 `translations`，`en` 是英文、`zh` 是中文 |
| 户型价格、面积、租金、回报率 | `src/content.js` | `UNITS` |
| WhatsApp 号码 / 电话 / Email | `src/content.js` | 最上面第 1 段 |
| 相册要显示哪些图 | `src/content.js` | `GALLERY_IMAGES`（说明文字在 `gallery.items`，顺序要对上） |
| 换图片 | 把新图丢进 `public/renders/`，然后在 `content.js` 改档名 |
| 区块顺序 / 加一段 / 删一段 | `src/App.jsx` | 最下面 **§18 APP**，`<main>` 里面那几行 |
| 某个区块长什么样 | `src/App.jsx` | 照 §3～§17 找，档头有目录 |
| 颜色、字体、跑马灯速度 | `src/index.css` | 最上面 `:root` 是配色 |
| 分页标题、Google 描述 | `public/index.html` | |

`App.jsx` 最上面有一份目录，从 §0 排到 §18，顺序就是网页由上到下的顺序。

---

## 三、在自己电脑上跑起来

```bash
npm install --legacy-peer-deps
npm start
```

浏览器会自动开 http://localhost:3000

打包（不常用，Vercel 会自己做）：

```bash
npm run build
```

---

## 四、Supabase 登记表单

表单送出后写进 Supabase 的 **`leads`** 表，栏位：`name` / `phone` / `email` / `floorplan` / `lang`。
收到的名单在 Supabase 后台 → Table Editor → leads。

金钥不能写进代码，要放在环境变数：

**本机**：在项目根目录建一个 `.env` 文件（照 `.env.example` 抄）

```
REACT_APP_SUPABASE_URL=https://你的项目.supabase.co
REACT_APP_SUPABASE_ANON_KEY=你的-anon-key
```

**Vercel 线上**：Settings → Environment Variables，加上面同样两个，然后 **Redeploy** 才会生效。

如果表单一直送不出去，八成是这两个原因：

1. Vercel 的环境变数没设，或设了没重新部署
2. Supabase `leads` 表的 RLS policy 没允许 `anon` 角色 INSERT

---

## 五、部署到 Vercel 要注意

这个版本把 `frontend/` 那层拿掉了，项目文件直接在根目录。
所以 Vercel 里 **Settings → General → Root Directory** 要设成空的（根目录），
如果之前填的是 `frontend`，记得清掉。

其他设定 `vercel.json` 里已经写好了，不用管。

---

## 六、这次动了什么（外观完全没变）

**合并**

- 15 个 landing 组件 + `ui.jsx` + `i18n.jsx` + `data.js` → 变成 `App.jsx` + `content.js`
- JSX 标记逐字比对过，跟原本一模一样

**删掉**

- `backend/`（FastAPI + MongoDB）—— 表单已经改成直接写 Supabase，这套用不到，而且 Vercel 上也跑不起来
- 50 个没用到的 shadcn/ui 组件（accordion、carousel、table…一个都没被引用）
- `package.json` 里 60 多个没用到的套件，现在只剩 7 个：react、react-dom、react-scripts、framer-motion、lenis、lucide-react、@supabase/supabase-js
- craco —— 原本只是为了 `@/` 路径别名，改成相对路径就不需要了
- Emergent 平台的残留（visual-edits、posthog 追踪脚本、`.emergent/` 资料夹、health-check 外挂）
- 测试文件、test_reports、旧的 build 资料夹

**唯一一处行为变动**

- 表单送出失败时的错误讯息，以前中文版也显示英文，现在会跟着语言走。英文版文字一字不变。

**留着但没显示的**

- `App.jsx` §17 有一段 `Facilities`（设施九宫格）。原本的项目也写了但没放进页面，所以网站上一直看不到。想显示的话，把 §18 里 `{/* <Facilities /> */}` 那行的注解符号拿掉。

**没有搬过来的**

- `public/renders/` 里 4 张没被用到的图：`concept.jpg`、`logo-badge.jpg`、`marble-light.jpg`、`massing.jpg`。需要的话从旧资料夹复制过来就行。

---

## 七、旧资料夹

原本的 `haus-main/` 完全没有动，还留在原位。新版跑起来确认没问题之后，再决定要不要删掉它。
