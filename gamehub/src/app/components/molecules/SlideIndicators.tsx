import { useCallback } from "react";
import SlideIndicator from "../atoms/SlideIndicator";

interface SlideIndicatorsProps {
  count: number;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}

export default function SlideIndicators({
  count,
  currentIndex,
  setCurrentIndex,
}: SlideIndicatorsProps) {
  const handleClick = useCallback(
    (i: number) => {
      setCurrentIndex(i);
    },
    [setCurrentIndex]
  );

  return (
    <div className="absolute bottom-0 left-0 w-full flex justify-center items-center gap-4 p-4 z-20">
      {Array.from({ length: count }).map((_, i) => (
        <SlideIndicator
          key={i}
          index={i}
          active={i === currentIndex}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  );
}
