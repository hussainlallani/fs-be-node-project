// components/molecules/SummaryCard.tsx
import React from "react";
import TextClamp from "./atoms/TextClamp";
import ViewMoreButton from "./ViewMoreButton";

interface SummaryCardProps {
  summary?: string;
  expanded: boolean;
  index: number;
  setCardExpanded: (index: number | null) => void;
}

export default function SummaryCard({
  summary,
  expanded,
  index,
  setCardExpanded,
}: SummaryCardProps) {
  return (
    <div className="relative h-12 md:h-16 md:border-b border-b-0 rounded-b-lg group-hover:border-b-0 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col">
      <div
        className={`absolute left-0 w-full z-10 p-3 pb-0 bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 group-hover:pb-3 group-hover:bg-gray-50 group-hover:dark:bg-gray-950 group-hover:rounded-b-lg group-hover:border-b-0`}
        title={summary || "No summary available."}
      >
        <TextClamp expanded={expanded}>
          Summary: {summary || "No summary available."}
        </TextClamp>

        {/* Mobile-only button */}
        <div className="block md:hidden">
          <ViewMoreButton
            index={index}
            cardExpanded={expanded}
            setCardExpanded={setCardExpanded}
          />
        </div>
      </div>
    </div>
  );
}
