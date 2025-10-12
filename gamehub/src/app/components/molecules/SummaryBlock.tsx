import ViewMoreButton from "../ViewMoreButton";

interface SummaryBlockProps {
  summary?: string;
  index: number;
  cardExpanded: boolean;
  setCardExpanded: (value: number | null) => void;
}

export default function SummaryBlock({
  summary,
  index,
  cardExpanded,
  setCardExpanded,
}: SummaryBlockProps) {
  const summaryLength = summary?.length ?? 0;
  const isLongSummary = summaryLength > 21;

  return (
    <div className="relative h-10 md:h-14 md:mb-2  transition-all duration-300 ease-in-out flex flex-col z-50">
      <div
        className={`text-md text-gray-600 dark:text-gray-300 ${
          cardExpanded
            ? "bg-gray-50 dark:bg-gray-950 break-all px-3 py-2 z-50 rounded-b-lg border-1 border-t-0 border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-900 break-all line-clamp-2 border-x border-gray-200 dark:border-gray-700 px-3 py-2 min-h-14 z-50"
        } ${isLongSummary ? "" : "rounded-b-lg border-b-0"} `}
        title={summary || "No summary available."}
      >
        Summary: {summary || "No summary available."}
        {summaryLength > 160 && (
          <div className="block pt-1 md:hidden">
            <ViewMoreButton
              index={index}
              cardExpanded={cardExpanded}
              setCardExpanded={setCardExpanded}
              className=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
