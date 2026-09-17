# 纪念站 · Memorial Site

一个简洁、庄重、纯前端的静态纪念网页，用于缅怀与纪念敬爱的人。

A simple, solemn, fully static memorial page to honor someone you love. No server, no database, no build step.

## 特性 Features

- 🔖 遗像 / 姓名 / 生卒年月 — Portrait, name, dates
- 📖 悼词 — Eulogy
- 🗓 生平时间线 — Life timeline
- 📷 照片墙（点击可放大）— Photo gallery with lightbox
- 🕯 点烛 · 🌸 献花 · 🪷 烧香 — Light candles, offer flowers & burn incense
- 💬 留言悼念墙 — Condolence message wall
- 🌐 中英双语一键切换 — One-click zh/en toggle
- 📱 响应式移动端适配 — Fully responsive

> 所有互动数据（蜡烛数、鲜花数、香数、留言、语言偏好）保存在访问者浏览器的 `localStorage` 中，纯前端实现，无需任何后端。

> All interaction data (candles, flowers, messages, language) is stored in the visitor's browser via `localStorage`. It is 100% front-end — no backend required.

## 个性化配置 Customize

打开 [`js/data.js`](js/data.js)，这是唯一的配置入口，替换示例内容即可：

Open [`js/data.js`](js/data.js) — it is the only config file. Replace the placeholder content:

| 字段 Field       | 说明 Description                              |
| ---------------- | ---------------------------------------------- |
| `portrait`       | 遗像/照片路径 Photo path                       |
| `title`          | 页面标题 zh/en                                 |
| `name`           | 姓名 Name（zh / en）                           |
| `dates`          | 生卒年月 Date of birth & death                 |
| `subtitle`       | 副标题 Subtitle（zh / en）                     |
| `eulogy`         | 悼词正文（支持换行，用 `\n`）Eulogy text       |
| `timeline`       | 时间线数组，`{ year, zh, en }`                 |
| `photos`         | 照片数组，`{ src, zh, en }`，放到 `assets/` 下 |
| `footer`         | 页脚文字 Footer text                           |

照片与遗像建议使用 4:3（照片墙）与正方形（遗像）图片。Placeholder SVGs in `assets/` can be replaced freely. Recommended ratios: portrait square, gallery photos 4:3.

## 部署 Deploy

纯静态站点，三种方式任意一种，均为免费额度。

A fully static site — choose any of the three, all within free tiers.

### 1. GitHub Pages

1. 将本仓库 push 到 GitHub；
2. `Settings → Pages → Build and deployment`；
3. Source 选 `Deploy from a branch`，branch 选 `main`，folder 选 `/ (root)`；
4. 保存后等待数分钟，访问 `https://<用户名>.github.io/memorial-site/`。

备注：如果希望部署到自定义域名，在 Settings → Pages 的 Custom domain 中填写即可。

### 2. Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages → Create → Pages → Connect to Git**；
2. 选中本仓库 → **Begin setup**；
3. 构建配置：
   - Framework preset: **None**
   - Build command: 留空（无需构建）
   - Build output directory: 留空（仓库根目录即为站点）
4. 点击 **Save and Deploy**，稍后即可获得 `https://<project名>.pages.dev` 地址。

备注：首次部署后，在 Pages 项目 → **Custom domains** 可绑定自己的域名。

### 3. Vercel

1. 登录 [Vercel](https://vercel.com/) → **New Project → Import** 本仓库；
2. Framework Preset 选 **Other**；
3. Build Command / Output Directory 全部保持为空；
4. 点击 **Deploy**，完成后获得 `https://<项目名>.vercel.app` 地址。

### 4. Cloudflare Workers（可选 Option）

也欢迎直接以 Workers static assets 方式部署：

```bash
npm i -g wrangler
wrangler deploy  --assets .
```

或在 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Deploy from a local folder 上传仓库根目录。

---

愿这份心意长存。 May this memorial keep your love alive. 🕯