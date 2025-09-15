"use client";
import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";

interface SearchBarProps {
  searchText: string;
  onSearch: (text: string) => void;
}

const NavBar = ({ searchText, onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(searchText);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        onSearch(text.trim());
      }, 500);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch(""); // Immediate clear
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between mx-auto w-full gap-4">
          {/* Logo Section */}
          <a href="/gamehub" className="flex items-center gap-2 shrink-0">
            <Image
              src="https://flowbite.s3.amazonaws.com/logo.svg"
              alt="GameHub Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              GameHub
            </span>
          </a>

          {/* Search Bar Section */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 flex-grow max-w-[300px]">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              />
            </svg>
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={handleChange}
              placeholder="Search games..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-white px-2 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 px-2"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
