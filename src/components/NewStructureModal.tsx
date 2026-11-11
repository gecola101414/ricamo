import React, { useState } from "react";
import {
  ConcreteClassId,
  DuctilityClass,
  SteelClassId,
  StructuralProjectModel,
  UseCategoryId,
} from "../types/structural";
import { CONCRETE_MATERIALS, STEEL_MATERIALS, USE_CATEGORIES } from "../engine/structuralEngine";
import { generateCustomStructuralModel, NewStructureParams } from "../engine/modelGenerator";
import {
  Box,
  Building2,
  Check,
  Grid,
  Layers,
  Sparkles,
  X,
} from "lucide-react";

interface NewStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStructureCreated: (newModel: StructuralProjectModel) => void;
}

export const NewStructureModal: React.FC<NewStructureModalProps> = ({
  isOpen,
  onClose,
  onStructureCreated,
}) => {
  const [params, setParams] = useState<NewStructureParams>({
    projectName: "Nuova Struttura Intelaiata C.A.",
    seismicZone: "Zona Sismica 2 (ag = 0.22g · Sottosuolo B)",
    normativeCode: "NTC_2018",
    ductilityClass: "CD_B",
    concreteClass: "C25_30",
    steelClass: "B450C",
    useCategory: "CAT_A_RES",
    baysX: 2,
    baysY: 1,
    spanLengthX: 5.0,
    spanLengthY: 4.5,
    storyCount: 2,
    storyHeight: 3.2,
    columnWidthB: 35,
    columnDepthH: 35,
    beamWidthB: 30,
    beamDepthH: 50,
    beamCoverCm: 3.5,
  });

  const [presetName, setPresetName] = useState<string>("residenziale_2p");

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: string) => {
    setPresetName(presetKey);
    if (presetKey === "residenziale_2p") {
      setParams({
        ...params,
        projectName: "Edificio Residenziale 2 Piani",
        useCategory: "CAT_A_RES",
        baysX: 2,
        baysY: 1,
        spanLengthX: 5.0,
        spanLengthY: 4.5,
        storyCount: 2,
        storyHeight: 3.2,
        beamDepthH: 50,
      });
    } else if (presetKey === "uffici_3p") {
      setParams({
        ...params,
        projectName: "Palazzina Uffici 3 Piani",
        useCategory: "CAT_B_UFF",
        baysX: 3,
        baysY: 2,
        spanLengthX: 5.5,
        spanLengthY: 5.0,
        storyCount: 3,
        storyHeight: 3.3,
        concreteClass: "C28_35",
        columnWidthB: 40,
        columnDepthH: 40,
        beamDepthH: 55,
      });
    } else if (presetKey === "commerciale_1p") {
      setParams({
        ...params,
        projectName: "Padiglione Commerciale Grande Luce",
        useCategory: "CAT_D_COMM",
        baysX: 2,
        baysY: 1,
        spanLengthX: 6.5,
        spanLengthY: 6.0,
        storyCount: 1,
        storyHeight: 4.2,
        concreteClass: "C32_40",
        columnWidthB: 45,
        columnDepthH: 45,
        beamDepthH: 60,
      });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newModel = generateCustomStructuralModel(params);
    onStructureCreated(newModel);
    onClose();
  };

  // Preview elements counts
  const totalCols = (params.baysX + 1) * (params.baysY + 1) * params.storyCount;
  const totalBeamsPerFloor = params.baysX * (params.baysY + 1) + params.baysY * (params.baysX + 1);
  const totalBeams = totalBeamsPerFloor * params.storyCount;
  const footprintWidthX = (params.baysX * params.spanLengthX).toFixed(1);
  const footprintDepthY = (params.baysY * params.spanLengthY).toFixed(1);
  const totalHeightZ = (params.storyCount * params.storyHeight).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Nuova Struttura in C.A. — Modellazione Parametrica
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Definisci maglia strutturale, campate, piani e armature secondo NTC 2018 / Eurocodice 2
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Typology Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Modelli Tipologici Preimpostati (Quick Presets)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  key: "residenziale_2p",
                  label: "Residenziale (2 Piani)",
                  desc: "2×1 campate · Luce 5.0m · H 3.2m",
                },
                {
                  key: "uffici_3p",
                  label: "Uffici & Studi (3 Piani)",
                  desc: "3×2 campate · Luce 5.5m · H 3.3m",
                },
                {
                  key: "commerciale_1p",
                  label: "Commerciale (Grande Luce)",
                  desc: "2×1 campate · Luce 6.5m · H 4.2m",
                },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleApplyPreset(p.key)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    presetName === p.key
                      ? "bg-amber-500/10 border-amber-500/60 text-amber-600 dark:text-amber-400 font-semibold"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono font-normal">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Nome Progetto
              </label>
              <input
                type="text"
                required
                value={params.projectName}
                onChange={(e) => setParams({ ...params, projectName: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Destinazione d'Uso (Carico Variabile Q NTC 2018)
              </label>
              <select
                value={params.useCategory}
                onChange={(e) => setParams({ ...params, useCategory: e.target.value as UseCategoryId })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              >
                {Object.values(USE_CATEGORIES).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Geometry (Bays, Spans, Stories) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Grid className="w-4 h-4 text-amber-500" />
              <span>Maglia Strutturale & Dimensionamento Volumetrico</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Campate X (n°)
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={params.baysX}
                  onChange={(e) => setParams({ ...params, baysX: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Luce X (m)
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  step={0.5}
                  value={params.spanLengthX}
                  onChange={(e) =>
                    setParams({ ...params, spanLengthX: Math.max(2, Number(e.target.value)) })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Campate Y (n°)
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={params.baysY}
                  onChange={(e) => setParams({ ...params, baysY: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Luce Y (m)
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  step={0.5}
                  value={params.spanLengthY}
                  onChange={(e) =>
                    setParams({ ...params, spanLengthY: Math.max(2, Number(e.target.value)) })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Numero Piani
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={params.storyCount}
                  onChange={(e) =>
                    setParams({ ...params, storyCount: Math.max(1, Number(e.target.value)) })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Altezza Piano (m)
                </label>
                <input
                  type="number"
                  min={2.7}
                  max={6.0}
                  step={0.1}
                  value={params.storyHeight}
                  onChange={(e) =>
                    setParams({ ...params, storyHeight: Math.max(2.4, Number(e.target.value)) })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Classe Duttilità
                </label>
                <select
                  value={params.ductilityClass}
                  onChange={(e) =>
                    setParams({ ...params, ductilityClass: e.target.value as DuctilityClass })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-sans"
                >
                  <option value="CD_B">CD "B" (Media Duttilità)</option>
                  <option value="CD_A">CD "A" (Alta Duttilità)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Calcestruzzo
                </label>
                <select
                  value={params.concreteClass}
                  onChange={(e) =>
                    setParams({ ...params, concreteClass: e.target.value as ConcreteClassId })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-sans"
                >
                  {Object.values(CONCRETE_MATERIALS).map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.label.split(" ")[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Member Initial Sizing (Sections) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Predimensionamento Sezioni Membri C.A.</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Pilastro b (cm)
                </label>
                <input
                  type="number"
                  min={25}
                  max={80}
                  step={5}
                  value={params.columnWidthB}
                  onChange={(e) => setParams({ ...params, columnWidthB: Number(e.target.value) || 30 })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Pilastro h (cm)
                </label>
                <input
                  type="number"
                  min={25}
                  max={80}
                  step={5}
                  value={params.columnDepthH}
                  onChange={(e) => setParams({ ...params, columnDepthH: Number(e.target.value) || 30 })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Trave b (cm)
                </label>
                <input
                  type="number"
                  min={20}
                  max={60}
                  step={5}
                  value={params.beamWidthB}
                  onChange={(e) => setParams({ ...params, beamWidthB: Number(e.target.value) || 30 })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-500 mb-1">
                  Trave h (cm)
                </label>
                <input
                  type="number"
                  min={25}
                  max={120}
                  step={5}
                  value={params.beamDepthH}
                  onChange={(e) => setParams({ ...params, beamDepthH: Number(e.target.value) || 50 })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Model Preview Summary Box */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Anteprima Ingombro: </span>
                <span className="font-mono tabular-nums">
                  {footprintWidthX} × {footprintDepthY} m · Altezza {totalHeightZ} m
                </span>
                <span className="mx-2 text-slate-400">·</span>
                <span className="font-mono tabular-nums">
                  {totalBeams} Travi, {totalCols} Pilastri, {(params.baysX + 1) * (params.baysY + 1)} Plinti
                </span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Armature 3D & De-conflitto nodi generati in automatico
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Annulla
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Genera e Modella Struttura</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
