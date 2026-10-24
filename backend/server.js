
const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

// Start the server
app.listen(PORT, () => {
  console.log(`TaskPilot AI backend running on http://localhost:${PORT}`);
});
