// components/GameCard.tsx
import Image from "next/image";
import formatNumber from "../lib/format-number";
import { GameGrid as GameType } from "../hooks/useGameGrid";
import ViewMoreButton from "./ViewMoreButton";
import Heading from "./atoms/Heading";
import CardMetaBlock from "./organisms/CardMetaBlock";
import Hr from "./atoms/Hr";

interface GameCardProps {
  index: number;
  game: GameType;
  cardExpanded: boolean;
  setCardExpanded: (value: number | null) => void;
}

export default function GameCard({
  index,
  game,
  cardExpanded,
  setCardExpanded,
}: GameCardProps): React.JSX.Element {
  return (
    <article
      className={`relative break-inside-avoid bg-white dark:bg-gray-900 shadow-md rounded-lg 
    transition-shadow duration-300 cursor-pointer overflow-visible 
    hover:shadow-xl hover:bg-gray-50 hover:dark:bg-gray-950 
    group group-hover:dark:bg-gray-950 
    ${cardExpanded ? "shadow-xl bg-gray-50 dark:bg-gray-950" : ""}`}
    >
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
      <header className="rounded-b-lg">
        <Heading
          level={3}
          className="text-lg font-semibold text-gray-900 dark:text-white p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out"
        >
          {game.name}
        </Heading>
        <Hr />
        <CardMetaBlock
          items={[
            { label: "Genres", value: game.genres.join(", ") },
            { label: "Platforms", value: game.platforms.join(", ") },
            {
              label: "Rating",
              value: `⭐ ${formatNumber(game.total_rating) || "N/A"}`,
            },
            {
              label: "Release",
              value: new Date(game.release_date * 1000).toLocaleDateString(),
            },
          ]}
        />
        <Hr />

        {/* Summary */}
        <div className="relative h-12 md:h-16 md:border-b-1 rounded-b-lg border-b-0 group-hover:border-b-0 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col">
          <div
            className={`text-sm text-gray-600 dark:text-gray-300 
    bg-white dark:bg-gray-900 
    p-3 pb-0 z-10 break-words border-x-1 border-gray-200 dark:border-gray-700 
    transition-all duration-300 ease-in-out 
    absolute left-0 w-full 
    line-clamp-2 group-hover:line-clamp-none 
    group-hover:pb-3 group-hover:bg-gray-50 group-hover:dark:bg-gray-950 
    group-hover:rounded-b-lg group-hover:border-b-0
    ${
      cardExpanded
        ? "line-clamp-none pb-2 bg-gray-50 dark:bg-gray-950 rounded-b-lg border-0"
        : "line-clamp-2 pb-0 bg-white dark dark:bg-gray-900 border-x-1"
    }`}
            title={game.summary || "No summary available."}
          >
            Summary: {game.summary || "No summary available."}
            {/* View more button */}
            <div className="block md:hidden">
              <ViewMoreButton
                index={index}
                cardExpanded={cardExpanded}
                setCardExpanded={setCardExpanded}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="block md:hidden">
        <ViewMoreButton
          index={index}
          cardExpanded={cardExpanded}
          setCardExpanded={setCardExpanded}
        />
      </div>
    </article>
  );
}
