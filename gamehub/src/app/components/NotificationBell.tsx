/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400 cursor-pointer"
        aria-expanded={open}
        aria-label="Toggle notifications"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 14 18">
          <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
        </svg>
        <div className="absolute w-6 h-6 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900 text-white flex items-center justify-center text-xs font-semibold">
          9
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute w-80 -right-25 mt-2 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:divide-gray-700">
          <div className="px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            Notifications
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[400px] overflow-y-auto ">
            {/* Notification items */}
            {[1, 2, 3, 4, 5].map((id) => (
              <a
                key={id}
                href="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="shrink-0 relative">
                  <Image
                    className="rounded-full w-11 h-11"
                    src={`https://flowbite.com/docs/images/people/profile-picture-${id}.jpg`}
                    alt={`User ${id}`}
                    width={44}
                    height={44}
                  />
                  <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                      <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                    New message from{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      User {id}
                    </span>
                    Hey, just checking in!
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">
                    a few moments ago
                  </div>
                </div>
              </a>
            ))}
          </div>

          <a
            href="#"
            className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          >
            <div className="inline-flex items-center justify-center">
              <svg
                className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              View all
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
