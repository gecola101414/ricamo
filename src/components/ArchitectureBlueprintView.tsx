import React, { useState, useEffect } from "react";
import { StructuralProjectModel } from "../types/structural";
import { Check, Code2, Cpu, Database, Layers, RefreshCw, AlertCircle } from "lucide-react";

interface ArchitectureBlueprintViewProps {
  project: StructuralProjectModel;
  onUpdateProjectFromJson: (updated: StructuralProjectModel) => void;
}

export const ArchitectureBlueprintView: React.FC<ArchitectureBlueprintViewProps> = ({
  project,
  onUpdateProjectFromJson,
}) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(project, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(project, null, 2));
  }, [project]);

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as StructuralProjectModel;
      if (!parsed.elements || !Array.isArray(parsed.elements.beams)) {
        throw new Error("Il JSON deve contenere la proprietà 'elements.beams' come array valido.");
      }
      setJsonError(null);
      onUpdateProjectFromJson(parsed);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 2000);
    } catch (e: unknown) {
      setJsonError(e instanceof Error ? e.message : "Errore di sintassi JSON");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left 7 Cols: System Architecture, Stack Matrix & Rebar Math Formulas */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Architettura Tecnica SaaS — Gecola Struktura Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Roadmap architetturale cloud-native per modellazione macro/micro C.A. 3D, solutore FEM e generazione
              automatica ferri secondo NTC 2018 / Eurocodice 2
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
                <Layers className="w-4 h-4" />
                <span>01. Hybrid 3D & Rebar Engine</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Grafo di scena WebGL (Three.js) con rendering sincronizzato del macro-modello (travi, pilastri, plinti)
                e del micro-modello 3D delle armature (TubeGeometry per correnti sagomati e staffe a passo variabile).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                <Cpu className="w-4 h-4" />
                <span>02. FEM Solver & NTC 2018</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Combinatore automatico SLU/SLE (γ_G1=1.3, γ_G2=1.5, γ_Q=1.5), calcolo sollecitazioni M(x), V(x), N(x),
                traliccio di Ritter-Mörsch a inclinazione variabile (cot θ = 2.0) e Clash Detection 3D nei nodi.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Database className="w-4 h-4" />
                <span>03. AI Co-Pilot & BIM Export</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrazione server-side Gemini per audit normativo e riduzione CO₂ incorporata, più generatori nativi
                di file AutoCAD DXF, IFC 4.0 STEP e codici piegatura BVBS (.abs).
              </p>
            </div>
          </div>

          {/* Stack Table */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              Stack Tecnologico & Motivazioni Architetturali
            </h3>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">Layer</th>
                    <th className="py-2.5 px-3 font-semibold">Tecnologia</th>
                    <th className="py-2.5 px-3 font-semibold">Ruolo in Gecola Struktura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">Frontend CAD/CAE</td>
                    <td className="py-2 px-3 font-mono text-amber-500">React 19 + TypeScript + Tailwind v4</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      Pannello proprietà contestuale reattivo, alberi strutturali e tavole esecutive SVG quotate.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">3D Graphics Engine</td>
                    <td className="py-2 px-3 font-mono text-sky-400">Three.js WebGL + PBR RoomEnvironment</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      Switch istantaneo Solido / Unifilare FEM / X-Ray Armature 3D + Esploso assonometrico fluido.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">Motore FEM & Norma</td>
                    <td className="py-2 px-3 font-mono text-emerald-400">TS/Wasm-ready Matrix Engine</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      Verifiche SLU/SLE NTC 2018 §4.1 & §7.4, gerarchia delle resistenze e controllo interferenze 3D.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">AI Co-Pilot Backend</td>
                    <td className="py-2 px-3 font-mono text-purple-400">Node.js Express + @google/genai</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      Analisi intelligente della carpenteria e ottimizzazione multi-obiettivo Acciaio / CO₂e.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Equations Reference */}
          <div className="pt-2 space-y-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Formulazioni Matematiche Chiave (Motore di Calcolo & Dettagliatore Ferri)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-950 text-slate-200 p-4 rounded-lg border border-slate-800">
              <div>
                <div className="text-amber-400 font-semibold mb-1">1. Combinazioni SLU / SLE (NTC 2018 §2.5.3)</div>
                <div>q_SLU = 1.3·G1 + 1.5·G2 + 1.5·Q</div>
                <div>q_SLE,rara = G1 + G2 + Q</div>
                <div>q_SLE,qp = G1 + G2 + ψ2·Q</div>
              </div>
              <div>
                <div className="text-sky-400 font-semibold mb-1">2. Momento Resistente SLU & Minimi (§4.1.6)</div>
                <div>M_Rd = As · f_yd · (d - 0.4·x)</div>
                <div>As,min = max(0.26·(f_ctm/f_yk)·b·d ; 0.0013·b·d)</div>
              </div>
              <div>
                <div className="text-emerald-400 font-semibold mb-1">3. Taglio Traliccio Variabile (§4.1.2.3.5)</div>
                <div>V_Rd,s = (A_sw / s) · 0.9·d · f_yd · cot(θ)</div>
                <div>V_Rd,max = 0.9·d · b · ν · f_cd / (cot θ + tan θ)</div>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-1">4. Passo Staffe Zona Dissipativa (§7.4.6.2)</div>
                <div>s_max = min(8·d_bL ; h/4 ; 150 mm ; 24·d_bw)</div>
                <div>Clash 3D: |z_off,X - z_off,Y| ≥ (Ø_X + Ø_Y)/2 + 2mm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Live Interactive JSON Model Schema Editor */}
      <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Schema Dati Fondamentale JSON (Live Sync 3D)
              </h3>
              <p className="text-[11px] text-slate-500">
                Modifica direttamente il JSON strutturale e aggiorna la scena WebGL e il solutore FEM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {appliedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Sincronizzato!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Applica JSON al 3D</span>
              </>
            )}
          </button>
        </div>

        {jsonError && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{jsonError}</span>
          </div>
        )}

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
          className="w-full flex-1 min-h-[480px] p-3.5 font-mono text-xs bg-slate-950 text-emerald-300 border border-slate-800 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
        />
      </div>
    </div>
  );
};
