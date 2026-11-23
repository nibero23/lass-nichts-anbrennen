/* =====================================================================
   statistik.js  –  DIE FEHLER-STATISTIK
   =====================================================================
   1. ZÄHLEN (in der Prüfung, index.html):
      Bei jeder Antwort wird in der Firebase-Datenbank ein Zähler um 1
      erhöht, z. B. „Szene 8, Antwort 1“. Es werden KEINE Namen und
      keine Kennungen gespeichert – nur Zahlen.

      In der Datenbank sieht das so aus:
        statistik / s8 / a1 = 17     (Szene 8, Antwort 1, 17-mal gewählt)
        statistik / s8 / zeit = 3    (Szene 8, 3-mal Zeit abgelaufen)
      Antwort 1, 2, 3 meint die Reihenfolge in szenen.js, nicht die
      gemischte Reihenfolge auf dem Bildschirm.

   2. ANZEIGEN (statistik.html):
      Liest alle Zähler und zeigt die Szenen sortiert nach Fehlerquote.

   Ohne Online-Datenbank (BESTENLISTE.adresse leer) wird nichts gezählt.
   ===================================================================== */

"use strict";

function statistikAdresse(pfad) {
  return BESTENLISTE.adresse.replace(/\/+$/, "") + "/statistik" + pfad + ".json";
}


// ---------------------------------------------------------------------
// 1. ZÄHLEN
//    szenenNummer: 1 bis 13
//    antwort:      "a1", "a2", "a3" (Reihenfolge in szenen.js) oder "zeit"
// ---------------------------------------------------------------------
function zaehleAntwort(szenenNummer, antwort) {
  if (BESTENLISTE.adresse === "") return;

  // { "a2": { ".sv": { "increment": 1 } } } bedeutet für Firebase:
  // „Erhöhe den Zähler a2 auf dem Server um 1.“ So gehen keine Klicks
  // verloren, auch wenn viele gleichzeitig spielen.
  const daten = {};
  daten[antwort] = { ".sv": { increment: 1 } };

  // Abschicken und nicht auf die Antwort warten: Das Spiel soll nie
  // wegen der Statistik hängen. Fehler landen nur in der Konsole (F12).
  fetch(statistikAdresse("/s" + szenenNummer), { method: "PATCH", body: JSON.stringify(daten) })
    .then(function (antwort) {
      if (!antwort.ok) console.warn("Statistik nicht gespeichert, Fehler " + antwort.status);
    })
    .catch(function (fehler) {
      console.warn("Statistik nicht gespeichert:", fehler);
    });
}


// ---------------------------------------------------------------------
// 2. ANZEIGEN (nur auf statistik.html)
// ---------------------------------------------------------------------

// Rechnet die Zähler einer Szene zusammen
function werteSzeneAus(szene, i, alleDaten) {
  const zaehler = alleDaten["s" + (i + 1)] || {};
  const antworten = szene.antworten.map(function (antwort, j) {
    return { text: antwort.text, richtig: antwort.art === "richtig", anzahl: zaehler["a" + (j + 1)] || 0 };
  });
  const zuSpaet = zaehler.zeit || 0;

  let gesamt = zuSpaet;
  let richtig = 0;
  for (const a of antworten) {
    gesamt = gesamt + a.anzahl;
    if (a.richtig) richtig = a.anzahl;
  }
  return {
    nummer: i + 1,
    szene: szene,
    antworten: antworten,
    zuSpaet: zuSpaet,
    gesamt: gesamt,
    fehlerquote: gesamt > 0 ? (gesamt - richtig) / gesamt : 0,
  };
}

function prozent(teil, ganzes) {
  return ganzes > 0 ? Math.round(teil / ganzes * 100) : 0;
}

// Eine Zeile mit Balken: Text, Balken, Anzahl
function baueBalken(text, anzahl, gesamt, art) {
  const zeile = document.createElement("div");
  zeile.className = "stat-zeile " + art;   // art: richtig, falsch oder zeit

  const beschriftung = document.createElement("div");
  beschriftung.className = "stat-text";
  beschriftung.textContent = text;

  const balken = document.createElement("div");
  balken.className = "stat-balken";
  const fuellung = document.createElement("div");
  fuellung.className = "stat-fuellung";
  fuellung.style.width = prozent(anzahl, gesamt) + "%";
  balken.appendChild(fuellung);

  const zahl = document.createElement("div");
  zahl.className = "stat-zahl";
  zahl.textContent = prozent(anzahl, gesamt) + " % (" + anzahl + ")";

  zeile.append(beschriftung, balken, zahl);
  return zeile;
}

function zeigeStatistik(alleDaten) {
  // Szenen mit den meisten Fehlern zuerst
  const auswertung = SZENEN.map(function (szene, i) {
    return werteSzeneAus(szene, i, alleDaten || {});
  }).sort(function (a, b) {
    return b.fehlerquote - a.fehlerquote;
  });

  const summe = auswertung.reduce(function (s, e) { return s + e.gesamt; }, 0);
  if (summe === 0) {
    zeigeText("stat-meldung", STATISTIK.keineDaten);
    return;
  }
  zeigeText("stat-meldung", STATISTIK.anzahlText.replace("{anzahl}", summe));

  const liste = element("stat-liste");
  liste.replaceChildren();
  for (const e of auswertung) {
    if (e.gesamt === 0) continue;

    const kasten = document.createElement("section");
    kasten.className = "kasten stat-szene";

    const titel = document.createElement("h3");
    titel.textContent = "Szene " + e.nummer + ": " + e.szene.titel;
    const quote = document.createElement("p");
    quote.className = "stat-quote";
    quote.textContent = Math.round(e.fehlerquote * 100) + " % " + STATISTIK.falschText +
                        " · " + e.gesamt + " " + (e.gesamt === 1 ? STATISTIK.antwortText : STATISTIK.antwortenText);
    kasten.append(titel, quote);

    for (const a of e.antworten) {
      const beschriftung = (a.richtig ? STATISTIK.richtigMarke + " " : "") + a.text;
      kasten.appendChild(baueBalken(beschriftung, a.anzahl, e.gesamt, a.richtig ? "richtig" : "falsch"));
    }
    if (e.zuSpaet > 0) {
      kasten.appendChild(baueBalken(STATISTIK.zeitText, e.zuSpaet, e.gesamt, "zeit"));
    }
    liste.appendChild(kasten);
  }
}

async function ladeStatistik() {
  try {
    const antwort = await fetch(statistikAdresse(""));
    if (!antwort.ok) throw new Error("Fehler " + antwort.status + ": " + await antwort.text());
    zeigeStatistik(await antwort.json());
  } catch (fehler) {
    console.error(fehler);
    zeigeText("stat-meldung", STATISTIK.fehlerText);
  }
}

// Start auf statistik.html
function initialisiereStatistik() {
  document.title = STATISTIK.titel + " – " + TEXTE.spielTitel;
  element("stat-titel").textContent = STATISTIK.titel;
  element("stat-einleitung").textContent = STATISTIK.einleitung;

  if (!wurdeGespielt()) {                   // zeigt Lösungen: erst nach der Prüfung
    element("gesperrt").hidden = false;
  } else if (BESTENLISTE.adresse === "") {  // ohne Online-Datenbank gibt es nichts zu zeigen
    zeigeText("stat-meldung", STATISTIK.nichtOnline);
  } else {
    zeigeText("stat-meldung", STATISTIK.laedtText);
    ladeStatistik();
  }
}
