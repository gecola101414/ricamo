
import { Article, Measurement, Category } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini on the frontend as required by the platform
const getAi = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" });

const cleanAndParseJson = (text: string) => {
  try {
    let cleanText = text.replace(/```json\n?|```/g, '').trim();
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
       cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    } else if (firstBrace !== -1) {
       cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return null;
  }
};

export const generateBulkItems = async (
  userDescription: string,
  region: string,
  year: string,
  availableCategories: Category[]
): Promise<Partial<Article>[]> => {
  try {
    const ai = getAi();
    const categoriesList = availableCategories.map(c => `${c.code}: ${c.name}`).join("\n");
    const bulkPrompt = `Act as an expert Italian Quantity Surveyor.
    PROJECT CONTEXT: ${userDescription}
    REGION/YEAR: ${region} ${year}
    
    TASK: Break down the project into work items mapped strictly to these categories:
    ${categoriesList}

    Return ONLY a JSON object with an array "items".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: bulkPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoryCode: { type: Type.STRING },
                  code: { type: Type.STRING },
                  description: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  laborRate: { type: Type.NUMBER },
                  priceListSource: { type: Type.STRING }
                },
                required: ["categoryCode", "code", "description", "unit", "quantity", "unitPrice"]
              }
            }
          }
        }
      },
    });

    const parsedData = cleanAndParseJson(response.text || "");
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return (parsedData?.items || []).map((item: any) => ({
        ...item,
        description: cleanDescription(item.description),
        groundingUrls: groundingUrls
    }));
  } catch (error) {
    console.error("Gemini Bulk API Error:", error);
    throw error;
  }
};

export const cleanDescription = (text: string): string => {
  if (!text) return "";
  return text.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ');
};

export const parseDroppedContent = (rawText: string): Partial<Article> | null => {
  // ... (rest of the function remains the same)
  try {
    if (!rawText) return null;

    // Cleanup e normalizzazione testo
    const cleanText = rawText.trim();

    // Split per tabulazioni o spazi multipli (struttura tabellare)
    let parts = cleanText.split(/\t|\s{3,}/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Se non abbiamo abbastanza parti, proviamo a processare le righe
    if (parts.length < 3) {
      parts = cleanText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    if (parts.length < 3) return null;

    const parseItaNumber = (str: string) => {
        if (!str) return 0;
        // Rimuove simboli valuta, gestisce punti migliaia e virgole decimali
        const clean = str.replace(/[€$£%\s]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(clean);
    };

    // Mappatura Standard: 0:Codice, 1:Descrizione, 2:UM, 3:Prezzo, 4:MO%
    const code = cleanDescription(parts[0] || 'NP.001');
    const description = cleanDescription(parts[1] || 'Voce importata');
    const unit = cleanDescription(parts[2] || 'cad');
    const unitPrice = parseItaNumber(parts[3] || '0');
    
    let laborRate = 0;
    if (parts.length >= 5) {
       const val = parseItaNumber(parts[4]);
       laborRate = !isNaN(val) ? (val <= 1 && val > 0 ? val * 100 : val) : 0;
    }

    // --- LOGICA ESTRAZIONE PREZZARIO UFFICIALE (Task Richiesto) ---
    let priceListSource = "Prezzario Ufficiale";
    
    // Se è presente una sesta parte, solitamente è il nome del prezzario sorgente
    if (parts.length >= 6) {
       priceListSource = cleanDescription(parts[5]);
    } else {
       // Euristiche di ricerca nel blocco di testo completo per pattern comuni (es. "Prezzario Regione... 2024")
       const sourceMatch = cleanText.match(/(Prezzario|Listino|Tariffario)\s+[A-Za-z\s,]+\s+\d{4}/i);
       if (sourceMatch) {
           priceListSource = cleanDescription(sourceMatch[0]);
       } else if (cleanText.toLowerCase().includes("gecola.it")) {
           priceListSource = "Listino Online GeCoLa";
       }
    }

    return {
      code,
      description,
      unit,
      unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
      laborRate: isNaN(laborRate) ? 0 : laborRate,
      quantity: 1,
      priceListSource
    };
  } catch (error) {
    console.error("Perfect Hook Parser Error:", error);
    return null;
  }
};

export const parseVoiceMeasurement = async (transcript: string): Promise<Partial<Measurement>> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Extract measurement data from: "${transcript}". Return JSON with description, length, width, height, multiplier.`,
            config: { 
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  length: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                  multiplier: { type: Type.NUMBER }
                }
              }
            }
        });
        const parsedData = JSON.parse(response.text || "{}");
        return {
            description: cleanDescription(parsedData.description || transcript),
            length: parsedData.length || undefined,
            width: parsedData.width || undefined,
            height: parsedData.height || undefined,
            multiplier: parsedData.multiplier || undefined
        };
    } catch (e) {
        return { description: transcript };
    }
}

export const analyzeProject = async (
  projectData: string,
  question: string
): Promise<{ text: string; functionCalls?: any[] }> => {
  try {
    const ai = getAi();
    const analyzePrompt = `Act as an expert Italian Quantity Surveyor and Project Manager Agent.
    PROJECT CONTEXT (JSON):
    ${projectData}
    
    USER REQUEST:
    ${question}
    
    TASK: Provide a detailed, professional response. 
    If the user asks for a document, report, or attachment (PDF/Excel), use the 'generate_document' tool.
    
    FORMATTING RULES:
    1. Use Markdown for structure.
    2. Be proactive: if you see errors or optimizations, suggest them and offer to create a report.
    3. Your goal is to be a real Project Manager, not just a chatbot.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: analyzePrompt,
      config: {
        systemInstruction: "You are a professional construction project manager agent. You can generate technical documents and reports. Focus on technical accuracy and Italian standards.",
        tools: [{
          functionDeclarations: [{
            name: "generate_document",
            description: "Generates a professional document (PDF or Excel) based on the project analysis.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                documentType: { 
                  type: Type.STRING, 
                  enum: ["PDF_TECHNICAL_REPORT", "EXCEL_PROJECT_SUMMARY", "PDF_SAFETY_ANALYSIS"],
                  description: "The type of document to generate." 
                },
                title: { type: Type.STRING, description: "The title of the document." },
                content: { type: Type.STRING, description: "The detailed content or summary to include in the document (Markdown supported)." }
              },
              required: ["documentType", "title", "content"]
            }
          }]
        }]
      },
    });

    return {
      text: response.text || "Mi dispiace, non sono riuscito ad analizzare la tua domanda.",
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
