// src/app/components/SideBarWrapper.tsx
"use client";

import { useState } from "react";
import SideBar from "./SideBar";
import { Genre } from "../hooks/useGenres";
import { Platform } from "../hooks/usePlatforms";

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}

export default function SideBarWrapper() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({
    genre: null,
    platform: null,
    sortOrder: "",
    searchText: "",
  });

  return (
    <SideBar
      selectedGenre={gameQuery.genre}
      onSelectGenre={(genre) => setGameQuery((prev) => ({ ...prev, genre }))}
    />
  );
}
