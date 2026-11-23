/* =====================================================================
   fluchtweg-bilder.js  –  DIE BILDER DER STATIONEN IM FLUCHTWEG-LAUF
   =====================================================================
   Jede Station ist eine kleine Zeichnung aus Code (SVG, 120 × 100).
   Der Name vor dem Doppelpunkt passt zur „id“ in szenen.js (FLUCHTWEG).
   Gezeichnet mit Claude Code – keine fremden Grafiken.
   ===================================================================== */

"use strict";

const FLUCHTWEG_BILDER = {

  // ----- Mängel -----
  kartons: `
    <rect x="72" y="4" width="42" height="16" rx="2" fill="#1b8a3a"/>
    <rect x="98" y="7" width="9" height="10" fill="none" stroke="#fff" stroke-width="2"/>
    <rect x="76" y="22" width="38" height="74" fill="#eef1f4" stroke="#b6bec6" stroke-width="3"/>
    <rect x="8" y="52" width="46" height="44" fill="#c79a63"/><rect x="27" y="52" width="9" height="14" fill="#e3c992"/>
    <rect x="50" y="60" width="44" height="36" fill="#b88a55"/><rect x="68" y="60" width="9" height="12" fill="#e3c992"/>
    <rect x="22" y="22" width="38" height="30" fill="#c79a63"/><rect x="37" y="22" width="9" height="10" fill="#e3c992"/>`,

  keil: `
    <rect x="18" y="6" width="54" height="88" fill="#3d434a" stroke="#5a616b" stroke-width="4"/>
    <polygon points="72,6 104,0 104,100 72,94" fill="#9aa2ab" stroke="#6f7781" stroke-width="2"/>
    <rect x="78" y="28" width="18" height="11" fill="#fff" stroke="#c62828" stroke-width="1.5"/>
    <polygon points="74,98 112,98 112,86" fill="#c48a4c" stroke="#7d5428" stroke-width="2"/>`,

  akku: `
    <rect x="82" y="18" width="24" height="24" rx="3" fill="#f7f7f7" stroke="#bbb" stroke-width="2"/>
    <circle cx="90" cy="30" r="2.5" fill="#666"/><circle cx="98" cy="30" r="2.5" fill="#666"/>
    <path d="M94 42 C96 62 88 72 78 76" stroke="#222" stroke-width="3" fill="none"/>
    <rect x="60" y="72" width="22" height="14" rx="2" fill="#222"/><circle cx="76" cy="79" r="2" fill="#ff9800"/>
    <rect x="10" y="62" width="46" height="30" rx="5" fill="#2f3640"/><rect x="16" y="70" width="24" height="6" fill="#7cb342"/>
    <path d="M36 30 l-8 14 h8 l-5 14 l16 -19 h-8 l5 -9 z" fill="#ffb300"/>`,

  leisten: `
    <rect x="2" y="44" width="18" height="18" rx="3" fill="#f7f7f7" stroke="#bbb" stroke-width="2"/>
    <g fill="none" stroke="#222" stroke-width="3"><path d="M11 62 C11 74 16 76 20 76"/><path d="M50 76 C54 82 56 82 58 82"/><path d="M88 82 C92 80 94 78 96 76"/></g>
    <g fill="#fafafa" stroke="#9e9e9e" stroke-width="2">
      <rect x="20" y="70" width="32" height="12" rx="4"/><rect x="58" y="76" width="32" height="12" rx="4"/><rect x="94" y="70" width="24" height="12" rx="4"/>
    </g>
    <rect x="44" y="72" width="6" height="8" fill="#e53935"/><rect x="82" y="78" width="6" height="8" fill="#e53935"/>
    <rect x="70" y="20" width="40" height="44" rx="8" fill="#cfd4db" stroke="#9aa1a9" stroke-width="2"/>
    <g stroke="#ff7043" stroke-width="3" fill="none" stroke-linecap="round"><path d="M80 16 q5 -6 0 -12"/><path d="M92 16 q5 -6 0 -12"/></g>`,

  powerbank: `
    <path d="M14 46 Q60 14 106 46 Q116 60 106 72 Q60 96 14 72 Q4 60 14 46 Z" fill="#3a3f47"/>
    <path d="M28 44 Q60 26 92 44" stroke="#6c737d" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M44 62 L52 66 L48 70 L56 74" stroke="#8d949e" stroke-width="2" fill="none"/>
    <circle cx="92" cy="66" r="4" fill="#e53935"/>
    <g stroke="#555" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M10 34 q-6 8 -2 16"/><path d="M110 34 q6 8 2 16"/></g>`,

  kerze: `
    <rect x="8" y="64" width="62" height="30" fill="#fafafa" stroke="#ccc" stroke-width="2"/>
    <g stroke="#e3e3e3" stroke-width="2"><line x1="12" y1="72" x2="66" y2="72"/><line x1="12" y1="80" x2="66" y2="80"/><line x1="12" y1="88" x2="66" y2="88"/></g>
    <rect x="12" y="56" width="56" height="8" fill="#f0f0f0" stroke="#ccc" stroke-width="1.5" transform="rotate(-4 40 60)"/>
    <rect x="80" y="54" width="16" height="40" rx="2" fill="#fff8e1" stroke="#e0d4b0" stroke-width="2"/>
    <circle cx="88" cy="38" r="18" fill="#ffb300" opacity=".25"/>
    <path d="M88 52 C78 44 82 28 88 18 C94 28 98 44 88 52 Z" fill="#ff9d00"/>
    <path d="M88 50 C84 45 86 38 88 33 C90 38 92 45 88 50 Z" fill="#ffe066"/>`,

  loescherzu: `
    <rect x="40" y="2" width="30" height="22" rx="2" fill="#d32f2f"/><rect x="50" y="6" width="10" height="14" rx="4" fill="#fff"/>
    <rect x="44" y="34" width="24" height="56" rx="10" fill="#d32f2f"/><rect x="49" y="26" width="14" height="10" fill="#333"/>
    <rect x="16" y="54" width="52" height="42" fill="#c79a63"/><rect x="36" y="54" width="10" height="14" fill="#e3c992"/>
    <rect x="58" y="62" width="50" height="34" fill="#b88a55"/><rect x="78" y="62" width="10" height="12" fill="#e3c992"/>`,

  schildzu: `
    <rect x="10" y="28" width="100" height="44" rx="5" fill="#1b8a3a"/>
    <g transform="rotate(-7 60 50)">
      <rect x="14" y="20" width="92" height="60" fill="#fff176" stroke="#e0c84a" stroke-width="2"/>
      <text x="60" y="48" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#d84315" text-anchor="middle">SOMMER-</text>
      <text x="60" y="66" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#d84315" text-anchor="middle">FEST</text>
    </g>`,

  // ----- In Ordnung -----
  loescher: `
    <rect x="44" y="4" width="32" height="26" rx="2" fill="#d32f2f"/><rect x="55" y="9" width="10" height="16" rx="4" fill="#fff"/>
    <rect x="40" y="42" width="40" height="6" rx="2" fill="#777"/>
    <rect x="46" y="44" width="28" height="52" rx="11" fill="#d32f2f"/><rect x="52" y="34" width="16" height="12" fill="#333"/>
    <path d="M68 38 Q86 44 80 70" stroke="#333" stroke-width="3" fill="none"/>`,

  tuer: `
    <rect x="28" y="4" width="64" height="92" fill="#9aa2ab" stroke="#5a616b" stroke-width="5"/>
    <rect x="40" y="22" width="40" height="18" fill="#fff" stroke="#c62828" stroke-width="2"/>
    <line x1="44" y1="28" x2="76" y2="28" stroke="#c62828" stroke-width="2"/><line x1="44" y1="34" x2="70" y2="34" stroke="#c62828" stroke-width="2"/>
    <rect x="78" y="52" width="5" height="18" rx="2" fill="#3d434a"/>
    <line x1="34" y1="10" x2="62" y2="14" stroke="#4b5158" stroke-width="3"/>`,

  schild: `
    <rect x="10" y="28" width="100" height="44" rx="5" fill="#1b8a3a"/>
    <circle cx="32" cy="38" r="4" fill="#fff"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"><path d="M31 44 L27 56"/><path d="M27 56 L34 63"/><path d="M27 56 L20 62"/><path d="M30 47 L38 52"/><path d="M30 47 L22 50"/></g>
    <rect x="48" y="36" width="18" height="28" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M74 50 H100 M92 43 L101 50 L92 57" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,

  rauchmelder: `
    <rect x="0" y="0" width="120" height="16" fill="#e9e5dc"/>
    <ellipse cx="60" cy="28" rx="36" ry="13" fill="#fafafa" stroke="#c9c9c9" stroke-width="2"/>
    <ellipse cx="60" cy="24" rx="20" ry="6" fill="#efefef"/>
    <circle cx="60" cy="31" r="3.5" fill="#43a047"/>
    <rect x="30" y="56" width="60" height="30" rx="6" fill="#ffffff" stroke="#ddd" stroke-width="2"/>
    <circle cx="60" cy="71" r="9" fill="none" stroke="#bbb" stroke-width="2"/>`,

  erstehilfe: `
    <rect x="26" y="18" width="68" height="64" rx="8" fill="#fff" stroke="#1b8a3a" stroke-width="5"/>
    <rect x="53" y="28" width="14" height="44" fill="#1b8a3a"/><rect x="38" y="43" width="44" height="14" fill="#1b8a3a"/>`,

  ladeschrank: `
    <rect x="24" y="6" width="72" height="90" rx="4" fill="#ffd54f" stroke="#c9a227" stroke-width="3"/>
    <line x1="60" y1="10" x2="60" y2="92" stroke="#c9a227" stroke-width="2"/>
    <rect x="66" y="44" width="5" height="16" rx="2" fill="#555"/>
    <rect x="34" y="20" width="18" height="28" rx="3" fill="#2f3640"/><rect x="40" y="16" width="6" height="5" fill="#2f3640"/>
    <path d="M45 26 l-5 8 h5 l-3 8 l8 -10 h-5 l3 -6 z" fill="#ffb300"/>
    <rect x="30" y="70" width="26" height="8" fill="#e53935"/>`,

  // ----- Ausgänge im Finale -----
  treppe: `
    <rect x="6" y="6" width="108" height="88" fill="#d9dde1" stroke="#6b7480" stroke-width="4"/>
    <polygon points="10,90 10,74 30,74 30,60 50,60 50,46 70,46 70,32 90,32 90,18 110,18 110,90" fill="#a9b0b8" stroke="#8a929b" stroke-width="2"/>
    <rect x="18" y="12" width="40" height="18" rx="2" fill="#1b8a3a"/>
    <path d="M24 21 H50 M44 15 L51 21 L44 27" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,

  aufzug: `
    <rect x="14" y="6" width="92" height="88" fill="#9ba3ac"/>
    <rect x="20" y="14" width="39" height="80" fill="#c7cdd3"/><rect x="61" y="14" width="39" height="80" fill="#c7cdd3"/>
    <rect x="30" y="40" width="60" height="20" fill="#fff" stroke="#c62828" stroke-width="2"/>
    <line x1="36" y1="46" x2="84" y2="46" stroke="#c62828" stroke-width="2"/><line x1="36" y1="53" x2="78" y2="53" stroke="#c62828" stroke-width="2"/>`,

  laptop: `
    <rect x="10" y="60" width="100" height="10" fill="#8b6b4a"/>
    <rect x="18" y="70" width="8" height="26" fill="#6e5338"/><rect x="94" y="70" width="8" height="26" fill="#6e5338"/>
    <rect x="36" y="26" width="52" height="34" rx="3" fill="#2b2f36"/><rect x="40" y="30" width="44" height="26" fill="#5b9bd5"/>
    <rect x="30" y="58" width="64" height="4" rx="2" fill="#555"/>
    <path d="M92 52 q8 -4 10 -14" stroke="#555" stroke-width="3" fill="none"/>`,
};
