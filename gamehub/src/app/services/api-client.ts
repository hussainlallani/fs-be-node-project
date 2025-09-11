// src/services/api-client.ts
import axios from "axios";

export default axios.create({
  baseURL: "https://api.igdb.com/v4",
  headers: {
    "Client-ID": "z2ylwmyxy7tf00gwqbygppokuno0me",
    Authorization: "Bearer gicrt0a9x7mc522we3asof0fltbe6z",
  },
});
