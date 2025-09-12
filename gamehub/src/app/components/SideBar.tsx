"use client";

import React from "react";
import GenreList from "./GenreList";
import { Genre } from "../hooks/useGenres";

const SideBar = () => {
  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="flex items-center justify-center p-4">
        <GenreList onSelectGenre={(genre: Genre) => {}} selectedGenre={null} />
      </div>
    </aside>
  );
};

export default SideBar;
