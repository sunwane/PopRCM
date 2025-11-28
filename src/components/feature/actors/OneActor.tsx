import { useState } from "react";
import { Actor } from "@/types/Actor";

export interface OneActorProps {
  actor: Actor;
}

export default function OneActor({ actor }: OneActorProps) {
  const [imageError, setImageError] = useState(false);

  const goToDetails = () => {
    window.location.href = `/actors/${actor.id}`;
  }

  return (
    <div 
      className="relative lg:w-40 lg:h-48 md:w-40 md:h-48 sm:w-[28vw] sm:h-[28vw] w-[40vw] h-[40vw] 
                cursor-pointer flex flex-col items-center hover:scale-105 transition"
      onClick={goToDetails}>
      <div className="relative w-full h-full">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-sm">
            <span className="text-[16px] text-gray-500">No Avatar</span>
          </div>
        ) : (
          <img
            src={actor.profilePath}
            alt={actor.originName}
            className="w-full h-full object-cover rounded-sm"
            onError={() => setImageError(true)}
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-black to-transparent rounded-b-sm"></div>
      </div>
      {/* Actor name */}
      <span className="absolute bottom-2 truncate line-clamp-1 transform text-sm font-medium text-white z-10">
        {actor.originName}
      </span>
    </div>
  );
}