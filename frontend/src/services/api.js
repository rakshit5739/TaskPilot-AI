const API_BASE_URL = "http://localhost:5001";

// Check whether the backend is running
export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Unable to connect to the Brain AI backend.");
  }

  return response.json();
}

// Send a task to the backend and receive the AI response
export async function sendTaskToAI(task, history = []) {
  const payload = { task };
  if (Array.isArray(history) && history.length > 0) {
    payload.history = history;
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Unable to generate an AI response."
    );
  }

  return data.response;
}
