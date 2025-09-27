// components/GameCard.tsx
import Image from "next/image";
import formatNumber from "../lib/format-number";
import { GameGrid as GameType } from "../hooks/useGameGrid";

export default function GameCard(
  index: number,
  game: GameType
): React.JSX.Element {
  return (
    <div
      key={index}
      className="break-inside-avoid bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group  hover:dark:bg-gray-950 hover:bg-gray-50 cursor-pointer"
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
          Release: {new Date(game.release_date * 1000).toLocaleDateString()}
        </p>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <p
          className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 transition-all duration-200 ease-in-out group-hover:line-clamp-none group-hover:whitespace-normal"
          title={game.summary || "No summary available."}
        >
          Summary: {game.summary || "No summary available."}
        </p>
      </div>
    </div>
  );
}
