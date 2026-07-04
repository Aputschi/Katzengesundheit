/* data-diseases.js
 * Bibliothek häufiger Katzenerkrankungen mit Schwerpunkt Vorbeugung.
 * Bildungszwecke – ersetzt keine tierärztliche Diagnose oder Beratung.
 * tags: 'indoor' (v.a. Wohnungskatzen), 'outdoor' (v.a. Freigänger),
 *       'senior' (v.a. ältere Katzen), 'all'.
 */
window.DISEASES = [
  {
    id: "adipositas", name: "Übergewicht & Adipositas", icon: "⚖️", tags: ["indoor", "all"],
    severity: "Sehr häufig – Hauptrisikofaktor für viele Folgeerkrankungen",
    about: "Übergewicht ist eines der größten Gesundheitsprobleme bei Hauskatzen und verkürzt nachweislich die Lebenserwartung. Es fördert Diabetes, Arthrose, Lebererkrankungen und Harnwegsprobleme.",
    signs: ["Taille von oben nicht erkennbar", "Rippen nicht leicht tastbar", "Hängebauch, Bewegungsunlust", "Schwierigkeiten bei der Fellpflege"],
    prevention: [
      "Tagesration nach Idealgewicht und Energiebedarf bemessen, nicht nach Appetit",
      "Abgemessene Portionen statt freier Zugang ('ad libitum')",
      "Mehr Nassfutter (höherer Wassergehalt, geringere Energiedichte)",
      "Spiel und Bewegung täglich; Futter über Fummelbretter/Aktivität anbieten",
      "Body Condition Score regelmäßig prüfen (Ziel 4–5/9)",
    ],
  },
  {
    id: "cni", name: "Chronische Nierenerkrankung (CNI)", icon: "🫘", tags: ["senior", "all"],
    severity: "Häufigste Todesursache bei älteren Katzen",
    about: "Die chronische Niereninsuffizienz ist bei Senioren extrem verbreitet. Sie ist nicht heilbar, aber früh erkannt gut zu verlangsamen.",
    signs: ["Vermehrtes Trinken und Urinieren", "Gewichtsverlust, Appetitlosigkeit", "Mattes Fell, Erbrechen", "Mundgeruch (urämisch)"],
    prevention: [
      "Ganzjährig gute Wasserversorgung (Nassfutter, Trinkbrunnen, mehrere Näpfe)",
      "Ab ~7 Jahren jährlicher Gesundheitscheck inkl. Blut-/Urinwerte (SDMA, Kreatinin)",
      "Zahnpflege – chronische Maulentzündungen belasten den Organismus",
      "Phosphatlast im Futter im Auge behalten; bei Diagnose Nierendiät tierärztlich",
      "Bluthochdruck mitkontrollieren lassen",
    ],
  },
  {
    id: "diabetes", name: "Diabetes mellitus", icon: "🩸", tags: ["indoor", "all"],
    severity: "Häufig – oft durch Übergewicht ausgelöst, teils rückbildbar",
    about: "Katzendiabetes (meist Typ 2) hängt stark mit Übergewicht und kohlenhydratreicher Fütterung zusammen. Bei früher, konsequenter Behandlung ist eine Remission möglich.",
    signs: ["Starker Durst, viel Urin", "Gewichtsverlust trotz Appetit", "Schwäche, veränderter Gang (Hinterhand)"],
    prevention: [
      "Idealgewicht halten – der wichtigste Hebel",
      "Proteinreiche, kohlenhydratarme Fütterung (artgerecht für Karnivoren)",
      "Bewegung fördern, Langeweile-Fressen vermeiden",
      "Bei Risiko-/Senior­katzen Blutzucker beim Check mitbestimmen lassen",
    ],
  },
  {
    id: "flutd", name: "FLUTD / Harnwegserkrankungen", icon: "🚽", tags: ["indoor", "all"],
    severity: "Häufig – Harnröhrenverschluss beim Kater ist ein NOTFALL",
    about: "Der Komplex der unteren Harnwegserkrankungen (FLUTD) umfasst Blasenentzündung, Harngrieß/-steine und idiopathische Zystitis. Stress, wenig Trinken und Übergewicht sind zentrale Auslöser.",
    signs: ["Häufiges Urinieren, kleine Mengen", "Blut im Urin", "Schmerzlaute, Pressen", "Urinieren außerhalb der Toilette", "Kater pressen erfolglos → SOFORT zum Tierarzt"],
    prevention: [
      "Wasseraufnahme maximieren: Nassfutter, Trinkbrunnen, frisches Wasser an mehreren Stellen",
      "Stress reduzieren – Hauptfaktor der idiopathischen Zystitis (FIC)",
      "Genug Katzentoiletten (Faustregel: Anzahl Katzen + 1), sauber und ruhig platziert",
      "Idealgewicht halten",
      "Bei Steinneigung: tierärztlich abgestimmtes Spezialfutter, Harn-pH beachten",
    ],
  },
  {
    id: "zahn", name: "Zahn- & Maulerkrankungen", icon: "🦷", tags: ["all"],
    severity: "Sehr häufig – oft unbemerkt, mit Folgen für den ganzen Körper",
    about: "Zahnstein, Zahnfleischentzündung und die katzentypische FORL (resorptive Läsionen) sind weit verbreitet und schmerzhaft. Chronische Maulentzündungen belasten Niere und Herz.",
    signs: ["Mundgeruch", "Zahnstein, gerötetes Zahnfleisch", "Einseitiges Kauen, Futterverweigerung", "Speicheln, Pfote am Maul"],
    prevention: [
      "Regelmäßige Maulkontrolle, jährliche Begutachtung beim Tierarzt",
      "Zahnpflege (Zahnbürste/-gel) wenn möglich angewöhnen",
      "Zahnpflege-/Spezialfutter oder geeignete Snacks als Ergänzung",
      "Professionelle Zahnreinigung bei Bedarf nicht aufschieben",
    ],
  },
  {
    id: "hyperthyreose", name: "Schilddrüsenüberfunktion", icon: "🦋", tags: ["senior"],
    severity: "Häufig bei Katzen über 10 Jahren",
    about: "Die Hyperthyreose entsteht meist durch eine gutartige Vergrößerung der Schilddrüse und beschleunigt den Stoffwechsel. Gut behandelbar bei früher Erkennung.",
    signs: ["Gewichtsverlust bei gesteigertem Appetit", "Hyperaktivität, Unruhe", "Struppiges Fell", "Erhöhte Herzfrequenz, Erbrechen"],
    prevention: [
      "Nicht direkt vermeidbar – entscheidend ist Früherkennung",
      "Ab ~7–8 Jahren jährliche Blutkontrolle (T4)",
      "Auf Gewichts- und Verhaltensänderungen achten",
    ],
  },
  {
    id: "hcm", name: "Hypertrophe Kardiomyopathie (HCM)", icon: "💔", tags: ["all"],
    severity: "Häufigste Herzerkrankung – teils genetisch (z. B. Maine Coon, Ragdoll)",
    about: "Bei der HCM verdickt sich der Herzmuskel. Sie kann lange symptomlos bleiben und sich plötzlich (z. B. durch Blutgerinnsel oder Lungenödem) zeigen.",
    signs: ["Schnelle/angestrengte Atmung in Ruhe", "Leistungsschwäche", "Plötzliche Hinterhandlähmung (Thrombus) – NOTFALL", "Ohnmacht"],
    prevention: [
      "Bei Rassekatzen: Zuchttiere per Gentest/Herzultraschall screenen",
      "Atemfrequenz in Ruhe gelegentlich zählen (Norm < ~30/min)",
      "Taurinversorgung sicherstellen (Taurinmangel → eigene Herzform DCM)",
      "Bei Verdacht: Herzultraschall (Echokardiografie) durch Tierarzt",
    ],
  },
  {
    id: "lipidose", name: "Hepatische Lipidose (Fettleber)", icon: "🧈", tags: ["all"],
    severity: "Lebensbedrohlich – entsteht durch Nahrungsverweigerung",
    about: "Frisst eine (besonders übergewichtige) Katze mehrere Tage kaum, verfettet die Leber rapide. Ein tierärztlicher Notfall.",
    signs: ["Mehrere Tage keine/kaum Nahrungsaufnahme", "Gelbsucht (gelbe Schleimhäute/Ohren)", "Apathie, Erbrechen, Gewichtsverlust"],
    prevention: [
      "Eine Katze sollte NIE länger als ~24–48 h gar nicht fressen – tierärztlich abklären",
      "Übergewicht nur langsam und kontrolliert reduzieren (max. ~0.5–1 % Körpergewicht/Woche)",
      "Futterumstellungen behutsam, Appetit genau beobachten",
    ],
  },
  {
    id: "arthrose", name: "Arthrose / Gelenkerkrankung", icon: "🦴", tags: ["senior", "all"],
    severity: "Bei Senioren sehr häufig – aber oft übersehen",
    about: "Degenerative Gelenkerkrankungen betreffen die meisten älteren Katzen. Da Katzen Schmerzen verstecken, bleibt Arthrose lange unerkannt.",
    signs: ["Weniger/niedrigeres Springen", "Steifer Gang, weniger Aktivität", "Vernachlässigte Fellpflege", "Reizbarkeit beim Anfassen"],
    prevention: [
      "Idealgewicht halten – entlastet die Gelenke enorm",
      "Omega-3 (EPA/DHA) kann Gelenke unterstützen",
      "Umfeld anpassen: niedrige Einstiege ins Katzenklo, Treppchen, weiche Liegeplätze",
      "Bei Verdacht Schmerztherapie tierärztlich abklären (nie Humanmedikamente geben!)",
    ],
  },
  {
    id: "infektion", name: "Infektionskrankheiten (FeLV, FIV, FIP, Panleukopenie)", icon: "🦠", tags: ["outdoor"],
    severity: "Ernst – Freigänger besonders gefährdet",
    about: "Leukosevirus (FeLV), Immunschwächevirus (FIV), feline infektiöse Peritonitis (FIP) und Panleukopenie (Katzenseuche) werden v. a. durch Kontakt mit anderen Katzen übertragen.",
    signs: ["Wiederkehrende Infekte, Fieber", "Gewichtsverlust, Mattigkeit", "Blasse Schleimhäute", "Verdauungs-/Atemwegsprobleme"],
    prevention: [
      "Grundimmunisierung und Auffrischungen (Katzenseuche, -schnupfen; für Freigänger FeLV)",
      "Vor Freigang/Neuzugang auf FeLV/FIV testen lassen",
      "Kastration senkt Revierkämpfe und Bissverletzungen (Übertragungsweg)",
      "Reine Wohnungshaltung senkt das Infektionsrisiko deutlich",
    ],
  },
  {
    id: "parasiten", name: "Parasiten (Würmer, Flöhe, Zecken)", icon: "🐛", tags: ["outdoor"],
    severity: "Häufig bei Freigängern",
    about: "Freigänger nehmen über Beutetiere und Umwelt regelmäßig Endo- und Ektoparasiten auf. Manche (z. B. bestimmte Würmer) sind auf den Menschen übertragbar.",
    signs: ["Würmer/Wurmglieder im Kot", "Häufiges Kratzen, Flohkot im Fell", "Stumpfes Fell, Gewichtsverlust", "Aufgeblähter Bauch (v. a. Jungtiere)"],
    prevention: [
      "Regelmäßiges Entwurmen nach Risiko (Freigänger häufiger als Wohnungskatzen)",
      "Floh-/Zeckenprophylaxe in der Saison",
      "Kotuntersuchung beim Routinecheck",
      "Schlafplätze und Umgebung sauber halten",
    ],
  },
  {
    id: "stress", name: "Stress & Verhaltensprobleme", icon: "🧠", tags: ["indoor", "all"],
    severity: "Unterschätzt – wirkt auf Körper UND Psyche",
    about: "Chronischer Stress (Langeweile, Reizarmut, Konflikte mit Artgenossen) fördert Erkrankungen wie die idiopathische Zystitis und Verhaltensstörungen. Besonders relevant bei reiner Wohnungshaltung.",
    signs: ["Übermäßiges Putzen/kahle Stellen", "Unsauberkeit, Markieren", "Rückzug oder Aggression", "Appetit-/Schlafveränderungen"],
    prevention: [
      "Umweltbereicherung: Klettermöglichkeiten, Verstecke, Aussichtsplätze am Fenster",
      "Tägliche Spieleinheiten, die den Jagdinstinkt bedienen (Beutespiel)",
      "Ressourcen (Futter, Wasser, Toiletten, Schlafplätze) ausreichend und getrennt anbieten",
      "Feste Routinen; bei mehreren Katzen Rückzugsorte sichern",
      "Ggf. Pheromonprodukte; bei starken Problemen Verhaltensberatung",
    ],
  },
];
