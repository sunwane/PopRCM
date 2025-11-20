import { Genre } from '@/types/Genres';
import { ApiResponse } from '@/types/APIResponse';
import { mockGenres } from '@/mocksData/mockGenres';

export class GenresService {
  private static genres: Genre[] = [];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'http://localhost:8088/api/genres';

  // Kiểm tra service availability từ localStorage (giống AuthService)
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Lấy dữ liệu từ API lần đầu
  private static async loadGenresFromApi(): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.genres = [...mockGenres];
      this.isDataLoaded = true;
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<Genre[]> = await response.json();
      
      // Chuyển đổi từ GenreResponse sang Genre (nếu cần)
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        this.genres = apiResponse.result.map(item => ({
          id: item.id,
          genresName: item.genresName
        }));
        this.isDataLoaded = true;
        console.log('Loaded genres from API:', this.genres.length);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load genres from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.genres = [...mockGenres];
      this.isDataLoaded = true;
    }
  }

  // Lấy tất cả thể loại
  static async getAllGenres(): Promise<Genre[]> {
    await this.loadGenresFromApi();
    return [...this.genres];
  }

  // Lấy thể loại theo ID
  static async getGenreById(id: string): Promise<Genre | null> {
    await this.loadGenresFromApi();
    return this.genres.find(genre => genre.id === id) || null;
  }

  // Refresh data từ API
  static async refreshGenresFromApi(): Promise<Genre[]> {
    this.isDataLoaded = false;
    this.genres = [];
    return await this.getAllGenres();
  }
}