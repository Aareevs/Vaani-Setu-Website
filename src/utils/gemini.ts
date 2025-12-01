import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getGeminiResponse = async (prompt: string) => {
  try {
    if (!genAI) {
      return "🔑 API key error: Please set the VITE_GEMINI_API_KEY environment variable.";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("❌ Error getting response from Gemini:", error);
    console.error("📋 Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      code: error.code,
      stack: error.stack?.substring(0, 200)
    });
    
    // More specific error handling
    if (error.message?.includes('fetch')) {
      return "🌐 Network error: Please check your internet connection and try again.";
    } else if (error.message?.includes('API key')) {
      return "🔑 API key error: Please check your Gemini API key configuration.";
    } else if (error.message?.includes('quota')) {
      return "📊 Quota exceeded: You've reached your daily limit. Please try again tomorrow.";
    } else if (error.message?.includes('permission')) {
      return "🔒 Permission denied: Please check your API key permissions.";
    } else if (error instanceof Error) {
      return `🤖 AI Error: ${error.message}`;
    }
    
    return "🤔 Oops! Something went wrong while connecting to the AI. Please try again later.";
  }
};

// Test function to verify API connectivity
export const testGeminiConnection = async () => {
  try {
    if (!genAI) {
      return "🔑 API key error";
    }
    const response = await getGeminiResponse("Hello, this is a test message. Please respond with 'Test successful!'");
    return response;
  } catch (error) {
    return null;
  }
};
