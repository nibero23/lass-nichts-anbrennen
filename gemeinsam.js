/* =====================================================================
   gemeinsam.js  –  HILFSFUNKTIONEN FÜR ALLE SEITEN
   =====================================================================
   Kleine Werkzeuge, die mehrere Seiten brauchen (Prüfung, Info-Seite,
   Trainingsspiele). So steht jede Funktion nur einmal im Projekt.
   ===================================================================== */

"use strict";


// Kurzform: holt ein Element aus der Seite über seine id
function element(id) {
  return document.getElementById(id);
}


// Zeigt einen Text an – oder versteckt das Element, wenn der Text leer ist
function zeigeText(id, text) {
  element(id).textContent = text || "";
  element(id).hidden = !text;
}


// Macht aus 83.4 Sekunden „1:23 min“
function formatiereZeit(sekunden) {
  const ganz = Math.round(sekunden);
  const minuten = Math.floor(ganz / 60);
  const rest = String(ganz % 60).padStart(2, "0");
  return minuten + ":" + rest + " min";
}


// ---------------------------------------------------------------------
// WAS SICH DER BROWSER MERKT (localStorage)
// Alles mit try/catch: Manche Browser verbieten das Speichern,
// dann soll das Spiel trotzdem funktionieren.
// ---------------------------------------------------------------------

// Merkt sich, dass die Prüfung einmal zu Ende gespielt wurde.
// Erst dann sind Info-Seite und Trainingsspiele frei.
function merkeGespielt() {
  try {
    localStorage.setItem("lna-gespielt", "ja");
  } catch (fehler) {
    // Speichern nicht erlaubt: dann ist ohnehin alles frei (siehe unten)
  }
}

// Wurde die Prüfung in diesem Browser schon einmal gespielt?
// Ist Speichern verboten, lassen wir lieber alles offen als es für
// immer zu sperren.
function wurdeGespielt() {
  try {
    return localStorage.getItem("lna-gespielt") === "ja";
  } catch (fehler) {
    return true;
  }
}

// Liest einen gespeicherten Rekord (oder null, wenn es keinen gibt)
function ladeRekord(schluessel) {
  try {
    const wert = Number(localStorage.getItem(schluessel));
    return wert > 0 ? wert : null;
  } catch (fehler) {
    return null;
  }
}

// Speichert einen Rekord, aber nur, wenn er besser ist als der alte.
// kleinerIstBesser: true bei Zeiten (schneller = besser)
// Gibt true zurück, wenn es ein neuer Rekord ist.
function speichereRekord(schluessel, wert, kleinerIstBesser) {
  const alt = ladeRekord(schluessel);
  const besser = alt === null || (kleinerIstBesser ? wert < alt : wert > alt);
  if (besser) {
    try {
      localStorage.setItem(schluessel, String(wert));
    } catch (fehler) {
      // nicht schlimm: dann gilt der Rekord nur bis zum Neuladen
    }
  }
  return besser;
}
