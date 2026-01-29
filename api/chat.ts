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
      return res.status(200).json({ 
        success: true,
        text: 'Please provide a message to chat with me!'
      });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured in environment variables');
      return res.status(200).json({ 
        success: true,
        text: '🔑 AI service is not configured yet. Please ask the admin to set up the GEMINI_API_KEY in Vercel environment variables.'
      });
    }

    // Call Gemini API using native fetch (available in Node 18+)
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
          text: '📊 Quota exceeded: You\'ve reached your daily limit. Please try again tomorrow.'
        });
      }

      if (apiResponse.status === 400) {
        return res.status(200).json({
          success: true,
          text: '🤔 I couldn\'t understand that request. Could you try rephrasing?'
        });
      }
      
      return res.status(200).json({
        success: true,
        text: '🤔 Oops! Something went wrong while connecting to the AI. Please try again later.'
      });
    }

    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    return res.status(200).json({ 
      success: true,
      text 
    });

  } catch (error: any) {
    console.error('Chat API error:', error?.message || error);
    
    return res.status(200).json({
      success: true,
      text: '🤔 Oops! Something went wrong. Please try again later. Error: ' + (error?.message || 'Unknown error')
    });
  }
}
