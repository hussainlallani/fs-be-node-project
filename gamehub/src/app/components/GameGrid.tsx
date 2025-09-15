/* eslint-disable @next/next/no-img-element */
import React from "react";
import useGamesGrid from "../hooks/useGameGrid";
import ImageSkeletonContainer from "./ImageSkeletonContainer";
import { GameQuery } from "../page";
import GameHeading from "./GameHeading";
import PlatformSelector from "./PlatformSelector";
import Image from "next/image";
import formatNumber from "../lib/format-number";
import SortSelector from "./SortSelector";

interface Props {
  gameQuery: GameQuery;
  setGameQuery: (query: GameQuery) => void;
}

const GameGrid = ({ gameQuery, setGameQuery }: Props) => {
  const { data: gridData, isLoading, error } = useGamesGrid(gameQuery ?? null);
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <main className="p-4 md:ml-64 h-auto pt-20">
      <div className="flex flex-row gap-4">
        <div>
          <PlatformSelector
            selectedPlatform={gameQuery.platform}
            onSelectPlatform={(platform) =>
              setGameQuery({ ...gameQuery, platform })
            }
          />
        </div>
        <div>
          <SortSelector
            selectedSort={gameQuery.sortOrder}
            onSelectSort={(sort) =>
              setGameQuery({ ...gameQuery, sortOrder: sort })
            }
          />
        </div>
      </div>

      <GameHeading gameQuery={gameQuery} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {!isLoading && error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}
        {isLoading &&
          skeletons.map((key) => <ImageSkeletonContainer key={key} />)}
        {!isLoading &&
          !error &&
          gridData.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={
                    game.artwork ||
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
                  Rating: ⭐{" "}
                  {/* {game.total_rating
                    ? game.total_rating === 100
                      ? game.total_rating
                      : game.total_rating.toFixed(2)
                    : "N/A"} */}
                  {formatNumber(game.total_rating) || "N/A"}
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
    </main>
  );
};

export default GameGrid;
