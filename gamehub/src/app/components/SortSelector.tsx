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
    <>
      <button
        id="dropdownDefaultButton"
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between items-center w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-offset no-underline"
        type="button"
      >
        <span>{getLabel()}</span>
        <BsChevronDown className="ml-2" />
      </button>

      {open && (
        <div
          id="dropdown"
          className="absolute z-10 mt-2 max-w-xs bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm max-h-60 overflow-y-auto"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {sortOptions.map(({ label, value }) => (
              <li
                key={`${value.field}-${value.direction}`}
                onClick={() => {
                  onSelectSort(value);
                  setOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default SortSelector;
