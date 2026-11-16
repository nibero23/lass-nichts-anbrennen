/* =====================================================================
   ton.js  –  DER FEUERALARM-TON
   =====================================================================
   Der Ton wird direkt im Browser erzeugt (Web Audio API).
   Es gibt also keine Sounddatei und keine fremde Aufnahme.

   Vorbild ist das „Einheitliche Notsignal“ (DIN 33404-3), das in
   Betrieben zur Räumung auffordert: ein Ton, der innerhalb einer
   Sekunde von 1200 Hz auf 500 Hz fällt und sich ständig wiederholt.
   ===================================================================== */

"use strict";

let tonAn = true;      // Ist der Ton eingeschaltet?
let audio = null;      // die „Tonanlage“ des Browsers (wird beim ersten Alarm erstellt)
let alarm = null;      // der gerade laufende Alarm


// Beim Laden: Hat der Spieler den Ton früher schon ausgeschaltet?
try {
  tonAn = localStorage.getItem("lna-ton") !== "aus";
} catch (fehler) {
  // Speichern im Browser nicht erlaubt: dann bleibt der Ton einfach an
}


// Spielt den Alarm für die angegebene Anzahl Sekunden
function starteAlarm(sekunden) {
  if (!tonAn) return;

  const AudioKlasse = window.AudioContext || window.webkitAudioContext;
  if (!AudioKlasse) return;            // sehr alter Browser: ohne Ton weiter
  if (audio === null) audio = new AudioKlasse();
  audio.resume();
  stoppeAlarm();

  const start = audio.currentTime;

  // 1. Tongenerator mit „eckiger“ Welle – klingt wie eine Sirene
  const generator = audio.createOscillator();
  generator.type = "square";
  for (let i = 0; i < sekunden; i++) {
    generator.frequency.setValueAtTime(1200, start + i);            // hoch anfangen …
    generator.frequency.linearRampToValueAtTime(500, start + i + 1); // … in 1 s nach unten
  }

  // 2. Filter: nimmt die schrillsten Höhen weg
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2500;

  // 3. Lautstärke: kurz ein- und ausblenden, damit es nicht knackt
  const lautstaerke = audio.createGain();
  lautstaerke.gain.setValueAtTime(0, start);
  lautstaerke.gain.linearRampToValueAtTime(0.08, start + 0.05);
  lautstaerke.gain.setValueAtTime(0.08, start + sekunden - 0.1);
  lautstaerke.gain.linearRampToValueAtTime(0, start + sekunden);

  // Generator → Filter → Lautstärke → Lautsprecher
  generator.connect(filter);
  filter.connect(lautstaerke);
  lautstaerke.connect(audio.destination);

  generator.start(start);
  generator.stop(start + sekunden);
  alarm = { generator: generator, lautstaerke: lautstaerke };
}


// Beendet den Alarm sofort (mit kurzem Ausblenden)
function stoppeAlarm() {
  if (alarm === null) return;
  const jetzt = audio.currentTime;
  alarm.lautstaerke.gain.cancelScheduledValues(jetzt);
  alarm.lautstaerke.gain.setValueAtTime(alarm.lautstaerke.gain.value, jetzt);
  alarm.lautstaerke.gain.linearRampToValueAtTime(0, jetzt + 0.05);
  try {
    alarm.generator.stop(jetzt + 0.06);
  } catch (fehler) {
    // war schon zu Ende
  }
  alarm = null;
}


// Knopf „Ton aus“ / „Ton an“ in der Statusleiste
function schalteTon() {
  tonAn = !tonAn;
  try {
    localStorage.setItem("lna-ton", tonAn ? "an" : "aus");
  } catch (fehler) {
    // nicht schlimm: dann gilt die Einstellung nur bis zum Neuladen
  }
  if (!tonAn) stoppeAlarm();
  zeigeTonKnopf();
}


// Beschriftung des Knopfs: zeigt, was ein Klick bewirkt
function zeigeTonKnopf() {
  const knopf = document.getElementById("ton-button");
  knopf.textContent = tonAn ? TEXTE.tonAus : TEXTE.tonAn;
}
