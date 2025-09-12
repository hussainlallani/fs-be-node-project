// import type { Metadata } from "next";
// import "./globals.css";
// import NavBar from "./components/NavBar";
// import SideBar from "./components/SideBar";
// import { Genre } from "./hooks/useGenres";
// import { Platform } from "./hooks/usePlatforms";
// import { useState } from "react";

// export const metadata: Metadata = {
//   title: "GameHub - Your Ultimate Game Database",
//   description: "Explore a vast collection of games and their details.",
// };

// export interface GameQuery {
//   genre: Genre | null;
//   platform: Platform | null;
//   sortOrder: string;
//   searchText: string;
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [gameQuery, setGameQuery] = useState<GameQuery>({} as GameQuery);
//   return (
//     <html>
//       <body className="antialiased bg-gray-50 dark:bg-gray-900">
//         <NavBar />
//         <SideBar
//           selectedGenre={gameQuery.genre}
//           onSelectGenre={(genre) => setGameQuery({ ...gameQuery, genre })}
//         />
//         {children}
//       </body>
//     </html>
//   );
// }

// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBarWrapper from "./components/NavBarWrapper"; // client wrapper
import SideBarWrapper from "./components/SideBarWrapper"; // client wrapper

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
        <NavBarWrapper />
        <SideBarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
// Note: The NavBarWrapper and SideBarWrapper components handle the client-side state and logic.
