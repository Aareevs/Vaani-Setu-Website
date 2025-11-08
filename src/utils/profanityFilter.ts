// Profanity and abusive language filter
const profanityList = [
  // Common profanity (keeping it simple for demonstration)
  'fuck', 'shit', 'bitch', 'damn', 'bastard', 'crap',
  'piss', 'dick', 'cock', 'pussy', 'slut', 'whore', 'fag', 'nigger',
  'cunt', 'twat', 'wanker', 'bollocks', 'arse', 'bloody',
  // Abusive terms
  'idiot', 'stupid', 'moron', 'retard', 'dumb', 'loser', 'fool',
  'hate', 'kill', 'die', 'death', 'murder', 'suicide',
  // Common variations and leetspeak
  'f*ck', 'sh*t', 'b*tch', 'a$$', 'fuk', 'sht', 'fck',
  // Hindi/Indian abusive words (common ones)
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

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  // Always allow sign language related messages
  for (const term of signLanguageTerms) {
    if (lowerText.includes(term)) return false;
  }
  
  // Check if it's an allowed word first
  for (const allowed of allowedWords) {
    if (lowerText.includes(allowed)) {
      // Extra check: make sure it's actually the allowed word
      const wordPattern = new RegExp(`\\b${allowed}\\b`, 'i');
      if (wordPattern.test(lowerText)) return false;
    }
  }
  
  // Check for profanity with strict word boundaries
  for (const word of profanityList) {
    // Only match as complete words
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

export function filterProfanity(text: string): string {
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

export function getProfanityWarningMessage(): string {
  return 'Your message contains inappropriate language. Please be respectful and avoid using abusive or offensive words.';
}