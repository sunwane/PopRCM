import { useState } from "react";
import { Series } from "@/types/Series";

export interface OneSerieProps {
  serie: Series;
}

export default function OneSerie({ serie }: OneSerieProps) {  
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative bg-(--surface) lg:max-w-55 md:max-w-55 sm:max-w-[28vw] max-w-[40vw] 
    aspect-10/7 rounded-md mb-2 border-2 border-(--border-blue) transition
    shadow-[3px_3px_6px_var(--shadow-red)] overflow-hidden hover:-translate-y-3 w-full"
    onClick={() => {
      window.location.href = `/allSeries/${serie.id}`;
    }}>
      {/* Container cho ảnh, overlay và chữ */}
      <div className="relative w-full h-[80%] overflow-hidden rounded-t-md">
        <img 
          src={imageError || !serie.posterUrl ? "/placeholder/placeholder-thumbnail.jpg" : serie.posterUrl}
          onError={() => setImageError(true)} 
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-md" />
        {/* Overlay nằm trên ảnh */}
        <div className="absolute top-0 left-0 w-full h-full rounded-t-md 
        bg-linear-to-b from-transparent to-(--surface) pointer-events-none"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-2.5 text-white">
          <h2 className="lg:text-sm md:text-sm text-xs font-semibold line-clamp-1 mb-0.5">
            {serie.name}
          </h2>
          <p className="lg:text-xs md:text-xs text-[11px] font-semibold text-(--text-secondary) mb-2">
            {serie.movieCount ?? 0} phim
          </p>
        </div>
    </div>
  );
}