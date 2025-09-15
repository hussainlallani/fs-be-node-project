import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";

export type SortField = "total_rating" | "name" | "first_release_date";
export type SortDirection = "desc" | "asc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

interface Props {
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const SortSelector = ({ selectedSort, onSelectSort }: Props) => {
  const [open, setOpen] = useState(false);

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Name ↑", value: { field: "name", direction: "asc" } },
    { label: "Name ↓", value: { field: "name", direction: "desc" } },
    {
      label: "Release Date ↑",
      value: { field: "first_release_date", direction: "asc" },
    },
    {
      label: "Release Date ↓",
      value: { field: "first_release_date", direction: "desc" },
    },
    {
      label: "Total Rating ↑",
      value: { field: "total_rating", direction: "asc" },
    },
    {
      label: "Total Rating ↓",
      value: { field: "total_rating", direction: "desc" },
    },
  ];

  const getLabel = () => {
    const match = sortOptions.find(
      (opt) =>
        opt.value.field === selectedSort.field &&
        opt.value.direction === selectedSort.direction
    );
    return match?.label || "Sort By";
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {getLabel()}
        <BsChevronDown className="ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-52 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {sortOptions.map(({ label, value }) => (
              <li
                key={`${value.field}-${value.direction}`}
                onClick={() => {
                  onSelectSort(value);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortSelector;
