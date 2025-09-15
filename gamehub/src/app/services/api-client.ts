// src/services/api-client.ts
import axios from "axios";

export default axios.create({
  baseURL: "https://hussainlallani.laxon.ca/node",
  // baseURL: "http://127.0.0.1:3000/",
});
