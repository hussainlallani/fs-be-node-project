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
  summary: string;
  videos: { name: string; video_id: string }[] | null;
}

const useGamesGrid = (gameQuery: GameQuery) => {
  return useData<GameGrid>(
    `/api/grid`,
    {
      params: {
        genreId: gameQuery.genre?.id,
        platformId: gameQuery.platform?.id,
        search: gameQuery.searchText,
        sortField: gameQuery.sortOrder.field,
        sortDirection: gameQuery.sortOrder.direction,
        limit: gameQuery.limit,
        offset: gameQuery.offset,
      },
    },
    [gameQuery]
  );
};

export default useGamesGrid;
