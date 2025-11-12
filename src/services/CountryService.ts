import { Country, OphimCountryResponse, OphimCountryApiResponse } from '@/types/Country';
import { mockCountries } from '@/mocksData/mockCountries';
import { fetchWithErrorHandling, normalizeCountriesFromApi } from '@/utils/countryUtils';

export class CountryService {
  private static countries: Country[] = [];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'https://ophim1.com/v1/api';

  // Lấy dữ liệu từ API lần đầu
  private static async loadCountriesFromApi(): Promise<void> {
    if (this.isDataLoaded) return;

    try {
      const response: OphimCountryApiResponse = await fetchWithErrorHandling(
        `${this.API_BASE_URL}/quoc-gia`
      );
      
      // Kiểm tra cấu trúc response
      if (response.status === 'success' && response.data && response.data.items && Array.isArray(response.data.items)) {
        this.countries = normalizeCountriesFromApi(response.data.items);
        this.isDataLoaded = true;
        console.log('Loaded countries from API:', this.countries.length);
      } else {
        throw new Error('Invalid API response structure');
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

  // Thêm quốc gia mới (chỉ local - không gửi lên API)
  static async addCountry(countryData: Omit<Country, 'id'>): Promise<Country> {
    await this.loadCountriesFromApi();
    
    const newCountry: Country = {
      id: (Math.max(...this.countries.map(c => Number(c.id)), 0) + 1).toString(),
      ...countryData
    };
    
    this.countries.push(newCountry);
    return newCountry;
  }

  // Cập nhật quốc gia (chỉ local)
  static async updateCountry(id: string, countryData: Partial<Country>): Promise<Country | null> {
    await this.loadCountriesFromApi();
    
    const index = this.countries.findIndex(country => country.id === id);
    if (index === -1) return null;
    
    this.countries[index] = { ...this.countries[index], ...countryData };
    return this.countries[index];
  }

  // Xóa quốc gia (chỉ local)
  static async deleteCountry(id: string): Promise<boolean> {
    await this.loadCountriesFromApi();
    
    const index = this.countries.findIndex(country => country.id === id);
    if (index === -1) return false;
    
    this.countries.splice(index, 1);
    return true;
  }

  // Kiểm tra tên quốc gia đã tồn tại
  static async checkCountryNameExists(name: string, excludeId?: string): Promise<boolean> {
    await this.loadCountriesFromApi();
    
    return this.countries.some(country => 
      country.countryName.toLowerCase() === name.toLowerCase() && 
      country.id !== excludeId
    );
  }

  // Refresh data từ API
  static async refreshCountriesFromApi(): Promise<Country[]> {
    this.isDataLoaded = false;
    this.countries = [];
    return await this.getAllCountries();
  }

  // Lấy số lượng phim theo quốc gia (mock)
  static async getMovieCountByCountry(countryId: string): Promise<number> {
    const seed = parseInt(countryId) || 1;
    return Math.abs(Math.floor((Math.sin(seed * 2) * 10000) % 100) + Math.floor(Math.random() * 50));
  }

  // Lấy thống kê tổng quan
  static async getCountryStats(): Promise<{
    total: number;
    mostPopular: Country | null;
    leastPopular: Country | null;
    totalMovies: number;
    countriesWithMovies: number;
    avgMoviesPerCountry: number;
    fromApi: boolean;
  }> {
    await this.loadCountriesFromApi();
    
    const total = this.countries.length;
    const totalMovies = Math.floor(Math.random() * 2000) + 1000; // Tạm thời
    
    return {
      total,
      mostPopular: this.countries[0] || null,
      leastPopular: this.countries[this.countries.length - 1] || null,
      totalMovies,
      countriesWithMovies: Math.floor(total * 0.8), // 80% countries have movies
      avgMoviesPerCountry: total > 0 ? Math.round(totalMovies / total) : 0,
      fromApi: this.isDataLoaded
    };
  }

  // Search countries theo tên
  static async searchCountries(query: string): Promise<Country[]> {
    await this.loadCountriesFromApi();
    
    if (!query.trim()) return this.countries;
    
    const searchTerm = query.toLowerCase().trim();
    return this.countries.filter(country => 
      country.countryName.toLowerCase().includes(searchTerm)
    );
  }
}