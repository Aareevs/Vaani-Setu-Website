// Gemini API - Now calls backend endpoint (API key is kept server-side)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API error:", data);
      return data.message || "🤔 Oops! Something went wrong while connecting to the AI. Please try again later.";
    }

    return data.text;
  } catch (error: any) {
    console.error("❌ Error getting response from Gemini:", error);
    
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return "🌐 Network error: Please check your internet connection and try again.";
    }
    
    return "🤔 Oops! Something went wrong while connecting to the AI. Please try again later.";
  }
};

// Test function to verify API connectivity
export const testGeminiConnection = async (): Promise<string | null> => {
  try {
    const response = await getGeminiResponse("Hello, this is a test message. Please respond with 'Test successful!'");
    if (response && !response.includes('error') && !response.includes('Oops')) {
      return response;
    }
    return null;
  } catch (error) {
    console.error("Connection test failed:", error);
    return null;
  }
};
