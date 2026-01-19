
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
  // Use gemini-3-pro-preview for complex scientific reasoning in plant pathology as per guidelines
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

  const prompt = `Act as an expert agronomist and plant pathologist. 
Analyze the provided images/videos of the plant. 
Identify the plant species if possible.
Detect any pests, diseases, or nutrient deficiencies. 
Provide a professional but easy-to-understand (farmer-friendly) diagnosis.
If the plant is healthy, state it clearly.

Return the analysis strictly in JSON format according to the provided schema.`;

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
          plantName: { type: Type.STRING, description: "Common name of the plant identified." },
          issueType: { 
            type: Type.STRING, 
            enum: [IssueType.PEST, IssueType.DISEASE, IssueType.DEFICIENCY, IssueType.HEALTHY, IssueType.UNKNOWN],
            description: "The primary category of the problem." 
          },
          diagnosis: { type: Type.STRING, description: "The specific name of the pest or disease." },
          symptoms: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of visual symptoms observed."
          },
          explanation: { type: Type.STRING, description: "Plain language explanation of what is happening." },
          severity: { 
            type: Type.STRING, 
            enum: [Severity.LOW, Severity.MEDIUM, Severity.HIGH],
            description: "The level of urgency." 
          },
          treatmentPlan: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Step-by-step instructions to fix the issue."
          },
          preventionTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "How to avoid this issue in the future."
          },
        },
        required: ["plantName", "issueType", "diagnosis", "symptoms", "explanation", "severity", "treatmentPlan", "preventionTips"]
      },
    },
  });

  if (!response.text) {
    throw new Error("No analysis result received from the AI.");
  }

  try {
    // FIX: Using .text property instead of calling it as a method
    return JSON.parse(response.text.trim()) as PlantAnalysis;
  } catch (err) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("The AI provided an invalid response format. Please try again.");
  }
};
