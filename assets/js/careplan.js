/* careplan.js
 * Generiert einen individuellen, ZEITBASIERTEN Tagesablauf plus Wochen-,
 * Monats- und Vorsorge-Aufgaben aus dem Katzenprofil.
 *
 * Wissenschaftliche Orientierung:
 *  - Katzen fressen natürlicherweise viele kleine Mahlzeiten → mehrere
 *    Fütterungen/Tag zu festen Zeiten (Kitten 4×, erwachsen 3×).
 *  - Wohnungskatzen: täglich 2× interaktives Jagdspiel (10–15 min), idealerweise
 *    VOR einer Mahlzeit (natürliche Abfolge jagen–fressen–putzen–schlafen).
 *  - Frisches Wasser täglich; Katzentoilette mind. 1–2×/Tag säubern.
 *  - Langhaarrassen täglich bürsten, Kurzhaar ~1×/Woche.
 */
window.CarePlan = (function () {

  var LONGHAIR = ["mainecoon", "perser", "norweger", "ragdoll"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function mealsPerDay(stage) {
    if (stage.id === "kitten") return 4;
    if (stage.id === "junior") return 3;
    return 3;
  }
  function isLonghair(cat) { return LONGHAIR.indexOf(cat.breedId) >= 0; }

  // Verteilt N Mahlzeiten gleichmäßig zwischen 07:00 und 20:00 Uhr.
  function defaultFeedingTimes(meals) {
    var start = 7, end = 20;
    if (meals <= 1) return ["08:00"];
    var times = [], step = (end - start) / (meals - 1);
    for (var i = 0; i < meals; i++) {
      var h = start + step * i, hh = Math.floor(h), mm = Math.round((h - hh) * 60);
      mm = Math.round(mm / 5) * 5; if (mm === 60) { hh++; mm = 0; }
      times.push(pad(hh) + ":" + pad(mm));
    }
    return times;
  }

  function forCat(cat) {
    var e = window.Calc.energy(cat);
    var stage = e.stage;
    var indoor = cat.housing === "indoor";

    var meals, feedingTimes;
    if (cat.feedingTimes && cat.feedingTimes.length) { feedingTimes = cat.feedingTimes.slice(); meals = feedingTimes.length; }
    else { meals = mealsPerDay(stage); feedingTimes = defaultFeedingTimes(meals); }
    feedingTimes.sort();

    var firstFeed = feedingTimes[0], lastFeed = feedingTimes[feedingTimes.length - 1];

    // Gramm je Mahlzeit (falls Hauptfutter hinterlegt)
    var gramsPerMeal = null, gramsPerDay = null;
    if (cat.mainFood && cat.mainFood.kcalPerKg) {
      gramsPerDay = window.Calc.feedingAmount(e.kcalPerDay, cat.mainFood.kcalPerKg);
      if (gramsPerDay) gramsPerMeal = Math.round(gramsPerDay / meals);
    }

    /* ---------------- Zeitbasierter Tagesablauf ---------------- */
    var schedule = [];

    schedule.push(ev("s-water", firstFeed, "💧", "Frisches Wasser bereitstellen",
      "Napf/Trinkbrunnen reinigen und mit frischem Wasser füllen. Mehrere Trinkstellen abseits des Futters erhöhen die Wasseraufnahme (wichtig für Nieren & Harnwege)."));

    feedingTimes.forEach(function (t, i) {
      var sub = "Abgemessene Portion füttern.";
      if (gramsPerMeal) sub = "Ca. " + gramsPerMeal + " g " + (cat.mainFood.name ? "(" + cat.mainFood.name + ") " : "") + "füttern. Tagesbedarf ~" + e.kcalPerDay + " kcal.";
      else sub = "Abgemessene Portion füttern (Tagesbedarf ~" + e.kcalPerDay + " kcal, im Futter-Bereich Hauptfutter hinterlegen für Grammangabe).";
      schedule.push(ev("s-feed-" + i, t, "🍽️", "Mahlzeit " + (i + 1) + " von " + meals, sub));
    });

    // Spiel-Einheiten (vor Morgen- und Abendmahlzeit)
    if (indoor) {
      schedule.push(ev("s-play-am", firstFeed, "🪶", "Jagd-Spiel (10–15 min)",
        "Aktives Beutespiel VOR der Morgenmahlzeit – bedient den Jagdinstinkt, hält schlank und beugt Langeweile/Stress vor."));
      schedule.push(ev("s-play-pm", lastFeed, "🐭", "Jagd-Spiel (10–15 min)",
        "Zweite Spieleinheit am Abend, ideal vor dem Fressen. Spielzeug rotieren, damit es spannend bleibt."));
    } else {
      schedule.push(ev("s-play-pm", lastFeed, "🪶", "Gemeinsame Spielzeit (10 min)",
        "Auch Freigänger profitieren von interaktivem Spiel zur Bindung und geistigen Auslastung."));
    }

    // Katzentoilette morgens & abends
    schedule.push(ev("s-litter-am", firstFeed, "🚽", "Katzentoilette kontrollieren",
      "Kot/Klumpen entfernen. Menge & Aussehen beachten – Veränderungen sind ein frühes Warnsignal."));
    schedule.push(ev("s-litter-pm", lastFeed, "🚽", "Katzentoilette kontrollieren",
      "Abends erneut säubern. Faustregel: Anzahl Katzen + 1 Toiletten, ruhig platziert."));

    // Abend: Zuwendung & Gesundheitsblick als fester Abendpunkt
    schedule.push(ev("s-attention", lastFeed, "❤️", "Kuscheln & Gesundheitsblick",
      "Ruhige Zuwendung und kurz prüfen: Hat sie gut gefressen/getrunken? Atmung, Bewegung, Stimmung normal?"));

    schedule.sort(function (a, b) { return a.time < b.time ? -1 : (a.time > b.time ? 1 : 0); });

    /* ---------------- Untimed – über den Tag ---------------- */
    var untimed = [];
    if (isLonghair(cat)) untimed.push(task("u-groom", "🪮", "Fell bürsten (Langhaar)", "Verhindert Verfilzungen & Haarballen; gleichzeitig Haut/Fell prüfen.", "täglich"));
    untimed.push(task("u-enrich", "🧩", "Beschäftigung/Enrichment", "Fensterplatz, Kratzmöglichkeit, Suchspiel oder neues Versteck anbieten – hält den Kopf fit.", "täglich"));
    if (e.goal === "loss") untimed.push(task("u-move", "🏃", "Extra-Bewegung (Abnehmen)", "Futter über Fummelbrett/Snackball anbieten, mehr Bewegungsanreize über den Tag.", "täglich"));

    /* ---------------- Wöchentlich ---------------- */
    var weekly = [];
    weekly.push(task("w-bcs", "⚖️", "Figur fühlen (Body Condition)", "Rippen & Taille ertasten – Ziel BCS 4–5/9. So bemerkst du Gewichtsveränderungen früh.", "wöchentlich"));
    if (!isLonghair(cat)) weekly.push(task("w-groom", "🪮", "Fell bürsten (Kurzhaar)", "Entfernt lose Haare (weniger Haarballen), guter Moment für Haut-/Fellcheck.", "1×/Woche"));
    weekly.push(task("w-litter", "🧽", "Toilette gründlich reinigen", "Streu komplett wechseln, Toilette auswaschen (mildes Mittel, gut spülen).", "wöchentlich"));
    weekly.push(task("w-toys", "🧸", "Spielzeug rotieren", "Spielzeug austauschen, neue Reize schaffen – beugt Langeweile vor.", "wöchentlich"));
    weekly.push(task("w-dental", "🦷", "Maul-Check", "Zahnfleisch/Zähne anschauen: Rötung, Zahnstein oder Mundgeruch ernst nehmen.", "wöchentlich"));
    weekly.push(task("w-water-clean", "🚰", "Trinkbrunnen entkalken/reinigen", "Regelmäßige Reinigung hält das Wasser attraktiv und fördert das Trinken.", "wöchentlich"));

    /* ---------------- Monatlich ---------------- */
    var monthly = [];
    monthly.push(task("m-weigh", "⚖️", "Wiegen & eintragen", "Gewicht festhalten (App-Verlauf). Schon ±10 % sind bei Katzen relevant.", "monatlich"));
    monthly.push(task("m-claws", "🐾", "Krallen kontrollieren", "Besonders bei Wohnungskatzen/Senioren: prüfen, ob Krallen einwachsen; ggf. kürzen (lassen).", "monatlich"));
    if (cat.housing === "outdoor") monthly.push(task("m-fleas", "🐛", "Floh-/Zeckenschutz", "In der warmen Jahreszeit Ektoparasitenschutz auffrischen und Fell absuchen.", "saisonal"));

    /* ---------------- Vorsorge / periodisch ---------------- */
    var periodic = [];
    if (cat.housing === "outdoor") periodic.push(task("p-deworm", "💊", "Entwurmung", "Freigänger: Entwurmung bzw. Kotuntersuchung etwa vierteljährlich (nach Risiko).", "~alle 3 Mon."));
    else periodic.push(task("p-deworm", "💊", "Entwurmung", "Wohnungskatze: Entwurmung/Kotcheck meist 1–2×/Jahr ausreichend.", "1–2×/Jahr"));
    if (stage.id === "senior" || stage.id === "geriatric") periodic.push(task("p-vet", "🩺", "Tierarzt-Vorsorge (Senior)", "Halbjährlicher Check inkl. Blutdruck, Nieren- & Schilddrüsenwerten – Früherkennung verlängert die Lebenszeit.", "alle 6 Mon."));
    else if (stage.id === "mature") periodic.push(task("p-vet", "🩺", "Tierarzt-Vorsorge", "Ab ~7 Jahren jährlicher Check mit Blut-/Urinwerten (Niere, Schilddrüse).", "jährlich"));
    else periodic.push(task("p-vet", "🩺", "Tierarzt-Check & Impfschutz", "Jährlicher Gesundheitscheck, Zahnkontrolle, Auffrischung der Grundimmunisierung.", "jährlich"));
    if (cat.housing === "outdoor") periodic.push(task("p-vacc", "💉", "Impfschutz für Freigänger", "Neben den Basisimpfungen für Freigänger u. a. Leukose (FeLV) erwägen – tierärztlich abstimmen.", "nach Plan"));

    return {
      energy: e, mealsPerDay: meals, feedingTimes: feedingTimes,
      gramsPerDay: gramsPerDay, gramsPerMeal: gramsPerMeal,
      schedule: schedule, untimed: untimed,
      groups: [
        group("weekly", "Wöchentlich", "📅", weekly),
        group("monthly", "Monatlich", "🗓️", monthly),
        group("periodic", "Vorsorge & periodisch", "🩺", periodic),
      ],
    };
  }

  function ev(id, time, ico, title, sub) { return { id: id, time: time, ico: ico, title: title, sub: sub }; }
  function task(id, ico, title, sub, freq) { return { id: id, ico: ico, title: title, sub: sub, freq: freq }; }
  function group(key, label, icon, tasks) { return { key: key, label: label, icon: icon, tasks: tasks }; }

  return { forCat: forCat, mealsPerDay: mealsPerDay, defaultFeedingTimes: defaultFeedingTimes };
})();
