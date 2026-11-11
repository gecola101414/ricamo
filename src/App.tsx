import React, { useMemo, useState, useEffect } from "react";
import {
  BeamElement,
  BeamFemVerification,
  ColumnElement,
  ColumnFemVerification,
  ConcreteClassId,
  DiagramOverlayType,
  StructuralProjectModel,
  ViewportDisplayMode,
} from "./types/structural";
import {
  generateCuttingSchedule,
  INITIAL_STRUCTURAL_PROJECT,
  runGreenStructuralOptimization,
  verifyBeamElement,
  verifyColumnElement,
} from "./engine/structuralEngine";
import { StructuralViewport3D } from "./components/StructuralViewport3D";
import { ContextualInspectorPanel } from "./components/ContextualInspectorPanel";
import { RebarDetailingCanvas } from "./components/RebarDetailingCanvas";
import { CuttingScheduleExportView } from "./components/CuttingScheduleExportView";
import { ArchitectureBlueprintView } from "./components/ArchitectureBlueprintView";
import { AiStructuralCoPilot } from "./components/AiStructuralCoPilot";
import { NewStructureModal } from "./components/NewStructureModal";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Cpu,
  Plus,
  RotateCcw,
  Sun,
  Moon,
  Leaf,
} from "lucide-react";

type WorkspaceTab =
  | "modello_3d"
  | "analisi_fem"
  | "schema_ferri"
  | "distinta_export"
  | "architettura_json";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("modello_3d");
  const [project, setProject] = useState<StructuralProjectModel>(INITIAL_STRUCTURAL_PROJECT);

  const [selectedElementId, setSelectedElementId] = useState<string>("T_101");
  const [selectedKind, setSelectedKind] = useState<"beam" | "column">("beam");

  const [displayMode, setDisplayMode] = useState<ViewportDisplayMode>("xray_rebar");
  const [diagramOverlay, setDiagramOverlay] = useState<DiagramOverlayType>("none");
  const [explodedTarget, setExplodedTarget] = useState<number>(0);

  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const [newStructureModalOpen, setNewStructureModalOpen] = useState(false);
  const [globalOptSummary, setGlobalOptSummary] = useState<{
    beforeSteelKg: number;
    afterSteelKg: number;
    beforeCo2Kg: number;
    afterCo2Kg: number;
    beforeCostEur: number;
    afterCostEur: number;
    changesLog: string[];
  } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Compute all FEM verifications in real time
  const beamVerifications = useMemo(() => {
    const map: Record<string, BeamFemVerification> = {};
    for (const b of project.elements.beams) {
      map[b.id] = verifyBeamElement(b, project);
    }
    return map;
  }, [project]);

  const columnVerifications = useMemo(() => {
    const map: Record<string, ColumnFemVerification> = {};
    for (const c of project.elements.columns) {
      map[c.id] = verifyColumnElement(c, project);
    }
    return map;
  }, [project]);

  const cuttingSchedule = useMemo(() => generateCuttingSchedule(project), [project]);

  // Aggregate project metrics
  const projectMetrics = useMemo(() => {
    let totalConcreteM3 = 0;
    let totalSteelKg = 0;
    let totalCo2Kg = 0;
    let totalCostEur = 0;
    let clashCount = 0;

    for (const b of project.elements.beams) {
      const v = beamVerifications[b.id];
      if (v) {
        totalConcreteM3 += v.concreteVolumeM3;
        totalSteelKg += v.steelWeightKg;
        totalCo2Kg += v.embodiedCo2Kg;
        totalCostEur += v.estimatedCostEur;
        if (v.clashDetected) clashCount++;
      }
    }
    for (const c of project.elements.columns) {
      const vc = columnVerifications[c.id];
      if (vc) {
        totalConcreteM3 += vc.concreteVolumeM3;
        totalSteelKg += vc.steelWeightKg;
        totalCo2Kg += vc.embodiedCo2Kg;
        totalCostEur += Math.round(vc.concreteVolumeM3 * 140 + vc.steelWeightKg * 1.65);
      }
    }
    for (const f of project.elements.footings) {
      const vFoot = f.widthX * f.lengthY * f.heightZ;
      totalConcreteM3 += vFoot;
      totalSteelKg += vFoot * 65;
      totalCo2Kg += vFoot * 245 + vFoot * 65 * 1.85;
      totalCostEur += Math.round(vFoot * 135 + vFoot * 65 * 1.65);
    }

    return {
      totalConcreteM3: Number(totalConcreteM3.toFixed(2)),
      totalSteelKg: Number(totalSteelKg.toFixed(1)),
      totalCo2Kg: Number(totalCo2Kg.toFixed(0)),
      totalCostEur: Math.round(totalCostEur),
      clashCount,
    };
  }, [project, beamVerifications, columnVerifications]);

  const activeBeam = useMemo(() => {
    return (
      project.elements.beams.find((b) => b.id === selectedElementId) ||
      project.elements.beams[0]
    );
  }, [project, selectedElementId]);

  const activeColumn = useMemo(() => {
    return (
      project.elements.columns.find((c) => c.id === selectedElementId) ||
      project.elements.columns[0]
    );
  }, [project, selectedElementId]);

  const handleSelectElement = (id: string, kind: "beam" | "column") => {
    setSelectedElementId(id);
    setSelectedKind(kind);
  };

  const handleUpdateBeam = (updated: BeamElement) => {
    setProject((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        beams: prev.elements.beams.map((b) => (b.id === updated.id ? updated : b)),
      },
    }));
  };

  const handleUpdateColumn = (updated: ColumnElement) => {
    setProject((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        columns: prev.elements.columns.map((c) => (c.id === updated.id ? updated : c)),
      },
    }));
  };

  const handleResolveBeamClash = (beamId: string) => {
    setProject((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        beams: prev.elements.beams.map((b) => {
          const isTransverse = Math.abs(b.end_node[1] - b.start_node[1]) > 0.5;
          if (b.id === beamId || isTransverse) {
            return {
              ...b,
              reinforcement_3d: {
                ...b.reinforcement_3d,
                longitudinal_top: b.reinforcement_3d.longitudinal_top.map((bar) => ({
                  ...bar,
                  z_offset: isTransverse ? -0.022 : -0.042,
                })),
              },
            };
          }
          return b;
        }),
      },
    }));
  };

  const handleRunGlobalGreenOptimizer = () => {
    const result = runGreenStructuralOptimization(project);
    setProject(result.optimizedProject);
    setGlobalOptSummary({
      beforeSteelKg: result.beforeSteelKg,
      afterSteelKg: result.afterSteelKg,
      beforeCo2Kg: result.beforeCo2Kg,
      afterCo2Kg: result.afterCo2Kg,
      beforeCostEur: result.beforeCostEur,
      afterCostEur: result.afterCostEur,
      changesLog: result.changesLog,
    });
  };

  const handleApplyElementPatch = (
    beamId: string,
    patch: {
      b_cm: number;
      h_cm: number;
      topDiameter: number;
      topQty: number;
      bottomDiameter: number;
      bottomQty: number;
      stirrupEndStepCm: number;
      stirrupMidStepCm: number;
      concreteId: string;
    }
  ) => {
    setProject((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        beams: prev.elements.beams.map((b) => {
          if (b.id !== beamId) return b;
          const nextB = Math.max(20, Math.min(80, patch.b_cm || b.section.b));
          const nextH = Math.max(25, Math.min(120, patch.h_cm || b.section.h));
          const nextG1 = Number(((nextB / 100) * (nextH / 100) * 25).toFixed(2));
          return {
            ...b,
            section: { ...b.section, b: nextB, h: nextH },
            material_concrete: (["C25_30", "C28_35", "C32_40", "C35_45", "C40_50"].includes(
              patch.concreteId
            )
              ? patch.concreteId
              : b.material_concrete) as ConcreteClassId,
            loads: [{ ...b.loads[0], g1: nextG1 }],
            reinforcement_3d: {
              ...b.reinforcement_3d,
              longitudinal_top: [
                {
                  ...b.reinforcement_3d.longitudinal_top[0],
                  diameter: patch.topDiameter || 16,
                  quantity: patch.topQty || 3,
                },
              ],
              longitudinal_bottom: [
                {
                  ...b.reinforcement_3d.longitudinal_bottom[0],
                  diameter: patch.bottomDiameter || 14,
                  quantity: patch.bottomQty || 3,
                },
              ],
              stirrups: {
                ...b.reinforcement_3d.stirrups,
                zones: [
                  {
                    ...b.reinforcement_3d.stirrups.zones[0],
                    step_cm: patch.stirrupEndStepCm || 10,
                  },
                  {
                    ...b.reinforcement_3d.stirrups.zones[1],
                    step_cm: patch.stirrupMidStepCm || 20,
                  },
                  {
                    ...b.reinforcement_3d.stirrups.zones[2],
                    step_cm: patch.stirrupEndStepCm || 10,
                  },
                ],
              },
            },
          };
        }),
      },
    }));
  };

  // Add a new 2nd Story Level (Piano 2) dynamically on click
  const handleAddSecondFloorBay = () => {
    const hasLevel2 = project.elements.beams.some((b) => b.level === 2);
    if (hasLevel2) return;

    const newColumns: ColumnElement[] = project.elements.columns.map((c, idx) => ({
      ...c,
      id: `P_1${idx + 1}`,
      label: `Pilastro P_1${idx + 1} (Filo ${c.gridRef} · P2)`,
      level: 2,
      base_node: [c.top_node[0], c.top_node[1], 3.2],
      top_node: [c.top_node[0], c.top_node[1], 6.4],
      section: { type: "rectangular", b: 35, h: 35, coverCm: 3.5 },
      axialLoadExtraKn: 40,
    }));

    const newBeams: BeamElement[] = project.elements.beams.map((b, idx) => ({
      ...JSON.parse(JSON.stringify(b)),
      id: `T_20${idx + 1}`,
      label: `${b.label.replace("P1", "Copertura P2").replace(b.id, `T_20${idx + 1}`)}`,
      level: 2,
      start_node_id: b.start_node_id.replace("P1", "P2"),
      end_node_id: b.end_node_id.replace("P1", "P2"),
      start_node: [b.start_node[0], b.start_node[1], 6.4],
      end_node: [b.end_node[0], b.end_node[1], 6.4],
    }));

    setProject((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        columns: [...prev.elements.columns, ...newColumns],
        beams: [...prev.elements.beams, ...newBeams],
      },
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mandatory 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("modello_3d");
          }}
          className="text-lg font-bold tracking-tight font-display text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          Gecola Struktura
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          {(
            [
              { id: "modello_3d", label: "Modello 3D" },
              { id: "analisi_fem", label: "Analisi FEM" },
              { id: "schema_ferri", label: "Schema Ferri" },
              { id: "distinta_export", label: "Distinta & Export" },
              { id: "architettura_json", label: "Architettura & JSON" },
            ] as Array<{ id: WorkspaceTab; label: string }>
          ).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
                if (item.id === "analisi_fem" && diagramOverlay === "none") {
                  setDiagramOverlay("moment_M");
                }
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === item.id
                  ? "text-slate-900 dark:text-white border-amber-500 font-semibold"
                  : "border-transparent hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setCoPilotOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Co-Pilot Strutturale IA
          </button>
        </div>
      </header>

      {/* Secondary Workspace Sub-Toolbar (Mobile Nav + Model Tree Quick Actions + Theme Switch) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 text-xs shrink-0">
        {/* Mobile Tab Selector + Breadcrumb Metadata (Zero Pills) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex md:hidden items-center gap-1">
            {(
              [
                { id: "modello_3d", label: "3D" },
                { id: "analisi_fem", label: "FEM" },
                { id: "schema_ferri", label: "Ferri" },
                { id: "distinta_export", label: "Export" },
                { id: "architettura_json", label: "JSON" },
              ] as Array<{ id: WorkspaceTab; label: string }>
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  activeTab === t.id
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono tabular-nums">
            <span>Travi: {project.elements.beams.length}</span>
            <span aria-hidden="true">·</span>
            <span>Pilastri: {project.elements.columns.length}</span>
            <span aria-hidden="true">·</span>
            <span>Acciaio: {projectMetrics.totalSteelKg} kg</span>
            <span aria-hidden="true">·</span>
            <span>Getto Cls: {projectMetrics.totalConcreteM3} m³</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Carbonio: {projectMetrics.totalCo2Kg} kg CO₂e
            </span>
          </div>
        </div>

        {/* Parametric Structure Actions & Theme Switch */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setNewStructureModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Nuova Struttura</span>
          </button>

          <button
            type="button"
            onClick={handleRunGlobalGreenOptimizer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Ottimizza Struttura (Green CO₂)</span>
          </button>

          <button
            type="button"
            onClick={handleAddSecondFloorBay}
            disabled={project.elements.beams.some((b) => b.level === 2)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-500" />
            <span>Sopraeleva 2° Piano C.A.</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProject(INITIAL_STRUCTURAL_PROJECT);
              setGlobalOptSummary(null);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Ripristina Modello Iniziale"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Cambia Tema Chiaro / Scuro"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      {activeTab === "modello_3d" && (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Structural Model Tree Sidebar */}
          <aside className="w-full lg:w-[250px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col max-h-[260px] lg:max-h-none overflow-y-auto">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Albero Strutturale 3D
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Seleziona un'asta per editarne sezione, carichi e armatura
              </p>
            </div>

            <div className="p-3 space-y-4 text-xs">
              {/* Travi */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
                  Travi in C.A. ({project.elements.beams.length})
                </div>
                <div className="space-y-1">
                  {project.elements.beams.map((b) => {
                    const v = beamVerifications[b.id];
                    const active = selectedElementId === b.id && selectedKind === "beam";
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectElement(b.id, "beam")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          active
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-mono font-semibold mr-1.5">{b.id}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {b.section.b}×{b.section.h}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                          {v?.clashDetected && (
                            <span title="Collisione Nodo 3D">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            </span>
                          )}
                          <span
                            className={
                              v?.status === "NON_VERIFICATO"
                                ? "text-red-400"
                                : v?.status === "ATTENZIONE"
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {v ? `${Math.round(Math.max(v.dcr_moment_support, v.dcr_moment_mid) * 100)}%` : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pilastri */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
                  Pilastri ({project.elements.columns.length})
                </div>
                <div className="space-y-1">
                  {project.elements.columns.map((c) => {
                    const vc = columnVerifications[c.id];
                    const active = selectedElementId === c.id && selectedKind === "column";
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectElement(c.id, "column")}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          active
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-mono font-semibold mr-1.5">{c.id}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Filo {c.gridRef} ({c.section.b}×{c.section.h})
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400">
                          {vc ? `${Math.round(vc.dcr_PM * 100)}%` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Center 3D WebGL Hybrid Viewport */}
          <div className="flex-1 h-[620px] lg:h-[calc(100vh-105px)] relative">
            <StructuralViewport3D
              project={project}
              beamVerifications={beamVerifications}
              columnVerifications={columnVerifications}
              selectedElementId={selectedElementId}
              onSelectElement={handleSelectElement}
              displayMode={displayMode}
              onChangeDisplayMode={setDisplayMode}
              diagramOverlay={diagramOverlay}
              onChangeDiagramOverlay={setDiagramOverlay}
              explodedTarget={explodedTarget}
              onChangeExplodedTarget={setExplodedTarget}
              isDark={isDark}
            />
          </div>

          {/* Right Contextual Inspector Panel (Figma-style) */}
          <ContextualInspectorPanel
            selectedKind={selectedKind}
            beam={activeBeam}
            beamVerif={beamVerifications[activeBeam.id]}
            column={activeColumn}
            columnVerif={columnVerifications[activeColumn.id]}
            onUpdateBeam={handleUpdateBeam}
            onUpdateColumn={handleUpdateColumn}
            onResolveBeamClash={handleResolveBeamClash}
          />
        </main>
      )}

      {activeTab === "analisi_fem" && (
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Interactive 3D FEM Diagram Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 h-[480px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <StructuralViewport3D
                project={project}
                beamVerifications={beamVerifications}
                columnVerifications={columnVerifications}
                selectedElementId={selectedElementId}
                onSelectElement={handleSelectElement}
                displayMode={displayMode}
                onChangeDisplayMode={setDisplayMode}
                diagramOverlay={diagramOverlay === "none" ? "moment_M" : diagramOverlay}
                onChangeDiagramOverlay={setDiagramOverlay}
                explodedTarget={explodedTarget}
                onChangeExplodedTarget={setExplodedTarget}
                isDark={isDark}
              />
            </div>

            <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Combinatore Carichi NTC 2018 — {activeBeam.id}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Stati Limite Ultimi (SLU) e di Esercizio (SLE) calcolati automaticamente
                  </p>
                </div>

                {beamVerifications[activeBeam.id] && (
                  <div className="space-y-2.5 text-xs font-mono tabular-nums">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span className="font-sans text-slate-500">SLU Fondamentale (1.3G1+1.5G2+1.5Q):</span>
                      <span className="font-bold text-amber-500">
                        {beamVerifications[activeBeam.id].combinations.q_slu_fundamental} kN/m
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span className="font-sans text-slate-500">SLU Sismica (G1+G2+ψ2·Q):</span>
                      <span className="font-semibold text-sky-400">
                        {beamVerifications[activeBeam.id].combinations.q_slu_seismic} kN/m
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span className="font-sans text-slate-500">SLE Rara / Caratteristica:</span>
                      <span>{beamVerifications[activeBeam.id].combinations.q_sle_rare} kN/m</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span className="font-sans text-slate-500">SLE Frequente (G1+G2+ψ1·Q):</span>
                      <span>{beamVerifications[activeBeam.id].combinations.q_sle_frequent} kN/m</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span className="font-sans text-slate-500">SLE Quasi Permanente (G1+G2+ψ2·Q):</span>
                      <span>{beamVerifications[activeBeam.id].combinations.q_sle_quasi_perm} kN/m</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCoPilotOpen(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Chiedi Verifica Normativa al Co-Pilot IA</span>
              </button>
            </div>
          </div>

          {/* Complete Beams FEM Verification Matrix Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Tabella Riepilogativa Verifiche FEM Travi (SLU Flessione, Taglio Ritter-Mörsch, SLE Freccia & Clash 3D)
                </h3>
                <p className="text-xs text-slate-500">
                  Clicca su una riga per ispezionare l'elemento nel Viewport 3D o nello Schema dei Ferri
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-3 px-4 font-semibold">Trave</th>
                    <th className="py-3 px-4 font-semibold">Sezione</th>
                    <th className="py-3 px-4 font-semibold text-right">q_SLU</th>
                    <th className="py-3 px-4 font-semibold text-right">M_Ed- / M_Rd-</th>
                    <th className="py-3 px-4 font-semibold text-right">M_Ed+ / M_Rd+</th>
                    <th className="py-3 px-4 font-semibold text-right">V_Ed / V_Rd</th>
                    <th className="py-3 px-4 font-semibold text-right">Freccia SLE</th>
                    <th className="py-3 px-4 font-semibold">Clash Nodo 3D</th>
                    <th className="py-3 px-4 font-semibold">Esito NTC 2018</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono tabular-nums">
                  {project.elements.beams.map((b) => {
                    const v = beamVerifications[b.id];
                    if (!v) return null;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => handleSelectElement(b.id, "beam")}
                        className={`cursor-pointer transition-colors ${
                          selectedElementId === b.id
                            ? "bg-amber-500/10"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-semibold text-amber-500">{b.id}</td>
                        <td className="py-2.5 px-4">
                          {b.section.b}×{b.section.h} cm ({b.material_concrete.replace("_", "/")})
                        </td>
                        <td className="py-2.5 px-4 text-right">{v.combinations.q_slu_fundamental} kN/m</td>
                        <td className="py-2.5 px-4 text-right">
                          {v.M_Ed_left} / {v.M_Rd_neg} kNm ({Math.round(v.dcr_moment_support * 100)}%)
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {v.M_Ed_mid} / {v.M_Rd_pos} kNm ({Math.round(v.dcr_moment_mid * 100)}%)
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {v.V_Ed_max} / {v.V_Rd} kN ({Math.round(v.dcr_shear * 100)}%)
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {v.deflection_sle_mm} mm
                        </td>
                        <td className="py-2.5 px-4 font-sans">
                          {v.clashDetected ? (
                            <span className="text-red-400 font-medium">Interferenza Quota</span>
                          ) : (
                            <span className="text-emerald-400">Libero</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-semibold">
                          <span
                            className={
                              v.status === "VERIFICATO"
                                ? "text-emerald-500"
                                : v.status === "ATTENZIONE"
                                ? "text-amber-500"
                                : "text-red-500"
                            }
                          >
                            {v.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {activeTab === "schema_ferri" && (
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Beam Selector Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-2">Seleziona Trave Esecutiva:</span>
              {project.elements.beams.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectElement(b.id, "beam")}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeBeam.id === b.id
                      ? "bg-amber-500 text-slate-950 font-semibold"
                      : "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {b.id} ({b.section.b}×{b.section.h})
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono tabular-nums flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                As,min = {beamVerifications[activeBeam.id]?.As_min_cm2} cm² · As,max ={" "}
                {beamVerifications[activeBeam.id]?.As_max_cm2} cm²
              </span>
            </div>
          </div>

          <RebarDetailingCanvas
            beam={activeBeam}
            verification={beamVerifications[activeBeam.id]}
            onResolveClash={handleResolveBeamClash}
          />
        </main>
      )}

      {activeTab === "distinta_export" && (
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          <CuttingScheduleExportView
            project={project}
            schedule={cuttingSchedule}
            totalConcreteM3={projectMetrics.totalConcreteM3}
            totalSteelKg={projectMetrics.totalSteelKg}
            totalCo2Kg={projectMetrics.totalCo2Kg}
            totalCostEur={projectMetrics.totalCostEur}
          />
        </main>
      )}

      {activeTab === "architettura_json" && (
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          <ArchitectureBlueprintView
            project={project}
            onUpdateProjectFromJson={(updated) => setProject(updated)}
          />
        </main>
      )}

      {/* AI Structural Co-Pilot & Green Optimizer Modal */}
      <AiStructuralCoPilot
        isOpen={coPilotOpen}
        onClose={() => setCoPilotOpen(false)}
        project={project}
        selectedBeam={activeBeam}
        selectedVerification={beamVerifications[activeBeam.id]}
        onApplyElementPatch={handleApplyElementPatch}
        onRunGlobalGreenOptimizer={handleRunGlobalGreenOptimizer}
        globalOptSummary={globalOptSummary}
      />

      {/* Parametric New Structure Modeling Modal */}
      <NewStructureModal
        isOpen={newStructureModalOpen}
        onClose={() => setNewStructureModalOpen(false)}
        onStructureCreated={(newModel) => {
          setProject(newModel);
          setGlobalOptSummary(null);
          if (newModel.elements.beams.length > 0) {
            setSelectedElementId(newModel.elements.beams[0].id);
            setSelectedKind("beam");
          }
          setActiveTab("modello_3d");
        }}
      />
    </div>
  );
}
