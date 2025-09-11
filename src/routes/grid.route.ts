import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const router = express.Router();

const CLIENT_ID = process.env.IGDB_CLIENT_ID || "";
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN || "";

if (!CLIENT_ID || !ACCESS_TOKEN) {
  throw new Error("Missing IGDB credentials in environment variables.");
}

const getImageUrl = (imageId: string, size = "t_cover_big") =>
  `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;

// router.get("/", async (req: Request, res: Response) => {
//   const query = `
//     fields id, name, genres, platforms, rating, rating_count, first_release_date, artworks;
//     sort rating desc;
//     limit 10;
//   `;

//   try {
//     const gameRes = await axios.post("https://api.igdb.com/v4/games", query, {
//       headers: {
//         "Client-ID": CLIENT_ID,
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//         "Content-Type": "text/plain",
//       },
//     });

//     const games = gameRes.data;

//     // Extract artwork IDs
//     const artworkIds = games.flatMap((g: any) => g.artworks || []);
//     const uniqueArtworkIds = [...new Set(artworkIds)];

//     // Fetch artwork image_ids
//     const artworkQuery = `
//       fields id, image_id;
//       where id = (${uniqueArtworkIds.join(",")});
//       limit ${uniqueArtworkIds.length};
//     `;

//     const artworkRes = await axios.post(
//       "https://api.igdb.com/v4/artworks",
//       artworkQuery,
//       {
//         headers: {
//           "Client-ID": CLIENT_ID,
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//           "Content-Type": "text/plain",
//         },
//       }
//     );

//     const artworkMap = Object.fromEntries(
//       artworkRes.data.map((art: any) => [art.id, getImageUrl(art.image_id)])
//     );

//     // Attach image URLs to games
//     const enrichedGames = games.map((game: any) => ({
//       id: game.id,
//       name: game.name,
//       genres: game.genres,
//       platforms: game.platforms,
//       rating: game.rating,
//       rating_count: game.rating_count,
//       release_date: game.first_release_date,
//       artwork: game.artworks?.length ? artworkMap[game.artworks[0]] : null,
//     }));

//     res.json(enrichedGames);
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.status(500).json({ error: "Unknown error" });
//     }
//   }
// });

router.get("/", async (req: Request, res: Response) => {
  const query = `
    fields id, name, genres, platforms, total_rating, total_rating_count, first_release_date, artworks;
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
  } catch (err) {
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});
