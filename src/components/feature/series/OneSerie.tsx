import { useState } from "react";
import { Series } from "@/types/Series";

export interface OneSerieProps {
  serie: Series;
}

export default function OneSerie({ serie }: OneSerieProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-40 h-48 flex flex-col items-center">
      <div className="relative w-full h-full">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-sm">
            <span className="text-[16px] text-gray-500">No Avatar</span>
          </div>
        ) : (
          <img
            src={serie.posterUrl}
            alt={serie.name}
            className="w-full h-full object-cover rounded-sm"
            onError={() => setImageError(true)}
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent rounded-b-sm"></div>
      </div>
      {/* Serie name */}
      <span className="absolute bottom-2 truncate line-clamp-1 transform text-sm font-medium text-white z-10">
        {serie.name}
      </span>
    </div>
  );
}