import { Country } from '@/types/Country';
import { ApiResponse } from '@/types/APIResponse';
import { mockCountries } from '@/mocksData/mockCountries';

export class CountryService {
  private static countries: Country[] = [];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'http://localhost:8088/api/countries';

  // Kiểm tra service availability từ localStorage (giống AuthService)
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Lấy dữ liệu từ API lần đầu
  private static async loadCountriesFromApi(): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.countries = [...mockCountries];
      this.isDataLoaded = true;
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<Country[]> = await response.json();
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        this.countries = apiResponse.result;
        console.info('Countries loaded from API:', this.countries);
        this.isDataLoaded = true;
      }
      
    } catch (error) {
      console.warn('Failed to load countries from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.countries = [...mockCountries];
      this.isDataLoaded = true;
    }
  }

  // Lấy tất cả quốc gia
  static async getAllCountries(): Promise<Country[]> {
    await this.loadCountriesFromApi();
    return [...this.countries];
  }

  // Lấy quốc gia theo ID
  static async getCountryById(id: string): Promise<Country | null> {
    await this.loadCountriesFromApi();
    return this.countries.find(country => country.id === id) || null;
  }

  // Refresh data từ API
  static async refreshCountriesFromApi(): Promise<Country[]> {
    this.isDataLoaded = false;
    this.countries = [];
    return await this.getAllCountries();
  }
}