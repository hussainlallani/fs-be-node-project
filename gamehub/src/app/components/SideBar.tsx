"use client";
import React from "react";
import GenreList from "./GenreList";
import { Genre } from "../hooks/useGenres";
import { Platform } from "../hooks/usePlatforms";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}

const SideBar = ({ selectedGenre, onSelectGenre }: Props) => {
  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="flex items-center justify-center p-4">
        <GenreList
          selectedGenre={selectedGenre}
          onSelectGenre={onSelectGenre}
        />
      </div>
    </aside>
  );
};

export default SideBar;
