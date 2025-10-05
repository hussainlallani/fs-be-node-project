// components/molecules/CardMetaRow.tsx
import React from "react";
import Text from "../atoms/Text";

interface CardMetaRowProps {
  label?: string;
  value?: string | number;
  fallback?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function CardMetaRow({
  label,
  value,
  fallback = "N/A",
  children,
  className = "",
}: CardMetaRowProps) {
  const content = children ?? value ?? fallback;

  return (
    <Text
      size="sm"
      color="text-gray-600 dark:text-gray-300"
      className={`p-3 border-x-1 border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out ${className}`}
    >
      {label ? `${label}: ` : ""}
      {content}
    </Text>
  );
}
