interface SlideIndicatorProps {
  active: boolean;
  onClick: () => void;
  index: number;
}

export default function SlideIndicator({
  active,
  onClick,
  index,
}: SlideIndicatorProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
      className={`h-1 w-8 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-gray-300" : "bg-gray-400"
      }`}
    >
      &nbsp;
    </button>
  );
}
