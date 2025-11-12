export interface Country {
  id: string;
  countryName: string;
}

export interface OphimCountryResponse {
  _id: string;
  name: string;
  slug: string;
}

// Cấu trúc response từ API ophim
export interface OphimCountryApiResponse {
  status: string;
  message: string;
  data: {
    items: OphimCountryResponse[];
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}