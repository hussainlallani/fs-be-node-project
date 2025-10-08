import { useEffect, useMemo, useRef, useState } from "react";
import SlideIndicators from "../molecules/SlideIndicators";
import ImageFallback from "../atoms/ImageFallback";

interface CardSlideshowProps {
  artworks: string[];
  artworkFallback?: string;
  alt: string;
  hovered: boolean;
}

export default function CardSlideshow({
  artworks,
  artworkFallback,
  alt,
  hovered,
}: CardSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const slideCount = artworks?.length;
  const hasArtworks = slideCount > 0;

  useEffect(() => {
    if (!hovered || !hasArtworks) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 1500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hovered, hasArtworks, slideCount]);

  const slides = useMemo(() => {
    return artworks?.map((img) => (
      <div
        key={img}
        className="absolute inset-0 bg-cover bg-center h-48 rounded-t-lg transition-opacity duration-700 ease-in-out"
        style={{ backgroundImage: `url(${img})` }}
      />
    ));
  }, [artworks]);

  return (
    <div className="relative w-full h-48 z-0 rounded-t-lg border-1 border-b-0 border-gray-200 dark:border-gray-700 overflow-hidden">
      {hasArtworks && hovered ? (
        <>
          {slides?.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide}
            </div>
          ))}
          {slideCount > 1 && (
            <SlideIndicators
              count={slideCount}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          )}
        </>
      ) : (
        <ImageFallback src={artworks[0] ?? artworkFallback} alt={alt} />
      )}
    </div>
  );
}
