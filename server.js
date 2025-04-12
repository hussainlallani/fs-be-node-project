import express from "express";
import Logger from "./logger.js";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Resume Builder API!");
});

const logger = new Logger();
// Step1: Register a listener
logger.on("messageLogged", (arg) => {
  console.log("Listener called", arg);
});

logger.log("message!!");

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
