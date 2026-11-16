/* =====================================================================
   ton.js  –  DIE TÖNE DES SPIELS
   =====================================================================
   Alle Töne werden direkt im Browser erzeugt (Web Audio API).
   Es gibt also keine Sounddateien und keine fremden Aufnahmen.

   1. Richtig: heller, aufsteigender Doppelton („ding-ding“)
   2. Falsch:  tiefer, absteigender Doppelton („dö-döm“)
   3. Feueralarm beim Brand. Vorbild ist das „Einheitliche Notsignal“
      (DIN 33404-3), das in Betrieben zur Räumung auffordert: ein Ton,
      der innerhalb einer Sekunde von 1200 Hz auf 500 Hz fällt und sich
      ständig wiederholt.
   ===================================================================== */

"use strict";

let tonAn = true;      // Ist der Ton eingeschaltet?
let audio = null;      // die „Tonanlage“ des Browsers (wird beim ersten Ton erstellt)
let alarm = null;      // der gerade laufende Alarm


// Beim Laden: Hat der Spieler den Ton früher schon ausgeschaltet?
try {
  tonAn = localStorage.getItem("lna-ton") !== "aus";
} catch (fehler) {
  // Speichern im Browser nicht erlaubt: dann bleibt der Ton einfach an
}


// Macht die Tonanlage bereit. Gibt false zurück, wenn kein Ton
// gespielt werden soll (Ton aus) oder kann (sehr alter Browser).
function bereiteTonVor() {
  if (!tonAn) return false;
  const AudioKlasse = window.AudioContext || window.webkitAudioContext;
  if (!AudioKlasse) return false;
  if (audio === null) audio = new AudioKlasse();
  audio.resume();
  return true;
}


// Spielt einen einzelnen kurzen Ton, der weich ausklingt
//   frequenz: Tonhöhe in Hertz (höher = heller)
//   start:    wann er beginnt (Zeit der Tonanlage in Sekunden)
//   dauer:    wie lange er klingt (in Sekunden)
//   welle:    Klangfarbe, z. B. "sine" (weich) oder "triangle" (etwas rauer)
function spieleEinzelton(frequenz, start, dauer, welle, laut) {
  const generator = audio.createOscillator();
  generator.type = welle;
  generator.frequency.value = frequenz;

  const lautstaerke = audio.createGain();
  lautstaerke.gain.setValueAtTime(0, start);
  lautstaerke.gain.linearRampToValueAtTime(laut, start + 0.01);            // schnell an …
  lautstaerke.gain.exponentialRampToValueAtTime(0.0001, start + dauer);    // … langsam aus

  generator.connect(lautstaerke);
  lautstaerke.connect(audio.destination);
  generator.start(start);
  generator.stop(start + dauer + 0.02);
}


// Richtige Antwort: zwei helle Töne nach oben
function spieleRichtig() {
  if (!bereiteTonVor()) return;
  const jetzt = audio.currentTime;
  spieleEinzelton(880,  jetzt,        0.18, "sine", 0.22);
  spieleEinzelton(1320, jetzt + 0.12, 0.35, "sine", 0.22);
}


// Falsche Antwort oder Zeit abgelaufen: zwei tiefe Töne nach unten
function spieleFalsch() {
  if (!bereiteTonVor()) return;
  const jetzt = audio.currentTime;
  spieleEinzelton(330, jetzt,        0.22, "triangle", 0.28);
  spieleEinzelton(233, jetzt + 0.18, 0.45, "triangle", 0.28);
}


// Spielt den Alarm für die angegebene Anzahl Sekunden
function starteAlarm(sekunden) {
  if (!bereiteTonVor()) return;
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
