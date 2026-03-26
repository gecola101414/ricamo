
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  try {
    switch (action) {
      case 'generateBulkItems':
        const { userDescription, region, year, categoriesList } = payload;
        const bulkPrompt = `Act as an expert Italian Quantity Surveyor.
        PROJECT CONTEXT: ${userDescription}
        REGION/YEAR: ${region} ${year}
        
        TASK: Break down the project into work items mapped strictly to these categories:
        ${categoriesList}

        Return ONLY a JSON object with an array "items".`;

        const bulkResponse = await ai.models.generateContent({
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
        return res.json({ text: bulkResponse.text, groundingChunks: bulkResponse.candidates?.[0]?.groundingMetadata?.groundingChunks });

      case 'parseVoiceMeasurement':
        const { transcript } = payload;
        const voiceResponse = await ai.models.generateContent({
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
        return res.json({ text: voiceResponse.text });

      case 'analyzeProject':
        const { projectData, question } = payload;
        const analyzePrompt = `Act as an expert Italian Quantity Surveyor and Project Manager.
        PROJECT CONTEXT (JSON):
        ${projectData}
        
        USER QUESTION:
        ${question}
        
        TASK: Provide a detailed, professional, and actionable response in Italian.
        FORMATTING RULES:
        1. Use Markdown for structure.
        2. Use clear headers (##, ###) for different sections.
        3. Use tables for cost breakdowns, comparisons, or data summaries.
        4. Use bold text for key metrics or critical warnings.
        5. If suggesting changes, provide a "Prima" (Before) and "Dopo" (After) comparison if applicable.
        6. The tone should be formal, technical, and highly professional, like an official technical report.
        7. Include a "Sintesi Esecutiva" (Executive Summary) at the beginning.
        8. Include a "Raccomandazioni" (Recommendations) section at the end.`;

        const analyzeResponse = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: analyzePrompt,
          config: {
            systemInstruction: "You are a professional construction project analyst. Focus on technical accuracy, Italian construction standards, and cost-efficiency. Your output must be a well-formatted technical report using Markdown.",
          },
        });
        return res.json({ text: analyzeResponse.text });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
