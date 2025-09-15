"use client";

import { useState } from "react";
import { Genre } from "./hooks/useGenres";
import { Platform } from "./hooks/usePlatforms";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import GameGrid from "./components/GameGrid";

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}

export default function Home() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({
    genre: null,
    platform: null,
    sortOrder: "",
    searchText: "",
  });

  return (
    <>
      <NavBar
      // searchText={gameQuery.searchText}
      // onSearch={(text) =>
      //   setGameQuery((prev) => ({ ...prev, searchText: text }))
      // }
      />
      <SideBar
        selectedGenre={gameQuery.genre}
        onSelectGenre={(genre) => setGameQuery((prev) => ({ ...prev, genre }))}
      />
      <GameGrid gameQuery={gameQuery} setGameQuery={setGameQuery} />
    </>
  );
}
