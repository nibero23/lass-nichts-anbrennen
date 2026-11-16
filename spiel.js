/* =====================================================================
   spiel.js  –  DER SPIELABLAUF
   =====================================================================
   Hier stehen keine Texte (die sind in szenen.js), sondern nur die Regeln:
   Punkte zählen, Hitze-Balken füllen, Bildschirme wechseln.

   Ablauf eines Spiels:
     Start → Szene → Feedback → nächste Szene → … → Ende → „Nochmal spielen“

   Erreicht die Hitze 100 %:
     ganzer Bildschirm geht in Flammen auf → „Brand bricht aus!“ → alles von vorne
   ===================================================================== */

"use strict";


// ---------------------------------------------------------------------
// 1. SPIELSTAND
//    Diese drei Werte merken sich, wo der Spieler gerade steht.
// ---------------------------------------------------------------------
let punkte = 0;        // gesammelte Punkte
let hitze = 0;         // Hitze-Balken in Prozent (0 bis 100)
let szenenIndex = 0;   // welche Szene gerade läuft (0 = erste Szene)

// So lange brennt der Bildschirm, bevor „Brand bricht aus!“ erscheint (in Millisekunden).
// Passt zur Animation „feuer-steigt“ in style.css (2,2 Sekunden) plus kurze Pause.
const BRENNDAUER = 2600;


// Kurzform: holt ein Element aus index.html über seine id
function element(id) {
  return document.getElementById(id);
}


// ---------------------------------------------------------------------
// 2. BILDSCHIRM WECHSELN
//    In index.html gibt es vier <section class="bildschirm">.
//    Es ist immer genau einer sichtbar, die anderen sind versteckt.
// ---------------------------------------------------------------------
function zeigeBildschirm(id) {
  for (const bildschirm of document.querySelectorAll(".bildschirm")) {
    bildschirm.hidden = (bildschirm.id !== id);
  }

  // Punkte und Hitze nur während des Spiels zeigen
  element("statusleiste").hidden = (id === "start" || id === "ende");

  // Tastatur- und Screenreader-Nutzer landen bei der neuen Überschrift
  const ueberschrift = element(id).querySelector("h1, h2");
  ueberschrift.focus({ preventScroll: true });

  // Jeder Bildschirm beginnt oben (wichtig auf dem Handy)
  window.scrollTo(0, 0);
}


// ---------------------------------------------------------------------
// 3. PUNKTE UND HITZE-BALKEN ANZEIGEN
// ---------------------------------------------------------------------
function aktualisiereStatus() {
  element("punkte-anzeige").textContent = punkte;
  element("hitze-anzeige").textContent = hitze + " %";

  // Der Farbverlauf geht über die ganze Breite. clip-path schneidet rechts
  // den Teil ab, der noch nicht heiß ist (bei 20 % Hitze also 80 %).
  // Die Bewegung macht style.css (transition) automatisch weich.
  element("hitze-fuellung").style.clipPath = "inset(0 " + (100 - hitze) + "% 0 0)";

  // Für Screenreader: aktueller Wert des Balkens
  element("hitze-balken").setAttribute("aria-valuenow", hitze);
}


// ---------------------------------------------------------------------
// 4. FOTO ANZEIGEN
//    Fehlt die Datei, erscheint ein grauer Platzhalter mit dem Dateinamen.
//    Ist gar kein Pfad eingetragen (""), wird der Rahmen ausgeblendet.
// ---------------------------------------------------------------------
function zeigeFoto(rahmenId, pfad, beschreibung) {
  const rahmen = element(rahmenId);
  const bild = rahmen.querySelector("img");

  if (!pfad) {
    rahmen.hidden = true;
    return;
  }

  rahmen.hidden = false;
  rahmen.classList.remove("fehlt");
  rahmen.querySelector(".platzhalter-text").textContent = "Foto fehlt: " + pfad;
  bild.alt = beschreibung;

  // Kann das Foto nicht geladen werden, schaltet style.css auf den Platzhalter um
  bild.onerror = function () {
    rahmen.classList.add("fehlt");
  };

  bild.removeAttribute("src");   // altes Foto sofort entfernen
  bild.src = pfad;
}


// Zeigt einen Text an – oder versteckt das Element, wenn der Text leer ist
function zeigeText(id, text) {
  element(id).textContent = text || "";
  element(id).hidden = !text;
}


// ---------------------------------------------------------------------
// 5. SPIEL STARTEN (auch für „Nochmal spielen“)
// ---------------------------------------------------------------------
function starteSpiel() {
  punkte = 0;
  hitze = 0;
  szenenIndex = 0;
  aktualisiereStatus();
  zeigeSzene();
}


// ---------------------------------------------------------------------
// 6. EINE SZENE ANZEIGEN
// ---------------------------------------------------------------------
function zeigeSzene() {
  const szene = SZENEN[szenenIndex];

  zeigeFoto("szene-foto", szene.bild, szene.titel);

  // z. B. „08:00 Uhr · Szene 1 von 8“
  let zeile = "Szene " + (szenenIndex + 1) + " von " + SZENEN.length;
  if (szene.uhrzeit) {
    zeile = szene.uhrzeit + " Uhr · " + zeile;
  }
  element("szene-zeit").textContent = zeile;
  element("szene-titel").textContent = szene.titel;
  element("szene-situation").textContent = szene.situation;

  // Für jede Antwort einen Button bauen
  const liste = element("antworten");
  liste.replaceChildren();               // Buttons der letzten Szene entfernen
  for (const antwort of szene.antworten) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "antwort";
    button.textContent = antwort.text;
    button.addEventListener("click", function () {
      waehleAntwort(antwort);
    });
    liste.appendChild(button);
  }

  // Foto der nächsten Szene schon im Hintergrund laden,
  // damit es später ohne Wartezeit erscheint
  const naechste = SZENEN[szenenIndex + 1];
  if (naechste && naechste.bild) {
    new Image().src = naechste.bild;
  }

  zeigeBildschirm("szene");
}


// ---------------------------------------------------------------------
// 7. DER SPIELER HAT GEANTWORTET
//    Punkte und Hitze verrechnen, dann das Feedback zeigen.
// ---------------------------------------------------------------------
function waehleAntwort(antwort) {
  const regel = ANTWORTARTEN[antwort.art];   // z. B. { punkte: 0, hitze: 20, … }

  punkte = punkte + regel.punkte;
  hitze = Math.min(hitze + regel.hitze, 100);   // nie mehr als 100 %

  aktualisiereStatus();

  if (hitze >= 100) {
    // Erst brennt der ganze Bildschirm, danach kommt „Brand bricht aus!“
    lasseBildschirmBrennen(function () {
      zeigeFeedback(antwort, regel);
    });
  } else {
    zeigeFeedback(antwort, regel);
  }
}


// Der ganze Bildschirm geht in Flammen auf.
// „danach“ ist das, was nach den Flammen passieren soll.
function lasseBildschirmBrennen(danach) {
  // Antworten sperren, damit während der Flammen niemand nochmal klickt
  for (const button of document.querySelectorAll("#antworten button")) {
    button.disabled = true;
  }

  // Die Klasse „brennt“ an der ganzen Seite startet das Feuer in style.css
  document.body.classList.add("brennt");

  // Nach der Brenndauer: „Brand bricht aus!“ zeigen und das Feuer ausblenden
  setTimeout(function () {
    danach();
    document.body.classList.remove("brennt");
  }, BRENNDAUER);
}


// ---------------------------------------------------------------------
// 8. FEEDBACK ANZEIGEN
// ---------------------------------------------------------------------
function zeigeFeedback(antwort, regel) {
  const szene = SZENEN[szenenIndex];

  const feedback = element("feedback");
  feedback.dataset.art = antwort.art;   // Farbe der Überschrift, siehe style.css

  if (hitze >= 100) {
    // Hitze voll: aus dem Feedback wird „Brand bricht aus!“
    feedback.classList.add("brennt");
    element("feedback-ueberschrift").textContent = TEXTE.brandUeberschrift;
    zeigeText("feedback-brandtitel", TEXTE.brandTitel);
    zeigeText("feedback-brandtext", TEXTE.brandText);
    element("feedback-weiter").textContent = TEXTE.nochmalButton;
  } else {
    feedback.classList.remove("brennt");
    element("feedback-ueberschrift").textContent = regel.ueberschrift;   // „Richtig!“ …
    zeigeText("feedback-brandtitel", "");
    zeigeText("feedback-brandtext", "");
    element("feedback-weiter").textContent = TEXTE.weiterButton;
  }

  // Eigene Reaktion auf genau diese Antwort (nur wenn eingetragen)
  zeigeText("feedback-reaktion", antwort.reaktion);

  // Was hat die Antwort gebracht? z. B. „+10 Punkte“ oder „Hitze +20 %“
  const ergebnis = [];
  if (regel.punkte) ergebnis.push("+" + regel.punkte + " Punkte");
  if (regel.hitze)  ergebnis.push("Hitze +" + regel.hitze + " %");
  zeigeText("feedback-ergebnis", ergebnis.join(" · "));

  // Bei einer falschen Antwort: zeigen, was richtig gewesen wäre
  const richtigeAntwort = szene.antworten.find(function (a) {
    return a.art === "richtig";
  });
  element("feedback-richtig").hidden = (antwort.art === "richtig");
  element("feedback-richtige-antwort").textContent = richtigeAntwort.text;

  element("feedback-erklaerung").textContent = szene.erklaerung;

  zeigeBildschirm("feedback");
}


// Klick auf den Button im Feedback
function weiterNachFeedback() {
  if (hitze >= 100) {
    starteSpiel();      // Brand: alles von vorne
  } else {
    naechsteSzene();
  }
}


function naechsteSzene() {
  szenenIndex = szenenIndex + 1;
  if (szenenIndex < SZENEN.length) {
    zeigeSzene();
  } else {
    zeigeEnde();
  }
}


// ---------------------------------------------------------------------
// 9. ENDBILDSCHIRM
// ---------------------------------------------------------------------
function zeigeEnde() {
  // Höchstpunktzahl: jede Szene hat genau eine richtige Antwort
  const maximum = SZENEN.length * ANTWORTARTEN.richtig.punkte;

  element("ende-punkte").textContent = punkte + " von " + maximum + " Punkten";
  element("ende-titel").textContent = findeTitel(punkte);
  zeigeBildschirm("ende");
}


// Sucht den passenden Titel aus der Liste TITEL in szenen.js
function findeTitel(punktzahl) {
  // Höchste Grenze zuerst, damit die Reihenfolge in szenen.js egal ist
  const sortiert = TITEL.slice().sort(function (a, b) {
    return b.abPunkte - a.abPunkte;
  });
  for (const eintrag of sortiert) {
    if (punktzahl >= eintrag.abPunkte) {
      return eintrag.titel;
    }
  }
  return sortiert[sortiert.length - 1].titel;   // falls keine Grenze passt
}


// ---------------------------------------------------------------------
// 10. BEIM LADEN DER SEITE
//     Feste Texte aus szenen.js eintragen und die Buttons verbinden.
// ---------------------------------------------------------------------
function initialisiere() {
  document.title = TEXTE.spielTitel;

  // Startbildschirm
  zeigeFoto("start-foto", TEXTE.startBild, TEXTE.spielTitel);
  element("start-titel").textContent = TEXTE.spielTitel;
  zeigeText("start-untertitel", TEXTE.untertitel);
  zeigeText("start-einleitung", TEXTE.einleitung);
  zeigeText("start-anleitung", TEXTE.anleitung);
  element("start-button").textContent = TEXTE.startButton;

  // Feedback und Ende
  element("text-richtig-waere").textContent = TEXTE.richtigWaere;
  element("text-warum").textContent = TEXTE.warum;
  element("ende-ueberschrift").textContent = TEXTE.endeUeberschrift;
  element("nochmal-button").textContent = TEXTE.nochmalButton;

  // Credits: jede Zeile als eigener Listenpunkt
  for (const zeile of CREDITS) {
    const punkt = document.createElement("li");
    punkt.textContent = zeile;
    element("credits-liste").appendChild(punkt);
  }

  // Was passiert bei welchem Klick?
  element("start-button").addEventListener("click", starteSpiel);
  element("feedback-weiter").addEventListener("click", weiterNachFeedback);
  element("nochmal-button").addEventListener("click", starteSpiel);

  zeigeBildschirm("start");
}


// Los geht's: erst szenen.js prüfen (pruefung.js), dann starten
const gefundeneFehler = pruefeSzenenDatei();
if (gefundeneFehler.length > 0) {
  zeigeFehler(gefundeneFehler);
} else {
  initialisiere();
}
