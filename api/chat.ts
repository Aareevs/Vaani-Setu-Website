import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gemini API - Server-side only (API key never exposed to client)
// Using gemini-pro which is the stable model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(200).json({ 
        success: true,
        text: 'Please provide a message to chat with me!'
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(200).json({ 
        success: true,
        text: '🔑 AI service is not configured yet. Please set GEMINI_API_KEY in Vercel environment variables.'
      });
    }

    // Call Gemini API
    const apiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('Gemini API error:', apiResponse.status, JSON.stringify(responseData));
      
      if (apiResponse.status === 429) {
        return res.status(200).json({
          success: true,
          text: '📊 Quota exceeded: You\'ve reached the daily limit. Please try again tomorrow.'
        });
      }

      if (apiResponse.status === 400 && responseData?.error?.message?.includes('API key')) {
        return res.status(200).json({
          success: true,
          text: '🔑 API key issue. Please check if the GEMINI_API_KEY is valid.'
        });
      }
      
      // Return actual error for debugging
      return res.status(200).json({
        success: true,
        text: `🤔 AI error (${apiResponse.status}): ${responseData?.error?.message || 'Unknown error'}`
      });
    }

    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return res.status(200).json({ 
      success: true,
      text 
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', errorMessage);
    
    return res.status(200).json({
      success: true,
      text: '🤔 Oops! Something went wrong. Please try again.'
    });
  }
}
