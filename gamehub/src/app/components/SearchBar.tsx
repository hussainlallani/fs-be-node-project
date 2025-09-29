import { useState, useCallback, useRef } from "react";

interface Props {
  initialValue: string;
  onSearch: (text: string) => void;
}

export default function SearchBar({ initialValue, onSearch }: Props) {
  const [query, setQuery] = useState(initialValue);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(text.trim()), 500);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full px-3 py-1 max-w-[190px] sm:max-w-[300px]">
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
        value={query}
        onChange={handleChange}
        placeholder="Search games..."
        className="w-full bg-transparent px-2 text-sm text-gray-700 dark:text-white outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="px-2 text-gray-500 hover:text-red-500 dark:text-gray-400"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
