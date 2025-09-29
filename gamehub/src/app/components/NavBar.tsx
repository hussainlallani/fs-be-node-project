"use client";

import { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import MobileToggle from "./MobileToggle";
import NavLinks from "./NavLinks";

interface NavBarProps {
  searchText: string;
  onSearch: (text: string) => void;
}

export default function NavBar({ searchText, onSearch }: NavBarProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-950 fixed top-0 left-0 right-0 z-50">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse md:order-2 relative gap-2 sm:gap-4">
          <SearchBar initialValue={searchText} onSearch={onSearch} />
          <ThemeToggle />
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />
          <NotificationBell />
          <UserMenu />
          <MobileToggle
            open={isMobileMenuOpen}
            toggle={() => setMobileMenuOpen((prev) => !prev)}
          />
        </div>

        {/* Navigation Links */}
        <NavLinks open={isMobileMenuOpen} />
      </div>
    </nav>
  );
}
