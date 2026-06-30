/* ============================================================
   Kurt Mager Solutions — dezente Scroll-Einblendung
   (progressive enhancement, respektiert reduced-motion)
============================================================ */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var style = document.createElement("style");
  style.textContent =
    ".km-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.22,.61,.36,1),transform .6s cubic-bezier(.22,.61,.36,1)}" +
    ".km-reveal.km-in{opacity:1;transform:none}";
  document.head.appendChild(style);

  var SEL = ".config__head,.sec__head,.prodcard,.toolcard,.tmember,.cert,.costbox,.about__intro,.checklist li,.leadcard,.contact__grid,.wkchip";

  function run() {
    var els = Array.prototype.slice.call(document.querySelectorAll(SEL));
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("km-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) {
      el.classList.add("km-reveal");
      io.observe(el);
    });
  }

  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);
})();
