export type ConcreteClassId = "C25_30" | "C28_35" | "C32_40" | "C35_45" | "C40_50";
export type SteelClassId = "B450C" | "B450A";
export type DuctilityClass = "CD_B" | "CD_A";
export type UseCategoryId = "CAT_A_RES" | "CAT_B_UFF" | "CAT_C_AFF" | "CAT_D_COMM" | "CAT_H_COP";

export interface ConcreteMaterial {
  id: ConcreteClassId;
  label: string;
  fck: number; // MPa
  fcm: number; // MPa
  fcd: number; // MPa (alpha_cc * fck / gamma_c = 0.85 * fck / 1.5)
  fctm: number; // MPa
  Ecm: number; // MPa
  weightDensity: number; // kN/m3 (25.0)
  embodiedCo2PerM3: number; // kg CO2e / m3
  costPerM3: number; // EUR / m3
}

export interface SteelMaterial {
  id: SteelClassId;
  label: string;
  fyk: number; // MPa
  fyd: number; // MPa (fyk / 1.15)
  Es: number; // MPa (200000)
  densityKgM3: number; // 7850 kg/m3
  embodiedCo2PerKg: number; // kg CO2e / kg
  costPerKg: number; // EUR / kg
}

export interface RectangularSection {
  type: "rectangular";
  b: number; // cm (es. 30)
  h: number; // cm (es. 50)
  coverCm: number; // copriferro nominale cm (es. 3.5)
}

export interface DistributedLoad {
  type: "distributed";
  g1: number; // Peso proprio strutturale kN/m (calcolato o custom)
  g2: number; // Permanente non strutturale kN/m
  q: number; // Variabile d'esercizio kN/m
  useCategory: UseCategoryId;
  tributaryWidthM: number; // Larghezza d'influenza solaio m
  unit: "kN/m";
}

export interface LongitudinalBarGroup {
  id: string;
  layer: "top" | "bottom" | "side_web";
  diameter: number; // mm (12, 14, 16, 18, 20, 24)
  quantity: number;
  length: number; // m
  z_offset: number; // m offset dal filo o baricentro per evitare clash nei nodi
  anchorageHookDeg: 0 | 90 | 135;
  hookLengthM: number; // m (es. 0.25)
  zoneLabel: string; // es. "Continui + Monconi Appoggio"
}

export interface StirrupZone {
  zoneType: "dissipative_left" | "mid_span" | "dissipative_right";
  length: number; // m
  step_cm: number; // cm (es. 8, 10, 15, 20)
}

export interface StirrupConfig {
  diameter: number; // mm (8, 10, 12)
  legs: 2 | 4; // numero bracci
  material: SteelClassId;
  hookDeg: 135;
  zones: [StirrupZone, StirrupZone, StirrupZone];
}

export interface Reinforcement3D {
  longitudinal_top: LongitudinalBarGroup[];
  longitudinal_bottom: LongitudinalBarGroup[];
  web_bars?: LongitudinalBarGroup[];
  stirrups: StirrupConfig;
}

export interface BeamElement {
  id: string;
  label: string;
  level: number; // 1 = Piano 1, 2 = Piano 2
  frameLine: string; // es. "Telaio X-1", "Telaio X-2", "Trasversale Y"
  start_node_id: string;
  end_node_id: string;
  start_node: [number, number, number]; // [x, y, z] in metri (z = quota verticale)
  end_node: [number, number, number];
  section: RectangularSection;
  material_concrete: ConcreteClassId;
  material_steel: SteelClassId;
  loads: DistributedLoad[];
  reinforcement_3d: Reinforcement3D;
}

export interface ColumnElement {
  id: string;
  label: string;
  level: number;
  gridRef: string; // es. "A1", "B1", "C1"
  base_node: [number, number, number];
  top_node: [number, number, number];
  section: RectangularSection;
  material_concrete: ConcreteClassId;
  material_steel: SteelClassId;
  axialLoadExtraKn: number; // Carico assiale extra dai piani superiori
  longitudinalBars: {
    diameter: number; // mm (es. 16 o 20)
    cornerBars: number; // 4
    sideBarsX: number; // ferri intermedi lungo b
    sideBarsY: number; // ferri intermedi lungo h
  };
  stirrups: {
    diameter: number; // mm (8 o 10)
    endZoneLengthM: number; // zona critica L_cr
    endStepCm: number; // passo zona critica (es. 8 o 10 cm)
    midStepCm: number; // passo zona centrale (es. 15 o 20 cm)
  };
}

export interface FootingElement {
  id: string;
  columnId: string;
  gridRef: string;
  center: [number, number, number];
  widthX: number; // m (es. 1.8)
  lengthY: number; // m (es. 1.8)
  heightZ: number; // m (es. 0.55)
  rebarDiameter: number; // mm (es. 16)
  rebarStepCm: number; // cm (es. 15)
}

export interface StructuralProjectModel {
  project_id: string;
  project_name: string;
  location_seismic_zone: string;
  normative_code: "NTC_2018" | "EUROCODE_2";
  ductility_class: DuctilityClass;
  materials: {
    concrete: ConcreteClassId;
    steel: SteelClassId;
  };
  elements: {
    beams: BeamElement[];
    columns: ColumnElement[];
    footings: FootingElement[];
  };
}

export interface LoadCombinationsResult {
  g1_kNm: number;
  g2_kNm: number;
  q_kNm: number;
  q_slu_fundamental: number; // 1.3*G1 + 1.5*G2 + 1.5*Q
  q_slu_seismic: number; // G1 + G2 + psi2*Q
  q_sle_rare: number; // G1 + G2 + Q
  q_sle_frequent: number; // G1 + G2 + psi1*Q
  q_sle_quasi_perm: number; // G1 + G2 + psi2*Q
  psi0: number;
  psi1: number;
  psi2: number;
}

export interface BeamFemVerification {
  elementId: string;
  spanL: number; // m
  combinations: LoadCombinationsResult;
  // Sollecitazioni SLU
  M_Ed_left: number; // kNm (negativo in appoggio)
  M_Ed_mid: number; // kNm (positivo in campata)
  M_Ed_right: number; // kNm (negativo in appoggio)
  V_Ed_max: number; // kN
  // Resistenze SLU
  As_top_provided_cm2: number;
  As_top_required_cm2: number;
  As_bot_provided_cm2: number;
  As_bot_required_cm2: number;
  As_min_cm2: number;
  As_max_cm2: number;
  rho_top_pct: number;
  rho_bot_pct: number;
  M_Rd_neg: number; // kNm resistente appoggi
  M_Rd_pos: number; // kNm resistente campata
  V_Rd_s: number; // kN taglio traliccio acciaio
  V_Rd_max: number; // kN taglio schiacciamento bielle cls
  V_Rd: number; // min(V_Rd_s, V_Rd_max)
  // Rapporti di sfruttamento (Demand / Capacity Ratio)
  dcr_moment_support: number; // |M_Ed_left| / M_Rd_neg
  dcr_moment_mid: number; // M_Ed_mid / M_Rd_pos
  dcr_shear: number; // V_Ed_max / V_Rd
  // Verifiche SLE e Deformabilità
  deflection_sle_mm: number;
  deflection_limit_mm: number; // L / 250
  crack_width_wk_mm: number;
  stress_concrete_sle_MPa: number;
  stress_steel_sle_MPa: number;
  // Ancoraggio & Nodi (Clash Detection)
  anchorage_length_Lbd_cm: number;
  clear_bar_spacing_mm: number;
  clashDetected: boolean;
  clashMessage: string;
  // Computo metrico elemento
  concreteVolumeM3: number;
  steelWeightKg: number;
  steelIncidenceKgM3: number;
  embodiedCo2Kg: number;
  estimatedCostEur: number;
  status: "VERIFICATO" | "ATTENZIONE" | "NON_VERIFICATO";
  warnings: string[];
  diagramPoints: Array<{
    x: number; // 0..L
    M_slu: number; // kNm
    V_slu: number; // kN
    deflection_mm: number;
  }>;
}

export interface ColumnFemVerification {
  elementId: string;
  heightH: number; // m
  N_Ed: number; // kN sforzo normale di progetto SLU
  M_Ed: number; // kNm momento flettente al piede/testa SLU
  V_Ed: number; // kN taglio sismico/telaio
  N_Rd_max: number; // kN
  M_Rd: number; // kNm momento resistente con N_Ed (dominio M-N)
  V_Rd: number; // kN
  As_tot_cm2: number;
  rho_pct: number; // deve essere tra 1.0% e 4.0% secondo NTC 2018 §7.4.6.2.2
  slenderness_lambda: number;
  dcr_PM: number; // Pressoflessione
  dcr_shear: number;
  concreteVolumeM3: number;
  steelWeightKg: number;
  embodiedCo2Kg: number;
  status: "VERIFICATO" | "ATTENZIONE" | "NON_VERIFICATO";
  warnings: string[];
}

export interface CuttingScheduleItem {
  posId: string;
  elementId: string;
  elementLabel: string;
  barRole: string;
  shapeCode: "00" | "11" | "21" | "51"; // ISO 3766: 00 dritto, 11 piega 90, 21 U/doppio gancio, 51 staffa chiusa
  diameterMm: number;
  quantity: number;
  unitLengthM: number;
  totalLengthM: number;
  unitWeightKgM: number;
  totalWeightKg: number;
  dimensionsLabel: string;
  bvbsString: string;
}

export type ViewportDisplayMode = "solid" | "wireframe_fem" | "xray_rebar";
export type DiagramOverlayType = "none" | "moment_M" | "shear_V" | "loads_Q" | "deformed";
