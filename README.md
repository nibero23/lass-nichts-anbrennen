# Lass nichts anbrennen – Dein erster Tag

Browser-Entscheidungsspiel zum Thema Brandschutz für den JWSL-Kreativwettbewerb 2026/27.
Du bist neuer Azubi und triffst an deinem ersten Arbeitstag 13 Entscheidungen – gegen die Uhr.

## Spiel starten

- **Online:** https://nibero23.github.io/lass-nichts-anbrennen/
- **Lokal:** Doppelklick auf `index.html`. Ein Server wird nicht gebraucht, Internet nur für die Online-Bestenliste.

## Dateien

| Datei | Aufgabe |
| --- | --- |
| `index.html` | Grundgerüst: Statusleiste und die vier Bildschirme (Start, Szene, Feedback, Ende) |
| `style.css` | Aussehen: Farben ganz oben, Anpassung für Handy und PC, Feuer-Effekt |
| `szenen.js` | **Alle Texte und Einstellungen:** Szenen, Antworten, Erklärungen, Spielregeln, Zeitlimit, Bestenliste, Titel, Credits |
| `spiel.js` | Spielablauf: Punkte, Countdown, Hitze-Balken, Bildschirme wechseln |
| `ton.js` | Erzeugt die Töne für richtig, falsch und den Feueralarm direkt im Browser (keine Sounddateien) |
| `bestenliste.js` | Speichert und zeigt die Bestenliste (online oder auf dem Gerät) |
| `pruefung.js` | Prüft `szenen.js` auf Tippfehler und zeigt sie verständlich an |
| `gemeinsam.js` | Hilfsfunktionen für alle Seiten: Freischaltung, persönliche Rekorde, Zeitanzeige |
| `suchbild.html` | Trainingsspiel „Finde die Mängel“ |
| `suchbild.js` | Ablauf des Suchbilds: Antippen, Strafzeit, Tipp, Rekord |
| `suchbild-zeichnung.js` | Die Zeichnung des Suchbilds (SVG aus Code) mit den 8 Mängeln |
| `feuerloescher.html` | Trainingsspiel „Feuerlöscher-Training“ mit Grundriss und Raum-Zeichnung |
| `feuerloescher.js` | Ablauf des Trainings: Entscheidungen, Spielschleife beim Löschen, Steuerung mit Maus, Finger und Tastatur |
| `statistik.html` | Seite „Häufigste Irrtümer“: anonyme Auswertung aller Antworten |
| `statistik.js` | Zählt in der Prüfung anonym die gewählten Antworten und zeigt die Auswertung |
| `info.html` | Zweite Seite „Wissen zum Brandschutz“: Grundwissen immer frei, „Richtig handeln und Lösungen“ erst nach der Prüfung |
| `info.js` | Schaltet „Richtig handeln und Lösungen“ nach der Prüfung frei und baut die Lösungen aus `szenen.js` |
| `firebase-regeln.json` | Regeln für die Online-Bestenliste (siehe unten) |
| `bilder/` | Animierte Szenen (`.svg`), auf Wunsch durch eigene Fotos ersetzbar |

## So läuft ein Spiel ab

```
Start → Szene (25 s Countdown) → Antwort ─┬─→ Feedback → nächste Szene → … → Feierabend → Bestenliste
                                          └─ Hitze 100 %? → Alarmton, Bildschirm brennt → „Brand bricht aus!“ → von vorne
```

| Ereignis | Punkte | Hitze |
| --- | --- | --- |
| richtige Antwort | +10, dazu 1 Bonuspunkt je 5 übrige Sekunden | bleibt gleich |
| plausibel-falsche Antwort | 0 | +20 % |
| offensichtlich falsche Antwort (zurzeit in keiner Szene) | 0 | +35 % |
| Zeit abgelaufen | 0 | +20 % |

- Die Antworten werden bei jedem Durchgang neu gemischt.
- Bei einem Brand ist das Spiel vorbei. Der Bildschirm „Brand bricht aus!“ zeigt den Titel „Brandbeschleuniger“, die richtige Antwort und die Erklärung.
- In die Bestenliste kommt nur, wer den Tag übersteht. Bei gleicher Punktzahl gewinnt, wer weniger Zeit gebraucht hat.
- Nach jeder Antwort kommt ein kurzer Ton: hell und aufsteigend bei richtig, tief und absteigend bei falsch oder zu langsam. Beim Brand heult stattdessen der Feueralarm. Alle Töne lassen sich oben rechts mit „Ton aus“ abschalten.

## Hauptmenü und Trainingsspiele

Der Startbildschirm ist zugleich das Hauptmenü. Unter der Prüfung stehen die Info-Seite und die Trainingsspiele. Die Info-Seite ist immer frei. Die Trainingsspiele sind gesperrt, bis man die Prüfung einmal bis zum Feierabend oder bis zum Brand gespielt hat, weil sie Antworten verraten. Jedes Trainingsspiel speichert einen persönlichen Rekord auf dem Gerät. Welche Spiele im Menü stehen, steht in `szenen.js` unter `MINISPIELE`.

**Finde die Mängel (`suchbild.html`):** In einem gezeichneten Büro mit Flur stecken 8 Brandschutz-Mängel. Antippen behebt sie: Kartons werden weggeräumt, die Brandschutztür fällt zu, die Pflanze vor dem Feuerlöscher verschwindet. Daneben tippen kostet 5 Sekunden, ein Tipp 15 Sekunden. Gewertet wird die Zeit. Auf dem Handy ist das Bild breiter als der Bildschirm und lässt sich seitlich wischen, damit alles groß genug zum Antippen ist. Die Texte zu den Mängeln stehen in `szenen.js` unter `SUCHBILD`.

**Feuerlöscher-Training (`feuerloescher.html`):** Im Lagerraum brennt ein Papierkorb. Schritt 1: Was tust du zuerst? (richtig: Alarm auslösen). Schritt 2: Wo stellst du dich hin? (richtig: Fluchtweg im Rücken, auf einem Grundriss). Falsche Entscheidungen kosten je 10 Sekunden. Schritt 3: Löschen. Gedrückt halten sprüht (Tastatur: Pfeiltasten zielen, Leertaste sprühen). Auf die Glut wirkt es stark, auf die Flammen kaum. Wer länger als eine Sekunde am Stück sprüht, steht in einer Pulverwolke und es wirkt viel schwächer. Ohne Löschen wächst das Feuer wieder. Ist der Löscher leer und es brennt noch, ist der Versuch verloren, mit dem Hinweis „Raum verlassen, Tür schließen“. Die Spielwerte (Wirkung, Verbrauch, Wachstum) stehen oben in `feuerloescher.js`, die Texte in `szenen.js` unter `FEUERLOESCHER`.

**Häufigste Irrtümer (`statistik.html`):** Bei jeder Antwort in der Prüfung zählt das Spiel anonym, welche der drei Antworten gewählt wurde oder ob die Zeit abgelaufen ist. Gespeichert werden nur Zähler in Firebase (z. B. „Szene 8, Antwort 1: 17-mal“), keine Namen und keine Kennungen. Auf dem Startbildschirm steht ein Hinweis darauf. Die Seite zeigt alle Szenen sortiert nach Fehlerquote mit einem Balken pro Antwort. Weil sie die richtigen Antworten zeigt, ist sie erst nach der Prüfung frei. Ohne Online-Datenbank wird nichts gezählt. Werden Szenen oder Antworten in `szenen.js` umsortiert, passen die alten Zähler nicht mehr: dann in der Firebase-Konsole den Eintrag `statistik` löschen.

## Texte ändern

Alles steht in `szenen.js`. Die Regeln dafür stehen ganz oben in der Datei. Die drei wichtigsten:

1. Texte stehen zwischen geraden Anführungszeichen: `"so"`.
2. Im Text selbst deutsche Anführungszeichen „so“ oder einfache 'so' verwenden, keine geraden `"`.
3. Hinter jedem Eintrag steht ein Komma.

Nach dem Speichern im Browser **F5** drücken. Ist etwas kaputt, zeigt das Spiel einen roten Kasten:

- **Online (GitHub Pages):** Im Kasten steht die Zeilennummer direkt, z. B. „szenen.js, Zeile 153“.
- **Per Doppelklick geöffnet:** Hier verrät der Browser dem Spiel aus Sicherheitsgründen keine Zeilennummer. Drückt F12 und öffnet „Konsole“. Dort steht in Rot z. B. `szenen.js:153`, die Zahl ist die Zeile.

Ein falsch geschriebenes Wort bei `art` (z. B. „richitg“) meldet das Spiel immer mit Szene und Antwort.

## Online-Bestenliste einrichten

Solange in `szenen.js` bei `BESTENLISTE` keine `adresse` steht, speichert jedes Gerät seine eigene Bestenliste. Für eine gemeinsame Liste aller Spieler braucht ihr eine kostenlose Firebase-Datenbank von Google (Tarif „Spark“, keine Kreditkarte nötig):

1. Auf https://console.firebase.google.com mit einem Google-Konto anmelden und ein neues Projekt anlegen, z. B. „lass-nichts-anbrennen“. Google Analytics wird nicht gebraucht.
2. Im Menü links **Realtime Database** öffnen und **Datenbank erstellen** wählen. Als Standort **Belgien (europe-west1)** nehmen, damit die Daten in der EU liegen. Im **gesperrten Modus** starten.
3. Im Reiter **Regeln** alles löschen, den Inhalt von `firebase-regeln.json` hineinkopieren und **Veröffentlichen**.
4. Im Reiter **Daten** steht oben die Adresse, z. B. `https://lass-nichts-anbrennen-default-rtdb.europe-west1.firebasedatabase.app`. Diese in `szenen.js` bei `BESTENLISTE` in der Zeile `adresse: "…",` zwischen die Anführungszeichen eintragen. Achtung: nicht die Adresse aus der Adresszeile des Browsers (`console.firebase.google.com/…`), die funktioniert nicht.

Eingerichtet ist die Datenbank `https://feuergame-b8f2c-default-rtdb.europe-west1.firebasedatabase.app` (Projekt `feuergame-b8f2c`, Standort Belgien).
5. Einmal durchspielen und eintragen. Der Eintrag erscheint dann in Firebase unter **Daten**.

Was die Regeln erlauben: Jeder darf die Bestenliste lesen und neue Einträge hinzufügen, aber keine fremden Einträge ändern oder löschen. Die Zähler der Statistik darf jeder lesen und immer nur um genau 1 erhöhen. Namen dürfen höchstens 20 Zeichen lang sein, Punkte höchstens 200 (bei mehr Szenen in `firebase-regeln.json` erhöhen).

**Wichtig:**
- **Unpassende Namen** könnt nur ihr löschen: in der Firebase-Konsole unter **Daten** beim Eintrag auf das Mülleimer-Symbol.
- **Datenschutz:** Die Spitznamen sind öffentlich und liegen bei Google. Das Spiel weist beim Eintragen darauf hin. Klärt mit eurer Lehrkraft, ob das für den Wettbewerb so in Ordnung ist.
- **Schummeln** lässt sich bei einer Webseite ohne eigenen Server nicht ganz verhindern. Die Regeln begrenzen nur, was eingetragen werden kann.

## Info-Seite

`info.html` hat zwei Teile. **Grundwissen** (Zahlen, Branddreieck, Rauch, vorbeugender Brandschutz, Brandklassen, JWSL-Materialien) ist immer frei, damit man vor der Prüfung lernen kann. Dort darf nichts stehen, was eine Antwort aus der Prüfung verrät. **Richtig handeln und Lösungen** (Akkus, Verhalten im Ernstfall, Notruf, Feuerlöscher, Erste Hilfe, Fettbrand und alle Situationen mit Lösung) ist gesperrt, bis man die Prüfung einmal bis zum Feierabend oder bis zum Brand gespielt hat. Am Ende der Prüfung springt der Link „Alle Lösungen ansehen“ direkt dorthin. Gespeichert wird das im Browser (`localStorage`), es gilt also pro Gerät.

Die Texte stehen direkt in `info.html` zwischen `<p>` und `</p>` bzw. `<li>` und `</li>`. Der Abschnitt „Alle Situationen aus dem Spiel“ entsteht automatisch aus `szenen.js`.

Die Materialien der JWSL (Wissensseiten, Filme, Quiz) sind nur verlinkt, nicht kopiert, weil im Wettbewerb keine Inhalte von Dritten verwendet werden dürfen.

## Bilder und Animationen

In `bilder/` liegen animierte Szenen als `.svg`-Dateien: Zeichnungen aus Code mit eingebauter CSS-Animation (Rauch steigt, Flammen flackern, die Brandschutztür drückt gegen den Keil …). Sie wurden mit Claude Code erstellt, das gehört in Feld 5 der Beitragsbeschreibung.

Eigenes Foto statt Animation: Foto im **Querformat 4:3** in `bilder/` speichern (klein geschrieben, Endung `.jpg`, auf etwa 1600 Pixel Breite verkleinert) und in `szenen.js` bei der Szene `bild` ändern, z. B. `bild: "bilder/szene2.jpg",`. Fehlt ein Bild, zeigt das Spiel einen grauen Platzhalter mit dem Dateinamen.

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
- Alles im Repository ist öffentlich, auch die Namen in den Credits.

## Hinweise zum Wettbewerb

- Nur reines HTML, CSS und JavaScript, ohne Frameworks oder Bibliotheken.
- Keine Schriften, Icons, Bilder, Töne oder Musik von Dritten. Der Alarmton wird im Browser erzeugt, die Animationen sind Code.
- Nur die Online-Bestenliste verbindet sich mit einem fremden Dienst (Google Firebase), und nur für Namen und Punkte.
- Programmiert mit Unterstützung von Claude Code, Animationen und Textentwürfe ebenfalls mit Claude Code erstellt.
