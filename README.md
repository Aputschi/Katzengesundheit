# 🐱 Katzengesundheit – Langlebigkeits-Assistent

Eine **vollständig lokale** App für Katzenbesitzer:innen. Sie hilft dabei, das
Leben deiner Katzen möglichst lang und gesund zu gestalten – auf Basis
wissenschaftlich orientierter Richtwerte (FEDIAF, NRC, AAFCO, WSAVA).

Keine Cloud, kein Server im Internet, kein Tracking. Alle Daten bleiben in
deinem Browser auf diesem Gerät.

**🔗 Live:** https://aputschi.github.io/Katzengesundheit/

---

## Aufs Handy installieren (als App)

1. Öffne https://aputschi.github.io/Katzengesundheit/ auf dem Handy
   (Safari auf iPhone, Chrome auf Android).
2. **iPhone:** Teilen-Symbol → **„Zum Home-Bildschirm"**.
   **Android:** Menü (⋮) → **„App installieren"** bzw. „Zum Startbildschirm hinzufügen".
3. Fertig – die App liegt mit eigenem Icon auf dem Homescreen und funktioniert
   dank Service Worker auch offline.

> Deine Katzendaten werden nur lokal auf dem jeweiligen Gerät gespeichert
> (Handy und PC teilen sich die Daten also nicht automatisch – dafür gibt es
> den JSON-Export/-Import unter „Daten & Backup").

---

## Lokal starten (PC)

**Variante A – per Doppelklick (empfohlen):**

1. Doppelklick auf **`Katzengesundheit starten.bat`**
2. Die App öffnet sich automatisch im Browser (über `http://localhost`).
3. Zum Beenden einfach das schwarze Fenster schließen.

> Nutzt das vorhandene Python (3.x). Falls Python fehlt, siehe Variante B.

**Variante B – ohne Python:**

- Öffne die Datei **`index.html`** direkt im Browser (Doppelklick).
- Funktioniert ebenfalls; bei manchen Browsern ist die Speicherung über
  `localhost` (Variante A) aber zuverlässiger.

---

## Funktionen

| Bereich | Was es tut |
|---|---|
| **Meine Katzen** | Profile anlegen: Rasse, Alter, Gewicht, Haltung (Wohnung/Freigang), Kastration, Aktivität, Body Condition Score. |
| **Analyse je Katze** | Täglicher Energiebedarf (RER/MER), Idealgewicht, Wasserbedarf, Lebensphase, rassetypische Risiken und individuelle Empfehlungen zu Ernährung, Bewegung, Beschäftigung & Vorsorge. |
| **Pflegeplan & Tagesaufgaben** | Auto-generierte Routine je Profil: wie oft füttern (mit Grammmengen, wenn ein Hauptfutter hinterlegt ist), wie oft spielen (bei Wohnungskatzen 2× Jagdspiel), Klo, Pflege, Wochen-/Monats- und Vorsorgeaufgaben. Tägliche Aufgaben sind abhakbar (Reset über Nacht). |
| **Futter-Analyse** | Futter aus der **Markendatenbank** (~50 Produktlinien) wählen *oder* die Analysewerte vom Etikett selbst eingeben → Umrechnung auf Trockenmasse, geschätzte Energiedichte, Bewertung der Nährstoffrelationen, benötigte Tages-/Mahlzeitenmenge. Als Hauptfutter je Katze speicherbar. |
| **Nährstoff-Wissen** | Die wichtigsten Nährstoffe (Taurin, Arginin, Vitamin A, Arachidonsäure …) mit Funktion, Bedarf und Mangelfolgen. |
| **Krankheiten & Vorbeugung** | Häufige Erkrankungen (CNI, Diabetes, FLUTD, HCM, Adipositas …) mit Anzeichen und Vorbeugung, filterbar nach Haltung/Alter. |
| **Daten & Backup** | Export/Import als JSON, alles löschen. |

> **Hinweis zur Markendatenbank:** Die hinterlegten Analysewerte sind **Richtwerte je Produktlinie** und können je nach Sorte/Charge abweichen. Nach der Auswahl bitte mit der konkreten Verpackung abgleichen und bei Bedarf anpassen.

---

## Wichtiger Hinweis

⚠️ **Diese App ersetzt keine tierärztliche Beratung.** Sie liefert
Orientierungswerte und Bildungsinhalte. Bei Krankheitszeichen, vor
Futterumstellungen und bei Unsicherheit immer eine Tierärztin / einen Tierarzt
hinzuziehen.

---

## Aufbau (für Neugierige)

```
Katzengesundheit/
├─ index.html                  Einstiegsseite
├─ Katzengesundheit starten.bat  Lokaler Starter (Windows)
├─ start.py                    Lokaler Webserver-Launcher (Python)
├─ README.md
└─ assets/
   ├─ css/styles.css           Design (helles, freundliches Theme)
   └─ js/
      ├─ data-nutrients.js     Nährstoff-Referenz (FEDIAF/NRC)
      ├─ data-breeds.js        Rassen & Prädispositionen
      ├─ data-diseases.js      Krankheiten & Vorbeugung
      ├─ data-foods-db.js      Markendatenbank Katzenfutter (Richtwerte)
      ├─ storage.js            Lokale Speicherung (localStorage)
      ├─ calc.js               Berechnungen (Energie, BCS, Futter)
      ├─ recommend.js          Empfehlungs-Engine
      ├─ careplan.js           Pflegeplan & Tagesaufgaben
      └─ app.js                Oberfläche & Steuerung
```

Reines HTML/CSS/JavaScript ohne Build-Schritt und ohne externe Bibliotheken.
