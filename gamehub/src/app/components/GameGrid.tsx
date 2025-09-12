/* eslint-disable @next/next/no-img-element */
import React from "react";
import useGamesGrid from "../hooks/useGameGrid";
import ImageSkeletonContainer from "./ImageSkeletonContainer";
import { GameQuery } from "../page";

interface Props {
  gameQuery: GameQuery;
}

const GameGrid = ({ gameQuery }: Props) => {
  const { data: gridData, isLoading, error } = useGamesGrid();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const selectedGenre = gameQuery.genre;

  return (
    <main className="p-4 md:ml-64 h-auto pt-20">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {selectedGenre && selectedGenre.name ? selectedGenre.name : "All Games"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}
        {isLoading &&
          skeletons.map((key) => <ImageSkeletonContainer key={key} />)}
        {gridData.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={
                game.artwork ||
                "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
              }
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {game.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Genres: {game.genres.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Platforms: {game.platforms.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Rating: ⭐ {game.total_rating}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Release:{" "}
                {new Date(game.release_date * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GameGrid;
