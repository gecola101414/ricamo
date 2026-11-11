import React, { useMemo, useState } from "react";
import { CuttingScheduleItem, StructuralProjectModel } from "../types/structural";
import {
  generateProjectBvbsContent,
  generateProjectDxfContent,
  generateProjectIfcContent,
  triggerFileDownload,
} from "../engine/exportGenerators";
import { Copy, Check, Download, FileCode, FileSpreadsheet, Layers } from "lucide-react";

interface CuttingScheduleExportViewProps {
  project: StructuralProjectModel;
  schedule: CuttingScheduleItem[];
  totalConcreteM3: number;
  totalSteelKg: number;
  totalCo2Kg: number;
  totalCostEur: number;
}

export const CuttingScheduleExportView: React.FC<CuttingScheduleExportViewProps> = ({
  project,
  schedule,
  totalConcreteM3,
  totalSteelKg,
  totalCo2Kg,
  totalCostEur,
}) => {
  const [filterDiam, setFilterDiam] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPosId, setCopiedPosId] = useState<string | null>(null);

  const uniqueDiameters = useMemo(() => {
    const set = new Set<number>();
    schedule.forEach((item) => set.add(item.diameterMm));
    return Array.from(set).sort((a, b) => a - b);
  }, [schedule]);

  const filteredItems = useMemo(() => {
    return schedule.filter((item) => {
      if (filterDiam !== "ALL" && item.diameterMm !== filterDiam) return false;
      if (
        searchQuery.trim() &&
        !`${item.posId} ${item.elementId} ${item.elementLabel} ${item.barRole}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [schedule, filterDiam, searchQuery]);

  const handleCopyBvbs = (posId: string, bvbs: string) => {
    navigator.clipboard.writeText(bvbs);
    setCopiedPosId(posId);
    setTimeout(() => setCopiedPosId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Summary Strip + Export Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Distinta di Taglio Acciaio B450C & Interoperabilità BIM/CAD
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Computo metrico aggiornato in tempo reale secondo UNI EN ISO 3766 con stringhe macchina piegatrice BVBS
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                triggerFileDownload(
                  `${project.project_id}_esecutivo_ferri.dxf`,
                  generateProjectDxfContent(project),
                  "application/dxf"
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Esporta DXF CAD (.dxf)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerFileDownload(
                  `${project.project_id}_bim_model.ifc`,
                  generateProjectIfcContent(project),
                  "application/x-step"
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Esporta IFC 4.0 BIM (.ifc)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerFileDownload(
                  `${project.project_id}_piegatura.bvbs.abs`,
                  generateProjectBvbsContent(schedule)
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scarica Piegatura BVBS (.abs)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerFileDownload(
                  `${project.project_id}_structural_model.json`,
                  JSON.stringify(project, null, 2),
                  "application/json"
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Scarica JSON Modello</span>
            </button>
          </div>
        </div>

        {/* 4-Column Quantitative Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Peso Totale Acciaio B450C</span>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {totalSteelKg.toFixed(1)} kg
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              Incidenza media: {(totalSteelKg / Math.max(totalConcreteM3, 0.1)).toFixed(1)} kg/m³
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Volume Getto Calcestruzzo</span>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
              {totalConcreteM3.toFixed(2)} m³
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              Classe {project.materials.concrete.replace("_", "/")} · γ = 25 kN/m³
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Impronta Carbonica (CO₂e)</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
              {totalCo2Kg.toFixed(0)} kg CO₂e
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              LCA A1-A3 (Calcestruzzo + Acciaio)
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Stima Costo Fornitura & Posa</span>
            <div className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
              € {totalCostEur.toLocaleString("it-IT")}
            </div>
            <span className="text-[11px] text-slate-500 font-mono tabular-nums">
              Prezzario opere strutturali C.A.
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar + High-Density Schedule Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setFilterDiam("ALL")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterDiam === "ALL"
                  ? "bg-amber-500 text-slate-950 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Tutti i Diametri ({schedule.length})
            </button>
            {uniqueDiameters.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setFilterDiam(d)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterDiam === d
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Ø{d} mm
              </button>
            ))}
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtra per marca (es. T_101, POS-01, Staffe)..."
            className="w-full sm:w-72 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-950/50">
                <th className="py-3 px-4 font-semibold">Pos.</th>
                <th className="py-3 px-4 font-semibold">Elemento</th>
                <th className="py-3 px-4 font-semibold">Funzione Strutturale & Sagoma</th>
                <th className="py-3 px-4 font-semibold text-right">Diam.</th>
                <th className="py-3 px-4 font-semibold text-right">N° Barre</th>
                <th className="py-3 px-4 font-semibold text-right">L. Taglio</th>
                <th className="py-3 px-4 font-semibold text-right">L. Totale</th>
                <th className="py-3 px-4 font-semibold text-right">Peso Tot.</th>
                <th className="py-3 px-4 font-semibold">Codice Macchina BVBS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-mono tabular-nums">
              {filteredItems.map((item) => (
                <tr
                  key={item.posId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-semibold text-amber-600 dark:text-amber-400">
                    {item.posId}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {item.elementId}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{item.barRole}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Cod. Sagoma ISO {item.shapeCode} · {item.dimensionsLabel}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-sky-600 dark:text-sky-400">
                    Ø{item.diameterMm}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-800 dark:text-slate-200">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                    {item.unitLengthM.toFixed(2)} m
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                    {item.totalLengthM.toFixed(2)} m
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.totalWeightKg.toFixed(1)} kg
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[190px] block">
                        {item.bvbsString}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyBvbs(item.posId, item.bvbsString)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                        title="Copia stringa BVBS"
                      >
                        {copiedPosId === item.posId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
