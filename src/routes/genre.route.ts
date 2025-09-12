import express, { Request, Response } from "express";
import axios from "axios";

export const router = express.Router();

const CLIENT_ID = process.env.IGDB_CLIENT_ID || "";
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || "";

if (!CLIENT_ID || !ACCESS_TOKEN) {
  throw new Error("Missing IGDB credentials in environment variables");
}

router.get("/", async (_req: Request, res: Response) => {
  const query = `
    fields id, name;
    limit 50;
  `;

  try {
    const response = await axios.post("https://api.igdb.com/v4/genres", query, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});
