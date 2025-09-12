import React from "react";
import ImageSkeleton from "./ImageSkeleton";
import TextSkeleton from "./TextSkeleton";

type ImageSkeletonContainerProps = {
  key?: string | number;
};

const ImageSkeletonContainer = ({ key }: ImageSkeletonContainerProps) => {
  return (
    <div
      key={key}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full flex flex-col gap-5 p-5 items-left justify-center"
    >
      <ImageSkeleton />
      <TextSkeleton />
    </div>
  );
};

export default ImageSkeletonContainer;
