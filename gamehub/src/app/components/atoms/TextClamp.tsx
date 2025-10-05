// components/atoms/TextClamp.tsx
import React from "react";

interface TextClampProps {
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
}

export default function TextClamp({
  children,
  expanded,
  className = "",
}: TextClampProps) {
  return (
    <p
      className={`text-sm text-gray-600 dark:text-gray-300 break-words transition-all duration-300 ease-in-out ${
        expanded
          ? "line-clamp-none pb-2 bg-gray-50 dark:bg-gray-950 rounded-b-lg border-0"
          : "line-clamp-2"
      } ${className}`}
    >
      {children}
    </p>
  );
}
