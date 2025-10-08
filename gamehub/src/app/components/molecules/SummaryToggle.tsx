import ViewMoreButton from "../ViewMoreButton";

interface SummaryBlockProps {
  summary?: string;
  index: number;
  cardExpanded: boolean;
  setCardExpanded: (value: number | null) => void;
}

export default function SummaryToggle({
  index,
  cardExpanded,
  setCardExpanded,
}: SummaryBlockProps) {
  return (
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
  );
}
