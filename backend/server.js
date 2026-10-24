
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { generateTaskResponse } = require("./services/geminiService");

const app = express();
const PORT = process.env.PORT || 5001;

// Allow requests from the TaskPilot AI frontend
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
    message: "TaskPilot AI backend is running!",
  });
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "TaskPilot AI Backend",
  });
});

// AI task endpoint
app.post("/api/ai/task", async (req, res) => {
  try {
    const { task } = req.body;

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

    const response = await generateTaskResponse(task.trim());

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
  console.log(`TaskPilot AI backend running on http://localhost:${PORT}`);
});
