import React from "react";

interface Props {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

const LoadMoreButton = ({ onClick, loading, disabled }: Props) => {
  return (
    <div className="flex justify-center my-6">
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default LoadMoreButton;
