import { Movie } from "./Movies";

export interface Actor {
    id: string;
    tmdbId?: string;
    originName: string;
    profilePath?: string;
    gender: string;
    alsoKnownAs?: string[];
}

export interface MovieActor {
    id: string;
    movieId?: number;
    actorId?: string;
    characterName: string;
    movie?: Movie; // Optional for avoiding circular deps
    actor?: Actor; // Optional for avoiding circular deps
}

export type FilterGender = 'all' | 'male' | 'female' | 'unknown';
export type SortBy = 'id' | 'movieCount';