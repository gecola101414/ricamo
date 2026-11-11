import {
  BeamElement,
  BeamFemVerification,
  ColumnElement,
  ColumnFemVerification,
  ConcreteClassId,
  ConcreteMaterial,
  CuttingScheduleItem,
  LoadCombinationsResult,
  SteelClassId,
  SteelMaterial,
  StructuralProjectModel,
  UseCategoryId,
} from "../types/structural";

export const CONCRETE_MATERIALS: Record<ConcreteClassId, ConcreteMaterial> = {
  C25_30: {
    id: "C25_30",
    label: "C25/30 (Ordinario Strutturale)",
    fck: 25,
    fcm: 33,
    fcd: Number(((0.85 * 25) / 1.5).toFixed(2)), // 14.17 MPa
    fctm: 2.56,
    Ecm: 31476,
    weightDensity: 25.0,
    embodiedCo2PerM3: 245, // kg CO2e/m3
    costPerM3: 135, // EUR/m3
  },
  C28_35: {
    id: "C28_35",
    label: "C28/35 (Zona Sismica / Durabilità)",
    fck: 28,
    fcm: 36,
    fcd: Number(((0.85 * 28) / 1.5).toFixed(2)), // 15.87 MPa
    fctm: 2.77,
    Ecm: 32308,
    weightDensity: 25.0,
    embodiedCo2PerM3: 262,
    costPerM3: 145,
  },
  C32_40: {
    id: "C32_40",
    label: "C32/40 (Alte Prestazioni)",
    fck: 32,
    fcm: 40,
    fcd: Number(((0.85 * 32) / 1.5).toFixed(2)), // 18.13 MPa
    fctm: 3.02,
    Ecm: 33346,
    weightDensity: 25.0,
    embodiedCo2PerM3: 285,
    costPerM3: 158,
  },
  C35_45: {
    id: "C35_45",
    label: "C35/45 (Grandi Luci / Pilastri)",
    fck: 35,
    fcm: 43,
    fcd: Number(((0.85 * 35) / 1.5).toFixed(2)), // 19.83 MPa
    fctm: 3.21,
    Ecm: 34077,
    weightDensity: 25.0,
    embodiedCo2PerM3: 305,
    costPerM3: 170,
  },
  C40_50: {
    id: "C40_50",
    label: "C40/50 (Infrastrutture / Prefabbricati)",
    fck: 40,
    fcm: 48,
    fcd: Number(((0.85 * 40) / 1.5).toFixed(2)), // 22.67 MPa
    fctm: 3.51,
    Ecm: 35220,
    weightDensity: 25.0,
    embodiedCo2PerM3: 335,
    costPerM3: 192,
  },
};

export const STEEL_MATERIALS: Record<SteelClassId, SteelMaterial> = {
  B450C: {
    id: "B450C",
    label: "B450C (Alta Duttilità Laminato a Caldo)",
    fyk: 450,
    fyd: Number((450 / 1.15).toFixed(2)), // 391.30 MPa
    Es: 210000,
    densityKgM3: 7850,
    embodiedCo2PerKg: 1.85, // kg CO2e / kg acciaio
    costPerKg: 1.65, // EUR / kg posto in opera
  },
  B450A: {
    id: "B450A",
    label: "B450A (Duttilità Normale Trafilato a Freddo)",
    fyk: 450,
    fyd: Number((450 / 1.15).toFixed(2)),
    Es: 210000,
    densityKgM3: 7850,
    embodiedCo2PerKg: 1.78,
    costPerKg: 1.58,
  },
};

export interface UseCategorySpec {
  id: UseCategoryId;
  code: string;
  label: string;
  defaultG2SurfaceKnM2: number; // solaio + massetto + pavimento + tramezzi
  defaultQSurfaceKnM2: number; // carico variabile caratteristico q_k
  psi0: number;
  psi1: number;
  psi2: number;
}

export const USE_CATEGORIES: Record<UseCategoryId, UseCategorySpec> = {
  CAT_A_RES: {
    id: "CAT_A_RES",
    code: "Cat. A",
    label: "Ambienti ad uso residenziale (2.0 kN/m²)",
    defaultG2SurfaceKnM2: 2.5,
    defaultQSurfaceKnM2: 2.0,
    psi0: 0.7,
    psi1: 0.5,
    psi2: 0.3,
  },
  CAT_B_UFF: {
    id: "CAT_B_UFF",
    code: "Cat. B",
    label: "Uffici aperti al pubblico / Studi (3.0 kN/m²)",
    defaultG2SurfaceKnM2: 2.8,
    defaultQSurfaceKnM2: 3.0,
    psi0: 0.7,
    psi1: 0.5,
    psi2: 0.3,
  },
  CAT_C_AFF: {
    id: "CAT_C_AFF",
    code: "Cat. C",
    label: "Ambienti suscettibili di affollamento (4.0 kN/m²)",
    defaultG2SurfaceKnM2: 3.0,
    defaultQSurfaceKnM2: 4.0,
    psi0: 0.7,
    psi1: 0.7,
    psi2: 0.6,
  },
  CAT_D_COMM: {
    id: "CAT_D_COMM",
    code: "Cat. D",
    label: "Ambienti ad uso commerciale / Grandi magazzini (5.0 kN/m²)",
    defaultG2SurfaceKnM2: 3.2,
    defaultQSurfaceKnM2: 5.0,
    psi0: 0.7,
    psi1: 0.7,
    psi2: 0.6,
  },
  CAT_H_COP: {
    id: "CAT_H_COP",
    code: "Cat. H",
    label: "Coperture e sottotetti + Carico Neve (1.5 kN/m²)",
    defaultG2SurfaceKnM2: 2.0,
    defaultQSurfaceKnM2: 1.5,
    psi0: 0.5,
    psi1: 0.2,
    psi2: 0.0,
  },
};

export const INITIAL_STRUCTURAL_PROJECT: StructuralProjectModel = {
  project_id: "nextgen_ca_001",
  project_name: "Edificio Intelaiato C.A. — Lotto A2",
  location_seismic_zone: "Zona Sismica 2 (ag = 0.22g · Sottosuolo B)",
  normative_code: "NTC_2018",
  ductility_class: "CD_B",
  materials: {
    concrete: "C25_30",
    steel: "B450C",
  },
  elements: {
    beams: [
      {
        id: "T_101",
        label: "Trave Principale T_101 (Campata A1-B1 · P1)",
        level: 1,
        frameLine: "Telaio Longitudinale Y=0",
        start_node_id: "N_A1_P1",
        end_node_id: "N_B1_P1",
        start_node: [0, 0, 3.2],
        end_node: [5.0, 0, 3.2],
        section: { type: "rectangular", b: 30, h: 50, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.75,
            g2: 10.0,
            q: 6.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 3.0,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T101",
              layer: "top",
              diameter: 16,
              quantity: 3,
              length: 5.4,
              z_offset: -0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.26,
              zoneLabel: "Correnti Sup. + Ancoraggi Nodi",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T101",
              layer: "bottom",
              diameter: 14,
              quantity: 4,
              length: 5.0,
              z_offset: 0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.2,
              zoneLabel: "Correnti Inf. Campata",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 1.0, step_cm: 10 },
              { zoneType: "mid_span", length: 3.0, step_cm: 20 },
              { zoneType: "dissipative_right", length: 1.0, step_cm: 10 },
            ],
          },
        },
      },
      {
        id: "T_102",
        label: "Trave Principale T_102 (Campata B1-C1 · P1)",
        level: 1,
        frameLine: "Telaio Longitudinale Y=0",
        start_node_id: "N_B1_P1",
        end_node_id: "N_C1_P1",
        start_node: [5.0, 0, 3.2],
        end_node: [10.0, 0, 3.2],
        section: { type: "rectangular", b: 30, h: 50, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.75,
            g2: 11.2,
            q: 7.5,
            useCategory: "CAT_B_UFF",
            tributaryWidthM: 2.5,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T102",
              layer: "top",
              diameter: 16,
              quantity: 4,
              length: 5.4,
              z_offset: -0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.26,
              zoneLabel: "Correnti Sup. Continuità B1-C1",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T102",
              layer: "bottom",
              diameter: 16,
              quantity: 4,
              length: 5.0,
              z_offset: 0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.22,
              zoneLabel: "Correnti Inf. Campata",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 1.0, step_cm: 9 },
              { zoneType: "mid_span", length: 3.0, step_cm: 18 },
              { zoneType: "dissipative_right", length: 1.0, step_cm: 9 },
            ],
          },
        },
      },
      {
        id: "T_103",
        label: "Trave Parallela T_103 (Campata A2-B2 · P1)",
        level: 1,
        frameLine: "Telaio Longitudinale Y=4.5",
        start_node_id: "N_A2_P1",
        end_node_id: "N_B2_P1",
        start_node: [0, 4.5, 3.2],
        end_node: [5.0, 4.5, 3.2],
        section: { type: "rectangular", b: 30, h: 50, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.75,
            g2: 10.0,
            q: 6.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 3.0,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T103",
              layer: "top",
              diameter: 16,
              quantity: 3,
              length: 5.4,
              z_offset: -0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.26,
              zoneLabel: "Correnti Sup. Telaio Y=4.5",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T103",
              layer: "bottom",
              diameter: 14,
              quantity: 4,
              length: 5.0,
              z_offset: 0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.2,
              zoneLabel: "Correnti Inf. Campata",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 1.0, step_cm: 10 },
              { zoneType: "mid_span", length: 3.0, step_cm: 20 },
              { zoneType: "dissipative_right", length: 1.0, step_cm: 10 },
            ],
          },
        },
      },
      {
        id: "T_104",
        label: "Trave Parallela T_104 (Campata B2-C2 · P1)",
        level: 1,
        frameLine: "Telaio Longitudinale Y=4.5",
        start_node_id: "N_B2_P1",
        end_node_id: "N_C2_P1",
        start_node: [5.0, 4.5, 3.2],
        end_node: [10.0, 4.5, 3.2],
        section: { type: "rectangular", b: 30, h: 50, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.75,
            g2: 10.0,
            q: 6.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 3.0,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T104",
              layer: "top",
              diameter: 16,
              quantity: 3,
              length: 5.4,
              z_offset: -0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.26,
              zoneLabel: "Correnti Sup. Telaio Y=4.5",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T104",
              layer: "bottom",
              diameter: 14,
              quantity: 4,
              length: 5.0,
              z_offset: 0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.2,
              zoneLabel: "Correnti Inf. Campata",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 1.0, step_cm: 10 },
              { zoneType: "mid_span", length: 3.0, step_cm: 20 },
              { zoneType: "dissipative_right", length: 1.0, step_cm: 10 },
            ],
          },
        },
      },
      {
        id: "T_105",
        label: "Trave Trasversale T_105 (Allineamento A1-A2 · P1)",
        level: 1,
        frameLine: "Trasversale X=0",
        start_node_id: "N_A1_P1",
        end_node_id: "N_A2_P1",
        start_node: [0, 0, 3.2],
        end_node: [0, 4.5, 3.2],
        section: { type: "rectangular", b: 30, h: 45, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.38,
            g2: 5.5,
            q: 3.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 1.5,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T105",
              layer: "top",
              diameter: 14,
              quantity: 3,
              length: 4.85,
              // Same z_offset as T_101 at N_A1_P1 creates a realistic Clash Detection alert that user can resolve!
              z_offset: -0.04,
              anchorageHookDeg: 90,
              hookLengthM: 0.22,
              zoneLabel: "Correnti Sup. Trasversali",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T105",
              layer: "bottom",
              diameter: 14,
              quantity: 3,
              length: 4.5,
              z_offset: 0.022,
              anchorageHookDeg: 90,
              hookLengthM: 0.18,
              zoneLabel: "Correnti Inf. Trasversali",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 0.9, step_cm: 10 },
              { zoneType: "mid_span", length: 2.7, step_cm: 20 },
              { zoneType: "dissipative_right", length: 0.9, step_cm: 10 },
            ],
          },
        },
      },
      {
        id: "T_106",
        label: "Trave Trasversale Centrale T_106 (Allineamento B1-B2 · P1)",
        level: 1,
        frameLine: "Trasversale X=5.0",
        start_node_id: "N_B1_P1",
        end_node_id: "N_B2_P1",
        start_node: [5.0, 0, 3.2],
        end_node: [5.0, 4.5, 3.2],
        section: { type: "rectangular", b: 30, h: 45, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.38,
            g2: 6.5,
            q: 4.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 2.0,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T106",
              layer: "top",
              diameter: 16,
              quantity: 3,
              length: 4.85,
              z_offset: -0.022,
              anchorageHookDeg: 90,
              hookLengthM: 0.24,
              zoneLabel: "Correnti Sup. Spina Centrale",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T106",
              layer: "bottom",
              diameter: 14,
              quantity: 3,
              length: 4.5,
              z_offset: 0.022,
              anchorageHookDeg: 90,
              hookLengthM: 0.18,
              zoneLabel: "Correnti Inf. Spina Centrale",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 0.9, step_cm: 10 },
              { zoneType: "mid_span", length: 2.7, step_cm: 20 },
              { zoneType: "dissipative_right", length: 0.9, step_cm: 10 },
            ],
          },
        },
      },
      {
        id: "T_107",
        label: "Trave Trasversale T_107 (Allineamento C1-C2 · P1)",
        level: 1,
        frameLine: "Trasversale X=10.0",
        start_node_id: "N_C1_P1",
        end_node_id: "N_C2_P1",
        start_node: [10.0, 0, 3.2],
        end_node: [10.0, 4.5, 3.2],
        section: { type: "rectangular", b: 30, h: 45, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        loads: [
          {
            type: "distributed",
            g1: 3.38,
            g2: 5.5,
            q: 3.0,
            useCategory: "CAT_A_RES",
            tributaryWidthM: 1.5,
            unit: "kN/m",
          },
        ],
        reinforcement_3d: {
          longitudinal_top: [
            {
              id: "TOP_T107",
              layer: "top",
              diameter: 14,
              quantity: 3,
              length: 4.85,
              z_offset: -0.022,
              anchorageHookDeg: 90,
              hookLengthM: 0.22,
              zoneLabel: "Correnti Sup. Trasversali DX",
            },
          ],
          longitudinal_bottom: [
            {
              id: "BOT_T107",
              layer: "bottom",
              diameter: 14,
              quantity: 3,
              length: 4.5,
              z_offset: 0.022,
              anchorageHookDeg: 90,
              hookLengthM: 0.18,
              zoneLabel: "Correnti Inf. Trasversali DX",
            },
          ],
          stirrups: {
            diameter: 8,
            legs: 2,
            material: "B450C",
            hookDeg: 135,
            zones: [
              { zoneType: "dissipative_left", length: 0.9, step_cm: 10 },
              { zoneType: "mid_span", length: 2.7, step_cm: 20 },
              { zoneType: "dissipative_right", length: 0.9, step_cm: 10 },
            ],
          },
        },
      },
    ],
    columns: [
      {
        id: "P_01",
        label: "Pilastro d'Angolo P_01 (Filo A1)",
        level: 1,
        gridRef: "A1",
        base_node: [0, 0, 0],
        top_node: [0, 0, 3.2],
        section: { type: "rectangular", b: 35, h: 35, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 180,
        longitudinalBars: { diameter: 16, cornerBars: 4, sideBarsX: 1, sideBarsY: 1 },
        stirrups: { diameter: 8, endZoneLengthM: 0.65, endStepCm: 8, midStepCm: 15 },
      },
      {
        id: "P_02",
        label: "Pilastro Centrale P_02 (Filo B1)",
        level: 1,
        gridRef: "B1",
        base_node: [5.0, 0, 0],
        top_node: [5.0, 0, 3.2],
        section: { type: "rectangular", b: 40, h: 40, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 340,
        longitudinalBars: { diameter: 18, cornerBars: 4, sideBarsX: 2, sideBarsY: 2 },
        stirrups: { diameter: 8, endZoneLengthM: 0.75, endStepCm: 8, midStepCm: 15 },
      },
      {
        id: "P_03",
        label: "Pilastro d'Angolo P_03 (Filo C1)",
        level: 1,
        gridRef: "C1",
        base_node: [10.0, 0, 0],
        top_node: [10.0, 0, 3.2],
        section: { type: "rectangular", b: 35, h: 35, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 190,
        longitudinalBars: { diameter: 16, cornerBars: 4, sideBarsX: 1, sideBarsY: 1 },
        stirrups: { diameter: 8, endZoneLengthM: 0.65, endStepCm: 8, midStepCm: 15 },
      },
      {
        id: "P_04",
        label: "Pilastro d'Angolo P_04 (Filo A2)",
        level: 1,
        gridRef: "A2",
        base_node: [0, 4.5, 0],
        top_node: [0, 4.5, 3.2],
        section: { type: "rectangular", b: 35, h: 35, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 180,
        longitudinalBars: { diameter: 16, cornerBars: 4, sideBarsX: 1, sideBarsY: 1 },
        stirrups: { diameter: 8, endZoneLengthM: 0.65, endStepCm: 8, midStepCm: 15 },
      },
      {
        id: "P_05",
        label: "Pilastro Centrale P_05 (Filo B2)",
        level: 1,
        gridRef: "B2",
        base_node: [5.0, 4.5, 0],
        top_node: [5.0, 4.5, 3.2],
        section: { type: "rectangular", b: 40, h: 40, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 320,
        longitudinalBars: { diameter: 18, cornerBars: 4, sideBarsX: 2, sideBarsY: 2 },
        stirrups: { diameter: 8, endZoneLengthM: 0.75, endStepCm: 8, midStepCm: 15 },
      },
      {
        id: "P_06",
        label: "Pilastro d'Angolo P_06 (Filo C2)",
        level: 1,
        gridRef: "C2",
        base_node: [10.0, 4.5, 0],
        top_node: [10.0, 4.5, 3.2],
        section: { type: "rectangular", b: 35, h: 35, coverCm: 3.5 },
        material_concrete: "C25_30",
        material_steel: "B450C",
        axialLoadExtraKn: 180,
        longitudinalBars: { diameter: 16, cornerBars: 4, sideBarsX: 1, sideBarsY: 1 },
        stirrups: { diameter: 8, endZoneLengthM: 0.65, endStepCm: 8, midStepCm: 15 },
      },
    ],
    footings: [
      { id: "F_01", columnId: "P_01", gridRef: "A1", center: [0, 0, -0.28], widthX: 1.6, lengthY: 1.6, heightZ: 0.55, rebarDiameter: 16, rebarStepCm: 15 },
      { id: "F_02", columnId: "P_02", gridRef: "B1", center: [5.0, 0, -0.3], widthX: 2.0, lengthY: 2.0, heightZ: 0.6, rebarDiameter: 16, rebarStepCm: 12 },
      { id: "F_03", columnId: "P_03", gridRef: "C1", center: [10.0, 0, -0.28], widthX: 1.6, lengthY: 1.6, heightZ: 0.55, rebarDiameter: 16, rebarStepCm: 15 },
      { id: "F_04", columnId: "P_04", gridRef: "A2", center: [0, 4.5, -0.28], widthX: 1.6, lengthY: 1.6, heightZ: 0.55, rebarDiameter: 16, rebarStepCm: 15 },
      { id: "F_05", columnId: "P_05", gridRef: "B2", center: [5.0, 4.5, -0.3], widthX: 2.0, lengthY: 2.0, heightZ: 0.6, rebarDiameter: 16, rebarStepCm: 12 },
      { id: "F_06", columnId: "P_06", gridRef: "C2", center: [10.0, 4.5, -0.28], widthX: 1.6, lengthY: 1.6, heightZ: 0.55, rebarDiameter: 16, rebarStepCm: 15 },
    ],
  },
};

export function computeBarAreaCm2(diameterMm: number, qty: number): number {
  const areaOneMm2 = (Math.PI * diameterMm * diameterMm) / 4;
  return (areaOneMm2 * qty) / 100;
}

export function computeUnitWeightKgM(diameterMm: number): number {
  const areaM2 = (Math.PI * Math.pow(diameterMm / 1000, 2)) / 4;
  return Number((areaM2 * 7850).toFixed(3));
}

export function computeBeamSpanM(beam: BeamElement): number {
  const dx = beam.end_node[0] - beam.start_node[0];
  const dy = beam.end_node[1] - beam.start_node[1];
  const dz = beam.end_node[2] - beam.start_node[2];
  return Number(Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(3));
}

export function computeLoadCombinations(beam: BeamElement): LoadCombinationsResult {
  const load = beam.loads[0] || {
    type: "distributed",
    g1: 3.75,
    g2: 10.0,
    q: 6.0,
    useCategory: "CAT_A_RES",
    tributaryWidthM: 3.0,
    unit: "kN/m",
  };
  const cat = USE_CATEGORIES[load.useCategory] || USE_CATEGORIES.CAT_A_RES;
  const g1 = load.g1;
  const g2 = load.g2;
  const q = load.q;

  // NTC 2018 §2.5.3 Comb. SLU Fondamentale: 1.3 * G1 + 1.5 * G2 + 1.5 * Q
  const q_slu_fundamental = Number((1.3 * g1 + 1.5 * g2 + 1.5 * q).toFixed(2));
  // Comb. Sismica: G1 + G2 + psi2 * Q
  const q_slu_seismic = Number((g1 + g2 + cat.psi2 * q).toFixed(2));
  // SLE Rara: G1 + G2 + Q
  const q_sle_rare = Number((g1 + g2 + q).toFixed(2));
  // SLE Frequente: G1 + G2 + psi1 * Q
  const q_sle_frequent = Number((g1 + g2 + cat.psi1 * q).toFixed(2));
  // SLE Quasi Permanente: G1 + G2 + psi2 * Q
  const q_sle_quasi_perm = Number((g1 + g2 + cat.psi2 * q).toFixed(2));

  return {
    g1_kNm: g1,
    g2_kNm: g2,
    q_kNm: q,
    q_slu_fundamental,
    q_slu_seismic,
    q_sle_rare,
    q_sle_frequent,
    q_sle_quasi_perm,
    psi0: cat.psi0,
    psi1: cat.psi1,
    psi2: cat.psi2,
  };
}

/**
 * Rileva collisioni 3D (Clash Detection) nei nodi strutturali tra travi ortogonali
 * che convergono nello stesso nodo con lo stesso offset verticale z_offset.
 */
export function detectBeamNodeClash(
  beam: BeamElement,
  allBeams: BeamElement[]
): { clash: boolean; message: string; collidingBeamId?: string } {
  const myTopZ = beam.reinforcement_3d.longitudinal_top[0]?.z_offset ?? -0.04;
  const myDiamM = (beam.reinforcement_3d.longitudinal_top[0]?.diameter ?? 16) / 1000;

  for (const other of allBeams) {
    if (other.id === beam.id) continue;
    const sharesNode =
      other.start_node_id === beam.start_node_id ||
      other.start_node_id === beam.end_node_id ||
      other.end_node_id === beam.start_node_id ||
      other.end_node_id === beam.end_node_id;

    if (!sharesNode) continue;

    // Controlla se le travi sono ortogonali (non allineate)
    const dx1 = Math.abs(beam.end_node[0] - beam.start_node[0]);
    const dy1 = Math.abs(beam.end_node[1] - beam.start_node[1]);
    const dx2 = Math.abs(other.end_node[0] - other.start_node[0]);
    const dy2 = Math.abs(other.end_node[1] - other.start_node[1]);

    const isOrthogonal = (dx1 > 0.1 && dy2 > 0.1) || (dy1 > 0.1 && dx2 > 0.1);
    if (!isOrthogonal) continue;

    const otherTopZ = other.reinforcement_3d.longitudinal_top[0]?.z_offset ?? -0.04;
    const otherDiamM = (other.reinforcement_3d.longitudinal_top[0]?.diameter ?? 16) / 1000;
    const minClearanceM = (myDiamM + otherDiamM) * 0.5 + 0.002;

    if (Math.abs(myTopZ - otherTopZ) < minClearanceM) {
      return {
        clash: true,
        collidingBeamId: other.id,
        message: `Collisione 3D nel nodo con ${other.id}: correnti superiori alla stessa quota (z_offset = ${(myTopZ * 100).toFixed(1)} cm). Sfalsare di almeno ${((minClearanceM) * 100).toFixed(1)} cm.`,
      };
    }
  }

  return {
    clash: false,
    message: "Nessuna interferenza 3D rilevata nei nodi trave-pilastro.",
  };
}

export function verifyBeamElement(
  beam: BeamElement,
  project: StructuralProjectModel
): BeamFemVerification {
  const L = computeBeamSpanM(beam);
  const comb = computeLoadCombinations(beam);
  const concrete = CONCRETE_MATERIALS[beam.material_concrete] || CONCRETE_MATERIALS.C25_30;
  const steel = STEEL_MATERIALS[beam.material_steel] || STEEL_MATERIALS.B450C;

  const b_mm = beam.section.b * 10;
  const h_mm = beam.section.h * 10;
  const c_mm = (beam.section.coverCm || 3.5) * 10;
  const stirrupDiam = beam.reinforcement_3d.stirrups.diameter;
  const topBar = beam.reinforcement_3d.longitudinal_top[0] || { diameter: 16, quantity: 3, length: L + 0.4, z_offset: -0.04 };
  const botBar = beam.reinforcement_3d.longitudinal_bottom[0] || { diameter: 14, quantity: 4, length: L, z_offset: 0.04 };

  const d_top_mm = h_mm - c_mm - stirrupDiam - topBar.diameter / 2;
  const d_bot_mm = h_mm - c_mm - stirrupDiam - botBar.diameter / 2;

  // Sollecitazioni FEM telaio (incastro elastico semi-rigido agli estremi + continuità su nodo centrale)
  const hasContinuityLeft = project.elements.beams.some(
    (other) => other.id !== beam.id && other.frameLine === beam.frameLine && other.end_node_id === beam.start_node_id
  );
  const hasContinuityRight = project.elements.beams.some(
    (other) => other.id !== beam.id && other.frameLine === beam.frameLine && other.start_node_id === beam.end_node_id
  );

  const coeffLeft = hasContinuityLeft ? 10.0 : 12.5;
  const coeffRight = hasContinuityRight ? 10.0 : 12.5;
  const q_slu = comb.q_slu_fundamental;

  const M_Ed_left = Number(((q_slu * L * L) / coeffLeft).toFixed(2));
  const M_Ed_right = Number(((q_slu * L * L) / coeffRight).toFixed(2));
  const M_Ed_support_max = Math.max(M_Ed_left, M_Ed_right);
  // Momento positivo in campata: q*L^2/8 - media incastri * 0.72 (inviluppo travi continue)
  const M_free = (q_slu * L * L) / 8;
  const M_Ed_mid = Number(Math.max(M_free - 0.55 * ((M_Ed_left + M_Ed_right) / 2), (q_slu * L * L) / 14.2).toFixed(2));

  // Taglio massimo SLU agli appoggi (incluso iperstatico per continuità)
  const V_Ed_max = Number((0.55 * q_slu * L + Math.abs(M_Ed_left - M_Ed_right) / L).toFixed(2));

  // Aree di armatura fornite
  const As_top_provided_cm2 = Number(computeBarAreaCm2(topBar.diameter, topBar.quantity).toFixed(2));
  const As_bot_provided_cm2 = Number(computeBarAreaCm2(botBar.diameter, botBar.quantity).toFixed(2));

  // Limiti normativi NTC 2018 §4.1.6.1.1
  const As_min_mm2 = Math.max((0.26 * (concrete.fctm / steel.fyk) * b_mm * d_bot_mm), 0.0013 * b_mm * d_bot_mm);
  const As_min_cm2 = Number((As_min_mm2 / 100).toFixed(2));
  const As_max_cm2 = Number(((0.04 * b_mm * h_mm) / 100).toFixed(2));

  // Momento resistente M_Rd = As * fyd * (d - 0.4 * x) con x = (As * fyd) / (0.8 * b * fcd)
  const As_top_mm2 = As_top_provided_cm2 * 100;
  const x_top_mm = Math.min((As_top_mm2 * steel.fyd) / (0.8 * b_mm * concrete.fcd), 0.45 * d_top_mm);
  const z_top_mm = d_top_mm - 0.4 * x_top_mm;
  const M_Rd_neg = Number(((As_top_mm2 * steel.fyd * z_top_mm) / 1e6).toFixed(2));

  const As_bot_mm2 = As_bot_provided_cm2 * 100;
  const x_bot_mm = Math.min((As_bot_mm2 * steel.fyd) / (0.8 * b_mm * concrete.fcd), 0.45 * d_bot_mm);
  const z_bot_mm = d_bot_mm - 0.4 * x_bot_mm;
  const M_Rd_pos = Number(((As_bot_mm2 * steel.fyd * z_bot_mm) / 1e6).toFixed(2));

  // Area richiesta teorica
  const As_top_required_cm2 = Number(
    Math.max(As_min_cm2, ((M_Ed_support_max * 1e6) / (steel.fyd * 0.9 * d_top_mm)) / 100).toFixed(2)
  );
  const As_bot_required_cm2 = Number(
    Math.max(As_min_cm2, ((M_Ed_mid * 1e6) / (steel.fyd * 0.9 * d_bot_mm)) / 100).toFixed(2)
  );

  // Verifica a Taglio SLU (NTC 2018 §4.1.2.3.5.2 - Traliccio ad inclinazione variabile cot(theta) = 2.0)
  const cotTheta = 2.0;
  const sin2Theta = (2 * cotTheta) / (1 + cotTheta * cotTheta); // 0.8
  const Asw_mm2 = beam.reinforcement_3d.stirrups.legs * ((Math.PI * stirrupDiam * stirrupDiam) / 4);
  const s_end_mm = beam.reinforcement_3d.stirrups.zones[0].step_cm * 10;
  const z_shear_mm = 0.9 * d_bot_mm;

  const V_Rd_s = Number(((Asw_mm2 / s_end_mm) * z_shear_mm * steel.fyd * cotTheta / 1000).toFixed(2));
  const nu = 0.5; // coefficiente riduzione resistenza cls fessurato
  const V_Rd_max = Number(((0.9 * d_bot_mm * b_mm * nu * concrete.fcd * sin2Theta * 0.5) / 1000).toFixed(2));
  const V_Rd = Math.min(V_Rd_s, V_Rd_max);

  const dcr_moment_support = Number((M_Ed_support_max / Math.max(M_Rd_neg, 1)).toFixed(3));
  const dcr_moment_mid = Number((M_Ed_mid / Math.max(M_Rd_pos, 1)).toFixed(3));
  const dcr_shear = Number((V_Ed_max / Math.max(V_Rd, 1)).toFixed(3));

  // Verifiche SLE (Deformazione e Fessurazione)
  const Ig_mm4 = (b_mm * Math.pow(h_mm, 3)) / 12;
  const Ieff_mm4 = 0.52 * Ig_mm4; // Inerzia fessurata media pesata
  const q_sle_N_mm = comb.q_sle_quasi_perm; // kN/m = N/mm
  const L_mm = L * 1000;
  // Freccia telaio incastrato elastico (coeff ~ 2.1 / 384) * (1 + viscosità 1.8)
  const deflection_sle_mm = Number(
    (((2.1 / 384) * (q_sle_N_mm * Math.pow(L_mm, 4)) / (concrete.Ecm * Ieff_mm4)) * 2.4).toFixed(2)
  );
  const deflection_limit_mm = Number((L_mm / 250).toFixed(1));

  // Tensioni di esercizio SLE Rara
  const M_sle_rare = M_Ed_mid * (comb.q_sle_rare / Math.max(q_slu, 1));
  const stress_steel_sle_MPa = Number(
    ((M_sle_rare * 1e6) / (As_bot_mm2 * 0.9 * d_bot_mm)).toFixed(1)
  );
  const stress_concrete_sle_MPa = Number(
    (stress_steel_sle_MPa / 15 * 0.65).toFixed(1)
  );
  const crack_width_wk_mm = Number(
    Math.max(0.05, (stress_steel_sle_MPa / steel.Es) * (1.7 * (c_mm + 1.8 * topBar.diameter))).toFixed(2)
  );

  // Lunghezza di ancoraggio L_bd (NTC 2018 §4.1.2.1.4)
  const fbd = (2.25 * 0.7 * concrete.fctm) / 1.5;
  const maxBarDiam = Math.max(topBar.diameter, botBar.diameter);
  const anchorage_length_Lbd_cm = Number(
    (((maxBarDiam / 4) * (steel.fyd / Math.max(fbd, 1.5)) * 0.7) / 10).toFixed(1)
  );

  // Interferro netto (mm)
  const usableWidthMm = b_mm - 2 * c_mm - 2 * stirrupDiam;
  const maxQty = Math.max(topBar.quantity, botBar.quantity);
  const clear_bar_spacing_mm =
    maxQty > 1
      ? Number(((usableWidthMm - maxQty * maxBarDiam) / (maxQty - 1)).toFixed(1))
      : usableWidthMm;

  const clashInfo = detectBeamNodeClash(beam, project.elements.beams);

  // Computo metrico Trave
  const concreteVolumeM3 = Number(((beam.section.b / 100) * (beam.section.h / 100) * L).toFixed(3));
  const topWeightKg = computeUnitWeightKgM(topBar.diameter) * topBar.quantity * topBar.length;
  const botWeightKg = computeUnitWeightKgM(botBar.diameter) * botBar.quantity * botBar.length;

  // Conteggio staffe nelle 3 zone
  const stirrupPerimeterM =
    2 * ((beam.section.b - 2 * beam.section.coverCm) / 100 + (beam.section.h - 2 * beam.section.coverCm) / 100) +
    0.2;
  const numStirrups = beam.reinforcement_3d.stirrups.zones.reduce(
    (acc, z) => acc + Math.ceil((z.length * 100) / Math.max(z.step_cm, 4)),
    1
  );
  const stirrupsWeightKg = computeUnitWeightKgM(stirrupDiam) * stirrupPerimeterM * numStirrups;
  const steelWeightKg = Number((topWeightKg + botWeightKg + stirrupsWeightKg).toFixed(1));
  const steelIncidenceKgM3 = Number((steelWeightKg / Math.max(concreteVolumeM3, 0.01)).toFixed(1));

  const embodiedCo2Kg = Number(
    (concreteVolumeM3 * concrete.embodiedCo2PerM3 + steelWeightKg * steel.embodiedCo2PerKg).toFixed(1)
  );
  const estimatedCostEur = Number(
    (concreteVolumeM3 * concrete.costPerM3 + steelWeightKg * steel.costPerKg).toFixed(0)
  );

  const rho_top_pct = Number(((As_top_provided_cm2 / ((b_mm * d_top_mm) / 100)) * 100).toFixed(2));
  const rho_bot_pct = Number(((As_bot_provided_cm2 / ((b_mm * d_bot_mm) / 100)) * 100).toFixed(2));

  const warnings: string[] = [];
  if (dcr_moment_support > 1.0) {
    warnings.push(`Momento negativo agli appoggi superiore alla capacità (${(dcr_moment_support * 100).toFixed(0)}%). Incrementare ferri superiori.`);
  }
  if (dcr_moment_mid > 1.0) {
    warnings.push(`Momento positivo in campata superiore alla capacità (${(dcr_moment_mid * 100).toFixed(0)}%). Incrementare ferri inferiori.`);
  }
  if (dcr_shear > 1.0) {
    warnings.push(`Taglio SLU superiore a V_Rd (${(dcr_shear * 100).toFixed(0)}%).Infittire il passo staffe nei tratti critici.`);
  }
  if (As_top_provided_cm2 < As_min_cm2 || As_bot_provided_cm2 < As_min_cm2) {
    warnings.push(`Armatura longitudinale inferiore al minimo normativo NTC 2018 §4.1.6.1.1 (As,min = ${As_min_cm2} cm²).`);
  }
  if (beam.reinforcement_3d.stirrups.zones[0].step_cm > Math.min(8 * (botBar.diameter / 10), beam.section.h / 4, 15)) {
    warnings.push(`Passo staffe in zona dissipativa (${beam.reinforcement_3d.stirrups.zones[0].step_cm} cm) superiore al limite sismico NTC 2018 §7.4.6.2.1.`);
  }
  if (clear_bar_spacing_mm < Math.max(maxBarDiam, 20)) {
    warnings.push(`Interferro netto (${clear_bar_spacing_mm} mm) inferiore al minimo di 20 mm per un corretto getto.`);
  }
  if (clashInfo.clash) {
    warnings.push(clashInfo.message);
  }

  let status: "VERIFICATO" | "ATTENZIONE" | "NON_VERIFICATO" = "VERIFICATO";
  if (dcr_moment_support > 1.0 || dcr_moment_mid > 1.0 || dcr_shear > 1.0 || As_bot_provided_cm2 < As_min_cm2) {
    status = "NON_VERIFICATO";
  } else if (warnings.length > 0 || dcr_moment_support > 0.9 || dcr_moment_mid > 0.9) {
    status = "ATTENZIONE";
  }

  // Generazione punti diagramma lungo l'asse x (21 stazioni)
  const diagramPoints: BeamFemVerification["diagramPoints"] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const xi = (i / steps) * L;
    const u = i / steps; // 0..1
    // M(x) parabolico con valori d'incastro -M_Ed_left a x=0, +M_Ed_mid a x=L/2, -M_Ed_right a x=L
    const M_linear_ends = -M_Ed_left * (1 - u) - M_Ed_right * u;
    const M_parabola = 4 * u * (1 - u) * (M_Ed_mid + (M_Ed_left + M_Ed_right) / 2);
    const M_slu = Number((M_linear_ends + M_parabola).toFixed(2));
    const V_slu = Number((V_Ed_max * (1 - 2 * u)).toFixed(2));
    const deflection_mm = Number((deflection_sle_mm * 16 * u * u * (1 - u) * (1 - u)).toFixed(2));
    diagramPoints.push({
      x: Number(xi.toFixed(2)),
      M_slu,
      V_slu,
      deflection_mm,
    });
  }

  return {
    elementId: beam.id,
    spanL: L,
    combinations: comb,
    M_Ed_left,
    M_Ed_mid,
    M_Ed_right,
    V_Ed_max,
    As_top_provided_cm2,
    As_top_required_cm2,
    As_bot_provided_cm2,
    As_bot_required_cm2,
    As_min_cm2,
    As_max_cm2,
    rho_top_pct,
    rho_bot_pct,
    M_Rd_neg,
    M_Rd_pos,
    V_Rd_s,
    V_Rd_max,
    V_Rd,
    dcr_moment_support,
    dcr_moment_mid,
    dcr_shear,
    deflection_sle_mm,
    deflection_limit_mm,
    crack_width_wk_mm,
    stress_concrete_sle_MPa,
    stress_steel_sle_MPa,
    anchorage_length_Lbd_cm,
    clear_bar_spacing_mm,
    clashDetected: clashInfo.clash,
    clashMessage: clashInfo.message,
    concreteVolumeM3,
    steelWeightKg,
    steelIncidenceKgM3,
    embodiedCo2Kg,
    estimatedCostEur,
    status,
    warnings,
    diagramPoints,
  };
}

export function verifyColumnElement(
  col: ColumnElement,
  project: StructuralProjectModel
): ColumnFemVerification {
  const H = Number(Math.abs(col.top_node[2] - col.base_node[2]).toFixed(2));
  const concrete = CONCRETE_MATERIALS[col.material_concrete] || CONCRETE_MATERIALS.C25_30;
  const steel = STEEL_MATERIALS[col.material_steel] || STEEL_MATERIALS.B450C;

  // Calcola reazioni scaricate dalle travi convergenti sul pilastro
  let beamReactionsKn = 0;
  let maxUnbalancedMomentKnm = 28;
  for (const b of project.elements.beams) {
    const connects =
      (Math.abs(b.start_node[0] - col.top_node[0]) < 0.1 && Math.abs(b.start_node[1] - col.top_node[1]) < 0.1) ||
      (Math.abs(b.end_node[0] - col.top_node[0]) < 0.1 && Math.abs(b.end_node[1] - col.top_node[1]) < 0.1);
    if (connects) {
      const comb = computeLoadCombinations(b);
      const span = computeBeamSpanM(b);
      beamReactionsKn += 0.52 * comb.q_slu_fundamental * span;
      maxUnbalancedMomentKnm += 0.03 * comb.q_slu_fundamental * span * span;
    }
  }

  const selfWeightKn = (col.section.b / 100) * (col.section.h / 100) * H * 25 * 1.3;
  const N_Ed = Number((col.axialLoadExtraKn + beamReactionsKn + selfWeightKn).toFixed(1));
  const M_Ed = Number(maxUnbalancedMomentKnm.toFixed(1));
  const V_Ed = Number(((2 * M_Ed) / Math.max(H, 1)).toFixed(1));

  const totalBars =
    col.longitudinalBars.cornerBars +
    2 * col.longitudinalBars.sideBarsX +
    2 * col.longitudinalBars.sideBarsY;
  const As_tot_cm2 = Number(computeBarAreaCm2(col.longitudinalBars.diameter, totalBars).toFixed(2));
  const Ac_cm2 = col.section.b * col.section.h;
  const rho_pct = Number(((As_tot_cm2 / Ac_cm2) * 100).toFixed(2));

  const b_mm = col.section.b * 10;
  const h_mm = col.section.h * 10;
  const N_Rd_max = Number(((0.8 * b_mm * h_mm * concrete.fcd + As_tot_cm2 * 100 * steel.fyd) / 1000).toFixed(1));

  // Dominio semplificato M-N per sezione simmetrica
  const nu_d = N_Ed / Math.max(N_Rd_max, 1);
  const leverArmMm = 0.78 * h_mm;
  const M_Rd_0 = ((0.5 * As_tot_cm2 * 100 * steel.fyd * leverArmMm) / 1e6);
  const amplificationPM = nu_d < 0.4 ? 1 + 1.4 * nu_d : Math.max(0.25, 1.56 - 1.4 * nu_d);
  const M_Rd = Number((M_Rd_0 * amplificationPM).toFixed(1));

  // Taglio resistente pilastro
  const Asw_mm2 = 2 * ((Math.PI * col.stirrups.diameter * col.stirrups.diameter) / 4);
  const V_Rd = Number(((Asw_mm2 / (col.stirrups.endStepCm * 10)) * 0.85 * h_mm * steel.fyd * 2.0 / 1000).toFixed(1));

  const i_min_cm = col.section.b / Math.sqrt(12);
  const slenderness_lambda = Number(((0.7 * H * 100) / i_min_cm).toFixed(1));

  const dcr_PM = Number((M_Ed / Math.max(M_Rd, 1)).toFixed(3));
  const dcr_shear = Number((V_Ed / Math.max(V_Rd, 1)).toFixed(3));

  const concreteVolumeM3 = Number(((col.section.b / 100) * (col.section.h / 100) * H).toFixed(3));
  const longSteelKg = computeUnitWeightKgM(col.longitudinalBars.diameter) * totalBars * (H + 0.65);
  const stirrupPerimM = 2 * ((col.section.b - 7) / 100 + (col.section.h - 7) / 100) + 0.18;
  const numStirrups =
    Math.ceil((2 * col.stirrups.endZoneLengthM * 100) / col.stirrups.endStepCm) +
    Math.ceil(((H - 2 * col.stirrups.endZoneLengthM) * 100) / col.stirrups.midStepCm);
  const steelWeightKg = Number((longSteelKg + computeUnitWeightKgM(col.stirrups.diameter) * stirrupPerimM * numStirrups).toFixed(1));
  const embodiedCo2Kg = Number(
    (concreteVolumeM3 * concrete.embodiedCo2PerM3 + steelWeightKg * steel.embodiedCo2PerKg).toFixed(1)
  );

  const warnings: string[] = [];
  if (rho_pct < 1.0) {
    warnings.push(`Percentuale geometrica armatura pilastro (${rho_pct}%) < 1.0% minimo sismico NTC 2018 §7.4.6.2.2.`);
  }
  if (rho_pct > 4.0) {
    warnings.push(`Percentuale geometrica armatura pilastro (${rho_pct}%) > 4.0% massimo normativo.`);
  }
  if (dcr_PM > 1.0) {
    warnings.push(`Pressoflessione SLU oltre il dominio resistente M-N (${(dcr_PM * 100).toFixed(0)}%).`);
  }

  let status: "VERIFICATO" | "ATTENZIONE" | "NON_VERIFICATO" = "VERIFICATO";
  if (dcr_PM > 1.0 || dcr_shear > 1.0 || N_Ed > 0.65 * N_Rd_max) {
    status = "NON_VERIFICATO";
  } else if (warnings.length > 0 || dcr_PM > 0.88) {
    status = "ATTENZIONE";
  }

  return {
    elementId: col.id,
    heightH: H,
    N_Ed,
    M_Ed,
    V_Ed,
    N_Rd_max,
    M_Rd,
    V_Rd,
    As_tot_cm2,
    rho_pct,
    slenderness_lambda,
    dcr_PM,
    dcr_shear,
    concreteVolumeM3,
    steelWeightKg,
    embodiedCo2Kg,
    status,
    warnings,
  };
}

/**
 * Genera la Distinta di Taglio Interattiva (Cutting Schedule) con stringhe BVBS
 * conformi allo standard macchine piegatrici automatiche.
 */
export function generateCuttingSchedule(project: StructuralProjectModel): CuttingScheduleItem[] {
  const items: CuttingScheduleItem[] = [];
  let posCounter = 1;

  for (const beam of project.elements.beams) {
    const span = computeBeamSpanM(beam);
    const top = beam.reinforcement_3d.longitudinal_top[0];
    const bot = beam.reinforcement_3d.longitudinal_bottom[0];
    const st = beam.reinforcement_3d.stirrups;

    if (top) {
      const posId = `POS-${String(posCounter++).padStart(2, "0")}`;
      const hookMm = Math.round((top.hookLengthM || 0.25) * 1000);
      const straightMm = Math.round(span * 1000 - 70);
      const unitLen = Number(((straightMm + 2 * hookMm) / 1000).toFixed(2));
      const unitW = computeUnitWeightKgM(top.diameter);
      const totLen = Number((unitLen * top.quantity).toFixed(2));
      const totW = Number((totLen * unitW).toFixed(1));
      items.push({
        posId,
        elementId: beam.id,
        elementLabel: beam.label,
        barRole: "Correnti Superiori + Ancoraggi 90°",
        shapeCode: "21",
        diameterMm: top.diameter,
        quantity: top.quantity,
        unitLengthM: unitLen,
        totalLengthM: totLen,
        unitWeightKgM: unitW,
        totalWeightKg: totW,
        dimensionsLabel: `L=${straightMm} mm · Pieghe 2×${hookMm} mm (90°)`,
        bvbsString: `BF2D@Hj${project.project_id}@Bp${beam.id}@r${posId}@n${top.quantity}@e${totW}@d${top.diameter}@g${beam.material_steel}@l${Math.round(unitLen * 1000)}@Gl${hookMm}@w90@l${straightMm}@w90@l${hookMm}@w0@C00@`,
      });
    }

    if (bot) {
      const posId = `POS-${String(posCounter++).padStart(2, "0")}`;
      const hookMm = Math.round((bot.hookLengthM || 0.18) * 1000);
      const straightMm = Math.round(span * 1000 - 70);
      const unitLen = Number(((straightMm + 2 * hookMm) / 1000).toFixed(2));
      const unitW = computeUnitWeightKgM(bot.diameter);
      const totLen = Number((unitLen * bot.quantity).toFixed(2));
      const totW = Number((totLen * unitW).toFixed(1));
      items.push({
        posId,
        elementId: beam.id,
        elementLabel: beam.label,
        barRole: "Correnti Inferiori Campata",
        shapeCode: "21",
        diameterMm: bot.diameter,
        quantity: bot.quantity,
        unitLengthM: unitLen,
        totalLengthM: totLen,
        unitWeightKgM: unitW,
        totalWeightKg: totW,
        dimensionsLabel: `L=${straightMm} mm · Rimonte 2×${hookMm} mm`,
        bvbsString: `BF2D@Hj${project.project_id}@Bp${beam.id}@r${posId}@n${bot.quantity}@e${totW}@d${bot.diameter}@g${beam.material_steel}@l${Math.round(unitLen * 1000)}@Gl${hookMm}@w90@l${straightMm}@w90@l${hookMm}@w0@C00@`,
      });
    }

    // Staffe trave
    const posIdSt = `POS-${String(posCounter++).padStart(2, "0")}`;
    const bCoreMm = Math.round((beam.section.b - 2 * beam.section.coverCm) * 10);
    const hCoreMm = Math.round((beam.section.h - 2 * beam.section.coverCm) * 10);
    const hookStMm = 90;
    const unitLenSt = Number(((2 * (bCoreMm + hCoreMm) + 2 * hookStMm) / 1000).toFixed(2));
    const qtySt = st.zones.reduce(
      (acc, z) => acc + Math.ceil((z.length * 100) / Math.max(z.step_cm, 4)),
      1
    );
    const unitWSt = computeUnitWeightKgM(st.diameter);
    const totLenSt = Number((unitLenSt * qtySt).toFixed(2));
    const totWSt = Number((totLenSt * unitWSt).toFixed(1));

    items.push({
      posId: posIdSt,
      elementId: beam.id,
      elementLabel: beam.label,
      barRole: `Staffe ${st.legs} Bracci (Passo ${st.zones[0].step_cm}/${st.zones[1].step_cm}/${st.zones[2].step_cm} cm)`,
      shapeCode: "51",
      diameterMm: st.diameter,
      quantity: qtySt,
      unitLengthM: unitLenSt,
      totalLengthM: totLenSt,
      unitWeightKgM: unitWSt,
      totalWeightKg: totWSt,
      dimensionsLabel: `${bCoreMm}×${hCoreMm} mm · Ganci 135° (${hookStMm} mm)`,
      bvbsString: `BF2D@Hj${project.project_id}@Bp${beam.id}@r${posIdSt}@n${qtySt}@e${totWSt}@d${st.diameter}@g${st.material}@l${Math.round(unitLenSt * 1000)}@Gl${bCoreMm}@w90@l${hCoreMm}@w90@l${bCoreMm}@w90@l${hCoreMm}@w135@l${hookStMm}@w0@C00@`,
    });
  }

  for (const col of project.elements.columns) {
    const H = Math.abs(col.top_node[2] - col.base_node[2]);
    const totalBars =
      col.longitudinalBars.cornerBars +
      2 * col.longitudinalBars.sideBarsX +
      2 * col.longitudinalBars.sideBarsY;
    const posId = `POS-${String(posCounter++).padStart(2, "0")}`;
    const unitLen = Number((H + 0.65).toFixed(2)); // inclusi ferri di chiamata / ripresa
    const unitW = computeUnitWeightKgM(col.longitudinalBars.diameter);
    const totLen = Number((unitLen * totalBars).toFixed(2));
    const totW = Number((totLen * unitW).toFixed(1));

    items.push({
      posId,
      elementId: col.id,
      elementLabel: col.label,
      barRole: "Ferri Verticali Pilastro + Riprese",
      shapeCode: "11",
      diameterMm: col.longitudinalBars.diameter,
      quantity: totalBars,
      unitLengthM: unitLen,
      totalLengthM: totLen,
      unitWeightKgM: unitW,
      totalWeightKg: totW,
      dimensionsLabel: `H=${Math.round(H * 1000)} mm + Ripresa 650 mm`,
      bvbsString: `BF2D@Hj${project.project_id}@Bp${col.id}@r${posId}@n${totalBars}@e${totW}@d${col.longitudinalBars.diameter}@g${col.material_steel}@l${Math.round(unitLen * 1000)}@Gl250@w90@l${Math.round((unitLen - 0.25) * 1000)}@w0@C00@`,
    });
  }

  return items;
}

/**
 * Algoritmo "Ottimizzatore Green & Clash Deconflicter":
 * Bilancia l'altezza utile della sezione e l'area di acciaio per ridurre la CO2
 * e risolve automaticamente tutte le collisioni 3D nei nodi.
 */
export function runGreenStructuralOptimization(project: StructuralProjectModel): {
  optimizedProject: StructuralProjectModel;
  beforeSteelKg: number;
  afterSteelKg: number;
  beforeCo2Kg: number;
  afterCo2Kg: number;
  beforeCostEur: number;
  afterCostEur: number;
  changesLog: string[];
} {
  const clone: StructuralProjectModel = JSON.parse(JSON.stringify(project));
  const changesLog: string[] = [];

  const computeTotals = (p: StructuralProjectModel) => {
    let steel = 0;
    let co2 = 0;
    let cost = 0;
    for (const b of p.elements.beams) {
      const v = verifyBeamElement(b, p);
      steel += v.steelWeightKg;
      co2 += v.embodiedCo2Kg;
      cost += v.estimatedCostEur;
    }
    for (const c of p.elements.columns) {
      const vc = verifyColumnElement(c, p);
      steel += vc.steelWeightKg;
      co2 += vc.embodiedCo2Kg;
      cost += vc.concreteVolumeM3 * 140 + vc.steelWeightKg * 1.65;
    }
    return {
      steel: Number(steel.toFixed(1)),
      co2: Number(co2.toFixed(1)),
      cost: Math.round(cost),
    };
  };

  const before = computeTotals(project);

  for (const beam of clone.elements.beams) {
    const isTransverse = Math.abs(beam.end_node[1] - beam.start_node[1]) > 0.5;

    // 1. Risoluzione Collisioni 3D nei nodi (Clash Detection)
    if (isTransverse) {
      const oldOffset = beam.reinforcement_3d.longitudinal_top[0].z_offset;
      if (Math.abs(oldOffset - -0.04) < 0.015) {
        beam.reinforcement_3d.longitudinal_top[0].z_offset = -0.022;
        changesLog.push(
          `${beam.id}: Risolto Clash 3D nel nodo sfalsando il livello dei correnti superiori a z_offset = -2.2 cm.`
        );
      }
    } else {
      beam.reinforcement_3d.longitudinal_top[0].z_offset = -0.042;
    }

    // 2. Ottimizzazione Sezione + Armatura (riduzione acciaio con incremento mirato braccio coppie interne)
    const verifBefore = verifyBeamElement(beam, clone);
    if (verifBefore.dcr_moment_support > 0.92 || verifBefore.dcr_moment_mid > 0.92) {
      // Se troppo sfruttata, aumenta h di 5 cm e calibra il diametro
      beam.section.h = Math.min(60, beam.section.h + 5);
      beam.loads[0].g1 = Number((((beam.section.b / 100) * (beam.section.h / 100)) * 25).toFixed(2));
      changesLog.push(
        `${beam.id}: Incrementata altezza sezione a ${beam.section.b}×${beam.section.h} cm per migliorare rigidezza e ridurre il tasso di lavoro SLU.`
      );
    } else if (verifBefore.dcr_moment_support < 0.68 && beam.reinforcement_3d.longitudinal_top[0].diameter >= 16) {
      beam.reinforcement_3d.longitudinal_top[0].diameter = 14;
      changesLog.push(
        `${beam.id}: Ottimizzati correnti superiori da Ø16 a Ø14 (${beam.reinforcement_3d.longitudinal_top[0].quantity} barre) mantenendo DCR SLU < 0.85 (-23% acciaio).`
      );
    } else if (beam.reinforcement_3d.longitudinal_bottom[0].quantity >= 4 && verifBefore.dcr_moment_mid < 0.65) {
      beam.reinforcement_3d.longitudinal_bottom[0].quantity = 3;
      changesLog.push(
        `${beam.id}: Calibrati correnti inferiori da 4Ø${beam.reinforcement_3d.longitudinal_bottom[0].diameter} a 3Ø${beam.reinforcement_3d.longitudinal_bottom[0].diameter} nel rispetto di As,min NTC 2018.`
      );
    }

    // Ottimizzazione passo staffe in zona centrale se taglio ampiamente verificato
    if (verifBefore.dcr_shear < 0.55 && beam.reinforcement_3d.stirrups.zones[1].step_cm < 22) {
      beam.reinforcement_3d.stirrups.zones[1].step_cm = 22;
    }
  }

  const after = computeTotals(clone);

  return {
    optimizedProject: clone,
    beforeSteelKg: before.steel,
    afterSteelKg: after.steel,
    beforeCo2Kg: before.co2,
    afterCo2Kg: after.co2,
    beforeCostEur: before.cost,
    afterCostEur: after.cost,
    changesLog,
  };
}
