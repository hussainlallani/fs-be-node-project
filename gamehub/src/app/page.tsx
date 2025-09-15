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
  sortOrder: {
    field: "first_release_date" | "name" | "total_rating";
    direction: "desc" | "asc";
  };
  searchText: string;
  offset?: number;
  limit?: number;
}

export default function Home() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({
    genre: null,
    platform: null,
    sortOrder: {
      field: "total_rating",
      direction: "desc",
    },
    searchText: "",
    limit: 30,
    offset: 0,
  });

  return (
    <>
      <NavBar
        searchText={gameQuery.searchText}
        onSearch={(text: string) =>
          setGameQuery((prev) => ({ ...prev, searchText: text }))
        }
      />
      <SideBar
        selectedGenre={gameQuery.genre}
        onSelectGenre={(genre) => setGameQuery((prev) => ({ ...prev, genre }))}
      />
      <GameGrid gameQuery={gameQuery} setGameQuery={setGameQuery} />
    </>
  );
}
