// components/atoms/Text.tsx
import React from "react";

interface TextProps {
  children: React.ReactNode;
  as?: "p" | "span" | "div";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  color?: string; // Tailwind color class like "text-gray-600"
  align?: "left" | "center" | "right" | "justify";
  tracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  leading?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  decoration?: "underline" | "line-through" | "no-underline";
  transform?: "uppercase" | "lowercase" | "capitalize";
  italic?: boolean;
  whitespace?: "normal" | "nowrap" | "pre-line";
  className?: string;
}

export default function Text({
  children,
  as = "p",
  size = "base",
  weight = "normal",
  color = "text-gray-600 dark:text-gray-300",
  align = "left",
  tracking = "normal",
  leading = "normal",
  decoration,
  transform,
  italic = false,
  whitespace = "normal",
  className = "",
}: TextProps) {
  const Tag = as;

  const classes = [
    `text-${size}`,
    `font-${weight}`,
    color,
    `text-${align}`,
    `tracking-${tracking}`,
    `leading-${leading}`,
    decoration,
    transform,
    italic ? "italic" : "",
    `whitespace-${whitespace}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
