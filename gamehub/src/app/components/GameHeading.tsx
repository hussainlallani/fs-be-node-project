import React from "react";
import { GameQuery } from "../page";

interface Props {
  gameQuery: GameQuery;
}

const GameHeading = ({ gameQuery }: Props) => {
  const { platform, genre } = gameQuery;

  return (
    <div className="my-5 text-left  space-y-2">
      {platform?.name && (
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {platform.name}
        </div>
      )}

      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
        Games
      </h1>

      {genre?.name && (
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {genre.name}
        </div>
      )}

      {!platform?.name && !genre?.name && (
        <div className="text-xl font-medium text-gray-600 dark:text-gray-400">
          All Games
        </div>
      )}
    </div>
  );
};

export default GameHeading;
