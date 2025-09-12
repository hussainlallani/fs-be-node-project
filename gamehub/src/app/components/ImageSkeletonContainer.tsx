import React from "react";
import ImageSkeleton from "./ImageSkeleton";

type ImageSkeletonContainerProps = {
  key?: string | number;
};

const ImageSkeletonContainer = ({ key }: ImageSkeletonContainerProps) => {
  return (
    <div
      key={key}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full h-64 flex items-center justify-center"
    >
      <ImageSkeleton />
    </div>
  );
};

export default ImageSkeletonContainer;
