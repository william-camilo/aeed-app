// Server-only configuration. Never expose secrets using NEXT_PUBLIC_*.
export const env = process.env;
// Guided mode is the default, including when a key is already stored.
export const aiEnabled = env.AEED_AI_ENABLED === 'true' && !!env.OPENAI_API_KEY;
