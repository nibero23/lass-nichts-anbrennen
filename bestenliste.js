/* =====================================================================
   bestenliste.js  –  DIE BESTENLISTE
   =====================================================================
   Zwei Möglichkeiten, eingestellt in szenen.js unter BESTENLISTE:

   1. Online (adresse eingetragen):
      Die Einträge liegen in einer Firebase-Datenbank von Google.
      Das Spiel spricht sie direkt über das Internet an (fetch),
      ganz ohne zusätzliche Bibliothek.

   2. Nur auf diesem Gerät (adresse leer):
      Die Einträge liegen im Speicher des Browsers (localStorage).

   Sortiert wird nach Punkten. Bei gleicher Punktzahl gewinnt,
   wer insgesamt weniger Zeit gebraucht hat.
   ===================================================================== */

"use strict";

const LOKALER_SPEICHER = "lna-bestenliste";

// Der Durchgang, der gerade eingetragen werden kann: { punkte, sekunden }
let offenerEintrag = null;


function istOnline() {
  return BESTENLISTE.adresse !== "";
}

// Adresse ohne Schrägstrich am Ende, plus Name der Liste in der Datenbank
function datenbankAdresse() {
  return BESTENLISTE.adresse.replace(/\/+$/, "") + "/bestenliste.json";
}

// Beste zuerst: mehr Punkte, bei Gleichstand weniger Sekunden
function sortiere(liste) {
  return liste.slice().sort(function (a, b) {
    return (b.punkte - a.punkte) || (a.sekunden - b.sekunden);
  });
}


// ---------------------------------------------------------------------
// LADEN
// ---------------------------------------------------------------------
async function ladeBestenliste() {
  let liste;

  if (istOnline()) {
    // Firebase: die 50 Einträge mit den meisten Punkten holen
    const antwort = await fetch(datenbankAdresse() + '?orderBy="punkte"&limitToLast=50');
    if (!antwort.ok) {
      throw new Error("Datenbank antwortet mit Fehler " + antwort.status + ": " + await antwort.text());
    }
    const daten = await antwort.json();
    liste = Object.values(daten || {});
  } else {
    liste = ladeLokal();
  }

  return sortiere(liste).slice(0, BESTENLISTE.anzahl);
}

function ladeLokal() {
  try {
    return JSON.parse(localStorage.getItem(LOKALER_SPEICHER)) || [];
  } catch (fehler) {
    return [];
  }
}


// ---------------------------------------------------------------------
// SPEICHERN
// ---------------------------------------------------------------------
async function speichereEintrag(eintrag) {
  if (istOnline()) {
    const antwort = await fetch(datenbankAdresse(), {
      method: "POST",
      body: JSON.stringify({
        name: eintrag.name,
        punkte: eintrag.punkte,
        sekunden: eintrag.sekunden,
        datum: { ".sv": "timestamp" },   // Firebase setzt hier die Uhrzeit des Servers ein
      }),
    });
    if (!antwort.ok) {
      throw new Error("Speichern fehlgeschlagen, Fehler " + antwort.status + ": " + await antwort.text());
    }
  } else {
    // Lokal: nur die besten 50 aufheben
    const liste = sortiere(ladeLokal().concat([eintrag])).slice(0, 50);
    localStorage.setItem(LOKALER_SPEICHER, JSON.stringify(liste));
  }
}


// ---------------------------------------------------------------------
// ANZEIGEN
// ---------------------------------------------------------------------

// Macht aus 263.4 Sekunden „4:23 min“
function formatiereZeit(sekunden) {
  const ganz = Math.round(sekunden);
  const minuten = Math.floor(ganz / 60);
  const rest = String(ganz % 60).padStart(2, "0");
  return minuten + ":" + rest + " min";
}

function zeigeListe(liste, eigenerEintrag) {
  const zeilen = document.getElementById("bestenliste-zeilen");
  zeilen.replaceChildren();

  document.getElementById("bestenliste").hidden = (liste.length === 0);
  zeigeText("bestenliste-meldung", liste.length === 0 ? TEXTE.bestenlisteLeer : "");

  let eigenerGefunden = false;
  liste.forEach(function (eintrag, i) {
    const zeile = document.createElement("tr");
    const werte = [(i + 1) + ".", eintrag.name, eintrag.punkte, formatiereZeit(eintrag.sekunden)];
    for (const wert of werte) {
      const zelle = document.createElement("td");
      zelle.textContent = wert;   // textContent: Namen werden nie als HTML ausgeführt
      zeile.appendChild(zelle);
    }

    // Den eigenen, gerade eingetragenen Platz hervorheben
    if (!eigenerGefunden && eigenerEintrag &&
        eintrag.name === eigenerEintrag.name &&
        eintrag.punkte === eigenerEintrag.punkte &&
        eintrag.sekunden === eigenerEintrag.sekunden) {
      zeile.className = "eigener-platz";
      eigenerGefunden = true;
    }
    zeilen.appendChild(zeile);
  });
}

async function aktualisiereListe(eigenerEintrag) {
  try {
    zeigeListe(await ladeBestenliste(), eigenerEintrag);
  } catch (fehler) {
    console.error(fehler);
    document.getElementById("bestenliste").hidden = true;
    zeigeText("bestenliste-meldung", TEXTE.bestenlisteFehler);
  }
}


// ---------------------------------------------------------------------
// ENDBILDSCHIRM: Formular vorbereiten und Liste laden
// Wird von spiel.js aufgerufen, wenn der Tag geschafft ist.
// ---------------------------------------------------------------------
function bereiteBestenlisteVor(punkte, sekunden) {
  offenerEintrag = { punkte: punkte, sekunden: Math.round(sekunden * 10) / 10 };

  document.getElementById("eintragen-form").hidden = false;
  document.getElementById("eintragen-button").disabled = false;
  zeigeText("eintragen-status", "");
  zeigeText("bestenliste-hinweis", istOnline() ? TEXTE.hinweisOnline : TEXTE.hinweisLokal);

  aktualisiereListe(null);
}


// Klick auf „Eintragen“
async function trageEin(ereignis) {
  ereignis.preventDefault();               // Formular soll die Seite nicht neu laden
  if (offenerEintrag === null) return;

  // Name säubern: Leerzeichen am Rand und Steuerzeichen weg, höchstens 20 Zeichen
  const name = document.getElementById("name-feld").value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 20);
  if (name === "") return;

  const eintrag = { name: name, punkte: offenerEintrag.punkte, sekunden: offenerEintrag.sekunden };
  const knopf = document.getElementById("eintragen-button");
  knopf.disabled = true;

  try {
    await speichereEintrag(eintrag);
    offenerEintrag = null;                  // pro Durchgang nur ein Eintrag
    document.getElementById("eintragen-form").hidden = true;
    zeigeText("eintragen-status", TEXTE.eingetragen);
    aktualisiereListe(eintrag);
  } catch (fehler) {
    console.error(fehler);
    knopf.disabled = false;
    zeigeText("eintragen-status", TEXTE.bestenlisteFehler);
  }
}


// Texte und Klick verbinden (einmal beim Laden, aufgerufen von spiel.js)
function initialisiereBestenliste() {
  document.getElementById("name-frage").textContent = TEXTE.nameFrage;
  document.getElementById("name-feld").placeholder = TEXTE.namePlatzhalter;
  document.getElementById("eintragen-button").textContent = TEXTE.eintragenButton;
  document.getElementById("bestenliste-ueberschrift").textContent = TEXTE.bestenlisteUeberschrift;
  document.getElementById("eintragen-form").addEventListener("submit", trageEin);
}
