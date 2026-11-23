/* =====================================================================
   szenen.js  –  ALLE TEXTE UND EINSTELLUNGEN DES SPIELS
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
  // Zurzeit benutzt keine Szene diese Art. Sie ist für witzige,
  // offensichtlich falsche Antworten gedacht, falls ihr wieder welche einbaut.
  offensichtlich: {
    punkte: 0,
    hitze: 35,
    ueberschrift: "Oh nein!",
  },
};


// ---------------------------------------------------------------------
// ZEITLIMIT
// Pro Szene läuft ein Countdown. Wer schnell richtig antwortet,
// bekommt Bonuspunkte. Läuft die Zeit ab, zählt das wie eine falsche Antwort.
// ---------------------------------------------------------------------
const ZEIT = {
  sekunden: 25,    // so viel Zeit pro Szene. 0 = kein Zeitlimit (und kein Zeitbonus)
  bonusAlle: 5,    // je 5 übrige Sekunden gibt es 1 Bonuspunkt (nur bei richtiger Antwort)

  // Was passiert, wenn die Zeit abläuft:
  zuSpaet: {
    punkte: 0,
    hitze: 20,
    ueberschrift: "Zu langsam!",
    reaktion: "Im Ernstfall zählt jede Sekunde.",
  },
};


// ---------------------------------------------------------------------
// BESTENLISTE
// Wie ihr die Online-Bestenliste einrichtet, steht in README.md.
// ---------------------------------------------------------------------
const BESTENLISTE = {
  // Adresse eurer Firebase-Datenbank. Sie steht in der Firebase-Konsole
  // unter „Realtime Database“ → „Daten“ ganz oben (endet auf .firebasedatabase.app).
  // Nicht die Adresse aus der Adresszeile des Browsers nehmen!
  // Leer lassen ("") = die Bestenliste wird nur auf diesem Gerät gespeichert.
  adresse: "https://feuergame-b8f2c-default-rtdb.europe-west1.firebasedatabase.app",

  anzahl: 10,      // so viele Plätze werden angezeigt
};


// ---------------------------------------------------------------------
// TEXTE FÜR START, BUTTONS, BRAND UND ENDE
// ---------------------------------------------------------------------
const TEXTE = {
  // Startbildschirm
  spielTitel: "Lass nichts anbrennen",
  untertitel: "Dein erster Tag",
  startBild:  "bilder/titel.svg",   // Titelbild. Leer lassen ("") = kein Titelbild
  einleitung: "Du bist neuer Azubi und erlebst deinen ersten Arbeitstag im Büro. Überall lauern Brandgefahren. Erkennst du sie?",
  // Wenn ihr oben bei ZEIT oder ANTWORTARTEN etwas ändert, passt auch diesen Text an:
  anleitung:  "Für jede Situation hast du 25 Sekunden. Richtige Antworten bringen 10 Punkte, schnelle Antworten einen Zeitbonus. Falsche Entscheidungen und Zögern heizen den Hitze-Balken auf. Erreicht er 100 %, bricht ein Brand aus und du musst von vorne anfangen. Wer den Tag übersteht, kommt in die Bestenliste.",
  startButton: "Arbeitstag beginnen",
  // Steht unter dem Start-Button, wenn die Online-Datenbank eingetragen ist:
  statistikHinweis: "Für die Fehler-Statistik wird anonym gezählt, welche Antworten gewählt werden, ohne Namen. Gespeichert bei Google Firebase (Server in Belgien).",

  // Während des Spiels
  weiterButton: "Weiter",
  richtigWaere: "Richtig wäre gewesen:",
  warum:        "Warum?",
  zeitbonus:    "Zeitbonus",
  tonAus:       "Ton aus",
  tonAn:        "Ton an",

  // Brand bricht aus! Kommt, wenn der Hitze-Balken 100 % erreicht.
  // Dann ist das Spiel vorbei und es geht von vorne los.
  brandUeberschrift: "Brand bricht aus!",
  brandTitel: "Dein Titel: Brandbeschleuniger",
  brandText: "Zu viele kleine Fehler haben sich aufgestaut, bis es zu heiß wurde. Zum Glück ist das nur ein Spiel: Du kannst deinen ersten Tag noch einmal von vorne beginnen. Im echten Leben gibt es diesen Neustart nicht.",

  // Endbildschirm
  endeUeberschrift: "Feierabend!",
  nochmalButton:    "Nochmal spielen",   // steht am Ende und nach einem Brand

  // Link zur Info-Seite (im Menü, am Ende und nach einem Brand)
  infoLink:         "Wissen zum Brandschutz",
  infoBeschreibung: "Hintergrundwissen und Materialien der JWSL zum Lernen vor der Prüfung. Die Lösungen gibt es dort nach der Prüfung.",
  loesungenLink:    "Alle Lösungen ansehen",   // am Ende und nach einem Brand

  // Hauptmenü auf dem Startbildschirm
  menueUeberschrift:  "Lernen und Training",
  menueGesperrt:      "Die Trainingsspiele werden freigeschaltet, sobald du die Prüfung einmal bis zum Feierabend oder bis zum Brand gespielt hast.",
  menueGesperrtKarte: "Gesperrt",
  menueButton:        "Zum Hauptmenü",
  rekord:             "Dein Rekord:",

  // Bestenliste
  bestenlisteUeberschrift: "Bestenliste",
  nameFrage:        "Trag dich in die Bestenliste ein:",
  namePlatzhalter:  "Dein Spitzname",
  eintragenButton:  "Eintragen",
  eingetragen:      "Du bist eingetragen!",
  hinweisOnline:    "Dein Spitzname und deine Punkte sind danach für alle sichtbar. Sie werden bei Google Firebase gespeichert (Server in Belgien). Bitte nicht deinen echten vollen Namen verwenden.",
  hinweisLokal:     "Die Bestenliste wird nur auf diesem Gerät gespeichert.",
  bestenlisteLeer:  "Noch keine Einträge. Trag dich als Erstes ein!",
  bestenlisteFehler:"Die Bestenliste ist gerade nicht erreichbar. Versuch es später noch einmal.",
};


// ---------------------------------------------------------------------
// TRAININGSSPIELE IM HAUPTMENÜ
// Jedes Spiel ist eine eigene Seite. „rekord“ ist der Name, unter dem
// der Browser den persönlichen Rekord speichert (bitte nicht ändern).
// ---------------------------------------------------------------------
const MINISPIELE = [
  {
    titel:        "Finde die Mängel",
    beschreibung: "Suchbild: Im Büro stecken 8 Brandschutz-Mängel. Finde und behebe sie so schnell wie möglich.",
    seite:        "suchbild.html",
    rekord:       "lna-rekord-suchbild",
  },
  {
    titel:        "Feuerlöscher-Training",
    beschreibung: "Im Lagerraum brennt ein Papierkorb. Triff die richtigen Entscheidungen und lösche, bevor der Löscher leer ist.",
    seite:        "feuerloescher.html",
    rekord:       "lna-rekord-feuerloescher",
  },
  {
    titel:        "Häufigste Irrtümer",
    beschreibung: "Statistik: Bei welchen Situationen liegen die meisten Spieler falsch? Anonym gezählt, ohne Namen.",
    seite:        "statistik.html",
  },
];


// ---------------------------------------------------------------------
// FEUERLÖSCHER-TRAINING (feuerloescher.html)
// ---------------------------------------------------------------------
const FEUERLOESCHER = {
  titel:      "Feuerlöscher-Training",
  anleitung:  "Im Lagerraum brennt ein Papierkorb, die Flammen sind noch klein. Du hast einen Feuerlöscher. Triff die richtigen Entscheidungen und lösche das Feuer, bevor der Löscher leer ist. Die Zeit läuft, falsche Entscheidungen kosten 10 Sekunden.",
  startButton: "Los geht's",
  strafe:     10,   // Sekunden für eine falsche Entscheidung

  // Schritt 1
  frage1:        "Was tust du zuerst?",
  antwortAlarm:  "Alarm auslösen (Handfeuermelder)",
  antwortLoeschen: "Sofort mit dem Löschen anfangen",
  richtig1:      "Richtig: Erst alarmieren, dann löschen. So kommt Hilfe, auch wenn der Löschversuch nicht klappt.",
  falsch1:       "Erst alarmieren, dann löschen! Klappt der Löschversuch nicht, verlierst du sonst wertvolle Zeit. +10 Sekunden.",

  // Schritt 2
  frage2:        "Wo stellst du dich zum Löschen hin?",
  richtig2:      "Richtig: Den Fluchtweg im Rücken. Wird das Feuer zu groß, kommst du sofort raus.",
  falsch2:       "Dann steht das Feuer zwischen dir und der Tür. Stell dich so hin, dass der Fluchtweg in deinem Rücken liegt. +10 Sekunden.",
  platzText:     "Platz",

  // Schritt 3
  anleitung3:    "Halte gedrückt, um zu sprühen, und ziele mit Maus oder Finger. Tastatur: Pfeiltasten zielen, Leertaste sprühen.",
  feuer:         "Feuer",
  loeschmittel:  "Löschmittel",
  zeit:          "Zeit",
  tippGlut:      "Ziel tiefer: auf die Glut, nicht auf die Flammen!",
  tippStoesse:   "Kurze Stöße! Sonst stehst du in der Pulverwolke und verschwendest Löschmittel.",
  tippDaneben:   "Daneben. Ziel auf das Feuer.",

  // Ergebnis
  geschafft:     "Feuer gelöscht!",
  geschafftTipps: [
    "Brandstelle weiter beobachten: Glut kann wieder aufflammen.",
    "Benutzten Feuerlöscher nicht zurück an die Wand hängen, sondern melden, damit er neu gefüllt wird.",
  ],
  verloren:      "Der Löscher ist leer, es brennt noch!",
  verlorenText:  "Jetzt nicht weiter kämpfen: Raum verlassen, Tür hinter dir schließen und die Feuerwehr einweisen. Versuch es noch einmal: kurze Stöße, tief auf die Glut zielen.",
  neuerRekord:   "Neuer Rekord!",
  nochmal:       "Nochmal",
};


// ---------------------------------------------------------------------
// FEHLER-STATISTIK (statistik.html)
// Funktioniert nur mit Online-Datenbank (BESTENLISTE.adresse).
// ---------------------------------------------------------------------
const STATISTIK = {
  titel:         "Häufigste Irrtümer",
  einleitung:    "So haben alle Spielerinnen und Spieler in der Prüfung geantwortet, anonym gezählt. Oben stehen die Situationen, bei denen am häufigsten falsch geantwortet wurde.",
  laedtText:     "Statistik wird geladen …",
  anzahlText:    "Ausgewertet: {anzahl} Antworten",   // {anzahl} wird durch die Zahl ersetzt
  keineDaten:    "Noch keine Antworten gezählt. Spiel die Prüfung, dann erscheint hier die erste Statistik.",
  nichtOnline:   "Die Statistik braucht die Online-Datenbank. Tragt bei BESTENLISTE die Adresse ein (siehe README.md).",
  fehlerText:    "Die Statistik ist gerade nicht erreichbar. Versuch es später noch einmal.",
  falschText:    "falsch",
  antwortText:   "Antwort",     // Einzahl: „1 Antwort“
  antwortenText: "Antworten",
  richtigMarke:  "Richtig:",
  zeitText:      "Zeit abgelaufen",
};


// ---------------------------------------------------------------------
// SUCHBILD „FINDE DIE MÄNGEL“ (suchbild.html)
// Die „id“ verbindet den Text mit der Stelle im Bild – bitte nicht ändern.
// Titel und Erklärung dürft ihr frei umschreiben.
// ---------------------------------------------------------------------
const SUCHBILD = {
  titel:        "Finde die Mängel",
  anleitung:    "In diesem Büro stecken 8 Brandschutz-Mängel. Tippe sie an, um sie zu beheben. Die Zeit läuft! Ein falscher Tipper kostet 5 Sekunden, ein Tipp 15 Sekunden.",
  startButton:  "Los geht's",
  tippButton:   "Tipp (+15 s)",
  wischHinweis: "Wische über das Bild, um alles zu sehen.",   // nur auf dem Handy sichtbar
  gefunden:     "Gefunden",
  zeit:         "Zeit",
  keinMangel:   "Kein Mangel",
  strafeText:   "+5 Sekunden",
  endeUeberschrift: "Alle Mängel behoben!",
  neuerRekord:  "Neuer Rekord!",
  nochmal:      "Nochmal",

  strafeFalsch: 5,    // Sekunden für einen Tipper daneben
  strafeTipp:   15,   // Sekunden für einen Tipp

  maengel: [
    {
      id:         "kartons",
      titel:      "Kartons vor dem Notausgang",
      erklaerung: "Fluchtwege und Notausgänge müssen in voller Breite frei bleiben. Kartons versperren den Weg und können selbst brennen.",
    },
    {
      id:         "keil",
      titel:      "Verkeilte Brandschutztür",
      erklaerung: "Eine Brandschutztür hält Feuer und Rauch nur auf, wenn sie zufallen kann.",
    },
    {
      id:         "steckdosen",
      titel:      "Steckdosenleisten hintereinander",
      erklaerung: "Hintereinander gesteckte Leisten mit Heizlüfter können überlasten und überhitzen.",
    },
    {
      id:         "powerbank",
      titel:      "Aufgeblähte Powerbank auf Papier",
      erklaerung: "Ein beschädigter Akku kann jederzeit anfangen zu brennen. Nicht mehr benutzen, nicht auf Brennbarem lagern, an einer Akku-Sammelstelle abgeben.",
    },
    {
      id:         "loescher",
      titel:      "Zugestellter Feuerlöscher",
      erklaerung: "Feuerlöscher müssen jederzeit gut sichtbar und frei erreichbar sein. Im Ernstfall zählt jede Sekunde.",
    },
    {
      id:         "kerze",
      titel:      "Brennende Kerze am Vorhang",
      erklaerung: "Offenes Feuer direkt neben Vorhang und Papier: Zündquelle und brennbarer Stoff sind schon zusammen.",
    },
    {
      id:         "schild",
      titel:      "Verdecktes Rettungszeichen",
      erklaerung: "Das grüne Rettungszeichen zeigt im Ernstfall den Weg nach draußen. Es darf nie verdeckt sein.",
    },
    {
      id:         "akku",
      titel:      "E-Bike-Akku lädt im Flur",
      erklaerung: "Flure sind Fluchtwege. Akkus dort weder laden noch abstellen.",
    },
  ],
};


// ---------------------------------------------------------------------
// TITEL AM ENDE
// Man bekommt den Titel mit der höchsten Grenze, die man erreicht hat.
// Beispiel: 120 Punkte → "Auf gutem Weg" (ab 110), aber noch nicht "Profi" (ab 150)
//
// Höchstpunktzahl: 13 Szenen × (10 Punkte + 5 Zeitbonus) = 195.
// Wer den Tag übersteht, hat mindestens 90 Punkte, denn fünf Fehler
// lösen immer einen Brand aus. Der Titel für einen Brand steht bei TEXTE.
// ---------------------------------------------------------------------
const TITEL = [
  { abPunkte: 150, titel: "Brandschutz-Profi" },
  { abPunkte: 110, titel: "Auf gutem Weg" },
  { abPunkte: 0,   titel: "Gerade noch mal gut gegangen" },
];


// ---------------------------------------------------------------------
// CREDITS (stehen auf dem Endbildschirm, jede Zeile einzeln)
// Achtung: Auf GitHub Pages kann das jeder lesen.
// ---------------------------------------------------------------------
const CREDITS = [
  "Ein Spiel von Niclas Rosenmüller und Marvin Sandtel",
  "Klasse Eit25-2, BBS-Lingen TG",
  "Programmiert mit Unterstützung von Claude Code",
  "Animationen und Textentwürfe: erstellt mit Claude Code",
  "Beitrag zum JWSL-Kreativwettbewerb „Lass nichts anbrennen!“ 2026/27",
];


// ---------------------------------------------------------------------
// DIE SZENEN
// Reihenfolge hier = Reihenfolge im Spiel.
// Die Antworten mischt das Spiel bei jedem Durchgang neu.
//
// Jede Szene hat:
//   uhrzeit, titel, bild, situation, antworten, erklaerung
//
// Jede Antwort hat:
//   text     = steht auf dem Button
//   art      = "richtig", "plausibel" oder "offensichtlich"
//              Tipp: Die richtige Antwort nicht länger oder genauer formulieren
//              als die falschen, sonst errät man sie. Die Begründung gehört
//              in die Erklärung.
//   reaktion = eigener Satz nach genau dieser Antwort (z. B. ein Gag).
//              Darf leer bleiben: ""
//
// Neue Szene? Einen kompletten Block von { bis }, kopieren und anpassen.
// ---------------------------------------------------------------------
const SZENEN = [

  // ----- Szene 1 -----------------------------------------------------
  {
    uhrzeit:   "08:00",
    titel:     "Die Ankunft",
    bild:      "bilder/szene1.svg",
    situation: "Du kommst mit dem E-Bike zur Arbeit, der Akku ist fast leer. Im Treppenhaus neben dem Eingang ist eine freie Steckdose.",
    antworten: [
      {
        text:     "Nachfragen, wo Akkus geladen werden dürfen, und ihn dort mit dem Original-Ladegerät laden.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Im Treppenhaus laden, da steht er niemandem im Weg.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Das Ladegerät vom Kollegen leihen. Es hat den gleichen Stecker und lädt sogar schneller.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Lithium-Ionen-Akkus können beim Laden in Brand geraten. Treppenhäuser und Flure sind Fluchtwege und müssen frei von allem bleiben, was brennen kann. Nur mit dem passenden Original-Ladegerät laden und nicht unbeaufsichtigt.",
  },

  // ----- Szene 2 -----------------------------------------------------
  {
    uhrzeit:   "08:15",
    titel:     "Dein Arbeitsplatz",
    bild:      "bilder/szene2.svg",
    situation: "Unter dem Schreibtisch hängen drei Steckdosenleisten hintereinander. Dran: PC, Wasserkocher, Heizlüfter.",
    antworten: [
      {
        text:     "Die drei Leisten durch eine große Leiste mit Überspannungsschutz ersetzen.",
        art:      "plausibel",
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
    erklaerung: "Hintereinander gesteckte Leisten können überlasten und überhitzen. Heizlüfter und Wasserkocher brauchen so viel Strom, dass sie zusammen auch eine einzelne große Leiste überlasten können. Ein Überspannungsschutz hilft nur gegen Spannungsspitzen, nicht gegen Überlastung. Elektrizität ist mit rund 30 % die häufigste Brandursache.",
  },

  // ----- Szene 3 -----------------------------------------------------
  {
    uhrzeit:   "09:00",
    titel:     "Die Unterweisung",
    bild:      "bilder/szene3.svg",
    situation: "Dein Ausbilder zeigt dir den Flucht- und Rettungsplan neben der Bürotür. Was musst du dir darauf vor allem merken?",
    antworten: [
      {
        text:     "Wo ich gerade bin, wie ich am schnellsten nach draußen komme und wo die Sammelstelle ist.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Wo die Feuerlöscher hängen. Der Weg nach draußen steht im Notfall ja auf den Schildern.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Nichts Besonderes. Im Notfall gehe ich einfach mit den Kollegen mit.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Flucht- und Rettungspläne zeigen deinen Standort, die Fluchtwege, Notausgänge, Feuerlöscher und die Sammelstelle. Wer den Weg vorher kennt, verliert im Ernstfall keine Zeit, auch wenn Rauch die Sicht nimmt oder die Kollegen nicht da sind.",
  },

  // ----- Szene 4 -----------------------------------------------------
  {
    uhrzeit:   "09:30",
    titel:     "Der Flur",
    bild:      "bilder/szene4.svg",
    situation: "Kartons von der Lieferung stehen vor dem Notausgang.",
    antworten: [
      {
        text:     "Kurz drumherum gehen, die holt bestimmt gleich jemand.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Die Kartons ordentlich an die Wand neben der Tür stapeln, damit ein Durchgang frei bleibt.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Die Kartons sofort selbst wegräumen oder es dem Ausbilder melden.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Fluchtwege und Notausgänge müssen in voller Breite frei bleiben. Auch ordentlich gestapelte Kartons engen sie ein und können selbst brennen. Im Brandfall bleiben oft nur wenige Minuten zur Flucht, jedes Hindernis kostet Zeit.",
  },

  // ----- Szene 5 -----------------------------------------------------
  {
    uhrzeit:   "10:15",
    titel:     "Die Brandschutztür",
    bild:      "bilder/szene5.svg",
    situation: "Ein Kollege hat die Brandschutztür mit einem Holzkeil offen geklemmt, „weil sie immer zufällt“.",
    antworten: [
      {
        text:     "Den Keil entfernen und dem Kollegen erklären, warum das wichtig ist.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Den Keil tagsüber drinlassen, solange viele Leute durchgehen, und abends wegnehmen.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Den Keil drinlassen, aber ein Schild „Bei Alarm Keil entfernen“ an die Tür hängen.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Brandschutztüren sind selbstschließend und müssen geschlossen bleiben. Nur dann halten sie Feuer und Rauch auf, z. B. T30 = 30 Minuten. Im Ernstfall denkt niemand an den Keil, und Rauch breitet sich oft schon aus, bevor Alarm kommt. Soll eine Brandschutztür offen stehen, braucht sie eine zugelassene Feststellanlage, die bei Rauch automatisch schließt.",
  },

  // ----- Szene 6 -----------------------------------------------------
  {
    uhrzeit:   "11:00",
    titel:     "Die Powerbank",
    bild:      "bilder/szene6.svg",
    situation: "Deine Powerbank ist aufgebläht.",
    antworten: [
      {
        text:     "Nur noch laden, wenn du daneben sitzt, bis du eine neue hast.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Erst mal in die Schreibtischschublade legen, bis du Zeit hast, sie zu entsorgen.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Nicht mehr benutzen und an einer Akku-Sammelstelle abgeben.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Ein aufgeblähter Akku ist beschädigt und kann auch Stunden oder Tage später noch brennen, auch ohne Laden. Bis zur Abgabe an einer Akku-Sammelstelle gehört er allein auf eine nicht brennbare Unterlage, nicht zwischen Papier in eine Schublade. In den Hausmüll darf er nie.",
  },

  // ----- Szene 7 -----------------------------------------------------
  {
    uhrzeit:   "11:45",
    titel:     "Der Kopierraum",
    bild:      "bilder/szene7.svg",
    situation: "Im Kopierraum brennt ein Papierkorb, die Flammen sind noch klein. Neben der Tür hängt ein Feuerlöscher. Ein Kollege ist bei dir.",
    antworten: [
      {
        text:     "Den Kollegen Alarm geben lassen, dann mit dem Rücken zur Tür in kurzen Stößen auf die Glut löschen.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Den Löscher voll aufdrehen und auf die Flammenspitzen halten, bis alles aus ist.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Den brennenden Papierkorb schnell auf den Flur tragen, weg von den Papierstapeln.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Bei einem kleinen Brand gilt: erst alarmieren, dann löschen, und nur, wenn du dich nicht selbst gefährdest. Halte den Fluchtweg im Rücken, ziele auf die Glut statt auf die Flammen und lösche in kurzen Stößen. Brennende Gegenstände nie herumtragen.",
  },

  // ----- Szene 8 -----------------------------------------------------
  {
    uhrzeit:   "12:30",
    titel:     "Die Kaffeeküche",
    bild:      "bilder/szene8.svg",
    situation: "Ein Kollege brät Spiegeleier, plötzlich brennt die Pfanne.",
    antworten: [
      {
        text:     "Ein nasses Geschirrtuch über die Pfanne werfen.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Herd aus und einen Deckel drauflegen.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Die Pfanne schnell zur Spüle oder zum Fenster tragen.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Wasser auf brennendem Fett verdampft schlagartig und reißt das Fett mit: eine Fettexplosion. Das gilt auch für das Wasser in einem nassen Tuch. Ein Deckel nimmt dem Feuer den Sauerstoff, alternativ hilft ein Fettbrandlöscher (Brandklasse F). Brennende Pfannen nie tragen.",
  },

  // ----- Szene 9 -----------------------------------------------------
  {
    uhrzeit:   "12:35",
    titel:     "Erste Hilfe",
    bild:      "bilder/szene9.svg",
    situation: "Der Kollege aus der Kaffeeküche hat sich an der heißen Pfanne eine kleine Brandwunde an der Hand geholt.",
    antworten: [
      {
        text:     "Die Hand 10 bis 15 Minuten unter handwarmes Wasser halten.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Eiswürfel aus dem Gefrierfach drauf, dann kühlt es am schnellsten.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Eine kühlende Creme oder Brandsalbe dick auftragen und abdecken.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Kleine Brandwunden 10 bis 15 Minuten mit handwarmem Wasser (ca. 15 bis 20 °C) kühlen. Eis verengt die Blutgefäße und kann die Haut zusätzlich schädigen. Cremes, Salben und Hausmittel gehören nicht auf eine frische Brandwunde. Große Brandwunden nicht kühlen, sondern keimfrei abdecken und den Rettungsdienst rufen.",
  },

  // ----- Szene 10 ----------------------------------------------------
  {
    uhrzeit:   "13:30",
    titel:     "Brandgeruch",
    bild:      "bilder/szene10.svg",
    situation: "Aus dem Abstellraum dringt Rauch unter der Tür hervor.",
    antworten: [
      {
        text:     "Die Tür vorsichtig einen Spalt öffnen, um zu sehen, ob du noch löschen kannst.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Tür zu lassen, sofort Alarm auslösen und die anderen im Flur warnen.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Erst mit der Hand fühlen, ob die Tür warm ist, und nur dann Alarm geben.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Rauch unter der Tür heißt: Es brennt. Dann sofort Alarm auslösen (Handfeuermelder oder 112) und warnen, ohne erst etwas zu prüfen. Öffnest du die Tür, strömen Rauch und Hitze heraus und das Feuer bekommt frischen Sauerstoff. Rauch ist gefährlicher als die Flammen: Schon wenige Atemzüge können bewusstlos machen.",
  },

  // ----- Szene 11 ----------------------------------------------------
  {
    uhrzeit:   "13:32",
    titel:     "Der Notruf",
    bild:      "bilder/szene11.svg",
    situation: "Du wählst die 112. Was sagst du zuerst?",
    antworten: [
      {
        text:     "Zuerst sagen, wo genau es brennt, und dann auf die Fragen der Leitstelle warten.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Zuerst deinen Namen und deine Firma nennen, damit die Leitstelle weiß, wer anruft.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Kurz alles schildern und gleich auflegen, damit die Feuerwehr sofort losfahren kann.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Das Wichtigste zuerst: wo der Notfall ist. „Industriestraße 15, 2. OG“ hilft der Feuerwehr, „irgendwo in der Stadt“ nicht. Bricht die Verbindung danach ab, weiß die Leitstelle trotzdem, wohin. Dann nicht auflegen: Die Leitstelle stellt Fragen und gibt oft wichtige Anweisungen.",
  },

  // ----- Szene 12 ----------------------------------------------------
  {
    uhrzeit:   "13:35",
    titel:     "Alarm!",
    bild:      "bilder/szene12.svg",
    situation: "Der Feueralarm geht los.",
    antworten: [
      {
        text:     "Mit dem Aufzug nach unten fahren, das Feuer ist ja in einem anderen Stockwerk.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Erst am Platz warten, bis jemand sagt, ob es nur eine Übung ist.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Über die Treppe raus, Türen hinter dir schließen, zur Sammelstelle.",
        art:      "richtig",
        reaktion: "",
      },
    ],
    erklaerung: "Jeder Alarm gilt als Ernstfall, auch wenn es eine Übung sein könnte. Aufzüge können im Brandfall stecken bleiben oder in verrauchte Etagen fahren. Den grünen Rettungszeichen über die Treppe folgen und Türen schließen, damit sich der Rauch nicht ausbreitet.",
  },

  // ----- Szene 13 ----------------------------------------------------
  {
    uhrzeit:   "13:45",
    titel:     "An der Sammelstelle",
    bild:      "bilder/szene13.svg",
    situation: "Alle stehen an der Sammelstelle. Deine Kollegin aus dem Büro nebenan fehlt.",
    antworten: [
      {
        text:     "Sofort der Einsatzleitung oder der Feuerwehr sagen, wer fehlt und wo sie zuletzt war.",
        art:      "richtig",
        reaktion: "",
      },
      {
        text:     "Schnell selbst zurück ins Gebäude laufen und nachsehen, du kennst ja den Weg.",
        art:      "plausibel",
        reaktion: "",
      },
      {
        text:     "Erst mal abwarten, sie ist bestimmt durch einen anderen Ausgang raus.",
        art:      "plausibel",
        reaktion: "",
      },
    ],
    erklaerung: "Die Feuerwehr ist mit Atemschutz ausgerüstet und kann gezielt suchen, wenn sie weiß, wer fehlt und wo die Person zuletzt war. Wer selbst zurückläuft, bringt sich in Lebensgefahr und wird womöglich selbst vermisst.",
  },

];
