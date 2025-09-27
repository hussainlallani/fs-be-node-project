/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

interface NavBarProps {
  searchText: string;
  onSearch: (text: string) => void;
}

const NavBar = ({ searchText, onSearch }: NavBarProps) => {
  const [searchQuery, setSearchQuery] = useState(searchText);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    onSearch("");
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-50">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <a
          href="/"
          className="hidden sm:flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            alt="GameHub Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            GameHub
          </span>
        </a>

        {/* Right Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse md:order-2 relative gap-2 sm:gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 max-w-[190px] sm:max-w-[300px]">
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
              className="w-full bg-transparent px-2 text-sm text-gray-700 dark:text-white outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 text-gray-500 hover:text-red-500 dark:text-gray-400"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

          {/* Bell Notification */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative sm:flex">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center rounded-full bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <img
                src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                alt="User"
                className="min-w-8 h-8 rounded-full"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 z-50 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    Bonnie Green
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    name@flowbite.com
                  </span>
                </div>
                <ul className="py-2">
                  {["Dashboard", "Settings", "Earnings", "Sign out"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="sm:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {["Home", "About", "Services", "Pricing", "Contact"].map(
              (label, idx) => (
                <li key={label}>
                  <a
                    href="#"
                    className={`block py-2 px-3 rounded-sm text-sm ${
                      idx === 0
                        ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                    aria-current={idx === 0 ? "page" : undefined}
                  >
                    {label}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
