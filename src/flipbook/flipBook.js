/* ---------------------------------------------------------------------
   Flip-book: opens one of the interest lists (content/interests.js) as a
   book in an overlay, with one favourite per page and 3D page turns.
   Plain DOM and CSS (styles/flipbook.css), no libraries.

     openBook(list, triggerButton)

   Two pages side by side on wide screens, one page at a time on phones.
   Turn pages by clicking a page, swiping, the arrow keys or the
   Previous/Next buttons; Escape or Close puts the book away. Visitors
   who prefer reduced motion get instant page changes, and screen readers
   get the list as plain text inside the dialog.
--------------------------------------------------------------------- */

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function pagesFor(list) {
  const c = list.cover;
  const pages = [{ cover: true }];
  pages.push({
    html: `<div class="pg title-page">
      <div class="pg-kicker" lang="is">${esc(c.eyebrow)}</div>
      <h3 class="pg-title">${esc(c.title)}</h3>
      <p class="pg-note">${esc(list.blurb)}</p>
      <div class="stamp">${esc(c.stamp)}</div>
    </div>`,
  });
  const total = list.items.length;
  list.items.forEach((it, i) => {
    const series = / series$/i.test(it.title);
    const title = series ? it.title.replace(/ series$/i, "") : it.title;
    const tag = c.style === "games" ? "Game" : series ? "Series" : "Novel";
    const initial = title.replace(/^(The|A) /, "").charAt(0);
    pages.push({
      html: `<div class="pg">
        ${it.favourite ? '<span class="pg-ribbon" aria-hidden="true"></span>' : ""}
        <div class="pg-kicker"><span class="pg-tag">${tag}</span><span>${i + 1} / ${total}</span></div>
        <h3 class="pg-title">${esc(title)}</h3>
        <p class="pg-by">by <strong>${esc(it.by)}</strong></p>
        ${it.favourite ? '<div class="pg-fav">All-time favourite</div>' : ""}
        <div class="pg-rule"></div>
        ${it.note ? `<p class="pg-note">${esc(it.note)}</p>` : ""}
        <span class="pg-big-initial" aria-hidden="true">${esc(initial)}</span>
      </div>`,
    });
  });
  if (pages.length % 2 === 0) pages.push({ html: '<div class="pg endpaper"></div>' });
  pages.push({ back: true });
  return pages;
}

function faceHtml(list, page, side) {
  const c = list.cover;
  if (!page) return `<div class="face ${side} endpaper"></div>`;
  if (page.cover)
    return `<div class="face ${side} cover ${c.style}"><div class="cover-inner">
      <span class="cover-eyebrow" lang="is">${esc(c.eyebrow)}</span>
      <p class="cover-title">${esc(c.title)}</p>
      <span class="cover-orn"></span>
      <span class="cover-by">Sigurður G. Hjálmarsson</span></div></div>`;
  if (page.back) return `<div class="face ${side} cover backcover ${c.style}"><p>${esc(c.back)}</p></div>`;
  return `<div class="face ${side}">${page.html}</div>`;
}

let ui = null;
let state = null;
let trigger = null;

function reduceMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildUi() {
  const overlay = document.createElement("div");
  overlay.className = "bk-overlay";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "bk-title");
  overlay.innerHTML = `
    <h2 class="sr-only" id="bk-title"></h2>
    <button type="button" class="bk-close">Close ✕</button>
    <div class="bk-stage"><div class="bk-book" aria-hidden="true"></div></div>
    <div>
      <div class="bk-controls">
        <button type="button" class="bk-nav bk-prev"><span aria-hidden="true">←</span> Previous</button>
        <span class="bk-where" aria-live="polite"></span>
        <button type="button" class="bk-nav bk-next">Next <span aria-hidden="true">→</span></button>
      </div>
      <p class="bk-hint">Click a page, swipe, or use the arrow keys</p>
    </div>
    <ol class="sr-only bk-list"></ol>`;
  document.body.appendChild(overlay);
  const q = (s) => overlay.querySelector(s);
  ui = {
    overlay,
    book: q(".bk-book"),
    prev: q(".bk-prev"),
    next: q(".bk-next"),
    where: q(".bk-where"),
    title: q("#bk-title"),
    list: q(".bk-list"),
    close: q(".bk-close"),
  };

  ui.close.addEventListener("click", closeBook);
  ui.prev.addEventListener("click", () => go(-1));
  ui.next.addEventListener("click", () => go(1));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeBook(); });
  ui.book.addEventListener("click", (e) => {
    if (!state || ui.book.dataset.swiped) return;
    const r = ui.book.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    go(x > (state.single ? 0.4 : 0.5) ? 1 : -1);
  });
  let sx = null;
  ui.book.addEventListener("pointerdown", (e) => { sx = e.clientX; });
  ui.book.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
      ui.book.dataset.swiped = "1";
      setTimeout(() => delete ui.book.dataset.swiped, 50);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!state) return;
    if (e.key === "Escape") closeBook();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "Tab") {
      // keep keyboard focus inside the dialog
      const f = [ui.close, ui.prev, ui.next].filter((b) => !b.disabled);
      const i = f.indexOf(document.activeElement);
      // i === -1: focus is outside the buttons (e.g. on the body), so wrap
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.addEventListener("resize", () => {
    if (!state) return;
    const { list, index } = state;
    build(list);
    state.index = Math.min(index, maxIndex());
    layout(true);
    ui.book.classList.add("is-shown");
  });
}

function sizeBook(single) {
  const vw = window.innerWidth, vh = window.innerHeight;
  let pw = single ? Math.min(360, vw - 40) : Math.min(330, (vw - 64) / 2);
  let ph = pw * 1.38;
  const maxH = vh - 190;
  if (ph > maxH) { ph = maxH; pw = ph / 1.38; }
  ui.book.style.setProperty("--pw", `${pw}px`);
  ui.book.style.setProperty("--ph", `${ph}px`);
}

function build(list) {
  const pages = pagesFor(list);
  const single = window.innerWidth < 700;
  ui.book.className = `bk-book${single ? " single" : ""}${list.cover.style === "games" ? " games-book" : ""}`;
  sizeBook(single);
  let leaves;
  if (single) leaves = pages.map((p) => [p, null]);
  else {
    leaves = [];
    for (let i = 0; i < pages.length; i += 2) leaves.push([pages[i], pages[i + 1]]);
  }
  ui.book.innerHTML = leaves
    .map(([f, b], i) => `<div class="leaf" data-i="${i}">${faceHtml(list, f, "front")}${faceHtml(list, b, "back")}</div>`)
    .join("");
  state = { list, pages, leaves: [...ui.book.querySelectorAll(".leaf")], single, index: 0 };
  ui.title.textContent = list.cover.title;
  ui.list.innerHTML = list.items
    .map((it) => `<li>${esc(it.title)}, by ${esc(it.by)}${it.note ? `. ${esc(it.note)}` : ""}</li>`)
    .join("");
  layout(true);
}

const maxIndex = () => (state.single ? state.leaves.length - 1 : state.leaves.length);

function layout(instant, moving) {
  const n = state.leaves.length;
  state.leaves.forEach((leaf, i) => {
    const flipped = i < state.index;
    leaf.classList.toggle("flipped", flipped);
    leaf.style.zIndex = i === moving ? n + 2 : flipped ? i + 1 : n - i;
    leaf.style.transition = instant ? "none" : "";
  });
  if (instant) {
    void ui.book.offsetWidth;
    state.leaves.forEach((l) => (l.style.transition = ""));
  }
  if (moving != null) setTimeout(() => { if (state) layout(false); }, reduceMotion() ? 0 : 900);
  ui.book.classList.toggle("at-open", !state.single && state.index > 0 && state.index < n);
  ui.book.classList.toggle("at-end", !state.single && state.index === n);
  const i = state.index, total = state.pages.length;
  const atStart = i === 0, atEnd = i >= maxIndex();
  // a focused button that becomes disabled drops focus to the body, so
  // move it first: to the other nav button, or to Close
  if (atStart && document.activeElement === ui.prev) (atEnd ? ui.close : ui.next).focus();
  if (atEnd && document.activeElement === ui.next) (atStart ? ui.close : ui.prev).focus();
  ui.prev.disabled = atStart;
  ui.next.disabled = atEnd;
  ui.where.textContent = state.single
    ? i === 0 ? "Cover" : i === total - 1 ? "Back cover" : `Page ${i} of ${total - 2}`
    : i === 0 ? "Cover" : i === n ? "Back cover" : `Pages ${2 * i - 1}–${Math.min(2 * i, total - 2)} of ${total - 2}`;
}

function go(delta) {
  if (!state) return;
  const target = Math.max(0, Math.min(maxIndex(), state.index + delta));
  if (target === state.index) return;
  const moving = delta > 0 ? state.index : target;
  state.index = target;
  layout(false, moving);
}

// the page behind the dialog (the React root) is taken out of reach of
// keyboard and screen readers while the book is open
function setPageInert(on) {
  const root = document.getElementById("root");
  if (root) root.inert = on;
}

export function openBook(list, button) {
  if (!ui) buildUi();
  trigger = button || null;
  ui.overlay.hidden = false;
  build(list);
  document.body.style.overflow = "hidden";
  setPageInert(true);
  requestAnimationFrame(() => {
    ui.overlay.classList.add("is-open");
    ui.book.classList.add("is-shown");
    ui.close.focus();
    // the cover opens a moment after the book appears
    setTimeout(() => { if (state && state.index === 0) go(1); }, reduceMotion() ? 0 : 650);
  });
}

export function closeBook() {
  if (!state) return;
  ui.overlay.classList.remove("is-open");
  ui.book.classList.remove("is-shown");
  document.body.style.overflow = "";
  setPageInert(false);
  state = null;
  const done = () => {
    if (state) return; // reopened meanwhile
    ui.overlay.hidden = true;
    ui.book.innerHTML = "";
    if (trigger) trigger.focus();
  };
  if (reduceMotion()) done();
  else setTimeout(done, 320);
}
