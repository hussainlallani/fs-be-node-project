import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const router = express.Router();

const CLIENT_ID = process.env.IGDB_CLIENT_ID || "";
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || "";

if (!CLIENT_ID || !ACCESS_TOKEN) {
  throw new Error("Missing IGDB credentials in environment variables");
}

router.get("/", async (req: Request, res: Response) => {
  const { fields, limit = 20, offset = 0, where, sort } = req.query;

  let query = "";

  if (fields) {
    const fieldList = Array.isArray(fields) ? fields.join(", ") : fields;
    query += `fields ${fieldList};\n`;
  }

  if (where) query += `where ${where};\n`;
  if (sort) query += `sort ${sort};\n`;

  query += `limit ${limit};\n`;
  query += `offset ${offset};\n`;

  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/artworks",
      query,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});
