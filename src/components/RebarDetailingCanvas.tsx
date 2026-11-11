import React, { useState } from "react";
import { BeamElement, BeamFemVerification } from "../types/structural";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

interface RebarDetailingCanvasProps {
  beam: BeamElement;
  verification: BeamFemVerification;
  onResolveClash: (beamId: string) => void;
}

export const RebarDetailingCanvas: React.FC<RebarDetailingCanvasProps> = ({
  beam,
  verification,
  onResolveClash,
}) => {
  const [activeCrossSection, setActiveCrossSection] = useState<"left_support" | "mid_span" | "right_support">(
    "left_support"
  );

  const L = verification.spanL;
  const b = beam.section.b;
  const h = beam.section.h;
  const c = beam.section.coverCm;
  const topBar = beam.reinforcement_3d.longitudinal_top[0] || {
    diameter: 16,
    quantity: 3,
    length: L + 0.4,
    z_offset: -0.04,
    hookLengthM: 0.24,
  };
  const botBar = beam.reinforcement_3d.longitudinal_bottom[0] || {
    diameter: 14,
    quantity: 4,
    length: L,
    z_offset: 0.04,
    hookLengthM: 0.18,
  };
  const stirrups = beam.reinforcement_3d.stirrups;

  // Generate stirrup x coordinates in SVG space (beam drawn from x=70 to x=670, width=600px)
  const svgBeamX0 = 70;
  const svgBeamW = 600;
  const svgBeamY0 = 55;
  const svgBeamH = 110;

  const stirrupTicks: Array<{ xPx: number; isDissipative: boolean }> = [];
  let xM = 0.06;
  const z1End = stirrups.zones[0].length;
  const z2End = z1End + stirrups.zones[1].length;

  while (xM <= L - 0.06) {
    const isDiss = xM <= z1End || xM >= z2End;
    const stepCm =
      xM <= z1End
        ? stirrups.zones[0].step_cm
        : xM <= z2End
        ? stirrups.zones[1].step_cm
        : stirrups.zones[2].step_cm;

    stirrupTicks.push({
      xPx: svgBeamX0 + (xM / L) * svgBeamW,
      isDissipative: isDiss,
    });
    xM += Math.max(stepCm / 100, 0.05);
  }

  // Moment envelope curve in SVG (below the longitudinal beam elevation)
  const momentPathPoints: string[] = [];
  const momentFillPoints: string[] = [`${svgBeamX0},245`];
  const maxAbsM = Math.max(
    Math.abs(verification.M_Ed_left),
    Math.abs(verification.M_Ed_mid),
    Math.abs(verification.M_Ed_right),
    20
  );

  for (const pt of verification.diagramPoints) {
    const px = svgBeamX0 + (pt.x / L) * svgBeamW;
    // Positive moment plotted downward (+), Negative moment upward (-)
    const py = 245 + (pt.M_slu / maxAbsM) * 42;
    momentPathPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    momentFillPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  momentFillPoints.push(`${svgBeamX0 + svgBeamW},245`);

  const activeStepCm =
    activeCrossSection === "left_support"
      ? stirrups.zones[0].step_cm
      : activeCrossSection === "mid_span"
      ? stirrups.zones[1].step_cm
      : stirrups.zones[2].step_cm;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left 8 Cols: Longitudinal Executive Rebar Drawing + Moment Envelope */}
      <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Tavola Esecutiva Longitudinale — {beam.id}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
              Luce L = {L.toFixed(2)} m · Sezione {b}×{h} cm · Copriferro c = {c} cm · Ancoraggio min L_bd ={" "}
              {verification.anchorage_length_Lbd_cm} cm
            </p>
          </div>

          {verification.clashDetected ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Collisione Nodo Rilevata</span>
              </span>
              <button
                type="button"
                onClick={() => onResolveClash(beam.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Risolvi Clash Quota Ferri</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero Clash 3D nei Nodi · Gerarchia Resistenze OK</span>
            </div>
          )}
        </div>

        {/* Interactive SVG Longitudinal Rebar Blueprint */}
        <div className="w-full overflow-x-auto bg-slate-950 rounded-lg border border-slate-800 p-3">
          <svg
            viewBox="0 0 740 320"
            className="w-full h-auto min-w-[640px]"
            role="img"
            aria-label={`Schema esecutivo dei ferri della trave ${beam.id}`}
          >
            {/* Left & Right Column Supports */}
            <rect x={35} y={20} width={35} height={175} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
            <rect x={670} y={20} width={35} height={175} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
            <text x={52} y={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="IBM Plex Mono">
              {beam.start_node_id}
            </text>
            <text x={687} y={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="IBM Plex Mono">
              {beam.end_node_id}
            </text>

            {/* Concrete Beam Casing */}
            <rect
              x={svgBeamX0}
              y={svgBeamY0}
              width={svgBeamW}
              height={svgBeamH}
              fill="#0f172a"
              stroke="#64748b"
              strokeWidth={1.5}
            />

            {/* Dissipative Zone Shading */}
            <rect
              x={svgBeamX0}
              y={svgBeamY0}
              width={(stirrups.zones[0].length / L) * svgBeamW}
              height={svgBeamH}
              fill="rgba(245, 158, 11, 0.07)"
            />
            <rect
              x={svgBeamX0 + svgBeamW - (stirrups.zones[2].length / L) * svgBeamW}
              y={svgBeamY0}
              width={(stirrups.zones[2].length / L) * svgBeamW}
              height={svgBeamH}
              fill="rgba(245, 158, 11, 0.07)"
            />

            {/* Stirrup Vertical Ticks */}
            {stirrupTicks.map((st, idx) => (
              <line
                key={idx}
                x1={st.xPx}
                y1={svgBeamY0 + 12}
                x2={st.xPx}
                y2={svgBeamY0 + svgBeamH - 12}
                stroke={st.isDissipative ? "#facc15" : "#475569"}
                strokeWidth={st.isDissipative ? 1.5 : 1.1}
                strokeOpacity={0.85}
              />
            ))}

            {/* Top Longitudinal Rebar with 90° Anchorage Hooks */}
            <path
              d={`M ${svgBeamX0 - 16} ${svgBeamY0 + 62} L ${svgBeamX0 - 16} ${svgBeamY0 + 14} L ${
                svgBeamX0 + svgBeamW + 16
              } ${svgBeamY0 + 14} L ${svgBeamX0 + svgBeamW + 16} ${svgBeamY0 + 62}`}
              fill="none"
              stroke="#f97316"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={svgBeamX0 + svgBeamW / 2}
              y={svgBeamY0 - 8}
              textAnchor="middle"
              fill="#fb923c"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              fontWeight={600}
            >
              CORRENTI SUP: {topBar.quantity} Ø{topBar.diameter} (As = {verification.As_top_provided_cm2} cm² vs req{" "}
              {verification.As_top_required_cm2} cm²) · L = {topBar.length.toFixed(2)} m
            </text>

            {/* Bottom Longitudinal Rebar with Upward Hooks */}
            <path
              d={`M ${svgBeamX0 - 12} ${svgBeamY0 + svgBeamH - 54} L ${svgBeamX0 - 12} ${
                svgBeamY0 + svgBeamH - 14
              } L ${svgBeamX0 + svgBeamW + 12} ${svgBeamY0 + svgBeamH - 14} L ${svgBeamX0 + svgBeamW + 12} ${
                svgBeamY0 + svgBeamH - 54
              }`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={3.0}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={svgBeamX0 + svgBeamW / 2}
              y={svgBeamY0 + svgBeamH + 18}
              textAnchor="middle"
              fill="#22d3ee"
              fontSize={11}
              fontFamily="IBM Plex Mono"
              fontWeight={600}
            >
              CORRENTI INF: {botBar.quantity} Ø{botBar.diameter} (As = {verification.As_bot_provided_cm2} cm² vs req{" "}
              {verification.As_bot_required_cm2} cm²) · L = {botBar.length.toFixed(2)} m
            </text>

            {/* Stirrup Zones Dimension Line */}
            <text
              x={svgBeamX0 + ((stirrups.zones[0].length / L) * svgBeamW) / 2}
              y={svgBeamY0 + svgBeamH + 34}
              textAnchor="middle"
              fill="#facc15"
              fontSize={10}
              fontFamily="IBM Plex Mono"
            >
              L_cr = {stirrups.zones[0].length}m (Ø{stirrups.diameter}/{stirrups.zones[0].step_cm}cm)
            </text>
            <text
              x={svgBeamX0 + svgBeamW / 2}
              y={svgBeamY0 + svgBeamH + 34}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={10}
              fontFamily="IBM Plex Mono"
            >
              Zona Centrale = {stirrups.zones[1].length}m (Ø{stirrups.diameter}/{stirrups.zones[1].step_cm}cm)
            </text>
            <text
              x={svgBeamX0 + svgBeamW - ((stirrups.zones[2].length / L) * svgBeamW) / 2}
              y={svgBeamY0 + svgBeamH + 34}
              textAnchor="middle"
              fill="#facc15"
              fontSize={10}
              fontFamily="IBM Plex Mono"
            >
              L_cr = {stirrups.zones[2].length}m (Ø{stirrups.diameter}/{stirrups.zones[2].step_cm}cm)
            </text>

            {/* Bending Moment Diagram M_Ed(x) below */}
            <line
              x1={svgBeamX0}
              y1={245}
              x2={svgBeamX0 + svgBeamW}
              y2={245}
              stroke="#334155"
              strokeDasharray="4 4"
            />
            <polygon points={momentFillPoints.join(" ")} fill="rgba(59, 130, 246, 0.22)" />
            <polyline
              points={momentPathPoints.join(" ")}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={2}
            />
            <text x={svgBeamX0 + 8} y={230} fill="#93c5fd" fontSize={10} fontFamily="IBM Plex Mono">
              -{verification.M_Ed_left} kNm
            </text>
            <text
              x={svgBeamX0 + svgBeamW / 2}
              y={298}
              textAnchor="middle"
              fill="#93c5fd"
              fontSize={10}
              fontFamily="IBM Plex Mono"
            >
              +{verification.M_Ed_mid} kNm (M_Rd+ = {verification.M_Rd_pos} kNm)
            </text>
            <text
              x={svgBeamX0 + svgBeamW - 8}
              y={230}
              textAnchor="end"
              fill="#93c5fd"
              fontSize={10}
              fontFamily="IBM Plex Mono"
            >
              -{verification.M_Ed_right} kNm
            </text>
          </svg>
        </div>
      </div>

      {/* Right 4 Cols: Interactive Cross-Section A-A / B-B / C-C */}
      <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Sezione Trasversale C.A.
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {(
                [
                  { id: "left_support", label: "App. SX" },
                  { id: "mid_span", label: "Campata" },
                  { id: "right_support", label: "App. DX" },
                ] as const
              ).map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveCrossSection(sec.id)}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCrossSection === sec.id
                      ? "bg-amber-500 text-slate-950 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cross Section SVG */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 flex items-center justify-center">
            <svg viewBox="0 0 260 280" className="w-full max-w-[230px] h-auto">
              {/* Concrete Section Box (scaled cleanly) */}
              <rect
                x={55}
                y={25}
                width={150}
                height={210}
                fill="#1e293b"
                stroke="#94a3b8"
                strokeWidth={2}
              />
              {/* Stirrup Loop */}
              <rect
                x={72}
                y={42}
                width={116}
                height={176}
                rx={6}
                fill="none"
                stroke="#facc15"
                strokeWidth={2.5}
              />
              {/* 135 deg seismic stirrup hooks at top-right */}
              <line x1={184} y1={44} x2={170} y2={58} stroke="#facc15" strokeWidth={2.2} />
              <line x1={186} y1={48} x2={172} y2={62} stroke="#facc15" strokeWidth={2.2} />

              {/* Top Rebars */}
              {Array.from({ length: topBar.quantity }).map((_, idx) => {
                const cx =
                  topBar.quantity === 1
                    ? 130
                    : 82 + (idx / (topBar.quantity - 1)) * 96;
                return (
                  <circle
                    key={`top-${idx}`}
                    cx={cx}
                    cy={52}
                    r={6.5}
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Bottom Rebars */}
              {Array.from({ length: botBar.quantity }).map((_, idx) => {
                const cx =
                  botBar.quantity === 1
                    ? 130
                    : 82 + (idx / (botBar.quantity - 1)) * 96;
                return (
                  <circle
                    key={`bot-${idx}`}
                    cx={cx}
                    cy={208}
                    r={6}
                    fill="#06b6d4"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Dimension labels */}
              <text x={130} y={258} textAnchor="middle" fill="#cbd5e1" fontSize={11} fontFamily="IBM Plex Mono">
                b = {b} cm · interferro = {verification.clear_bar_spacing_mm} mm
              </text>
              <text
                x={32}
                y={130}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize={11}
                fontFamily="IBM Plex Mono"
                transform="rotate(-90, 32, 130)"
              >
                h = {h} cm (d = {(h - c - 1.6).toFixed(1)} cm)
              </text>
            </svg>
          </div>
        </div>

        {/* Key Cross-Section Specs */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Armatura Superiore:</span>
            <span className="font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums">
              {topBar.quantity} Ø{topBar.diameter} ({verification.As_top_provided_cm2} cm² · ρ ={" "}
              {verification.rho_top_pct}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Armatura Inferiore:</span>
            <span className="font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums">
              {botBar.quantity} Ø{botBar.diameter} ({verification.As_bot_provided_cm2} cm² · ρ ={" "}
              {verification.rho_bot_pct}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Staffe Sezione Attiva:</span>
            <span className="font-mono font-medium text-amber-600 dark:text-amber-400 tabular-nums">
              Ø{stirrups.diameter} / {activeStepCm} cm ({stirrups.legs} bracci · ganci 135°)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Quota Nodo z_offset:</span>
            <span className="font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums">
              Sup {(topBar.z_offset * 100).toFixed(1)} cm · Inf +{(botBar.z_offset * 100).toFixed(1)} cm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
