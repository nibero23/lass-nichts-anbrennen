/* =====================================================================
   suchbild.js  –  DAS SUCHBILD „FINDE DIE MÄNGEL“
   =====================================================================
   Ablauf: Start → Suchen (Zeit läuft) → alle Mängel gefunden → Ergebnis

   - Antippen eines Mangels: er wird behoben, die Erklärung erscheint.
   - Antippen daneben: Strafzeit (SUCHBILD.strafeFalsch in szenen.js).
   - Tipp-Knopf: ein Mangel blinkt kurz auf, kostet SUCHBILD.strafeTipp.
   - Die Zeit (mit Strafen) ist das Ergebnis. Der beste Wert wird als
     persönlicher Rekord im Browser gespeichert.
   ===================================================================== */

"use strict";

const REKORD_SCHLUESSEL = "lna-rekord-suchbild";

let startZeit = 0;       // wann das Suchen begonnen hat
let strafe = 0;          // gesammelte Strafsekunden
let uhr = null;          // die laufende Uhr (zum Anhalten)
let laeuft = false;      // wird gerade gesucht?
let anzahlGefunden = 0;


// Immer nur einen der drei Bildschirme zeigen
function zeigeSbBildschirm(id) {
  for (const bildschirm of document.querySelectorAll(".bildschirm")) {
    bildschirm.hidden = (bildschirm.id !== id);
  }
  element(id).querySelector("h1, h2").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// Alle Mängel-Gruppen in der Zeichnung
function alleMaengel() {
  return document.querySelectorAll("#suchbild .mangel");
}

// Bisherige Zeit inklusive Strafen
function sekundenBisher() {
  return (performance.now() - startZeit) / 1000 + strafe;
}

function aktualisiereAnzeige() {
  element("zeit-gesamt").textContent = formatiereZeit(sekundenBisher());
  element("gefunden-anzeige").textContent = anzahlGefunden + " / " + SUCHBILD.maengel.length;
}


// ---------------------------------------------------------------------
// START
// ---------------------------------------------------------------------
function starteSuchbild() {
  // Alle Mängel wieder „kaputt“ machen
  for (const gruppe of alleMaengel()) {
    gruppe.classList.remove("gefunden", "tipp");
  }
  anzahlGefunden = 0;
  strafe = 0;
  element("sb-liste").replaceChildren();
  element("sb-meldung").hidden = true;

  startZeit = performance.now();
  laeuft = true;
  clearInterval(uhr);
  uhr = setInterval(aktualisiereAnzeige, 250);
  aktualisiereAnzeige();
  zeigeSbBildschirm("sb-spiel");
}


// ---------------------------------------------------------------------
// ANTIPPEN
// ---------------------------------------------------------------------
function klickAufBild(ereignis) {
  if (!laeuft) return;

  // Wurde ein Mangel getroffen? closest() sucht vom angetippten Punkt
  // nach oben, ob er in einer Gruppe mit der Klasse „mangel“ liegt.
  const gruppe = ereignis.target.closest(".mangel");
  if (gruppe) {
    if (!gruppe.classList.contains("gefunden")) {
      behebe(gruppe);
    }
    return;
  }

  // Daneben getippt: Strafzeit
  strafe = strafe + SUCHBILD.strafeFalsch;
  spieleFalsch();
  zeigeFehlklick(ereignis);
  zeigeMeldung(SUCHBILD.keinMangel, SUCHBILD.strafeText);
  aktualisiereAnzeige();
}

function behebe(gruppe) {
  const id = gruppe.dataset.mangel;
  const daten = SUCHBILD.maengel.find(function (m) { return m.id === id; });

  gruppe.classList.remove("tipp");
  gruppe.classList.add("gefunden");   // style.css blendet „kaputt“ aus und „behoben“ ein
  anzahlGefunden = anzahlGefunden + 1;
  spieleRichtig();
  zeigeMeldung(daten.titel, daten.erklaerung);

  // In die Liste der gefundenen Mängel eintragen
  const punkt = document.createElement("li");
  punkt.textContent = daten.titel;
  element("sb-liste").appendChild(punkt);

  aktualisiereAnzeige();
  if (anzahlGefunden === SUCHBILD.maengel.length) {
    beende();
  }
}

function zeigeMeldung(titel, text) {
  element("sb-meldung-titel").textContent = titel;
  element("sb-meldung-text").textContent = text;
  element("sb-meldung").hidden = false;
}

// Rotes X an der Stelle, an der daneben getippt wurde
function zeigeFehlklick(ereignis) {
  const svg = element("suchbild").querySelector("svg");

  // Bildschirm-Koordinaten in Koordinaten der Zeichnung umrechnen
  const punkt = svg.createSVGPoint();
  punkt.x = ereignis.clientX;
  punkt.y = ereignis.clientY;
  const p = punkt.matrixTransform(svg.getScreenCTM().inverse());

  const ns = "http://www.w3.org/2000/svg";
  const x = document.createElementNS(ns, "path");
  x.setAttribute("d", "M" + (p.x - 18) + " " + (p.y - 18) + " L" + (p.x + 18) + " " + (p.y + 18) +
                      " M" + (p.x + 18) + " " + (p.y - 18) + " L" + (p.x - 18) + " " + (p.y + 18));
  x.setAttribute("class", "fehlklick");
  svg.appendChild(x);
  setTimeout(function () { x.remove(); }, 900);
}


// ---------------------------------------------------------------------
// TIPP: ein noch nicht gefundener Mangel blinkt kurz
// ---------------------------------------------------------------------
function gibTipp() {
  if (!laeuft) return;
  const offen = Array.from(alleMaengel()).filter(function (g) {
    return !g.classList.contains("gefunden");
  });
  if (offen.length === 0) return;

  const gruppe = offen[Math.floor(Math.random() * offen.length)];
  gruppe.classList.add("tipp");
  setTimeout(function () { gruppe.classList.remove("tipp"); }, 2500);

  strafe = strafe + SUCHBILD.strafeTipp;
  aktualisiereAnzeige();
}


// ---------------------------------------------------------------------
// GESCHAFFT
// ---------------------------------------------------------------------
function beende() {
  laeuft = false;
  clearInterval(uhr);
  const zeit = Math.round(sekundenBisher() * 10) / 10;
  const neu = speichereRekord(REKORD_SCHLUESSEL, zeit, true);   // gemeinsam.js

  element("sb-ende-zeit").textContent = formatiereZeit(zeit);
  element("sb-ende-rekord").textContent = neu
    ? SUCHBILD.neuerRekord
    : TEXTE.rekord + " " + formatiereZeit(ladeRekord(REKORD_SCHLUESSEL));

  // Kurz warten, damit man den letzten behobenen Mangel noch sieht
  setTimeout(function () { zeigeSbBildschirm("sb-ende"); }, 1500);
}


// ---------------------------------------------------------------------
// BEIM LADEN DER SEITE
// ---------------------------------------------------------------------
function initialisiereSuchbild() {
  // Zeichnung einsetzen
  element("suchbild").innerHTML = SUCHBILD_ZEICHNUNG;

  // Passt jeder Mangel in der Zeichnung zu einem Text in szenen.js?
  const ids = SUCHBILD.maengel.map(function (m) { return m.id; });
  const fehlend = Array.from(alleMaengel())
    .map(function (g) { return g.dataset.mangel; })
    .filter(function (id) { return !ids.includes(id); });
  if (fehlend.length > 0) {
    zeigeFehler(["SUCHBILD: Für diese Mängel fehlt der Text: " + fehlend.join(", ")]);
    return;
  }

  // Texte eintragen
  document.title = SUCHBILD.titel + " – " + TEXTE.spielTitel;
  element("sb-titel").textContent = SUCHBILD.titel;
  element("sb-spiel-titel").textContent = SUCHBILD.titel;
  element("sb-anleitung").textContent = SUCHBILD.anleitung;
  element("sb-start-button").textContent = SUCHBILD.startButton;
  element("tipp-button").textContent = SUCHBILD.tippButton;
  element("sb-wischen").textContent = SUCHBILD.wischHinweis;
  element("sb-ende-titel").textContent = SUCHBILD.endeUeberschrift;
  element("sb-nochmal").textContent = SUCHBILD.nochmal;
  element("text-gefunden").textContent = SUCHBILD.gefunden;
  element("text-zeit").textContent = SUCHBILD.zeit;
  const rekord = ladeRekord(REKORD_SCHLUESSEL);
  zeigeText("sb-rekord", rekord === null ? "" : TEXTE.rekord + " " + formatiereZeit(rekord));
  zeigeTonKnopf();
  aktualisiereAnzeige();

  // Klicks verbinden
  element("suchbild").addEventListener("click", klickAufBild);
  element("sb-start-button").addEventListener("click", starteSuchbild);
  element("sb-nochmal").addEventListener("click", starteSuchbild);
  element("tipp-button").addEventListener("click", gibTipp);
  element("ton-button").addEventListener("click", schalteTon);

  zeigeSbBildschirm("sb-start");
}


// Los geht's: szenen.js prüfen, Sperre prüfen, dann starten
const gefundeneFehler = pruefeSzenenDatei();
if (gefundeneFehler.length > 0) {
  zeigeFehler(gefundeneFehler);
} else if (!wurdeGespielt()) {
  element("gesperrt").hidden = false;
} else {
  initialisiereSuchbild();
}
