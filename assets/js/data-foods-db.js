/* data-foods-db.js
 * Datenbank gängiger Katzenfutter-Marken (v. a. DACH-Raum) mit TYPISCHEN
 * analytischen Bestandteilen (As-Fed, in %).
 *
 * WICHTIG: Die Werte sind Richtwerte je Produktlinie und können je nach Sorte,
 * Geschmacksrichtung und Charge abweichen. Bitte immer mit der konkreten
 * Verpackung abgleichen und bei Bedarf in der App anpassen.
 *
 * Felder: protein, fat (Rohfett), fiber (Rohfaser), ash (Rohasche),
 *         moisture (Feuchtigkeit). type: 'nass' | 'trocken'.
 *         stage: 'adult' | 'kitten' | 'senior' | 'all'. tags: Hinweise.
 */
window.FOODS_DB = [
  /* ---------- Supermarkt / Standard – Nassfutter ---------- */
  { brand: "Whiskas", line: "1+ in Sauce/Gelee", type: "nass", stage: "adult", protein: 8, fat: 5, fiber: 0.3, ash: 2.5, moisture: 82, tags: ["Supermarkt"] },
  { brand: "Sheba", line: "Selection / Feine Filets", type: "nass", stage: "adult", protein: 10, fat: 5, fiber: 0.3, ash: 2, moisture: 82, tags: ["Supermarkt"] },
  { brand: "Felix", line: "So gut wie es aussieht", type: "nass", stage: "adult", protein: 13, fat: 4, fiber: 0.5, ash: 2.5, moisture: 80, tags: ["Supermarkt"] },
  { brand: "Gourmet", line: "Gold", type: "nass", stage: "adult", protein: 10.5, fat: 6, fiber: 0.5, ash: 2.5, moisture: 78, tags: ["Supermarkt"] },
  { brand: "Kitekat", line: "in Sauce", type: "nass", stage: "adult", protein: 7.5, fat: 4.5, fiber: 0.5, ash: 2.5, moisture: 82, tags: ["Supermarkt"] },
  { brand: "Purina ONE", line: "Bifensis (nass)", type: "nass", stage: "adult", protein: 12, fat: 4, fiber: 0.5, ash: 2, moisture: 79, tags: [] },

  /* ---------- Premium / hochfleischig – Nassfutter ---------- */
  { brand: "Animonda", line: "Carny Adult", type: "nass", stage: "adult", protein: 11, fat: 6.5, fiber: 0.3, ash: 2, moisture: 80, tags: ["hoher Fleischanteil"] },
  { brand: "Animonda", line: "vom Feinsten", type: "nass", stage: "adult", protein: 10, fat: 5, fiber: 0.3, ash: 2, moisture: 82, tags: [] },
  { brand: "MAC's", line: "Katzenmenü", type: "nass", stage: "adult", protein: 11, fat: 6.5, fiber: 0.4, ash: 2, moisture: 79, tags: ["getreidefrei"] },
  { brand: "Catz Finefood", line: "No. (Adult)", type: "nass", stage: "adult", protein: 11, fat: 6, fiber: 0.4, ash: 2.5, moisture: 78, tags: ["getreidefrei", "hoher Fleischanteil"] },
  { brand: "GranataPet", line: "DeliCatessen", type: "nass", stage: "adult", protein: 10.5, fat: 6.5, fiber: 0.3, ash: 2, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Wild Freedom", line: "Adult (nass)", type: "nass", stage: "adult", protein: 10, fat: 6, fiber: 0.5, ash: 2.5, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Cosma", line: "Nature", type: "nass", stage: "adult", protein: 16, fat: 2, fiber: 0.5, ash: 2, moisture: 78, tags: ["sehr proteinreich", "fettarm"] },
  { brand: "Feringa", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6, fiber: 0.4, ash: 2, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Smilla", line: "Adult (nass)", type: "nass", stage: "adult", protein: 10, fat: 5.5, fiber: 0.4, ash: 2.5, moisture: 81, tags: [] },
  { brand: "Rinti", line: "Kennerfleisch", type: "nass", stage: "adult", protein: 10, fat: 7, fiber: 0.4, ash: 2, moisture: 80, tags: [] },
  { brand: "Miamor", line: "Feine Filets", type: "nass", stage: "adult", protein: 10, fat: 2, fiber: 0.5, ash: 2, moisture: 83, tags: ["fettarm"] },
  { brand: "Schmusy", line: "Nature (nass)", type: "nass", stage: "adult", protein: 10, fat: 5, fiber: 0.4, ash: 2.5, moisture: 81, tags: [] },
  { brand: "Bozita", line: "Häppchen in Gelee", type: "nass", stage: "adult", protein: 10.5, fat: 4.5, fiber: 0.5, ash: 2.5, moisture: 83, tags: [] },
  { brand: "Lily's Kitchen", line: "Adult (nass)", type: "nass", stage: "adult", protein: 9, fat: 6, fiber: 0.5, ash: 2.5, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Applaws", line: "in Brühe", type: "nass", stage: "adult", protein: 12, fat: 1, fiber: 0.1, ash: 2, moisture: 83, tags: ["Ergänzung*", "sehr fettarm"], note: "Viele Applaws-Dosen sind Ergänzungsfutter – NICHT als Alleinfutter geeignet. Auf Deklaration achten." },
  { brand: "Wildes Land", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6.5, fiber: 0.4, ash: 2, moisture: 79, tags: ["getreidefrei"] },
  { brand: "Terra Faelis", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6, fiber: 0.4, ash: 2, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Defu", line: "Bio (nass)", type: "nass", stage: "adult", protein: 10.5, fat: 6, fiber: 0.4, ash: 2.5, moisture: 80, tags: ["Bio"] },

  /* ---------- Tierarzt / Spezial – Nassfutter ---------- */
  { brand: "Royal Canin", line: "Instinctive (Sauce)", type: "nass", stage: "adult", protein: 9.5, fat: 3, fiber: 1.5, ash: 1.6, moisture: 80, tags: [] },
  { brand: "Hill's", line: "Science Plan Adult (nass)", type: "nass", stage: "adult", protein: 8, fat: 4, fiber: 1, ash: 1.5, moisture: 80, tags: [] },
  { brand: "Kattovit", line: "Niere/Renal (nass)", type: "nass", stage: "senior", protein: 7.5, fat: 5, fiber: 0.5, ash: 1.8, moisture: 81, tags: ["Diätfutter*"], note: "Diät-/Spezialfutter – nur nach tierärztlicher Empfehlung einsetzen." },
  { brand: "Royal Canin", line: "Ageing 12+ (nass)", type: "nass", stage: "senior", protein: 7.5, fat: 3.5, fiber: 1.5, ash: 1.6, moisture: 80, tags: ["Senior"] },

  /* ---------- Kitten – Nassfutter ---------- */
  { brand: "Royal Canin", line: "Kitten (nass)", type: "nass", stage: "kitten", protein: 10.5, fat: 5, fiber: 0.8, ash: 1.7, moisture: 78, tags: ["Wachstum"] },
  { brand: "Animonda", line: "Carny Kitten", type: "nass", stage: "kitten", protein: 11, fat: 6, fiber: 0.3, ash: 2, moisture: 80, tags: ["Wachstum"] },

  /* ---------- Trockenfutter – Standard/Premium ---------- */
  { brand: "Royal Canin", line: "Indoor 27 (trocken)", type: "trocken", stage: "adult", protein: 27, fat: 13, fiber: 5, ash: 6.6, moisture: 8, tags: ["Wohnungskatze"] },
  { brand: "Hill's", line: "Science Plan Adult (trocken)", type: "trocken", stage: "adult", protein: 33, fat: 21, fiber: 1.5, ash: 5.5, moisture: 8, tags: [] },
  { brand: "Purina ONE", line: "Bifensis (trocken)", type: "trocken", stage: "adult", protein: 34, fat: 13, fiber: 2, ash: 7, moisture: 8, tags: [] },
  { brand: "Pro Plan", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 38, fat: 15, fiber: 1, ash: 7, moisture: 8, tags: ["proteinreich"] },
  { brand: "Josera", line: "Catelya / Léger", type: "trocken", stage: "adult", protein: 30, fat: 16, fiber: 3, ash: 7, moisture: 8, tags: [] },
  { brand: "Bosch", line: "Sanabelle Adult", type: "trocken", stage: "adult", protein: 31, fat: 20, fiber: 3, ash: 6.5, moisture: 8, tags: [] },
  { brand: "Happy Cat", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 32, fat: 16, fiber: 2.5, ash: 6.5, moisture: 9, tags: [] },
  { brand: "Leonardo", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 34, fat: 18, fiber: 3.5, ash: 7.5, moisture: 8, tags: [] },
  { brand: "Concept for Life", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 37, fat: 17, fiber: 3, ash: 7, moisture: 8.5, tags: [] },
  { brand: "Orijen", line: "Cat & Kitten (trocken)", type: "trocken", stage: "all", protein: 40, fat: 20, fiber: 3, ash: 8, moisture: 10, tags: ["getreidefrei", "sehr proteinreich"] },
  { brand: "Acana", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 35, fat: 17, fiber: 5, ash: 7, moisture: 10, tags: ["getreidefrei"] },
  { brand: "Wild Freedom", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 37, fat: 18, fiber: 3, ash: 9, moisture: 9, tags: ["getreidefrei"] },
  { brand: "IAMS", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 32, fat: 20, fiber: 2, ash: 6, moisture: 8, tags: [] },
  { brand: "Whiskas", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 32, fat: 10, fiber: 2, ash: 7.5, moisture: 9, tags: ["Supermarkt"] },
  { brand: "Felix", line: "Crunchy (trocken)", type: "trocken", stage: "adult", protein: 32, fat: 11, fiber: 2.5, ash: 8, moisture: 8, tags: ["Supermarkt"] },
  { brand: "GranataPet", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 33, fat: 18, fiber: 3, ash: 7, moisture: 8, tags: ["getreidefrei"] },

  /* ---------- Trockenfutter – Kitten / Senior ---------- */
  { brand: "Royal Canin", line: "Kitten (trocken)", type: "trocken", stage: "kitten", protein: 36, fat: 20, fiber: 3, ash: 7.5, moisture: 8, tags: ["Wachstum"] },
  { brand: "Hill's", line: "Science Plan Kitten (trocken)", type: "trocken", stage: "kitten", protein: 35, fat: 22, fiber: 1.5, ash: 5.5, moisture: 8, tags: ["Wachstum"] },
  { brand: "Royal Canin", line: "Senior/Ageing (trocken)", type: "trocken", stage: "senior", protein: 25, fat: 13, fiber: 5, ash: 5.5, moisture: 8, tags: ["Senior"] },

  /* ---------- Handels-/Eigenmarken – Nassfutter ---------- */
  { brand: "ZooRoyal", line: "Zarte Häppchen in Sauce (400 g Dose)", type: "nass", stage: "adult", protein: 8.5, fat: 5, fiber: 0.4, ash: 2, moisture: 81, tags: ["Zoohandel"] },
  { brand: "ZooRoyal", line: "Filet-Stückchen in Gelee", type: "nass", stage: "adult", protein: 9, fat: 4.5, fiber: 0.4, ash: 2, moisture: 82, tags: ["Zoohandel"] },
  { brand: "Coshida", line: "in Sauce/Gelee (Lidl)", type: "nass", stage: "adult", protein: 8.5, fat: 5, fiber: 0.4, ash: 2, moisture: 80, tags: ["Discounter"] },
  { brand: "Cachet", line: "in Sauce (Aldi)", type: "nass", stage: "adult", protein: 8, fat: 5, fiber: 0.5, ash: 2.5, moisture: 81, tags: ["Discounter"] },
  { brand: "Leos", line: "in Gelee (Netto)", type: "nass", stage: "adult", protein: 8, fat: 5, fiber: 0.5, ash: 2.5, moisture: 81, tags: ["Discounter"] },
  { brand: "Gut & Günstig", line: "Katzenfutter (Edeka)", type: "nass", stage: "adult", protein: 8, fat: 5, fiber: 0.5, ash: 2.5, moisture: 82, tags: ["Supermarkt"] },
  { brand: "ja!", line: "Katzenfutter (Rewe)", type: "nass", stage: "adult", protein: 7, fat: 4.5, fiber: 0.5, ash: 2.5, moisture: 82, tags: ["Supermarkt"] },
  { brand: "Dein Bestes", line: "in Sauce (dm)", type: "nass", stage: "adult", protein: 9, fat: 5, fiber: 0.4, ash: 2, moisture: 81, tags: ["Drogerie"] },
  { brand: "K-Classic", line: "in Sauce (Kaufland)", type: "nass", stage: "adult", protein: 8, fat: 5, fiber: 0.5, ash: 2.5, moisture: 82, tags: ["Supermarkt"] },
  { brand: "Multifit", line: "in Sauce (Fressnapf)", type: "nass", stage: "adult", protein: 9, fat: 5, fiber: 0.4, ash: 2, moisture: 81, tags: ["Zoohandel"] },
  { brand: "Select Gold", line: "Adult (nass, Fressnapf)", type: "nass", stage: "adult", protein: 10.5, fat: 6, fiber: 0.4, ash: 2, moisture: 80, tags: ["getreidefrei", "Zoohandel"] },
  { brand: "Best Nature", line: "Adult (nass, Dehner)", type: "nass", stage: "adult", protein: 10.5, fat: 6, fiber: 0.4, ash: 2, moisture: 80, tags: ["getreidefrei"] },
  { brand: "Vitakraft", line: "Poésie", type: "nass", stage: "adult", protein: 12, fat: 4, fiber: 0.5, ash: 2, moisture: 82, tags: [] },
  { brand: "Gourmet", line: "Perle", type: "nass", stage: "adult", protein: 12, fat: 3.5, fiber: 0.5, ash: 2.5, moisture: 79, tags: ["Supermarkt"] },
  { brand: "Purina", line: "Mon Petit", type: "nass", stage: "adult", protein: 14, fat: 4, fiber: 0.5, ash: 2.5, moisture: 78, tags: ["Supermarkt"] },
  { brand: "Wolfsblut", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6.5, fiber: 0.4, ash: 2, moisture: 79, tags: ["getreidefrei"] },
  { brand: "Grau", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6, fiber: 0.4, ash: 2, moisture: 79, tags: [] },
  { brand: "Dr. Clauder's", line: "Adult (nass)", type: "nass", stage: "adult", protein: 10.5, fat: 6, fiber: 0.4, ash: 2, moisture: 80, tags: [] },
  { brand: "Pets Deli", line: "Adult (nass)", type: "nass", stage: "adult", protein: 11, fat: 6, fiber: 0.4, ash: 2, moisture: 79, tags: ["getreidefrei"] },
  { brand: "Herrmann's", line: "Bio-Menü (nass)", type: "nass", stage: "adult", protein: 10, fat: 6, fiber: 0.5, ash: 2, moisture: 80, tags: ["Bio"] },

  /* ---------- Handels-/Eigenmarken – Trockenfutter ---------- */
  { brand: "ZooRoyal", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 30, fat: 14, fiber: 2.5, ash: 7, moisture: 9, tags: ["Zoohandel"] },
  { brand: "Coshida", line: "Adult (trocken, Lidl)", type: "trocken", stage: "adult", protein: 30, fat: 12, fiber: 2.5, ash: 7, moisture: 8, tags: ["Discounter"] },
  { brand: "Select Gold", line: "Adult (trocken, Fressnapf)", type: "trocken", stage: "adult", protein: 34, fat: 18, fiber: 3, ash: 7, moisture: 8, tags: ["getreidefrei", "Zoohandel"] },
  { brand: "Multifit", line: "Adult (trocken, Fressnapf)", type: "trocken", stage: "adult", protein: 30, fat: 15, fiber: 2.5, ash: 7, moisture: 9, tags: ["Zoohandel"] },
  { brand: "Wolfsblut", line: "Adult (trocken)", type: "trocken", stage: "adult", protein: 37, fat: 18, fiber: 3, ash: 8.5, moisture: 9, tags: ["getreidefrei"] },

  /* ---------- Snacks / Ergänzung (KEIN Alleinfutter) ---------- */
  { brand: "Dreamies", line: "Katzensnack", type: "trocken", stage: "adult", protein: 30, fat: 16, fiber: 1, ash: 8, moisture: 9, tags: ["Snack*"], note: "Snack / Ergänzungsfutter – NICHT als Alleinfutter geeignet, nur als gelegentliche Belohnung (max. ~10 % der Tagesration)." },
  { brand: "Vitakraft", line: "Cat-Stick (Snack)", type: "trocken", stage: "adult", protein: 30, fat: 20, fiber: 1.5, ash: 8, moisture: 12, tags: ["Snack*"], note: "Snack / Ergänzungsfutter – nur als gelegentliche Belohnung." },
];
