// components/GameCard.tsx
import Image from "next/image";

export default function GameCard({ game }) {
  return (
    <div className="relative group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-visible transition-all duration-300 ease-in-out transform origin-top hover:scale-y-105 hover:z-10">
      <div className="relative w-full h-48">
        <Image
          src={game.artwork}
          alt={game.name}
          className="w-full h-48 object-cover rounded-t-lg"
          width={400}
          height={192}
        />
      </div>
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
          Rating: ⭐ {game.total_rating || "N/A"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Release: {new Date(game.release_date * 1000).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 transition-all duration-200 ease-in-out group-hover:line-clamp-none group-hover:whitespace-normal">
          Summary: {game.summary || "No summary available."}
        </p>
      </div>
    </div>
  );
}
