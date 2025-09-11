"use client";
import { useEffect } from "react";
import MainBody from "./components/MainBody";
import { fetchGames } from "./services/test-games";

export default function Home() {
  useEffect(() => {
    fetchGames();
  }, []);
  return (
    <>
      <div>
        <h1>IGDB API Test</h1>
        <p>Check the console for game data.</p>
      </div>
      <MainBody />
    </>
  );
}
