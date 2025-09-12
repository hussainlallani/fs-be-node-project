import React from "react";
import { GameQuery } from "../page";

interface Props {
  gameQuery: GameQuery;
}

const GameHeading = ({ gameQuery }: Props) => {
  const heading = `${gameQuery.platform?.name || ""} ${
    gameQuery.genre?.name || ""
  } Games`;

  return (
    <h1 className="text-5xl font-bold my-5 text-gray-900 dark:text-white">
      {heading.trim() || "All Games"}
    </h1>
  );
};

export default GameHeading;
