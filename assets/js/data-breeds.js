/* data-breeds.js
 * Rassedaten: typische Lebenserwartung und bekannte Prädispositionen.
 * Orientierung aus veterinärmedizinischer Literatur und Rasse-Gesundheits-
 * programmen. Werte sind Spannen – das Einzeltier kann abweichen.
 */
window.BREEDS = [
  {
    id: "ekh", name: "Europäisch Kurzhaar / Hauskatze", emoji: "🐈",
    lifespan: [12, 18], avgLifespan: 15,
    traits: "Robuste Mischpopulation, meist gesund und langlebig.",
    risks: ["Übergewicht (bei Wohnungshaltung)", "Zahnerkrankungen", "Im Alter: CNI, Hyperthyreose"],
  },
  {
    id: "mainecoon", name: "Maine Coon", emoji: "🦁",
    lifespan: [10, 14], avgLifespan: 12,
    traits: "Große, schwere Rasse; sehr aktiv und sozial.",
    risks: ["Hypertrophe Kardiomyopathie (HCM, genetischer Test verfügbar)", "Hüftdysplasie", "Spinale Muskelatrophie (SMA)", "PKD"],
  },
  {
    id: "ragdoll", name: "Ragdoll", emoji: "🧸",
    lifespan: [12, 15], avgLifespan: 13,
    traits: "Ruhig, anhänglich; große Rasse.",
    risks: ["HCM (genetischer Test verfügbar)", "Harnsteine", "Übergewicht"],
  },
  {
    id: "perser", name: "Perser", emoji: "🐱",
    lifespan: [12, 16], avgLifespan: 14,
    traits: "Brachycephal (kurze Nase), langes Fell mit hohem Pflegebedarf.",
    risks: ["Polyzystische Nierenerkrankung (PKD, genetischer Test)", "Atemprobleme (brachycephal)", "Tränenwege/Augen", "Zahnfehlstellungen"],
  },
  {
    id: "bkh", name: "Britisch Kurzhaar", emoji: "🩵",
    lifespan: [12, 17], avgLifespan: 14,
    traits: "Kräftig, ruhig; neigt zu Gemütlichkeit und Gewichtszunahme.",
    risks: ["HCM (genetischer Test)", "Übergewicht", "PKD"],
  },
  {
    id: "siam", name: "Siam", emoji: "🐈‍⬛",
    lifespan: [15, 20], avgLifespan: 17,
    traits: "Sehr aktiv, stimmfreudig, schlank – oft besonders langlebig.",
    risks: ["Amyloidose (Leber)", "Asthma/Bronchialerkrankung", "Progressive Retinaatrophie", "Zahnerkrankungen"],
  },
  {
    id: "bengal", name: "Bengal", emoji: "🐆",
    lifespan: [12, 16], avgLifespan: 14,
    traits: "Sehr aktiv und spielfreudig, hoher Bewegungs- und Beschäftigungsbedarf.",
    risks: ["HCM", "Progressive Retinaatrophie (PRA-b)", "Pyruvatkinase-Defizienz (PK-Def)"],
  },
  {
    id: "sphynx", name: "Sphynx", emoji: "🐭",
    lifespan: [9, 15], avgLifespan: 12,
    traits: "Nackt; erhöhter Energiebedarf zur Wärmeregulation, Hautpflege nötig.",
    risks: ["HCM (häufig)", "Hautprobleme/Sonnenempfindlichkeit", "Erhöhter Wärmeverlust"],
  },
  {
    id: "norweger", name: "Norwegische Waldkatze", emoji: "🌲",
    lifespan: [13, 16], avgLifespan: 14,
    traits: "Robuste, große Naturrasse mit dichtem Fell.",
    risks: ["HCM", "Glykogenspeicherkrankheit Typ IV (GSD IV, Test)", "Hüftdysplasie"],
  },
  {
    id: "abessinier", name: "Abessinier", emoji: "🦊",
    lifespan: [12, 16], avgLifespan: 14,
    traits: "Sehr aktiv, neugierig, athletisch.",
    risks: ["Pyruvatkinase-Defizienz (Test)", "Progressive Retinaatrophie", "Amyloidose (Niere)"],
  },
  {
    id: "andere", name: "Andere / unbekannt", emoji: "🐾",
    lifespan: [12, 16], avgLifespan: 14,
    traits: "Allgemeine Orientierungswerte für nicht gelistete Rassen.",
    risks: ["Übergewicht", "Zahnerkrankungen", "Im Alter: CNI, Hyperthyreose"],
  },
];
