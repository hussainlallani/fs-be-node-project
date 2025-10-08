import formatNumber from "../lib/format-number";
import { GameGrid as GameType } from "../hooks/useGameGrid";
import Heading from "./atoms/Heading";
import CardMetaBlock from "./organisms/CardMetaBlock";
import Hr from "./atoms/Hr";
import { useEffect, useMemo, useRef, useState } from "react";
import SummaryToggle from "./molecules/SummaryToggle";
import SummaryBlock from "./molecules/SummaryBlock";
import CardSlideshow from "./organisms/CardSlideshow";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = useMemo(() => game.artworks?.length ?? 0, [game.artworks]);
  const hasArtworks = slideCount > 0;

  const summaryLength = game.summary?.length ?? 0;
  const isLongSummary = summaryLength > 21;

  useEffect(() => {
    if (!hovered || !hasArtworks) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 1500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hovered, hasArtworks, slideCount]);

  // const handleSlideClick = useCallback((i: number) => {
  //   setCurrentIndex(i);
  // }, []);

  // const slideElements = useMemo(() => {
  //   return game.artworks?.map((img) => (
  //     <div
  //       key={img}
  //       className="absolute inset-0 bg-cover bg-center h-48 rounded-t-lg transition-opacity duration-700 ease-in-out"
  //       style={{ backgroundImage: `url(${img})` }}
  //     />
  //   ));
  // }, [game.artworks]);

  // const slideIndicators = useMemo(() => {
  //   return game.artworks?.map((_, i) => (
  //     <button
  //       key={i}
  //       onClick={() => handleSlideClick(i)}
  //       className={`h-1 w-8 rounded-lg cursor-pointer transition-colors ${
  //         i === currentIndex ? "bg-gray-300" : "bg-gray-400"
  //       }`}
  //       aria-label={`Go to slide ${i + 1}`}
  //     >
  //       &nbsp;
  //     </button>
  //   ));
  // }, [game.artworks, currentIndex, handleSlideClick]);

  return (
    <article
      className="relative break-inside-avoid shadow-md rounded-lg transition-all duration-300 ease-in-out cursor-pointer overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentIndex(0);
      }}
    >
      <header
        onMouseEnter={() => setCardExpanded(index)}
        onMouseLeave={() => setCardExpanded(null)}
        className={`rounded-b-lg border-b-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out ${
          cardExpanded
            ? "bg-gray-50 dark:bg-gray-950"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <CardSlideshow
          artworks={Array.isArray(game.artworks) ? game.artworks : []}
          artworkFallback={game.artwork}
          alt={game.name}
          hovered={hovered}
        />

        <Heading
          level={5}
          className="font-semibold text-gray-900 dark:text-white py-2 px-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out"
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

        <SummaryBlock
          index={index}
          summary={game?.summary}
          cardExpanded={cardExpanded}
          setCardExpanded={setCardExpanded}
        />
        {isLongSummary && (
          <SummaryToggle
            index={index}
            cardExpanded={cardExpanded}
            setCardExpanded={setCardExpanded}
          />
        )}
      </header>
    </article>
  );
}
