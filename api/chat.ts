import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gemini API - Server-side only (API key never exposed to client)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided' });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured in environment variables');
      return res.status(200).json({ 
        success: true,
        text: '🔑 AI service is not configured yet. Please ask the admin to set up the GEMINI_API_KEY in Vercel environment variables.'
      });
    }

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      
      if (response.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: '📊 Quota exceeded: You\'ve reached your daily limit. Please try again tomorrow.'
        });
      }
      
      return res.status(response.status).json({
        error: 'AI service error',
        message: '🤔 Oops! Something went wrong while connecting to the AI. Please try again later.'
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return res.status(200).json({ 
      success: true,
      text 
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    if (error.message?.includes('fetch')) {
      return res.status(503).json({
        error: 'Network error',
        message: '🌐 Network error: Please check your connection and try again.'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: '🤔 Oops! Something went wrong. Please try again later.'
    });
  }
}
