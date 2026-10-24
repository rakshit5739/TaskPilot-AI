const API_BASE_URL = "http://localhost:5001";

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Unable to connect to the TaskPilot AI backend.");
  }

  return response.json();
}
