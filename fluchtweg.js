/* =====================================================================
   fluchtweg.js  –  DER FLUCHTWEG-LAUF
   =====================================================================
   Ein eigenes Lauf-Spiel auf drei Bahnen durch einen Büroflur.
   Auf den Bahnen kommen Stationen entgegen: Mängel (beheben!) und
   Dinge, die in Ordnung sind (stehen lassen!). Nach dem Lauf geht der
   Feueralarm los, und man muss den richtigen Ausgang wählen.

   Das Spielfeld ist ein <canvas>: eine Zeichenfläche, auf die das
   Programm etwa 60-mal pro Sekunde alles neu malt (Flur, Stationen,
   Spielfigur). Weiter entfernte Dinge werden kleiner und näher an der
   Bildmitte gezeichnet – so entsteht der Eindruck von Tiefe.

   Texte, Punkte und Stationen stehen in szenen.js unter FLUCHTWEG,
   die Bilder der Stationen in fluchtweg-bilder.js.
   ===================================================================== */

"use strict";

const REKORD_SCHLUESSEL = "lna-rekord-fluchtweg";

// ----- Bild und Perspektive (Zeichenfläche ist 800 × 600) -----
const BREITE = 800;
const HOEHE = 600;
const MITTE_X = 400;        // hier liegt der Fluchtpunkt (waagerecht)
const HORIZONT = 210;       // hier liegt der Fluchtpunkt (senkrecht)
const BODEN_Y = 560;        // so weit unten ist der Boden direkt vor der Spielfigur
const DECKE_Y = 30;         // so weit oben ist die Decke direkt über der Spielfigur
const TIEFE = 10;           // wie schnell Dinge mit der Entfernung kleiner werden
const BAHN_ABSTAND = 210;   // Abstand der Bahnen direkt vor der Spielfigur
const FLUR_HALB = 340;      // halbe Flurbreite direkt vor der Spielfigur

// ----- Spielwerte (zum Ausprobieren und Feinabstimmen) -----
const SICHTWEITE = 60;      // so weit weg tauchen Stationen auf
const REICHWEITE = 12;      // so nah muss eine Station sein, damit man sie beheben kann
const BEWERTUNG_Z = 0.3;    // hier wird eine Station bewertet (sie ist „vorbei“)
const VORSCHAU_Z = 30;      // so weit reicht die Vorschau-Leiste
const START_TEMPO = 9;      // Einheiten pro Sekunde am Anfang
const TEMPO_ZUWACHS = 0.06; // so viel schneller pro Sekunde
const ABSTAND_START = 2.3;  // Sekunden zwischen zwei Stationen am Anfang …
const ABSTAND_MIN = 1.2;    // … und am Ende
const ANTEIL_MAENGEL = 0.6; // 60 % der Stationen sind Mängel

// ----- Spielstand -----
const bilder = {};          // fertig geladene Bilder der Stationen
let stationen = [];         // alle Stationen, die gerade unterwegs sind
let bahn = 1;               // auf welcher Bahn die Spielfigur ist: 0 links, 1 Mitte, 2 rechts
let bahnWeich = 1;          // gleitet weich zur Bahn (für die Bewegung beim Wechsel)
let punkte = 0;
let hitze = 0;
let zeit = 0;               // Sekunden seit dem Start
let strecke = 0;            // gelaufene Strecke (für die Bewegung von Boden und Beinen)
let tempo = START_TEMPO;
let naechsteStation = 0;    // wann die nächste Station erscheint
let phase = "lauf";         // lauf → alarm → finale → vorbei
let laeuft = false;
let letzteZeit = 0;
let behobenAnzahl = 0;      // behobene Mängel
let maengelAnzahl = 0;      // Mängel, die vorbeigekommen sind
let gemerkt = [];           // übersehene oder unnötig behobene Stationen (für das Ergebnis)
let brennt = false;         // Hitze 100 %: Feuer über dem Bild
let aktionBis = 0;          // bis wann der Arm zum Beheben ausgestreckt ist
let meldungsUhr = null;
let vorschauAlt = ["", "", ""];
let ctx = null;             // der „Pinsel“ der Zeichenfläche
const wenigBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ---------------------------------------------------------------------
// PERSPEKTIVE: Entfernung z → Größe und Position auf dem Bildschirm
// ---------------------------------------------------------------------
// Maßstab: direkt vor der Figur (z = 0) ist s = 1, weit weg fast 0
function s(z) {
  return 1 / (1 + z / TIEFE);
}

function bodenY(z) {
  return HORIZONT + (BODEN_Y - HORIZONT) * s(z);
}

function deckeY(z) {
  return HORIZONT - (HORIZONT - DECKE_Y) * s(z);
}

// Waagerechte Position einer Bahn (0, 1, 2 – auch Zwischenwerte beim Wechsel)
function bahnX(b, z) {
  return MITTE_X + (b - 1) * BAHN_ABSTAND * s(z);
}

// Ecke von Wand/Boden/Decke: seite -1 = links, +1 = rechts
function flurPunkt(seite, z, oben) {
  return { x: MITTE_X + seite * FLUR_HALB * s(z), y: oben ? deckeY(z) : bodenY(z) };
}


// ---------------------------------------------------------------------
// HILFSFUNKTIONEN
// ---------------------------------------------------------------------
function zeigeLaufBildschirm(id) {
  for (const bildschirm of document.querySelectorAll(".bildschirm")) {
    bildschirm.hidden = (bildschirm.id !== id);
  }
  element(id).querySelector("h1, h2").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function mischeListe(liste) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

function aktualisiereStatus() {
  element("punkte-anzeige").textContent = punkte;
  element("hitze-fuellung").style.clipPath = "inset(0 " + (100 - hitze) + "% 0 0)";
  element("hitze-fuellung").parentElement.setAttribute("aria-valuenow", hitze);
}

// Kurze Meldung unter dem Spielfeld (gut = grün, schlecht = orange, alarm = rot)
function zeigeMeldung(text, art) {
  const meldung = element("lauf-meldung");
  meldung.textContent = text;
  meldung.className = "lauf-meldung " + art;
  clearTimeout(meldungsUhr);
  if (text && art !== "alarm") {
    meldungsUhr = setTimeout(function () { meldung.textContent = ""; }, 2400);
  }
}

// Station für die Liste „Das solltest du dir merken“ (jede nur einmal)
function merke(ding) {
  if (!gemerkt.some(function (d) { return d.id === ding.id; })) gemerkt.push(ding);
}


// ---------------------------------------------------------------------
// BILDER LADEN
// Jede Zeichnung aus fluchtweg-bilder.js wird zu einem Bild gemacht,
// das die Zeichenfläche beliebig groß oder klein malen kann.
// ---------------------------------------------------------------------
function ladeBilder() {
  const auftraege = Object.keys(FLUCHTWEG_BILDER).map(function (id) {
    return new Promise(function (fertig) {
      const bild = new Image();
      bild.onload = fertig;
      bild.onerror = fertig;    // fehlt ein Bild, wird die Karte eben ohne Bild gezeichnet
      bild.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">' + FLUCHTWEG_BILDER[id] + "</svg>");
      bilder[id] = bild;
    });
  });
  return Promise.all(auftraege);
}


// ---------------------------------------------------------------------
// START
// ---------------------------------------------------------------------
function starteLauf() {
  stationen = [];
  bahn = 1;
  bahnWeich = 1;
  punkte = 0;
  hitze = 0;
  zeit = 0;
  strecke = 0;
  tempo = START_TEMPO;
  naechsteStation = 0.5;
  phase = "lauf";
  behobenAnzahl = 0;
  maengelAnzahl = 0;
  gemerkt = [];
  brennt = false;
  vorschauAlt = ["", "", ""];
  zeigeMeldung("", "");
  aktualisiereStatus();

  zeigeLaufBildschirm("lauf-spiel");
  laeuft = true;
  letzteZeit = performance.now();
  requestAnimationFrame(spielschleife);
}


// ---------------------------------------------------------------------
// STATIONEN
// ---------------------------------------------------------------------
function erzeugeStation() {
  const maengel = FLUCHTWEG.dinge.filter(function (d) { return d.mangel; });
  const gute = FLUCHTWEG.dinge.filter(function (d) { return !d.mangel; });
  const auswahl = Math.random() < ANTEIL_MAENGEL ? maengel : gute;
  const ding = auswahl[Math.floor(Math.random() * auswahl.length)];

  // Nur Bahnen nehmen, auf denen gerade hinten nichts steht
  const frei = [0, 1, 2].filter(function (b) {
    return !stationen.some(function (st) { return st.bahn === b && st.z > SICHTWEITE - 10; });
  });
  if (frei.length === 0) return;
  const b = frei[Math.floor(Math.random() * frei.length)];
  stationen.push({ ding: ding, bahn: b, z: SICHTWEITE, behoben: false, angefasst: false, bewertet: false });
}

// Im Finale: die drei Ausgänge in zufälliger Reihenfolge auf die drei Bahnen
function erzeugeAusgaenge() {
  const bahnen = mischeListe([0, 1, 2]);
  FLUCHTWEG.ausgaenge.forEach(function (ausgang, i) {
    stationen.push({ ausgang: ausgang, bahn: bahnen[i], z: SICHTWEITE, bewertet: true });
  });
}

// Eine Station ist an der Spielfigur vorbei: wurde ein Mangel übersehen?
function bewerte(st) {
  st.bewertet = true;
  // Behobene Mängel wurden schon beim Beheben gezählt (siehe behebe)
  if (!st.ding.mangel || st.behoben) return;
  maengelAnzahl = maengelAnzahl + 1;

  hitze = Math.min(100, hitze + FLUCHTWEG.hitzeFehler);
  merke(st.ding);
  spieleFalsch();
  zeigeMeldung(FLUCHTWEG.uebersehenText + " " + st.ding.name, "schlecht");
  aktualisiereStatus();
}


// ---------------------------------------------------------------------
// STEUERUNG: Bahn wechseln und beheben
// ---------------------------------------------------------------------
function wechsleBahn(richtung) {
  if (!laeuft || phase === "vorbei") return;
  bahn = Math.min(2, Math.max(0, bahn + richtung));
}

function behebe() {
  if (!laeuft || (phase !== "lauf" && phase !== "alarm")) return;
  aktionBis = performance.now() + 250;   // Arm kurz ausstrecken

  // Nächste Station auf der eigenen Bahn, die nah genug ist
  const kandidaten = stationen.filter(function (st) {
    return st.ding && st.bahn === bahn && !st.behoben && !st.angefasst &&
           st.z > BEWERTUNG_Z && st.z <= REICHWEITE;
  });
  if (kandidaten.length === 0) return;
  const st = kandidaten.reduce(function (a, b) { return a.z < b.z ? a : b; });

  if (st.ding.mangel) {
    st.behoben = true;
    punkte = punkte + FLUCHTWEG.punkteMangel;
    behobenAnzahl = behobenAnzahl + 1;
    maengelAnzahl = maengelAnzahl + 1;
    spieleRichtig();
    zeigeMeldung(FLUCHTWEG.behobenText + " " + st.ding.name, "gut");
  } else {
    // Das war in Ordnung – unnötig eingegriffen
    st.angefasst = true;
    hitze = Math.min(100, hitze + FLUCHTWEG.hitzeFehler);
    merke(st.ding);
    spieleFalsch();
    zeigeMeldung(FLUCHTWEG.inOrdnungText + " " + st.ding.name + ". " + st.ding.erklaerung, "schlecht");
  }
  aktualisiereStatus();
  if (hitze >= 100) beende("brand");
}

function verbindeSteuerung() {
  // Tastatur: ←/A und →/D wechseln die Bahn, ↑/W/Leertaste/Enter beheben
  document.addEventListener("keydown", function (e) {
    if (!laeuft || phase === "vorbei") return;
    const aufKnopf = (e.target.tagName === "BUTTON" || e.target.tagName === "A");
    const taste = e.key;
    if (taste === "ArrowLeft" || taste === "a" || taste === "A") {
      wechsleBahn(-1);
      e.preventDefault();
    } else if (taste === "ArrowRight" || taste === "d" || taste === "D") {
      wechsleBahn(1);
      e.preventDefault();
    } else if (taste === "ArrowUp" || taste === "w" || taste === "W" ||
               ((taste === " " || taste === "Enter") && !aufKnopf)) {
      // Leertaste/Enter auf einem Knopf löst schon den Knopf aus – nicht doppelt
      e.preventDefault();
      if (!e.repeat) behebe();
    }
  });

  // Maus und Finger auf dem Spielfeld: wischen = Bahn wechseln, tippen = beheben
  const feld = element("lauf-feld");
  let wischStart = null;
  feld.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    wischStart = e.clientX;
    feld.setPointerCapture(e.pointerId);
  });
  feld.addEventListener("pointerup", function (e) {
    if (wischStart === null) return;
    const weg = e.clientX - wischStart;
    wischStart = null;
    if (Math.abs(weg) > 30) {
      wechsleBahn(weg > 0 ? 1 : -1);
    } else {
      behebe();
    }
  });
  feld.addEventListener("pointercancel", function () { wischStart = null; });

  // Knöpfe unter dem Spielfeld
  element("knopf-links").addEventListener("click", function () { wechsleBahn(-1); });
  element("knopf-rechts").addEventListener("click", function () { wechsleBahn(1); });
  element("knopf-beheben").addEventListener("click", behebe);
}


// ---------------------------------------------------------------------
// DIE SPIELSCHLEIFE (etwa 60-mal pro Sekunde)
// ---------------------------------------------------------------------
function spielschleife(jetzt) {
  if (!laeuft) return;
  const dt = Math.min(0.1, (jetzt - letzteZeit) / 1000);   // Sekunden seit dem letzten Bild
  letzteZeit = jetzt;
  aktualisiere(dt);
  zeichne(jetzt);
  requestAnimationFrame(spielschleife);
}

function aktualisiere(dt) {
  bahnWeich = bahnWeich + (bahn - bahnWeich) * Math.min(1, dt * 12);
  if (phase === "vorbei") return;

  zeit = zeit + dt;
  tempo = START_TEMPO + TEMPO_ZUWACHS * zeit;
  strecke = strecke + tempo * dt;

  // Alle Stationen kommen näher
  for (const st of stationen) {
    st.z = st.z - tempo * dt;
    if (!st.bewertet && st.z <= BEWERTUNG_Z) bewerte(st);
  }
  stationen = stationen.filter(function (st) { return st.z > -3; });

  if (phase === "lauf") {
    if (zeit >= naechsteStation) {
      erzeugeStation();
      if (Math.random() < 0.3) erzeugeStation();   // manchmal zwei gleichzeitig
      naechsteStation = zeit + Math.max(ABSTAND_MIN, ABSTAND_START - 0.014 * zeit);
    }
    if (zeit >= FLUCHTWEG.laufSekunden) {
      phase = "alarm";
      starteAlarm(4);
      zeigeMeldung(FLUCHTWEG.alarmText, "alarm");
    }
  } else if (phase === "alarm") {
    // Erst wenn alle Stationen vorbei sind, kommen die Ausgänge
    if (stationen.every(function (st) { return st.z < 0; })) {
      erzeugeAusgaenge();
      phase = "finale";
    }
  } else if (phase === "finale") {
    const ausgang = stationen.find(function (st) { return st.ausgang && st.bahn === bahn; });
    if (ausgang && ausgang.z <= 1.5) {
      const richtig = ausgang.ausgang.richtig;
      if (richtig) {
        punkte = punkte + FLUCHTWEG.punkteFinale;
        spieleRichtig();
      } else {
        spieleFalsch();
      }
      aktualisiereStatus();
      beende(richtig ? "geschafft" : "falsch", ausgang.ausgang);
    }
  }

  aktualisiereVorschau();
  if (hitze >= 100) beende("brand");
}

// Vorschau-Leiste: Name der nächsten Station pro Bahn (ohne zu verraten, ob Mangel)
function aktualisiereVorschau() {
  for (let b = 0; b < 3; b++) {
    const naechste = stationen
      .filter(function (st) { return st.bahn === b && st.z > BEWERTUNG_Z && st.z < VORSCHAU_Z && !st.behoben && !st.angefasst; })
      .sort(function (x, y) { return x.z - y.z; })[0];
    const text = naechste ? (naechste.ausgang ? naechste.ausgang.name : naechste.ding.name) : "–";
    const feld = element("vorschau-" + b);
    if (text !== vorschauAlt[b]) {
      feld.textContent = text;
      vorschauAlt[b] = text;
    }
    feld.classList.toggle("eigene", b === bahn);
  }
}


// ---------------------------------------------------------------------
// ZEICHNEN
// ---------------------------------------------------------------------
function vieleck(punkteListe, farbe) {
  ctx.beginPath();
  ctx.moveTo(punkteListe[0].x, punkteListe[0].y);
  for (const p of punkteListe.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  ctx.fillStyle = farbe;
  ctx.fill();
}

function rundesRechteck(x, y, b, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + b, y, x + b, y + h, r);
  ctx.arcTo(x + b, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + b, y, r);
  ctx.closePath();
}

// Zerlegt einen Namen in höchstens drei Zeilen, die in die Karte passen
function umbrechen(text, maxBreite) {
  const zeilen = [];
  let zeile = "";
  for (const wort of text.split(" ")) {
    const probe = zeile ? zeile + " " + wort : wort;
    if (zeile && ctx.measureText(probe).width > maxBreite) {
      zeilen.push(zeile);
      zeile = wort;
    } else {
      zeile = probe;
    }
  }
  if (zeile) zeilen.push(zeile);
  return zeilen.slice(0, 3);
}

function zeichneFlur(jetzt) {
  const nah = -1;      // knapp hinter der Spielfigur (unterer Bildrand)
  const fern = 400;    // weit weg (fast der Fluchtpunkt)

  ctx.fillStyle = "#e3ded3";
  ctx.fillRect(0, 0, BREITE, HOEHE);
  // Decke, rechte Wand, Boden
  vieleck([flurPunkt(-1, nah, true), flurPunkt(1, nah, true), flurPunkt(1, fern, true), flurPunkt(-1, fern, true)], "#f2efe8");
  vieleck([flurPunkt(1, nah, false), flurPunkt(1, fern, false), flurPunkt(1, fern, true), flurPunkt(1, nah, true)], "#d9d3c6");
  vieleck([flurPunkt(-1, nah, false), flurPunkt(1, nah, false), flurPunkt(1, fern, false), flurPunkt(-1, fern, false)], "#9aa4ad");

  // Türen an beiden Wänden – sie wandern mit, das zeigt die Bewegung
  for (let k = 0; k < 8; k++) {
    for (const seite of [-1, 1]) {
      const z = k * 15 - (strecke % 15) + (seite < 0 ? 4 : 11);
      if (z < nah || z + 3 > fern) continue;
      const untenVorn = flurPunkt(seite, z, false);
      const untenHinten = flurPunkt(seite, z + 3, false);
      const obenVorn = { x: untenVorn.x, y: untenVorn.y + (deckeY(z) - untenVorn.y) * 0.68 };
      const obenHinten = { x: untenHinten.x, y: untenHinten.y + (deckeY(z + 3) - untenHinten.y) * 0.68 };
      vieleck([untenVorn, untenHinten, obenHinten, obenVorn], "#b08d63");
    }
  }

  // Bodenfliesen: Querlinien, die auf einen zukommen
  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 2;
  for (let k = 0; k < 40; k++) {
    const z = k * 5 - (strecke % 5);
    if (z < nah) continue;
    const a = flurPunkt(-1, z, false);
    const b = flurPunkt(1, z, false);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // Bahnlinien auf dem Boden
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 3;
  for (const grenze of [0.5, 1.5]) {
    ctx.beginPath();
    ctx.moveTo(bahnX(grenze, nah), bodenY(nah));
    ctx.lineTo(bahnX(grenze, fern), bodenY(fern));
    ctx.stroke();
  }

  // Deckenlampen
  for (let k = 0; k < 10; k++) {
    const z = k * 10 - (strecke % 10) + 2;
    if (z < nah) continue;
    const breite = 70 * s(z);
    const y1 = deckeY(z);
    const y2 = deckeY(z + 1.5);
    ctx.fillStyle = "#fffbe6";
    ctx.fillRect(MITTE_X - breite, y1, breite * 2, Math.max(1, y2 - y1));
  }

  // Beim Alarm: roter Schimmer
  if (phase === "alarm" || phase === "finale") {
    const staerke = wenigBewegung ? 0.15 : 0.12 + 0.08 * Math.sin(jetzt / 150);
    ctx.fillStyle = "rgba(255, 0, 0, " + staerke + ")";
    ctx.fillRect(0, 0, BREITE, HOEHE);
  }
}

function zeichneStation(st) {
  const sc = s(st.z);
  // Karten sind etwas schmaler als der Bahnabstand (210), damit sie sich nebeneinander nicht verdecken
  const breite = (st.ausgang ? 200 : 196) * sc;
  const hoehe = (st.ausgang ? 270 : 230) * sc;
  const x = bahnX(st.bahn, st.z);
  const unten = bodenY(st.z);
  const links = x - breite / 2;
  const oben = unten - hoehe;
  const erledigt = st.behoben || st.angefasst;

  // Erledigte Stationen werden blasser
  ctx.globalAlpha = erledigt ? 0.55 : 1;

  // Karte
  rundesRechteck(links, oben, breite, hoehe, 14 * sc);
  ctx.fillStyle = st.behoben ? "#e8f5e9" : st.angefasst ? "#fdecea" : "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2 * sc;
  ctx.strokeStyle = "#c8c8c8";
  ctx.stroke();

  // Orange umrandet: diese Station kann man jetzt beheben
  if (st.ding && st.bahn === bahn && !erledigt && st.z <= REICHWEITE && st.z > BEWERTUNG_Z && phase !== "vorbei") {
    ctx.lineWidth = 7 * sc;
    ctx.strokeStyle = "#ff9800";
    ctx.stroke();
  }

  // Bild
  const bild = bilder[st.ausgang ? st.ausgang.id : st.ding.id];
  if (bild && bild.complete && bild.naturalWidth > 0) {
    const bildBreite = breite * 0.84;
    ctx.drawImage(bild, x - bildBreite / 2, oben + hoehe * 0.05, bildBreite, bildBreite * 100 / 120);
  }

  // Name (nur, wenn groß genug zum Lesen)
  if (sc > 0.28) {
    const schrift = 20 * sc;
    ctx.font = "700 " + schrift + "px system-ui, 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#1f1f1f";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const name = st.ausgang ? st.ausgang.name : st.ding.name;
    const zeilen = umbrechen(name, breite * 0.9);
    const start = oben + hoehe * (st.ausgang ? 0.62 : 0.68);
    zeilen.forEach(function (zeile, i) { ctx.fillText(zeile, x, start + i * schrift * 1.15); });
  }

  // Behoben: grüner Haken
  if (st.behoben) {
    const r = 26 * sc;
    const hx = links + breite - r * 0.6;
    const hy = oben + r * 0.6;
    ctx.beginPath();
    ctx.arc(hx, hy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1e7d32";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.45, hy);
    ctx.lineTo(hx - r * 0.1, hy + r * 0.38);
    ctx.lineTo(hx + r * 0.5, hy - r * 0.35);
    ctx.lineWidth = 6 * sc;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Die Spielfigur von hinten. Gezeichnet um den Punkt (0, 0) = zwischen den Füßen,
// dann verschoben und verkleinert, damit sie die Stationen vor ihr nicht verdeckt.
const FIGUR_GROESSE = 0.78;

function zeichneFigur(jetzt) {
  const schritt = Math.sin(strecke * 1.6);
  ctx.save();
  ctx.translate(bahnX(bahnWeich, 0), 600);
  ctx.scale(FIGUR_GROESSE, FIGUR_GROESSE);

  // Schatten
  ctx.beginPath();
  ctx.ellipse(0, -6, 52, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fill();

  // Beine (abwechselnd länger und kürzer = Laufen)
  ctx.fillStyle = "#2f3b4c";
  ctx.fillRect(-28, -74, 20, 66 + schritt * 8);
  ctx.fillRect(8, -74, 20, 66 - schritt * 8);

  // Arme
  ctx.strokeStyle = "#355c8a";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-34, -140);
  ctx.lineTo(-50, -94 + schritt * 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(34, -140);
  if (jetzt < aktionBis) {
    ctx.lineTo(46, -198);   // Arm nach vorne oben: beheben
  } else {
    ctx.lineTo(50, -94 - schritt * 10);
  }
  ctx.stroke();

  // Körper (Jacke) mit hellem Streifen
  rundesRechteck(-38, -154, 76, 90, 18);
  ctx.fillStyle = "#355c8a";
  ctx.fill();
  ctx.fillStyle = "#f2c94c";
  ctx.fillRect(-38, -110, 76, 8);

  // Kopf von hinten: Ohren, Haare
  ctx.fillStyle = "#e0b48c";
  ctx.beginPath();
  ctx.arc(-25, -174, 6, 0, Math.PI * 2);
  ctx.arc(25, -174, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -178, 26, 0, Math.PI * 2);
  ctx.fillStyle = "#3b2a20";
  ctx.fill();

  ctx.restore();
}

function zeichne(jetzt) {
  zeichneFlur(jetzt);
  // Ferne Stationen zuerst, nahe darüber
  const sortiert = stationen.slice().sort(function (a, b) { return b.z - a.z; });
  for (const st of sortiert) {
    if (st.z > -1 && st.z < SICHTWEITE + 1) zeichneStation(st);
  }
  zeichneFigur(jetzt);

  // Brand: Glut steigt von unten über das Bild
  if (brennt) {
    const verlauf = ctx.createLinearGradient(0, HOEHE, 0, 0);
    verlauf.addColorStop(0, "rgba(255, 110, 0, 0.95)");
    verlauf.addColorStop(0.6, "rgba(214, 36, 0, 0.6)");
    verlauf.addColorStop(1, "rgba(120, 20, 0, 0.3)");
    ctx.fillStyle = verlauf;
    ctx.fillRect(0, 0, BREITE, HOEHE);
  }
}


// ---------------------------------------------------------------------
// ENDE UND ERGEBNIS
// art: "geschafft", "falsch" (falscher Ausgang) oder "brand"
// ---------------------------------------------------------------------
function beende(art, ausgang) {
  if (phase === "vorbei") return;
  phase = "vorbei";
  if (art === "brand") {
    brennt = true;
    starteAlarm(3);
  }
  setTimeout(function () {
    laeuft = false;
    zeigeErgebnis(art, ausgang);
  }, art === "brand" ? 1500 : 900);
}

function zeigeErgebnis(art, ausgang) {
  const titel = { geschafft: FLUCHTWEG.geschafft, falsch: FLUCHTWEG.falscherAusgang, brand: FLUCHTWEG.brand };
  element("lauf-ende-titel").textContent = titel[art];
  element("lauf-ende-text").textContent = ausgang ? ausgang.erklaerung : FLUCHTWEG.brandText;
  element("lauf-ende-punkte").textContent = punkte + " " + FLUCHTWEG.punkte;
  element("lauf-ende-statistik").textContent = FLUCHTWEG.statistik
    .replace("{behoben}", behobenAnzahl)
    .replace("{mangel}", maengelAnzahl);

  // Rekord nur, wer heil an der Sammelstelle ankommt
  if (art === "geschafft") {
    const neu = speichereRekord(REKORD_SCHLUESSEL, punkte, false);   // gemeinsam.js, mehr ist besser
    zeigeText("lauf-ende-rekord", neu ? FLUCHTWEG.neuerRekord : TEXTE.rekord + " " + ladeRekord(REKORD_SCHLUESSEL) + " " + FLUCHTWEG.punkte);
  } else {
    zeigeText("lauf-ende-rekord", "");
  }

  // Was man sich merken sollte
  const liste = element("lauf-merken-liste");
  liste.replaceChildren();
  for (const ding of gemerkt) {
    const punkt = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = ding.name + ": ";
    punkt.append(name, ding.erklaerung);
    liste.appendChild(punkt);
  }
  element("lauf-merken").hidden = (gemerkt.length === 0);

  zeigeLaufBildschirm("lauf-ende");
}


// ---------------------------------------------------------------------
// BEIM LADEN DER SEITE
// ---------------------------------------------------------------------
async function initialisiereLauf() {
  document.title = FLUCHTWEG.titel + " – " + TEXTE.spielTitel;
  element("lauf-titel").textContent = FLUCHTWEG.titel;
  element("lauf-anleitung").textContent = FLUCHTWEG.anleitung;
  element("lauf-steuerung").textContent = FLUCHTWEG.steuerung;
  element("lauf-start-button").textContent = FLUCHTWEG.startButton;
  element("knopf-links").textContent = FLUCHTWEG.links;
  element("knopf-rechts").textContent = FLUCHTWEG.rechts;
  element("knopf-beheben").textContent = FLUCHTWEG.beheben;
  element("text-punkte").textContent = FLUCHTWEG.punkte;
  element("text-hitze").textContent = FLUCHTWEG.hitze;
  element("lauf-merken-titel").textContent = FLUCHTWEG.uebersehenUeberschrift;
  element("lauf-nochmal").textContent = FLUCHTWEG.nochmal;
  const rekord = ladeRekord(REKORD_SCHLUESSEL);
  zeigeText("lauf-rekord", rekord === null ? "" : TEXTE.rekord + " " + rekord + " " + FLUCHTWEG.punkte);
  zeigeTonKnopf();
  aktualisiereStatus();

  // Zeichenfläche scharf machen: auf Bildschirmen mit hoher Pixeldichte
  // (z. B. Handys) mehr Bildpunkte verwenden, aber weiter in 800 × 600 rechnen
  const feld = element("lauf-feld");
  const dichte = window.devicePixelRatio || 1;
  feld.width = BREITE * dichte;
  feld.height = HOEHE * dichte;
  ctx = feld.getContext("2d");
  ctx.setTransform(dichte, 0, 0, dichte, 0, 0);

  await ladeBilder();
  verbindeSteuerung();
  element("lauf-start-button").addEventListener("click", starteLauf);
  element("lauf-nochmal").addEventListener("click", starteLauf);
  element("ton-button").addEventListener("click", schalteTon);

  zeigeLaufBildschirm("lauf-start");
}


// Los geht's: szenen.js prüfen, Sperre prüfen, dann starten
const gefundeneFehler = pruefeSzenenDatei();
if (gefundeneFehler.length > 0) {
  zeigeFehler(gefundeneFehler);
} else if (!wurdeGespielt()) {
  element("gesperrt").hidden = false;
} else {
  initialisiereLauf();
}
