import axios from "axios";

const client = axios.create({
  baseURL: "https://api.igdb.com/v4",
  headers: {
    "Client-ID": "z2ylwmyxy7tf00gwqbygppokuno0me",
    Authorization: "Bearer gicrt0a9x7mc522we3asof0fltbe6z",
  },
});

export const fetchGames = async () => {
  try {
    const response = await client.post(
      "/games",
      "fields id, name, artworks; limit 5;"
    );
    console.log("Games:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
};
