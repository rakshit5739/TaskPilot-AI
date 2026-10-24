let aiClient = null;

async function generateTaskResponse(prompt) {
  // Make sure the API key is configured
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing from the backend environment."
    );
  }

  // Load Google's SDK and initialize the client once
  if (!aiClient) {
    const { GoogleGenAI } = await import("@google/genai");

    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  // Send the task to Gemini
  const response = await aiClient.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  return response.text;
}

module.exports = {
  generateTaskResponse,
};
