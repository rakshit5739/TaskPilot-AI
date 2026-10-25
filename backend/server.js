
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { generateTaskResponse } = require("./services/geminiService");

const app = express();
const PORT = process.env.PORT || 5001;

// Allow requests from the Brain AI frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Brain AI backend is running!",
  });
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Brain AI Backend",
  });
});

const MAX_HISTORY_ENTRIES = 50;
const MAX_HISTORY_TEXT_CHARS = 80000;

function validateAndSanitizeHistory(history) {
  if (history === undefined || history === null) {
    return [];
  }

  if (!Array.isArray(history)) {
    throw new Error("Invalid history: must be an array.");
  }

  if (history.length > MAX_HISTORY_ENTRIES) {
    throw new Error(`Invalid history: exceeds maximum limit of ${MAX_HISTORY_ENTRIES} entries.`);
  }

  const sanitized = [];
  let totalChars = 0;

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      throw new Error(`Invalid history entry at index ${i}: must be an object.`);
    }

    const { role, parts } = item;
    if (role !== "user" && role !== "model") {
      throw new Error(`Invalid history entry at index ${i}: role must be 'user' or 'model'.`);
    }

    if (!Array.isArray(parts) || parts.length === 0) {
      throw new Error(`Invalid history entry at index ${i}: parts must be a non-empty array.`);
    }

    const sanitizedParts = [];
    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      if (typeof part !== "object" || part === null || Array.isArray(part) || typeof part.text !== "string") {
        throw new Error(`Invalid history entry at index ${i}, part ${j}: must contain a text string.`);
      }
      totalChars += part.text.length;
      if (totalChars > MAX_HISTORY_TEXT_CHARS) {
        throw new Error(`Invalid history: total text exceeds limit of ${MAX_HISTORY_TEXT_CHARS} characters.`);
      }
      sanitizedParts.push({ text: part.text });
    }

    sanitized.push({
      role,
      parts: sanitizedParts,
    });
  }

  return sanitized;
}

// AI task endpoint
app.post("/api/ai/task", async (req, res) => {
  try {
    const { task, history } = req.body;

    if (typeof task !== "string" || !task.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a task.",
      });
    }

    if (task.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Task must be 5000 characters or fewer.",
      });
    }

    let sanitizedHistory = [];
    if (history !== undefined && history !== null) {
      try {
        sanitizedHistory = validateAndSanitizeHistory(history);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError.message || "Invalid history format.",
        });
      }
    }

    const response = await generateTaskResponse(task.trim(), sanitizedHistory);

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Gemini task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate an AI response. Please try again.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Brain AI backend running on http://localhost:${PORT}`);
});
