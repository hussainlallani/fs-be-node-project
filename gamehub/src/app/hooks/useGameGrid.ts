import useData from "./useData";

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

const useGamesGrid = () => useData<GameGrid>("/api/grid");

export default useGamesGrid;
