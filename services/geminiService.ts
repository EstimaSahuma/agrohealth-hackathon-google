
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis, IssueType, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzePlantHealth = async (files: File[]): Promise<PlantAnalysis> => {
  const model = "gemini-3-pro-preview";

  const parts = await Promise.all(
    files.map(async (file) => {
      const base64 = await fileToBase64(file);
      return {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      };
    })
  );

  const prompt = `Act as a friendly, expert plant doctor helping a farmer in the field. 
                  Analyze the photos/videos to find pests, diseases, or soil nutrient problems.
                  
                  STRICT TONE GUIDELINES:
                  - Use simple, everyday language. Avoid complex scientific jargon.
                  - Be supportive and helpful, like a trusted neighbor.
                  - Give clear, step-by-step instructions for fixing the problem.
                  
                  If the plant looks healthy, be encouraging and suggest how to keep it that way.
                  Identify the plant species common name clearly.

                  Return the analysis strictly in JSON format matching the schema provided.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        ...parts,
        { text: prompt }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantName: { type: Type.STRING, description: "Common name of the plant (e.g., Tomato, Corn)." },
          issueType: { 
            type: Type.STRING, 
            enum: [IssueType.PEST, IssueType.DISEASE, IssueType.DEFICIENCY, IssueType.HEALTHY, IssueType.UNKNOWN],
            description: "Category of the problem." 
          },
          diagnosis: { type: Type.STRING, description: "Simple name of the problem (e.g., Aphids, Early Blight)." },
          symptoms: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Easy-to-spot signs found on the plant."
          },
          explanation: { type: Type.STRING, description: "A friendly explanation of what's happening to the plant." },
          severity: { 
            type: Type.STRING, 
            enum: [Severity.LOW, Severity.MEDIUM, Severity.HIGH],
            description: "How urgent the fix is." 
          },
          treatmentPlan: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Simple steps the farmer can take now."
          },
          preventionTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "How to stop this from coming back next season."
          },
        },
        required: ["plantName", "issueType", "diagnosis", "symptoms", "explanation", "severity", "treatmentPlan", "preventionTips"]
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("We couldn't get a clear answer. Please try again with a better photo.");
  }

  try {
    return JSON.parse(text.trim()) as PlantAnalysis;
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("We had trouble reading the expert's notes. Please try again.");
  }
};
