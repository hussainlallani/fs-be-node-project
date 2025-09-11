import axios from "axios";
import { set } from "mongoose";
import React, { useEffect } from "react";

const MainBody = () => {
  const [gridData, setGridData] = React.useState<any[]>([]);

  useEffect(() => {
    // Placeholder for future data fetching logic
    axios
      .get("http://127.0.0.1:3000/api/grid")
      .then((response) => {
        console.log("Grid Data:", response.data);
        setGridData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching grid data:", error);
      });
  }, []);

  return (
    <main className="p-4 md:ml-64 h-auto pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {gridData.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={game.artwork}
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {game.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Genres: {game.genres.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Platforms: {game.platforms.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Rating: ⭐ {game.total_rating}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Release:{" "}
                {new Date(game.release_date * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {/* <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64" />
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" />
        <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64" /> */}
      </div>
      {/* <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" />
      <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4" /> */}
    </main>
  );
};

export default MainBody;
