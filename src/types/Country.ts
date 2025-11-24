export interface Country {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result: T;
}