/* =====================================================================
   feuerloescher.js  –  DAS FEUERLÖSCHER-TRAINING
   =====================================================================
   Ablauf: Start → Schritt 1 (Was zuerst?) → Schritt 2 (Wo hinstellen?)
           → Schritt 3 (Löschen) → Ergebnis

   Schritt 3 ist ein kleines Echtzeit-Spiel. Etwa 60-mal pro Sekunde
   rechnet die „Spielschleife“ (requestAnimationFrame) neu:
     - Wird gesprüht? Dann sinkt das Löschmittel.
     - Wohin wird gezielt? Glut = starke Wirkung, Flammen = kaum Wirkung.
     - Wird zu lange am Stück gesprüht? Dann entsteht eine Pulverwolke
       und es wirkt viel schwächer (deshalb: kurze Stöße).
     - Wird nicht gesprüht? Dann wächst das Feuer langsam wieder.
   Gewertet wird die Zeit plus Strafsekunden.
   ===================================================================== */

"use strict";

const REKORD_SCHLUESSEL = "lna-rekord-feuerloescher";

// ----- Spielwerte (zum Ausprobieren und Feinabstimmen) -----
const START_STAERKE   = 60;    // so stark brennt es am Anfang (Prozent)
const WACHSTUM        = 4;     // so viel Prozent pro Sekunde wächst das Feuer ohne Löschen
const WIRKUNG_GLUT    = 30;    // Prozent pro Sekunde beim Zielen auf die Glut
const WIRKUNG_FLAMMEN = 5;     // Prozent pro Sekunde beim Zielen auf die Flammen
const VERBRAUCH       = 12;    // so viel Prozent Löschmittel pro Sekunde Sprühen (≈ 8 s)
const STOSS_DAUER     = 1.0;   // ab so vielen Sekunden am Stück entsteht die Pulverwolke
const DAUER_FAKTOR    = 0.25;  // so stark wirkt es dann nur noch

// ----- Bereiche in der Zeichnung (Koordinaten wie in feuerloescher.html) -----
const GLUT    = { x: 500, y: 578, rx: 125, ry: 60 };          // Ellipse um den Korbrand
const FLAMMEN = { x1: 360, x2: 640, y1: 240, y2: 548 };       // Rechteck über dem Korb
const DUESE   = { x: 812, y: 684 };                           // Spitze des Schlauchs

// ----- Spielstand -----
let strafe = 0;             // Strafsekunden aus Schritt 1 und 2
let staerke = 0;            // wie stark es brennt (0 bis 100)
let mittel = 100;           // Löschmittel übrig (0 bis 100)
let wolke = 0;              // wie dicht die Pulverwolke ist (0 bis 1)
let spruehtGerade = false;
let spruehBeginn = 0;       // wann der aktuelle Sprühstoß begonnen hat
let ziel = { x: 500, y: 450 };
let laeuft = false;         // läuft Schritt 3 gerade?
let vorbei = false;         // ist Schritt 3 entschieden (gelöscht oder leer)?
let loeschStart = 0;        // wann Schritt 3 begonnen hat
let endZeit = 0;            // Ergebnis in Sekunden
let letzteZeit = 0;
let richtigerPlatz = "A";   // welcher Buchstabe im Grundriss richtig ist (wird gemischt)
let letzterTipp = "";


// ---------------------------------------------------------------------
// HILFSFUNKTIONEN
// ---------------------------------------------------------------------
function zeigeFlBildschirm(id) {
  for (const bildschirm of document.querySelectorAll(".bildschirm")) {
    bildschirm.hidden = (bildschirm.id !== id);
  }
  element(id).querySelector("h1, h2").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// Bisherige Zeit: Löschzeit (ab Schritt 3) plus Strafsekunden
function zeitBisher() {
  if (vorbei) return endZeit;
  if (!laeuft) return strafe;
  return (performance.now() - loeschStart) / 1000 + strafe;
}

function aktualisiereUhr() {
  element("zeit-gesamt").textContent = formatiereZeit(zeitBisher());
}

// Liegt ein Punkt in der Ellipse der Glut?
function inGlut(p) {
  const dx = (p.x - GLUT.x) / GLUT.rx;
  const dy = (p.y - GLUT.y) / GLUT.ry;
  return dx * dx + dy * dy <= 1;
}

// Liegt ein Punkt im Bereich der Flammen?
function inFlammen(p) {
  return p.x >= FLAMMEN.x1 && p.x <= FLAMMEN.x2 && p.y >= FLAMMEN.y1 && p.y <= FLAMMEN.y2;
}

function zeigeTipp(text) {
  if (text === letzterTipp) return;   // nur ändern, wenn nötig (sonst flackert es)
  letzterTipp = text;
  element("fl-tipp").textContent = text;
}


// ---------------------------------------------------------------------
// START UND SCHRITT 1: Was tust du zuerst?
// ---------------------------------------------------------------------
function starteTraining() {
  strafe = 0;
  laeuft = false;
  vorbei = false;
  aktualisiereUhr();

  // Die zwei Antworten in zufälliger Reihenfolge
  const antworten = [
    { text: FEUERLOESCHER.antwortAlarm, richtig: true },
    { text: FEUERLOESCHER.antwortLoeschen, richtig: false },
  ];
  if (Math.random() < 0.5) antworten.reverse();

  const liste = element("fl-antworten1");
  liste.replaceChildren();
  for (const antwort of antworten) {
    const knopf = document.createElement("button");
    knopf.type = "button";
    knopf.className = "antwort";
    knopf.textContent = antwort.text;
    knopf.addEventListener("click", function () { beantworteSchritt1(antwort.richtig); });
    liste.appendChild(knopf);
  }
  element("fl-rueckmeldung1").hidden = true;
  element("fl-weiter1").hidden = true;
  zeigeFlBildschirm("fl-schritt1");
}

function beantworteSchritt1(richtig) {
  for (const knopf of element("fl-antworten1").querySelectorAll("button")) knopf.disabled = true;
  if (richtig) {
    starteAlarm(2);   // kurz den Feueralarm hören (ton.js)
    element("fl-rueckmeldung1-text").textContent = FEUERLOESCHER.richtig1;
  } else {
    strafe = strafe + FEUERLOESCHER.strafe;
    spieleFalsch();
    element("fl-rueckmeldung1-text").textContent = FEUERLOESCHER.falsch1;
  }
  element("fl-rueckmeldung1").className = "kasten fl-rueckmeldung " + (richtig ? "gut" : "schlecht");
  element("fl-rueckmeldung1").hidden = false;
  element("fl-weiter1").hidden = false;
  aktualisiereUhr();
}


// ---------------------------------------------------------------------
// SCHRITT 2: Wo stellst du dich hin?
// ---------------------------------------------------------------------
function zeigeSchritt2() {
  stoppeAlarm();
  // Zufällig festlegen, ob A oder B der richtige Platz (an der Tür) ist
  richtigerPlatz = Math.random() < 0.5 ? "A" : "B";
  element("platz-tuer").textContent = richtigerPlatz;
  element("platz-hinten").textContent = richtigerPlatz === "A" ? "B" : "A";

  for (const knopf of [element("platz-a"), element("platz-b")]) knopf.disabled = false;
  element("fl-rueckmeldung2").hidden = true;
  element("fl-weiter2").hidden = true;
  zeigeFlBildschirm("fl-schritt2");
}

function beantworteSchritt2(buchstabe) {
  const richtig = (buchstabe === richtigerPlatz);
  for (const knopf of [element("platz-a"), element("platz-b")]) knopf.disabled = true;
  if (richtig) {
    spieleRichtig();
    element("fl-rueckmeldung2-text").textContent = FEUERLOESCHER.richtig2;
  } else {
    strafe = strafe + FEUERLOESCHER.strafe;
    spieleFalsch();
    element("fl-rueckmeldung2-text").textContent = FEUERLOESCHER.falsch2;
  }
  element("fl-rueckmeldung2").className = "kasten fl-rueckmeldung " + (richtig ? "gut" : "schlecht");
  element("fl-rueckmeldung2").hidden = false;
  element("fl-weiter2").hidden = false;
  aktualisiereUhr();
}


// ---------------------------------------------------------------------
// SCHRITT 3: Löschen
// ---------------------------------------------------------------------
function starteLoeschen() {
  staerke = START_STAERKE;
  mittel = 100;
  wolke = 0;
  spruehtGerade = false;
  vorbei = false;
  ziel = { x: 500, y: 450 };
  letzterTipp = null;
  zeigeTipp("");

  zeigeFlBildschirm("fl-schritt3");
  loeschStart = performance.now();
  letzteZeit = loeschStart;
  laeuft = true;
  requestAnimationFrame(spielschleife);
}

function beginneSpruehen() {
  if (!laeuft || vorbei || mittel <= 0 || spruehtGerade) return;
  spruehtGerade = true;
  spruehBeginn = performance.now();
  starteSpruehen();   // Geräusch (ton.js)
}

function beendeSpruehen() {
  if (!spruehtGerade) return;
  spruehtGerade = false;
  stoppeSpruehen();
}

// Die Spielschleife: läuft bei jedem Bild des Bildschirms (ca. 60-mal pro Sekunde)
function spielschleife(jetzt) {
  if (!laeuft) return;
  const dt = Math.min(0.1, (jetzt - letzteZeit) / 1000);   // Sekunden seit dem letzten Bild
  letzteZeit = jetzt;

  if (!vorbei) {
    if (spruehtGerade && mittel > 0) {
      mittel = Math.max(0, mittel - VERBRAUCH * dt);
      const amStueck = (jetzt - spruehBeginn) / 1000;
      const zuLang = amStueck > STOSS_DAUER;
      const faktor = zuLang ? DAUER_FAKTOR : 1;
      wolke = Math.min(1, wolke + dt * (zuLang ? 1.5 : 0.4));

      if (inGlut(ziel)) {
        staerke = staerke - WIRKUNG_GLUT * faktor * dt;
        zeigeTipp(zuLang ? FEUERLOESCHER.tippStoesse : "");
      } else if (inFlammen(ziel)) {
        staerke = staerke - WIRKUNG_FLAMMEN * faktor * dt;
        zeigeTipp(FEUERLOESCHER.tippGlut);
      } else {
        zeigeTipp(FEUERLOESCHER.tippDaneben);
      }
      if (mittel <= 0) beendeSpruehen();
    } else {
      if (staerke > 0) staerke = staerke + WACHSTUM * dt;   // ohne Löschen wächst es
      wolke = Math.max(0, wolke - dt * 0.8);
    }
    staerke = Math.min(100, Math.max(0, staerke));

    // Entschieden?
    if (staerke <= 0) {
      beendeSchritt3(true);
    } else if (mittel <= 0) {
      beendeSchritt3(false);
    }
  } else {
    wolke = Math.max(0, wolke - dt * 0.8);
  }

  zeichne();
  aktualisiereUhr();
  requestAnimationFrame(spielschleife);
}

function beendeSchritt3(geloescht) {
  vorbei = true;
  endZeit = Math.round(((performance.now() - loeschStart) / 1000 + strafe) * 10) / 10;
  beendeSpruehen();
  zeigeTipp("");
  if (geloescht) spieleRichtig(); else spieleFalsch();
  // Kurz warten, damit man das Ergebnis im Bild noch sieht
  setTimeout(function () { zeigeErgebnis(geloescht); }, 1200);
}

// Bild an den Spielstand anpassen
function zeichne() {
  const s = staerke / 100;
  const groesse = staerke > 0 ? 0.2 + 0.8 * s : 0;
  element("fl-flammen").setAttribute("transform", "translate(500,566) scale(" + groesse + ")");
  element("fl-leuchten").setAttribute("opacity", s);
  element("fl-glut").setAttribute("opacity", staerke > 0 ? 0.5 + 0.5 * s : 0.15);
  element("fl-rauch").setAttribute("opacity", 0.15 + 0.6 * s);

  element("feuer-fuellung").style.width = staerke + "%";
  element("mittel-fuellung").style.width = mittel + "%";

  element("fl-ziel").setAttribute("transform", "translate(" + ziel.x + "," + ziel.y + ")");
  const pulver = element("fl-pulverwolke");
  pulver.setAttribute("cx", ziel.x);
  pulver.setAttribute("cy", ziel.y);
  pulver.setAttribute("opacity", wolke * 0.85);

  // Sprühnebel: 12 helle Punkte auf der Linie von der Düse zum Ziel, leicht verwackelt
  const nebel = element("fl-nebel");
  for (let i = 0; i < 12; i++) {
    const punkt = nebel.children[i];
    if (!spruehtGerade) { punkt.setAttribute("opacity", 0); continue; }
    const t = (i + Math.random()) / 12;
    punkt.setAttribute("cx", DUESE.x + (ziel.x - DUESE.x) * t + (Math.random() - 0.5) * 40 * t);
    punkt.setAttribute("cy", DUESE.y + (ziel.y - DUESE.y) * t + (Math.random() - 0.5) * 40 * t);
    punkt.setAttribute("r", 6 + 26 * t);
    punkt.setAttribute("opacity", 0.75);
  }
}


// ---------------------------------------------------------------------
// ERGEBNIS
// ---------------------------------------------------------------------
function zeigeErgebnis(geloescht) {
  laeuft = false;
  const tipps = element("fl-ende-tipps");
  tipps.replaceChildren();

  if (geloescht) {
    const neu = speichereRekord(REKORD_SCHLUESSEL, endZeit, true);   // gemeinsam.js
    element("fl-ende-titel").textContent = FEUERLOESCHER.geschafft;
    element("fl-ende-zeit").textContent = formatiereZeit(endZeit);
    zeigeText("fl-ende-rekord", neu
      ? FEUERLOESCHER.neuerRekord
      : TEXTE.rekord + " " + formatiereZeit(ladeRekord(REKORD_SCHLUESSEL)));
    zeigeText("fl-ende-text", "");
    for (const tipp of FEUERLOESCHER.geschafftTipps) {
      const punkt = document.createElement("li");
      punkt.textContent = tipp;
      tipps.appendChild(punkt);
    }
  } else {
    element("fl-ende-titel").textContent = FEUERLOESCHER.verloren;
    element("fl-ende-zeit").textContent = "";
    zeigeText("fl-ende-rekord", "");
    zeigeText("fl-ende-text", FEUERLOESCHER.verlorenText);
  }
  zeigeFlBildschirm("fl-ende");
}


// ---------------------------------------------------------------------
// STEUERUNG: Maus, Finger und Tastatur
// ---------------------------------------------------------------------
// Bildschirm-Koordinaten in Koordinaten der Zeichnung umrechnen
function setzeZiel(ereignis) {
  const svg = element("raum");
  const punkt = svg.createSVGPoint();
  punkt.x = ereignis.clientX;
  punkt.y = ereignis.clientY;
  const p = punkt.matrixTransform(svg.getScreenCTM().inverse());
  ziel = { x: Math.min(1000, Math.max(0, p.x)), y: Math.min(750, Math.max(0, p.y)) };
}

function verbindeSteuerung() {
  const raum = element("raum");

  // Maus und Finger: gedrückt halten = sprühen
  raum.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    raum.setPointerCapture(e.pointerId);   // Finger bleibt „dran“, auch außerhalb des Bildes
    setzeZiel(e);
    beginneSpruehen();
  });
  raum.addEventListener("pointermove", setzeZiel);
  raum.addEventListener("pointerup", beendeSpruehen);
  raum.addEventListener("pointercancel", beendeSpruehen);
  raum.addEventListener("lostpointercapture", beendeSpruehen);

  // Tastatur: Pfeiltasten zielen, Leertaste (oder Enter) gedrückt halten = sprühen
  raum.addEventListener("keydown", function (e) {
    const schritt = 25;
    if (e.key === "ArrowLeft")  ziel.x = Math.max(0, ziel.x - schritt);
    if (e.key === "ArrowRight") ziel.x = Math.min(1000, ziel.x + schritt);
    if (e.key === "ArrowUp")    ziel.y = Math.max(0, ziel.y - schritt);
    if (e.key === "ArrowDown")  ziel.y = Math.min(750, ziel.y + schritt);
    if (e.key.startsWith("Arrow")) e.preventDefault();
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      beginneSpruehen();
    }
  });
  raum.addEventListener("keyup", function (e) {
    if (e.key === " " || e.key === "Enter") beendeSpruehen();
  });
}


// ---------------------------------------------------------------------
// BEIM LADEN DER SEITE
// ---------------------------------------------------------------------
function initialisiereTraining() {
  document.title = FEUERLOESCHER.titel + " – " + TEXTE.spielTitel;
  element("fl-titel").textContent = FEUERLOESCHER.titel;
  element("fl-anleitung").textContent = FEUERLOESCHER.anleitung;
  element("fl-start-button").textContent = FEUERLOESCHER.startButton;
  element("fl-frage1").textContent = FEUERLOESCHER.frage1;
  element("fl-frage2").textContent = FEUERLOESCHER.frage2;
  element("platz-a").textContent = FEUERLOESCHER.platzText + " A";
  element("platz-b").textContent = FEUERLOESCHER.platzText + " B";
  element("fl-anleitung3").textContent = FEUERLOESCHER.anleitung3;
  element("text-feuer").textContent = FEUERLOESCHER.feuer;
  element("text-mittel").textContent = FEUERLOESCHER.loeschmittel;
  element("text-zeit").textContent = FEUERLOESCHER.zeit;
  element("fl-nochmal").textContent = FEUERLOESCHER.nochmal;
  element("fl-weiter1").textContent = TEXTE.weiterButton;
  element("fl-weiter2").textContent = TEXTE.weiterButton;
  const rekord = ladeRekord(REKORD_SCHLUESSEL);
  zeigeText("fl-rekord", rekord === null ? "" : TEXTE.rekord + " " + formatiereZeit(rekord));
  zeigeTonKnopf();
  aktualisiereUhr();

  // 12 Punkte für den Sprühnebel anlegen
  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 12; i++) {
    const punkt = document.createElementNS(ns, "circle");
    punkt.setAttribute("fill", "#ffffff");
    punkt.setAttribute("opacity", 0);
    element("fl-nebel").appendChild(punkt);
  }

  element("fl-start-button").addEventListener("click", starteTraining);
  element("fl-nochmal").addEventListener("click", starteTraining);
  element("fl-weiter1").addEventListener("click", zeigeSchritt2);
  element("fl-weiter2").addEventListener("click", starteLoeschen);
  element("platz-a").addEventListener("click", function () { beantworteSchritt2("A"); });
  element("platz-b").addEventListener("click", function () { beantworteSchritt2("B"); });
  element("ton-button").addEventListener("click", schalteTon);
  verbindeSteuerung();

  zeichne();
  zeigeFlBildschirm("fl-start");
}


// Los geht's: szenen.js prüfen, Sperre prüfen, dann starten
const gefundeneFehler = pruefeSzenenDatei();
if (gefundeneFehler.length > 0) {
  zeigeFehler(gefundeneFehler);
} else if (!wurdeGespielt()) {
  element("gesperrt").hidden = false;
} else {
  initialisiereTraining();
}
