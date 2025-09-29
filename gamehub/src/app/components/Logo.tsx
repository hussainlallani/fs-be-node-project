import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
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
      <span className="text-2xl font-semibold whitespace-nowrap text-gray-600 dark:text-gray-300">
        GameHub
      </span>
    </Link>
  );
}
