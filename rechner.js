/* ============================================================
   Kurt Mager Solutions — Beschaffungs-/Kostenrechner
   Designkonzept · Ländle Digital
============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const fmt = (n) => "€ " + Math.round(Math.max(0, n)).toLocaleString("de-DE");
  const num = (id) => { const e = $("#" + id); if (!e) return 0; const v = parseFloat(String(e.value).replace(/\./g, "").replace(",", ".")); return isNaN(v) ? 0 : v; };
  // numbers that may legitimately contain decimals are read raw (no thousand-strip)
  const dec = (id) => { const e = $("#" + id); if (!e) return 0; const v = parseFloat(String(e.value).replace(",", ".")); return isNaN(v) ? 0 : v; };

  const INPUT_IDS = ["volumen", "lieferanten", "lieferzeit", "sicherheitsbestand", "ausschuss", "stillstaende",
    "kapitalkostensatz", "lagerhaltungssatz", "kostenStillstand", "bestellungen", "bearbeitung", "aufwandLieferant",
    "redReichweite", "redStillstaende", "ffFaktor", "redAusschuss", "redBestellaufwand", "preispotenzial"];

  const PRESETS = {
    maschinenbau: { vol: 250000, aus: "2.5", parts: "Bolzen · Buchsen · Wellen · Flansche · Adapter" },
    moebel: { vol: 180000, aus: "2.0", parts: "Verbinder · Hülsen · Stifte · Beschlagteile" },
    freizeit: { vol: 150000, aus: "2.2", parts: "Spikes · Achsen · Naben · Bolzen" },
    elektro: { vol: 250000, aus: "2.5", parts: "Kontaktstifte · Buchsen · Gewindeteile · Spikes" },
    automotive: { vol: 400000, aus: "1.8", parts: "Bolzen · Muttern · Lagersitze · Druckteile" },
    sonstige: { vol: 200000, aus: "2.5", parts: "Dreh- · Fräs- · Stanz- · Biegeteile" },
  };

  let last = null;

  function compute() {
    const V = num("volumen"), L = num("lieferanten"), SB = num("sicherheitsbestand");
    const aussch = dec("ausschuss") / 100, still = num("stillstaende");
    const kapital = dec("kapitalkostensatz") / 100, lager = dec("lagerhaltungssatz") / 100, kStill = num("kostenStillstand");
    const best = num("bestellungen"), bearb = num("bearbeitung"), aufwL = num("aufwandLieferant");
    const redReich = dec("redReichweite") / 100, redStill = dec("redStillstaende") / 100, ff = dec("ffFaktor") || 1;
    const redAussch = dec("redAusschuss") / 100, redBest = dec("redBestellaufwand") / 100, preisPot = dec("preispotenzial") / 100;

    const boundCapital = V * SB / 52;            // Kapital im Lager gebunden
    const stillCost = still * kStill;            // Ausfall durch Stillstände
    const qualCost = V * aussch * ff;            // Fehler-/Reklamationskosten
    const capitalCostAnnual = boundCapital * (kapital + lager);
    const processCost = best * bearb + L * aufwL;

    const sCapital = capitalCostAnnual * redReich;
    const sStill = stillCost * redStill;
    const sQual = qualCost * redAussch;
    const sProcess = processCost * redBest;
    const sPreis = V * preisPot;
    const total = sCapital + sStill + sQual + sProcess + sPreis;
    const pct = V > 0 ? (total / V) * 100 : 0;

    return { V, boundCapital, stillCost, qualCost, sCapital, sStill, sQual, sProcess, sPreis, total, pct };
  }

  function render() {
    const r = compute();
    last = r;
    const set = (id, v) => { const e = $("#" + id); if (e) e.textContent = v; };
    const plain = (n) => Math.round(Math.max(0, n)).toLocaleString("de-DE");
    const pctTxt = "≈ " + r.pct.toFixed(1).replace(".", ",") + " % Ihres Einkaufsvolumens";

    set("livEuro", plain(r.total));
    set("resEuro", plain(r.total));
    set("resBadge", pctTxt);
    set("res3yr", fmt(r.total * 3));
    set("costStill", fmt(r.stillCost));
    set("costQual", fmt(r.qualCost));
    set("costCapital", fmt(r.boundCapital));
    set("bdCapital", fmt(r.sCapital));
    set("bdStill", fmt(r.sStill));
    set("bdQual", fmt(r.sQual));
    set("bdProcess", fmt(r.sProcess));
    set("bdPreis", fmt(r.sPreis));
    set("bdTotal", fmt(r.total));
  }

  /* ---------- wire inputs ---------- */
  INPUT_IDS.forEach((id) => { const e = $("#" + id); if (e) { e.addEventListener("input", onInput); e.addEventListener("change", onInput); } });

  function onInput(e) {
    // keep volume slider and number in sync
    if (e.target.id === "volumen") syncRange();
    render();
  }
  function syncRange() {
    const range = $("#volumenRange"), n = num("volumen");
    if (range) { range.value = Math.min(Math.max(n, +range.min), +range.max); }
  }
  const range = $("#volumenRange");
  if (range) range.addEventListener("input", () => { $("#volumen").value = range.value; render(); });

  // branche presets
  const branche = $("#branche");
  if (branche) branche.addEventListener("change", () => {
    const p = PRESETS[branche.value] || PRESETS.sonstige;
    $("#volumen").value = p.vol;
    $("#ausschuss").value = p.aus;
    const pl = $("#partlist"); if (pl) pl.textContent = p.parts;
    syncRange();
    render();
  });

  syncRange();
  render();

  /* ---------- lead form ---------- */
  const form = $("#leadForm");
  if (form) form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const fields = [["lf_vorname", (v) => v.trim()], ["lf_nachname", (v) => v.trim()], ["lf_firma", (v) => v.trim()], ["lf_email", emailOk]];
    let ok = true, firstErr = null;
    fields.forEach(([id, test]) => {
      const el = $("#" + id), msg = $(`.err-msg[data-for="${id}"]`);
      const good = test(el.value);
      el.classList.toggle("err", !good);
      if (msg) msg.classList.toggle("show", !good);
      if (!good && !firstErr) firstErr = el;
      if (!good) ok = false;
    });
    const priv = $("#lf_privacy"), pmsg = $('.err-msg[data-for="lf_privacy"]');
    if (!priv.checked) { ok = false; if (pmsg) pmsg.classList.add("show"); if (!firstErr) firstErr = priv; }
    else if (pmsg) pmsg.classList.remove("show");
    if (!ok) { if (firstErr) firstErr.focus(); return; }

    const r = last || compute();
    const g = (id) => ($("#" + id) ? $("#" + id).value : "");
    const ref = "KM-AUSW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const body = [
      "BESCHAFFUNGS-RECHNER — Auswertung",
      "",
      "Einsparpotenzial / Jahr: " + fmt(r.total).replace(/ /g, " ") + "  (" + r.pct.toFixed(1).replace(".", ",") + " % vom Volumen)",
      "Auf 3 Jahre: " + fmt(r.total * 3).replace(/ /g, " "),
      "",
      "Aufschlüsselung:",
      "  Kapitalbindung & Lager: " + fmt(r.sCapital).replace(/ /g, " "),
      "  Stillstände & Termintreue: " + fmt(r.sStill).replace(/ /g, " "),
      "  Qualität & Ausschuss: " + fmt(r.sQual).replace(/ /g, " "),
      "  Beschaffungs-Prozess: " + fmt(r.sProcess).replace(/ /g, " "),
      "  Preispotenzial: " + fmt(r.sPreis).replace(/ /g, " "),
      "",
      "Eingaben:",
      "  Einkaufsvolumen: " + g("volumen") + " € / Jahr",
      "  Branche: " + (branche ? branche.options[branche.selectedIndex].text : ""),
      "  Lieferanten: " + g("lieferanten"),
      "  Ø Lieferzeit: " + g("lieferzeit") + " Wochen",
      "  Sicherheitsbestand: " + g("sicherheitsbestand") + " Wochen",
      "  Ausschussquote: " + g("ausschuss") + " %",
      "  Stillstände/Jahr: " + g("stillstaende"),
      "",
      "Kontakt:",
      "  " + g("lf_vorname") + " " + g("lf_nachname") + (g("lf_position") ? " (" + g("lf_position") + ")" : ""),
      "  " + g("lf_firma"),
      "  " + g("lf_email") + (g("lf_phone") ? " · " + g("lf_phone") : ""),
      "",
      "Referenz: " + ref,
    ].join("\n");

    form.hidden = true;
    const bl = $("#breakdownLock"); if (bl) bl.classList.add("unlocked");
    const done = $("#leadDone");
    done.hidden = false;
    done.innerHTML = `<div class="done" style="padding:8px 0 0">
        <div class="done__badge"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
        <h3>Danke, ${(g("lf_vorname") || "").replace(/[<>&]/g, "")}! Ihre Auswertung ist freigeschaltet.</h3>
        <p>Wir haben Ihr Einsparpotenzial von <strong>${fmt(r.total)} / Jahr</strong> erfasst und melden uns zur persönlichen Besprechung der Ergebnisse — in der Regel zeitnah.</p>
        <div class="done__ref">Ihre Referenz: <b>${ref}</b></div>
        <div class="done__actions">
          <button type="button" class="btn btn--ghost" id="lfRestart">Neue Berechnung</button>
        </div>
      </div>`;
    (document.getElementById("auswertung") || done).scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.__kmBurst) window.__kmBurst();
    // zuverlässige Übermittlung an den Posteingang via Web3Forms
    fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: "c6eb7fa2-94d4-467d-9405-d3d36699123d",
        subject: "Beschaffungs-Rechner – " + g("lf_firma") + " (" + ref + ")",
        from_name: "Website Kurt Mager Solutions",
        botcheck: "",
        Referenz: ref,
        "Einsparpotenzial pro Jahr": fmt(r.total) + " (" + r.pct.toFixed(1).replace(".", ",") + " %)",
        "Auf 3 Jahre": fmt(r.total * 3),
        Name: g("lf_vorname") + " " + g("lf_nachname") + (g("lf_position") ? " (" + g("lf_position") + ")" : ""),
        name: g("lf_vorname") + " " + g("lf_nachname"),
        Firma: g("lf_firma"),
        email: g("lf_email"),
        Telefon: g("lf_phone") || "—",
        Einkaufsvolumen: g("volumen") + " € / Jahr",
        Branche: branche ? branche.options[branche.selectedIndex].text : "",
        Lieferanten: g("lieferanten"),
        "Lieferzeit in Wochen": g("lieferzeit"),
        "Sicherheitsbestand in Wochen": g("sicherheitsbestand"),
        "Ausschussquote in Prozent": g("ausschuss"),
        "Stillstaende pro Jahr": g("stillstaende"),
      }),
    }).then((r) => r.json()).then((d) => { if (!(d && d.success)) console.error("Web3Forms (Rechner):", d); }).catch((e) => console.error("Web3Forms (Rechner) Fehler:", e));
    $("#lfRestart").addEventListener("click", () => { done.hidden = true; done.innerHTML = ""; form.hidden = false; form.reset(); if (bl) bl.classList.remove("unlocked"); render(); form.scrollIntoView({ behavior: "smooth", block: "center" }); });
  });

  // clear field error on input
  $$("#leadForm .input").forEach((i) => i.addEventListener("input", () => { i.classList.remove("err"); const m = $(`.err-msg[data-for="${i.id}"]`); if (m) m.classList.remove("show"); }));
  const lfp = $("#lf_privacy"); if (lfp) lfp.addEventListener("change", () => { const m = $('.err-msg[data-for="lf_privacy"]'); if (m && lfp.checked) m.classList.remove("show"); });

  /* ---------- page chrome ---------- */
  $("#year").textContent = new Date().getFullYear();
  const burger = $("#burger"), mobile = $("#topbarMobile");
  if (burger) burger.addEventListener("click", () => { const open = mobile.classList.toggle("open"); burger.setAttribute("aria-expanded", open); });
  $$(".js-scroll, .topbar__mobile a, .topbar__nav a").forEach((a) => a.addEventListener("click", () => { if (mobile) mobile.classList.remove("open"); if (burger) burger.setAttribute("aria-expanded", "false"); }));

  /* ---------- confetti ---------- */
  window.__kmBurst = function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999"; document.body.appendChild(c);
    const x = c.getContext("2d"); const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ["#1a8245", "#7ee2a4", "#1e3f64", "#ea7317", "#ffffff"];
    const P = Array.from({ length: 110 }, () => ({ x: W / 2, y: H * 0.4, vx: (Math.random() - 0.5) * 13, vy: Math.random() * -12 - 3, g: 0.3 + Math.random() * 0.2, s: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 }));
    let t = 0;
    (function loop() {
      x.clearRect(0, 0, W, H); t++;
      P.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); });
      if (t < 140) requestAnimationFrame(loop); else c.remove();
    })();
  };
})();
