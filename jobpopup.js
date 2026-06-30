/* ============================================================
   Kurt Mager Solutions — dezentes Karriere-PopUp
   (Lager-Stelle, schließbar, einmalig, reduced-motion-aware)
============================================================ */
(function () {
  "use strict";
  try { if (localStorage.getItem("km-job-dismissed") === "1") return; } catch (e) {}
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var style = document.createElement("style");
  style.textContent =
    ".km-job{position:fixed;right:20px;bottom:20px;z-index:200;width:340px;max-width:calc(100vw - 40px);background:#fff;border:1px solid #e4e9f0;border-left:4px solid #1a8245;border-radius:14px;box-shadow:0 18px 44px -14px rgba(15,49,79,.4);padding:18px 20px 18px 18px;opacity:0;transform:translateY(18px);transition:opacity .45s ease,transform .45s ease}" +
    ".km-job--in{opacity:1;transform:none}" +
    ".km-job__x{position:absolute;top:7px;right:10px;border:0;background:none;font-size:1.5rem;line-height:1;color:#9aa7b6;cursor:pointer;padding:2px 6px}" +
    ".km-job__x:hover{color:#0f1b2a}" +
    ".km-job__tag{display:inline-flex;align-items:center;gap:.45em;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#c2410c;background:#fff7ed;border:1px solid #fed7aa;padding:.32em .7em;border-radius:999px}" +
    ".km-job__dot{width:7px;height:7px;border-radius:50%;background:#ea580c;box-shadow:0 0 0 0 rgba(234,88,12,.6);animation:kmjob 1.6s infinite}" +
    "@keyframes kmjob{70%{box-shadow:0 0 0 7px rgba(234,88,12,0)}100%{box-shadow:0 0 0 0 rgba(234,88,12,0)}}" +
    ".km-job__title{font-weight:700;font-size:1.04rem;margin:11px 0 4px;color:#0f1b2a;line-height:1.25}" +
    ".km-job__title span{color:#56657a;font-weight:600}" +
    ".km-job__txt{font-size:.88rem;color:#56657a;margin:0 0 14px;line-height:1.5}" +
    ".km-job__btn{display:inline-flex;align-items:center;gap:.5em;background:#1a8245;color:#fff;font-weight:600;font-size:.9rem;padding:.62em 1.1em;border-radius:999px;text-decoration:none;transition:background .2s,transform .15s}" +
    ".km-job__btn:hover{background:#15803d;transform:translateY(-1px)}" +
    ".km-job__btn svg{width:15px;height:15px}" +
    "@media (prefers-reduced-motion:reduce){.km-job{transition:none}.km-job__dot{animation:none}}" +
    "@media (max-width:520px){.km-job{left:12px;right:12px;bottom:12px;width:auto}}";
  document.head.appendChild(style);

  var box = document.createElement("aside");
  box.className = "km-job";
  box.setAttribute("aria-label", "Aktuelles Stellenangebot");
  box.innerHTML =
    '<button class="km-job__x" type="button" aria-label="Schließen">&times;</button>' +
    '<span class="km-job__tag"><span class="km-job__dot"></span>Dringend gesucht</span>' +
    '<div class="km-job__title">Mitarbeiter im Lager und Versand <span>(m/w/d)</span></div>' +
    '<p class="km-job__txt">Wir besetzen die Stelle kurzfristig – werden Sie Teil unseres Teams in Neufra.</p>' +
    '<a class="km-job__btn" href="karriere.html#bewerben">Jetzt bewerben ' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>';

  var shown = false;
  function show() {
    if (shown) return; shown = true;
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("km-job--in"); });
  }
  function close() {
    box.classList.remove("km-job--in");
    try { localStorage.setItem("km-job-dismissed", "1"); } catch (e) {}
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 450);
  }
  box.querySelector(".km-job__x").addEventListener("click", close);

  var timer = setTimeout(show, reduce ? 1200 : 6500);
  function onScroll() {
    if (window.pageYOffset > 700) { clearTimeout(timer); window.removeEventListener("scroll", onScroll); show(); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
})();
