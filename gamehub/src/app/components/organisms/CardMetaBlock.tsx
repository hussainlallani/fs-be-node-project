// components/organisms/CardMetaBlock.tsx
import React from "react";
import CardMetaRow from "../molecules/CardMetaRow";
import Hr from "../atoms/Hr";

interface MetaItem {
  label: string;
  value?: string | number;
}

interface CardMetaBlockProps {
  items: MetaItem[];
  className?: string;
}

export default function CardMetaBlock({
  items,
  className = "",
}: CardMetaBlockProps) {
  return (
    <div
      className={`border-x-0.5 border-gray-200 dark:border-gray-700 ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <Hr />}
          <CardMetaRow label={item.label} value={item.value} />
        </React.Fragment>
      ))}
    </div>
  );
}
