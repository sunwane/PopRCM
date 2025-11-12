export interface Genre {
  id: string;
  genresName: string;
}

export interface OphimGenreResponse {
  _id: string;
  name: string;
  slug: string;
}

export interface OphimApiResponse {
  status: string;
  message?: string;
  data: {
    items: OphimGenreResponse[];
  }
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}