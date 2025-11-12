import { Genre, OphimGenreResponse, OphimApiResponse } from '@/types/Genres';
import { mockGenres } from '@/mocksData/mockGenres';
import { fetchWithErrorHandling, normalizeGenresFromApi } from '@/utils/genresUtils';

export class GenresService {
  private static genres: Genre[] = [];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'https://ophim1.com/v1/api';

  // Lấy dữ liệu từ API lần đầu
  private static async loadGenresFromApi(): Promise<void> {
    if (this.isDataLoaded) return;

    try {
      const response: OphimApiResponse = await fetchWithErrorHandling(
        `${this.API_BASE_URL}/the-loai`
      );
      
      // Kiểm tra cấu trúc response
      if (response.status === 'success' && response.data && response.data.items && Array.isArray(response.data.items)) {
        this.genres = normalizeGenresFromApi(response.data.items);
        this.isDataLoaded = true;
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

  // Thêm thể loại mới (chỉ local - không gửi lên API)
  static async addGenre(genreData: Omit<Genre, 'id'>): Promise<Genre> {
    await this.loadGenresFromApi();
    
    const newGenre: Genre = {
      id: (Math.max(...this.genres.map(g => Number(g.id)), 0) + 1).toString(),
      ...genreData
    };
    
    this.genres.push(newGenre);
    return newGenre;
  }

  // Cập nhật thể loại (chỉ local)
  static async updateGenre(id: string, genreData: Partial<Genre>): Promise<Genre | null> {
    await this.loadGenresFromApi();
    
    const index = this.genres.findIndex(genre => genre.id === id);
    if (index === -1) return null;
    
    this.genres[index] = { ...this.genres[index], ...genreData };
    return this.genres[index];
  }

  // Xóa thể loại (chỉ local)
  static async deleteGenre(id: string): Promise<boolean> {
    await this.loadGenresFromApi();
    
    const index = this.genres.findIndex(genre => genre.id === id);
    if (index === -1) return false;
    
    this.genres.splice(index, 1);
    return true;
  }

  // Kiểm tra tên thể loại đã tồn tại
  static async checkGenreNameExists(name: string, excludeId?: string): Promise<boolean> {
    await this.loadGenresFromApi();
    
    return this.genres.some(genre => 
      genre.genresName.toLowerCase() === name.toLowerCase() && 
      genre.id !== excludeId
    );
  }

  // Refresh data từ API
  static async refreshGenresFromApi(): Promise<Genre[]> {
    this.isDataLoaded = false;
    this.genres = [];
    return await this.getAllGenres();
  }

  // Lấy số lượng phim theo thể loại (API khác hoặc mock)
  static async getMovieCountByGenre(genreId: string): Promise<number> {
    const seed = parseInt(genreId) || 1;
    return Math.abs(Math.floor((Math.sin(seed) * 10000) % 50) + Math.floor(Math.random() * 20));
  }

  // Lấy thống kê tổng quan
  static async getGenreStats(): Promise<{
    total: number;
    mostPopular: Genre | null;
    leastPopular: Genre | null;
    totalMovies: number;
    fromApi: boolean;
  }> {
    await this.loadGenresFromApi();
    
    const total = this.genres.length;
    const totalMovies = Math.floor(Math.random() * 1000) + 500; // Tạm thời
    
    return {
      total,
      mostPopular: this.genres[0] || null,
      leastPopular: this.genres[this.genres.length - 1] || null,
      totalMovies,
      fromApi: this.isDataLoaded
    };
  }

  // Lấy genres theo slug (nếu cần sau này)
  static async getGenreBySlug(slug: string): Promise<Genre | null> {
    await this.loadGenresFromApi();
    // Tạm thời return null vì chưa lưu slug trong Genre type
    return null;
  }

  // Search genres theo tên
  static async searchGenres(query: string): Promise<Genre[]> {
    await this.loadGenresFromApi();
    
    if (!query.trim()) return this.genres;
    
    const searchTerm = query.toLowerCase().trim();
    return this.genres.filter(genre => 
      genre.genresName.toLowerCase().includes(searchTerm)
    );
  }
}