// components/GameCard.tsx
import Image from "next/image";
import formatNumber from "../lib/format-number";
import { GameGrid as GameType } from "../hooks/useGameGrid";

export default function GameCard(
  index: number,
  game: GameType
): React.JSX.Element {
  return (
    <div className="relative break-inside-avoid bg-white dark:bg-gray-900 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 group hover:dark:bg-gray-950 group-hover:dark:bg-gray-950 hover:bg-gray-50 cursor-pointer overflow-visible">
      <div className="w-full h-48">
        <Image
          src={
            game.artwork ??
            "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
          }
          alt={game.name}
          className="w-full h-48 object-cover rounded-t-lg border-1 border-b-0 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out"
          width={400}
          height={192}
        />
      </div>
      <div className="rounded-b-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          {game.name}
        </h3>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out" />
        <p className="text-sm text-gray-600 dark:text-gray-300 p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          Genres: {game.genres.join(", ")}
        </p>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out" />
        <p className="text-sm text-gray-600 dark:text-gray-300 p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          Platforms: {game.platforms.join(", ")}
        </p>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out" />
        <p className="text-sm text-gray-600 dark:text-gray-300 p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          Rating: ⭐ {formatNumber(game.total_rating) || "N/A"}
        </p>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out" />
        <p className="text-sm text-gray-600 dark:text-gray-300 p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          Release: {new Date(game.release_date * 1000).toLocaleDateString()}
        </p>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out" />

        {/* Summary */}
        <div className="relative h-16 rounded-b-lg border-b-1 group-hover:border-b-0 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col">
          <div
            className="text-sm text-gray-600 dark:text-gray-300 group-hover:line-clamp-none absolute left-0 w-full bg-white dark:bg-gray-900 group-hover:bg-gray-50 group-hover:dark:bg-gray-950 p-3 pb-0 mb-3 group-hover:pb-3 group-hover:m-0 z-10 border-x-1 border-gray-200 dark:border-gray-700 line-clamp-2 group-hover:rounded-b-lg group-hover:border-b-0 transition-all duration-300 ease-in-out"
            title={game.summary || "No summary available."}
          >
            Summary: {game.summary || "No summary available."}
          </div>
        </div>
      </div>
    </div>
  );
}
