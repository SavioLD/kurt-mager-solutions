/* ============================================================
   Kurt Mager Solutions — Karriere-Teaser
   Offene Stelle: Mitarbeiter Vertriebsinnendienst & Einkauf (m/w/d)

   Zweistufig & dezent:
   1) kleiner Teaser unten rechts (nur Hinweis + Stellentitel)
   2) erst auf Klick öffnen sich die Details (Aufgaben, Bewerbung)

   Selbst­enthaltend: injiziert eigenes CSS + Markup, keine weitere
   Datei nötig. Eingebunden per <script src="jobpopup.js"> auf
   index, unternehmen, prozesse, werkstoffe, team, rechner.
   Merkt sich das Schließen pro Besucher (localStorage).
============================================================ */
(function () {
  "use strict";

  var JOB = {
    key: "km_job_vertrieb_einkauf_2026",     // Merker (neuer Wert = Teaser erscheint erneut)
    eyebrow: "Wir stellen ein",
    short: "Vertriebsinnendienst &amp; Einkauf (m/w/d)",   // Teaser-Titel (kurz)
    title: "Mitarbeiter Vertriebsinnendienst &amp; Einkauf (m/w/d)", // Detail-Titel
    badge: "Teilzeit · bis 20 Std./Woche · Neufra",
    intro: "Eine vielseitige Position zwischen Vertrieb und Einkauf – Kundenbetreuung, Angebote, Auftragsabwicklung und Beschaffung in einem kleinen Team mit kurzen Entscheidungswegen.",
    points: [
      "Kundenanfragen, Angebote &amp; Auftragsabwicklung",
      "Einkauf, Bestellwesen &amp; Lieferantenkontakt",
      "Kleines Team, kurze Entscheidungswege",
      "Berufsjahre zweitrangig – Lernbereitschaft zählt"
    ],
    href: "karriere.html#job-vertrieb",
    ctaLabel: "Zur Stelle &amp; Bewerbung",
    delayMs: 1400
  };

  // Nicht auf der Karriereseite selbst (dort steht die Stelle bereits).
  if (/karriere\.html/i.test(location.pathname)) return;
  try { if (localStorage.getItem(JOB.key) === "closed") return; } catch (e) {}

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // --- Icons ---------------------------------------------------------------
  var mega  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8"/></svg>';
  var chev  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var xicon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  // --- Styles --------------------------------------------------------------
  var css = ""
    + ".kmjp-root{--g:#1a8245;--g7:#11652f;--g50:#e9f6ee;--navy:#15314f;--ink:#0f1b2a;--slate:#56657a;--line:#e4e9f0;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}"

    /* -------- kleiner Teaser -------- */
    + ".kmjp-teaser{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:min(330px,calc(100vw - 32px));background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 40px -16px rgba(15,49,79,.34);padding:13px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;opacity:0;transform:translateY(14px);transition:opacity .3s ease,transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .18s;}"
    + ".kmjp-teaser.kmjp-on{opacity:1;transform:none;}"
    + ".kmjp-teaser:hover{box-shadow:0 22px 46px -16px rgba(15,49,79,.42);}"
    + ".kmjp-ic{flex:0 0 auto;width:42px;height:42px;border-radius:11px;background:var(--g50);color:var(--g);display:flex;align-items:center;justify-content:center;}"
    + ".kmjp-ic svg{width:21px;height:21px;}"
    + ".kmjp-tx{min-width:0;flex:1 1 auto;}"
    + ".kmjp-lbl{font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--g7);line-height:1;margin-bottom:3px;}"
    + ".kmjp-ttl{font-size:14px;font-weight:700;color:var(--navy);line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}"
    + ".kmjp-chev{flex:0 0 auto;color:var(--slate);display:flex;}"
    + ".kmjp-chev svg{width:18px;height:18px;}"
    + ".kmjp-close{position:absolute;top:-9px;right:-9px;width:26px;height:26px;border:1px solid var(--line);border-radius:50%;background:#fff;color:var(--slate);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(15,49,79,.16);transition:background .15s,color .15s;}"
    + ".kmjp-close:hover{background:#f4f7fb;color:var(--ink);}"
    + ".kmjp-close svg{width:13px;height:13px;}"

    /* -------- Detail-Overlay -------- */
    + ".kmjp-back{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,27,42,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;transition:opacity .26s ease;}"
    + ".kmjp-back.kmjp-on{opacity:1;}"
    + ".kmjp-card{position:relative;width:100%;max-width:432px;background:#fff;border-radius:22px;box-shadow:0 30px 60px -22px rgba(15,49,79,.45);overflow:hidden;transform:translateY(16px) scale(.98);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s ease;max-height:calc(100vh - 40px);display:flex;flex-direction:column;}"
    + ".kmjp-back.kmjp-on .kmjp-card{transform:none;opacity:1;}"
    + ".kmjp-head{padding:20px 22px 2px;}"
    + ".kmjp-row{display:flex;align-items:center;gap:10px;}"
    + ".kmjp-pill{display:inline-flex;align-items:center;gap:7px;background:var(--g50);color:var(--g7);font-size:12px;font-weight:800;letter-spacing:.03em;padding:6px 12px;border-radius:999px;text-transform:uppercase;}"
    + ".kmjp-pill svg{width:14px;height:14px;}"
    + ".kmjp-x{margin-left:auto;flex:0 0 auto;width:34px;height:34px;border:0;border-radius:10px;background:#f4f7fb;color:var(--slate);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;}"
    + ".kmjp-x:hover{background:#e9edf3;color:var(--ink);}"
    + ".kmjp-x svg{width:17px;height:17px;}"
    + ".kmjp-body{padding:12px 22px 2px;overflow:auto;}"
    + ".kmjp-title{margin:0 0 10px;font-size:20px;line-height:1.25;font-weight:800;color:var(--navy);letter-spacing:-.01em;}"
    + ".kmjp-badge{display:inline-block;background:var(--g);color:#fff;font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px;margin:0 0 13px;}"
    + ".kmjp-intro{margin:0 0 13px;font-size:14px;line-height:1.55;color:var(--slate);}"
    + ".kmjp-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;}"
    + ".kmjp-list li{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;line-height:1.4;color:var(--ink);font-weight:500;}"
    + ".kmjp-list svg{flex:0 0 auto;width:17px;height:17px;margin-top:1px;color:var(--g);}"
    + ".kmjp-foot{padding:16px 22px 20px;display:flex;flex-direction:column;gap:9px;}"
    + ".kmjp-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;width:100%;background:var(--g);color:#fff;font-size:15px;font-weight:700;padding:13px 18px;border-radius:13px;text-decoration:none;cursor:pointer;transition:background .18s,transform .06s;box-shadow:0 10px 24px -12px rgba(26,130,69,.75);}"
    + ".kmjp-cta:hover{background:var(--g7);}"
    + ".kmjp-cta:active{transform:translateY(1px);}"
    + ".kmjp-cta svg{width:18px;height:18px;}"

    /* -------- mobil -------- */
    + "@media(max-width:520px){"
    + ".kmjp-teaser{right:12px;left:12px;bottom:12px;width:auto;}"
    + ".kmjp-back{padding:0;align-items:flex-end;}"
    + ".kmjp-card{max-width:none;border-radius:20px 20px 0 0;max-height:90vh;transform:translateY(100%);}"
    + ".kmjp-back.kmjp-on .kmjp-card{transform:none;}"
    + ".kmjp-title{font-size:19px;}"
    + "}"
    + "@media(prefers-reduced-motion:reduce){.kmjp-teaser,.kmjp-back,.kmjp-card{transition:none !important;}}";

  var styleEl = document.createElement("style");
  styleEl.textContent = css;

  // --- Teaser --------------------------------------------------------------
  var teaser = document.createElement("div");
  teaser.className = "kmjp-root kmjp-teaser";
  teaser.setAttribute("role", "button");
  teaser.setAttribute("tabindex", "0");
  teaser.setAttribute("aria-label", "Offene Stelle: " + JOB.title.replace(/&amp;/g, "&") + " – Details anzeigen");
  teaser.innerHTML =
      '<span class="kmjp-ic">' + mega + '</span>'
    + '<span class="kmjp-tx"><span class="kmjp-lbl">' + JOB.eyebrow + '</span><span class="kmjp-ttl">' + JOB.short + '</span></span>'
    + '<span class="kmjp-chev">' + chev + '</span>'
    + '<button type="button" class="kmjp-close" aria-label="Hinweis schließen">' + xicon + '</button>';

  // --- Detail-Overlay ------------------------------------------------------
  var pts = JOB.points.map(function (p) { return "<li>" + check + "<span>" + p + "</span></li>"; }).join("");
  var back = document.createElement("div");
  back.className = "kmjp-root kmjp-back";
  back.setAttribute("role", "dialog");
  back.setAttribute("aria-modal", "true");
  back.setAttribute("aria-label", "Offene Stelle: " + JOB.title.replace(/&amp;/g, "&"));
  back.innerHTML =
      '<div class="kmjp-card" role="document">'
    + '<div class="kmjp-head"><div class="kmjp-row">'
    +   '<span class="kmjp-pill">' + mega + JOB.eyebrow + '</span>'
    +   '<button type="button" class="kmjp-x" aria-label="Schließen">' + xicon + '</button>'
    + '</div></div>'
    + '<div class="kmjp-body">'
    +   '<h2 class="kmjp-title">' + JOB.title + '</h2>'
    +   '<span class="kmjp-badge">' + JOB.badge + '</span>'
    +   '<p class="kmjp-intro">' + JOB.intro + '</p>'
    +   '<ul class="kmjp-list">' + pts + '</ul>'
    + '</div>'
    + '<div class="kmjp-foot">'
    +   '<a class="kmjp-cta" href="' + JOB.href + '">' + JOB.ctaLabel + arrow + '</a>'
    + '</div>'
    + '</div>';

  // --- Verhalten -----------------------------------------------------------
  var modalOpen = false, prevOverflow = "";
  function remember() { try { localStorage.setItem(JOB.key, "closed"); } catch (e) {} }

  function openModal() {
    if (modalOpen) return;
    if (!back.parentNode) document.body.appendChild(back);
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalOpen = true;
    document.addEventListener("keydown", onKey);
    var show = function () { back.classList.add("kmjp-on"); try { back.querySelector(".kmjp-x").focus({ preventScroll: true }); } catch (e) {} };
    if (reduce) show(); else requestAnimationFrame(function () { requestAnimationFrame(show); });
  }
  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;
    back.classList.remove("kmjp-on");
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = prevOverflow;
    var done = function () { if (back.parentNode) back.parentNode.removeChild(back); };
    if (reduce) done(); else setTimeout(done, 320);
  }
  function onKey(e) { if (e.key === "Escape") closeModal(); }

  function dismiss() {
    remember();
    teaser.classList.remove("kmjp-on");
    var done = function () { if (teaser.parentNode) teaser.parentNode.removeChild(teaser); };
    if (reduce) done(); else setTimeout(done, 300);
  }

  function wire() {
    teaser.querySelector(".kmjp-close").addEventListener("click", function (e) { e.stopPropagation(); dismiss(); });
    teaser.addEventListener("click", openModal);
    teaser.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(); } });
    back.querySelector(".kmjp-x").addEventListener("click", closeModal);
    back.querySelector(".kmjp-cta").addEventListener("click", remember); // Navigation via href
    back.addEventListener("mousedown", function (e) { if (e.target === back) closeModal(); });
  }

  function start() {
    document.head.appendChild(styleEl);
    document.body.appendChild(teaser);
    wire();
    setTimeout(function () { teaser.classList.add("kmjp-on"); }, reduce ? 0 : 60);
  }

  var boot = function () { setTimeout(start, JOB.delayMs); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
