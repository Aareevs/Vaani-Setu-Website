// Profanity filter - Now uses backend API to keep word list hidden
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Cache for quick lookups (to reduce API calls for repeated checks)
const moderationCache = new Map<string, boolean>();
const CACHE_SIZE_LIMIT = 100;

/**
 * Check if text contains profanity (async version - calls backend)
 * For real-time validation, use the cached sync version as fallback
 */
export async function checkProfanityAsync(text: string): Promise<{ containsProfanity: boolean; message?: string }> {
  if (!text) return { containsProfanity: false };
  
  // Check cache first
  const cacheKey = text.toLowerCase().trim();
  if (moderationCache.has(cacheKey)) {
    return { 
      containsProfanity: moderationCache.get(cacheKey)!, 
      message: moderationCache.get(cacheKey) ? getProfanityWarningMessage() : undefined 
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, action: 'check' }),
    });

    const data = await response.json();
    
    // Update cache (with size limit)
    if (moderationCache.size >= CACHE_SIZE_LIMIT) {
      const firstKey = moderationCache.keys().next().value;
      if (firstKey) moderationCache.delete(firstKey);
    }
    moderationCache.set(cacheKey, data.containsProfanity);

    return {
      containsProfanity: data.containsProfanity,
      message: data.message
    };
  } catch (error) {
    console.error('Moderation API error:', error);
    // Fallback to basic client-side check
    return { containsProfanity: containsProfanityBasic(text) };
  }
}

/**
 * Basic client-side check (lightweight fallback)
 * Only catches the most obvious cases - real filtering happens server-side
 */
function containsProfanityBasic(text: string): boolean {
  if (!text) return false;
  // Only check a few very obvious words as fallback
  const basicList = ['fuck', 'shit', 'bitch'];
  const lowerText = text.toLowerCase();
  return basicList.some(word => lowerText.includes(word));
}

/**
 * Synchronous check - uses cache or basic fallback
 * Use this for real-time typing validation
 */
export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  const cacheKey = text.toLowerCase().trim();
  if (moderationCache.has(cacheKey)) {
    return moderationCache.get(cacheKey)!;
  }
  
  // Basic fallback for sync usage
  return containsProfanityBasic(text);
}

/**
 * Filter profanity from text (async - calls backend)
 */
export async function filterProfanityAsync(text: string): Promise<string> {
  if (!text) return text;

  try {
    const response = await fetch(`${API_BASE_URL}/api/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, action: 'filter' }),
    });

    const data = await response.json();
    return data.filteredText || text;
  } catch (error) {
    console.error('Filter API error:', error);
    return text; // Return original on error
  }
}

/**
 * Synchronous filter - basic replacement only
 */
export function filterProfanity(text: string): string {
  if (!text) return text;
  // Basic fallback
  const basicList = ['fuck', 'shit', 'bitch'];
  let filtered = text;
  basicList.forEach(word => {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(pattern, '*'.repeat(word.length));
  });
  return filtered;
}

export function getProfanityWarningMessage(): string {
  return 'Your message contains inappropriate language. Please be respectful and avoid using abusive or offensive words.';
}