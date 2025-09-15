import { GameQuery } from "../page";
import useData from "./useData";
// import { Genre } from "./useGenres";

export interface GameGrid {
  id: number;
  name: string;
  artwork: string;
  genres: string[];
  platforms: string[];
  release_date: number;
  total_rating: number;
  total_rating_count: number;
}

const useGamesGrid = (gameQuery: GameQuery) => {
  return useData<GameGrid>(
    `/api/grid`,
    {
      params: {
        genreId: gameQuery.genre?.id,
        platformId: gameQuery.platform?.id,
        // ordering: gameQuery.sortOrder,
        // search: gameQuery.searchText,
      },
    },
    [gameQuery]
  );
};

export default useGamesGrid;
