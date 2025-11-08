import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API key. Please set the VITE_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt: string) => {
  try {
    // Using a stable, widely available model to ensure compatibility.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "Oops! Something went wrong while connecting to the AI. Please try again later.";
  }
};
