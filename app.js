/* ============================================================
   Kurt Mager Solutions — Anfrage-Konfigurator
   Designkonzept · Ländle Digital
============================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- icons ---------- */
  const I = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    dreh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="6" rx="7" ry="2.4"/><path d="M5 6v12c0 1.3 3.1 2.4 7 2.4s7-1.1 7-2.4V6"/><path d="M12 9.8v7" stroke-dasharray="1.5 2"/></svg>',
    fraes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M9 9h6v6H9z"/></svg>',
    stanz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="1.5"/><circle cx="8" cy="12" r="1.4"/><circle cx="13" cy="12" r="1.4"/><circle cx="17.5" cy="12" r="1.1"/></svg>',
    biege: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h7a8 8 0 0 0 8-8V5"/><path d="M15 5h4v4"/></svg>',
    fliess: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3M16 3v3"/><rect x="6" y="9" width="12" height="6" rx="1"/><path d="M9 18l3 3 3-3"/></svg>',
    spann: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 8 4-4 3 3-4 4z"/><path d="m9 7 8 8a2.5 2.5 0 0 1-3.5 3.5l-8-8"/></svg>',
    bau: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/></svg>',
    pack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 9l5-5 5 5M12 4v12"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    party: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  /* ---------- data ---------- */
  const PARTS = [
    { value: "Drehteile", icon: I.dreh, desc: "Präzise gedrehte Teile, vom Muster bis zur Großserie." },
    { value: "Frästeile", icon: I.fraes, desc: "Komplexe Geometrien, mehrachsig gefräst." },
    { value: "Stanzteile", icon: I.stanz, desc: "Wirtschaftlich in mittleren bis hohen Stückzahlen." },
    { value: "Biegeteile", icon: I.biege, desc: "Präzisionsgefertigte Biegeteile nach Zeichnung." },
    { value: "Fließpressteile", icon: I.fliess, desc: "Umgeformte Teile mit hoher Festigkeit – inkl. Spannschrauben." },
    { value: "Baugruppen", icon: I.bau, desc: "Komplette Montage einbaufertiger Baugruppen." },
    { value: "Sonstiges", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>', desc: "Etwas anderes oder noch unklar – wir beraten Sie." },
  ];
  const MATERIALS = [
    { value: "Aluminium", swatch: "#c9ced6" },
    { value: "Edelstahl", swatch: "#a7b3c2" },
    { value: "Stahl", swatch: "#5b6675" },
    { value: "Messing", swatch: "#c8a04a" },
    { value: "Kupfer", swatch: "#c1652f" },
    { value: "Kunststoff", swatch: "#2bb6a3" },
    { value: "Sonderwerkstoff", swatch: "linear-gradient(135deg,#1a8245,#1e3f64)" },
    { value: "Sonstiges", swatch: "#cbd5e1", sym: "+", dark: true },
    { value: "Beraten Sie mich", swatch: "#e4e9f0", sym: "?", dark: true },
  ];
  const QTY = [
    { value: "Prototyp / Muster", desc: "1 – 10 Stück", lvl: 1 },
    { value: "Kleinserie", desc: "10 – 500 Stück", lvl: 0 },
    { value: "Serie", desc: "500 – 10.000 Stück", lvl: 0 },
    { value: "Großserie", desc: "ab 10.000 Stück", lvl: -1 },
    { value: "Sonstiges", desc: "Andere Menge / noch offen", lvl: 0 },
  ];
  const PRECISION = [
    { value: "Standard", desc: "ISO 2768-m · allgemeine Toleranzen", lvl: 0 },
    { value: "Fein", desc: "ISO 2768-f · enge Toleranzen", lvl: 1 },
    { value: "Hochpräzise", desc: "±0,01 mm · Spezialanwendung", lvl: 2 },
    { value: "Sonstiges", desc: "Noch offen / nach Absprache", lvl: 0 },
  ];
  const SURFACES = ["Roh / unbehandelt", "Entgratet", "Eloxiert", "Verzinkt", "Brüniert", "Pulverbeschichtet", "Polieren", "Nach Zeichnung", "Sonstiges"];
  const DEADLINES = ["So schnell wie möglich", "In 2 – 4 Wochen", "In 1 – 3 Monaten", "Planungsphase / unverbindlich"];
  const OFFER = ["So schnell wie möglich", "Diese Woche", "In 1 – 2 Wochen", "In diesem Monat", "Kein fester Termin"];

  const MAT_LVL = { Aluminium: 1, Kunststoff: 1, Stahl: 2, Messing: 2, Kupfer: 3, Edelstahl: 3, Sonderwerkstoff: 4, "Beraten Sie mich": 2 };
  const LEAD = { "Prototyp / Muster": "Muster in ~10–15 Tagen", Kleinserie: "~3 – 4 Wochen", Serie: "~4 – 6 Wochen", Großserie: "nach Abstimmung" };

  /* ---------- state ---------- */
  const state = {
    parts: [], materials: [], quantity: "", annual: "",
    precision: "", surfaces: [], file: "", deadline: "", angebotsfrist: "", zielpreis: "",
    notes: "", company: "", name: "", email: "", phone: "", position: "", privacy: false,
  };

  /* ---------- steps ---------- */
  const STEPS = [
    {
      key: "parts", label: "Teile", hint: "Mehrfachauswahl möglich",
      kicker: "Schritt 1 — Produkt",
      title: "Was möchten Sie fertigen lassen?",
      desc: "Wählen Sie eine oder mehrere Teilearten. Sie wissen es noch nicht genau? Kein Problem — wir beraten Sie.",
      render: () => grid("parts", PARTS, true, 2),
      valid: () => state.parts.length > 0,
      err: "Bitte wählen Sie mindestens eine Teileart.",
    },
    {
      key: "materials", label: "Werkstoff", hint: "Mehrfachauswahl möglich",
      kicker: "Schritt 2 — Werkstoff",
      title: "Aus welchem Werkstoff?",
      desc: "Wir verarbeiten unterschiedlichste Werkstoffe — auf Anfrage auch Sonderwerkstoffe.",
      render: () => grid("materials", MATERIALS, true, 2),
      valid: () => state.materials.length > 0,
      err: "Bitte wählen Sie mindestens einen Werkstoff.",
    },
    {
      key: "quantity", label: "Menge", hint: "Losgröße wählen",
      kicker: "Schritt 3 — Stückzahl",
      title: "Welche Stückzahl benötigen Sie?",
      desc: "Vom Prototyp bis zur Großserie — wir fertigen in der gewünschten Menge.",
      render: () =>
        grid("quantity", QTY, false, 2) +
        `<div class="field" style="margin-top:22px">
           <label for="annual">Konkreter Jahresbedarf <span class="opt-tag">(optional, Stück)</span></label>
           <input class="input" type="number" min="1" inputmode="numeric" id="annual" name="annual" placeholder="z. B. 5.000" value="${esc(state.annual)}">
         </div>`,
      valid: () => !!state.quantity,
      err: "Bitte wählen Sie eine Losgröße.",
    },
    {
      key: "precision", label: "Qualität", hint: "Toleranz wählen · Oberfläche optional",
      kicker: "Schritt 4 — Präzision",
      title: "Toleranz & Oberfläche",
      desc: "Je genauer die Anforderung, desto passgenauer das Angebot.",
      render: () =>
        grid("precision", PRECISION, false, 3) +
        `<div class="fieldset">
           <div class="fieldset__legend">Oberflächenbehandlung <span class="opt-tag" style="font-weight:500;color:var(--muted)">(optional, mehrere möglich)</span></div>
           <div class="fieldset__hint">Veredelung & Nachbearbeitung übernehmen wir komplett.</div>
           ${grid("surfaces", SURFACES.map((s) => ({ value: s })), true, 3, true)}
         </div>`,
      valid: () => !!state.precision,
      err: "Bitte wählen Sie eine Toleranzklasse.",
    },
    {
      key: "details", label: "Details", hint: "Alle Angaben optional",
      kicker: "Schritt 5 — Unterlagen",
      title: "Zeichnung & Details",
      desc: "Laden Sie Ihre Zeichnung hoch (PDF, STEP, DXF, DWG …) — oder ergänzen Sie Ihre Vorgaben als Text.",
      render: () => `
        <div class="drop" id="drop" tabindex="0" role="button" aria-label="Datei auswählen">
          <span class="drop__ic">${I.upload}</span>
          <strong>Zeichnung hierher ziehen oder klicken</strong>
          <small>PDF, STEP, STP, DXF, DWG, IGES, PNG, JPG · max. 25 MB</small>
        </div>
        <input type="file" id="fileInput" hidden multiple accept=".pdf,.step,.stp,.dxf,.dwg,.iges,.igs,.png,.jpg,.jpeg,.zip">
        <div class="file-list" id="fileList"></div>
        <div class="grid-2" style="margin-top:22px">
          <div class="field">
            <label for="deadline">Gewünschter Liefertermin <span class="opt-tag">(optional)</span></label>
            <select class="select" id="deadline" name="deadline">
              <option value="">Bitte wählen …</option>
              ${DEADLINES.map((d) => `<option ${state.deadline === d ? "selected" : ""}>${d}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="angebotsfrist">Angebot benötigt bis <span class="opt-tag">(optional)</span></label>
            <select class="select" id="angebotsfrist" name="angebotsfrist">
              <option value="">Bitte wählen …</option>
              ${OFFER.map((d) => `<option ${state.angebotsfrist === d ? "selected" : ""}>${d}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label for="zielpreis">Zielpreis pro Teil <span class="opt-tag">(optional)</span></label>
          <input class="input" type="text" id="zielpreis" name="zielpreis" inputmode="decimal" value="${esc(state.zielpreis)}" placeholder="z. B. 2,50 € / Stück">
          <p class="fieldset__hint" style="margin-top:6px">Falls Sie einen Zielpreis erreichen möchten – das hilft uns bei der wirtschaftlichsten Auslegung.</p>
        </div>
        <div class="field">
          <label for="notes">Anmerkungen <span class="opt-tag">(optional)</span></label>
          <textarea class="textarea" id="notes" name="notes" placeholder="Besonderheiten, Norm-Anforderungen, Einsatzzweck …">${esc(state.notes)}</textarea>
        </div>`,
      valid: () => true,
    },
    {
      key: "contact", label: "Kontakt", hint: "* Pflichtfeld",
      kicker: "Schritt 6 — Kontakt",
      title: "An wen dürfen wir das Angebot senden?",
      desc: "Ein fester Ansprechpartner meldet sich — in der Regel zeitnah.",
      render: () => `
        <div class="grid-2">
          <div class="field"><label for="company">Firma *</label><input class="input" id="company" name="company" value="${esc(state.company)}" placeholder="Musterfirma GmbH"><div class="err-msg" data-for="company">Bitte Firma angeben.</div></div>
          <div class="field"><label for="name">Ansprechpartner *</label><input class="input" id="name" name="name" value="${esc(state.name)}" placeholder="Vor- und Nachname"><div class="err-msg" data-for="name">Bitte Namen angeben.</div></div>
          <div class="field"><label for="email">E-Mail *</label><input class="input" type="email" id="email" name="email" value="${esc(state.email)}" placeholder="name@firma.de"><div class="err-msg" data-for="email">Bitte gültige E-Mail angeben.</div></div>
          <div class="field"><label for="phone">Telefon <span class="opt-tag">(optional)</span></label><input class="input" type="tel" id="phone" name="phone" value="${esc(state.phone)}" placeholder="+49 …"></div>
        </div>
        <div class="field"><label for="position">Position / Abteilung <span class="opt-tag">(optional)</span></label><input class="input" id="position" name="position" value="${esc(state.position)}" placeholder="z. B. Einkauf, Konstruktion"></div>
        <label class="check" style="margin-top:6px"><input type="checkbox" id="privacy" name="privacy" ${state.privacy ? "checked" : ""}><span>Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. *</span></label>
        <div class="err-msg" data-for="privacy">Bitte bestätigen Sie die Einwilligung.</div>`,
      valid: () => state.company.trim() && state.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) && state.privacy,
    },
  ];

  /* ---------- option grid renderer ---------- */
  function grid(group, opts, multi, cols, compact) {
    const sel = (v) => (multi ? state[group].includes(v) : state[group] === v);
    return `<div class="opts opts--${cols}">` + opts.map((o) => {
      const on = sel(o.value);
      const ic = o.swatch
        ? `<span class="opt__ic" style="background:${o.swatch};color:${o.dark ? "var(--slate)" : "#fff"}">${o.sym || ""}</span>`
        : o.icon ? `<span class="opt__ic">${o.icon}</span>` : "";
      return `<label class="opt${on ? " is-on" : ""}">
        <input type="${multi ? "checkbox" : "radio"}" name="${group}" value="${esc(o.value)}"${on ? " checked" : ""}>
        <span class="opt__check">${I.check}</span>
        ${compact ? "" : ic}
        <span class="opt__t">${esc(o.value)}</span>
        ${o.desc ? `<span class="opt__d">${esc(o.desc)}</span>` : ""}
      </label>`;
    }).join("") + `</div><div class="err-msg" data-for="${group}"></div>`;
  }

  /* ---------- wizard controller ---------- */
  let cur = 0, maxReached = 0, submitted = false;
  const wizard = $("#wizard"), body = $("#wizardBody"), progress = $("#progress");
  const btnPrev = $("#btnPrev"), btnNext = $("#btnNext"), hint = $("#stepHint");

  function renderProgress() {
    progress.innerHTML = STEPS.map((s, i) => {
      const cls = i === cur ? "is-active" : i < maxReached || i < cur ? "is-done" : "";
      return `<div class="pstep ${cls}" data-i="${i}">
          <span class="pstep__num">${i < cur || (i < maxReached && i !== cur) ? I.check : i + 1}</span>
          <span class="pstep__label">${s.label}</span>
        </div>${i < STEPS.length - 1 ? '<span class="pstep__sep"></span>' : ""}`;
    }).join("");
  }

  function renderStep() {
    const s = STEPS[cur];
    body.innerHTML = `<div class="step">
        <div class="step__head">
          <span class="step__kicker">${s.kicker}</span>
          <h3 class="step__title">${s.title}</h3>
          <p class="step__desc">${s.desc}</p>
        </div>
        ${s.render()}
      </div>`;
    wizard.classList.toggle("has-prev", cur > 0);
    btnNext.innerHTML = cur === STEPS.length - 1
      ? 'Anfrage absenden <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>'
      : 'Weiter <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
    hint.textContent = s.hint || "";
    renderProgress();
    if (s.key === "details") initDrop();
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
    if (s.key === "contact") {
      ["company", "name", "email", "privacy"].forEach((f) => {
        const ok = f === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) : f === "privacy" ? state.privacy : state[f].trim();
        const inp = $("#" + f), msg = $(`.err-msg[data-for="${f}"]`);
        if (inp && f !== "privacy") inp.classList.toggle("err", !ok);
        if (msg) msg.classList.toggle("show", !ok);
      });
      const first = $(".input.err"); if (first) first.focus();
    } else {
      const msg = $(`.err-msg[data-for="${s.key}"]`);
      if (msg) { msg.textContent = s.err; msg.classList.add("show"); }
      const g = $(".opts"); if (g) { g.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 220 }); }
    }
  }

  /* ---------- read inputs into state ---------- */
  function sync(e) {
    const t = e.target;
    if (t.name in state || ["annual", "deadline", "notes", "company", "name", "email", "phone", "position"].includes(t.id)) {
      // single text/select/number/textarea
      if (t.type === "checkbox" && t.id === "privacy") state.privacy = t.checked;
      else if (t.id && t.id in state) state[t.id] = t.value;
    }
    // option groups
    ["parts", "materials", "surfaces"].forEach((g) => {
      if (t.name === g) state[g] = $$(`input[name="${g}"]:checked`).map((x) => x.value);
    });
    ["quantity", "precision"].forEach((g) => { if (t.name === g) state[g] = t.value; });

    // toggle visual selection
    const lab = t.closest && t.closest(".opt");
    if (lab) {
      const group = t.name;
      if (t.type === "radio") $$(`input[name="${group}"]`).forEach((x) => x.closest(".opt").classList.toggle("is-on", x.checked));
      else lab.classList.toggle("is-on", t.checked);
      const msg = $(`.err-msg[data-for="${group}"]`); if (msg) msg.classList.remove("show");
    }
    if (t.classList && t.classList.contains("err")) t.classList.remove("err");
    updateSummary();
  }

  body.addEventListener("change", sync);
  body.addEventListener("input", (e) => { if (["annual", "notes", "company", "name", "email", "phone", "position", "zielpreis"].includes(e.target.id)) sync(e); });

  /* ---------- file dropzone ---------- */
  let files = [];
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
    const wrap = $("#fileList"), drop = $("#drop"), status = $("#drawStatus");
    state.file = files.map((f) => f.name).join(", ");
    if (status) {
      const n = files.length;
      status.textContent = n === 0
        ? "Jederzeit möglich – PDF, STEP, DXF, JPG …"
        : n === 1
          ? "1 Datei angehängt: " + files[0].name
          : n + " Dateien angehängt";
      status.classList.toggle("has-file", n > 0);
    }
    if (drop) drop.classList.toggle("has-file", files.length > 0);
    if (wrap) {
      wrap.innerHTML = files.map((f, i) => `<div class="file-item">${I.file}<span>${esc(f.name)}</span><span style="color:var(--muted);font-size:.82rem">${fmtSize(f.size)}</span><button type="button" class="x" data-i="${i}" aria-label="Entfernen">×</button></div>`).join("");
      $$(".file-item .x", wrap).forEach((b) => b.addEventListener("click", () => { files.splice(+b.dataset.i, 1); renderFiles(); updateSummary(); }));
    }
    updateSummary();
  }
  const fmtSize = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

  /* ---------- live summary + estimate ---------- */
  const sumBody = $("#summaryBody"), estBox = $("#estimate");
  function row(k, v, empty) {
    return `<div class="srow"><span class="srow__k">${k}</span><span class="srow__v${v ? "" : " empty"}">${v || empty || "offen"}</span></div>`;
  }
  function chips(arr) { return arr.map((v) => `<span class="tag">${esc(v)}</span>`).join(""); }

  function updateSummary() {
    const partsV = state.parts.length ? esc(state.parts[0]) + (state.parts.length > 1 ? `<span class="tag">+${state.parts.length - 1}</span>` : "") : "";
    const matV = state.materials.length ? esc(state.materials[0]) + (state.materials.length > 1 ? `<span class="tag">+${state.materials.length - 1}</span>` : "") : "";
    const qtyV = state.quantity ? esc(state.quantity) + (state.annual ? `<span class="tag">${esc(state.annual)} Stk</span>` : "") : "";
    const surfV = state.surfaces.length ? esc(state.surfaces[0]) + (state.surfaces.length > 1 ? `<span class="tag">+${state.surfaces.length - 1}</span>` : "") : (state.precision ? "Standard" : "");
    sumBody.innerHTML =
      row("Teileart", partsV) +
      row("Werkstoff", matV) +
      row("Losgröße", qtyV) +
      row("Toleranz", state.precision ? esc(state.precision) : "") +
      row("Oberfläche", surfV, "Standard") +
      row("Zeichnung", state.file ? `${files.length} Datei${files.length > 1 ? "en" : ""}` : "", "optional") +
      row("Liefertermin", state.deadline ? esc(state.deadline) : "", "—") +
      row("Angebot bis", state.angebotsfrist ? esc(state.angebotsfrist) : "", "—") +
      row("Zielpreis", state.zielpreis ? esc(state.zielpreis) : "", "—");
    renderEstimate();
  }

  function renderEstimate() {
    const ready = state.parts.length && state.materials.length && state.quantity;
    if (!ready) {
      estBox.innerHTML =
        estRow("Machbarkeit", "—") + estRow("Preisniveau / Stück", "—") + estRow("Lieferzeit (Richtwert)", "—") + estRow("Erstangebot", "zeitnah", true);
      return;
    }
    // price level heuristic
    let lvl = Math.max(...state.materials.map((m) => MAT_LVL[m] || 2));
    const prec = PRECISION.find((p) => p.value === state.precision); if (prec) lvl += prec.lvl;
    if (state.parts.includes("Baugruppen") || state.parts.includes("Fließpressteile")) lvl += 1;
    const q = QTY.find((x) => x.value === state.quantity); if (q) lvl += q.lvl;
    lvl = Math.max(1, Math.min(4, lvl));
    let scale = '<span class="price-scale">';
    for (let i = 1; i <= 4; i++) scale += i <= lvl ? "<b>€</b>" : '<span class="off">€</span>';
    scale += "</span>";
    const special = state.precision === "Hochpräzise" && state.materials.includes("Sonderwerkstoff");
    estBox.innerHTML =
      estRow("Machbarkeit", special ? "Spezialfertigung – wird geprüft" : "Im Standard-Spektrum", !special) +
      estRow("Preisniveau / Stück", scale) +
      estRow("Lieferzeit (Richtwert)", LEAD[state.quantity] || "nach Abstimmung") +
      estRow("Erstangebot", "zeitnah", true);
  }
  function estRow(k, v, good) { return `<div class="est-row"><span class="k">${k}</span><span class="v${good ? " good" : ""}">${v}</span></div>`; }

  /* ---------- submit / success ---------- */
  function submit() {
    submitted = true;
    const ref = "KM-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const lines = [
      "Teileart: " + (state.parts.join(", ") || "—"),
      "Werkstoff: " + (state.materials.join(", ") || "—"),
      "Losgröße: " + state.quantity + (state.annual ? " (" + state.annual + " Stück/Jahr)" : ""),
      "Toleranz: " + state.precision,
      "Oberfläche: " + (state.surfaces.join(", ") || "Standard"),
      "Zeichnung: " + (state.file || "—"),
      "Liefertermin: " + (state.deadline || "—"),
      "Angebot benötigt bis: " + (state.angebotsfrist || "—"),
      "Zielpreis/Teil: " + (state.zielpreis || "—"),
      "Anmerkungen: " + (state.notes || "—"),
      "",
      "Firma: " + state.company,
      "Ansprechpartner: " + state.name + (state.position ? " (" + state.position + ")" : ""),
      "E-Mail: " + state.email,
      "Telefon: " + (state.phone || "—"),
      "Referenz: " + ref,
    ];
    wizard.classList.remove("has-prev");
    progress.querySelectorAll(".pstep").forEach((p) => { p.classList.remove("is-active"); p.classList.add("is-done"); p.querySelector(".pstep__num").innerHTML = I.check; });
    $(".wizard__nav").style.display = "none";
    const drawBar = $(".wizard__draw"); if (drawBar) drawBar.style.display = "none";
    body.innerHTML = `<div class="done">
        <div class="done__badge">${I.party}</div>
        <h3>Anfrage komplett — danke, ${esc(state.name.split(" ")[0] || "")}!</h3>
        <p id="kmSendMsg">Ihre Anfrage wird übermittelt …</p>
        <div class="done__ref">Ihre Referenz: <b>${ref}</b></div>
        <div class="done__actions">
          <button type="button" class="btn btn--primary" id="restart">Neue Anfrage starten</button>
        </div>
      </div>`;
    $("#restart").addEventListener("click", reset);
    if (window.confettiBurst) window.confettiBurst();
    const payload = {
      access_key: "c6eb7fa2-94d4-467d-9405-d3d36699123d",
      subject: "Anfrage über Konfigurator – " + ref,
      from_name: "Website Kurt Mager Solutions",
      botcheck: "",
      Referenz: ref,
      Teileart: state.parts.join(", ") || "—",
      Werkstoff: state.materials.join(", ") || "—",
      Losgroesse: state.quantity + (state.annual ? " (" + state.annual + " Stück/Jahr)" : ""),
      Toleranz: state.precision || "—",
      Oberflaeche: state.surfaces.join(", ") || "Standard",
      Zeichnung: state.file || "—",
      Liefertermin: state.deadline || "—",
      "Angebot benoetigt bis": state.angebotsfrist || "—",
      "Zielpreis pro Teil": state.zielpreis || "—",
      Anmerkungen: state.notes || "—",
      Firma: state.company || "—",
      Ansprechpartner: state.name + (state.position ? " (" + state.position + ")" : ""),
      email: state.email || "",
      Telefon: state.phone || "—",
    };
    fetch("https://api.web3forms.com/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json()).then((d) => {
      const m = document.getElementById("kmSendMsg");
      if (d && d.success) { if (m) m.textContent = "Ihre Anfrage ist bei uns eingegangen – Ihr fester Ansprechpartner meldet sich zeitnah mit einem passgenauen Angebot."; }
      else { if (m) m.textContent = "Da ist leider etwas schiefgelaufen. Bitte versuchen Sie es gleich noch einmal oder kontaktieren Sie uns direkt: info@mager-solutions.de · 0741 280014-0."; console.error("Web3Forms Antwort:", d); }
    }).catch((err) => {
      const m = document.getElementById("kmSendMsg");
      if (m) m.textContent = "Da ist leider etwas schiefgelaufen. Bitte versuchen Sie es gleich noch einmal oder kontaktieren Sie uns direkt: info@mager-solutions.de · 0741 280014-0.";
      console.error("Web3Forms Fehler:", err);
    });
  }

  function reset() {
    Object.assign(state, { parts: [], materials: [], quantity: "", annual: "", precision: "", surfaces: [], file: "", deadline: "", angebotsfrist: "", zielpreis: "", notes: "", company: "", name: "", email: "", phone: "", position: "", privacy: false });
    files = []; submitted = false; cur = 0; maxReached = 0;
    $(".wizard__nav").style.display = "";
    const drawBar = $(".wizard__draw"); if (drawBar) drawBar.style.display = "";
    renderStep(); updateSummary();
    wizard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------- wire up ---------- */
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", () => goto(cur - 1));
  progress.addEventListener("click", (e) => { const p = e.target.closest(".pstep"); if (p && !submitted) { const i = +p.dataset.i; if (i <= maxReached) goto(i); } });
  body.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "A") { e.preventDefault(); next(); } });

  /* persistent drawing upload – available during every step */
  const btnDraw = $("#btnDraw"), drawInput = $("#drawInput");
  if (btnDraw && drawInput) {
    btnDraw.addEventListener("click", () => drawInput.click());
    drawInput.addEventListener("change", () => { addFiles(drawInput.files); drawInput.value = ""; });
  }

  renderStep();
  renderFiles();
  updateSummary();

  /* ============================================================ page chrome ============================================================ */
  $("#year").textContent = new Date().getFullYear();
  const burger = $("#burger"), mobile = $("#topbarMobile");
  burger.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$(".js-scroll, .topbar__mobile a, .topbar__nav a").forEach((a) =>
    a.addEventListener("click", () => { mobile.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); })
  );

  // subtle reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = "none"; io.unobserve(en.target); } }), { threshold: 0.12 });
    $$(".fcard, .flow__steps li").forEach((n) => { n.style.opacity = 0; n.style.transform = "translateY(16px)"; n.style.transition = "opacity .5s ease, transform .5s ease"; io.observe(n); });
  }

  /* ---------- tiny confetti ---------- */
  window.confettiBurst = function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999"; document.body.appendChild(c);
    const x = c.getContext("2d"); let W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ["#1a8245", "#7ee2a4", "#1e3f64", "#c8a04a", "#ffffff"];
    const P = Array.from({ length: 120 }, () => ({ x: W / 2, y: H * 0.3, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 3, g: 0.3 + Math.random() * 0.2, s: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 }));
    let t = 0;
    (function loop() {
      x.clearRect(0, 0, W, H); t++;
      P.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); });
      if (t < 140) requestAnimationFrame(loop); else c.remove();
    })();
  };
})();
