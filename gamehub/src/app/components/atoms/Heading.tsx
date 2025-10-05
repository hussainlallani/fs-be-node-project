// components/atoms/Heading.tsx
import React, { JSX } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "danger";
}

const levelToSize: Record<number, string> = {
  1: "text-5xl",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-xl",
  6: "text-lg",
};

const colorMap: Record<string, string> = {
  default: "text-gray-900 dark:text-white",
  muted: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-600 dark:text-blue-400",
  danger: "text-red-600 dark:text-red-400",
};

export default function Heading({
  level = 3,
  children,
  className = "",
  align = "left",
  weight = "semibold",
  color = "default",
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClass = levelToSize[level];
  const colorClass = colorMap[color];
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  return (
    <Tag
      className={`${sizeClass} font-${weight} ${colorClass} ${alignClass} ${className} transition-colors duration-300 ease-in-out`}
    >
      {children}
    </Tag>
  );
}
