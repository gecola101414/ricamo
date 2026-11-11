import React from "react";
import {
  BeamElement,
  BeamFemVerification,
  ColumnElement,
  ColumnFemVerification,
  ConcreteClassId,
  UseCategoryId,
} from "../types/structural";
import {
  CONCRETE_MATERIALS,
  USE_CATEGORIES,
} from "../engine/structuralEngine";
import { AlertTriangle, CheckCircle2, Sliders, Wrench } from "lucide-react";

interface ContextualInspectorPanelProps {
  selectedKind: "beam" | "column";
  beam?: BeamElement;
  beamVerif?: BeamFemVerification;
  column?: ColumnElement;
  columnVerif?: ColumnFemVerification;
  onUpdateBeam: (updated: BeamElement) => void;
  onUpdateColumn: (updated: ColumnElement) => void;
  onResolveBeamClash: (beamId: string) => void;
}

export const ContextualInspectorPanel: React.FC<ContextualInspectorPanelProps> = ({
  selectedKind,
  beam,
  beamVerif,
  column,
  columnVerif,
  onUpdateBeam,
  onUpdateColumn,
  onResolveBeamClash,
}) => {
  if (selectedKind === "column" && column && columnVerif) {
    return (
      <aside className="w-full lg:w-[350px] shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-amber-500">{column.id}</span>
            <span
              className={`text-xs font-mono font-semibold ${
                columnVerif.status === "VERIFICATO"
                  ? "text-emerald-500"
                  : columnVerif.status === "ATTENZIONE"
                  ? "text-amber-500"
                  : "text-red-500"
              }`}
            >
              {columnVerif.status.replace("_", " ")}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
            {column.label}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
            Filo {column.gridRef} · H = {columnVerif.heightH} m · λ = {columnVerif.slenderness_lambda}
          </p>
        </div>

        <div className="p-4 space-y-5 text-xs">
          {/* Geometria & Materiale Pilastro */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>Geometria & Materiale C.A.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Base b (cm)
                </label>
                <input
                  type="number"
                  min={25}
                  max={100}
                  step={5}
                  value={column.section.b}
                  onChange={(e) =>
                    onUpdateColumn({
                      ...column,
                      section: { ...column.section, b: Number(e.target.value) || 30 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Altezza h (cm)
                </label>
                <input
                  type="number"
                  min={25}
                  max={100}
                  step={5}
                  value={column.section.h}
                  onChange={(e) =>
                    onUpdateColumn({
                      ...column,
                      section: { ...column.section, h: Number(e.target.value) || 30 },
                    })
                  }
                  className="w-full px-2.5 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Classe Calcestruzzo
              </label>
              <select
                value={column.material_concrete}
                onChange={(e) =>
                  onUpdateColumn({
                    ...column,
                    material_concrete: e.target.value as ConcreteClassId,
                  })
                }
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              >
                {Object.values(CONCRETE_MATERIALS).map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.label} (fck={mat.fck} MPa)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Carico Assiale Sovrastante N_extra (kN)
              </label>
              <input
                type="number"
                min={0}
                max={2500}
                step={20}
                value={column.axialLoadExtraKn}
                onChange={(e) =>
                  onUpdateColumn({
                    ...column,
                    axialLoadExtraKn: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-2.5 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Armatura Pilastro */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              Schema Armatura Pilastro 3D
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Diametro Ferri (mm)
                </label>
                <select
                  value={column.longitudinalBars.diameter}
                  onChange={(e) =>
                    onUpdateColumn({
                      ...column,
                      longitudinalBars: {
                        ...column.longitudinalBars,
                        diameter: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
                >
                  {[14, 16, 18, 20, 22, 24].map((d) => (
                    <option key={d} value={d}>
                      Ø{d} mm
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Passo Staffe Critico (cm)
                </label>
                <input
                  type="number"
                  min={5}
                  max={20}
                  step={1}
                  value={column.stirrups.endStepCm}
                  onChange={(e) =>
                    onUpdateColumn({
                      ...column,
                      stirrups: {
                        ...column.stirrups,
                        endStepCm: Number(e.target.value) || 8,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Verifiche Pressoflessione M-N & Taglio */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              Verifiche SLU Pilastro (NTC 2018 §7.4.4.2)
            </div>
            <div className="space-y-2 font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Sforzo Normale N_Ed / N_Rd:</span>
                <span>
                  {columnVerif.N_Ed} / {columnVerif.N_Rd_max} kN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Pressoflessione M_Ed / M_Rd:</span>
                <span className={columnVerif.dcr_PM > 1 ? "text-red-500 font-bold" : "text-emerald-500"}>
                  {columnVerif.M_Ed} / {columnVerif.M_Rd} kNm ({(columnVerif.dcr_PM * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Area Acciaio As,tot (ρ%):</span>
                <span>
                  {columnVerif.As_tot_cm2} cm² ({columnVerif.rho_pct}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (!beam || !beamVerif) return null;

  const load = beam.loads[0];
  const topBar = beam.reinforcement_3d.longitudinal_top[0];
  const botBar = beam.reinforcement_3d.longitudinal_bottom[0];
  const stirrups = beam.reinforcement_3d.stirrups;

  const handleSectionChange = (field: "b" | "h" | "coverCm", val: number) => {
    const nextSec = { ...beam.section, [field]: val };
    // Auto-update structural self-weight G1 = (b/100)*(h/100)*25 kN/m3
    const nextG1 = Number(((nextSec.b / 100) * (nextSec.h / 100) * 25).toFixed(2));
    onUpdateBeam({
      ...beam,
      section: nextSec,
      loads: [{ ...load, g1: nextG1 }],
    });
  };

  const handleUseCategoryChange = (catId: UseCategoryId) => {
    const spec = USE_CATEGORIES[catId];
    const trib = load.tributaryWidthM || 3.0;
    onUpdateBeam({
      ...beam,
      loads: [
        {
          ...load,
          useCategory: catId,
          g2: Number((spec.defaultG2SurfaceKnM2 * trib).toFixed(2)),
          q: Number((spec.defaultQSurfaceKnM2 * trib).toFixed(2)),
        },
      ],
    });
  };

  return (
    <aside className="w-full lg:w-[360px] shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-amber-500">{beam.id}</span>
          <span
            className={`text-xs font-mono font-semibold ${
              beamVerif.status === "VERIFICATO"
                ? "text-emerald-500"
                : beamVerif.status === "ATTENZIONE"
                ? "text-amber-500"
                : "text-red-500"
            }`}
          >
            {beamVerif.status.replace("_", " ")}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
          {beam.label}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
          Luce L = {beamVerif.spanL.toFixed(2)} m · Nodi {beam.start_node_id} → {beam.end_node_id}
        </p>
      </div>

      <div className="p-4 space-y-5 text-xs">
        {/* 1. Sezione & Materiale */}
        <div className="space-y-3">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>1. Sezione & Materiali C.A.</span>
            <span className="font-mono text-[11px] text-slate-500">G1 = {load.g1} kN/m</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Base b (cm)
              </label>
              <input
                type="number"
                min={20}
                max={80}
                step={5}
                value={beam.section.b}
                onChange={(e) => handleSectionChange("b", Number(e.target.value) || 30)}
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Altezza h (cm)
              </label>
              <input
                type="number"
                min={25}
                max={120}
                step={5}
                value={beam.section.h}
                onChange={(e) => handleSectionChange("h", Number(e.target.value) || 50)}
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Coprif. c (cm)
              </label>
              <input
                type="number"
                min={2.0}
                max={6.0}
                step={0.5}
                value={beam.section.coverCm}
                onChange={(e) => handleSectionChange("coverCm", Number(e.target.value) || 3.5)}
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              Calcestruzzo Strutturale
            </label>
            <select
              value={beam.material_concrete}
              onChange={(e) =>
                onUpdateBeam({
                  ...beam,
                  material_concrete: e.target.value as ConcreteClassId,
                })
              }
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
            >
              {Object.values(CONCRETE_MATERIALS).map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.label} (fcd={mat.fcd} MPa)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Generatore di Carichi Intelligente & Combinatore NTC */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            2. Carichi & Destinazione d'Uso (NTC 2018)
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              Categoria Solaio (Calcolo Automatico Aree Influenza)
            </label>
            <select
              value={load.useCategory}
              onChange={(e) => handleUseCategoryChange(e.target.value as UseCategoryId)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
            >
              {Object.values(USE_CATEGORIES).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code} — {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                G1 Strutt. (kN/m)
              </label>
              <input
                type="number"
                step={0.25}
                value={load.g1}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    loads: [{ ...load, g1: Number(e.target.value) || 0 }],
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                G2 Portati (kN/m)
              </label>
              <input
                type="number"
                step={0.5}
                value={load.g2}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    loads: [{ ...load, g2: Number(e.target.value) || 0 }],
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Q Variab. (kN/m)
              </label>
              <input
                type="number"
                step={0.5}
                value={load.q}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    loads: [{ ...load, q: Number(e.target.value) || 0 }],
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] tabular-nums space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Comb. SLU Fondamentale:</span>
              <span className="font-semibold text-amber-500">
                {beamVerif.combinations.q_slu_fundamental} kN/m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Comb. SLE Rara / Quasi Perm.:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {beamVerif.combinations.q_sle_rare} / {beamVerif.combinations.q_sle_quasi_perm} kN/m
              </span>
            </div>
          </div>
        </div>

        {/* 3. Schema dei Ferri 3D (Rebar Engine Parametrico) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            3. Dettagliatore Armature 3D (B450C)
          </div>

          {/* Correnti Superiori */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-orange-400 mb-1">N° Sup.</label>
              <input
                type="number"
                min={2}
                max={8}
                value={topBar.quantity}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      longitudinal_top: [
                        { ...topBar, quantity: Math.max(2, Number(e.target.value) || 2) },
                      ],
                    },
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-orange-400 mb-1">Ø Sup. (mm)</label>
              <select
                value={topBar.diameter}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      longitudinal_top: [{ ...topBar, diameter: Number(e.target.value) }],
                    },
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              >
                {[12, 14, 16, 18, 20, 22, 24].map((d) => (
                  <option key={d} value={d}>
                    Ø{d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">z_offset (m)</label>
              <input
                type="number"
                step={0.005}
                value={topBar.z_offset}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      longitudinal_top: [{ ...topBar, z_offset: Number(e.target.value) }],
                    },
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Correnti Inferiori */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-cyan-400 mb-1">N° Inf.</label>
              <input
                type="number"
                min={2}
                max={8}
                value={botBar.quantity}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      longitudinal_bottom: [
                        { ...botBar, quantity: Math.max(2, Number(e.target.value) || 2) },
                      ],
                    },
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-cyan-400 mb-1">Ø Inf. (mm)</label>
              <select
                value={botBar.diameter}
                onChange={(e) =>
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      longitudinal_bottom: [{ ...botBar, diameter: Number(e.target.value) }],
                    },
                  })
                }
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              >
                {[12, 14, 16, 18, 20, 22, 24].map((d) => (
                  <option key={d} value={d}>
                    Ø{d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-amber-400 mb-1">Staffe Crit (cm)</label>
              <input
                type="number"
                min={5}
                max={25}
                value={stirrups.zones[0].step_cm}
                onChange={(e) => {
                  const s = Math.max(5, Number(e.target.value) || 10);
                  onUpdateBeam({
                    ...beam,
                    reinforcement_3d: {
                      ...beam.reinforcement_3d,
                      stirrups: {
                        ...stirrups,
                        zones: [
                          { ...stirrups.zones[0], step_cm: s },
                          stirrups.zones[1],
                          { ...stirrups.zones[2], step_cm: s },
                        ],
                      },
                    },
                  });
                }}
                className="w-full px-2 py-1.5 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {beamVerif.clashDetected && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 space-y-2">
              <div className="flex items-start gap-2 text-red-200 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{beamVerif.clashMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => onResolveBeamClash(beam.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Sfalsa Automaticamente Quota Nodo</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Verifiche in Tempo Reale SLU / SLE */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            4. Stato Verifiche FEM (SLU & SLE)
          </div>

          <div className="space-y-2.5 font-mono tabular-nums">
            {/* Momento Appoggio */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-sans text-slate-500">Flessione Appoggi (M_Ed- / M_Rd-):</span>
                <span className={beamVerif.dcr_moment_support > 1 ? "text-red-500 font-bold" : "text-slate-800 dark:text-slate-200"}>
                  {beamVerif.M_Ed_left} / {beamVerif.M_Rd_neg} kNm ({(beamVerif.dcr_moment_support * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    beamVerif.dcr_moment_support > 1
                      ? "bg-red-500"
                      : beamVerif.dcr_moment_support > 0.85
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, beamVerif.dcr_moment_support * 100)}%` }}
                />
              </div>
            </div>

            {/* Momento Campata */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-sans text-slate-500">Flessione Campata (M_Ed+ / M_Rd+):</span>
                <span className={beamVerif.dcr_moment_mid > 1 ? "text-red-500 font-bold" : "text-slate-800 dark:text-slate-200"}>
                  {beamVerif.M_Ed_mid} / {beamVerif.M_Rd_pos} kNm ({(beamVerif.dcr_moment_mid * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    beamVerif.dcr_moment_mid > 1
                      ? "bg-red-500"
                      : beamVerif.dcr_moment_mid > 0.85
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, beamVerif.dcr_moment_mid * 100)}%` }}
                />
              </div>
            </div>

            {/* Taglio SLU */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-sans text-slate-500">Taglio SLU (V_Ed / V_Rd):</span>
                <span className={beamVerif.dcr_shear > 1 ? "text-red-500 font-bold" : "text-slate-800 dark:text-slate-200"}>
                  {beamVerif.V_Ed_max} / {beamVerif.V_Rd} kN ({(beamVerif.dcr_shear * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    beamVerif.dcr_shear > 1
                      ? "bg-red-500"
                      : beamVerif.dcr_shear > 0.85
                      ? "bg-amber-500"
                      : "bg-sky-500"
                  }`}
                  style={{ width: `${Math.min(100, beamVerif.dcr_shear * 100)}%` }}
                />
              </div>
            </div>

            {/* Freccia SLE & Apertura fessure */}
            <div className="pt-2 flex justify-between text-[11px]">
              <span className="font-sans text-slate-500">Freccia SLE (lim L/250 = {beamVerif.deflection_limit_mm} mm):</span>
              <span className="text-slate-800 dark:text-slate-200">{beamVerif.deflection_sle_mm} mm</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="font-sans text-slate-500">Apertura Fessure w_k (SLE):</span>
              <span className="text-slate-800 dark:text-slate-200">{beamVerif.crack_width_wk_mm} mm</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="font-sans text-slate-500">Acciaio / Impronta CO₂ Trave:</span>
              <span className="text-emerald-500">
                {beamVerif.steelWeightKg} kg · {beamVerif.embodiedCo2Kg} kg CO₂e
              </span>
            </div>
          </div>

          {beamVerif.warnings.length === 0 ? (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Tutte le verifiche NTC 2018 SLU/SLE e sismiche soddisfatte.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {beamVerif.warnings.map((w, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px]"
                >
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
