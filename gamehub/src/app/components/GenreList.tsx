/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import useGenres, { Genre } from "../hooks/useGenres";
import getCroppedImageUrl from "../services/image-url";
import ListSkeletonContainer from "./ListSkeletonContainer";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

const GenreList = ({ selectedGenre, onSelectGenre }: Props) => {
  const { data, isLoading, error } = useGenres();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  if (error) return null;

  return (
    <div className="mt-9 mb-3">
      <h2 className="text-2xl font-semibold text-white mb-4">Genres</h2>
      <ul className="space-y-3">
        {isLoading &&
          skeletons.map((key) => (
            <div key={key}>
              <ListSkeletonContainer />
            </div>
          ))}
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
