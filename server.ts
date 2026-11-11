import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Endpoint: AI Structural Co-Pilot Audit & Green Optimization Advice (NTC 2018 / EC2)
app.post("/api/copilot/analyze", async (req, res) => {
  try {
    const { projectSummary, selectedElement, userPrompt } = req.body;
    const ai = getGenAIClient();

    const systemInstruction = `Sei l'AI Structural Co-Pilot di "Gecola Struktura", un Ingegnere Strutturale Senior esperto in strutture in Cemento Armato (C.A.) secondo le Norme Tecniche per le Costruzioni (NTC 2018 - D.M. 17/01/2018), Circolare 7/2019 e Eurocodice 2 (EN 1992-1-1) / Eurocodice 8.
Analizza i dati del telaio strutturale 3D, le sollecitazioni FEM (SLU e SLE), lo schema dei ferri (correnti superiori/inferiori, staffe in zona dissipativa CD"B"/CD"A", lunghezze di ancoraggio, interferenze nei nodi) e l'impronta di carbonio (CO2e).
Restituisci una risposta JSON rigorosa e altamente tecnica con:
1. "headline": sintesi esecutiva dell'analisi strutturale.
2. "normativeChecks": lista di verifiche normative NTC 2018 / EC2 con paragrafo di riferimento (es. §4.1.2.3.5, §7.4.4.1, §4.1.6.1.1), stato ("PASS" | "WARNING" | "CRITICAL") e nota tecnica.
3. "rebarRecommendations": suggerimenti operativi sullo schema dei ferri 3D (es. diametro e numero correnti, passo staffe nei tratti critici L_cr, risoluzione clash nodo trave-pilastro).
4. "greenOptimization": proposta quantificata per ridurre la CO2 incorporata (Embodied Carbon) e il peso dell'acciaio B450C bilanciando l'altezza utile d della sezione di calcestruzzo.
5. "suggestedPatch": parametri numerici suggeriti per l'elemento attivo (b_cm, h_cm, topDiameter, topQty, bottomDiameter, bottomQty, stirrupEndStepCm, stirrupMidStepCm, concreteId).`;

    const promptText = `DATI MODELLO STRUTTURALE ATTUALE:
${JSON.stringify(projectSummary, null, 2)}

ELEMENTO SELEZIONATO PER DETTAGLIO:
${JSON.stringify(selectedElement, null, 2)}

RICHIESTA SPECIFICA DELL'INGEGNERE:
${userPrompt || "Esegui una verifica completa NTC 2018 / EC2 sull'elemento selezionato e sull'intero telaio, controllando gerarchia delle resistenze, percentuali di armatura, taglio con traliccio ad inclinazione variabile e proponi un'ottimizzazione Green CO2 / Acciaio."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            normativeChecks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING },
                  title: { type: Type.STRING },
                  status: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ["clause", "title", "status", "detail"],
              },
            },
            rebarRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            greenOptimization: {
              type: Type.OBJECT,
              properties: {
                strategy: { type: Type.STRING },
                estimatedSteelSavingPct: { type: Type.NUMBER },
                estimatedCo2SavingKg: { type: Type.NUMBER },
                technicalRationale: { type: Type.STRING },
              },
              required: [
                "strategy",
                "estimatedSteelSavingPct",
                "estimatedCo2SavingKg",
                "technicalRationale",
              ],
            },
            suggestedPatch: {
              type: Type.OBJECT,
              properties: {
                b_cm: { type: Type.INTEGER },
                h_cm: { type: Type.INTEGER },
                topDiameter: { type: Type.INTEGER },
                topQty: { type: Type.INTEGER },
                bottomDiameter: { type: Type.INTEGER },
                bottomQty: { type: Type.INTEGER },
                stirrupEndStepCm: { type: Type.INTEGER },
                stirrupMidStepCm: { type: Type.INTEGER },
                concreteId: { type: Type.STRING },
              },
              required: [
                "b_cm",
                "h_cm",
                "topDiameter",
                "topQty",
                "bottomDiameter",
                "bottomQty",
                "stirrupEndStepCm",
                "stirrupMidStepCm",
                "concreteId",
              ],
            },
          },
          required: [
            "headline",
            "normativeChecks",
            "rebarRecommendations",
            "greenOptimization",
            "suggestedPatch",
          ],
        },
      },
    });

    const rawText = (response.text ?? "{}").trim();
    const parsed = JSON.parse(rawText);
    res.json({ ok: true, analysis: parsed });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("AI Structural Co-Pilot Error:", errMsg);
    res.status(500).json({
      ok: false,
      error: errMsg,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gecola Struktura Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
