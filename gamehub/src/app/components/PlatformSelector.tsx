import { useState } from "react";
import { Platform } from "../hooks/usePlatforms";
import usePlatforms from "../hooks/usePlatforms";
import { BsChevronDown } from "react-icons/bs";

interface Props {
  onSelectPlatform: (platform: Platform) => void;
  selectedPlatform: Platform | null;
}

const PlatformSelector = ({ onSelectPlatform, selectedPlatform }: Props) => {
  const { data, error } = usePlatforms();
  const [open, setOpen] = useState(false);

  if (error) return null;

  return (
    <>
      <button
        id="dropdownDefaultButton"
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between items-center w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-offset no-underline"
        type="button"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedPlatform?.name || "Platforms"}
        </span>
        <BsChevronDown className="ml-2" />
      </button>

      {open && (
        <div
          id="dropdown"
          className="absolute z-10 mt-2 w-full max-w-xs bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm max-h-60 overflow-y-auto"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {data.map((platform) => (
              <li
                key={platform.id}
                onClick={() => {
                  onSelectPlatform(platform);
                  setOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              >
                {platform.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default PlatformSelector;
