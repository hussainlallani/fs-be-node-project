import { useEffect, useMemo, useRef, useState } from "react";
import SlideIndicators from "../molecules/SlideIndicators";

interface GameCardSlideshowProps {
  artworks: string[];
  hovered: boolean;
}

export default function GameCardSlideshow({
  artworks,
  hovered,
}: GameCardSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const slideCount = artworks.length;

  useEffect(() => {
    if (!hovered || slideCount === 0) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 1500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hovered, slideCount]);

  const slides = useMemo(() => {
    return artworks.map((img) => (
      <div
        key={img}
        className="absolute inset-0 bg-cover bg-center h-48 rounded-t-lg transition-opacity duration-700 ease-in-out"
        style={{ backgroundImage: `url(${img})` }}
      />
    ));
  }, [artworks]);

  return (
    <div className="relative w-full h-48 z-0 rounded-t-lg border-1 border-b-0 border-gray-200 dark:border-gray-700 overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide}
        </div>
      ))}
      {slideCount > 1 && hovered && (
        <SlideIndicators
          count={slideCount}
          currentIndex={currentIndex}
          onClick={setCurrentIndex}
        />
      )}
    </div>
  );
}
