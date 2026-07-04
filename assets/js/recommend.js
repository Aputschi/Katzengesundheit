/* recommend.js
 * Leitet aus dem Katzenprofil individuelle Empfehlungen ab:
 * Ernährung, Bewegung, Beschäftigung/Aufmerksamkeit, Vorsorge.
 * Regelbasiert auf Basis der Berechnungen aus calc.js.
 */
window.Recommend = (function () {

  function forCat(cat) {
    var e = window.Calc.energy(cat);
    var stage = e.stage;
    var recs = { ernaehrung: [], bewegung: [], aufmerksamkeit: [], vorsorge: [] };

    /* ---------- Ernährung ---------- */
    if (e.goal === "loss") {
      recs.ernaehrung.push(rec("danger", "🎯",
        "Gewichtsreduktion angezeigt",
        "Body Condition Score " + cat.bcs + "/9. Ziel-Idealgewicht ca. " + e.idealWeight + " kg. Reduziere langsam (max. 0,5–1 % Körpergewicht pro Woche) – zu schnelles Abnehmen kann eine gefährliche Fettleber auslösen."));
      recs.ernaehrung.push(rec("warn", "🥫",
        "Mehr Nassfutter, weniger Energiedichte",
        "Nassfutter sättigt bei weniger Kalorien und erhöht die Wasseraufnahme. Tagesration abwiegen statt frei füttern."));
    } else if (e.goal === "gain") {
      recs.ernaehrung.push(rec("warn", "🍽️",
        "Untergewicht – Ursache abklären",
        "BCS " + cat.bcs + "/9 ist niedrig. Tierärztlich abklären (Zähne, Schilddrüse, Parasiten, innere Erkrankungen) und energiereicher füttern."));
    } else {
      recs.ernaehrung.push(rec("ok", "✅",
        "Idealgewicht halten",
        "BCS " + (cat.bcs || 5) + "/9 ist gut. Tagesbedarf ca. " + e.kcalPerDay + " kcal – Ration konstant halten und BCS regelmäßig prüfen."));
    }

    recs.ernaehrung.push(rec("accent", "🥩",
      "Proteinreich & artgerecht füttern",
      "Als obligater Karnivore braucht deine Katze hochwertiges tierisches Protein, Taurin, Vitamin A und Arachidonsäure aus tierischen Quellen. Achte auf die Deklaration 'Alleinfuttermittel'."));

    if (cat.housing === "indoor" || e.stage.id === "senior" || e.stage.id === "geriatric") {
      recs.ernaehrung.push(rec("accent", "💧",
        "Wasseraufnahme fördern",
        "Ziel ca. " + window.Calc.waterMl(e.idealWeight) + " ml/Tag gesamt. Trinkbrunnen, mehrere Näpfe und Nassfutter beugen Harnwegs- und Nierenproblemen vor."));
    }

    if (stage.id === "kitten" || stage.id === "junior") {
      recs.ernaehrung.push(rec("accent", "🍼",
        "Wachstumsfutter (Kitten)",
        "Junge Katzen brauchen energie- und nährstoffdichtes Kittenfutter und mehrere kleine Mahlzeiten am Tag."));
    }

    /* ---------- Bewegung ---------- */
    if (cat.housing === "indoor") {
      recs.bewegung.push(rec("accent", "🪶",
        "Tägliche Jagd-Spieleinheiten",
        "Wohnungskatzen brauchen aktive Bewegung: 2× täglich 10–15 min Beutespiel (Federangel, Spielmaus) bedienen den Jagdinstinkt und beugen Übergewicht & Langeweile vor."));
      recs.bewegung.push(rec("accent", "🧗",
        "Vertikalen Raum schaffen",
        "Kratzbäume, Regalwege und Aussichtsplätze am Fenster fördern Klettern und Auslastung."));
    } else {
      recs.bewegung.push(rec("ok", "🌳",
        "Freigang als natürliche Auslastung",
        "Freigänger bewegen sich meist ausreichend. Achte trotzdem auf Sicherheit (Straße, Reviere) und plane gemeinsame Spielzeiten zur Bindung ein."));
    }
    if (e.goal === "loss") {
      recs.bewegung.push(rec("warn", "🏃",
        "Bewegung zur Gewichtsabnahme nutzen",
        "Futter über Fummelbretter/Bälle anbieten, kurze Spieleinheiten über den Tag verteilen, um Aktivität zu steigern."));
    }
    if (stage.id === "senior" || stage.id === "geriatric") {
      recs.bewegung.push(rec("accent", "🛗",
        "Umfeld altersgerecht anpassen",
        "Niedrige Einstiege ins Katzenklo, Treppchen zu Lieblingsplätzen, weiche Liegeflächen – Arthrose ist bei Senioren häufig und oft unbemerkt."));
    }

    /* ---------- Aufmerksamkeit / Beschäftigung ---------- */
    recs.aufmerksamkeit.push(rec("accent", "🧠",
      "Umweltbereicherung (Enrichment)",
      "Verstecke, wechselnde Spielzeuge, Snack-Suchspiele und Fensterplätze halten den Kopf fit und reduzieren Stress."));
    if (cat.housing === "indoor") {
      recs.aufmerksamkeit.push(rec("warn", "🧩",
        "Langeweile & Stress vorbeugen",
        "Reizarmut ist bei reiner Wohnungshaltung ein Risiko (u. a. für idiopathische Blasenentzündung). Feste Routinen, getrennte Ressourcen und Beschäftigung helfen."));
    }
    recs.aufmerksamkeit.push(rec("accent", "🚽",
      "Genug saubere Katzentoiletten",
      "Faustregel: Anzahl Katzen + 1, an ruhigen Orten, täglich gereinigt. Beobachte das Klo-Verhalten – Veränderungen sind oft erste Krankheitszeichen."));

    /* ---------- Vorsorge ---------- */
    var breed = findBreed(cat.breedId);
    if (breed && breed.risks && breed.risks.length) {
      recs.vorsorge.push(rec("warn", breed.emoji || "🧬",
        "Rassetypische Risiken: " + breed.name,
        "Achte besonders auf: " + breed.risks.join(", ") + "."));
    }
    if (stage.id === "mature") {
      recs.vorsorge.push(rec("accent", "🩺", "Jährlicher Gesundheitscheck", "Ab ca. 7 Jahren jährlich Blut-/Urinwerte kontrollieren (Niere, Schilddrüse) – Früherkennung verlängert Lebenszeit."));
    } else if (stage.id === "senior" || stage.id === "geriatric") {
      recs.vorsorge.push(rec("warn", "🩺", "Engmaschige Senioren-Vorsorge", "Halbjährlicher Check inkl. Blutdruck, Nieren-/Schilddrüsenwerten und Gewichtskontrolle empfohlen."));
    } else {
      recs.vorsorge.push(rec("accent", "🩺", "Jährliche Vorsorge & Impfschutz", "Routinecheck, Zahnkontrolle und Grundimmunisierung auf dem aktuellen Stand halten."));
    }
    if (cat.housing === "outdoor") {
      recs.vorsorge.push(rec("warn", "🐛", "Parasiten- & Infektionsschutz", "Freigänger: regelmäßig entwurmen, Floh-/Zeckenschutz und FeLV/FIV-Status beachten. FeLV-Impfung erwägen."));
    }
    if (!cat.neutered && stage.id !== "kitten") {
      recs.vorsorge.push(rec("warn", "✂️", "Kastration erwägen", "Kastration senkt das Risiko für bestimmte Tumoren, Revierkämpfe und (bei Freigang) Infektionsübertragung – tierärztlich beraten lassen."));
    }
    recs.vorsorge.push(rec("accent", "🦷", "Zahngesundheit nicht vergessen", "Zahnerkrankungen sind sehr häufig und schmerzhaft. Regelmäßige Maulkontrolle und ggf. Zahnpflege/Reinigung."));

    return { energy: e, recs: recs };
  }

  function findBreed(id) {
    var list = window.BREEDS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function rec(type, ico, title, text) {
    return { type: type, ico: ico, title: title, text: text };
  }

  return { forCat: forCat, findBreed: findBreed };
})();
