
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskPilot AI backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "TaskPilot AI Backend",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`TaskPilot AI server running on port ${PORT}`);
});
