/* =====================================================================
   info.js  –  SPERRE UND LÖSUNGEN DER INFO-SEITE
   =====================================================================
   1. Die Info-Seite verrät die Lösungen. Deshalb zeigt sie ihren Inhalt
      erst, wenn in diesem Browser einmal zu Ende gespielt wurde.
   2. Danach baut sie aus szenen.js aufklappbare Kästen:
      Situation, richtige Antwort und Erklärung.
      So stehen die Texte nur an einer Stelle (szenen.js).
   ===================================================================== */

"use strict";

function baueSzenenListe() {
  const liste = document.getElementById("szenen-liste");

  for (const szene of SZENEN) {
    const richtig = szene.antworten.find(function (antwort) {
      return antwort.art === "richtig";
    });

    // <details> ist ein Kasten, der sich per Klick auf- und zuklappen lässt
    const kasten = document.createElement("details");
    kasten.className = "kasten";

    const titel = document.createElement("summary");
    titel.textContent = (szene.uhrzeit ? szene.uhrzeit + " Uhr · " : "") + szene.titel;

    const situation = document.createElement("p");
    situation.textContent = szene.situation;

    const antwort = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = "Richtig: ";
    antwort.append(label, richtig.text);

    const erklaerung = document.createElement("p");
    erklaerung.textContent = szene.erklaerung;

    kasten.append(titel, situation, antwort, erklaerung);
    liste.appendChild(kasten);
  }
}

// Wurde das Spiel in diesem Browser schon einmal zu Ende gespielt?
// spiel.js speichert das als „lna-gespielt“. Ist Speichern im Browser
// verboten, lassen wir die Seite lieber offen als sie für immer zu sperren.
function wurdeGespielt() {
  try {
    return localStorage.getItem("lna-gespielt") === "ja";
  } catch (fehler) {
    return true;
  }
}

if (wurdeGespielt()) {
  document.getElementById("info-inhalt").hidden = false;

  // Hat szenen.js einen Tippfehler, fehlt nur dieser Abschnitt –
  // der Rest der Info-Seite funktioniert trotzdem.
  try {
    baueSzenenListe();
  } catch (fehler) {
    document.getElementById("spiel").hidden = true;
    console.error("Lösungen konnten nicht gebaut werden:", fehler);
  }
} else {
  document.getElementById("gesperrt").hidden = false;
}
