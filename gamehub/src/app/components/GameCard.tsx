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
      className={`relative break-inside-avoid shadow-md rounded-lg 
    transition-all duration-300 ease-in-out cursor-pointer overflow-visible`}
    >
      <div className="w-full h-48 z-0">
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
      <header
        onMouseEnter={() => {
          setCardExpanded(index);
        }}
        onMouseLeave={() => setCardExpanded(index)}
        className={`rounded-b-lg border-b-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out
    ${
      cardExpanded
        ? "bg-gray-50 dark:bg-gray-950"
        : "bg-white dark:bg-gray-900 "
    }
    `}
      >
        <Heading
          level={5}
          className="font-semibold text-gray-900 dark:text-white p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out "
        >
          {game.name}: {index}
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
        <div
          className={`relative h-12 md:h-16 md:mb-2 border-x border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col z-50`}
        >
          <div
            className={`text-md text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 ${
              cardExpanded
                ? "bg-gray-50 dark:bg-gray-950 break-all p-3 z-50 transition-all duration-300 ease-in-out"
                : "bg-white dark:bg-gray-900 break-all line-clamp-2 p-3 min-h-14 z-50 transition-all duration-300 ease-in-out"
            } `}
            title={game.summary || "No summary available."}
          >
            Summary: {game.summary || "No summary available."}
            {/* View more button */}
            <div className="block pt-1 md:hidden">
              <ViewMoreButton
                index={index}
                cardExpanded={cardExpanded}
                setCardExpanded={setCardExpanded}
                className=""
              />
            </div>
          </div>
        </div>
      </header>
      <div
        className={`block pt-4 pb-2 rounded-b-lg border-1 border-gray-200 dark:border-gray-700 md:hidden ${
          cardExpanded
            ? "bg-gray-50 dark:bg-gray-950"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <ViewMoreButton
          index={index}
          cardExpanded={cardExpanded}
          setCardExpanded={setCardExpanded}
          className=""
        />
      </div>
    </article>
  );
}
