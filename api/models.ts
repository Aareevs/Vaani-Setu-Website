import type { VercelRequest, VercelResponse } from '@vercel/node';

// List available Gemini models for this API key
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return res.status(200).json({ error: 'No API key configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ error: String(error) });
  }
}
