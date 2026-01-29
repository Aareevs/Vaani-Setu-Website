import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple test endpoint to verify API is working
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasApiKey = !!process.env.GEMINI_API_KEY;

  return res.status(200).json({
    success: true,
    message: 'Vaani Setu API is running!',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasApiKey,
    endpoints: {
      chat: '/api/chat - POST - AI chatbot responses',
      moderate: '/api/moderate - POST - Content moderation',
      test: '/api/test - GET - API health check'
    }
  });
}
