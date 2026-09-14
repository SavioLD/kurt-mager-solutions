/* ============================================================
   Kurt Mager Solutions — Karriere-PopUp
   Offene Stelle: Mitarbeiter Vertriebsinnendienst & Einkauf (m/w/d)
   Selbst­enthaltend: injiziert eigenes CSS + Markup, keine
   weiteren Dateien nötig. Wird über <script src="jobpopup.js">
   auf den Seiten eingebunden (index, unternehmen, prozesse,
   werkstoffe, team, rechner).
   Erscheint einmalig verzögert, merkt sich das Schließen pro
   Besucher (localStorage) und ist voll mobil-optimiert.
============================================================ */
(function () {
  "use strict";

  // --- Konfiguration der Stelle -------------------------------------------
  var JOB = {
    key: "km_job_vertrieb_einkauf_2026",              // Merker-Schlüssel (neu = zeigt erneut)
    eyebrow: "Wir stellen ein",
    title: "Mitarbeiter Vertriebsinnendienst & Einkauf (m/w/d)",
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
    delayMs: 1200
  };

  // Nicht auf der Karriereseite selbst zeigen (dort steht die Stelle bereits).
  if (/karriere\.html/i.test(location.pathname)) return;

  // Bereits geschlossen? -> nichts tun.
  try { if (localStorage.getItem(JOB.key) === "closed") return; } catch (e) {}

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // --- Styles --------------------------------------------------------------
  var css = ""
    + ".kmjp-root{--kmjp-green:#1a8245;--kmjp-green7:#11652f;--kmjp-green50:#e9f6ee;--kmjp-navy:#15314f;--kmjp-ink:#0f1b2a;--kmjp-slate:#56657a;--kmjp-line:#e4e9f0;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}"
    + ".kmjp-back{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,27,42,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;transition:opacity .28s ease;}"
    + ".kmjp-back.kmjp-on{opacity:1;}"
    + ".kmjp-card{position:relative;width:100%;max-width:440px;background:#fff;border-radius:22px;box-shadow:0 30px 60px -22px rgba(15,49,79,.45);overflow:hidden;transform:translateY(16px) scale(.98);opacity:0;transition:transform .32s cubic-bezier(.2,.8,.2,1),opacity .32s ease;max-height:calc(100vh - 40px);display:flex;flex-direction:column;}"
    + ".kmjp-back.kmjp-on .kmjp-card{transform:none;opacity:1;}"
    + ".kmjp-head{padding:22px 24px 4px;}"
    + ".kmjp-row{display:flex;align-items:center;gap:10px;}"
    + ".kmjp-pill{display:inline-flex;align-items:center;gap:7px;background:var(--kmjp-green50);color:var(--kmjp-green7);font-size:12.5px;font-weight:700;letter-spacing:.02em;padding:6px 12px;border-radius:999px;text-transform:uppercase;}"
    + ".kmjp-pill svg{width:14px;height:14px;}"
    + ".kmjp-x{margin-left:auto;flex:0 0 auto;width:34px;height:34px;border:0;border-radius:10px;background:#f4f7fb;color:var(--kmjp-slate);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;}"
    + ".kmjp-x:hover{background:#e9edf3;color:var(--kmjp-ink);}"
    + ".kmjp-x svg{width:17px;height:17px;}"
    + ".kmjp-body{padding:14px 24px 4px;overflow:auto;}"
    + ".kmjp-title{margin:0 0 10px;font-size:21px;line-height:1.25;font-weight:800;color:var(--kmjp-navy);letter-spacing:-.01em;}"
    + ".kmjp-badge{display:inline-block;background:var(--kmjp-green);color:#fff;font-size:12.5px;font-weight:700;padding:6px 12px;border-radius:999px;margin:0 0 14px;}"
    + ".kmjp-intro{margin:0 0 14px;font-size:14.5px;line-height:1.55;color:var(--kmjp-slate);}"
    + ".kmjp-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;}"
    + ".kmjp-list li{display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.4;color:var(--kmjp-ink);font-weight:500;}"
    + ".kmjp-list svg{flex:0 0 auto;width:18px;height:18px;margin-top:1px;color:var(--kmjp-green);}"
    + ".kmjp-foot{padding:18px 24px 22px;display:flex;flex-direction:column;gap:10px;}"
    + ".kmjp-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;width:100%;background:var(--kmjp-green);color:#fff;font-size:15px;font-weight:700;padding:14px 18px;border-radius:13px;text-decoration:none;border:0;cursor:pointer;transition:background .18s,transform .06s;box-shadow:0 10px 24px -12px rgba(26,130,69,.75);}"
    + ".kmjp-cta:hover{background:var(--kmjp-green7);}"
    + ".kmjp-cta:active{transform:translateY(1px);}"
    + ".kmjp-cta svg{width:18px;height:18px;}"
    + ".kmjp-later{appearance:none;background:none;border:0;color:var(--kmjp-slate);font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;padding:4px;align-self:center;text-decoration:underline;text-underline-offset:2px;}"
    + ".kmjp-later:hover{color:var(--kmjp-ink);}"
    + "@media(max-width:520px){"
    + ".kmjp-back{padding:0;align-items:flex-end;}"
    + ".kmjp-card{max-width:none;border-radius:20px 20px 0 0;max-height:92vh;transform:translateY(100%);}"
    + ".kmjp-back.kmjp-on .kmjp-card{transform:none;}"
    + ".kmjp-title{font-size:19.5px;}"
    + ".kmjp-head{padding-top:18px;}"
    + "}"
    + "@media(prefers-reduced-motion:reduce){.kmjp-back,.kmjp-card{transition:none !important;}}";

  // --- Markup --------------------------------------------------------------
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  var mega  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8"/></svg>';

  var pts = JOB.points.map(function (p) { return "<li>" + check + "<span>" + p + "</span></li>"; }).join("");

  var back = document.createElement("div");
  back.className = "kmjp-root kmjp-back";
  back.setAttribute("role", "dialog");
  back.setAttribute("aria-modal", "true");
  back.setAttribute("aria-label", "Offene Stelle: " + JOB.title);
  back.innerHTML =
    '<div class="kmjp-card" role="document">'
    + '<div class="kmjp-head"><div class="kmjp-row">'
    +   '<span class="kmjp-pill">' + mega + JOB.eyebrow + '</span>'
    +   '<button type="button" class="kmjp-x" aria-label="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    + '</div></div>'
    + '<div class="kmjp-body">'
    +   '<h2 class="kmjp-title">' + JOB.title + '</h2>'
    +   '<span class="kmjp-badge">' + JOB.badge + '</span>'
    +   '<p class="kmjp-intro">' + JOB.intro + '</p>'
    +   '<ul class="kmjp-list">' + pts + '</ul>'
    + '</div>'
    + '<div class="kmjp-foot">'
    +   '<a class="kmjp-cta" href="' + JOB.href + '">' + JOB.ctaLabel + arrow + '</a>'
    +   '<button type="button" class="kmjp-later">Vielleicht später</button>'
    + '</div>'
    + '</div>';

  var styleEl = document.createElement("style");
  styleEl.textContent = css;

  var opened = false, prevOverflow = "";

  function remember() { try { localStorage.setItem(JOB.key, "closed"); } catch (e) {} }

  function close(persist) {
    if (!opened) return;
    opened = false;
    if (persist) remember();
    back.classList.remove("kmjp-on");
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = prevOverflow;
    var done = function () { if (back.parentNode) back.parentNode.removeChild(back); };
    if (reduce) done(); else setTimeout(done, 340);
  }

  function onKey(e) { if (e.key === "Escape") close(true); }

  function open() {
    if (opened) return;
    document.head.appendChild(styleEl);
    document.body.appendChild(back);
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    opened = true;

    // Interaktionen
    back.querySelector(".kmjp-x").addEventListener("click", function () { close(true); });
    back.querySelector(".kmjp-later").addEventListener("click", function () { close(true); });
    back.querySelector(".kmjp-cta").addEventListener("click", function () { remember(); /* Navigation folgt via href */ });
    back.addEventListener("mousedown", function (e) { if (e.target === back) close(true); });

    // Einblenden
    var show = function () {
      back.classList.add("kmjp-on");
      document.addEventListener("keydown", onKey);
      try { back.querySelector(".kmjp-x").focus({ preventScroll: true }); } catch (e) {}
    };
    if (reduce) show(); else requestAnimationFrame(function () { requestAnimationFrame(show); });
  }

  var start = function () { setTimeout(open, JOB.delayMs); };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
