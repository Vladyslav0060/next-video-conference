import Image from "next/image";
import React from "react";

const Loader = ({ width, height }: { width?: number; height?: number }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading..."
        width={width || 50}
        height={height || 50}
      />
    </div>
  );
};

export default Loader;
