import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar"; // client wrapper
import SideBar from "./components/SideBar"; // client wrapper

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
        <NavBar />
        <SideBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
