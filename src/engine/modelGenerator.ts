import {
  BeamElement,
  ColumnElement,
  ConcreteClassId,
  DuctilityClass,
  FootingElement,
  SteelClassId,
  StructuralProjectModel,
  UseCategoryId,
} from "../types/structural";
import { USE_CATEGORIES } from "./structuralEngine";

export interface NewStructureParams {
  projectName: string;
  seismicZone: string;
  normativeCode: "NTC_2018" | "EUROCODE_2";
  ductilityClass: DuctilityClass;
  concreteClass: ConcreteClassId;
  steelClass: SteelClassId;
  useCategory: UseCategoryId;
  // Griglia e Geometria
  baysX: number; // Numero campate in X (es. 2 o 3)
  baysY: number; // Numero campate in Y (es. 1 o 2)
  spanLengthX: number; // Luce campata X in m (es. 5.0)
  spanLengthY: number; // Luce campata Y in m (es. 4.5)
  storyCount: number; // Numero piani (es. 1, 2 o 3)
  storyHeight: number; // Altezza interpiano in m (es. 3.2)
  // Sezioni tipologiche di partenza
  columnWidthB: number; // cm (es. 35 o 40)
  columnDepthH: number; // cm (es. 35 o 40)
  beamWidthB: number; // cm (es. 30)
  beamDepthH: number; // cm (es. 50)
  beamCoverCm: number; // cm (es. 3.5)
}

export function generateCustomStructuralModel(params: NewStructureParams): StructuralProjectModel {
  const cat = USE_CATEGORIES[params.useCategory] || USE_CATEGORIES.CAT_A_RES;

  const columns: ColumnElement[] = [];
  const beams: BeamElement[] = [];
  const footings: FootingElement[] = [];

  const gridLetters = ["A", "B", "C", "D", "E", "F", "G"];
  const concreteDensityKnM3 = 25.0;

  // 1. Genera Plinti di Fondazione al piede
  for (let ix = 0; ix <= params.baysX; ix++) {
    for (let iy = 0; iy <= params.baysY; iy++) {
      const colGrid = `${gridLetters[ix] || `X${ix}`}${iy + 1}`;
      const posX = ix * params.spanLengthX;
      const posY = iy * params.spanLengthY;

      // Plinti di dimensioni proporzionate
      const isCorner = (ix === 0 || ix === params.baysX) && (iy === 0 || iy === params.baysY);
      const isInternal = ix > 0 && ix < params.baysX && iy > 0 && iy < params.baysY;
      const footW = isInternal ? 2.2 : isCorner ? 1.6 : 1.9;
      const footH = isInternal ? 0.65 : 0.55;

      footings.push({
        id: `F_${colGrid}`,
        columnId: `P_${colGrid}_P1`,
        gridRef: colGrid,
        center: [posX, posY, -0.3],
        widthX: footW,
        lengthY: footW,
        heightZ: footH,
        rebarDiameter: 16,
        rebarStepCm: isInternal ? 12 : 15,
      });
    }
  }

  // 2. Genera Pilastri piano per piano
  for (let story = 1; story <= params.storyCount; story++) {
    const baseZ = (story - 1) * params.storyHeight;
    const topZ = story * params.storyHeight;

    for (let ix = 0; ix <= params.baysX; ix++) {
      for (let iy = 0; iy <= params.baysY; iy++) {
        const colGrid = `${gridLetters[ix] || `X${ix}`}${iy + 1}`;
        const colId = `P_${colGrid}_P${story}`;
        const posX = ix * params.spanLengthX;
        const posY = iy * params.spanLengthY;

        const isInternal = ix > 0 && ix < params.baysX && iy > 0 && iy < params.baysY;
        const colB = isInternal ? params.columnWidthB + 5 : params.columnWidthB;
        const colH = isInternal ? params.columnDepthH + 5 : params.columnDepthH;

        // Sovraccarico stimato scaricato dai piani sovrastanti
        const floorsAbove = params.storyCount - story;
        const axialLoadExtraKn = floorsAbove * (isInternal ? 180 : 100);

        columns.push({
          id: colId,
          label: `Pilastro ${colId} (Filo ${colGrid} · P${story})`,
          level: story,
          gridRef: colGrid,
          base_node: [posX, posY, baseZ],
          top_node: [posX, posY, topZ],
          section: {
            type: "rectangular",
            b: colB,
            h: colH,
            coverCm: 3.5,
          },
          material_concrete: params.concreteClass,
          material_steel: params.steelClass,
          axialLoadExtraKn,
          longitudinalBars: {
            diameter: isInternal ? 18 : 16,
            cornerBars: 4,
            sideBarsX: isInternal ? 2 : 1,
            sideBarsY: isInternal ? 2 : 1,
          },
          stirrups: {
            diameter: 8,
            endZoneLengthM: 0.7,
            endStepCm: 8,
            midStepCm: 15,
          },
        });
      }
    }
  }

  // 3. Genera Travi Longitudinarli (X) e Trasversali (Y) per ciascun piano
  let beamCounter = 101;
  for (let story = 1; story <= params.storyCount; story++) {
    const floorZ = story * params.storyHeight;
    const floorPrefix = story === 1 ? "P1" : `P${story}`;

    // A. Travi Longitudinali lungo l'asse X
    for (let iy = 0; iy <= params.baysY; iy++) {
      const posY = iy * params.spanLengthY;
      const isEdgeY = iy === 0 || iy === params.baysY;
      const tribWidthM = isEdgeY ? params.spanLengthY / 2 : params.spanLengthY;

      for (let ix = 0; ix < params.baysX; ix++) {
        const startX = ix * params.spanLengthX;
        const endX = (ix + 1) * params.spanLengthX;
        const startGrid = `${gridLetters[ix]}${iy + 1}`;
        const endGrid = `${gridLetters[ix + 1]}${iy + 1}`;
        const beamId = `T_${beamCounter++}`;

        // Peso proprio e carichi d'influenza
        const g1 = Number(((params.beamWidthB / 100) * (params.beamDepthH / 100) * concreteDensityKnM3).toFixed(2));
        const g2 = Number((cat.defaultG2SurfaceKnM2 * tribWidthM).toFixed(2));
        const q = Number((cat.defaultQSurfaceKnM2 * tribWidthM).toFixed(2));

        const span = params.spanLengthX;
        const stirrupEndLen = Math.min(1.2, Math.max(0.8, span * 0.22));
        const stirrupMidLen = Number((span - 2 * stirrupEndLen).toFixed(2));

        beams.push({
          id: beamId,
          label: `Trave Longitudinale ${beamId} (${startGrid}-${endGrid} · ${floorPrefix})`,
          level: story,
          frameLine: `Telaio Longitudinale Y=${posY.toFixed(1)}m`,
          start_node_id: `N_${startGrid}_P${story}`,
          end_node_id: `N_${endGrid}_P${story}`,
          start_node: [startX, posY, floorZ],
          end_node: [endX, posY, floorZ],
          section: {
            type: "rectangular",
            b: params.beamWidthB,
            h: params.beamDepthH,
            coverCm: params.beamCoverCm,
          },
          material_concrete: params.concreteClass,
          material_steel: params.steelClass,
          loads: [
            {
              type: "distributed",
              g1,
              g2,
              q,
              useCategory: params.useCategory,
              tributaryWidthM: tribWidthM,
              unit: "kN/m",
            },
          ],
          reinforcement_3d: {
            longitudinal_top: [
              {
                id: `TOP_${beamId}`,
                layer: "top",
                diameter: span > 5.5 ? 18 : 16,
                quantity: span > 5.5 ? 4 : 3,
                length: Number((span + 0.45).toFixed(2)),
                z_offset: -0.042, // Quota sfalsata per evitare clash con travi trasversali!
                anchorageHookDeg: 90,
                hookLengthM: 0.26,
                zoneLabel: "Correnti Superiori Nodi",
              },
            ],
            longitudinal_bottom: [
              {
                id: `BOT_${beamId}`,
                layer: "bottom",
                diameter: span > 5.5 ? 16 : 14,
                quantity: span > 5.5 ? 4 : 4,
                length: Number(span.toFixed(2)),
                z_offset: 0.04,
                anchorageHookDeg: 90,
                hookLengthM: 0.2,
                zoneLabel: "Correnti Inferiori Campata",
              },
            ],
            stirrups: {
              diameter: 8,
              legs: 2,
              material: params.steelClass,
              hookDeg: 135,
              zones: [
                { zoneType: "dissipative_left", length: stirrupEndLen, step_cm: 10 },
                { zoneType: "mid_span", length: stirrupMidLen, step_cm: 20 },
                { zoneType: "dissipative_right", length: stirrupEndLen, step_cm: 10 },
              ],
            },
          },
        });
      }
    }

    // B. Travi Trasversali lungo l'asse Y
    for (let ix = 0; ix <= params.baysX; ix++) {
      const posX = ix * params.spanLengthX;
      const isEdgeX = ix === 0 || ix === params.baysX;
      const tribWidthM = isEdgeX ? params.spanLengthX / 4 : params.spanLengthX / 2;

      for (let iy = 0; iy < params.baysY; iy++) {
        const startY = iy * params.spanLengthY;
        const endY = (iy + 1) * params.spanLengthY;
        const startGrid = `${gridLetters[ix]}${iy + 1}`;
        const endGrid = `${gridLetters[ix]}${iy + 2}`;
        const beamId = `T_${beamCounter++}`;

        const transH = Math.max(35, params.beamDepthH - 5);
        const g1 = Number(((params.beamWidthB / 100) * (transH / 100) * concreteDensityKnM3).toFixed(2));
        const g2 = Number((cat.defaultG2SurfaceKnM2 * tribWidthM).toFixed(2));
        const q = Number((cat.defaultQSurfaceKnM2 * tribWidthM).toFixed(2));

        const span = params.spanLengthY;
        const stirrupEndLen = Math.min(1.0, Math.max(0.6, span * 0.22));
        const stirrupMidLen = Number((span - 2 * stirrupEndLen).toFixed(2));

        beams.push({
          id: beamId,
          label: `Trave Trasversale ${beamId} (${startGrid}-${endGrid} · ${floorPrefix})`,
          level: story,
          frameLine: `Telaio Trasversale X=${posX.toFixed(1)}m`,
          start_node_id: `N_${startGrid}_P${story}`,
          end_node_id: `N_${endGrid}_P${story}`,
          start_node: [posX, startY, floorZ],
          end_node: [posX, endY, floorZ],
          section: {
            type: "rectangular",
            b: params.beamWidthB,
            h: transH,
            coverCm: params.beamCoverCm,
          },
          material_concrete: params.concreteClass,
          material_steel: params.steelClass,
          loads: [
            {
              type: "distributed",
              g1,
              g2,
              q,
              useCategory: params.useCategory,
              tributaryWidthM: tribWidthM,
              unit: "kN/m",
            },
          ],
          reinforcement_3d: {
            longitudinal_top: [
              {
                id: `TOP_${beamId}`,
                layer: "top",
                diameter: 14,
                quantity: 3,
                length: Number((span + 0.35).toFixed(2)),
                z_offset: -0.022, // Livello sfalsato per attraversare il nodo senza collisioni!
                anchorageHookDeg: 90,
                hookLengthM: 0.22,
                zoneLabel: "Correnti Superiori Trasversali",
              },
            ],
            longitudinal_bottom: [
              {
                id: `BOT_${beamId}`,
                layer: "bottom",
                diameter: 14,
                quantity: 3,
                length: Number(span.toFixed(2)),
                z_offset: 0.022,
                anchorageHookDeg: 90,
                hookLengthM: 0.18,
                zoneLabel: "Correnti Inferiori Trasversali",
              },
            ],
            stirrups: {
              diameter: 8,
              legs: 2,
              material: params.steelClass,
              hookDeg: 135,
              zones: [
                { zoneType: "dissipative_left", length: stirrupEndLen, step_cm: 10 },
                { zoneType: "mid_span", length: stirrupMidLen, step_cm: 20 },
                { zoneType: "dissipative_right", length: stirrupEndLen, step_cm: 10 },
              ],
            },
          },
        });
      }
    }
  }

  const projId = `ca_model_${Date.now().toString(36)}`;
  return {
    project_id: projId,
    project_name: params.projectName || "Nuovo Telaio C.A.",
    location_seismic_zone: params.seismicZone || "Zona Sismica 2 (ag = 0.22g · Sottosuolo B)",
    normative_code: params.normativeCode,
    ductility_class: params.ductilityClass,
    materials: {
      concrete: params.concreteClass,
      steel: params.steelClass,
    },
    elements: {
      beams,
      columns,
      footings,
    },
  };
}
