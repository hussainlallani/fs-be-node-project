import React from "react";
import ImageSkeleton from "./ImageSkeleton";
import TextSkeleton from "./TextSkeleton";

type ImageSkeletonContainerProps = {
  key?: string | number;
};

const ListSkeletonContainer = ({ key }: ImageSkeletonContainerProps) => {
  return (
    <div
      key={key}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full flex flex-row gap-5 p-0 items-left justify-center"
    >
      <div className="w-10 h-10">
        <ImageSkeleton />
      </div>
      <div className="w-40 h-10">
        <TextSkeleton />
      </div>
    </div>
  );
};

export default ListSkeletonContainer;
