import React, { useState } from "react";
import {
  BeamElement,
  BeamFemVerification,
  ConcreteClassId,
  StructuralProjectModel,
} from "../types/structural";
import {
  CheckCircle2,
  Cpu,
  Leaf,
  Loader2,
  Sliders,
  TriangleAlert,
  X,
} from "lucide-react";

interface AiAnalysisResponse {
  headline: string;
  normativeChecks: Array<{
    clause: string;
    title: string;
    status: string;
    detail: string;
  }>;
  rebarRecommendations: string[];
  greenOptimization: {
    strategy: string;
    estimatedSteelSavingPct: number;
    estimatedCo2SavingKg: number;
    technicalRationale: string;
  };
  suggestedPatch: {
    b_cm: number;
    h_cm: number;
    topDiameter: number;
    topQty: number;
    bottomDiameter: number;
    bottomQty: number;
    stirrupEndStepCm: number;
    stirrupMidStepCm: number;
    concreteId: string;
  };
}

interface AiStructuralCoPilotProps {
  isOpen: boolean;
  onClose: () => void;
  project: StructuralProjectModel;
  selectedBeam: BeamElement;
  selectedVerification: BeamFemVerification;
  onApplyElementPatch: (
    beamId: string,
    patch: AiAnalysisResponse["suggestedPatch"]
  ) => void;
  onRunGlobalGreenOptimizer: () => void;
  globalOptSummary: {
    beforeSteelKg: number;
    afterSteelKg: number;
    beforeCo2Kg: number;
    afterCo2Kg: number;
    beforeCostEur: number;
    afterCostEur: number;
    changesLog: string[];
  } | null;
}

export const AiStructuralCoPilot: React.FC<AiStructuralCoPilotProps> = ({
  isOpen,
  onClose,
  project,
  selectedBeam,
  selectedVerification,
  onApplyElementPatch,
  onRunGlobalGreenOptimizer,
  globalOptSummary,
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiAnalysisResponse | null>(null);
  const [patchApplied, setPatchApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunGeminiAnalysis = async () => {
    setLoading(true);
    setErrorMsg(null);
    setPatchApplied(false);

    try {
      const projectSummary = {
        project_id: project.project_id,
        normative_code: project.normative_code,
        ductility_class: project.ductility_class,
        beamsCount: project.elements.beams.length,
        columnsCount: project.elements.columns.length,
      };

      const selectedElement = {
        beam: selectedBeam,
        verification: {
          spanL: selectedVerification.spanL,
          M_Ed_left: selectedVerification.M_Ed_left,
          M_Ed_mid: selectedVerification.M_Ed_mid,
          M_Ed_right: selectedVerification.M_Ed_right,
          V_Ed_max: selectedVerification.V_Ed_max,
          M_Rd_neg: selectedVerification.M_Rd_neg,
          M_Rd_pos: selectedVerification.M_Rd_pos,
          V_Rd: selectedVerification.V_Rd,
          dcr_moment_support: selectedVerification.dcr_moment_support,
          dcr_moment_mid: selectedVerification.dcr_moment_mid,
          dcr_shear: selectedVerification.dcr_shear,
          As_top_provided_cm2: selectedVerification.As_top_provided_cm2,
          As_bot_provided_cm2: selectedVerification.As_bot_provided_cm2,
          clashDetected: selectedVerification.clashDetected,
          clashMessage: selectedVerification.clashMessage,
          steelWeightKg: selectedVerification.steelWeightKg,
          embodiedCo2Kg: selectedVerification.embodiedCo2Kg,
        },
      };

      const res = await fetch("/api/copilot/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSummary,
          selectedElement,
          userPrompt: customPrompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Errore durante l'interrogazione dell'AI Structural Co-Pilot.");
      }

      setAiResult(data.analysis);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                AI Structural Co-Pilot & Ottimizzatore Green CO₂
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verifica assistita NTC 2018 / Eurocodice 2, de-conflitto ferri 3D e riduzione impronta carbonica
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Instant Deterministic Multi-Objective Frame Optimizer Card */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <Leaf className="w-4 h-4" />
                  <span>Ottimizzatore Strutturale Green (Intero Telaio 3D)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Ricalibra sezioni, diametri dei ferri e quote z_offset su tutte le travi del modello per eliminare le
                  collisioni 3D nei nodi e minimizzare l'impronta di CO₂ e l'incidenza di acciaio B450C.
                </p>
              </div>
              <button
                type="button"
                onClick={onRunGlobalGreenOptimizer}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Leaf className="w-4 h-4" />
                <span>Ottimizza Intera Struttura Ora</span>
              </button>
            </div>

            {globalOptSummary && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                    <span className="text-slate-500 dark:text-slate-400">Acciaio Totale B450C</span>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                      {globalOptSummary.beforeSteelKg} kg →{" "}
                      <span className="text-emerald-500">{globalOptSummary.afterSteelKg} kg</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                    <span className="text-slate-500 dark:text-slate-400">Embodied Carbon (CO₂e)</span>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                      {globalOptSummary.beforeCo2Kg} kg →{" "}
                      <span className="text-emerald-500">{globalOptSummary.afterCo2Kg} kg</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                    <span className="text-slate-500 dark:text-slate-400">Costo Materiali Stimato</span>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                      € {globalOptSummary.beforeCostEur} →{" "}
                      <span className="text-emerald-500">€ {globalOptSummary.afterCostEur}</span>
                    </div>
                  </div>
                </div>

                {globalOptSummary.changesLog.length > 0 && (
                  <div className="space-y-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                    {globalOptSummary.changesLog.map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deep Gemini AI Co-Pilot Audit on Active Beam */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Analisi Approfondita Co-Pilot IA su Elemento Attivo:{" "}
                  <span className="font-mono text-amber-500">{selectedBeam.id}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
                  Sezione {selectedBeam.section.b}×{selectedBeam.section.h} cm · M_Ed- ={" "}
                  {selectedVerification.M_Ed_left} kNm · M_Ed+ = {selectedVerification.M_Ed_mid} kNm · V_Ed ={" "}
                  {selectedVerification.V_Ed_max} kN
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleRunGeminiAnalysis}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calcolo & Verifica IA in corso...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Esegui Audit Tecnico IA (NTC 2018)</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label htmlFor="copilot-prompt" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Quesito strutturale specifico (opzionale):
              </label>
              <input
                id="copilot-prompt"
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Es. Verifica la gerarchia delle resistenze a taglio e ottimizza l'armatura riducendo l'acciaio..."
                className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {aiResult && (
              <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-medium text-amber-500 mb-1">Relazione Sintetica Co-Pilot</div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {aiResult.headline}
                  </p>
                </div>

                {/* Normative Checks Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Verifiche Normative NTC 2018 / Eurocodice 2
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {aiResult.normativeChecks.map((chk, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            <span className="font-mono text-amber-500 mr-2">{chk.clause}</span>
                            <span>{chk.title}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">{chk.detail}</p>
                        </div>
                        <span
                          className={`font-mono font-semibold shrink-0 ${
                            chk.status === "PASS"
                              ? "text-emerald-500"
                              : chk.status === "WARNING"
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rebar & Green Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Prescrizioni Schema dei Ferri 3D
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {aiResult.rebarRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-mono text-amber-500">0{i + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Strategia Green CO₂ & Acciaio
                    </h4>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {aiResult.greenOptimization.strategy}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {aiResult.greenOptimization.technicalRationale}
                    </p>
                    <div className="pt-2 flex items-center gap-3 text-xs font-mono tabular-nums text-emerald-500">
                      <span>Risparmio Acciaio: -{aiResult.greenOptimization.estimatedSteelSavingPct}%</span>
                      <span aria-hidden="true">·</span>
                      <span>CO₂: -{aiResult.greenOptimization.estimatedCo2SavingKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* One-Click Apply Patch to 3D Model */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Parametri Proposti per {selectedBeam.id}:
                    </div>
                    <div className="font-mono text-slate-600 dark:text-slate-300 mt-0.5 tabular-nums">
                      Sezione {aiResult.suggestedPatch.b_cm}×{aiResult.suggestedPatch.h_cm} cm · Sup:{" "}
                      {aiResult.suggestedPatch.topQty}Ø{aiResult.suggestedPatch.topDiameter} · Inf:{" "}
                      {aiResult.suggestedPatch.bottomQty}Ø{aiResult.suggestedPatch.bottomDiameter} · Staffe Ø8 passo{" "}
                      {aiResult.suggestedPatch.stirrupEndStepCm}/{aiResult.suggestedPatch.stirrupMidStepCm} cm
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onApplyElementPatch(selectedBeam.id, {
                        ...aiResult.suggestedPatch,
                        concreteId: (["C25_30", "C28_35", "C32_40", "C35_45", "C40_50"].includes(
                          aiResult.suggestedPatch.concreteId
                        )
                          ? aiResult.suggestedPatch.concreteId
                          : selectedBeam.material_concrete) as ConcreteClassId,
                      });
                      setPatchApplied(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>
                      {patchApplied ? "Parametri Applicati al Modello 3D" : "Applica Proposta al Modello 3D"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
