import { MovieActor } from "./Actor";
import { Country } from "./Country";
import { Genre } from "./Genres";

export interface Episode {
    id: string;
    title: string;
    episodeNumber: number;
    createdAt: Date;
    videoUrl: string;
    m3u8Url?: string;
    serverName: string; // e.g., "Vietsub", "ThuyetMinh"
    movieId: string;
}

export interface Movie {
    id: string;
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
    currentEpisode?: number;
    //rating: number;
    director: string;
    status: string; // e.g., "Ongoing", "Completed", "Hiatus"
    createdAt: Date;
    modifiedAt: Date;
    view: number;
    slug: string;
    tmdbScore?: number;
    imdbScore?: number;
    PopRating?: number;
    lang: string; // vietsub, thuyet minh, etc.
    country: Country[];
    actors: MovieActor[];
    genres: Genre[];
    episodes?: Episode[];
    seasonNumber?: number; // For series movies
}

// Type for AI semantic search results
export interface SimilarMovie {
    id: number;
    title: string;
    description: string;
    genre: string[];
    releaseYear: number;
    rating: number;
    posterUrl?: string;
    similarity: number; // Similarity score from AI
}

// Type for AI search response
export interface AISearchResponse {
    status: 'success' | 'error';
    query: string;
    movies: SimilarMovie[];
    count: number;
    message: string;
}