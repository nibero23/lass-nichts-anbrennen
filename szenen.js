/* =====================================================================
   szenen.js  –  ALLE TEXTE DES SPIELS
   =====================================================================

   In dieser Datei steht alles, was man im Spiel lesen kann.
   Ihr könnt hier Texte ändern, ohne etwas vom Programm zu verstehen.

   SO GEHT NICHTS KAPUTT:
   1. Jeder Text steht zwischen zwei geraden Anführungszeichen:  "so"
   2. Im Text selbst nie gerade Anführungszeichen " benutzen.
      Nehmt stattdessen deutsche „so“ oder einfache 'so'.
      (Windows: „ = Alt+0132,  “ = Alt+0147 – oder einfach kopieren)
   3. Hinter jedem Eintrag steht ein Komma.
      Ein Komma zu viel ist egal, eins zu wenig nicht.
   4. Alles hinter // ist ein Kommentar: nur für euch, das Spiel ignoriert es.
   5. Speichern, dann im Browser F5 drücken.

   Wenn doch etwas schiefgeht, zeigt das Spiel einen roten Kasten
   und sagt euch, wie ihr die kaputte Zeile findet.
   ===================================================================== */


// ---------------------------------------------------------------------
// ANTWORTARTEN UND SPIELREGELN
// Jede Antwort in einer Szene hat eine "art". Hier steht, was sie bringt:
//   punkte = so viele Punkte gibt es dafür
//   hitze  = um so viel Prozent steigt der Hitze-Balken
//   ueberschrift = so beginnt das Feedback nach der Antwort
// ---------------------------------------------------------------------
const ANTWORTARTEN = {
  richtig: {
    punkte: 10,
    hitze: 0,
    ueberschrift: "Richtig!",
  },
  plausibel: {
    punkte: 0,
    hitze: 20,
    ueberschrift: "Nicht ganz …",
  },
  offensichtlich: {
    punkte: 0,
    hitze: 35,
    ueberschrift: "Oh nein!",
  },
};


// ---------------------------------------------------------------------
// TEXTE FÜR START, BUTTONS, BRAND UND ENDE
// ---------------------------------------------------------------------
const TEXTE = {
  // Startbildschirm
  spielTitel: "Lass nichts anbrennen",
  untertitel: "Dein erster Tag",
  startBild:  "bilder/titel.jpg",   // Titelbild. Leer lassen ("") = kein Titelbild
  einleitung: "Du bist neuer Azubi und erlebst deinen ersten Arbeitstag von 08:00 bis 14:00 Uhr im Büro. Überall lauern Brandgefahren. Erkennst du sie?",
  anleitung:  "Für jede richtige Entscheidung bekommst du 10 Punkte. Falsche Entscheidungen heizen den Hitze-Balken auf. Erreicht er 100 %, bricht ein Brand aus und du musst von vorne anfangen.",
  startButton: "Arbeitstag beginnen",

  // Während des Spiels
  weiterButton: "Weiter",
  richtigWaere: "Richtig wäre gewesen:",
  warum:        "Warum?",

  // Brand bricht aus! Kommt, wenn der Hitze-Balken 100 % erreicht.
  // Dann ist das Spiel vorbei und es geht von vorne los.
  brandUeberschrift: "Brand bricht aus!",
  brandTitel: "Dein Titel: Brandbeschleuniger",
  brandText: "Zu viele kleine Fehler haben sich aufgestaut, bis es zu heiß wurde. Zum Glück ist das nur ein Spiel: Du kannst deinen ersten Tag noch einmal von vorne beginnen. Im echten Leben gibt es diesen Neustart nicht.",

  // Endbildschirm
  endeUeberschrift: "Feierabend!",
  nochmalButton:    "Nochmal spielen",   // steht am Ende und nach einem Brand
};


// ---------------------------------------------------------------------
// TITEL AM ENDE
// Man bekommt den Titel mit der höchsten Grenze, die man erreicht hat.
// Beispiel: 50 Punkte → "Auf gutem Weg" (ab 40), aber noch nicht "Profi" (ab 70)
//
// Hinweis: Fünf falsche Antworten lösen immer einen Brand aus. Wer bis zum
// Ende kommt, hat deshalb mindestens 40 Punkte. Der Titel für einen Brand
// steht oben bei TEXTE unter brandTitel. Der Eintrag "ab 0" ist nur eine
// Absicherung, falls ihr die Spielregeln ändert.
// ---------------------------------------------------------------------
const TITEL = [
  { abPunkte: 70, titel: "Brandschutz-Profi" },
  { abPunkte: 40, titel: "Auf gutem Weg" },
  { abPunkte: 0,  titel: "Brandbeschleuniger" },
];


// ---------------------------------------------------------------------
// CREDITS (stehen auf dem Endbildschirm, jede Zeile einzeln)
// Achtung: Auf GitHub Pages kann das jeder lesen.
// ---------------------------------------------------------------------
const CREDITS = [
  "Ein Spiel von Niclas Rosenmüller und Marvin Sandtel",
  "Klasse Eit25-2, BBS-Lingen TG",
  "Fotos und Texte: eigene Aufnahmen und eigene Texte",
  "Programmiert mit Unterstützung von Claude Code",
  "Beitrag zum JWSL-Kreativwettbewerb „Lass nichts anbrennen!“ 2026/27",
];


// ---------------------------------------------------------------------
// DIE SZENEN
// Reihenfolge hier = Reihenfolge im Spiel.
//
// Jede Szene hat:
//   uhrzeit, titel, bild, situation, antworten, erklaerung
//
// Jede Antwort hat:
//   text     = steht auf dem Button
//   art      = "richtig", "plausibel" oder "offensichtlich"
//   reaktion = eigener Satz nach genau dieser Antwort (z. B. ein Gag).
//              Darf leer bleiben: ""
//
// Neue Szene? Einen kompletten Block von { bis }, kopieren und anpassen.
// ---------------------------------------------------------------------
const SZENEN = [

  // ----- Szene 1 -----------------------------------------------------
  {
    uhrzeit:   "08:00",
    titel:     "Dein Arbeitsplatz",
    bild:      "bilder/szene1.jpg",
    situation: "Unter dem Schreibtisch hängen drei Steckdosenleisten hintereinander. Dran: PC, Wasserkocher, Heizlüfter.",
    antworten: [
      {
        text:     "Noch eine Leiste fürs Handy dazustecken.",
        art:      "offensichtlich",
        reaktion: "",
      },
      {
        text:     "Heizlüfter und Wasserkocher abziehen und dem Ausbilder melden.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "„Läuft seit Jahren, passt schon.“",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Hintereinander gesteckte Leisten können überlasten und überhitzen. Elektrizität ist mit rund 30 % die häufigste Brandursache.",
  },

  // ----- Szene 2 -----------------------------------------------------
  {
    uhrzeit:   "09:30",
    titel:     "Der Flur",
    bild:      "bilder/szene2.jpg",
    situation: "Kartons von der Lieferung stehen vor dem Notausgang.",
    antworten: [
      {
        text:     "Kurz drumherum gehen, die holt bestimmt gleich jemand.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Das Altpapier gleich dazustellen.",
        art:      "offensichtlich",
        reaktion: "",
      },
      {
        text:     "Kartons wegräumen oder sofort melden, der Fluchtweg muss frei sein.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Im Brandfall bleiben oft nur wenige Minuten zur Flucht. Jeder Karton im Weg kostet Zeit.",
  },

  // ----- Szene 3 -----------------------------------------------------
  {
    uhrzeit:   "10:15",
    titel:     "Die Brandschutztür",
    bild:      "bilder/szene3.jpg",
    situation: "Ein Kollege hat die Brandschutztür mit einem Holzkeil offen geklemmt, „weil sie immer zufällt“.",
    antworten: [
      {
        text:     "Keil entfernen, die Tür muss zufallen können.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Keil drinlassen, ist ja praktischer.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Einen zweiten Keil dazu, hält besser.",
        art:      "offensichtlich",
        reaktion: "",
      },
    ],
    erklaerung: "Brandschutztüren sind selbstschließend und müssen geschlossen bleiben. Nur dann halten sie Feuer und Rauch auf, z. B. T30 = 30 Minuten.",
  },

  // ----- Szene 4 -----------------------------------------------------
  {
    uhrzeit:   "11:00",
    titel:     "Die Powerbank",
    bild:      "bilder/szene4.jpg",
    situation: "Deine Powerbank ist aufgebläht.",
    antworten: [
      {
        text:     "Weiter benutzen, sie lädt ja noch.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Ab in den Restmüll.",
        art:      "offensichtlich",
        reaktion: "",
      },
      {
        text:     "Nicht mehr benutzen, separat auf nicht brennbarer Unterlage lagern und an einer Akku-Sammelstelle abgeben.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Beschädigte Lithium-Ionen-Akkus können auch Stunden oder Tage später noch brennen. Sie gehören nicht in den Hausmüll.",
  },

  // ----- Szene 5 -----------------------------------------------------
  {
    uhrzeit:   "12:30",
    titel:     "Die Kaffeeküche",
    bild:      "bilder/szene5.jpg",
    situation: "Ein Kollege brät Spiegeleier, plötzlich brennt die Pfanne.",
    antworten: [
      {
        text:     "Wasser drüber!",
        art:      "offensichtlich",
        reaktion: "",
      },
      {
        text:     "Herd aus, Deckel drauf, ggf. Fettbrandlöscher.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Pfanne schnell zum Fenster tragen.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Wasser auf brennendes Fett führt zu einer Fettexplosion. Fettbrände gehören zur Brandklasse F.",
  },

  // ----- Szene 6 -----------------------------------------------------
  {
    uhrzeit:   "13:30",
    titel:     "Brandgeruch",
    bild:      "bilder/szene6.jpg",
    situation: "Aus dem Abstellraum dringt Rauch unter der Tür hervor.",
    antworten: [
      {
        text:     "Tür aufreißen und nachsehen.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Tür zu lassen, Handfeuermelder drücken bzw. 112 rufen und Kollegen warnen.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Erst mal eine Rundmail an alle schreiben.",
        art:      "offensichtlich",
        reaktion: "",
      },
    ],
    erklaerung: "Rauch ist gefährlicher als die Flammen. Schon wenige Atemzüge können bewusstlos machen.",
  },

  // ----- Szene 7 -----------------------------------------------------
  {
    uhrzeit:   "13:32",
    titel:     "Der Notruf",
    bild:      "bilder/szene7.jpg",
    situation: "Du wählst die 112. Was sagst du zuerst?",
    antworten: [
      {
        text:     "Wo der Notfall ist (Adresse, Gebäude, Stockwerk), dann die Fragen der Leitstelle abwarten und nicht auflegen.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "„Es brennt!“ rufen und schnell auflegen.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Erst den Chef fragen, ob du anrufen darfst.",
        art:      "offensichtlich",
        reaktion: "",
      },
    ],
    erklaerung: "„Industriestraße 15, 2. OG“ hilft der Feuerwehr, „irgendwo in der Stadt“ nicht. Die Leitstelle hat oft noch wichtige Anweisungen.",
  },

  // ----- Szene 8 -----------------------------------------------------
  {
    uhrzeit:   "13:35",
    titel:     "Alarm!",
    bild:      "bilder/szene8.jpg",
    situation: "Der Feueralarm geht los.",
    antworten: [
      {
        text:     "Den Aufzug nehmen, geht schneller.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Noch schnell Laptop und Jacke holen.",
        art:      "offensichtlich",
        reaktion: "",
      },
      {
        text:     "Den grünen Rettungszeichen folgen, Treppe nehmen, Türen schließen, zur Sammelstelle.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Aufzüge können im Brandfall stecken bleiben oder in verrauchte Etagen fahren.",
  },

];
