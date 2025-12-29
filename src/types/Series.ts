import { Movie } from "./Movies";

export interface SeriesMovie {
    id: string;
    movieId: string;
    seriesId: string;
    seasonNumber: number;
    episodeOrder?: number;
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
    movieCount?: number; // Số lượng phim trong series
    movies?: Movie[]; // Danh sách phim trong series
}

// Response type từ MovieController API cho series of a movie
export interface SeriesForMovieResponse {
    seriesId: string;
    seriesName: string;
    allMovieIdsInThisSeries: Set<string>;
}