import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

export const metadata: Metadata = {
  title: "GameHub - Your Ultimate Game Database",
  description: "Explore a vast collection of games and their details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <SideBar />
        {children}
      </body>
    </html>
  );
}
