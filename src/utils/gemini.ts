import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Missing Gemini API key. Please set the VITE_GEMINI_API_KEY environment variable.");
  throw new Error("Missing Gemini API key. Please set the VITE_GEMINI_API_KEY environment variable.");
}

console.log("🔑 API Key status:", API_KEY ? "Present" : "Missing");
console.log("🔧 Environment:", import.meta.env.MODE);

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt: string) => {
  try {
    console.log("🚀 Starting Gemini API call...");
    console.log("📤 Prompt:", prompt.substring(0, 50) + "...");
    
    // Using a stable, widely available model to ensure compatibility.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("🎯 Model initialized successfully");
    
    const result = await model.generateContent(prompt);
    console.log("📥 Response received from Gemini");
    
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Response text extracted successfully");
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
    console.log("🧪 Testing Gemini API connection...");
    const response = await getGeminiResponse("Hello, this is a test message. Please respond with 'Test successful!'");
    console.log("✅ Connection test result:", response);
    return response;
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    return null;
  }
};
