import React from 'react';

export const WheelchairGardenDiagram: React.FC = () => {
  return (
    <figure className="bg-white border border-[#1B4332]/15 rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h4 className="font-display text-lg font-semibold text-[#1B4332]">
          Schema Tecnico: Cassone Ergonomico Accessibile (80–85 cm)
        </h4>
        <span className="text-xs font-medium text-[#2D6A4F] tabular-nums">
          Sezione trasversale · Luce inferiore 70 cm
        </span>
      </div>

      <svg
        viewBox="0 0 640 310"
        className="w-full h-auto"
        role="img"
        aria-label="Schema tecnico del cassone rialzato accessibile in sedia a rotelle con incavo inferiore per le ginocchia e compostiera integrata"
      >
        {/* Ground line */}
        <line x1="20" y1="265" x2="620" y2="265" stroke="#1B4332" strokeWidth="2" />
        <rect x="20" y="265" width="600" height="28" fill="#F1F8F5" />
        <text x="320" y="284" textAnchor="middle" fill="#2D6A4F" fontSize="11" fontWeight="600">
          Pavimentazione compatta drenante anti-scivolo (percorso accessibile ≥ 120 cm)
        </text>

        {/* Wheelchair person illustration (left side) */}
        <g transform="translate(82, 86)">
          {/* Person */}
          <circle cx="82" cy="18" r="14" fill="#D8F3DC" stroke="#1B4332" strokeWidth="2.5" />
          {/* Torso */}
          <path
            d="M 74 34 L 74 96 L 128 96 L 146 142"
            fill="none"
            stroke="#1B4332"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Reaching arm toward soil */}
          <path
            d="M 80 48 L 154 62 L 194 58"
            fill="none"
            stroke="#D97706"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hand / gardening */}
          <circle cx="198" cy="57" r="5" fill="#D97706" />

          {/* Wheelchair seat & backrest */}
          <path
            d="M 60 40 L 60 105 L 128 105 L 140 148 L 156 148"
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Large rear wheel */}
          <circle cx="72" cy="138" r="40" fill="none" stroke="#1B4332" strokeWidth="4.5" />
          <circle cx="72" cy="138" r="30" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="72" cy="138" r="5" fill="#1B4332" />
          {/* Front caster */}
          <circle cx="148" cy="166" r="12" fill="none" stroke="#1B4332" strokeWidth="3.5" />
          <circle cx="148" cy="166" r="3" fill="#1B4332" />
        </g>

        {/* Raised Garden Bed (right side, cantilevered left edge for knees) */}
        <g>
          {/* Knee clearance callout */}
          <rect
            x="230"
            y="148"
            width="135"
            height="115"
            fill="#D8F3DC"
            fillOpacity="0.4"
            stroke="#2D6A4F"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="6"
          />
          <text x="297" y="198" textAnchor="middle" fill="#1B4332" fontSize="11" fontWeight="700">
            Incavo libero
          </text>
          <text x="297" y="213" textAnchor="middle" fill="#2D6A4F" fontSize="10.5">
            per ginocchia
          </text>
          <text x="297" y="228" textAnchor="middle" fill="#2D6A4F" fontSize="10.5">
            e pedana (70 cm)
          </text>

          {/* Upper Wooden Planting Tray (Cantilevered) */}
          <rect
            x="232"
            y="92"
            width="285"
            height="54"
            fill="#F5EFE6"
            stroke="#1B4332"
            strokeWidth="2.5"
            rx="4"
          />
          {/* Compost & soil inside upper tray */}
          <rect x="236" y="96" width="277" height="28" fill="#5C4033" fillOpacity="0.88" rx="2" />
          {/* Drainage & geotextile layer */}
          <rect x="236" y="124" width="277" height="18" fill="#D97706" fillOpacity="0.22" />
          <text x="374" y="137" textAnchor="middle" fill="#1B4332" fontSize="10" fontWeight="600">
            Terriccio fertile + Strato drenante
          </text>

          {/* Plants growing on top */}
          <g transform="translate(275, 56)">
            <path d="M 10 40 Q 4 20 14 10 Q 20 24 10 40 Z" fill="#2D6A4F" />
            <path d="M 10 40 Q 24 22 30 14 Q 28 32 10 40 Z" fill="#1B4332" />
            <path d="M 10 40 Q -4 25 -2 12 Q 8 22 10 40 Z" fill="#40916C" />
          </g>
          <g transform="translate(360, 50)">
            <path d="M 14 46 L 14 14" stroke="#1B4332" strokeWidth="2.5" />
            <ellipse cx="7" cy="24" rx="8" ry="4" transform="rotate(-30 7 24)" fill="#2D6A4F" />
            <ellipse cx="21" cy="20" rx="8" ry="4" transform="rotate(30 21 20)" fill="#40916C" />
            <ellipse cx="14" cy="10" rx="6" ry="5" fill="#1B4332" />
          </g>
          <g transform="translate(442, 60)">
            <path d="M 10 36 Q 2 18 12 8 Q 22 20 10 36 Z" fill="#40916C" />
            <path d="M 10 36 Q 22 20 26 12 Q 24 28 10 36 Z" fill="#2D6A4F" />
          </g>

          {/* Supporting Legs & Integrated Bottom Composter (right half) */}
          <rect x="372" y="146" width="14" height="119" fill="#E6D5B8" stroke="#1B4332" strokeWidth="2" />
          <rect x="502" y="146" width="14" height="119" fill="#E6D5B8" stroke="#1B4332" strokeWidth="2" />

          {/* Bottom Composter Box */}
          <rect
            x="386"
            y="162"
            width="116"
            height="103"
            fill="#F1F8F5"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Compost slats */}
          <line x1="386" y1="186" x2="502" y2="186" stroke="#1B4332" strokeWidth="1.5" />
          <line x1="386" y1="210" x2="502" y2="210" stroke="#1B4332" strokeWidth="1.5" />
          <line x1="386" y1="234" x2="502" y2="234" stroke="#1B4332" strokeWidth="1.5" />
          <rect x="394" y="216" width="100" height="44" fill="#3F2E21" fillOpacity="0.85" rx="2" />
          <text x="444" y="178" textAnchor="middle" fill="#1B4332" fontSize="10" fontWeight="700">
            Compostiera
          </text>
          <text x="444" y="202" textAnchor="middle" fill="#2D6A4F" fontSize="9.5" fontWeight="600">
            Scarti + Caffè
          </text>
          <text x="444" y="242" textAnchor="middle" fill="#FAF9F6" fontSize="10" fontWeight="700">
            “Oro Nero”
          </text>
        </g>

        {/* Dimension lines on the right */}
        <g>
          {/* Total height 80-85 cm */}
          <line x1="548" y1="92" x2="548" y2="265" stroke="#D97706" strokeWidth="2" />
          <line x1="540" y1="92" x2="556" y2="92" stroke="#D97706" strokeWidth="2" />
          <line x1="540" y1="265" x2="556" y2="265" stroke="#D97706" strokeWidth="2" />
          <rect x="556" y="154" width="76" height="36" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <text x="594" y="170" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="700">
            80–85 cm
          </text>
          <text x="594" y="183" textAnchor="middle" fill="#92400E" fontSize="9.5">
            Altezza piano
          </text>
        </g>
      </svg>
    </figure>
  );
};

export const SelfWateringPotDiagram: React.FC = () => {
  return (
    <figure className="bg-white border border-[#1B4332]/15 rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h4 className="font-display text-lg font-semibold text-[#1B4332]">
          Schema Tecnico: Vasetto Auto-Irrigante SIP da Bottiglia Riciclata
        </h4>
        <span className="text-xs font-medium text-[#2D6A4F]">
          Sub-Irrigated Planter · Costo zero
        </span>
      </div>

      <svg
        viewBox="0 0 640 280"
        className="w-full h-auto"
        role="img"
        aria-label="Schema in tre passaggi per costruire un vasetto auto-irrigante con bottiglia di plastica tagliata a metà, stoppino in cotone e compost"
      >
        {/* Step 1: Cut bottle */}
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="170" height="232" rx="12" fill="#F1F8F5" stroke="#1B4332" strokeOpacity="0.18" />
          <text x="85" y="24" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            1. Taglia a metà
          </text>
          {/* Bottle body */}
          <path
            d="M 65 48 L 105 48 L 105 64 L 116 80 L 116 196 C 116 202 110 206 104 206 L 66 206 C 60 206 54 202 54 196 L 54 80 L 65 64 Z"
            fill="#E0F2FE"
            fillOpacity="0.7"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Cut dashed line */}
          <line x1="42" y1="126" x2="128" y2="126" stroke="#D97706" strokeWidth="2.5" strokeDasharray="5 4" />
          {/* Scissors symbol */}
          <circle cx="34" cy="122" r="5" fill="none" stroke="#D97706" strokeWidth="2" />
          <circle cx="34" cy="132" r="5" fill="none" stroke="#D97706" strokeWidth="2" />
          <text x="85" y="222" textAnchor="middle" fill="#2D6A4F" fontSize="10.5">
            Bottiglia acqua o bibita
          </text>
        </g>

        {/* Arrow 1 -> 2 */}
        <path d="M 200 140 L 216 140" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="215,134 224,140 215,146" fill="#D97706" />

        {/* Step 2: Cotton wick + inverted top */}
        <g transform="translate(230, 24)">
          <rect x="0" y="0" width="170" height="232" rx="12" fill="#F1F8F5" stroke="#1B4332" strokeOpacity="0.18" />
          <text x="85" y="24" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            2. Stoppino in cotone
          </text>
          {/* Base reservoir */}
          <path
            d="M 52 122 L 52 196 C 52 202 58 206 64 206 L 106 206 C 112 206 118 202 118 196 L 118 122 Z"
            fill="#E0F2FE"
            fillOpacity="0.5"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Water in base */}
          <rect x="54" y="164" width="62" height="40" fill="#38BDF8" fillOpacity="0.35" rx="3" />
          {/* Inverted top cone */}
          <path
            d="M 53 76 L 117 76 L 100 132 L 70 132 Z"
            fill="#FFFFFF"
            fillOpacity="0.75"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Cap pierced */}
          <rect x="74" y="132" width="22" height="10" fill="#D97706" rx="2" />
          {/* Cotton wick */}
          <path
            d="M 85 94 Q 82 135 85 190"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="85" y="222" textAnchor="middle" fill="#2D6A4F" fontSize="10.5">
            Tappo forato + cordino
          </text>
        </g>

        {/* Arrow 2 -> 3 */}
        <path d="M 406 140 L 422 140" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="421,134 430,140 421,146" fill="#D97706" />

        {/* Step 3: Compost & Aromatic cutting */}
        <g transform="translate(436, 24)">
          <rect x="0" y="0" width="180" height="232" rx="12" fill="#FEF3C7" fillOpacity="0.45" stroke="#D97706" strokeOpacity="0.4" />
          <text x="90" y="24" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            3. Compost &amp; Talea
          </text>
          {/* Base reservoir */}
          <path
            d="M 57 122 L 57 196 C 57 202 63 206 69 206 L 111 206 C 117 206 123 202 123 196 L 123 122 Z"
            fill="#E0F2FE"
            fillOpacity="0.55"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Water level */}
          <rect x="59" y="160" width="62" height="44" fill="#38BDF8" fillOpacity="0.45" rx="3" />
          <text x="90" y="186" textAnchor="middle" fill="#1B4332" fontSize="9.5" fontWeight="700">
            Riserva acqua
          </text>

          {/* Inverted top filled with Massimo's compost */}
          <path
            d="M 58 78 L 122 78 L 105 132 L 75 132 Z"
            fill="#5C4033"
            stroke="#1B4332"
            strokeWidth="2"
          />
          {/* Wick drawing water up */}
          <path
            d="M 90 105 Q 88 145 90 192"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeDasharray="3 2"
          />
          {/* Aromatic herb cutting */}
          <path d="M 90 78 L 90 42" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="80" cy="60" rx="9" ry="4" transform="rotate(-25 80 60)" fill="#2D6A4F" />
          <ellipse cx="100" cy="54" rx="9" ry="4" transform="rotate(25 100 54)" fill="#40916C" />
          <ellipse cx="90" cy="40" rx="6" ry="5" fill="#1B4332" />

          <text x="90" y="222" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="600">
            Auto-irrigazione 7 giorni
          </text>
        </g>
      </svg>
    </figure>
  );
};

export const Euro5Banknote: React.FC<{ className?: string }> = ({ className = 'w-28 h-auto' }) => {
  return (
    <svg
      viewBox="0 0 180 94"
      className={className}
      role="img"
      aria-label="Banconota da 5 Euro"
    >
      <defs>
        <linearGradient id="euro5-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E4EBE4" />
          <stop offset="55%" stopColor="#CFDAD0" />
          <stop offset="100%" stopColor="#BDCBC0" />
        </linearGradient>
        <linearGradient id="euro5-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A89A" />
          <stop offset="50%" stopColor="#B8C7BC" />
          <stop offset="100%" stopColor="#7C9484" />
        </linearGradient>
      </defs>

      {/* Outer paper note with soft shadow frame */}
      <rect
        x="2"
        y="2"
        width="176"
        height="90"
        rx="6"
        fill="url(#euro5-bg)"
        stroke="#4A6353"
        strokeWidth="1.5"
      />
      {/* Inner security border */}
      <rect
        x="6"
        y="6"
        width="168"
        height="82"
        rx="4"
        fill="none"
        stroke="#5E7967"
        strokeWidth="0.8"
        strokeDasharray="3 2"
      />

      {/* Right hologram strip */}
      <rect x="148" y="6" width="16" height="82" fill="url(#euro5-band)" fillOpacity="0.65" />
      <circle cx="156" cy="30" r="5" fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1" />
      <text x="156" y="33" textAnchor="middle" fill="#2F4938" fontSize="6" fontWeight="700">
        €
      </text>
      <text x="156" y="66" textAnchor="middle" fill="#2F4938" fontSize="7.5" fontWeight="700">
        5
      </text>

      {/* Left classic arch motif (symbol of 5 Euro banknote) */}
      <g transform="translate(36, 22)" opacity="0.45">
        <path
          d="M 10 52 L 10 22 A 22 22 0 0 1 54 22 L 54 52"
          fill="none"
          stroke="#4A6353"
          strokeWidth="2.5"
        />
        <path
          d="M 18 52 L 18 24 A 14 14 0 0 1 46 24 L 46 52"
          fill="none"
          stroke="#4A6353"
          strokeWidth="1.8"
        />
        <line x1="4" y1="52" x2="60" y2="52" stroke="#4A6353" strokeWidth="2" />
      </g>

      {/* Large top-left 5 */}
      <text
        x="16"
        y="34"
        fill="#1B4332"
        fontSize="26"
        fontWeight="800"
        fontFamily="Georgia, serif"
      >
        5
      </text>

      {/* Center EURO / € label */}
      <text
        x="105"
        y="47"
        textAnchor="middle"
        fill="#1B4332"
        fontSize="13"
        fontWeight="800"
        letterSpacing="1.5"
      >
        EURO
      </text>
      <text
        x="105"
        y="64"
        textAnchor="middle"
        fill="#2D6A4F"
        fontSize="11"
        fontWeight="700"
      >
        5 €
      </text>

      {/* Bottom-left small 5 */}
      <text x="16" y="80" fill="#1B4332" fontSize="11" fontWeight="800">
        5 €
      </text>

      {/* Bottom-right small 5 */}
      <text x="132" y="80" fill="#1B4332" fontSize="12" fontWeight="800">
        5
      </text>
    </svg>
  );
};

export const RecycledCrateDiagram: React.FC = () => {
  return (
    <figure className="bg-white border border-[#1B4332]/15 rounded-2xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h4 className="font-display text-lg font-semibold text-[#1B4332]">
          Il Progetto Semplice della Cassetta in Legno Riciclato
        </h4>
        <span className="text-xs font-medium text-[#2D6A4F] tabular-nums">
          Misure 40 × 30 × 20 cm · Vuoto a rendere
        </span>
      </div>

      <svg
        viewBox="0 0 640 270"
        className="w-full h-auto"
        role="img"
        aria-label="Progetto semplice in 3 passaggi della cassetta riutilizzabile in legno riciclato da restituire al ritiro successivo"
      >
        {/* STEP 1: Reclaimed wood slats */}
        <g transform="translate(18, 20)">
          <rect x="0" y="0" width="176" height="228" rx="12" fill="#F1F8F5" stroke="#1B4332" strokeOpacity="0.18" />
          <text x="88" y="25" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            1. Legno di recupero
          </text>

          {/* Pallet slats */}
          <rect x="26" y="52" width="124" height="16" rx="2" fill="#D4A373" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="26" y="76" width="124" height="16" rx="2" fill="#E6CCB2" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="26" y="100" width="124" height="16" rx="2" fill="#DDB892" stroke="#7F5539" strokeWidth="1.5" />

          {/* Corner blocks */}
          <rect x="34" y="132" width="22" height="36" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="66" y="132" width="22" height="36" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="98" y="132" width="22" height="36" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />
          <rect x="130" y="132" width="22" height="36" rx="2" fill="#B08968" stroke="#7F5539" strokeWidth="1.5" />

          <text x="88" y="196" textAnchor="middle" fill="#1B4332" fontSize="10.5" fontWeight="600">
            Assi di bancali HT
          </text>
          <text x="88" y="212" textAnchor="middle" fill="#2D6A4F" fontSize="10">
            Solo legno naturale, zero vernici
          </text>
        </g>

        {/* Arrow 1 -> 2 */}
        <path d="M 200 134 L 216 134" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="215,128 224,134 215,140" fill="#D97706" />

        {/* STEP 2: Simple Crate Assembly (isometric) */}
        <g transform="translate(230, 20)">
          <rect x="0" y="0" width="188" height="228" rx="12" fill="#FAF9F6" stroke="#1B4332" strokeOpacity="0.18" />
          <text x="94" y="25" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            2. Montaggio semplice
          </text>

          {/* Back inside */}
          <polygon
            points="44,74 148,54 148,128 44,148"
            fill="#B08968"
            fillOpacity="0.45"
            stroke="#7F5539"
            strokeWidth="1.5"
          />
          {/* Left side */}
          <polygon
            points="24,96 44,74 44,148 24,170"
            fill="#DDB892"
            stroke="#7F5539"
            strokeWidth="1.5"
          />
          {/* Handle cutout on left side */}
          <rect x="29" y="106" width="10" height="5" rx="2" fill="#FAF9F6" stroke="#7F5539" strokeWidth="1" />

          {/* Front slats */}
          <polygon
            points="24,96 128,76 128,94 24,114"
            fill="#E6CCB2"
            stroke="#7F5539"
            strokeWidth="1.5"
          />
          <polygon
            points="24,122 128,102 128,120 24,140"
            fill="#D4A373"
            stroke="#7F5539"
            strokeWidth="1.5"
          />
          <polygon
            points="24,148 128,128 128,146 24,166"
            fill="#E6CCB2"
            stroke="#7F5539"
            strokeWidth="1.5"
          />

          {/* Right side */}
          <polygon
            points="128,76 148,54 148,128 128,150"
            fill="#DDB892"
            stroke="#7F5539"
            strokeWidth="1.5"
          />
          {/* Handle cutout on right side */}
          <rect x="134" y="88" width="9" height="5" rx="2" fill="#FAF9F6" stroke="#7F5539" strokeWidth="1" />

          {/* Corner vertical posts */}
          <rect x="24" y="96" width="6" height="70" fill="#9C6644" stroke="#7F5539" strokeWidth="1" />
          <rect x="122" y="76" width="6" height="72" fill="#9C6644" stroke="#7F5539" strokeWidth="1" />

          {/* Screw / nail dots */}
          <circle cx="27" cy="104" r="1.5" fill="#1B4332" />
          <circle cx="27" cy="130" r="1.5" fill="#1B4332" />
          <circle cx="27" cy="156" r="1.5" fill="#1B4332" />
          <circle cx="125" cy="84" r="1.5" fill="#1B4332" />
          <circle cx="125" cy="110" r="1.5" fill="#1B4332" />
          <circle cx="125" cy="136" r="1.5" fill="#1B4332" />

          {/* Dimension labels */}
          <text x="94" y="196" textAnchor="middle" fill="#1B4332" fontSize="10.5" fontWeight="600">
            4 listelli d’angolo + maniglie
          </text>
          <text x="94" y="212" textAnchor="middle" fill="#2D6A4F" fontSize="10">
            Bordi levigati, fessure areate
          </text>
        </g>

        {/* Arrow 2 -> 3 */}
        <path d="M 424 134 L 440 134" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="439,128 448,134 439,140" fill="#D97706" />

        {/* STEP 3: Returnable loop */}
        <g transform="translate(454, 20)">
          <rect x="0" y="0" width="168" height="228" rx="12" fill="#FEF3C7" fillOpacity="0.45" stroke="#D97706" strokeOpacity="0.4" />
          <text x="84" y="25" textAnchor="middle" fill="#1B4332" fontSize="12" fontWeight="700">
            3. Si usa e torna
          </text>

          {/* Circular return arrows */}
          <path
            d="M 42 108 A 42 42 0 0 1 124 96"
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon points="128,102 126,91 117,97" fill="#2D6A4F" />

          <path
            d="M 126 124 A 42 42 0 0 1 44 136"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon points="40,130 42,141 51,135" fill="#D97706" />

          {/* Mini stamped crate in center */}
          <rect x="54" y="92" width="60" height="40" rx="3" fill="#DDB892" stroke="#7F5539" strokeWidth="1.8" />
          <line x1="54" y1="106" x2="114" y2="106" stroke="#7F5539" strokeWidth="1.2" />
          <line x1="54" y1="119" x2="114" y2="119" stroke="#7F5539" strokeWidth="1.2" />
          <text x="84" y="115" textAnchor="middle" fill="#1B4332" fontSize="7.5" fontWeight="800">
            VUOTO A RENDERE
          </text>

          <text x="84" y="182" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="700">
            La restituisci al ritiro
          </text>
          <text x="84" y="198" textAnchor="middle" fill="#1B4332" fontSize="10">
            Zero plastica e un motivo
          </text>
          <text x="84" y="212" textAnchor="middle" fill="#1B4332" fontSize="10">
            per tornare all’orto!
          </text>
        </g>
      </svg>
    </figure>
  );
};

