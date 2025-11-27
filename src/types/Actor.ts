import { Movie } from "./Movies";

export interface Actor {
    id: string;
    tmdbId?: string;
    originName: string;
    profilePath?: string;
    gender: string;
    alsoKnownAs?: string[];
    moviesCount?: number;
    movieActors?: MovieActor[]; // Relationship data
}

export interface MovieActor {
    id: string;
    movieId?: string;
    actorId?: string;
    characterName: string;
    movie?: Movie; // Optional for avoiding circular deps
    actor?: Actor; // Optional for avoiding circular deps
}

export type FilterGender = 'all' | 'male' | 'female' | 'unknown';
export type SortBy = 'id' | 'movieCount';