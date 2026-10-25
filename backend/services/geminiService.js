
let aiClient = null;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateTaskResponse(prompt, history = []) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing from the backend environment."
    );
  }

  // Initialize the Gemini client once.
  if (!aiClient) {
    const { GoogleGenAI } = await import("@google/genai");

    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  const contents =
    Array.isArray(history) && history.length > 0
      ? [...history, { role: "user", parts: [{ text: prompt }] }]
      : prompt;

  for (let attempt = 0; ; attempt++) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents,
        config: {
          maxOutputTokens: 1024,
        },
      });

      return response.text;
    } catch (error) {
      const errorMessage = String(error.message || error);
      const isTemporaryError =
        /\b(429|500|502|503|504)\b/.test(errorMessage) ||
        /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|TIMEOUT/i.test(
          errorMessage
        );

      if (!isTemporaryError || attempt >= MAX_RETRIES) {
        throw error;
      }

      const delay = RETRY_DELAY_MS * 2 ** attempt;

      console.warn(
        `Gemini temporary error. Retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms.`
      );

      await wait(delay);
    }
  }
}

module.exports = {
  generateTaskResponse,
};
