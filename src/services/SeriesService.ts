import { Series, SeriesMovie } from '@/types/Series';
import { mockSeries, mockSeriesMovies } from '@/mocksData/mockSeries';
import { mockMovies } from '@/mocksData/mockMovies';

export class SeriesService {
  private static readonly API_BASE_URL = 'http://localhost:8088/api/series';
  private static series: Series[] = [...mockSeries];

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Helper method to populate series movies for mock data
  private static populateSeriesMovies(seriesId: string): SeriesMovie[] {
    return mockSeriesMovies
      .filter(sm => sm.seriesId === seriesId)
      .map(sm => ({
        ...sm,
        movie: mockMovies.find(m => m.id === sm.movieId)
      }));
  }

  // Load mock data with series movies populated
  private static loadMockData(): Series[] {
    this.series = mockSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
    return [...this.series];
  }

  // Chuyển đổi SeriesResponse từ API sang Series interface
  private static mapSeriesResponseToSeries(seriesResponse: any): Series {
    return {
      id: seriesResponse.id,
      name: seriesResponse.name,
      description: seriesResponse.description || '',
      status: seriesResponse.status,
      posterUrl: seriesResponse.posterUrl || '',
      releaseYear: seriesResponse.releaseYear?.toString() || new Date().getFullYear().toString(),
      seriesMovies: seriesResponse.movies ? seriesResponse.movies.map((movieInSeries: any) => ({
        id: `sm-${movieInSeries.movieId}-${seriesResponse.id}`,
        movieId: parseInt(movieInSeries.movieId),
        seriesId: seriesResponse.id,
        seasonNumber: movieInSeries.seasonNumber || 1,
        movie: {
          id: parseInt(movieInSeries.movieId),
          title: movieInSeries.movieTitle || 'Unknown Title',
          originalName: movieInSeries.movieTitle || 'Unknown Title',
          description: '',
          releaseYear: parseInt(movieInSeries.movieReleaseYear) || new Date().getFullYear(),
          type: movieInSeries.movieType || 'Movie',
          duration: '',
          posterUrl: movieInSeries.moviePosterUrl || '',
          thumbnailUrl: movieInSeries.moviePosterUrl || '',
          trailerUrl: '',
          director: '',
          status: 'Completed',
          createdAt: new Date(),
          modifiedAt: new Date(),
          view: 0,
          slug: movieInSeries.movieSlug || '',
          tmdbScore: 0,
          imdbScore: 0,
          lang: 'vi',
          country: [],
          actors: [],
          genres: [],
          episodes: []
        }
      })) : []
    };
  }

  // Load data from API or mock
  private static async loadSeriesData(
    page: number = 0,
    size: number = 24
  ): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      const allSeries = this.loadMockData();
      
      // Nếu sử dụng mock data và có pagination, thực hiện phân trang local
      if (size !== 1000) {
        const start = page * size;
        const end = start + size;
        return allSeries.slice(start, end);
      }
      
      return allSeries;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        const series = apiResponse.result.content.map((seriesResponse: any) => 
          this.mapSeriesResponseToSeries(seriesResponse)
        );
        
        return series;
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load series from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      const allSeries = this.loadMockData();
      
      // Nếu có pagination, thực hiện phân trang local
      if (size !== 1000) {
        const start = page * size;
        const end = start + size;
        return allSeries.slice(start, end);
      }
      
      return allSeries;
    }
  }

  // Get all series - với pagination parameters
  static async getAllSeries(
    page: number = 0,
    size: number = 24
  ): Promise<Series[]> {
    const loadSize = this.isServiceAvailable() ? size : 1000;
    const series = await this.loadSeriesData(page, loadSize);
    return [...series];
  }

  // Get series by ID
  static async getSeriesById(id: string): Promise<Series | null> {
    if (!this.isServiceAvailable()) {
      const series = this.series.find(s => s.id === id);
      if (!series) return null;

      return {
        ...series,
        seriesMovies: this.populateSeriesMovies(id)
      };
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return this.mapSeriesResponseToSeries(apiResponse.result);
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get series from API, using mock data:', error);
      const series = this.series.find(s => s.id === id);
      if (!series) return null;

      return {
        ...series,
        seriesMovies: this.populateSeriesMovies(id)
      };
    }
  }

  // Các phương thức khác (filter, getRecentSeries, getSeriesByMovieCount, v.v.)
  static async getRecentSeries(limit: number = 10): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      const allSeries = this.loadMockData();
      return [...allSeries]
        .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
        .slice(0, limit);
    }
    
    try {
      const allSeries = await this.loadSeriesData(0, 1000);
      return [...allSeries]
        .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
        .slice(0, limit);
    } catch (error) {
      const allSeries = this.loadMockData();
      return [...allSeries]
        .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
        .slice(0, limit);
    }
  }

  static async getSeriesByMovieCount(limit: number = 10): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      const allSeries = this.loadMockData();
      return [...allSeries]
        .sort((a, b) => (b.seriesMovies?.length || 0) - (a.seriesMovies?.length || 0))
        .slice(0, limit);
    }
    
    try {
      const allSeries = await this.loadSeriesData(0, 1000);
      return [...allSeries]
        .sort((a, b) => (b.seriesMovies?.length || 0) - (a.seriesMovies?.length || 0))
        .slice(0, limit);
    } catch (error) {
      const allSeries = this.loadMockData();
      return [...allSeries]
        .sort((a, b) => (b.seriesMovies?.length || 0) - (a.seriesMovies?.length || 0))
        .slice(0, limit);
    }
  }
}