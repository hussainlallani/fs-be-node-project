import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameHub - Your Ultimate Game Database",
  description: "Explore a vast collection of games and their details.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
