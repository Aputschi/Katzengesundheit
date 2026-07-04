/* app.js
 * UI-Steuerung, Routing und Rendering der Katzengesundheits-App.
 * Reines Vanilla-JS, keine Abhängigkeiten.
 */
(function () {
  "use strict";

  var main = document.getElementById("main");
  var modalRoot = document.getElementById("modal-root");
  var toastRoot = document.getElementById("toast-root");
  var state = { view: "cats", catId: null, lastFoodResult: null };

  /* ============== Helfer ============== */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function toast(msg) {
    toastRoot.innerHTML = '<div class="toast">' + esc(msg) + "</div>";
    setTimeout(function () { toastRoot.innerHTML = ""; }, 2400);
  }
  function breedName(id) { var b = window.Recommend.findBreed(id); return b ? b.name : "Unbekannt"; }
  function breedEmoji(id) { var b = window.Recommend.findBreed(id); return b ? b.emoji : "🐾"; }
  function ageLabel(y) {
    if (y == null) return "–";
    if (y < 1) return Math.round(y * 12) + " Mon.";
    return (Math.round(y * 10) / 10) + " J.";
  }

  /* ============== Routing ============== */
  function go(view, catId) {
    state.view = view;
    if (catId !== undefined) state.catId = catId;
    document.querySelectorAll(".nav-item").forEach(function (n) {
      n.classList.toggle("active", n.getAttribute("data-view") === view);
    });
    render();
    main.scrollTop = 0; window.scrollTo(0, 0);
  }

  function render() {
    switch (state.view) {
      case "cats": return renderCats();
      case "cat": return renderCatDetail(state.catId);
      case "food": return renderFood();
      case "nutrients": return renderNutrients();
      case "diseases": return renderDiseases();
      case "data": return renderData();
      case "about": return renderAbout();
      default: return renderCats();
    }
  }

  /* ============== Ansicht: Katzen-Übersicht ============== */
  function renderCats() {
    var cats = window.Store.getCats();
    var html = '<div class="page-head row-between"><div>' +
      "<h2>Meine Katzen</h2>" +
      "<p>Lege für jede Katze ein Profil an und erhalte individuelle, wissenschaftlich orientierte Empfehlungen für ein langes, gesundes Leben.</p>" +
      '</div></div>';

    if (cats.length === 0) {
      html += '<div class="empty"><div class="e-ico">🐈</div><h3>Noch keine Katze angelegt</h3>' +
        "<p>Erstelle dein erstes Katzenprofil, um Bedarf, Idealgewicht und Empfehlungen zu sehen.</p>" +
        '<button class="btn btn-primary mt-16" id="add-first">＋ Erste Katze anlegen</button></div>';
      main.innerHTML = html;
      document.getElementById("add-first").onclick = function () { openCatModal(null); };
      return;
    }

    html += '<div class="cat-grid">';
    cats.forEach(function (c) {
      var e = window.Calc.energy(c);
      var bl = window.Calc.bcsLabel(c.bcs || 5);
      html += '<div class="cat-card" data-id="' + esc(c.id) + '">' +
        '<div class="avatar">' + breedEmoji(c.breedId) + "</div>" +
        "<h3>" + esc(c.name) + "</h3>" +
        '<div class="meta">' + esc(breedName(c.breedId)) + " · " + ageLabel(c.ageYears) + " · " + esc(c.weightKg) + " kg</div>" +
        '<div class="tags">' +
          '<span class="tag ' + bl.cls + '">' + bl.txt + "</span>" +
          '<span class="tag accent">' + e.stage.emoji + " " + e.stage.label + "</span>" +
          '<span class="tag">' + (c.housing === "indoor" ? "🏠 Wohnung" : "🌳 Freigang") + "</span>" +
        "</div></div>";
    });
    html += '<button class="cat-card add-card" id="add-cat"><span class="plus">＋</span><span>Katze hinzufügen</span></button>';
    html += "</div>";
    main.innerHTML = html;

    document.querySelectorAll(".cat-card[data-id]").forEach(function (card) {
      card.onclick = function () { go("cat", card.getAttribute("data-id")); };
    });
    document.getElementById("add-cat").onclick = function () { openCatModal(null); };
  }

  /* ============== Ansicht: Katzen-Detail (Analyse) ============== */
  function renderCatDetail(id) {
    var cat = window.Store.getCat(id);
    if (!cat) { go("cats"); return; }
    var r = window.Recommend.forCat(cat);
    var e = r.energy;
    var bl = window.Calc.bcsLabel(e.bcs);
    var breed = window.Recommend.findBreed(cat.breedId);

    var html = '<div class="page-head"><button class="btn btn-ghost btn-sm mb-16" id="back">← Zurück</button>' +
      '<div class="row-between"><div><h2>' + breedEmoji(cat.breedId) + " " + esc(cat.name) + "</h2>" +
      '<p>' + esc(breedName(cat.breedId)) + " · " + ageLabel(cat.ageYears) + " · " + esc(cat.weightKg) + " kg · " +
      (cat.neutered ? "kastriert" : "unkastriert") + " · " + (cat.housing === "indoor" ? "Wohnungshaltung" : "Freigänger") + "</p></div>" +
      '<div class="pill-row"><button class="btn btn-sm" id="edit-cat">✏️ Bearbeiten</button>' +
      '<button class="btn btn-sm btn-danger" id="del-cat">🗑️ Löschen</button></div></div></div>';

    // Kennzahlen
    html += '<div class="grid grid-3">' +
      metric("Energiebedarf", e.kcalPerDay + ' <small>kcal/Tag</small>', "Ruhebedarf " + e.rer + " kcal × Faktor " + e.factor) +
      metric("Idealgewicht", e.idealWeight + ' <small>kg</small>', e.goal === "loss" ? "aktuell darüber" : (e.goal === "gain" ? "aktuell darunter" : "aktuell im Ziel")) +
      metric("Wasserbedarf", window.Calc.waterMl(e.idealWeight) + ' <small>ml/Tag</small>', "gesamt (Futter + Trinken)") +
      "</div>";

    // BCS-Skala
    html += '<div class="card mt-16"><div class="card-title">Body Condition Score (WSAVA, 9-Punkte)</div>' +
      '<div class="row-between"><div><span class="tag ' + bl.cls + '">' + bl.txt + "</span> " +
      '<span class="muted small">aktuell ' + e.bcs + "/9 · Ziel 4–5/9</span></div></div>" +
      '<div class="bcs-scale">';
    for (var i = 1; i <= 9; i++) {
      var active = i === e.bcs;
      var color = i <= 3 ? "var(--danger)" : (i <= 5 ? "var(--ok)" : (i <= 6 ? "var(--warn)" : "var(--danger)"));
      html += '<div class="bcs-scale-pt seg-pt' + (active ? " active" : "") + '"' +
        (active ? ' style="background:' + color + '"' : "") + ">" + i + "</div>";
    }
    html += '</div><p class="small muted mt-8">Faustregel: Rippen leicht tastbar (nicht sichtbar), von oben erkennbare Taille, von der Seite leicht hochgezogene Bauchlinie.</p></div>';

    // Gewichtsverlauf
    html += weightCardHtml(cat, e);

    // Lebensphase
    html += '<div class="banner info mt-16"><span class="b-ico">' + e.stage.emoji + '</span><div><strong>Lebensphase: ' +
      e.stage.label + "</strong> – " + e.stage.note + "</div></div>";

    // Pflegeplan & Tagesaufgaben
    html += carePlanHtml(cat);

    // Empfehlungen
    html += recSection("🥩 Ernährung", r.recs.ernaehrung);
    html += recSection("🏃 Bewegung", r.recs.bewegung);
    html += recSection("🧠 Aufmerksamkeit & Beschäftigung", r.recs.aufmerksamkeit);
    html += recSection("🩺 Vorsorge & Gesundheit", r.recs.vorsorge);

    // Rasserisiken
    if (breed) {
      html += '<div class="card mt-16"><div class="card-title">Rasseprofil: ' + esc(breed.name) + '</div>' +
        '<p class="muted small mb-8">Typische Lebenserwartung: <strong>' + breed.lifespan[0] + "–" + breed.lifespan[1] +
        " Jahre</strong>. " + esc(breed.traits) + "</p>" +
        '<div class="risk-tags pill-row">';
      (breed.risks || []).forEach(function (rk) { html += '<span class="tag warn">' + esc(rk) + "</span>"; });
      html += "</div></div>";
    }

    // Futter-Verknüpfung
    var foodInfo = cat.mainFood && cat.mainFood.kcalPerKg
      ? "Hauptfutter: <strong>" + esc(cat.mainFood.name) + "</strong> (" + cat.mainFood.kcalPerKg + " kcal/kg). Im Pflegeplan wird die Tagesmenge berechnet."
      : "Analysiere ein Futter und speichere es als Hauptfutter, um genaue Fütterungsmengen im Pflegeplan zu sehen.";
    html += '<div class="card mt-16"><div class="row-between"><div><div class="card-title" style="margin-bottom:4px">Futter prüfen</div>' +
      '<p class="muted small">' + foodInfo + '</p></div>' +
      '<button class="btn btn-primary" id="to-food">🥫 Zur Futter-Analyse</button></div></div>';

    html += disclaimer();
    main.innerHTML = html;

    document.getElementById("back").onclick = function () { go("cats"); };
    document.getElementById("edit-cat").onclick = function () { openCatModal(cat); };
    document.getElementById("to-food").onclick = function () {
      state.preselectKcal = e.kcalPerDay; state.preselectCat = { id: cat.id, name: cat.name }; go("food");
    };
    wireCarePlan(cat);
    var aw = document.getElementById("add-weight");
    if (aw) aw.onclick = function () { openWeightModal(cat); };
    document.getElementById("del-cat").onclick = function () {
      confirmModal("Katze löschen?", "Profil von „" + esc(cat.name) + "“ wirklich endgültig löschen?", function () {
        window.Store.deleteCat(cat.id); toast("Katze gelöscht"); go("cats");
      });
    };
  }

  function metric(label, value, note) {
    return '<div class="metric"><div class="label">' + esc(label) + '</div><div class="value">' + value +
      '</div><div class="note">' + esc(note) + "</div></div>";
  }
  function recSection(title, list) {
    if (!list || !list.length) return "";
    var h = '<div class="section-label">' + title + '</div><div class="rec-list">';
    list.forEach(function (r) {
      h += '<div class="rec ' + r.type + '"><span class="r-ico">' + r.ico + "</span><div><h4>" +
        esc(r.title) + "</h4><p>" + esc(r.text) + "</p></div></div>";
    });
    return h + "</div>";
  }

  /* ---------- Pflegeplan: zeitbasierter Tagesablauf ---------- */
  function carePlanHtml(cat) {
    var cp = window.CarePlan.forCat(cat);
    var done = window.Store.getRoutineDone(cat.id);
    var dailyIds = cp.schedule.map(function (t) { return t.id; }).concat(cp.untimed.map(function (t) { return t.id; }));
    var dailyDone = dailyIds.filter(function (id) { return done.indexOf(id) >= 0; }).length;
    var pct = dailyIds.length ? Math.round((dailyDone / dailyIds.length) * 100) : 0;

    var h = '<div class="section-label">🗓️ Heute – Tagesablauf</div><div class="card">';
    h += '<div class="row-between mb-8"><div><strong style="font-size:16px">Tages-Checkliste</strong> ' +
      '<span class="muted small">– setzt sich über Nacht zurück</span></div>' +
      '<div class="pill-row"><button class="btn btn-sm" id="cp-edit-times">🕑 Fütterungszeiten</button>' +
      '<span class="tag teal" id="cp-count" style="align-self:center">' + dailyDone + "/" + dailyIds.length + "</span></div></div>";
    h += '<div class="progress-ring mb-16"><div class="progress-track"><span id="cp-bar" style="width:' + pct + '%"></span></div></div>';

    // Timeline
    h += '<div class="checklist">';
    cp.schedule.forEach(function (t) {
      var isDone = done.indexOf(t.id) >= 0;
      h += '<div class="check-item' + (isDone ? " done" : "") + '" data-task="' + t.id + '">' +
        '<div class="check-box">✓</div>' +
        '<div class="ci-time">' + esc(t.time) + "</div>" +
        '<div style="flex:1"><div class="ci-title">' + t.ico + " " + esc(t.title) + '</div>' +
        '<div class="ci-sub">' + esc(t.sub) + "</div></div></div>";
    });
    h += "</div>";

    // Untimed (über den Tag)
    if (cp.untimed.length) {
      h += '<div class="task-group"><div class="task-group-head"><span class="tg-ico">🔁</span><h4>Über den Tag</h4></div><div class="checklist">';
      cp.untimed.forEach(function (t) {
        var isDone = done.indexOf(t.id) >= 0;
        h += '<div class="check-item' + (isDone ? " done" : "") + '" data-task="' + t.id + '">' +
          '<div class="check-box">✓</div>' +
          '<div style="flex:1"><div class="ci-title">' + t.ico + " " + esc(t.title) + '</div>' +
          '<div class="ci-sub">' + esc(t.sub) + "</div></div>" +
          '<span class="ci-freq">' + esc(t.freq) + "</span></div>";
      });
      h += "</div></div>";
    }

    // Referenz-Routinen (nicht abhakbar)
    cp.groups.forEach(function (g) {
      if (!g.tasks.length) return;
      h += '<div class="task-group"><div class="task-group-head"><span class="tg-ico">' + g.icon + "</span><h4>" +
        esc(g.label) + '</h4><span class="tg-badge">Routine</span></div><div class="checklist">';
      g.tasks.forEach(function (t) {
        h += '<div class="check-item" style="cursor:default">' +
          '<div style="flex:1"><div class="ci-title">' + t.ico + " " + esc(t.title) + '</div>' +
          '<div class="ci-sub">' + esc(t.sub) + "</div></div>" +
          '<span class="ci-freq">' + esc(t.freq) + "</span></div>";
      });
      h += "</div></div>";
    });

    h += "</div>";
    return h;
  }

  function wireCarePlan(cat) {
    document.querySelectorAll(".check-item[data-task]").forEach(function (item) {
      item.onclick = function () {
        window.Store.toggleRoutine(cat.id, item.getAttribute("data-task"));
        item.classList.toggle("done");
        var items = document.querySelectorAll(".check-item[data-task]");
        var total = items.length, dc = 0;
        items.forEach(function (x) { if (x.classList.contains("done")) dc++; });
        var cnt = document.getElementById("cp-count"); if (cnt) cnt.textContent = dc + "/" + total;
        var bar = document.getElementById("cp-bar"); if (bar) bar.style.width = (total ? Math.round((dc / total) * 100) : 0) + "%";
      };
    });
    var et = document.getElementById("cp-edit-times");
    if (et) et.onclick = function () { openFeedingTimesModal(cat); };
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function openFeedingTimesModal(cat) {
    var cp = window.CarePlan.forCat(cat);
    var cur = cp.feedingTimes.join(", ");
    var body = field("Fütterungszeiten (Uhrzeiten, mit Komma getrennt)",
      '<input id="ft-input" value="' + esc(cur) + '" placeholder="z. B. 07:00, 13:00, 19:00" />') +
      '<p class="small faint mt-8">Mehr kleine Mahlzeiten zu festen Zeiten entsprechen dem natürlichen Fressverhalten und helfen beim Gewicht. Leer lassen = automatisch verteilen.</p>';
    showModal("Fütterungszeiten anpassen", body, [
      { label: "Automatisch", cls: "btn", action: function () { cat.feedingTimes = null; window.Store.upsertCat(cat); closeModal(); toast("Auf automatische Zeiten zurückgesetzt"); go("cat", cat.id); } },
      { label: "Speichern", cls: "btn btn-primary", action: function () {
        var raw = document.getElementById("ft-input").value;
        var m = raw.match(/\d{1,2}:\d{2}/g) || [];
        var times = m.map(function (t) { var p = t.split(":"); return pad2(Math.min(23, +p[0])) + ":" + pad2(Math.min(59, +p[1])); });
        if (!times.length) { toast("Bitte gültige Uhrzeiten eingeben (HH:MM)"); return; }
        cat.feedingTimes = times; window.Store.upsertCat(cat); closeModal(); toast("Fütterungszeiten gespeichert"); go("cat", cat.id);
      } },
    ]);
  }

  /* ---------- Gewichtsverlauf ---------- */
  function weightCardHtml(cat, e) {
    var log = (cat.weightLog || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var h = '<div class="card mt-16"><div class="row-between"><div class="card-title" style="margin-bottom:2px">📈 Gewichtsverlauf</div>' +
      '<button class="btn btn-sm btn-teal" id="add-weight">＋ Gewicht eintragen</button></div>';

    var trend = "Startwert";
    if (log.length >= 2) {
      var d = Math.round((log[log.length - 1].kg - log[log.length - 2].kg) * 100) / 100;
      trend = (d > 0 ? "▲ +" + d : (d < 0 ? "▼ " + d : "±0")) + " kg seit letztem Eintrag";
    }
    var diff = Math.round((cat.weightKg - e.idealWeight) * 100) / 100;
    var diffTxt = diff === 0 ? "genau im Ziel" : (diff > 0 ? "+" + diff + " kg über Ideal" : diff + " kg unter Ideal");

    h += '<div class="grid grid-3 mt-8">' +
      metric("Aktuell", cat.weightKg + ' <small>kg</small>', trend) +
      metric("Idealgewicht", e.idealWeight + ' <small>kg</small>', diffTxt) +
      metric("Einträge", String(log.length), "im Verlauf") +
      "</div>";

    if (log.length >= 2) {
      h += '<div class="mt-16">' + weightChartSvg(log, e.idealWeight) + "</div>";
      h += '<p class="small faint mt-8">Punkte = gemessenes Gewicht · gestrichelte Linie = Idealgewicht.</p>';
    } else {
      h += '<p class="small faint mt-16">Trage regelmäßig das Gewicht ein (z. B. monatlich). Gewichtskontrolle ist der wichtigste Hebel für ein langes, gesundes Katzenleben.</p>';
    }
    return h + "</div>";
  }

  function weightChartSvg(log, ideal) {
    var W = 340, H = 110, pad = 14;
    var vals = log.map(function (p) { return p.kg; }).concat([ideal]);
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (max - min < 0.4) { max += 0.2; min -= 0.2; }
    function x(i) { return pad + (log.length <= 1 ? 0 : (i / (log.length - 1)) * (W - 2 * pad)); }
    function y(v) { return pad + (1 - (v - min) / (max - min)) * (H - 2 * pad); }
    var iy = y(ideal);
    var line = log.map(function (p, i) { return x(i) + "," + y(p.kg); }).join(" ");
    var dots = log.map(function (p, i) { return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.kg).toFixed(1) + '" r="3.5" fill="#ff7a59"/>'; }).join("");
    var lastLabel = '<text x="' + (W - pad) + '" y="' + (iy - 4) + '" text-anchor="end" font-size="10" fill="#18a999">Ideal ' + ideal + ' kg</text>';
    return '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" style="max-width:420px;overflow:visible">' +
      '<line x1="' + pad + '" y1="' + iy.toFixed(1) + '" x2="' + (W - pad) + '" y2="' + iy.toFixed(1) + '" stroke="#18a999" stroke-width="1.5" stroke-dasharray="5 4"/>' +
      lastLabel +
      '<polyline points="' + line + '" fill="none" stroke="#ff7a59" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      dots + "</svg>";
  }

  function openWeightModal(cat) {
    var today = new Date().toISOString().slice(0, 10);
    var body = '<div class="form-grid">' +
      field("Gewicht (kg)", '<input id="w-kg" type="number" step="0.05" min="0.2" max="15" value="' + esc(cat.weightKg) + '" />') +
      field("Datum", '<input id="w-date" type="date" value="' + today + '" />') +
      "</div><p class=\"small faint mt-8\">Der jüngste Eintrag wird als aktuelles Gewicht übernommen. Ein bereits vorhandener Eintrag am selben Datum wird ersetzt.</p>";
    showModal("Gewicht eintragen", body, [
      { label: "Abbrechen", cls: "btn", action: closeModal },
      { label: "Speichern", cls: "btn btn-primary", action: function () {
        var kg = window.Calc.num(document.getElementById("w-kg").value);
        var date = document.getElementById("w-date").value || today;
        if (kg <= 0) { toast("Bitte ein gültiges Gewicht eingeben"); return; }
        if (!cat.weightLog) cat.weightLog = [];
        cat.weightLog = cat.weightLog.filter(function (p) { return p.date !== date; });
        cat.weightLog.push({ date: date, kg: kg });
        cat.weightLog.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
        cat.weightKg = cat.weightLog[cat.weightLog.length - 1].kg;
        window.Store.upsertCat(cat);
        closeModal(); toast("Gewicht gespeichert"); go("cat", cat.id);
      } },
    ]);
  }

  /* ============== Katze anlegen/bearbeiten (Modal) ============== */
  function openCatModal(cat) {
    var isEdit = !!cat;
    cat = cat || { housing: "indoor", neutered: true, activity: "normal", bcs: 5, ageYears: 3, weightKg: 4.0 };
    var breedOpts = (window.BREEDS || []).map(function (b) {
      return '<option value="' + b.id + '"' + (b.id === cat.breedId ? " selected" : "") + ">" + esc(b.name) + "</option>";
    }).join("");

    var body =
      '<div class="form-grid">' +
        field("Name", '<input id="f-name" value="' + esc(cat.name || "") + '" placeholder="z. B. Minka" />') +
        field("Rasse", '<select id="f-breed">' + breedOpts + "</select>") +
        field("Alter (Jahre)", '<input id="f-age" type="number" step="0.1" min="0" max="30" value="' + esc(cat.ageYears) + '" /><span class="hint">Dezimal möglich, z. B. 0.5 = 6 Monate</span>') +
        field("Gewicht (kg)", '<input id="f-weight" type="number" step="0.1" min="0.2" max="15" value="' + esc(cat.weightKg) + '" />') +
      "</div>" +
      '<div class="section-label" style="margin-top:18px">Haltung</div>' +
      '<div class="seg" id="f-housing">' +
        '<button type="button" data-v="indoor" class="' + (cat.housing === "indoor" ? "on" : "") + '">🏠 Wohnungshaltung</button>' +
        '<button type="button" data-v="outdoor" class="' + (cat.housing === "outdoor" ? "on" : "") + '">🌳 Freigänger</button>' +
      "</div>" +
      '<div class="form-grid" style="margin-top:16px">' +
        field("Kastriert?", segHtml("f-neutered", [["true", "Ja", cat.neutered], ["false", "Nein", !cat.neutered]])) +
        field("Aktivität", segHtml("f-activity", [["low", "Niedrig", cat.activity === "low"], ["normal", "Normal", cat.activity === "normal" || !cat.activity], ["high", "Hoch", cat.activity === "high"]])) +
      "</div>" +
      '<div class="section-label" style="margin-top:18px">Body Condition Score (Figur)</div>' +
      '<input id="f-bcs" type="range" min="1" max="9" step="1" value="' + (cat.bcs || 5) + '" />' +
      '<div class="row-between small"><span class="muted">1 – ausgemergelt</span><span id="bcs-out" class="tag"></span><span class="muted">9 – stark adipös</span></div>' +
      '<p class="small faint mt-8">Tipp: Rippen leicht tastbar und Taille sichtbar ≈ 5 (ideal). Polster über den Rippen und keine Taille ≈ 7–8.</p>';

    showModal((isEdit ? "Katze bearbeiten" : "Neue Katze"), body,
      [{ label: "Abbrechen", cls: "btn", action: closeModal },
       { label: isEdit ? "Speichern" : "Anlegen", cls: "btn btn-primary", action: function () { saveCatFromModal(cat); } }]);

    // Segment-Toggles aktivieren
    wireSeg("f-housing"); wireSeg("f-neutered"); wireSeg("f-activity");
    var bcs = document.getElementById("f-bcs"), out = document.getElementById("bcs-out");
    function upd() { var v = +bcs.value; var l = window.Calc.bcsLabel(v); out.textContent = v + "/9 · " + l.txt; out.className = "tag " + l.cls; }
    bcs.oninput = upd; upd();
  }

  function field(label, inner) { return '<div class="field"><label>' + esc(label) + "</label>" + inner + "</div>"; }
  function segHtml(id, opts) {
    return '<div class="seg" id="' + id + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" class="' + (o[2] ? "on" : "") + '">' + esc(o[1]) + "</button>";
    }).join("") + "</div>";
  }
  function wireSeg(id) {
    var seg = document.getElementById(id);
    if (!seg) return;
    seg.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () {
        seg.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
      };
    });
  }
  function segValue(id) {
    var on = document.querySelector("#" + id + " button.on");
    return on ? on.getAttribute("data-v") : null;
  }

  function saveCatFromModal(orig) {
    var name = document.getElementById("f-name").value.trim();
    if (!name) { toast("Bitte einen Namen eingeben"); return; }
    var weightKg = window.Calc.num(document.getElementById("f-weight").value);
    if (weightKg <= 0) { toast("Bitte ein gültiges Gewicht eingeben"); return; }
    var cat = {
      id: orig.id,
      createdAt: orig.createdAt,
      name: name,
      breedId: document.getElementById("f-breed").value,
      ageYears: window.Calc.num(document.getElementById("f-age").value),
      weightKg: weightKg,
      housing: segValue("f-housing") || "indoor",
      neutered: segValue("f-neutered") === "true",
      activity: segValue("f-activity") || "normal",
      bcs: +document.getElementById("f-bcs").value,
      // Zusatzdaten beim Bearbeiten erhalten
      mainFood: orig.mainFood || null,
      feedingTimes: orig.feedingTimes || null,
      weightLog: orig.weightLog || null,
    };
    var today = new Date().toISOString().slice(0, 10);
    if (!cat.weightLog || !cat.weightLog.length) cat.weightLog = [{ date: today, kg: weightKg }];
    var saved = window.Store.upsertCat(cat);
    closeModal();
    toast(orig.id ? "Gespeichert" : "Katze angelegt");
    go("cat", saved.id);
  }

  /* ============== Ansicht: Futter-Analyse ============== */
  function renderFood() {
    var saved = window.Store.getFoods();
    var html = '<div class="page-head"><h2>Futter-Analyse</h2>' +
      "<p>Wähle ein Futter aus der Datenbank oder gib die Werte vom Etikett selbst ein (Rubrik &raquo;analytische Bestandteile&laquo;). Die App rechnet auf Trockenmasse um, schätzt den Energiegehalt und prüft die Nährstoffrelationen.</p></div>";

    // Marken-Auswahl
    html += '<div class="card"><div class="card-title">🔎 Futter aus Datenbank wählen</div>' +
      '<div class="food-search-wrap">' +
      '<input id="food-search" placeholder="Marke oder Produkt suchen … z. B. Whiskas, Royal Canin, getreidefrei" autocomplete="off" />' +
      '<div class="picker-results" id="picker-results"></div></div>' +
      '<p class="small faint mt-8">' + (window.FOODS_DB ? window.FOODS_DB.length : 0) +
      " Produktlinien hinterlegt. Werte sind <strong>Richtwerte</strong> – nach Auswahl bitte mit deiner Packung abgleichen und ggf. anpassen.</p></div>";

    html += '<div class="card"><div class="card-title">Analysewerte (Angaben in %) – auswählen oder selbst eintragen</div>' +
      '<div class="form-grid">' +
        field("Rohprotein", '<input id="a-protein" type="number" step="0.1" min="0" placeholder="z. B. 10" />') +
        field("Rohfett / Fettgehalt", '<input id="a-fat" type="number" step="0.1" min="0" placeholder="z. B. 6" />') +
        field("Rohfaser", '<input id="a-fiber" type="number" step="0.1" min="0" placeholder="z. B. 0.5" />') +
        field("Rohasche", '<input id="a-ash" type="number" step="0.1" min="0" placeholder="z. B. 2" />') +
        field("Feuchtigkeit", '<input id="a-moisture" type="number" step="0.1" min="0" max="95" placeholder="Nass ~80, Trocken ~8" />') +
        field("Name (optional)", '<input id="a-name" placeholder="z. B. Marke XY Huhn" />') +
      "</div>" +
      '<div class="banner info mt-16"><span class="b-ico">💡</span><div>Feuchtigkeit fehlt manchmal auf dem Etikett. Richtwerte: Nassfutter ~78–82 %, Trockenfutter ~6–10 %. Ohne Feuchtigkeit lässt sich nicht auf Trockenmasse umrechnen.</div></div>' +
      '<div class="pill-row mt-16"><button class="btn btn-primary" id="analyze">🔬 Analysieren</button>' +
      (state.preselectKcal ? '<span class="tag accent" style="align-self:center">Bedarf der gewählten Katze: ' + state.preselectKcal + " kcal/Tag</span>" : "") +
      "</div></div>";

    html += '<div id="food-result"></div>';

    if (saved.length) {
      html += '<div class="section-label">Gespeicherte Futter</div><div class="grid grid-2" id="saved-foods">';
      saved.forEach(function (f) {
        html += '<div class="card"><div class="row-between"><div><strong>' + esc(f.name || "Unbenannt") + "</strong>" +
          '<div class="muted small">' + f.result.type + " · " + f.result.kcalPerKg + " kcal/kg · " + f.result.dryMatter.protein + "% Protein (TM)</div></div>" +
          '<div class="pill-row"><button class="btn btn-sm" data-load="' + f.id + '">Laden</button>' +
          '<button class="btn btn-sm btn-danger" data-delf="' + f.id + '">✕</button></div></div></div>';
      });
      html += "</div>";
    }

    html += disclaimer();
    main.innerHTML = html;

    document.getElementById("analyze").onclick = doAnalyze;
    document.querySelectorAll("[data-load]").forEach(function (b) {
      b.onclick = function () { loadFood(b.getAttribute("data-load")); };
    });
    document.querySelectorAll("[data-delf]").forEach(function (b) {
      b.onclick = function () { window.Store.deleteFood(b.getAttribute("data-delf")); toast("Gelöscht"); renderFood(); };
    });

    // Marken-Datenbank: Suche
    var searchEl = document.getElementById("food-search");
    function drawPicker() {
      var q = (searchEl.value || "").toLowerCase().trim();
      var db = window.FOODS_DB || [];
      var matches = [];
      for (var i = 0; i < db.length; i++) {
        var f = db[i];
        var hay = (f.brand + " " + f.line + " " + (f.tags || []).join(" ") + " " + f.type + " " + f.stage).toLowerCase();
        if (!q || hay.indexOf(q) >= 0) matches.push({ i: i, f: f });
      }
      var box = document.getElementById("picker-results");
      if (!matches.length) { box.innerHTML = '<div class="picker-item"><span class="pi-sub">Kein Treffer – bitte Werte unten selbst eintragen.</span></div>'; return; }
      box.innerHTML = matches.slice(0, 50).map(function (m) {
        var f = m.f, typeTag = f.type === "nass" ? "🥫 Nass" : "🥠 Trocken";
        return '<div class="picker-item" data-foodidx="' + m.i + '"><div><div class="pi-name">' +
          esc(f.brand) + " · " + esc(f.line) + '</div><div class="pi-sub">' + typeTag + " · " + esc(stageLabel(f.stage)) +
          (f.tags && f.tags.length ? " · " + esc(f.tags.join(", ")) : "") + "</div></div>" +
          '<div class="pi-vals">' + f.protein + "% P · " + f.fat + "% F · " + f.moisture + "% H₂O</div></div>";
      }).join("");
      box.querySelectorAll("[data-foodidx]").forEach(function (it) {
        it.onclick = function () { pickFood(+it.getAttribute("data-foodidx")); };
      });
    }
    searchEl.oninput = drawPicker;
    drawPicker();
  }

  function stageLabel(s) {
    return { kitten: "Kitten", adult: "Erwachsen", senior: "Senior", all: "Alle Phasen" }[s] || s;
  }

  function pickFood(idx) {
    var f = window.FOODS_DB[idx]; if (!f) return;
    document.getElementById("a-name").value = f.brand + " " + f.line;
    document.getElementById("a-protein").value = f.protein;
    document.getElementById("a-fat").value = f.fat;
    document.getElementById("a-fiber").value = f.fiber;
    document.getElementById("a-ash").value = f.ash;
    document.getElementById("a-moisture").value = f.moisture;
    doAnalyze();
    toast(f.note ? f.note : "Übernommen: " + f.brand + " – Richtwerte, mit Packung abgleichen");
  }

  function readFoodInputs() {
    return {
      name: document.getElementById("a-name").value.trim(),
      protein: document.getElementById("a-protein").value,
      fat: document.getElementById("a-fat").value,
      fiber: document.getElementById("a-fiber").value,
      ash: document.getElementById("a-ash").value,
      moisture: document.getElementById("a-moisture").value,
    };
  }

  function doAnalyze() {
    var input = readFoodInputs();
    if (!input.protein && !input.fat) { toast("Bitte zumindest Protein und Fett eingeben"); return; }
    var a = window.Calc.analyzeFood(input);
    var checks = window.Calc.evaluateFood(a);
    state.lastFoodResult = { input: input, result: a };

    var html = '<div class="card mt-16"><div class="row-between"><div class="card-title">Ergebnis' +
      (input.name ? ": " + esc(input.name) : "") + '</div>' +
      '<div class="pill-row">' +
      (state.preselectCat ? '<button class="btn btn-sm btn-teal" id="set-mainfood">⭐ Hauptfutter für ' + esc(state.preselectCat.name) + "</button>" : "") +
      '<button class="btn btn-sm" id="save-food">💾 Futter speichern</button></div></div>';

    html += '<div class="grid grid-3 mb-16">' +
      metric("Futtertyp", a.type, a.moisture + " % Feuchtigkeit") +
      metric("Energiedichte", a.kcalPerKg + ' <small>kcal/kg</small>', a.kcalPer100g + " kcal je 100 g") +
      metric("Trockenmasse", a.dm + ' <small>%</small>', "Basis für Nährstoffvergleich") +
      "</div>";

    // Fütterungsmenge falls Katzenbedarf bekannt
    if (state.preselectKcal) {
      var grams = window.Calc.feedingAmount(state.preselectKcal, a.kcalPerKg);
      var mealsTxt = "";
      if (state.preselectCat) {
        var pcat = window.Store.getCat(state.preselectCat.id);
        if (pcat) {
          var meals = window.CarePlan.mealsPerDay(window.Calc.lifeStage(pcat.ageYears));
          mealsTxt = " Aufgeteilt auf " + meals + " Mahlzeiten sind das ca. <strong>" + Math.round(grams / meals) + " g</strong> pro Mahlzeit.";
        }
      }
      html += '<div class="banner info mb-16"><span class="b-ico">⚖️</span><div>Für den Bedarf der gewählten Katze (' +
        state.preselectKcal + " kcal/Tag) wären rechnerisch ca. <strong>" + grams + " g</strong> dieses Futters pro Tag nötig." +
        mealsTxt + " Herstellerangaben und das Körpergewicht im Blick behalten.</div></div>";
    }

    html += '<div class="card-title">Nährstoffe auf Trockenmasse-Basis</div>';
    checks.forEach(function (c) {
      var barCls = c.status === "ok" ? "bar-ok" : (c.status === "warn" ? "bar-warn" : "bar-danger");
      var pctFill = Math.min(100, Math.round((c.value / (c.good * 1.6 || 1)) * 100));
      html += '<div class="nutrient-row"><div><div class="n-name">' + esc(c.name) +
        ' <span class="tag ' + (c.status === "ok" ? "ok" : c.status) + '">' + c.msg + "</span></div>" +
        '<div class="n-sub">' + esc(c.hint) + "</div></div>" +
        '<div class="n-val">' + c.value + " " + c.unit + "</div>" +
        '<div class="n-bar bar ' + barCls + '"><span style="width:' + pctFill + '%"></span></div></div>';
    });

    html += '<div class="banner warn mt-16"><span class="b-ico">⚠️</span><div>Diese Analyse prüft nur Mengenrelationen aus den Pflichtangaben. ' +
      "<strong>Mikronährstoffe wie Taurin, Vitamine und Spurenelemente stehen selten auf dem Etikett.</strong> " +
      "Die eigentliche Absicherung ist die Deklaration als <em>Alleinfuttermittel</em> (vollwertig nach FEDIAF/AAFCO). Ergänzungsfutter allein deckt den Bedarf NICHT.</div></div>";

    html += "</div>";
    document.getElementById("food-result").innerHTML = html;
    document.getElementById("food-result").scrollIntoView({ behavior: "smooth", block: "nearest" });

    var sf = document.getElementById("save-food");
    if (sf) sf.onclick = function () {
      var f = { name: input.name || (a.type + " " + a.kcalPerKg + " kcal/kg"), input: input, result: a };
      window.Store.saveFood(f); toast("Futter gespeichert"); renderFood();
    };
    var smf = document.getElementById("set-mainfood");
    if (smf) smf.onclick = function () {
      var cat = window.Store.getCat(state.preselectCat.id);
      if (!cat) { toast("Katze nicht gefunden"); return; }
      cat.mainFood = { name: input.name || a.type, kcalPerKg: a.kcalPerKg };
      window.Store.upsertCat(cat);
      toast("⭐ Hauptfutter für " + cat.name + " gespeichert – erscheint jetzt im Pflegeplan");
    };
  }

  function loadFood(id) {
    var f = window.Store.getFoods().filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    document.getElementById("a-name").value = f.input.name || "";
    document.getElementById("a-protein").value = f.input.protein || "";
    document.getElementById("a-fat").value = f.input.fat || "";
    document.getElementById("a-fiber").value = f.input.fiber || "";
    document.getElementById("a-ash").value = f.input.ash || "";
    document.getElementById("a-moisture").value = f.input.moisture || "";
    doAnalyze();
  }

  /* ============== Ansicht: Nährstoff-Wissen ============== */
  function renderNutrients() {
    var html = '<div class="page-head"><h2>Nährstoff-Wissen</h2>' +
      "<p>Die wichtigsten Nährstoffe für Katzen – mit Fokus auf katzenspezifische Besonderheiten (z. B. Taurin, Vitamin A, Arachidonsäure). Orientierungswerte nach FEDIAF/NRC für die ausgewachsene Katze.</p></div>";

    html += '<div class="banner info mb-16"><span class="b-ico">🧬</span><div>Katzen sind <strong>obligate Karnivoren</strong>: Sie benötigen mehrere Nährstoffe zwingend aus tierischen Quellen, weil ihr Stoffwechsel sie nicht selbst herstellen kann.</div></div>';

    (window.NUTRIENTS || []).forEach(function (n) {
      html += '<div class="kb-item"><div class="kb-head" data-kb="' + n.id + '">' +
        '<span class="k-ico">' + n.icon + '</span><span class="k-title">' + esc(n.name) +
        (n.essential ? ' <span class="tag accent" style="font-size:10px">essenziell</span>' : "") + "</span>" +
        '<span class="muted small">' + esc(n.group) + '</span><span class="chevron">▸</span></div>' +
        '<div class="kb-body">' +
          "<p>" + esc(n.catNote) + "</p>" +
          "<h5>Bedarf (Orientierung)</h5><ul>" +
          (n.min ? "<li>Minimum: <strong>" + n.min.value + " " + esc(n.min.unit) + "</strong></li>" : "") +
          (n.minWet ? "<li>Minimum (Nass): <strong>" + n.minWet.value + " " + esc(n.minWet.unit) + "</strong></li>" : "") +
          (n.recommended ? "<li>Empfohlen: <strong>" + n.recommended.value + " " + esc(n.recommended.unit) + "</strong></li>" : "") +
          (n.max ? "<li>Obergrenze: <strong>" + n.max.value + " " + esc(n.max.unit) + "</strong></li>" : "") +
          "</ul>" +
          "<h5>Bei Mangel</h5><p>" + esc(n.deficiency) + "</p>" +
          (n.excess ? "<h5>Bei Überschuss</h5><p>" + esc(n.excess) + "</p>" : "") +
        "</div></div>";
    });

    html += disclaimer();
    main.innerHTML = html;
    wireAccordion();
  }

  /* ============== Ansicht: Krankheiten ============== */
  function renderDiseases() {
    var html = '<div class="page-head"><h2>Krankheiten &amp; Vorbeugung</h2>' +
      "<p>Häufige Erkrankungen der Katze – mit Schwerpunkt darauf, wie du ihnen vorbeugst und sie früh erkennst. Filtere nach Haltungsform und Lebensphase.</p></div>";

    html += '<div class="pill-row mb-16" id="dz-filter">' +
      filterBtn("all", "Alle", true) + filterBtn("indoor", "🏠 Wohnungskatze") +
      filterBtn("outdoor", "🌳 Freigänger") + filterBtn("senior", "👴 Senior") + "</div>";

    html += '<div id="dz-list"></div>';
    html += disclaimer();
    main.innerHTML = html;

    function draw(filter) {
      var list = (window.DISEASES || []).filter(function (d) {
        return filter === "all" || (d.tags && d.tags.indexOf(filter) >= 0);
      });
      var h = "";
      list.forEach(function (d) {
        h += '<div class="kb-item"><div class="kb-head" data-kb="' + d.id + '">' +
          '<span class="k-ico">' + d.icon + '</span><span class="k-title">' + esc(d.name) + "</span>" +
          '<span class="chevron">▸</span></div>' +
          '<div class="kb-body">' +
            '<div class="banner warn" style="margin:6px 0 4px"><span class="b-ico">●</span><div>' + esc(d.severity) + "</div></div>" +
            "<p>" + esc(d.about) + "</p>" +
            "<h5>Mögliche Anzeichen</h5><ul>" + d.signs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
            "<h5>Vorbeugung &amp; Früherkennung</h5><ul>" + d.prevention.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
          "</div></div>";
      });
      document.getElementById("dz-list").innerHTML = h;
      wireAccordion();
    }

    document.querySelectorAll("#dz-filter button").forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll("#dz-filter button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        draw(b.getAttribute("data-f"));
      };
    });
    draw("all");
  }
  function filterBtn(f, label, on) {
    return '<button class="btn btn-sm seg-filter' + (on ? " on" : "") + '" data-f="' + f + '" style="' +
      (on ? "background:var(--accent-soft);color:var(--accent);border-color:transparent" : "") + '">' + esc(label) + "</button>";
  }

  function wireAccordion() {
    document.querySelectorAll(".kb-head").forEach(function (h) {
      h.onclick = function () { h.parentElement.classList.toggle("open"); };
    });
  }

  /* ============== Ansicht: Daten & Backup ============== */
  function renderData() {
    var cats = window.Store.getCats();
    var html = '<div class="page-head"><h2>Daten &amp; Backup</h2>' +
      "<p>Alle Daten liegen ausschließlich lokal in diesem Browser. Erstelle ein Backup oder übertrage deine Daten auf ein anderes Gerät.</p></div>";

    html += '<div class="card"><div class="card-title">Gespeichert auf diesem Gerät</div>' +
      '<div class="grid grid-3">' +
      metric("Katzen", String(cats.length), "Profile") +
      metric("Futter", String(window.Store.getFoods().length), "gespeicherte Analysen") +
      metric("Speicherort", "localStorage", "nur dieser Browser") +
      "</div></div>";

    html += '<div class="card mt-16"><div class="card-title">Backup exportieren</div>' +
      '<p class="muted small mb-16">Lädt eine JSON-Datei mit allen Katzen- und Futterdaten herunter.</p>' +
      '<button class="btn btn-primary" id="export">⬇️ Backup herunterladen</button></div>';

    html += '<div class="card mt-16"><div class="card-title">Backup importieren</div>' +
      '<p class="muted small mb-16">Vorsicht: Ersetzt die aktuellen Daten durch den Inhalt der Datei.</p>' +
      '<input type="file" id="import-file" accept="application/json,.json" /></div>';

    html += '<div class="card mt-16"><div class="card-title" style="color:var(--danger)">Alles löschen</div>' +
      '<p class="muted small mb-16">Entfernt unwiderruflich alle lokal gespeicherten Daten.</p>' +
      '<button class="btn btn-danger" id="wipe">🗑️ Alle Daten löschen</button></div>';

    main.innerHTML = html;

    document.getElementById("export").onclick = function () {
      var blob = new Blob([window.Store.exportJson()], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "katzengesundheit-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click(); URL.revokeObjectURL(url); toast("Backup heruntergeladen");
    };
    document.getElementById("import-file").onchange = function (ev) {
      var file = ev.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try { window.Store.importJson(reader.result); toast("Import erfolgreich"); go("cats"); }
        catch (e) { toast("Import fehlgeschlagen – ungültige Datei"); }
      };
      reader.readAsText(file);
    };
    document.getElementById("wipe").onclick = function () {
      confirmModal("Wirklich alles löschen?", "Diese Aktion entfernt ALLE Katzen und Futterdaten unwiderruflich.", function () {
        window.Store.importJson('{"cats":[],"foods":[]}'); toast("Alle Daten gelöscht"); go("cats");
      });
    };
  }

  /* ============== Ansicht: Über ============== */
  function renderAbout() {
    var html = '<div class="page-head"><h2>Über &amp; Hinweise</h2>' +
      "<p>Hintergrund, wissenschaftliche Grundlage und wichtige Hinweise zur App.</p></div>";

    html += '<div class="banner warn mb-16"><span class="b-ico">⚠️</span><div><strong>Kein Ersatz für den Tierarzt.</strong> ' +
      "Diese App dient der Information und Orientierung. Sie ersetzt keine tierärztliche Untersuchung, Diagnose oder Behandlung. " +
      "Bei Krankheitszeichen, vor Futterumstellungen und bei Unsicherheit immer tierärztlichen Rat einholen.</div></div>";

    html += '<div class="card"><div class="card-title">Wissenschaftliche Grundlage</div><ul style="padding-left:18px;display:flex;flex-direction:column;gap:6px">' +
      "<li><strong>FEDIAF</strong> – Nutritional Guidelines for Complete and Complementary Pet Food for Cats and Dogs (europäische Referenz für Nährstoffbedarf).</li>" +
      "<li><strong>NRC</strong> – Nutrient Requirements of Dogs and Cats (2006).</li>" +
      "<li><strong>AAFCO</strong> – Cat Food Nutrient Profiles.</li>" +
      "<li><strong>WSAVA</strong> – Body Condition Score (9-Punkte) und Ernährungs-Leitlinien.</li>" +
      "<li>Energieformeln: RER = 70 × (kg)^0,75; MER = RER × Lebensphasen-/Aktivitätsfaktor.</li>" +
      "<li>Futter-Energie: modifizierte Atwater-Faktoren für Heimtierfutter.</li>" +
      "</ul><p class='muted small mt-8'>Die hinterlegten Werte sind Orientierungswerte. Der individuelle Bedarf hängt von Gesundheit, Stoffwechsel und Lebensumständen ab.</p></div>";

    html += '<div class="card mt-16"><div class="card-title">Datenschutz</div>' +
      "<p class='muted small'>Die App läuft vollständig lokal in deinem Browser. Es werden keine Daten an Server gesendet, es gibt kein Tracking und keine Internetverbindung ist nötig. " +
      "Deine Katzendaten liegen ausschließlich im <code>localStorage</code> dieses Browsers. Über &raquo;Daten &amp; Backup&laquo; kannst du sie sichern.</p></div>";

    html += '<div class="card mt-16"><div class="card-title">Version</div><p class="muted small">Katzengesundheit v1.0 · lokale Einzelplatz-Version</p></div>';

    main.innerHTML = html;
  }

  function disclaimer() {
    return '<div class="banner warn mt-24"><span class="b-ico">⚠️</span><div>Hinweis: Diese App ersetzt keine tierärztliche Beratung. ' +
      "Werte sind Orientierungswerte nach FEDIAF/NRC/WSAVA. Bei Krankheitszeichen bitte tierärztlich abklären.</div></div>";
  }

  /* ============== Modal-Infrastruktur ============== */
  function showModal(title, bodyHtml, buttons) {
    var foot = (buttons || []).map(function (b, i) {
      return '<button class="' + b.cls + '" data-mbtn="' + i + '">' + esc(b.label) + "</button>";
    }).join("");
    modalRoot.innerHTML =
      '<div class="modal-overlay"><div class="modal"><div class="modal-head"><h3>' + esc(title) + "</h3>" +
      '<button class="modal-close" data-mclose>×</button></div>' +
      '<div class="modal-body">' + bodyHtml + "</div>" +
      (foot ? '<div class="modal-foot">' + foot + "</div>" : "") + "</div></div>";
    modalRoot.querySelector("[data-mclose]").onclick = closeModal;
    modalRoot.querySelector(".modal-overlay").onclick = function (e) { if (e.target === this) closeModal(); };
    (buttons || []).forEach(function (b, i) {
      modalRoot.querySelector('[data-mbtn="' + i + '"]').onclick = b.action;
    });
  }
  function closeModal() { modalRoot.innerHTML = ""; }
  function confirmModal(title, msg, onYes) {
    showModal(title, '<p class="muted">' + msg + "</p>",
      [{ label: "Abbrechen", cls: "btn", action: closeModal },
       { label: "Ja, fortfahren", cls: "btn btn-danger", action: function () { closeModal(); onYes(); } }]);
  }

  /* ============== Init ============== */
  document.querySelectorAll(".nav-item").forEach(function (n) {
    n.onclick = function () { state.preselectKcal = null; state.preselectCat = null; go(n.getAttribute("data-view")); };
  });
  go("cats");
})();
