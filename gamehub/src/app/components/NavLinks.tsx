interface Props {
  open: boolean;
}

export default function NavLinks({ open }: Props) {
  const links = ["Home", "About", "Services", "Pricing", "Contact"];

  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } items-center justify-between w-full md:flex md:w-auto md:order-1`}
    >
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-950 md:dark:bg-gray-950 dark:border-gray-700">
        {links.map((label, idx) => (
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
        ))}
      </ul>
    </div>
  );
}
