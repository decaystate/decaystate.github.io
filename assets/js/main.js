(() => {
  "use strict";
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(Number.isInteger(n) ? 0 : 2);
  const ext = (href, label, cls = "tlink", track = "") =>
    `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener"${track ? ` data-track="${esc(track)}"` : ""}>${label}</a>`;
  const slug = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* ---------- dates (band is on Central time) ---------- */
  const centralOffset = (ymd) => { const m = +ymd.slice(5, 7); return m >= 4 && m <= 10 ? "-05:00" : "-06:00"; };
  const at = (ymd, hhmm = "00:00") => new Date(`${ymd}T${hhmm}:00${centralOffset(ymd)}`);
  const todayYMD = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const fmt = (ymd, o) => at(ymd, "12:00").toLocaleDateString("en-US", { timeZone: "America/Chicago", ...o });

  /* ---------- basics ---------- */
  $$("[data-email]").forEach((e) => (e.textContent = S.email));
  $$("[data-hometown]").forEach((e) => (e.textContent = S.hometown));
  $$("[data-coords]").forEach((e) => (e.textContent = S.coords || ""));
  $$("[data-genre]").forEach((e) => (e.textContent = S.genre || "Heavy music"));
  $("#year").textContent = new Date().getFullYear();
  $("#mailLink").href = "mailto:" + S.email;

  /* ---------- stats (GoatCounter, optional) ---------- */
  const GC = S.analytics?.goatcounter;
  if (GC) {
    const sc = document.createElement("script");
    sc.async = true; sc.src = "https://gc.zgo.at/count.js";
    sc.dataset.goatcounter = `https://${GC}.goatcounter.com/count`;
    document.head.appendChild(sc);
  }
  const track = (name, title) => {
    try { window.goatcounter?.count?.({ path: name, title: title || name, event: true }); } catch {}
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-track]");
    if (a) track(a.dataset.track, a.textContent.trim());
  }, true);

  const toastEl = $("#toast");
  let toastT;
  const toast = (msg) => {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };
  const copy = async (text, done = "Copied", fallbackEl) => {
    try { await navigator.clipboard.writeText(text); toast(done); }
    catch {
      if (fallbackEl) { const r = document.createRange(); r.selectNodeContents(fallbackEl); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      toast("Press Ctrl/Cmd + C to copy");
    }
  };
  $("#mailLink").dataset.track = "booking-email";
  $("#copyMail").addEventListener("click", () => copy(S.email, "Email copied", $(".mail__addr")));

  const L = S.links;
  const ytHref = (r) => (r.youtube ? `https://www.youtube.com/watch?v=${encodeURIComponent(r.youtube)}` : L.youtube);
  const listenHref = (r) => r.listen || L.spotify || L.linktree;
  const isOut = (r) => !r.date || at(r.date) <= Date.now();

  /* ---------- hero drop + countdown ---------- */
  const feat = S.releases.find((r) => r.featured) || S.releases[0];
  if (feat) {
    $("#dropTitle").textContent = feat.title;
    $("#dropNote").textContent = feat.note || "";
    const count = $("#count"), cta = $("#dropCta"), label = $("#dropLabel");
    let wasOut = null;
    const tick = () => {
      const out = isOut(feat);
      if (out !== wasOut) {
        wasOut = out;
        label.textContent = out ? "Out now" : "Out " + fmt(feat.date, { month: "short", day: "numeric" });
        cta.innerHTML = out
          ? ext(listenHref(feat), "Listen now", "btn", "listen-" + slug(feat.title) + "-hero")
          : ext(listenHref(feat), feat.listen ? "Pre-save" : "Follow on Spotify", "btn", "follow-" + slug(feat.title) + "-hero");
      }
      if (out) { count.hidden = true; return false; }
      const s = Math.floor((at(feat.date) - Date.now()) / 1000);
      const parts = [[Math.floor(s / 86400), "d"], [Math.floor(s / 3600) % 24, "h"], [Math.floor(s / 60) % 60, "m"], [s % 60, "s"]]
        .filter(([n, u], i) => i > 0 || n > 0);
      count.innerHTML = parts.map(([n, u]) => `<span>${String(n).padStart(2, "0")}<small>${u}</small></span>`).join("");
      return true;
    };
    if (tick()) { const iv = setInterval(() => { if (!tick()) clearInterval(iv); }, 1000); }
  }

  /* ---------- hero video ---------- */
  const vid = $("#heroVideo");
  if (vid) {
    const small = matchMedia("(max-width: 700px)").matches;
    if (small) vid.poster = vid.dataset.posterMobile;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // start on the same frame as the poster, so there's no jump when the video kicks in
      const start = parseFloat(small ? vid.dataset.startMobile : vid.dataset.start) || 0;
      if (start) vid.addEventListener("loadedmetadata", () => { try { vid.currentTime = start; } catch {} }, { once: true });
      vid.src = small ? vid.dataset.srcMobile : vid.dataset.src;
      vid.play?.().catch(() => {});
    }
  }
  {
    const next = S.shows.filter((s) => s.date >= todayYMD()).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (next) {
      const hn = $("#heroNext");
      hn.innerHTML = `<span>Next show</span> ${fmt(next.date, { month: "short", day: "numeric" })} · ${esc(next.venue)}${next.city ? ", " + esc(next.city.split(",")[0]) : ""} <b aria-hidden="true">→</b>`;
      hn.hidden = false;
      hn.dataset.track = "next-show-hero";
    }
  }

  const live = $("#liveVideo");
  if (live && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const start = () => { if (!live.src) live.src = live.dataset.src; live.play?.().catch(() => {}); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting ? start() : live.pause()), { rootMargin: "200px" }).observe(live);
    } else start();
  }

  /* ---------- nav over hero ---------- */
  const nav = $(".nav"), hero = $(".hero");
  if (nav && hero) {
    const onScroll = () => nav.classList.toggle("nav--over", window.scrollY < hero.offsetHeight - nav.offsetHeight - 40);
    onScroll(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  }

  /* ---------- instagram tile + signup ---------- */
  const ig = $("#igMore");
  if (ig) { ig.href = L.instagram || L.linktree; ig.dataset.track = "instagram-strip"; }

  /* ---------- GoHighLevel forms (optional) ---------- */
  const G = S.ghl || {};
  const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  let ghlScript = false;
  const ghlForm = (mount, idOrUrl, name, height) => {
    if (!mount || !idOrUrl) return false;
    let u;
    try { u = new URL(/^https?:\/\//i.test(idOrUrl) ? idOrUrl : "https://api.leadconnectorhq.com/widget/form/" + encodeURIComponent(idOrUrl.trim())); }
    catch { return false; }
    const id = u.pathname.split("/").filter(Boolean).pop();
    // pass the visitor's UTM tags (from an IG bio link, a flyer QR, etc.) through to GHL
    const here = new URLSearchParams(location.search);
    UTM.forEach((k) => { if (here.get(k) && !u.searchParams.has(k)) u.searchParams.set(k, here.get(k)); });
    const f = document.createElement("iframe");
    Object.assign(f, { src: u.toString(), id: "inline-" + id, title: name });
    f.className = "ghl__frame";
    f.style.height = (height || 480) + "px";
    Object.entries({ layout: "{'id':'INLINE'}", "trigger-type": "alwaysShow", "trigger-value": "", "activation-type": "alwaysActivated",
      "activation-value": "", "deactivation-type": "neverDeactivate", "deactivation-value": "", "form-name": name,
      height: String(height || 480), "layout-iframe-id": "inline-" + id, "form-id": id }).forEach(([k, v]) => f.setAttribute("data-" + k, v));
    mount.replaceChildren(f);
    if (!ghlScript) {
      ghlScript = true;
      const sc = document.createElement("script");
      sc.src = "https://link.msgsndr.com/js/form_embed.js"; sc.async = true;
      document.body.appendChild(sc);
    }
    return true;
  };
  if (ghlForm($("#signupForm"), G.signupForm, "Decaystate email signup", G.signupHeight)) $("#signup").hidden = false;
  if (ghlForm($("#bookForm"), G.bookingForm, "Decaystate booking inquiry", G.bookingHeight)) $("#bookForm").hidden = false;

  /* ---------- music ---------- */
  $("#streamLinks").innerHTML = [
    L.spotify && ext(L.spotify, "Spotify", "tlink", "stream-spotify"),
    L.appleMusic && ext(L.appleMusic, "Apple Music", "tlink", "stream-apple"),
    ext(L.youtube, "YouTube", "tlink", "stream-youtube")
  ].filter(Boolean).join("");

  const relWhen = (r) => !r.date ? "" : isOut(r)
    ? fmt(r.date, { month: "short", day: "numeric", year: "numeric" })
    : "Out " + fmt(r.date, { month: "long", day: "numeric" });
  const relHref = (r) => (isOut(r) && r.youtube ? ytHref(r) : listenHref(r));
  const relLinks = (r) => `${ext(listenHref(r), isOut(r) ? "Listen" : "Follow", "tlink", "listen-" + slug(r.title))}${r.youtube ? ext(ytHref(r), "Watch video", "tlink", "watch-" + slug(r.title)) : ""}`;
  const lead = S.releases.find((r) => r.featured) || S.releases[0];
  const rest = S.releases.filter((r) => r !== lead);

  $("#releases").innerHTML = `
    <article class="feat">
      <a class="feat__art" href="${esc(relHref(lead))}" target="_blank" rel="noopener" aria-label="${esc(lead.title)}">
        <img src="${esc(lead.art)}" alt="${esc(lead.title)} cover art" width="1000" height="1000">
      </a>
      <div class="feat__body">
        <p class="feat__when">${isOut(lead) ? "New single" : esc(relWhen(lead))}</p>
        <h3 class="feat__t">${esc(lead.title)}</h3>
        ${lead.note ? `<p class="feat__note">${esc(lead.note)}</p>` : ""}
        <p class="rel__links">${relLinks(lead)}</p>
        ${rest.length ? `<p class="cat__h">Earlier singles</p><ul class="cat" aria-label="Earlier singles">${rest.map((r) => `
      <li class="cat__row">
        <img src="${esc(r.art)}" alt="" loading="lazy" width="1000" height="1000">
        <div class="cat__main"><b>${esc(r.title)}</b><span>${esc([r.note, relWhen(r)].filter(Boolean).join(" · "))}</span></div>
        <p class="rel__links">${relLinks(r)}</p>
      </li>`).join("")}</ul>` : ""}
      </div>
    </article>`;

  /* ---------- shows ---------- */
  const today = todayYMD();
  const upcoming = S.shows.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const gcal = (s) => {
    const d = s.date.replace(/-/g, "");
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: `${s.title ? s.title + " — " : ""}DECAYSTATE${s.venue ? " @ " + s.venue : ""}`,
      dates: `${d}/${d}`,
      details: [s.lineup?.length ? "With " + s.lineup.filter((b) => !/decaystate/i.test(b)).join(", ") : "", s.time || "", s.price || "", s.tickets || ""].filter(Boolean).join(" · "),
      location: [s.venue, s.city].filter(Boolean).join(", ")
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  };

  const ticketHref = (s) => {
    try {
      const u = new URL(s.tickets);
      if (!u.searchParams.has("utm_source")) {
        u.searchParams.set("utm_source", "decaystate");
        u.searchParams.set("utm_medium", "website");
        u.searchParams.set("utm_campaign", "show-" + s.date);
      }
      return u.toString();
    } catch { return s.tickets; }
  };

  const daysOut = (s) => {
    const d = Math.round((at(s.date, "12:00") - at(today, "12:00")) / 86400000);
    return d <= 0 ? "Tonight" : d === 1 ? "Tomorrow" : d + " days out";
  };
  const mapsHref = (s) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([s.venue, s.address || s.city].filter(Boolean).join(", "));

  $("#upcoming").innerHTML = upcoming.length
    ? upcoming.map((s) => `
      <article class="show${upcoming.length === 1 ? " show--solo" : ""}">
        ${s.flyer ? `<button class="show__flyer" type="button" data-flyer="${esc(s.flyer)}" aria-label="View the full flyer"><img src="${esc(s.flyer)}" alt="Flyer for ${esc(s.title || "the show")} at ${esc(s.venue)}" loading="lazy"></button>` : ""}
        <div class="show__body">
          <p class="show__date">${fmt(s.date, { weekday: "short", month: "short", day: "numeric" })} <span class="show__count">${daysOut(s)}</span></p>
          <h3 class="show__t">${esc(s.title || s.venue)}</h3>
          <p class="show__where">${esc([s.venue, s.city].filter(Boolean).join(", "))}${s.time ? " · " + esc(s.time) : ""}${s.price ? " · " + esc(s.price) : ""}${s.ages ? " · " + esc(s.ages) : ""}</p>
          ${s.lineup?.length ? `<p class="lineup">${s.lineup.map((b) => `<span class="${/decaystate/i.test(b) ? "us" : ""}">${esc(b)}</span>`).join(" / ")}</p>` : ""}
          <div class="show__cta">
            ${s.tickets
              ? ext(ticketHref(s), "Get tickets", "btn", "tickets-" + s.date) + ext(gcal(s), "Add to calendar", "tlink", "calendar-" + s.date)
              : ext(gcal(s), "Save the date", "btn", "calendar-" + s.date) + `<span class="soon">Tickets ${esc(s.price || "")} · link coming soon</span>`}
            ${s.address ? ext(mapsHref(s), "Directions", "tlink", "directions-" + s.date) : ""}
            ${s.tickets && s.promoCode ? `<span class="soon">Use code <b class="code">${esc(s.promoCode)}</b> at checkout</span>` : ""}
          </div>
        </div>
      </article>`).join("")
    : `<p class="empty">No shows announced right now. Follow on ${ext(L.instagram, "Instagram")} for the next one, or email to book us.</p>`;


  /* ---------- band ---------- */
  /* one short line + big follow buttons (band bio lives in the press kit for now) */
  const names = S.members.map((m) => m.name);
  const nameLine = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names.join("");
  $("#followLine").textContent = [nameLine, S.ffo?.length ? "For fans of " + S.ffo.join(", ") : ""]
    .filter(Boolean).join(" · ");
  $("#followLinks").innerHTML = [
    ["Instagram", L.instagram], ["TikTok", L.tiktok], ["YouTube", L.youtube], ["Spotify", L.spotify], ["Apple Music", L.appleMusic]
  ].filter(([, u]) => u).map(([n, u]) => ext(u, n, "btn btn--ghost", "follow-" + slug(n))).join("");
  $("#social").innerHTML = [
    ["Instagram", L.instagram], ["TikTok", L.tiktok], ["YouTube", L.youtube], ["Spotify", L.spotify],
    ["Apple Music", L.appleMusic], ["Facebook", L.facebook], ["Threads", L.threads]
  ].filter(([, u]) => u).map(([n, u]) => `<li>${ext(u, n)}</li>`).join("");

  /* ---------- modal ---------- */
  const modal = $("#modal"), card = $("#modalCard");
  let lastFocus = null;
  const openModal = (html, extraClass = "") => {
    lastFocus = document.activeElement;
    card.className = "modal__card " + extraClass;
    card.innerHTML = `<button class="x" type="button" data-close aria-label="Close">×</button>` + html;
    modal.hidden = false; document.body.style.overflow = "hidden";
    (card.querySelector("input, select, textarea, .btn") || card.querySelector(".x")).focus();
  };
  const closeModal = () => {
    modal.hidden = true; card.innerHTML = ""; document.body.style.overflow = "";
    lastFocus?.focus?.();
  };
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });

  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-flyer]");
    if (f) openModal(`<img class="flyerview" src="${esc(f.dataset.flyer)}" alt="Show flyer">`, "modal__card--flyer");
  });

  /* ---------- merch ---------- */
  const items = S.merch;
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  $("#perk").textContent = S.merchPerk ? S.merchPerk + "." : "";

  const tile = (it) => `
    <button class="item ${it.bundle ? "item--bundle" : ""}" type="button" data-item="${esc(it.id)}">
      <div class="item__img"><img src="${esc(it.img)}" alt="" loading="lazy"></div>
      <div class="item__body">
        <span class="item__name">${esc(it.name)}</span>
        <span class="item__price">${it.pairPrice ? esc(it.note) : money(it.price)}</span>
        ${it.note && !it.pairPrice ? `<span class="item__note">${esc(it.note)}</span>` : ""}
      </div>
    </button>`;
  $("#shop").innerHTML = items.filter((i) => !i.bundle).map(tile).join("");
  $("#bundles").innerHTML = items.filter((i) => i.bundle).map(tile).join("");

  const sizePicker = (name, legend, sizes) => `
    <fieldset class="field"><legend>${esc(legend)}</legend>
      <div class="sizes">${sizes.map((s) => `<label><input type="radio" name="${esc(name)}" value="${esc(s)}"><span>${esc(s)}</span></label>`).join("")}</div>
    </fieldset>`;

  const openProduct = (it) => {
    const pickers = it.bundle
      ? (it.includes || []).map((n, k) => sizePicker("size" + k, n + " size", S.sizes)).join("")
      : it.sizes?.length ? sizePicker("size0", "Size", it.sizes) : "";
    const includes = it.bundle ? `<p class="item__note">Includes ${esc((it.includes || []).join(" + "))} + Emblem Dad Hat</p>` : "";
    openModal(`
      <div class="pd">
        <div class="pd__img ${it.bundle ? "pd__img--wide" : ""}"><img src="${esc(it.img)}" alt="${esc(it.name)}"></div>
        <form class="pd__body" id="pdForm" novalidate>
          <p class="tele">${it.bundle ? "Bundle" : "Merch"}</p>
          <h2 id="modalTitle">${esc(it.name)}</h2>
          <p class="pd__price">${it.pairPrice ? esc(it.note) : money(it.price)}</p>
          ${includes}
          ${it.note && !it.pairPrice && it.bundle ? `<p class="item__note">${esc(it.note)}</p>` : ""}
          ${pickers}
          <label class="field" for="pdQty"><span>Quantity</span>
            <select id="pdQty">${[1, 2, 3, 4, 5, 6].map((n) => `<option>${n}</option>`).join("")}</select></label>
          <p class="pd__err" id="pdErr" hidden>Pick a size first.</p>
          <button class="btn" type="submit">Add to cart</button>
          ${S.merchPerk ? `<p class="item__note">${esc(S.merchPerk)}</p>` : ""}
        </form>
      </div>`);
    $("#pdForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const opts = [];
      const nPick = it.bundle ? (it.includes || []).length : (it.sizes?.length ? 1 : 0);
      for (let k = 0; k < nPick; k++) {
        const v = $(`input[name="size${k}"]:checked`, card)?.value;
        if (!v) { $("#pdErr").hidden = false; return; }
        opts.push(it.bundle ? `${it.includes[k]}: ${v}` : `Size ${v}`);
      }
      addToCart(it.id, opts, +$("#pdQty").value);
      closeModal(); openCart();
    });
  };
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-item]"); if (b) openProduct(byId[b.dataset.item]); });

  /* ---------- cart ---------- */
  const KEY = "decaystate-cart";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]").filter((l) => byId[l.id]); } catch { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };
  const lineTotal = (l) => {
    const it = byId[l.id];
    return it.pairPrice ? Math.floor(l.qty / 2) * it.pairPrice + (l.qty % 2) * it.price : l.qty * it.price;
  };
  const subtotal = () => cart.reduce((a, l) => a + lineTotal(l), 0);
  const count = () => cart.reduce((a, l) => a + l.qty, 0);

  function addToCart(id, opts, qty) {
    const key = id + "|" + opts.join("|");
    const ex = cart.find((l) => l.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, opts, qty });
    save(); renderCart(); toast("Added to cart");
  }

  const drawer = $("#drawer"), scrim = $("#scrim");
  function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; $("#cartClose").focus(); }
  function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true; }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!modal.hidden) closeModal(); else closeCart(); } });

  function renderCart() {
    $("#cartCount").textContent = count();
    const body = $("#cartBody"), foot = $("#cartFoot");
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><p>Your cart is empty.</p><a class="tlink" href="#merch" data-closecart>Browse merch</a></div>`;
      foot.innerHTML = ""; return;
    }
    body.innerHTML = cart.map((l, i) => {
      const it = byId[l.id];
      return `<div class="line">
        <img src="${esc(it.img)}" alt="">
        <div><div class="line__name">${esc(it.name)}</div>
          ${l.opts.length ? `<div class="line__opt">${l.opts.map(esc).join("<br>")}</div>` : ""}
          <div class="qty"><button type="button" data-dq="${i}" data-d="-1" aria-label="One fewer">−</button><span>${l.qty}</span><button type="button" data-dq="${i}" data-d="1" aria-label="One more">+</button></div>
        </div>
        <div class="line__price">${money(lineTotal(l))}</div>
      </div>`;
    }).join("");
    foot.innerHTML = `
      <div class="sum">
        <div><span>Subtotal</span><span>${money(subtotal())}</span></div>
        <div><span>Shipping</span><span>${S.shipping == null ? "Confirmed by email" : money(S.shipping)}</span></div>
        <div class="tot"><span>Total</span><span>${money(subtotal() + (S.shipping || 0))}${S.shipping == null ? " +ship" : ""}</span></div>
      </div>
      ${S.merchPerk ? `<p class="item__note">${esc(S.merchPerk)}</p>` : ""}
      <button class="btn" type="button" id="checkout">Check out</button>`;
    $("#checkout").addEventListener("click", () => { track("merch-checkout", "Checkout opened"); closeCart(); openCheckout(); });
  }
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-dq]");
    if (q) { const l = cart[+q.dataset.dq]; l.qty += +q.dataset.d; if (l.qty <= 0) cart.splice(+q.dataset.dq, 1); save(); renderCart(); }
    if (e.target.closest("[data-closecart]")) closeCart();
  });
  renderCart();

  /* ---------- checkout ---------- */
  const draftKey = "decaystate-checkout";
  const readDraft = () => { try { return JSON.parse(localStorage.getItem(draftKey) || "{}"); } catch { return {}; } };

  function openCheckout() {
    const d = readDraft();
    openModal(`
      <form class="co" id="coForm" novalidate>
        <p class="tele">Checkout</p>
        <h2 id="modalTitle">Your order</h2>
        <div class="co__grid">
          <label class="field" for="coName"><span>Name</span><input id="coName" type="text" autocomplete="name" required value="${esc(d.name)}"></label>
          <label class="field" for="coEmail"><span>Email</span><input id="coEmail" type="email" autocomplete="email" required value="${esc(d.email)}"></label>
          <fieldset class="field full"><legend>How do you want it?</legend>
            <div class="radios">
              <label><input type="radio" name="coHow" value="ship" ${d.how !== "pickup" ? "checked" : ""}> Ship it to me</label>
              <label><input type="radio" name="coHow" value="pickup" ${d.how === "pickup" ? "checked" : ""}> Pick up at a show</label>
            </div>
          </fieldset>
          <label class="field full" for="coAddr" id="addrWrap"><span>Shipping address</span><textarea id="coAddr" autocomplete="street-address" rows="3">${esc(d.addr)}</textarea></label>
          <label class="field full" for="coNotes"><span>Notes (optional)</span><input id="coNotes" type="text" value="${esc(d.notes)}"></label>
        </div>
        <p class="pd__err" id="coErr" hidden></p>
        <div class="sum">
          <div><span>Items</span><span>${count()}</span></div>
          <div class="tot"><span>Total</span><span>${money(subtotal() + (S.shipping || 0))}${S.shipping == null ? " + shipping" : ""}</span></div>
        </div>
        <button class="btn" type="submit">Review and send order</button>
      </form>`);
    const form = $("#coForm");
    const syncAddr = () => { $("#addrWrap").hidden = $('input[name="coHow"]:checked', form).value !== "ship"; };
    form.addEventListener("change", syncAddr); syncAddr();
    form.addEventListener("input", () => { try { localStorage.setItem(draftKey, JSON.stringify(vals())); } catch {} });
    const vals = () => ({ name: $("#coName").value.trim(), email: $("#coEmail").value.trim(), how: $('input[name="coHow"]:checked', form).value, addr: $("#coAddr").value.trim(), notes: $("#coNotes").value.trim() });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = vals(), err = $("#coErr");
      const problem = !v.name ? "Add your name." : !/^\S+@\S+\.\S+$/.test(v.email) ? "Add an email we can reply to." : v.how === "ship" && v.addr.length < 8 ? "Add a shipping address, or choose pick up at a show." : "";
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      showSend(v);
    });
  }

  function showSend(v) {
    const ref = "DS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const ship = v.how === "ship" && S.shipping != null ? S.shipping : 0;
    const total = subtotal() + ship;
    const lines = cart.map((l) => { const it = byId[l.id]; return `${l.qty} × ${it.name}${l.opts.length ? " (" + l.opts.join(", ") + ")" : ""} — ${money(lineTotal(l))}`; });
    const text = [
      `DECAYSTATE merch order ${ref}`, "",
      ...lines, "",
      `Subtotal: ${money(subtotal())}`,
      v.how === "ship" ? `Shipping: ${S.shipping == null ? "please confirm" : money(S.shipping)}` : "Pick up at a show",
      `Total: ${money(total)}${v.how === "ship" && S.shipping == null ? " + shipping" : ""}`, "",
      `Name: ${v.name}`, `Email: ${v.email}`,
      v.how === "ship" ? `Ship to:\n${v.addr}` : "",
      v.notes ? `Notes: ${v.notes}` : "",
      S.merchPerk ? `\n(${S.merchPerk})` : ""
    ].filter((x) => x !== "").join("\n");
    const subject = `Merch order ${ref} — ${v.name}`;
    const mailto = `mailto:${S.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    const amt = total.toFixed(2);
    const pay = [
      S.payments.venmo && ext(`https://venmo.com/${encodeURIComponent(S.payments.venmo.replace(/^@/, ""))}?txn=pay&amount=${amt}&note=${encodeURIComponent("DECAYSTATE " + ref)}`, "Pay with Venmo", "btn"),
      S.payments.cashapp && ext(`https://cash.app/$${encodeURIComponent(S.payments.cashapp.replace(/^\$/, ""))}/${amt}`, "Pay with Cash App", "btn btn--ghost")
    ].filter(Boolean).join("");
    const payNote = v.how === "ship" && S.shipping == null
      ? "We’ll reply with the shipping cost and payment details."
      : pay ? `Pay ${money(total)} and put <b>${ref}</b> in the note.` : "We’ll reply with payment details.";

    openModal(`
      <div class="co">
        <p class="tele">Order ${ref}</p>
        <h2 id="modalTitle">Send your order</h2>
        <div class="steps">
          <div><div><p>Email this order to <b>${esc(S.email)}</b>. The button opens your email app with everything filled in. If it doesn’t open, copy the order and email it yourself.</p>
            <div class="btnrow"><a class="btn" href="${esc(mailto)}" data-track="merch-order-sent">Email the order</a><button class="btn btn--ghost" type="button" id="copyOrder">Copy order</button></div></div></div>
          <div><div><p>${payNote}</p>${v.how === "ship" && S.shipping == null ? "" : pay ? `<div class="btnrow">${pay}</div>` : ""}</div></div>
          <div><div><p>Your order is confirmed once we reply. Questions? Same email.</p></div></div>
        </div>
        <pre class="order" id="orderText">${esc(text)}</pre>
        <div class="btnrow"><button class="btn btn--ghost" type="button" id="orderDone">Done, clear my cart</button></div>
      </div>`);
    $("#copyOrder").addEventListener("click", () => copy(text, "Order copied", $("#orderText")));
    $("#orderDone").addEventListener("click", () => { cart = []; save(); renderCart(); closeModal(); toast("Thanks — watch your inbox"); });
  }
})();

/* Phones: light up the bottom tab for the section on screen */
(function () {
  if (!("IntersectionObserver" in window)) return;
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a[href^='#']"));
  var map = {};
  links.forEach(function (a) { var el = document.querySelector(a.getAttribute("href")); if (el) map[el.id] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var a = map[e.target.id]; if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
})();

/* Logo goes straight back to the top. The #top anchor is the sticky nav itself,
   so the browser treated it as already in view and barely scrolled. */
(function () {
  var brand = document.querySelector(".nav__brand");
  if (!brand) return;
  brand.addEventListener("click", function (e) {
    e.preventDefault();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
  });
})();
