import React from "react";
import useGenres, { Genre } from "../hooks/useGenres";
import getCroppedImageUrl from "../services/image-url";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

const GenreList = ({ selectedGenre, onSelectGenre }: Props) => {
  const { data, isLoading, error } = useGenres();

  if (error) return null;

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );

  return (
    <div className="mt-9 mb-3">
      <h2 className="text-2xl font-semibold text-white mb-4">Genres</h2>
      <ul className="space-y-3">
        {data.map((genre) => (
          <li key={genre.id} className="flex items-center space-x-3">
            <img
              src={
                typeof getCroppedImageUrl(genre.image_background) === "string"
                  ? getCroppedImageUrl(genre.image_background)
                  : (getCroppedImageUrl(genre.image_background) as any).src
              }
              className="w-8 h-8 rounded object-cover"
            />
            <button
              onClick={() => onSelectGenre(genre)}
              className={`text-left text-md ${
                genre.id === selectedGenre?.id
                  ? "font-bold text-white"
                  : "font-normal text-gray-300"
              } hover:text-white transition-colors`}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
