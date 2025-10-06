"use client";

interface ViewMoreButtonProps {
  index: number;
  cardExpanded: boolean;
  setCardExpanded: (index: number | null) => void;
  className: string;
}

export default function ViewMoreButton({
  index,
  cardExpanded,
  setCardExpanded,
  className,
}: ViewMoreButtonProps) {
  return (
    <div
      className={`w-full flex items-center justify-center text-sm text-blue-500 dark:text-blue-400 
        border-1 border-t-0 border-gray-200 dark:border-gray-700 
        transition-colors duration-300 ease-in-out rounded-b-lg border-none 
        ${
          cardExpanded
            ? "bg-gray-50 dark:bg-gray-950"
            : "bg-white dark:bg-gray-900"
        } 
        group-hover:border-0 ${className}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ Prevents bubbling to card
          setCardExpanded(cardExpanded ? null : index); // ✅ Toggle logic
        }}
        className="cursor-pointer focus:outline-none pointer-events-auto"
      >
        {cardExpanded ? "View less" : "View more"}
      </button>
    </div>
  );
}
