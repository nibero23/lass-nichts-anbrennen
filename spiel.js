/* =====================================================================
   spiel.js  –  DER SPIELABLAUF
   =====================================================================
   Hier stehen keine Texte (die sind in szenen.js), sondern nur die Regeln:
   Punkte zählen, Zeit messen, Hitze-Balken füllen, Bildschirme wechseln.

   Ablauf eines Spiels:
     Start → Szene (Countdown läuft) → Feedback → nächste Szene → …
           → Ende mit Bestenliste → „Nochmal spielen“

   Erreicht die Hitze 100 %:
     Feueralarm + ganzer Bildschirm geht in Flammen auf
     → „Brand bricht aus!“ → alles von vorne
   ===================================================================== */

"use strict";


// ---------------------------------------------------------------------
// 1. SPIELSTAND
//    Diese Werte merken sich, wo der Spieler gerade steht.
// ---------------------------------------------------------------------
let punkte = 0;          // gesammelte Punkte
let hitze = 0;           // Hitze-Balken in Prozent (0 bis 100)
let szenenIndex = 0;     // welche Szene gerade läuft (0 = erste Szene)
let gesamtSekunden = 0;  // gebrauchte Zeit für alle Szenen (für die Bestenliste)

// Countdown der aktuellen Szene
let szenenStart = 0;     // Zeitpunkt, an dem die Szene erschienen ist
let countdown = null;    // Nummer des laufenden Countdowns (zum Anhalten)

// So lange brennt der Bildschirm, bevor „Brand bricht aus!“ erscheint (in Millisekunden).
// Passt zur Animation „feuer-steigt“ in style.css (2,2 Sekunden) plus kurze Pause.
const BRENNDAUER = 2600;

// So lange heult der Feueralarm insgesamt (in Sekunden)
const ALARMDAUER = 7;


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
// 4. BILD ANZEIGEN
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
  rahmen.querySelector(".platzhalter-text").textContent = "Bild fehlt: " + pfad;
  bild.alt = beschreibung;

  // Kann das Bild nicht geladen werden, schaltet style.css auf den Platzhalter um
  bild.onerror = function () {
    rahmen.classList.add("fehlt");
  };

  bild.removeAttribute("src");   // altes Bild sofort entfernen
  bild.src = pfad;
}


// Zeigt einen Text an – oder versteckt das Element, wenn der Text leer ist
function zeigeText(id, text) {
  element(id).textContent = text || "";
  element(id).hidden = !text;
}


// Mischt eine Liste (Fisher-Yates-Verfahren): jede Reihenfolge ist gleich
// wahrscheinlich. So kann sich niemand „B, C, A …“ merken.
function mische(liste) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tausch = kopie[i];
    kopie[i] = kopie[j];
    kopie[j] = tausch;
  }
  return kopie;
}


// Merkt sich im Browser, dass einmal zu Ende gespielt wurde.
// Erst dann zeigt info.html die Lösungen.
function merkeGespielt() {
  try {
    localStorage.setItem("lna-gespielt", "ja");
  } catch (fehler) {
    // Speichern nicht erlaubt: info.html ist dann ohnehin frei
  }
}


// ---------------------------------------------------------------------
// 5. SPIEL STARTEN (auch für „Nochmal spielen“)
// ---------------------------------------------------------------------
function starteSpiel() {
  stoppeAlarm();
  punkte = 0;
  hitze = 0;
  szenenIndex = 0;
  gesamtSekunden = 0;
  aktualisiereStatus();
  zeigeSzene();
}


// ---------------------------------------------------------------------
// 6. EINE SZENE ANZEIGEN
// ---------------------------------------------------------------------
function zeigeSzene() {
  const szene = SZENEN[szenenIndex];

  zeigeFoto("szene-foto", szene.bild, szene.titel);

  // z. B. „08:00 Uhr · Szene 1 von 13“
  let zeile = "Szene " + (szenenIndex + 1) + " von " + SZENEN.length;
  if (szene.uhrzeit) {
    zeile = szene.uhrzeit + " Uhr · " + zeile;
  }
  element("szene-zeit").textContent = zeile;
  element("szene-titel").textContent = szene.titel;
  element("szene-situation").textContent = szene.situation;

  // Für jede Antwort einen Button bauen – in zufälliger Reihenfolge
  const liste = element("antworten");
  liste.replaceChildren();               // Buttons der letzten Szene entfernen
  for (const antwort of mische(szene.antworten)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "antwort";
    button.textContent = antwort.text;
    button.addEventListener("click", function () {
      waehleAntwort(antwort);
    });
    liste.appendChild(button);
  }

  // Bild der nächsten Szene schon im Hintergrund laden,
  // damit es später ohne Wartezeit erscheint
  const naechste = SZENEN[szenenIndex + 1];
  if (naechste && naechste.bild) {
    new Image().src = naechste.bild;
  }

  zeigeBildschirm("szene");
  starteCountdown();
}


// ---------------------------------------------------------------------
// 7. COUNTDOWN
//    Alle 0,2 Sekunden wird die Restzeit neu berechnet und angezeigt.
// ---------------------------------------------------------------------
function starteCountdown() {
  stoppeCountdown();
  szenenStart = performance.now();     // genaue Uhr des Browsers in Millisekunden

  element("zeit").hidden = !ZEIT.sekunden;
  if (!ZEIT.sekunden) return;          // 0 = kein Zeitlimit

  aktualisiereCountdown();
  countdown = setInterval(aktualisiereCountdown, 200);
}

function stoppeCountdown() {
  clearInterval(countdown);
  countdown = null;
}

// Wie viele Sekunden seit Beginn der Szene vergangen sind
function vergangeneSekunden() {
  return (performance.now() - szenenStart) / 1000;
}

// Wie viele Sekunden noch übrig sind (nie weniger als 0)
function restSekunden() {
  return Math.max(0, ZEIT.sekunden - vergangeneSekunden());
}

function aktualisiereCountdown() {
  const rest = restSekunden();
  element("zeit-anzeige").textContent = Math.ceil(rest) + " s";
  element("zeit-fuellung").style.width = (rest / ZEIT.sekunden * 100) + "%";
  element("zeit").classList.toggle("knapp", rest <= 5);   // die letzten 5 Sekunden: rot

  if (rest <= 0) {
    zeitAbgelaufen();
  }
}


// ---------------------------------------------------------------------
// 8. DER SPIELER HAT GEANTWORTET – ODER DIE ZEIT IST ABGELAUFEN
// ---------------------------------------------------------------------
function waehleAntwort(antwort) {
  const regel = ANTWORTARTEN[antwort.art];   // z. B. { punkte: 10, hitze: 0, … }

  // Zeitbonus nur für richtige Antworten: je ZEIT.bonusAlle übrige Sekunden 1 Punkt,
  // auf ganze Punkte gerundet (24,9 übrige Sekunden ergeben also 5 Punkte)
  let bonus = 0;
  if (antwort.art === "richtig" && ZEIT.sekunden) {
    bonus = Math.round(restSekunden() / ZEIT.bonusAlle);
  }

  verrechne(antwort, regel, bonus);
}

function zeitAbgelaufen() {
  // Die Zeit zählt wie eine eigene, falsche „Antwort“
  const zuSpaet = { art: "zuSpaet", reaktion: ZEIT.zuSpaet.reaktion };
  verrechne(zuSpaet, ZEIT.zuSpaet, 0);
}

// Punkte, Zeit und Hitze verrechnen, dann das Feedback zeigen
function verrechne(antwort, regel, bonus) {
  stoppeCountdown();
  gesamtSekunden = gesamtSekunden + (ZEIT.sekunden ? Math.min(vergangeneSekunden(), ZEIT.sekunden) : vergangeneSekunden());

  punkte = punkte + regel.punkte + bonus;
  hitze = Math.min(hitze + regel.hitze, 100);   // nie mehr als 100 %
  aktualisiereStatus();

  if (hitze >= 100) {
    // Erst Alarm und Flammen, danach kommt „Brand bricht aus!“
    starteAlarm(ALARMDAUER);
    lasseBildschirmBrennen(function () {
      zeigeFeedback(antwort, regel, bonus);
    });
  } else {
    zeigeFeedback(antwort, regel, bonus);
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
// 9. FEEDBACK ANZEIGEN
// ---------------------------------------------------------------------
function zeigeFeedback(antwort, regel, bonus) {
  const szene = SZENEN[szenenIndex];

  const feedback = element("feedback");
  feedback.dataset.art = antwort.art;   // Farbe der Überschrift, siehe style.css

  if (hitze >= 100) {
    // Hitze voll: aus dem Feedback wird „Brand bricht aus!“
    merkeGespielt();
    feedback.classList.add("brennt");
    element("feedback-ueberschrift").textContent = TEXTE.brandUeberschrift;
    zeigeText("feedback-brandtitel", TEXTE.brandTitel);
    zeigeText("feedback-brandtext", TEXTE.brandText);
    element("feedback-weiter").textContent = TEXTE.nochmalButton;
    zeigeText("feedback-info-link", TEXTE.infoLink);
  } else {
    feedback.classList.remove("brennt");
    element("feedback-ueberschrift").textContent = regel.ueberschrift;   // „Richtig!“ …
    zeigeText("feedback-brandtitel", "");
    zeigeText("feedback-brandtext", "");
    element("feedback-weiter").textContent = TEXTE.weiterButton;
    zeigeText("feedback-info-link", "");
  }

  // Eigene Reaktion auf genau diese Antwort (nur wenn eingetragen)
  zeigeText("feedback-reaktion", antwort.reaktion);

  // Was hat die Antwort gebracht? z. B. „+10 Punkte · +3 Zeitbonus“ oder „Hitze +20 %“
  const ergebnis = [];
  if (regel.punkte) ergebnis.push("+" + regel.punkte + " Punkte");
  if (bonus)        ergebnis.push("+" + bonus + " " + TEXTE.zeitbonus);
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
    starteSpiel();      // Brand: alles von vorne (stoppt auch den Alarm)
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
// 10. ENDBILDSCHIRM
// ---------------------------------------------------------------------
function zeigeEnde() {
  merkeGespielt();

  // Höchstpunktzahl: jede Szene hat genau eine richtige Antwort,
  // dazu der größtmögliche Zeitbonus
  const maxBonus = ZEIT.sekunden ? Math.round(ZEIT.sekunden / ZEIT.bonusAlle) : 0;
  const maximum = SZENEN.length * (ANTWORTARTEN.richtig.punkte + maxBonus);

  element("ende-punkte").textContent = punkte + " von " + maximum + " Punkten";
  element("ende-titel").textContent = findeTitel(punkte);
  bereiteBestenlisteVor(punkte, gesamtSekunden);   // bestenliste.js
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
// 11. BEIM LADEN DER SEITE
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
  zeigeText("ende-info-link", TEXTE.infoLink);   // Info-Seite erst nach dem Spielen

  // Credits: jede Zeile als eigener Listenpunkt
  for (const zeile of CREDITS) {
    const punkt = document.createElement("li");
    punkt.textContent = zeile;
    element("credits-liste").appendChild(punkt);
  }

  zeigeTonKnopf();              // ton.js
  initialisiereBestenliste();   // bestenliste.js

  // Was passiert bei welchem Klick?
  element("start-button").addEventListener("click", starteSpiel);
  element("feedback-weiter").addEventListener("click", weiterNachFeedback);
  element("nochmal-button").addEventListener("click", starteSpiel);
  element("ton-button").addEventListener("click", schalteTon);

  zeigeBildschirm("start");
}


// Los geht's: erst szenen.js prüfen (pruefung.js), dann starten
const gefundeneFehler = pruefeSzenenDatei();
if (gefundeneFehler.length > 0) {
  zeigeFehler(gefundeneFehler);
} else {
  initialisiere();
}
