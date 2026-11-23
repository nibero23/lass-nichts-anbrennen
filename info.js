/* =====================================================================
   info.js  –  DIE LÖSUNGEN AUF DER INFO-SEITE
   =====================================================================
   Das Grundwissen auf der Info-Seite ist immer frei – erst lernen,
   dann die Prüfung. Der Teil „Richtig handeln und Lösungen“ verrät die
   Antworten. Er erscheint erst, wenn in diesem Browser die Prüfung
   einmal gespielt wurde.

   Die Lösungen baut info.js aus szenen.js als aufklappbare Kästen:
   Situation, richtige Antwort und Erklärung. So stehen die Texte nur
   an einer Stelle (szenen.js).
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

// wurdeGespielt() steht in gemeinsam.js
if (wurdeGespielt()) {
  document.getElementById("nachher").hidden = false;

  // Hat szenen.js einen Tippfehler, fehlt nur die Lösungsliste –
  // der Rest der Info-Seite funktioniert trotzdem.
  try {
    baueSzenenListe();
  } catch (fehler) {
    document.getElementById("spiel").hidden = true;
    console.error("Lösungen konnten nicht gebaut werden:", fehler);
  }
} else {
  document.getElementById("nachher-gesperrt").hidden = false;
}
