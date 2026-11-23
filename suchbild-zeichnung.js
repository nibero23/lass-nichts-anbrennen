/* =====================================================================
   suchbild-zeichnung.js  –  DIE ZEICHNUNG FÜR DAS SUCHBILD
   =====================================================================
   Ein Büro mit Flur, gezeichnet mit Code (SVG). Erstellt mit Claude Code.

   Jeder Mangel ist eine Gruppe <g class="mangel" data-mangel="…"> mit:
     - kaputt:         so sieht man ihn am Anfang
     - behoben:        so sieht es nach dem Antippen aus
     - markierung:     grüner Kreis, sobald gefunden
     - trefferflaeche: unsichtbares Rechteck – hier muss man hintippen
   Die Namen bei data-mangel passen zu den „id“s in szenen.js (SUCHBILD).
   ===================================================================== */

"use strict";

const SUCHBILD_ZEICHNUNG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" role="img" aria-label="Büro und Flur mit versteckten Brandschutz-Mängeln" font-family="Segoe UI, Arial, sans-serif">
<style>
.sb-flackern { transform-box: fill-box; transform-origin: 50% 100%; animation: sb-flackern .4s ease-in-out infinite alternate; }
@keyframes sb-flackern { from { transform: scale(.9,.85); } to { transform: scale(1.08,1.12); } }
.sb-blinken { animation: sb-blinken 1s steps(1) infinite; }
@keyframes sb-blinken { 50% { opacity: .15; } }
.sb-gluehen { animation: sb-gluehen 1.4s ease-in-out infinite alternate; }
@keyframes sb-gluehen { from { opacity: .35; } to { opacity: 1; } }
.sb-welle { animation: sb-welle 1.6s ease-in-out infinite; }
@keyframes sb-welle { 0% { transform: translateY(6px); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(-26px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .sb-flackern, .sb-blinken, .sb-gluehen, .sb-welle { animation: none; } }
</style>
<defs>
  <path id="sb-fl" d="M0,0 C-58,-4 -80,-62 -48,-122 C-40,-98 -24,-92 -18,-104 C-30,-156 -2,-196 22,-226 C26,-176 62,-152 66,-104 C72,-122 78,-134 72,-154 C108,-112 104,-30 58,-6 C42,2 16,3 0,0 Z"/>
  <radialGradient id="sb-glut"><stop offset="0" stop-color="#ffb300" stop-opacity="0.7"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient>
  <radialGradient id="sb-heiss"><stop offset="0" stop-color="#ff6d00" stop-opacity="0.55"/><stop offset="1" stop-color="#ff6d00" stop-opacity="0"/></radialGradient>
</defs>

<!-- Raum, Flur, Boden -->
<rect width="1200" height="900" fill="#ece6da"/>
<rect x="740" width="460" height="682" fill="#dfe4e8"/>
<rect y="680" width="740" height="220" fill="#b59f80"/>
<rect x="740" y="680" width="460" height="220" fill="#9aa4ad"/>
<line x1="0" y1="730" x2="740" y2="730" stroke="#a58f70" stroke-width="3"/><line x1="0" y1="790" x2="740" y2="790" stroke="#a58f70" stroke-width="3"/><line x1="0" y1="850" x2="740" y2="850" stroke="#a58f70" stroke-width="3"/>
<rect y="670" width="560" height="12" fill="#d8ccb8"/>
<rect x="740" y="670" width="460" height="12" fill="#c3cad1"/>
<rect x="560" width="180" height="682" fill="#cbc2b2"/>
<rect width="1200" height="22" fill="#f6f3ee"/>
<rect x="930" y="22" width="120" height="12" rx="4" fill="#fffbe6"/>

<!-- In Ordnung (Ablenkung): Rauchmelder, Fenster, Uhr, Fluchtplan -->
<circle cx="300" cy="44" r="22" fill="#fafafa" stroke="#cfcfcf" stroke-width="3"/>
<circle class="sb-blinken" cx="300" cy="48" r="4" fill="#43a047"/>
<rect x="22" y="90" width="290" height="8" rx="4" fill="#8b6b4a"/>
<rect x="60" y="110" width="210" height="170" fill="#cfe3f3" stroke="#ffffff" stroke-width="10"/>
<line x1="165" y1="110" x2="165" y2="280" stroke="#fff" stroke-width="8"/>
<line x1="60" y1="195" x2="270" y2="195" stroke="#fff" stroke-width="8"/>
<path d="M30 96 Q44 200 32 300 L80 300 Q68 200 80 96 Z" fill="#c0504d"/>
<path d="M250 96 Q264 200 252 300 L302 300 Q290 200 302 96 Z" fill="#c0504d"/>
<rect x="48" y="280" width="234" height="14" fill="#f4f1ea"/>
<circle cx="372" cy="160" r="30" fill="#fff" stroke="#555" stroke-width="5"/>
<line x1="372" y1="160" x2="372" y2="140" stroke="#333" stroke-width="4" stroke-linecap="round"/>
<line x1="372" y1="160" x2="388" y2="168" stroke="#333" stroke-width="4" stroke-linecap="round"/>
<rect x="430" y="128" width="110" height="80" fill="#fff" stroke="#1b8a3a" stroke-width="5"/>
<rect x="442" y="142" width="40" height="26" fill="none" stroke="#999" stroke-width="2"/><rect x="488" y="142" width="40" height="26" fill="none" stroke="#999" stroke-width="2"/>
<line x1="442" y1="182" x2="528" y2="182" stroke="#1b8a3a" stroke-width="4" stroke-dasharray="8 5"/>
<circle cx="462" cy="155" r="4" fill="#c62828"/>

<!-- Schreibtisch, Bildschirm, Papier, Tasse, PC, Papierkorb, Steckdose -->
<rect x="80" y="470" width="400" height="22" fill="#8b6b4a"/>
<rect x="95" y="492" width="18" height="188" fill="#6e5338"/><rect x="447" y="492" width="18" height="188" fill="#6e5338"/>
<rect x="250" y="345" width="150" height="105" rx="6" fill="#2b2f36"/><rect x="260" y="355" width="130" height="85" fill="#5b9bd5"/>
<rect x="315" y="450" width="20" height="16" fill="#2b2f36"/><rect x="290" y="464" width="70" height="6" rx="3" fill="#2b2f36"/>
<rect x="100" y="446" width="100" height="24" fill="#fafafa" stroke="#d6d6d6" stroke-width="2"/>
<line x1="104" y1="452" x2="196" y2="452" stroke="#e3e3e3" stroke-width="2"/><line x1="104" y1="458" x2="196" y2="458" stroke="#e3e3e3" stroke-width="2"/><line x1="104" y1="464" x2="196" y2="464" stroke="#e3e3e3" stroke-width="2"/>
<rect x="420" y="440" width="30" height="30" rx="5" fill="#e0e0e0"/><path d="M450 448 q14 7 0 16" stroke="#e0e0e0" stroke-width="5" fill="none"/>
<rect x="330" y="520" width="60" height="160" rx="6" fill="#3a3f47"/><circle cx="360" cy="540" r="5" fill="#4fc3f7"/>
<polygon points="200,615 255,615 248,680 207,680" fill="#7d8791"/>
<rect x="52" y="590" width="40" height="40" rx="6" fill="#f7f7f7" stroke="#bbb" stroke-width="3"/>
<circle cx="65" cy="610" r="4" fill="#666"/><circle cx="79" cy="610" r="4" fill="#666"/>

<!-- Türrahmen der Brandschutztür -->
<rect x="585" y="250" width="130" height="432" fill="#3d434a"/>
<rect x="579" y="244" width="142" height="438" fill="none" stroke="#5a616b" stroke-width="12"/>

<!-- Flur: Erste-Hilfe-Kasten, Feuerlöscher mit Schild, Steckdose, Notausgang, Rettungszeichen -->
<rect x="900" y="300" width="62" height="56" rx="6" fill="#fff" stroke="#1b8a3a" stroke-width="4"/>
<rect x="924" y="310" width="14" height="36" fill="#1b8a3a"/><rect x="913" y="321" width="36" height="14" fill="#1b8a3a"/>
<rect x="828" y="372" width="60" height="52" rx="4" fill="#d32f2f"/>
<rect x="849" y="386" width="18" height="30" rx="7" fill="#fff"/><rect x="854" y="380" width="8" height="8" fill="#fff"/>
<rect x="840" y="450" width="36" height="112" rx="14" fill="#d32f2f"/>
<rect x="850" y="430" width="16" height="22" fill="#333"/>
<path d="M866 438 Q894 446 886 500" stroke="#333" stroke-width="6" fill="none"/>
<rect x="955" y="585" width="34" height="34" rx="5" fill="#f7f7f7" stroke="#bbb" stroke-width="3"/>
<circle cx="966" cy="602" r="3.5" fill="#666"/><circle cx="978" cy="602" r="3.5" fill="#666"/>
<rect x="1010" y="276" width="160" height="406" fill="#b6bec6"/>
<rect x="1024" y="290" width="132" height="392" fill="#eef1f4"/>
<text x="1090" y="312" font-size="15" font-weight="700" fill="#1b8a3a" text-anchor="middle">NOTAUSGANG</text>
<rect x="1060" y="322" width="60" height="80" rx="5" fill="#bcd3e6" stroke="#9aa9b6" stroke-width="3"/>
<rect x="1036" y="470" width="108" height="14" rx="7" fill="#9aa4ad"/>
<rect x="1020" y="190" width="140" height="58" rx="6" fill="#1b8a3a"/>

  <g transform="translate(1048,240) scale(0.78)" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="10" cy="-56" r="8" fill="#fff" stroke="none"/>
    <path d="M6,-44 L-3,-18"/><path d="M4,-40 L16,-30 L26,-36"/><path d="M4,-40 L-9,-32 L-18,-38"/>
    <path d="M-3,-18 L9,-6 L7,6"/><path d="M-3,-18 L-14,-4 L-27,-2"/>
  </g>
<rect x="1080" y="200" width="28" height="38" fill="none" stroke="#fff" stroke-width="4"/>
<path d="M1118 219 H1148 M1138 209 L1150 219 L1138 229" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

<!-- ===================== DIE 8 MÄNGEL ===================== -->

  <g class="mangel" data-mangel="kerze">
    <g class="kaputt">
    <circle class="sb-gluehen" cx="222" cy="226" r="36" fill="url(#sb-glut)"/>
    <rect x="203" y="268" width="38" height="12" rx="4" fill="#cfcfcf"/>
    <rect x="214" y="236" width="16" height="34" rx="3" fill="#fff8e1" stroke="#e8dcc0" stroke-width="2"/>
    <line x1="222" y1="236" x2="222" y2="230" stroke="#333" stroke-width="2"/>
    <g transform="translate(220,232)"><g class="sb-flackern"><use href="#sb-fl" fill="#ff9d00" transform="scale(.17)"/><use href="#sb-fl" fill="#ffe066" transform="translate(1,0) scale(.1)"/></g></g></g>
    <g class="behoben"></g>
    <circle cx="222" cy="245" r="58" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="158" y="180" width="128" height="126" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="powerbank">
    <g class="kaputt">
    <ellipse cx="150" cy="438" rx="46" ry="13" fill="#2f343b"/>
    <ellipse cx="150" cy="431" rx="36" ry="11" fill="#454b54"/>
    <circle class="sb-blinken" cx="184" cy="438" r="3.5" fill="#e53935"/>
    <path d="M196 440 C228 440 236 462 240 470" stroke="#eeeeee" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <g class="behoben"></g>
    <circle cx="150" cy="440" r="55" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="88" y="392" width="128" height="88" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="steckdosen">
    <g class="kaputt">
    <ellipse class="sb-gluehen" cx="512" cy="640" rx="85" ry="42" fill="url(#sb-heiss)"/>
    <rect x="470" y="575" width="84" height="100" rx="14" fill="#cfd4db" stroke="#9aa1a9" stroke-width="3"/>
    <line x1="484" y1="595" x2="540" y2="595" stroke="#8a929b" stroke-width="5" stroke-linecap="round"/><line x1="484" y1="610" x2="540" y2="610" stroke="#8a929b" stroke-width="5" stroke-linecap="round"/><line x1="484" y1="625" x2="540" y2="625" stroke="#8a929b" stroke-width="5" stroke-linecap="round"/><line x1="484" y1="640" x2="540" y2="640" stroke="#8a929b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="540" cy="662" r="5" fill="#e53935"/>
    <path class="sb-welle" style="animation-delay:-0s" d="M486 568 q8 -10 0 -20 q-8 -10 0 -20" stroke="#ff7043" stroke-width="4" fill="none" stroke-linecap="round"/><path class="sb-welle" style="animation-delay:-0.5s" d="M510 568 q8 -10 0 -20 q-8 -10 0 -20" stroke="#ff7043" stroke-width="4" fill="none" stroke-linecap="round"/><path class="sb-welle" style="animation-delay:-1s" d="M534 568 q8 -10 0 -20 q-8 -10 0 -20" stroke="#ff7043" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g fill="none" stroke="#222" stroke-width="6" stroke-linecap="round">
      <path d="M72 630 C72 660 80 662 90 661"/>
      <path d="M190 661 C196 672 200 669 205 667"/>
      <path d="M305 667 C311 664 314 662 320 661"/>
      <path d="M355 650 C355 600 470 640 470 640"/>
      <path d="M227 656 C227 560 300 520 330 520"/>
    </g>
    
  <rect x="90" y="650" width="100" height="22" rx="8" fill="#fafafa" stroke="#9e9e9e" stroke-width="3"/>
  <circle cx="112" cy="661" r="7" fill="#d6d6d6"/><circle cx="136" cy="661" r="7" fill="#d6d6d6"/><circle cx="160" cy="661" r="7" fill="#d6d6d6"/>
  <rect class="sb-blinken" x="172" y="655" width="12" height="12" rx="3" fill="#e53935"/>
  <rect x="205" y="656" width="100" height="22" rx="8" fill="#fafafa" stroke="#9e9e9e" stroke-width="3"/>
  <circle cx="227" cy="667" r="7" fill="#d6d6d6"/><circle cx="251" cy="667" r="7" fill="#d6d6d6"/><circle cx="275" cy="667" r="7" fill="#d6d6d6"/>
  <rect class="sb-blinken" x="287" y="661" width="12" height="12" rx="3" fill="#e53935"/>
  <rect x="320" y="650" width="100" height="22" rx="8" fill="#fafafa" stroke="#9e9e9e" stroke-width="3"/>
  <circle cx="342" cy="661" r="7" fill="#d6d6d6"/><circle cx="366" cy="661" r="7" fill="#d6d6d6"/><circle cx="390" cy="661" r="7" fill="#d6d6d6"/>
  <rect class="sb-blinken" x="402" y="655" width="12" height="12" rx="3" fill="#e53935"/>
    <rect x="104" y="642" width="16" height="18" rx="3" fill="#333"/>
    <rect x="219" y="648" width="16" height="18" rx="3" fill="#333"/>
    <rect x="334" y="642" width="16" height="18" rx="3" fill="#333"/></g>
    <g class="behoben">
    <g fill="none" stroke="#222" stroke-width="6" stroke-linecap="round"><path d="M72 630 C72 660 80 662 90 661"/><path d="M118 650 C118 560 300 520 330 520"/></g>
    
  <rect x="90" y="650" width="100" height="22" rx="8" fill="#fafafa" stroke="#9e9e9e" stroke-width="3"/>
  <circle cx="112" cy="661" r="7" fill="#d6d6d6"/><circle cx="136" cy="661" r="7" fill="#d6d6d6"/><circle cx="160" cy="661" r="7" fill="#d6d6d6"/>
  <rect  x="172" y="655" width="12" height="12" rx="3" fill="#e53935"/>
    <rect x="104" y="642" width="16" height="18" rx="3" fill="#333"/></g>
    <ellipse cx="300" cy="630" rx="265" ry="80" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="55" y="555" width="505" height="140" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="keil">
    <g class="kaputt">
    <polygon points="715,250 792,226 792,706 715,682" fill="#9aa2ab" stroke="#6f7781" stroke-width="4"/>
    <rect x="768" y="430" width="10" height="56" rx="4" fill="#3d434a"/>
    <g transform="translate(724,296) skewY(-17)">
      <rect width="58" height="40" fill="#fff" stroke="#c62828" stroke-width="3"/>
      <text x="29" y="17" font-size="9" font-weight="800" fill="#c62828" text-anchor="middle">FEUER-</text>
      <text x="29" y="30" font-size="9" font-weight="800" fill="#c62828" text-anchor="middle">SCHUTZTÜR</text>
    </g>
    <polygon points="736,702 800,702 800,684" fill="#c48a4c" stroke="#7d5428" stroke-width="3"/></g>
    <g class="behoben">
    <rect x="585" y="250" width="130" height="432" fill="#9aa2ab"/>
    <line x1="598" y1="264" x2="662" y2="272" stroke="#4b5158" stroke-width="6"/>
    <rect x="603" y="318" width="94" height="54" fill="#fff" stroke="#c62828" stroke-width="3"/>
    <text x="650" y="341" font-size="12" font-weight="800" fill="#c62828" text-anchor="middle">FEUERSCHUTZ-</text>
    <text x="650" y="360" font-size="12" font-weight="800" fill="#c62828" text-anchor="middle">TÜR</text>
    <rect x="690" y="450" width="10" height="56" rx="4" fill="#3d434a"/></g>
    <circle cx="680" cy="470" r="105" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="578" y="222" width="216" height="488" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="loescher">
    <g class="kaputt">
    <ellipse cx="830" cy="520" rx="26" ry="70" fill="#2e7d32" transform="rotate(-25 830 520)"/>
    <ellipse cx="860" cy="500" rx="26" ry="80" fill="#388e3c"/>
    <ellipse cx="892" cy="522" rx="26" ry="70" fill="#2e7d32" transform="rotate(25 892 522)"/>
    <ellipse cx="845" cy="560" rx="24" ry="55" fill="#43a047" transform="rotate(-50 845 560)"/>
    <ellipse cx="878" cy="560" rx="24" ry="55" fill="#43a047" transform="rotate(50 878 560)"/>
    <polygon points="815,600 905,600 893,682 827,682" fill="#8d6e63"/>
    <rect x="810" y="592" width="100" height="14" rx="4" fill="#a1887f"/></g>
    <g class="behoben"></g>
    <circle cx="860" cy="520" r="88" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="796" y="420" width="120" height="268" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="akku">
    <g class="kaputt">
    <path d="M972 619 C978 640 990 650 988 664" stroke="#222" stroke-width="5" fill="none"/>
    <rect x="972" y="662" width="24" height="18" rx="3" fill="#222"/>
    <circle class="sb-blinken" cx="984" cy="671" r="3" fill="#ff9800"/>
    <path d="M972 672 L966 668" stroke="#222" stroke-width="5"/>
    <rect x="926" y="650" width="44" height="30" rx="6" fill="#2f3640"/>
    <rect x="932" y="657" width="22" height="6" rx="2" fill="#7cb342"/></g>
    <g class="behoben"></g>
    <circle cx="958" cy="645" r="50" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="916" y="560" width="84" height="155" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="schild">
    <g class="kaputt">
    <g transform="rotate(-4 1090 219)">
      <rect x="1004" y="172" width="172" height="96" fill="#fff176" stroke="#e0c84a" stroke-width="2"/>
      <text x="1090" y="212" font-size="24" font-weight="800" fill="#d84315" text-anchor="middle">SOMMERFEST</text>
      <text x="1090" y="242" font-size="15" fill="#5d4037" text-anchor="middle">Freitag, 17 Uhr im Hof</text>
      <rect x="998" y="168" width="30" height="11" fill="#f5f5f5" opacity=".85" transform="rotate(-30 1013 173)"/>
      <rect x="1152" y="168" width="30" height="11" fill="#f5f5f5" opacity=".85" transform="rotate(30 1167 173)"/>
    </g></g>
    <g class="behoben"></g>
    <circle cx="1090" cy="219" r="72" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="998" y="158" width="184" height="122" fill="transparent"/>
  </g>


  <g class="mangel" data-mangel="kartons">
    <g class="kaputt">
  <polygon points="1002,560 1024,540 1142,540 1120,560" fill="#dcb27c"/>
  <polygon points="1120,560 1142,540 1142,660 1120,680" fill="#a97d4b"/>
  <rect x="1002" y="560" width="118" height="120" fill="#c79a63"/>
  <rect x="1049" y="560" width="24" height="42" fill="#e3c992"/>
  <rect x="1016" y="636" width="37.76" height="26" fill="#f3efe6"/>
  <polygon points="1100,592 1122,572 1208,572 1186,592" fill="#dcb27c"/>
  <polygon points="1186,592 1208,572 1208,660 1186,680" fill="#a97d4b"/>
  <rect x="1100" y="592" width="86" height="88" fill="#c79a63"/>
  <rect x="1131" y="592" width="24" height="30.799999999999997" fill="#e3c992"/>
  <rect x="1114" y="636" width="27.52" height="26" fill="#f3efe6"/>
  <polygon points="1026,470 1048,450 1140,450 1118,470" fill="#dcb27c"/>
  <polygon points="1118,470 1140,450 1140,540 1118,560" fill="#a97d4b"/>
  <rect x="1026" y="470" width="92" height="90" fill="#c79a63"/>
  <rect x="1060" y="470" width="24" height="31.499999999999996" fill="#e3c992"/>
  <rect x="1040" y="516" width="29.44" height="26" fill="#f3efe6"/></g>
    <g class="behoben"></g>
    <circle cx="1095" cy="580" r="98" class="markierung" fill="none" stroke="#1e7d32" stroke-width="8"/>
    <rect class="trefferflaeche" x="1000" y="440" width="200" height="250" fill="transparent"/>
  </g>
</svg>`;
