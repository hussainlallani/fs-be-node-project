import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const router = express.Router();

interface CustomError extends Error {
  status?: number;
  details?: any;
}

const CLIENT_ID = process.env.IGDB_CLIENT_ID || "";
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || "";

if (!CLIENT_ID || !ACCESS_TOKEN) {
  throw new Error("Missing IGDB credentials in environment variables.");
}

const getImageUrl = (imageId: string, size = "t_cover_big") =>
  `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;

router.get("/", async (req: Request, res: Response) => {
  console.log("Query params:", req.query);
  const genreId = Number(req.query.genreId);
  const platformId = Number(req.query.platformId);

  const filters: string[] = [];

  if (!isNaN(genreId) && Number.isInteger(genreId)) {
    filters.push(`genres = [${genreId}]`);
  }

  if (!isNaN(platformId) && Number.isInteger(platformId)) {
    filters.push(`platforms = [${platformId}]`);
  }

  const whereClause = filters.length ? `where ${filters.join(" & ")};` : "";

  const query = `
    fields id, name, genres, platforms, total_rating, total_rating_count, first_release_date, artworks;
    ${whereClause}
    sort total_rating desc;
    limit 30;
  `;

  try {
    const gameRes = await axios.post("https://api.igdb.com/v4/games", query, {
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
      },
    });

    const games = gameRes.data;

    // ✅ Check for empty results
    if (!games || games.length === 0) {
      return res.status(404).json({
        error:
          "We couldn’t find any games matching your selected platform and genre. Try adjusting your filters or exploring other categories.",
      });
    }

    // Collect all genre and platform IDs
    const genreIds = [...new Set(games.flatMap((g: any) => g.genres || []))];
    const platformIds = [
      ...new Set(games.flatMap((g: any) => g.platforms || [])),
    ];
    const artworkIds = [
      ...new Set(games.flatMap((g: any) => g.artworks || [])),
    ];

    // Fetch genres
    const genreQuery = `fields id, name; where id = (${genreIds.join(
      ","
    )}); limit ${genreIds.length};`;
    const genreRes = await axios.post(
      "https://api.igdb.com/v4/genres",
      genreQuery,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );
    const genreMap = Object.fromEntries(
      genreRes.data.map((g: any) => [g.id, g.name])
    );

    // Fetch platforms
    const platformQuery = `fields id, name; where id = (${platformIds.join(
      ","
    )}); limit ${platformIds.length};`;
    const platformRes = await axios.post(
      "https://api.igdb.com/v4/platforms",
      platformQuery,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );
    const platformMap = Object.fromEntries(
      platformRes.data.map((p: any) => [p.id, p.name])
    );

    // Fetch artworks
    const artworkQuery = `fields id, image_id; where id = (${artworkIds.join(
      ","
    )}); limit ${artworkIds.length};`;
    const artworkRes = await axios.post(
      "https://api.igdb.com/v4/artworks",
      artworkQuery,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "text/plain",
        },
      }
    );
    const artworkMap = Object.fromEntries(
      artworkRes.data.map((art: any) => [art.id, getImageUrl(art.image_id)])
    );

    // Enrich games
    const enrichedGames = games.map((game: any) => ({
      id: game.id,
      name: game.name,
      genres: (game.genres || []).map((id: number) => genreMap[id]),
      platforms: (game.platforms || []).map((id: number) => platformMap[id]),
      total_rating: game.total_rating,
      total_rating_count: game.total_rating_count,
      release_date: game.first_release_date,
      artwork: game.artworks?.length ? artworkMap[game.artworks[0]] : null,
    }));

    res.json(enrichedGames);
  } catch (error: any) {
    const err: CustomError = new Error("Failed to fetch games");
    err.details = error;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      err.status = status;

      if (status === 400) {
        err.message = "Bad request. Please check your query parameters.";
      } else if (status === 401 || status === 403) {
        err.message =
          "Authentication failed. Please verify your IGDB credentials.";
      } else if (status === 404) {
        err.message = "No games found matching your filters.";
      } else {
        err.message =
          error.response?.data?.message ||
          "Something went wrong while contacting IGDB. Please try again later.";
      }

      console.error("IGDB API Error:", err.message, err.details);
      return res.status(status || 500).json({ message: err.message });
    }

    err.status = 500;
    err.message = "Unexpected server error. We're looking into it.";
    console.error("Unhandled Error:", err.message, err.details);
    return res.status(500).json({ message: err.message });
  }
});
