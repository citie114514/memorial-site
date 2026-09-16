/* 纪念站逻辑 · Memorial site scripts */

const I18N = {
  zh: {
    memorialTitle: MEMORIAL.title.zh,
    eulogyTitle: "悼 词",
    timelineTitle: "生 平 永 念",
    galleryTitle: "往 日 时 光",
    offeringsTitle: "愿 灯 火 长 明",
    offeringsHint: "为敬爱的人点亮一盏烛火，献上一束鲜花",
    btnCandle: "点亮蜡烛",
    btnFlower: "献上鲜花",
    messagesTitle: "留 言 悼 念",
    msgNamePlaceholder: "您的称呼（可选）",
    msgTextPlaceholder: "写下您想说的话…",
    kindCandle: "点烛",
    kindFlower: "献花",
    kindNone: "仅留言",
    msgSubmit: "送上思念",
    msgListEmpty: "还没有留言，写下第一句思念吧。",
    msgDateSuffix: "于",
    footerText: MEMORIAL.footer.zh,
  },
  en: {
    memorialTitle: MEMORIAL.title.en,
    eulogyTitle: "Eulogy",
    timelineTitle: "Life",
    galleryTitle: "Memories",
    offeringsTitle: "Light, Still Burning",
    offeringsHint: "Light a candle and offer a flower for the loved one",
    btnCandle: "Light Candle",
    btnFlower: "Offer Flower",
    messagesTitle: "Condolences",
    msgNamePlaceholder: "Your name (optional)",
    msgTextPlaceholder: "Write your words here…",
    kindCandle: "Candle",
    kindFlower: "Flower",
    kindNone: "Message",
    msgSubmit: "Send",
    msgListEmpty: "No messages yet. Leave a word of remembrance.",
    msgDateSuffix: "on",
    footerText: MEMORIAL.footer.en,
  },
};

/* ---------- state ---------- */
let lang = localStorage.getItem("memorial_lang") === "en" ? "en" : "zh";

function readNum(key) {
  const n = parseInt(localStorage.getItem(key) || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

let candles = readNum("memorial_candles");
let flowers = readNum("memorial_flowers");
let messages = [];

try {
  messages = JSON.parse(localStorage.getItem("memorial_messages") || "[]");
  if (!Array.isArray(messages)) messages = [];
} catch (e) {
  messages = [];
}

function persist(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    /* storage unavailable: keep in-memory */
  }
}

/* ---------- helpers ---------- */
const t = (key) => I18N[lang][key] || key;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function candleHTML(lit) {
  return '<span class="candle ' + (lit ? "candle--lit" : "candle--dim") + '">' +
    '<span class="candle__flame"></span><span class="candle__wax"></span></span>';
}

function fmtDate(ts) {
  const d = new Date(ts);
  try {
    return d.toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch (e) {
    return d.toLocaleString();
  }
}

/* ---------- rendering ---------- */
function renderI18N() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const toggle = document.getElementById("langToggle");
  toggle.textContent = lang === "zh" ? "English" : "中文";
}

function render() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = MEMORIAL.name[lang] + " · " + MEMORIAL.title[lang];

  const portrait = document.getElementById("portrait");
  portrait.src = MEMORIAL.portrait;
  portrait.alt = MEMORIAL.name[lang];

  document.getElementById("memorialName").textContent = MEMORIAL.name[lang];
  document.getElementById("memorialDates").textContent = MEMORIAL.dates[lang];

  let sub = document.getElementById("memorialSub");
  if (!sub) {
    sub = document.createElement("p");
    sub.id = "memorialSub";
    sub.className = "hero__dates-sub";
    document.getElementById("memorialDates").insertAdjacentElement("afterend", sub);
  }
  sub.textContent = MEMORIAL.subtitle[lang];

  document.getElementById("eulogyBody").textContent = MEMORIAL.eulogy[lang];

  const list = document.getElementById("timelineList");
  list.innerHTML = "";
  MEMORIAL.timeline.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline__item";
    const year = document.createElement("div");
    year.className = "timeline__year";
    year.textContent = item.year;
    const desc = document.createElement("div");
    desc.className = "timeline__desc";
    desc.textContent = item[lang];
    li.appendChild(year);
    li.appendChild(desc);
    list.appendChild(li);
  });

  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";
  MEMORIAL.photos.forEach((photo) => {
    const li = document.createElement("li");
    li.className = "gallery__item";
    const img = document.createElement("img");
    img.className = "gallery__img";
    img.src = photo.src;
    img.alt = photo[lang];
    img.loading = "lazy";
    img.addEventListener("click", () => openLightbox(photo.src, photo[lang]));
    const cap = document.createElement("div");
    cap.className = "gallery__cap";
    cap.textContent = photo[lang];
    li.appendChild(img);
    li.appendChild(cap);
    grid.appendChild(li);
  });

  document.getElementById("candleCount").textContent = candles;
  document.getElementById("flowerCount").textContent = flowers;
  document.getElementById("candleIcon").innerHTML = candleHTML(true);

  renderI18N();
  renderMessages();
}

function renderMessages() {
  const list = document.getElementById("msgList");
  const empty = document.getElementById("msgListEmpty");
  list.innerHTML = "";
  if (messages.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  const sorted = messages.slice().sort((a, b) => b.ts - a.ts);
  sorted.forEach((m) => {
    const li = document.createElement("li");
    li.className = "msg-item";
    const head = document.createElement("div");
    head.className = "msg-item__head";
    const who = document.createElement("span");
    who.className = "msg-item__who";
    who.textContent = m.name || "—";
    const right = document.createElement("span");
    right.className = "msg-item__right";
    if (m.kind === "candle") right.innerHTML = candleHTML(true);
    else if (m.kind === "flower") right.textContent = "🌸";
    else right.textContent = "";
    right.title = t("kind" + m.kind.charAt(0).toUpperCase() + m.kind.slice(1) || "");
    const when = document.createElement("span");
    when.className = "msg-item__date";
    when.textContent = t("msgDateSuffix") + " " + fmtDate(m.ts);
    head.appendChild(who);
    head.appendChild(right);
    head.appendChild(when);
    const text = document.createElement("div");
    text.className = "msg-item__text";
    text.textContent = m.text;
    li.appendChild(head);
    li.appendChild(text);
    list.appendChild(li);
  });
}

/* ---------- actions ---------- */
function lightCandle() {
  candles += 1;
  persist("memorial_candles", String(candles));
  document.getElementById("candleCount").textContent = candles;
}

function offerFlower() {
  flowers += 1;
  persist("memorial_flowers", String(flowers));
  document.getElementById("flowerCount").textContent = flowers;
}

function submitMessage(e) {
  e.preventDefault();
  const name = document.getElementById("msgName").value.trim();
  const kind = document.getElementById("msgKind").value;
  const text = document.getElementById("msgText").value.trim();
  if (!text) return;
  messages.push({ name, kind, text, ts: Date.now() });
  persist("memorial_messages", JSON.stringify(messages));
  document.getElementById("msgText").value = "";
  renderMessages();
}

/* ---------- lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
}

/* ---------- bind ---------- */
document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "zh" ? "en" : "zh";
  persist("memorial_lang", lang);
  render();
});

document.getElementById("btnCandle").addEventListener("click", lightCandle);
document.getElementById("btnFlower").addEventListener("click", offerFlower);
document.getElementById("msgForm").addEventListener("submit", submitMessage);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

render();