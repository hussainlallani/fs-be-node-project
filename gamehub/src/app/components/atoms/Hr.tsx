// components/atoms/Hr.tsx
import React from "react";

interface HrProps {
  className?: string;
}

export default function Hr({ className = "" }: HrProps) {
  return (
    <hr
      className={`h-px bg-gray-200 border-0 dark:bg-gray-700 mx-2 transition-colors duration-300 ease-in-out ${className}`}
    />
  );
}
