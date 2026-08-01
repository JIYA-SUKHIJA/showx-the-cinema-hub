// src/utils/aiCache.js

// Simple in-memory cache for AI chat responses. Keeps recently-asked
// questions available for CACHE_TTL_MS without calling Gemini again.
// For a small/demo-scale app this in-memory Map is enough; a production
// deployment with multiple server instances would use Redis instead.

const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Normalize a question so trivial differences (casing, punctuation,
// extra spaces) still hit the same cache entry.
function normalize(message) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ");
}

export function getCachedResponse(message) {
  const key = normalize(message);
  const entry = cache.get(key);

  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.answer;
}

export function setCachedResponse(message, answer) {
  const key = normalize(message);
  cache.set(key, { answer, timestamp: Date.now() });
}