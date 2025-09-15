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
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {selectedPlatform?.name || "Platforms"}
        <BsChevronDown className="ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-48 max-h-60 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="py-1">
            {data.map((platform) => (
              <li
                key={platform.id}
                onClick={() => {
                  onSelectPlatform(platform);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {platform.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;
