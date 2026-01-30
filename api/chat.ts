import type { VercelRequest, VercelResponse } from '@vercel/node';

// Groq API - Server-side only (API key never exposed to client)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Groq's current flagship model

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include Authorization for Groq

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
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(200).json({ 
        success: true,
        text: 'Please provide a message to chat with me!'
      });
    }

    if (!GROQ_API_KEY) {
      return res.status(200).json({ 
        success: true,
        text: '🔑 AI service is not configured yet. Please set GROQ_API_KEY in Vercel environment variables.'
      });
    }

    // Call Groq API
    const apiResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`, // Groq uses Bearer token for auth
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: prompt
        }],
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('Groq API error:', apiResponse.status, JSON.stringify(responseData));
      
      if (apiResponse.status === 429) {
        return res.status(200).json({
          success: true,
          text: '📊 Rate limit exceeded: You\'ve reached the daily limit. Please try again tomorrow.'
        });
      }

      if (apiResponse.status === 401 || (apiResponse.status === 400 && responseData?.error?.message?.includes('API key'))) {
        return res.status(200).json({
          success: true,
          text: '🔑 API key issue. Please check if the GROQ_API_KEY is valid.'
        });
      }
      
      // Return actual error for debugging
      return res.status(200).json({
        success: true,
        text: `🤔 AI error (${apiResponse.status}): ${responseData?.error?.message || 'Unknown error'}`
      });
    }

    const text = responseData.choices?.[0]?.message?.content || 'No response generated';

    return res.status(200).json({ 
      success: true,
      text     });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', errorMessage);
    
    return res.status(200).json({
      success: true,
      text: '🤔 Oops! Something went wrong. Please try again.'
    });
  }
}
