import { MovieActor } from "./Actor";
import { Country } from "./Country";
import { Genre } from "./Genres";

export interface Episode {
    id: number;
    title: string;
    episodeNumber: number;
    createdAt: Date;
    videoUrl: string;
    m3u8Url?: string;
    serverName: string; // e.g., "Vietsub", "ThuyetMinh"
}

export interface Movie {
    id: number;
    title: string;
    originalName: string;
    description: string;
    releaseYear: number;
    type: string; // e.g., "single", "series", 'hoathinh'
    duration: string; // e.g., "120 min", "45 min/ep"
    posterUrl?: string;
    thumbnailUrl?: string;
    trailerUrl?: string;
    totalEpisodes?: number;
    //rating: number;
    director: string;
    status: string; // e.g., "Ongoing", "Completed", "Hiatus"
    createdAt: Date;
    modifiedAt: Date;
    view: number;
    slug: string;
    tmdbScore?: number;
    imdbScore?: number;
    lang: string; // vietsub, thuyet minh, etc.
    country: Country[];
    actors: MovieActor[];
    genres: Genre[];
    episodes?: Episode[];
}