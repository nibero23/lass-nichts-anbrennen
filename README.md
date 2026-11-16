# Lass nichts anbrennen – Dein erster Tag

Browser-Entscheidungsspiel zum Thema Brandschutz für den JWSL-Kreativwettbewerb 2026/27.
Du bist neuer Azubi und triffst an deinem ersten Arbeitstag acht Entscheidungen.

## Spiel starten

- **Online:** https://nibero23.github.io/lass-nichts-anbrennen/
- **Lokal:** Doppelklick auf `index.html`. Es wird weder ein Server noch eine Internetverbindung gebraucht.

## Dateien

| Datei | Aufgabe |
| --- | --- |
| `index.html` | Grundgerüst: Statusleiste und die vier Bildschirme (Start, Szene, Feedback, Ende) |
| `style.css` | Aussehen: Farben ganz oben, Anpassung für Handy und PC |
| `szenen.js` | **Alle Texte:** Szenen, Antworten, Erklärungen, Spielregeln, Titel, Credits |
| `spiel.js` | Spielablauf: Punkte zählen, Hitze-Balken füllen, Bildschirme wechseln |
| `pruefung.js` | Prüft `szenen.js` auf Tippfehler und zeigt sie verständlich an |
| `bilder/` | Eigene Fotos |

## So läuft ein Spiel ab

```
Start → Szene → Antwort ─┬─→ Feedback → nächste Szene → … → Ende → Nochmal spielen
                         └─ Hitze 100 %? → ganzer Bildschirm geht in Flammen auf → „Brand bricht aus!“ → Nochmal spielen (ab Szene 1)
```

Bei einem Brand ist das Spiel vorbei. Der Bildschirm „Brand bricht aus!“ zeigt den Titel „Brandbeschleuniger“ und trotzdem, was richtig gewesen wäre und warum.

| Antwort | Punkte | Hitze |
| --- | --- | --- |
| richtig | +10 | bleibt gleich |
| plausibel-falsch | 0 | +20 % |
| offensichtlich falsch | 0 | +35 % |

## Texte ändern

Alles steht in `szenen.js`. Die Regeln dafür stehen ganz oben in der Datei. Die drei wichtigsten:

1. Texte stehen zwischen geraden Anführungszeichen: `"so"`.
2. Im Text selbst deutsche Anführungszeichen „so“ oder einfache 'so' verwenden, keine geraden `"`.
3. Hinter jedem Eintrag steht ein Komma.

Nach dem Speichern im Browser **F5** drücken. Ist etwas kaputt, zeigt das Spiel einen roten Kasten:

- **Online (GitHub Pages):** Im Kasten steht die Zeilennummer direkt, z. B. „szenen.js, Zeile 153“.
- **Per Doppelklick geöffnet:** Hier verrät der Browser dem Spiel aus Sicherheitsgründen keine Zeilennummer. Drückt F12 und öffnet „Konsole“. Dort steht in Rot z. B. `szenen.js:153`, die Zahl ist die Zeile.

Ein falsch geschriebenes Wort bei `art` (z. B. „richitg“) meldet das Spiel immer mit Szene und Antwort.

## Fotos

Im Ordner `bilder/` liegen zurzeit **Beispielbilder** mit der Aufschrift „BEISPIELBILD“. Sie sind nur zum Testen da. Speichert eure eigenen Fotos unter genau demselben Namen und überschreibt die Beispielbilder damit. Bei der Abgabe darf kein Beispielbild mehr übrig sein.

- Dateinamen: `szene1.jpg` bis `szene8.jpg`, dazu optional `titel.jpg` für den Startbildschirm
- **Querformat 4:3**. Was nicht in den Rahmen passt, wird am Rand abgeschnitten.
- **Alles kleinschreiben, Endung `.jpg`.** Windows ist das egal, GitHub Pages nicht: `Szene1.JPG` wird dort nicht gefunden.
- Vorher auf etwa 1600 Pixel Breite verkleinern, sonst lädt das Spiel auf dem Handy lange.
- Fehlt ein Foto, zeigt das Spiel einen grauen Platzhalter mit dem Dateinamen.

## Farben ändern

Ganz oben in `style.css` stehen alle Farben. Ändert ihr dort eine, ändert sie sich im ganzen Spiel.

## Veröffentlichen mit GitHub Pages

Das Spiel liegt im öffentlichen Repository `nibero23/lass-nichts-anbrennen`. GitHub Pages veröffentlicht automatisch alles, was im Branch `main` liegt.

**Änderungen hochladen:** Im Ordner `C:\FeuerGame` ein Terminal öffnen und eingeben:

```
git add -A
git commit -m "Kurz beschreiben, was sich geändert hat"
git push
```

Nach ein bis zwei Minuten ist die neue Version online. Danach im Browser mit Strg + F5 neu laden.

- `SPIELKONZEPT.md` wird nicht hochgeladen, weil sie in `.gitignore` steht. Sie bleibt nur auf eurem PC.
- Alles im Repository ist öffentlich, auch die Namen in den Credits und die Fotos.

## Hinweise zum Wettbewerb

- Nur reines HTML, CSS und JavaScript, ohne Frameworks oder Bibliotheken.
- Das Spiel lädt nichts aus dem Internet nach: keine Schriften, Icons oder Bilder von Dritten.
- Programmiert mit Unterstützung von Claude Code.
