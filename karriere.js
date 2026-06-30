/* ============================================================
   Kurt Mager Solutions — Karriere / Online-Bewerbung
   Designkonzept · Ländle Digital
============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 9l5-5 5 5M12 4v12"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    party: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  const POSITIONS = [
    { value: "Mitarbeiter im Lager und Versand (m/w/d)", icon: I.box, desc: "Wareneingang, Qualitätssicherung, Kommissionierung & Versand · Voll- oder Teilzeit · Neufra" },
    { value: "Initiativbewerbung", icon: I.spark, desc: "Keine passende Stelle dabei? Bewerben Sie sich initiativ mit Ihrem Wunsch-Einsatzbereich." },
  ];

  const state = {
    position: "", anrede: "", vorname: "", nachname: "", email: "", phone: "", plz: "", ort: "",
    fuehrerschein: "", stapler: "", erfahrung: "", umfang: "", start: "", gehalt: "",
    message: "", privacy: false,
  };
  const SINGLE = ["position", "fuehrerschein", "stapler", "erfahrung", "umfang"];
  const TEXTS = ["anrede", "vorname", "nachname", "email", "phone", "plz", "ort", "start", "gehalt", "message"];
  const LIVE = ["vorname", "nachname", "email", "phone", "plz", "ort", "gehalt", "message"];

  /* ---------- renderers ---------- */
  function grid(group, opts, cols) {
    return `<div class="opts opts--${cols}">` + opts.map((o) => {
      const on = state[group] === o.value;
      return `<label class="opt${on ? " is-on" : ""}">
        <input type="radio" name="${group}" value="${esc(o.value)}"${on ? " checked" : ""}>
        <span class="opt__check">${I.check}</span>
        ${o.icon ? `<span class="opt__ic">${o.icon}</span>` : ""}
        <span class="opt__t">${esc(o.value)}</span>
        ${o.desc ? `<span class="opt__d">${esc(o.desc)}</span>` : ""}
      </label>`;
    }).join("") + `</div><div class="err-msg" data-for="${group}"></div>`;
  }
  function pills(group, opts) {
    return `<div class="pills">` + opts.map((o) =>
      `<label class="pill-opt"><input type="radio" name="${group}" value="${esc(o)}"${state[group] === o ? " checked" : ""}><span>${esc(o)}</span></label>`
    ).join("") + `</div>`;
  }
  function selectFld(id, label, opts, optional) {
    return `<div class="field"><label for="${id}">${label}${optional ? ' <span class="opt-tag">(optional)</span>' : ""}</label>
      <select class="select" id="${id}" name="${id}"><option value="">Bitte wählen …</option>
      ${opts.map((o) => `<option${state[id] === o ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
  }

  /* ---------- steps ---------- */
  const STEPS = [
    {
      key: "position", label: "Stelle", hint: "Eine Auswahl",
      kicker: "Schritt 1 — Position", title: "Worauf möchten Sie sich bewerben?",
      desc: "Wählen Sie eine offene Stelle oder bewerben Sie sich initiativ.",
      render: () => grid("position", POSITIONS, 1),
      valid: () => !!state.position, err: "Bitte wählen Sie eine Stelle.",
    },
    {
      key: "person", label: "Über dich", hint: "* Pflichtfeld",
      kicker: "Schritt 2 — Kontaktdaten", title: "Wer sind Sie?",
      desc: "Damit wir Sie erreichen und Ihre Bewerbung zuordnen können.",
      render: () => `
        ${selectFld("anrede", "Anrede", ["Frau", "Herr", "Divers"], true)}
        <div class="grid-2">
          <div class="field"><label for="vorname">Vorname *</label><input class="input" id="vorname" name="vorname" value="${esc(state.vorname)}" placeholder="Max"><div class="err-msg" data-for="vorname">Bitte Vornamen angeben.</div></div>
          <div class="field"><label for="nachname">Nachname *</label><input class="input" id="nachname" name="nachname" value="${esc(state.nachname)}" placeholder="Mustermann"><div class="err-msg" data-for="nachname">Bitte Nachnamen angeben.</div></div>
          <div class="field"><label for="email">E-Mail *</label><input class="input" type="email" id="email" name="email" value="${esc(state.email)}" placeholder="max.mustermann@mail.de"><div class="err-msg" data-for="email">Bitte gültige E-Mail angeben.</div></div>
          <div class="field"><label for="phone">Telefon <span class="opt-tag">(optional)</span></label><input class="input" type="tel" id="phone" name="phone" value="${esc(state.phone)}" placeholder="+49 …"></div>
          <div class="field"><label for="plz">PLZ <span class="opt-tag">(optional)</span></label><input class="input" id="plz" name="plz" value="${esc(state.plz)}" placeholder="78628"></div>
          <div class="field"><label for="ort">Wohnort <span class="opt-tag">(optional)</span></label><input class="input" id="ort" name="ort" value="${esc(state.ort)}" placeholder="Neufra"></div>
        </div>`,
      valid: () => state.vorname.trim() && state.nachname.trim() && emailOk(state.email),
    },
    {
      key: "quali", label: "Qualifikation", hint: "Alle Angaben optional",
      kicker: "Schritt 3 — Qualifikation", title: "Was bringen Sie mit?",
      desc: "Hilft uns bei der Einschätzung — alles optional, kein Muss.",
      render: () => `
        <div class="pblock"><span class="lbl">Führerschein Klasse B?</span>${pills("fuehrerschein", ["Ja", "Nein"])}</div>
        <div class="pblock"><span class="lbl">Staplerschein?</span>${pills("stapler", ["Ja", "Nein", "In Ausbildung"])}</div>
        <div class="pblock"><span class="lbl">Erfahrung in Lager &amp; Logistik</span>${pills("erfahrung", ["Berufseinsteiger", "1–3 Jahre", "Über 3 Jahre"])}</div>
        <div class="pblock"><span class="lbl">Gewünschter Umfang</span>${pills("umfang", ["Vollzeit", "Teilzeit", "Egal"])}</div>
        <div class="grid-2">
          ${selectFld("start", "Frühester Eintritt", ["Ab sofort", "Innerhalb 1 Monats", "In 1–3 Monaten", "Nach Absprache"], false)}
          <div class="field"><label for="gehalt">Gehaltsvorstellung <span class="opt-tag">(optional)</span></label><input class="input" id="gehalt" name="gehalt" value="${esc(state.gehalt)}" placeholder="z. B. brutto / Monat"></div>
        </div>`,
      valid: () => true,
    },
    {
      key: "unterlagen", label: "Unterlagen", hint: "* Einwilligung erforderlich",
      kicker: "Schritt 4 — Unterlagen", title: "Ihre Unterlagen hochladen",
      desc: "Lebenslauf, Zeugnisse, Zertifikate — einfach hochladen statt per Mail anhängen.",
      render: () => `
        <div class="drop" id="drop" tabindex="0" role="button" aria-label="Dateien auswählen">
          <span class="drop__ic">${I.upload}</span>
          <strong>Unterlagen hierher ziehen oder klicken</strong>
          <small>Lebenslauf, Zeugnisse, Zertifikate · PDF, DOC, JPG, PNG, ZIP · max. 25 MB</small>
        </div>
        <input type="file" id="fileInput" hidden multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip">
        <div class="file-list" id="fileList"></div>
        <div class="field" style="margin-top:22px"><label for="message">Ihre Nachricht / Motivation <span class="opt-tag">(optional)</span></label><textarea class="textarea" id="message" name="message" placeholder="Erzählen Sie uns kurz, warum Sie zu Kurt Mager passen — bei einer Initiativbewerbung gern auch Ihr Wunsch-Einsatzbereich.">${esc(state.message)}</textarea></div>
        <label class="check" style="margin-top:6px"><input type="checkbox" id="privacy" name="privacy"${state.privacy ? " checked" : ""}><span>Ich bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Bewerbung gespeichert und verwendet werden. *</span></label>
        <div class="err-msg" data-for="privacy">Bitte bestätigen Sie die Einwilligung.</div>`,
      valid: () => !!state.privacy,
    },
  ];

  /* ---------- controller ---------- */
  let cur = 0, maxReached = 0, submitted = false, files = [];
  const wizard = $("#wizard"), body = $("#wizardBody"), progress = $("#progress");
  const btnPrev = $("#btnPrev"), btnNext = $("#btnNext"), hint = $("#stepHint");

  function renderProgress() {
    progress.innerHTML = STEPS.map((s, i) => {
      const cls = i === cur ? "is-active" : i < cur || i < maxReached ? "is-done" : "";
      return `<div class="pstep ${cls}" data-i="${i}"><span class="pstep__num">${(i < cur || (i < maxReached && i !== cur)) ? I.check : i + 1}</span><span class="pstep__label">${s.label}</span></div>${i < STEPS.length - 1 ? '<span class="pstep__sep"></span>' : ""}`;
    }).join("");
  }
  function renderStep() {
    const s = STEPS[cur];
    body.innerHTML = `<div class="step"><div class="step__head"><span class="step__kicker">${s.kicker}</span><h3 class="step__title">${s.title}</h3><p class="step__desc">${s.desc}</p></div>${s.render()}</div>`;
    wizard.classList.toggle("has-prev", cur > 0);
    btnNext.innerHTML = cur === STEPS.length - 1 ? "Bewerbung absenden " + I.send : 'Weiter <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    hint.textContent = s.hint || "";
    renderProgress();
    if (s.key === "unterlagen") initDrop();
  }
  function goto(i) {
    if (i < 0 || i > STEPS.length - 1 || submitted) return;
    cur = i; maxReached = Math.max(maxReached, i);
    renderStep();
    body.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function next() {
    const s = STEPS[cur];
    if (!s.valid()) { showError(s); return; }
    if (cur === STEPS.length - 1) { submit(); return; }
    goto(cur + 1);
  }
  function showError(s) {
    if (s.key === "person") {
      [["vorname", state.vorname.trim()], ["nachname", state.nachname.trim()], ["email", emailOk(state.email)]].forEach(([f, ok]) => {
        const inp = $("#" + f), msg = $(`.err-msg[data-for="${f}"]`);
        if (inp) inp.classList.toggle("err", !ok);
        if (msg) msg.classList.toggle("show", !ok);
      });
      const first = $(".input.err"); if (first) first.focus();
    } else if (s.key === "unterlagen") {
      const msg = $('.err-msg[data-for="privacy"]'); if (msg) msg.classList.add("show");
    } else {
      const msg = $(`.err-msg[data-for="${s.key}"]`); if (msg) { msg.textContent = s.err; msg.classList.add("show"); }
      const g = $(".opts"); if (g) g.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 220 });
    }
  }

  function sync(e) {
    const t = e.target;
    if (SINGLE.includes(t.name)) {
      state[t.name] = t.value;
      if (t.closest(".opt")) $$(`input[name="${t.name}"]`).forEach((x) => { const c = x.closest(".opt"); if (c) c.classList.toggle("is-on", x.checked); });
      const msg = $(`.err-msg[data-for="${t.name}"]`); if (msg) msg.classList.remove("show");
    }
    if (TEXTS.includes(t.id)) state[t.id] = t.value;
    if (t.id === "privacy") { state.privacy = t.checked; const m = $('.err-msg[data-for="privacy"]'); if (m) m.classList.remove("show"); }
    if (t.classList && t.classList.contains("err")) t.classList.remove("err");
    updateSummary();
  }
  body.addEventListener("change", sync);
  body.addEventListener("input", (e) => { if (LIVE.includes(e.target.id)) sync(e); });
  body.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "A") { e.preventDefault(); next(); } });

  /* ---------- dropzone ---------- */
  function initDrop() {
    const drop = $("#drop"), input = $("#fileInput");
    if (!drop) return;
    renderFiles();
    drop.addEventListener("click", () => input.click());
    drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
    input.addEventListener("change", () => addFiles(input.files));
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
  }
  function addFiles(list) {
    Array.from(list).forEach((f) => { if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f); });
    renderFiles();
  }
  function renderFiles() {
    const wrap = $("#fileList"), drop = $("#drop");
    if (!wrap) return;
    wrap.innerHTML = files.map((f, i) => `<div class="file-item">${I.file}<span>${esc(f.name)}</span><span style="color:var(--muted);font-size:.82rem">${fmtSize(f.size)}</span><button type="button" class="x" data-i="${i}" aria-label="Entfernen">×</button></div>`).join("");
    if (drop) drop.classList.toggle("has-file", files.length > 0);
    $$(".file-item .x", wrap).forEach((b) => b.addEventListener("click", () => { files.splice(+b.dataset.i, 1); renderFiles(); }));
    updateSummary();
  }
  const fmtSize = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

  /* ---------- summary + completeness ---------- */
  const sumBody = $("#summaryBody"), estBox = $("#estimate");
  function row(k, v, empty) { return `<div class="srow"><span class="srow__k">${k}</span><span class="srow__v${v ? "" : " empty"}">${v || empty || "offen"}</span></div>`; }
  function updateSummary() {
    const name = (state.vorname + " " + state.nachname).trim();
    const posShort = state.position === "Mitarbeiter im Lager und Versand (m/w/d)" ? "Lager &amp; Versand" : esc(state.position);
    sumBody.innerHTML =
      row("Stelle", state.position ? posShort : "") +
      row("Name", esc(name)) +
      row("E-Mail", esc(state.email)) +
      row("Führerschein B", esc(state.fuehrerschein), "—") +
      row("Staplerschein", esc(state.stapler), "—") +
      row("Erfahrung", esc(state.erfahrung), "—") +
      row("Eintritt", esc(state.start), "—") +
      row("Unterlagen", files.length ? files.length + " Datei" + (files.length > 1 ? "en" : "") : "", "noch keine");
    renderEstimate();
  }
  function renderEstimate() {
    const checks = [
      !!state.position, !!state.vorname.trim(), !!state.nachname.trim(), emailOk(state.email),
      !!(state.fuehrerschein || state.stapler || state.erfahrung || state.umfang),
      !!state.start, files.length > 0, !!state.privacy,
    ];
    const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const ready = state.position && state.vorname.trim() && state.nachname.trim() && emailOk(state.email) && state.privacy;
    estBox.innerHTML =
      `<div class="est-row"><span class="k">Vollständigkeit</span><span class="v${pct >= 80 ? " good" : ""}">${pct}%</span></div>` +
      `<div class="meter"><span style="width:${pct}%"></span></div>` +
      `<div class="est-row"><span class="k">Status</span><span class="v${ready ? " good" : ""}">${ready ? "Bereit zum Absenden" : "In Bearbeitung"}</span></div>`;
  }

  /* ---------- submit ---------- */
  function submit() {
    submitted = true;
    const ref = "KM-BEW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const L = [
      "Stelle: " + state.position,
      "Name: " + [state.anrede, state.vorname, state.nachname].filter(Boolean).join(" "),
      "E-Mail: " + state.email,
      "Telefon: " + (state.phone || "—"),
      "Wohnort: " + [state.plz, state.ort].filter(Boolean).join(" ") || "—",
      "Führerschein Klasse B: " + (state.fuehrerschein || "—"),
      "Staplerschein: " + (state.stapler || "—"),
      "Erfahrung Lager/Logistik: " + (state.erfahrung || "—"),
      "Umfang: " + (state.umfang || "—"),
      "Frühester Eintritt: " + (state.start || "—"),
      "Gehaltsvorstellung: " + (state.gehalt || "—"),
      "Unterlagen: " + (files.map((f) => f.name).join(", ") || "—"),
      "Nachricht: " + (state.message || "—"),
      "Referenz: " + ref,
    ];
    const mailto = "mailto:info@mager-solutions.de?subject=" + encodeURIComponent("Bewerbung – " + state.position + " – " + state.vorname + " " + state.nachname) + "&body=" + encodeURIComponent(L.join("\n"));
    wizard.classList.remove("has-prev");
    progress.querySelectorAll(".pstep").forEach((p) => { p.classList.remove("is-active"); p.classList.add("is-done"); p.querySelector(".pstep__num").innerHTML = I.check; });
    $(".wizard__nav").style.display = "none";
    body.innerHTML = `<div class="done">
        <div class="done__badge">${I.party}</div>
        <h3>Bewerbung eingegangen — danke, ${esc(state.vorname || "")}!</h3>
        <p>Wir haben Ihre Bewerbung auf <strong>${esc(state.position)}</strong> erhalten und melden uns in der Regel zeitnah bei Ihnen.</p>
        <div class="done__ref">Ihre Referenz: <b>${ref}</b></div>
        <div class="done__actions">
          <a class="btn btn--primary" href="${mailto}">Bewerbung als E-Mail öffnen</a>
          <button type="button" class="btn btn--ghost" id="restart">Neue Bewerbung</button>
        </div>
        <p style="font-size:.82rem;color:var(--muted);margin-top:14px">Hinweis: Bitte hängen Sie Ihre Unterlagen an die sich öffnende E-Mail an.</p>
      </div>`;
    $("#restart").addEventListener("click", reset);
    burst();
  }
  function reset() {
    Object.assign(state, { position: "", anrede: "", vorname: "", nachname: "", email: "", phone: "", plz: "", ort: "", fuehrerschein: "", stapler: "", erfahrung: "", umfang: "", start: "", gehalt: "", message: "", privacy: false });
    files = []; submitted = false; cur = 0; maxReached = 0;
    $(".wizard__nav").style.display = "";
    renderStep(); updateSummary();
    wizard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- wire ---------- */
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", () => goto(cur - 1));
  progress.addEventListener("click", (e) => { const p = e.target.closest(".pstep"); if (p && !submitted) { const i = +p.dataset.i; if (i <= maxReached) goto(i); } });

  // "Auf diese Stelle bewerben" buttons
  $$(".js-apply").forEach((b) => b.addEventListener("click", () => {
    if (submitted) reset();
    state.position = b.dataset.pos;
    maxReached = Math.max(maxReached, 1); cur = 1;
    renderStep(); updateSummary();
    $("#bewerben").scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  renderStep();
  updateSummary();

  /* ---------- page chrome ---------- */
  $("#year").textContent = new Date().getFullYear();
  const burger = $("#burger"), mobile = $("#topbarMobile");
  burger.addEventListener("click", () => { const open = mobile.classList.toggle("open"); burger.setAttribute("aria-expanded", open); });
  $$(".js-scroll, .topbar__mobile a, .topbar__nav a").forEach((a) => a.addEventListener("click", () => { mobile.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = "none"; io.unobserve(en.target); } }), { threshold: 0.12 });
    $$(".bcard").forEach((n) => { n.style.opacity = 0; n.style.transform = "translateY(16px)"; n.style.transition = "opacity .5s ease, transform .5s ease"; io.observe(n); });
  }

  function burst() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999"; document.body.appendChild(c);
    const x = c.getContext("2d"); const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ["#1a8245", "#7ee2a4", "#1e3f64", "#c8a04a", "#ffffff"];
    const P = Array.from({ length: 120 }, () => ({ x: W / 2, y: H * 0.3, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 3, g: 0.3 + Math.random() * 0.2, s: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 }));
    let t = 0;
    (function loop() {
      x.clearRect(0, 0, W, H); t++;
      P.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); });
      if (t < 140) requestAnimationFrame(loop); else c.remove();
    })();
  }
})();
