/* calc.js
 * Wissenschaftliche Berechnungslogik der App.
 * Energiebedarf: RER = 70 * (kg)^0.75 ; MER = RER * Faktor (FEDIAF/NRC).
 * Body Condition Score (WSAVA, 9-Punkte-Skala). Futter-Analyse nach
 * modifizierter Atwater-Methode (Heimtierfutter).
 */
window.Calc = (function () {

  /* ---------- Lebensphasen (AAFP/AAHA Life Stages) ---------- */
  function lifeStage(ageYears) {
    if (ageYears < 0.5) return { id: "kitten", label: "Kitten", emoji: "🍼", note: "Wachstum – hoher Energie- und Nährstoffbedarf." };
    if (ageYears < 1)   return { id: "junior", label: "Junior", emoji: "🐾", note: "Noch im Wachstum, sehr aktiv." };
    if (ageYears < 7)   return { id: "adult", label: "Erwachsen", emoji: "🐈", note: "Erhaltung – Fokus auf Idealgewicht." };
    if (ageYears < 11)  return { id: "mature", label: "Reif (Mature)", emoji: "🧶", note: "Vorsorge wird wichtiger – jährlicher Check empfohlen." };
    if (ageYears < 15)  return { id: "senior", label: "Senior", emoji: "👴", note: "Engmaschige Vorsorge, Blut-/Urinkontrollen." };
    return { id: "geriatric", label: "Hochbetagt (Geriatrisch)", emoji: "🌟", note: "Intensive Betreuung, halbjährliche Checks." };
  }

  /* ---------- Idealgewicht aus Body Condition Score ----------
   * BCS 5/9 = ideal. Jeder Punkt über 5 ≈ +10 % über Idealgewicht.
   * Jeder Punkt unter 5 ≈ -10 % unter Idealgewicht. */
  function idealWeight(currentKg, bcs) {
    if (!bcs) return null;
    var pctOver = (bcs - 5) * 0.10;        // z.B. BCS 7 -> +20%
    var ideal = currentKg / (1 + pctOver);
    return Math.round(ideal * 100) / 100;
  }

  function bcsLabel(bcs) {
    if (bcs <= 3) return { txt: "Untergewichtig", cls: "danger" };
    if (bcs <= 5) return { txt: "Idealgewicht", cls: "ok" };
    if (bcs <= 6) return { txt: "Leicht übergewichtig", cls: "warn" };
    if (bcs <= 7) return { txt: "Übergewichtig", cls: "warn" };
    return { txt: "Adipös", cls: "danger" };
  }

  /* ---------- Energiebedarf (kcal/Tag) ---------- */
  // RER auf Basis des metabolischen Körpergewichts.
  function rer(weightKg) {
    return 70 * Math.pow(weightKg, 0.75);
  }

  /* MER-Faktor aus Lebensphase, Kastration, Aktivität, Haltung, Gewichtsziel.
   * Liefert Faktor + Erläuterung. */
  function merFactor(cat, stage, goal) {
    var factors = [];
    var f, why;

    // Basis nach Lebensphase / Kastrationsstatus
    if (stage.id === "kitten") { f = 2.5; why = "Kitten < 6 Monate (Wachstum)"; }
    else if (stage.id === "junior") { f = 2.0; why = "Junior (Wachstum)"; }
    else {
      if (cat.neutered) { f = 1.2; why = "Erwachsen, kastriert"; }
      else { f = 1.4; why = "Erwachsen, unkastriert"; }
    }
    factors.push({ f: f, why: why });

    // Aktivität / Haltung (nur bei Erwachsenen relevant moduliert)
    if (stage.id === "adult" || stage.id === "mature" || stage.id === "senior" || stage.id === "geriatric") {
      if (cat.activity === "low") { factors.push({ f: -0.1, why: "wenig aktiv / Stubenhocker" }); }
      else if (cat.activity === "high") { factors.push({ f: 0.2, why: "sehr aktiv" }); }
      if (cat.housing === "outdoor") { factors.push({ f: 0.1, why: "Freigänger (mehr Bewegung/Thermoregulation)" }); }
      if (stage.id === "senior" || stage.id === "geriatric") { factors.push({ f: -0.1, why: "Senior (oft reduzierter Grundumsatz)" }); }
    }

    // Gewichtsziel überschreibt Richtung
    if (goal === "loss") { return { factor: 0.8, breakdown: [{ f: 0.8, why: "Gewichtsreduktion: 0.8 × RER des Idealgewichts" }] }; }
    if (goal === "gain") { return { factor: 1.6, breakdown: [{ f: 1.6, why: "Gewichtsaufbau / Untergewicht" }] }; }

    var total = factors.reduce(function (s, x) { return s + x.f; }, 0);
    total = Math.max(0.8, Math.round(total * 100) / 100);
    return { factor: total, breakdown: factors };
  }

  /* Gesamtberechnung Energie. Bei Gewichtsreduktion auf Idealgewicht rechnen. */
  function energy(cat) {
    var stage = lifeStage(cat.ageYears);
    var bcs = cat.bcs || 5;
    var ideal = idealWeight(cat.weightKg, bcs) || cat.weightKg;

    // Ziel ableiten
    var goal = "maintain";
    if (bcs >= 6) goal = "loss";
    else if (bcs <= 3) goal = "gain";

    // Bei Reduktion: RER vom Idealgewicht; sonst vom aktuellen Gewicht
    var basisWeight = (goal === "loss") ? ideal : cat.weightKg;
    var restingER = rer(basisWeight);
    var mer = merFactor(cat, stage, goal);
    var kcal = Math.round(restingER * mer.factor);

    return {
      stage: stage,
      bcs: bcs,
      idealWeight: ideal,
      goal: goal,
      rer: Math.round(restingER),
      factor: mer.factor,
      breakdown: mer.breakdown,
      kcalPerDay: kcal,
      basisWeight: Math.round(basisWeight * 100) / 100,
    };
  }

  /* Wasserbedarf grob: ~50 ml/kg/Tag Gesamtbedarf (Futter + Trinken). */
  function waterMl(weightKg) {
    return Math.round(weightKg * 50);
  }

  /* ---------- Futter-Analyse ----------
   * Eingaben (As-Fed, %): Protein, Fett, Faser, Asche/Rohasche, Feuchtigkeit.
   * NfE (stickstofffreie Extraktstoffe ~ Kohlenhydrate) = Rest.
   * Energie nach modifizierter Atwater (Heimtierfutter):
   *   kcal/100 g = 3.5*Protein + 8.5*Fett + 3.5*NfE  (g je 100 g) */
  function analyzeFood(input) {
    var moisture = num(input.moisture);
    var protein = num(input.protein);
    var fat = num(input.fat);
    var fiber = num(input.fiber);
    var ash = num(input.ash);

    var dm = 100 - moisture;                 // Trockenmasse %
    if (dm <= 0) dm = 0.0001;
    var nfe = Math.max(0, 100 - moisture - protein - fat - fiber - ash);

    // Energiedichte (modifizierte Atwater), kcal je 100 g As-Fed
    var kcalPer100g = 3.5 * protein + 8.5 * fat + 3.5 * nfe;
    var kcalPerKg = kcalPer100g * 10;

    // Trockenmasse-Basis (% TM)
    var dmProtein = pct(protein, dm);
    var dmFat = pct(fat, dm);
    var dmFiber = pct(fiber, dm);
    var dmAsh = pct(ash, dm);
    var dmNfe = pct(nfe, dm);

    // kcal je 100 g TM (für Energiedichte-Einordnung)
    var kcalPer100gDM = kcalPer100g / (dm / 100);

    return {
      moisture: moisture, dm: round1(dm),
      asFed: { protein: protein, fat: fat, fiber: fiber, ash: ash, nfe: round1(nfe) },
      dryMatter: { protein: round1(dmProtein), fat: round1(dmFat), fiber: round1(dmFiber), ash: round1(dmAsh), nfe: round1(dmNfe) },
      kcalPer100g: round1(kcalPer100g),
      kcalPerKg: Math.round(kcalPerKg),
      kcalPer100gDM: round1(kcalPer100gDM),
      type: moisture >= 60 ? "Nassfutter" : (moisture <= 14 ? "Trockenfutter" : "Halbfeucht"),
    };
  }

  /* Bewertung der TM-Werte gegen grobe Zielbereiche (Erwachsene Katze). */
  function evaluateFood(a) {
    var checks = [];
    function check(name, val, min, good, max, unit, hint) {
      var status = "ok", msg = "im Zielbereich";
      if (val < min) { status = "danger"; msg = "zu niedrig"; }
      else if (val < good) { status = "warn"; msg = "eher niedrig"; }
      else if (max && val > max) { status = "warn"; msg = "eher hoch"; }
      checks.push({ name: name, value: val, min: min, good: good, max: max, unit: unit, status: status, msg: msg, hint: hint });
    }
    // Zielbereiche TM-Basis, ausgewachsene Katze (Orientierung FEDIAF/Praxis)
    check("Protein", a.dryMatter.protein, 25, 33, null, "% TM", "Karnivoren brauchen viel Protein – höher ist meist günstig.");
    check("Fett", a.dryMatter.fat, 9, 15, 30, "% TM", "Energiequelle; sehr hoher Fettgehalt begünstigt Übergewicht.");
    // Kohlenhydrate: niedriger ist artgerechter – eigene Logik
    var carb = a.dryMatter.nfe;
    var cStatus = carb <= 15 ? "ok" : (carb <= 30 ? "warn" : "danger");
    checks.push({ name: "Kohlenhydrate (NfE)", value: carb, min: 0, good: 15, max: 30, unit: "% TM", status: cStatus,
      msg: carb <= 15 ? "niedrig (artgerecht)" : (carb <= 30 ? "mäßig" : "hoch"),
      hint: "Katzen verwerten Kohlenhydrate schlecht – niedrige Werte sind günstig." });
    check("Rohfaser", a.dryMatter.fiber, 0, 1, 10, "% TM", "Etwas Faser unterstützt die Verdauung; sehr hohe Werte verdünnen Nährstoffe.");
    return checks;
  }

  /* Tagesmenge Futter in Gramm für den Energiebedarf. */
  function feedingAmount(kcalPerDay, kcalPerKgFood) {
    if (!kcalPerKgFood || kcalPerKgFood <= 0) return null;
    var grams = (kcalPerDay / kcalPerKgFood) * 1000;
    return Math.round(grams);
  }

  /* ---------- Helfer ---------- */
  function num(v) { var n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? 0 : n; }
  function pct(part, whole) { return whole > 0 ? (part / whole) * 100 : 0; }
  function round1(v) { return Math.round(v * 10) / 10; }

  return {
    lifeStage: lifeStage,
    idealWeight: idealWeight,
    bcsLabel: bcsLabel,
    rer: rer,
    energy: energy,
    waterMl: waterMl,
    analyzeFood: analyzeFood,
    evaluateFood: evaluateFood,
    feedingAmount: feedingAmount,
    num: num,
  };
})();
