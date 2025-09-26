import React, { useEffect, useState } from "react";
import useGamesGrid from "../hooks/useGameGrid";
import ImageSkeletonContainer from "./ImageSkeletonContainer";
import { GameQuery } from "../page";
import GameHeading from "./GameHeading";
import PlatformSelector from "./PlatformSelector";
import SortSelector from "./SortSelector";
import LoadMoreButton from "./LoadMoreButton";
import { GameGrid as GameType } from "../hooks/useGameGrid";
import GameCard from "./GameCard";

interface Props {
  gameQuery: GameQuery;
  setGameQuery: React.Dispatch<React.SetStateAction<GameQuery>>;
}

const GameGrid = ({ gameQuery, setGameQuery }: Props) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: gridData, isLoading, error } = useGamesGrid(gameQuery);

  useEffect(() => {
    if (gridData) {
      setGames((prev) => [...prev, ...gridData]);
      setLoadingMore(false);
    }
  }, [gridData]);

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

  const columnCount = 5;

  const distributeHorizontally = <T,>(
    items: T[] = [],
    numColumns: number
  ): T[][] => {
    const columns: T[][] = Array.from({ length: numColumns }, () => []);
    items.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });
    return columns;
  };

  const columns = distributeHorizontally(games, columnCount);
  const initialSkeletons = Array.from({ length: 12 }, (_, i) => i);
  const loadingSkeletons = loadingMore
    ? distributeHorizontally(Array.from({ length: 5 }), columnCount)
    : [];

  return (
    <main className="p-4 md:ml-64 h-auto pt-32 sm:pt-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 min-h-screen">
      {/* Filters */}
      <div className="flex flex-row gap-4 mb-6">
        <div className="w-auto">
          <PlatformSelector
            selectedPlatform={gameQuery.platform}
            onSelectPlatform={(platform) =>
              setGameQuery((prev) => ({ ...prev, platform, offset: 0 }))
            }
          />
        </div>
        <div className="w-auto">
          <SortSelector
            selectedSort={gameQuery.sortOrder}
            onSelectSort={(sort) =>
              setGameQuery((prev) => ({ ...prev, sortOrder: sort, offset: 0 }))
            }
          />
        </div>
      </div>

      {/* Heading */}
      <GameHeading gameQuery={gameQuery} />

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {/* Initial Skeletons */}
        {isLoading &&
          games.length === 0 &&
          distributeHorizontally(initialSkeletons, columnCount).map(
            (column, colIndex) => (
              <div
                key={`init-skeleton-col-${colIndex}`}
                className="flex flex-col gap-5"
              >
                {column.map((key) => (
                  <ImageSkeletonContainer
                    key={`init-skeleton-${colIndex}-${key}`}
                  />
                ))}
              </div>
            )
          )}

        {/* Game Cards + Load More Skeletons */}
        {!error &&
          columns.map((column, colIndex) => (
            <div key={`col-${colIndex}`} className="flex flex-col gap-5">
              {column.map((game, index) => GameCard(index, game))}

              {/* Skeletons for batch being loaded */}
              {loadingSkeletons[colIndex]?.map((_, i) => (
                <ImageSkeletonContainer
                  key={`loading-skeleton-${colIndex}-${i}`}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {columns.length > 0 && !isLoading && !error && (
        <div className="mt-8 flex justify-center">
          <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
        </div>
      )}
    </main>
  );
};

export default GameGrid;
