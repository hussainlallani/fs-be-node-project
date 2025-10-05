"use client";

interface ViewMoreButtonProps {
  index: number;
  cardExpanded: boolean;
  setCardExpanded: (value: number | null) => void;
}

export default function ViewMoreButton({
  index,
  cardExpanded,
  setCardExpanded,
}: ViewMoreButtonProps) {
  return (
    <div
      className={`w-full flex items-center justify-center p-3 text-sm text-blue-500 dark:text-blue-400 
        border-1 border-t-0 border-gray-200 dark:border-gray-700 
        transition-colors duration-300 ease-in-out rounded-b-lg 
        ${cardExpanded ? "border-none" : ""} 
        group-hover:border-0`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ Prevents bubbling to card
          setCardExpanded(cardExpanded ? null : index); // ✅ Toggle logic
        }}
        className="cursor-pointer focus:outline-none"
      >
        {cardExpanded ? "View less" : "View more"}
      </button>
    </div>
  );
}
