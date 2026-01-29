import type { VercelRequest, VercelResponse } from '@vercel/node';

// Profanity list - kept server-side so users can't see what's blocked
const profanityList = [
  // Common profanity
  'fuck', 'shit', 'bitch', 'damn', 'bastard', 'crap',
  'piss', 'dick', 'cock', 'pussy', 'slut', 'whore', 'fag', 'nigger',
  'cunt', 'twat', 'wanker', 'bollocks', 'arse', 'bloody',
  // Abusive terms
  'idiot', 'stupid', 'moron', 'retard', 'dumb', 'loser', 'fool',
  'hate', 'kill', 'die', 'death', 'murder', 'suicide',
  // Common variations and leetspeak
  'f*ck', 'sh*t', 'b*tch', 'a$$', 'fuk', 'sht', 'fck',
  // Hindi/Indian abusive words
  'chutiya', 'madarchod', 'bhenchod', 'gandu', 'harami', 'kamina',
  'kutte', 'saale', 'behenchod', 'mc', 'bc', 'bkl'
];

// Words that might be false positives (allowed words)
const allowedWords = [
  'assassin', 'bass', 'class', 'glass', 'grass', 'pass', 'mass',
  'assist', 'assumption', 'classic', 'compassion', 'hello', 'shell',
  'hell', 'assess', 'hassle', 'essay', 'message', 'passage', 'assemble',
  'association', 'asset', 'assign', 'assignment', 'assistance', 'assistant'
];

// Sign language related terms that should always be allowed
const signLanguageTerms = [
  'sign', 'signing', 'hand', 'gesture', 'show', 'demonstrate',
  'teach', 'learn', 'isl', 'asl', 'bsl', 'finger', 'palm', 'fist'
];

function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Always allow sign language related messages
  for (const term of signLanguageTerms) {
    if (lowerText.includes(term)) return false;
  }
  
  // Check if it's an allowed word first
  for (const allowed of allowedWords) {
    if (lowerText.includes(allowed)) {
      const wordPattern = new RegExp(`\\b${allowed}\\b`, 'i');
      if (wordPattern.test(lowerText)) return false;
    }
  }
  
  // Check for profanity with strict word boundaries
  for (const word of profanityList) {
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

function filterProfanity(text: string): string {
  if (!text) return text;
  
  let filteredText = text;
  
  for (const word of profanityList) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(pattern, (match) => {
      return '*'.repeat(match.length);
    });
  }
  
  return filteredText;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, action = 'check' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text provided' });
    }

    if (action === 'filter') {
      // Return filtered text with profanity replaced by asterisks
      return res.status(200).json({
        success: true,
        filteredText: filterProfanity(text),
        containsProfanity: containsProfanity(text)
      });
    }

    // Default: just check if text contains profanity
    const hasProfanity = containsProfanity(text);
    
    return res.status(200).json({
      success: true,
      containsProfanity: hasProfanity,
      message: hasProfanity 
        ? 'Your message contains inappropriate language. Please be respectful and avoid using abusive or offensive words.'
        : null
    });

  } catch (error: any) {
    console.error('Moderation API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process moderation request'
    });
  }
}
