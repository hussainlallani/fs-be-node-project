import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { generateToken, verifyRefreshToken } from "../utils/jwt.util.js";
import { exchangeCodeForToken } from "../services/googleOAuth.service.js";

export const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
});

// Example: src/routes/auth.route.ts
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token" });

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken); // your util function
    // Optionally check if token is revoked/blacklisted

    // Generate new access token
    if (
      typeof payload === "object" &&
      payload !== null &&
      "userId" in payload
    ) {
      const accessToken = generateToken({ userId: (payload as any).userId });
      res.json({ accessToken });
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

router.get("/google/callback", async (req, res) => {
  console.log("Google OAuth callback received");
  const { code } = req.query; // Authorization code from Google
  const { access_token, refresh_token } = await exchangeCodeForToken(
    code as string
  );

  // Store tokens securely (e.g., in a session or database)
  (req as any).session.access_token = access_token; // Assuming you have session middleware set up
  // Send response to the front-end
  res.json({ access_token });
});
