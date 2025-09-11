import express, { Response, Request } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const router = express.Router();

// Define CLIENT_ID and ACCESS_TOKEN, e.g., from environment variables
const CLIENT_ID = process.env.IGDB_CLIENT_ID || "";
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || "";

if (!CLIENT_ID || !ACCESS_TOKEN) {
  throw new Error("Missing IGDB credentials in environment variables");
}

// POST new course
if (CLIENT_ID && ACCESS_TOKEN) {
  router.get("/", async (req: Request, res: Response) => {
    console.log("IGDB Client ID:", CLIENT_ID);
    console.log("IGDB Access Token:", ACCESS_TOKEN);
    try {
      const response = await axios.post(
        "https://api.igdb.com/v4/games",
        req.body,
        {
          headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      console.log("IGDB Response:", response.data);
      res.json(response.data);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  });
}
