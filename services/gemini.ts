import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExplorationResult, PathType } from "../types";

// Initialize the client
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

const explorationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    rootTopic: { type: Type.STRING, description: "The original topic provided by the user." },
    divergenceScore: { type: Type.NUMBER, description: "A score from 0-100 indicating how wild the tangent path is." },
    linearPath: {
      type: Type.ARRAY,
      description: "A logical, step-by-step progression of the topic (strictly focused).",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          stepNumber: { type: Type.INTEGER }
        },
        required: ["title", "description", "stepNumber"]
      }
    },
    tangentPath: {
      type: Type.ARRAY,
      description: "A creative, lateral thinking path that drifts further away from the original meaning into unexpected territory.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          stepNumber: { type: Type.INTEGER }
        },
        required: ["title", "description", "stepNumber"]
      }
    }
  },
  required: ["rootTopic", "linearPath", "tangentPath", "divergenceScore"]
};

export const exploreTopic = async (topic: string): Promise<ExplorationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Analyze the topic: "${topic}". 
      
      Generate two distinct paths of thought with 4 steps each:
      1. Linear Path: Strictly logical, expected, and focused deep dive into the topic.
      2. Tangent Path: Start related, but then use lateral thinking to drift into surprising, creative, or metaphorically related territory ("going off on a tangent").
      
      Provide a divergence score (0-100) representing how far the tangent path drifted from the original concept.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: explorationSchema,
        systemInstruction: "You are an expert in lateral thinking and logical reasoning. You visualize thought processes.",
        temperature: 0.8, // Higher temp for creative tangents
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text generated");

    const rawData = JSON.parse(jsonText);

    // Transform into internal shape
    const linearNodes = rawData.linearPath.map((item: any) => ({
      id: `lin-${item.stepNumber}`,
      title: item.title,
      description: item.description,
      type: PathType.LINEAR,
      depth: item.stepNumber
    }));

    const tangentNodes = rawData.tangentPath.map((item: any) => ({
      id: `tan-${item.stepNumber}`,
      title: item.title,
      description: item.description,
      type: PathType.TANGENT,
      depth: item.stepNumber
    }));

    return {
      rootTopic: rawData.rootTopic,
      linearPath: linearNodes,
      tangentPath: tangentNodes,
      divergenceScore: rawData.divergenceScore
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
