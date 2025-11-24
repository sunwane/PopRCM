export interface Genre {
  id: string;
  genresName: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result: T;
}