import { Movie } from "./Movies";

export interface SeriesMovie {
    id: string;
    movieId: string;
    seriesId: string;
    seasonNumber: number;
    movie?: Movie; // Optional populated movie data
}

export interface Series {
    id: string;
    name: string;
    description: string;
    status: string;
    releaseYear: string;
    posterUrl: string;
    seriesMovies?: SeriesMovie[]; // Relationship data
}