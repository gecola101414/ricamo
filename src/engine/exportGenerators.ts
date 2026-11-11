import { CuttingScheduleItem, StructuralProjectModel } from "../types/structural";
import { computeBeamSpanM } from "./structuralEngine";

/**
 * Genera un file AutoCAD DXF reale (ASCII R12/2000 compatibile con tutti i CAD)
 * contenente la carpenteria e lo schema esecutivo dei ferri delle travi.
 */
export function generateProjectDxfContent(project: StructuralProjectModel): string {
  const lines: string[] = [
    "0",
    "SECTION",
    "2",
    "HEADER",
    "9",
    "$INSUNITS",
    "70",
    "6", // Metri
    "0",
    "ENDSEC",
    "0",
    "SECTION",
    "2",
    "ENTITIES",
  ];

  const addLine = (x1: number, y1: number, x2: number, y2: number, layer: string, color: number) => {
    lines.push(
      "0",
      "LINE",
      "8",
      layer,
      "62",
      String(color),
      "10",
      x1.toFixed(3),
      "20",
      y1.toFixed(3),
      "30",
      "0.0",
      "11",
      x2.toFixed(3),
      "21",
      y2.toFixed(3),
      "31",
      "0.0"
    );
  };

  const addText = (x: number, y: number, height: number, text: string, layer: string, color: number) => {
    lines.push(
      "0",
      "TEXT",
      "8",
      layer,
      "62",
      String(color),
      "10",
      x.toFixed(3),
      "20",
      y.toFixed(3),
      "30",
      "0.0",
      "40",
      height.toFixed(3),
      "1",
      text
    );
  };

  let offsetY = 0;
  for (const beam of project.elements.beams) {
    const L = computeBeamSpanM(beam);
    const h = beam.section.h / 100;
    const c = beam.section.coverCm / 100;

    // Contorno Cassero Calcestruzzo (Layer CARPENTERIA, Colore 7 Bianco)
    addLine(0, offsetY, L, offsetY, "CARPENTERIA_CLS", 7);
    addLine(L, offsetY, L, offsetY + h, "CARPENTERIA_CLS", 7);
    addLine(L, offsetY + h, 0, offsetY + h, "CARPENTERIA_CLS", 7);
    addLine(0, offsetY + h, 0, offsetY, "CARPENTERIA_CLS", 7);

    // Correnti Superiori (Layer FERRI_SUP, Colore 1 Rosso)
    const top = beam.reinforcement_3d.longitudinal_top[0];
    if (top) {
      const yTop = offsetY + h - c;
      addLine(c, yTop, L - c, yTop, "FERRI_LONGITUDINALI", 1);
      addLine(c, yTop, c, yTop - (top.hookLengthM || 0.22), "FERRI_LONGITUDINALI", 1);
      addLine(L - c, yTop, L - c, yTop - (top.hookLengthM || 0.22), "FERRI_LONGITUDINALI", 1);
      addText(
        0.2,
        offsetY + h + 0.12,
        0.11,
        `${beam.id} (${beam.section.b}x${beam.section.h} cm) - SUP: ${top.quantity} d${top.diameter} L=${top.length}m`,
        "QUOTE_TESTI",
        2
      );
    }

    // Correnti Inferiori (Layer FERRI_INF, Colore 5 Blu)
    const bot = beam.reinforcement_3d.longitudinal_bottom[0];
    if (bot) {
      const yBot = offsetY + c;
      addLine(c, yBot, L - c, yBot, "FERRI_LONGITUDINALI", 5);
      addLine(c, yBot, c, yBot + (bot.hookLengthM || 0.18), "FERRI_LONGITUDINALI", 5);
      addLine(L - c, yBot, L - c, yBot + (bot.hookLengthM || 0.18), "FERRI_LONGITUDINALI", 5);
      addText(
        0.2,
        offsetY - 0.18,
        0.1,
        `INF: ${bot.quantity} d${bot.diameter} | STAFFE d${beam.reinforcement_3d.stirrups.diameter} passo ${beam.reinforcement_3d.stirrups.zones[0].step_cm}/${beam.reinforcement_3d.stirrups.zones[1].step_cm}/${beam.reinforcement_3d.stirrups.zones[2].step_cm} cm`,
        "QUOTE_TESTI",
        3
      );
    }

    // Staffe (Layer STAFFE, Colore 3 Verde)
    let xPos = 0.05;
    for (const z of beam.reinforcement_3d.stirrups.zones) {
      const stepM = z.step_cm / 100;
      const endX = Math.min(L - 0.05, xPos + z.length);
      while (xPos <= endX) {
        addLine(xPos, offsetY + c, xPos, offsetY + h - c, "STAFFE", 3);
        xPos += stepM;
      }
    }

    offsetY -= 1.6;
  }

  lines.push("0", "ENDSEC", "0", "EOF");
  return lines.join("\n");
}

/**
 * Genera un file BIM IFC 4.0 (ISO 10303-21 STEP) valido con le entità
 * IfcProject, IfcSite, IfcBuilding, IfcBeam, IfcColumn, IfcFooting e IfcReinforcingBar.
 */
export function generateProjectIfcContent(project: StructuralProjectModel): string {
  const nowIso = new Date().toISOString().split(".")[0];
  const lines: string[] = [
    "ISO-10303-21;",
    "HEADER;",
    `FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');`,
    `FILE_NAME('${project.project_id}.ifc','${nowIso}',('Gecola Struktura Engine'),('Studio Ingegneria Strutturale'),'Gecola Struktura BIM 4.0','Gecola Struktura IFC Exporter','');`,
    "FILE_SCHEMA(('IFC4'));",
    "ENDSEC;",
    "DATA;",
    "#1=IFCPROJECT('28_b1k9xP4hR8xGecola01',$,'" + project.project_name + "','Modello Strutturale C.A. NTC 2018',$,$,$,$,#2);",
    "#2=IFCUNITASSIGNMENT((#3,#4,#5));",
    "#3=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);",
    "#4=IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.);",
    "#5=IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.);",
    "#10=IFCSITE('39_s1k9xP4hR8xGecola02',$,'Sito Strutturale','" + project.location_seismic_zone + "',$,$,$,$,.ELEMENT.,$,$,$,$,$);",
    "#20=IFCBUILDING('40_b1k9xP4hR8xGecola03',$,'" + project.project_name + "',$,$,$,$,$,.ELEMENT.,$,$,$);",
  ];

  let entityId = 100;
  for (const beam of project.elements.beams) {
    const bId = entityId++;
    const rebarTopId = entityId++;
    const rebarBotId = entityId++;
    const top = beam.reinforcement_3d.longitudinal_top[0];
    const bot = beam.reinforcement_3d.longitudinal_bottom[0];
    lines.push(
      `#${bId}=IFCBEAM('BM_${beam.id}',$,'${beam.id}','${beam.label} (${beam.section.b}x${beam.section.h} cm - ${beam.material_concrete})','RectangularBeam',$,$,'${beam.id}',.BEAM.);`
    );
    if (top) {
      lines.push(
        `#${rebarTopId}=IFCREINFORCINGBAR('RB_TOP_${beam.id}',$,'${beam.id}_TOP','Correnti Superiori',$,$,$,'${beam.material_steel}',${top.diameter}.,${top.quantity * ((Math.PI * top.diameter * top.diameter) / 4)}.,${top.length}.,.MAIN.,.PLAIN.);`
      );
    }
    if (bot) {
      lines.push(
        `#${rebarBotId}=IFCREINFORCINGBAR('RB_BOT_${beam.id}',$,'${beam.id}_BOT','Correnti Inferiori',$,$,$,'${beam.material_steel}',${bot.diameter}.,${bot.quantity * ((Math.PI * bot.diameter * bot.diameter) / 4)}.,${bot.length}.,.MAIN.,.PLAIN.);`
      );
    }
  }

  for (const col of project.elements.columns) {
    const cId = entityId++;
    lines.push(
      `#${cId}=IFCCOLUMN('CL_${col.id}',$,'${col.id}','${col.label} (${col.section.b}x${col.section.h} cm - ${col.material_concrete})','RectangularColumn',$,$,'${col.id}',.COLUMN.);`
    );
  }

  for (const foot of project.elements.footings) {
    const fId = entityId++;
    lines.push(
      `#${fId}=IFCFOOTING('FT_${foot.id}',$,'${foot.id}','Plinto ${foot.gridRef} (${foot.widthX}x${foot.lengthY}x${foot.heightZ}m)',$,$,$,'${foot.id}',.PAD_FOOTING.);`
    );
  }

  lines.push("ENDSEC;", "END-ISO-10303-21;");
  return lines.join("\n");
}

/**
 * Genera il file BVBS (.abs) completo per centro di presagomatura ferri.
 */
export function generateProjectBvbsContent(schedule: CuttingScheduleItem[]): string {
  return schedule.map((item) => item.bvbsString).join("\n");
}

export function triggerFileDownload(filename: string, content: string, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
