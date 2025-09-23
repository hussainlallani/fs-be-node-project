/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import useGamesGrid from "../hooks/useGameGrid";
import ImageSkeletonContainer from "./ImageSkeletonContainer";
import { GameQuery } from "../page";
import GameHeading from "./GameHeading";
import PlatformSelector from "./PlatformSelector";
import Image from "next/image";
import formatNumber from "../lib/format-number";
import SortSelector from "./SortSelector";
import LoadMoreButton from "./LoadMoreButton";
import { GameGrid as GameType } from "../hooks/useGameGrid";

interface Props {
  gameQuery: GameQuery;
  setGameQuery: React.Dispatch<React.SetStateAction<GameQuery>>;
}

const GameGrid = ({ gameQuery, setGameQuery }: Props) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: gridData, isLoading, error } = useGamesGrid(gameQuery);

  // Append new data when gridData changes
  useEffect(() => {
    if (gridData) {
      setGames((prev) => [...prev, ...gridData]);
      setLoadingMore(false);
    }
  }, [gridData]);

  // Reset games and offset when filters change
  useEffect(() => {
    setGames([]);
    setGameQuery((prev) => ({
      ...prev,
      offset: 0,
    }));
  }, [
    gameQuery.genre,
    gameQuery.platform,
    gameQuery.sortOrder,
    gameQuery.searchText,
    setGameQuery,
  ]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setGameQuery((prev) => ({
      ...prev,
      offset: (prev.offset ?? 0) + (prev.limit ?? 30),
    }));
  };

  const skeletons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <main className="p-4 md:ml-64 h-auto pt-31 sm:pt-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
      <div className="flex flex-row gap-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
        <div className="w-auto flex-grow-0">
          <PlatformSelector
            selectedPlatform={gameQuery.platform}
            onSelectPlatform={(platform) =>
              setGameQuery((prev) => ({ ...prev, platform, offset: 0 }))
            }
          />
        </div>
        <div className="w-auto flex-grow-0">
          <SortSelector
            selectedSort={gameQuery.sortOrder}
            onSelectSort={(sort) =>
              setGameQuery((prev) => ({ ...prev, sortOrder: sort, offset: 0 }))
            }
          />
        </div>
      </div>

      <GameHeading gameQuery={gameQuery} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {isLoading &&
          skeletons.map((key) => <ImageSkeletonContainer key={key} />)}
        {!isLoading &&
          !error &&
          games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={
                    game.artwork ??
                    "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                  }
                  alt={game.name}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={192}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {game.name}
                </h3>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Genres: {game.genres.join(", ")}
                </p>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Platforms: {game.platforms.join(", ")}
                </p>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Rating: ⭐ {formatNumber(game.total_rating) || "N/A"}
                </p>
                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Release:{" "}
                  {new Date(game.release_date * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {!isLoading && !error && (
        <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
      )}
    </main>
  );
};

export default GameGrid;
