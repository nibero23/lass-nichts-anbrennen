/* =====================================================================
   pruefung.js  –  PASST AUF TIPPFEHLER IN szenen.js AUF
   =====================================================================
   Fehlt in szenen.js ein Komma oder ein Anführungszeichen, zeigt der
   Browser sonst nur eine leere Seite. Diese Datei fängt das ab und zeigt
   einen roten Kasten mit einem verständlichen Hinweis.

   Sie wird VOR szenen.js geladen (siehe index.html), damit sie den
   Fehler schon beim Einlesen von szenen.js mitbekommt.
   ===================================================================== */

"use strict";


// ---------------------------------------------------------------------
// 1. Fehler beim Einlesen mitschreiben
//    Der Browser meldet jeden Fehler mit Dateiname und Zeilennummer.
//    Wir merken uns den ersten.
// ---------------------------------------------------------------------
let ladeFehler = null;

window.addEventListener("error", function (ereignis) {
  if (ladeFehler === null) {
    ladeFehler = {
      datei:   ereignis.filename ? ereignis.filename.split("/").pop() : "",
      zeile:   ereignis.lineno,
      meldung: ereignis.message,
    };
  }
});


// ---------------------------------------------------------------------
// 2. szenen.js prüfen
//    Gibt eine Liste mit Fehlermeldungen zurück.
//    Leere Liste = alles in Ordnung.
// ---------------------------------------------------------------------
function pruefeSzenenDatei() {

  // a) Wurde szenen.js überhaupt vollständig eingelesen?
  //    Bei einem Tippfehler gibt es diese Namen nicht, und schon der
  //    Zugriff darauf löst einen Fehler aus, den wir hier auffangen.
  try {
    if (!ANTWORTARTEN || !ZEIT || !BESTENLISTE || !TEXTE || !TITEL || !CREDITS || !SZENEN ||
        !MINISPIELE || !SUCHBILD || !STATISTIK || !FEUERLOESCHER) {
      return ["In szenen.js ist einer der Abschnitte leer."];
    }
  } catch (fehler) {
    return beschreibeLadeFehler(fehler);
  }

  // b) Ist der Inhalt vollständig?
  const meldungen = [];
  const erlaubteArten = Object.keys(ANTWORTARTEN);

  if (typeof ZEIT.sekunden !== "number" || ZEIT.sekunden < 0 ||
      typeof ZEIT.bonusAlle !== "number" || ZEIT.bonusAlle <= 0) {
    meldungen.push("ZEIT: sekunden und bonusAlle müssen Zahlen ohne Anführungszeichen sein, bonusAlle größer als 0.");
  }
  if (!ZEIT.zuSpaet || typeof ZEIT.zuSpaet.punkte !== "number" || typeof ZEIT.zuSpaet.hitze !== "number") {
    meldungen.push("ZEIT: Bei zuSpaet müssen punkte und hitze als Zahlen eingetragen sein.");
  }
  if (typeof BESTENLISTE.adresse !== "string" ||
      (BESTENLISTE.adresse !== "" && !/^https?:\/\//.test(BESTENLISTE.adresse))) {
    meldungen.push("BESTENLISTE: Die adresse muss leer sein oder mit https:// beginnen.");
  }

  if (!ANTWORTARTEN.richtig) {
    meldungen.push("Bei ANTWORTARTEN fehlt die Art „richtig“.");
  }
  for (const art of erlaubteArten) {
    const regel = ANTWORTARTEN[art];
    if (typeof regel.punkte !== "number" || typeof regel.hitze !== "number") {
      meldungen.push("Antwortart „" + art + "“: punkte und hitze müssen Zahlen ohne Anführungszeichen sein, z. B. hitze: 20,");
    }
  }

  if (!Array.isArray(MINISPIELE)) {
    meldungen.push("MINISPIELE muss eine Liste sein: [ … ]");
  }
  if (!Array.isArray(SUCHBILD.maengel) || SUCHBILD.maengel.length === 0) {
    meldungen.push("SUCHBILD: Bei maengel steht kein Mangel.");
  }

  if (!Array.isArray(TITEL) || TITEL.length === 0) {
    meldungen.push("Bei TITEL steht kein Titel.");
  }

  if (!Array.isArray(SZENEN) || SZENEN.length === 0) {
    meldungen.push("Bei SZENEN steht keine Szene.");
    return meldungen;
  }

  SZENEN.forEach(function (szene, i) {
    const name = "Szene " + (i + 1);

    if (!szene) {
      meldungen.push(name + " ist leer. Steht dort vielleicht ein doppeltes Komma?");
      return;
    }
    if (!szene.titel)      meldungen.push(name + ": „titel“ fehlt.");
    if (!szene.situation)  meldungen.push(name + ": „situation“ fehlt.");
    if (!szene.erklaerung) meldungen.push(name + ": „erklaerung“ fehlt.");

    if (!Array.isArray(szene.antworten) || szene.antworten.length < 2) {
      meldungen.push(name + ": braucht mindestens 2 Antworten.");
      return;
    }

    let anzahlRichtig = 0;
    szene.antworten.forEach(function (antwort, j) {
      const antwortName = name + ", Antwort " + (j + 1);
      if (!antwort) {
        meldungen.push(antwortName + " ist leer. Steht dort vielleicht ein doppeltes Komma?");
        return;
      }
      if (!antwort.text) {
        meldungen.push(antwortName + ": „text“ fehlt.");
      }
      if (!erlaubteArten.includes(antwort.art)) {
        meldungen.push(antwortName + ": art „" + antwort.art + "“ gibt es nicht. Erlaubt sind: " + erlaubteArten.join(", "));
      }
      if (antwort.art === "richtig") {
        anzahlRichtig = anzahlRichtig + 1;
      }
    });

    if (anzahlRichtig !== 1) {
      meldungen.push(name + ": Genau eine Antwort muss „richtig“ sein (gefunden: " + anzahlRichtig + ").");
    }
  });

  return meldungen;
}


// Macht aus dem Browser-Fehler einen verständlichen Hinweis.
//
// Wichtig: Öffnet man index.html per Doppelklick (Adresse beginnt mit file://),
// verrät der Browser dem Spiel aus Sicherheitsgründen keine Zeilennummer.
// Online (GitHub Pages) klappt es. Die Konsole (F12) zeigt sie immer.
function beschreibeLadeFehler(fehler) {
  console.error(fehler);
  const meldungen = [];

  if (ladeFehler !== null && ladeFehler.zeile > 0) {
    const browserMeldung = ladeFehler.meldung.replace("Uncaught ", "");
    meldungen.push(ladeFehler.datei + ", Zeile " + ladeFehler.zeile + "  (Meldung des Browsers: " + browserMeldung + ")");
    meldungen.push("Meistens fehlt ein Komma oder ein Anführungszeichen, in dieser Zeile oder in der Zeile davor.");
  } else {
    meldungen.push("szenen.js konnte nicht gelesen werden. Meistens fehlt ein Komma oder ein Anführungszeichen.");
    meldungen.push("So findet ihr die Zeile: F12 drücken und oben „Konsole“ wählen. Dort steht in Rot z. B. „szenen.js:153“. Die Zahl ist die Zeilennummer. Oft liegt der Fehler in der Zeile davor.");
    meldungen.push("Steht dort „ERR_FILE_NOT_FOUND“, liegt szenen.js nicht im selben Ordner wie index.html.");
  }
  return meldungen;
}


// ---------------------------------------------------------------------
// 3. Fehler anzeigen (roter Kasten oben auf der Seite)
// ---------------------------------------------------------------------
function zeigeFehler(meldungen) {
  const kasten = document.getElementById("fehler");

  const ueberschrift = document.createElement("h2");
  ueberschrift.textContent = "Fehler in szenen.js";

  const liste = document.createElement("ul");
  for (const meldung of meldungen) {
    const punkt = document.createElement("li");
    punkt.textContent = meldung;
    liste.appendChild(punkt);
  }

  kasten.replaceChildren(ueberschrift, liste);
  kasten.hidden = false;
  console.error("Fehler in szenen.js:\n" + meldungen.join("\n"));
}
