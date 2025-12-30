import { Series, SeriesMovie } from '@/types/Series';
import { mockSeries, mockSeriesMovies } from '@/mocksData/mockSeries';
import { mockMovies } from '@/mocksData/mockMovies';

export class SeriesService {
  private static readonly API_BASE_URL = 'https://poprcm-be.onrender.com/api/series';
  private static series: Series[] = [...mockSeries];

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Helper method to populate series movies with full movie details for mock data
  private static populateSeriesMovies(seriesId: string): SeriesMovie[] {
    return mockSeriesMovies
      .filter(sm => sm.seriesId === seriesId)
      .map(sm => {
        const movie = mockMovies.find(m => m.id === sm.movieId);
        return {
          ...sm,
          movie: movie ? {
            ...movie,
            // Đảm bảo có đầy đủ thông tin cần thiết
            actors: movie.actors || [],
            genres: movie.genres || [],
            country: movie.country || [],
            episodes: movie.episodes || []
          } : undefined
        };
      })
      .filter(sm => sm.movie !== undefined); // Loại bỏ các item không tìm thấy movie
  }

  // Helper method to get full movie details for series.movies array
  private static getSeriesMoviesArray(seriesId: string): any[] {
    const seriesMovies = mockSeriesMovies.filter(sm => sm.seriesId === seriesId);
    
    return seriesMovies.map(sm => {
      const movie = mockMovies.find(m => m.id === sm.movieId);
      if (!movie) return null;

      return {
        ...movie,
        // Thêm thông tin từ SeriesMovie nếu cần
        seasonNumber: sm.seasonNumber,
        // Đảm bảo có đầy đủ thông tin
        actors: movie.actors || [],
        genres: movie.genres || [],
        country: movie.country || [],
        episodes: movie.episodes || [],
        // Thêm các trường bổ sung từ movie
        view: movie.view || 0,
        tmdbScore: movie.tmdbScore || 0,
        imdbScore: movie.imdbScore || 0,
        duration: movie.duration || '',
        director: movie.director || '',
        status: movie.status || '',
        type: movie.type || ''
      };
    }).filter(movie => movie !== null); // Loại bỏ các movie null
  }

  // Load mock data with series movies populated
  private static loadMockData(): Series[] {
    this.series = mockSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id),
      // Thêm mảng movies với thông tin đầy đủ
      movies: this.getSeriesMoviesArray(series.id)
    }));
    return [...this.series];
  }

  // Chuyển đổi SeriesResponse từ API sang Series interface
  private static mapSeriesResponseToSeries(seriesResponse: any): Series {
    // Map movies từ MovieInSeriesResponse sang Movie format
    const mappedMovies = seriesResponse.movies?.map((movieInSeries: any) => ({
      id: movieInSeries.movieId,
      title: movieInSeries.movieTitle,
      originalName: movieInSeries.originName || '',
      description: movieInSeries.description || '',
      releaseYear: movieInSeries.releaseYear || new Date().getFullYear(),
      duration: movieInSeries.duration || '',
      posterUrl: movieInSeries.thumbUrl || '',
      thumbnailUrl: movieInSeries.moviePosterUrl || '',
      trailerUrl: movieInSeries.trailerUrl || '',
      totalEpisodes: movieInSeries.currentEpisodeCount || 0,
      currentEpisode: movieInSeries.currentEpisodeCount || 0,
      director: Array.isArray(movieInSeries.director) ? movieInSeries.director.join(', ') : movieInSeries.director || '',
      status: movieInSeries.status || '',
      createdAt: new Date(),
      modifiedAt: new Date(),
      view: movieInSeries.views || 0,
      slug: movieInSeries.movieSlug || '',
      tmdbScore: movieInSeries.tmdbScore || 0,
      imdbScore: movieInSeries.imdbScore || 0,
      PopRating: 0,
      lang: movieInSeries.lang || 'vietsub',
      
      // Map countries từ CountryResponse
      country: [],
      
      // Map genres từ GenreResponse  
      genres: [],
      
      // Actors sẽ empty vì API không trả về trong MovieInSeriesResponse
      actors: [],
      
      // Episodes sẽ empty, cần gọi API khác để lấy
      episodes: [],
      
      // Thêm thông tin season từ series
      seasonNumber: movieInSeries.seasonNumber || 1
    })) || [];

    return {
      id: seriesResponse.id,
      name: seriesResponse.name,
      description: seriesResponse.description || '',
      status: seriesResponse.status,
      posterUrl: seriesResponse.posterUrl || '',
      releaseYear: seriesResponse.releaseYear?.toString() || new Date().getFullYear().toString(),
      // Sử dụng mapped movies
      movies: mappedMovies,
      seriesMovies: seriesResponse.seriesMovies || [],
      movieCount: mappedMovies.length
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
      const response = await fetch(`${this.API_BASE_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  // Get series by ID - Cập nhật để gán thông tin đầy đủ cho movies
  static async getSeriesById(id: string): Promise<Series | null> {
    if (!this.isServiceAvailable()) {
      // Tìm series trong mock data
      let series = this.series.find(s => s.id === id);
      
      // Nếu chưa load mock data, load trước
      if (!series) {
        this.loadMockData();
        series = this.series.find(s => s.id === id);
      }
      
      if (!series) return null;

      // Trả về series với thông tin đầy đủ
      return {
        ...series,
        seriesMovies: this.populateSeriesMovies(id),
        movies: this.getSeriesMoviesArray(id) // Gán thông tin đầy đủ cho movies
      };
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('API Response for getSeriesById:', apiResponse);
      
      if (apiResponse.result) {
        console.log(this.mapSeriesResponseToSeries(apiResponse.result))
        return this.mapSeriesResponseToSeries(apiResponse.result);
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get series from API, using mock data:', error);
      
      // Fallback to mock data với thông tin đầy đủ
      let series = this.series.find(s => s.id === id);
      
      if (!series) {
        this.loadMockData();
        series = this.series.find(s => s.id === id);
      }
      
      if (!series) return null;

      return {
        ...series,
        seriesMovies: this.populateSeriesMovies(id),
        movies: this.getSeriesMoviesArray(id) // Gán thông tin đầy đủ cho movies
      };
    }
  }

  // Các phương thức khác giữ nguyên
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
        .sort((a, b) => (b.movies?.length || 0) - (a.movies?.length || 0))
        .slice(0, limit);
    }
    
    try {
      const allSeries = await this.loadSeriesData(0, 1000);
      return [...allSeries]
        .sort((a, b) => (b.movies?.length || 0) - (a.movies?.length || 0))
        .slice(0, limit);
    } catch (error) {
      const allSeries = this.loadMockData();
      return [...allSeries]
        .sort((a, b) => (b.movies?.length || 0) - (a.movies?.length || 0))
        .slice(0, limit);
    }
  }

  // Get series by movie ID - Sử dụng seriesId để gọi getSeriesById
  static async getSeriesByMovieId(movieId: string): Promise<Series | null> {
    if (!this.isServiceAvailable()) {
      // Mock data logic
      const seriesMovie = mockSeriesMovies.find(sm => sm.movieId === movieId);
      if (!seriesMovie) return null;

      // Sử dụng getSeriesById để lấy thông tin đầy đủ
      return await this.getSeriesById(seriesMovie.seriesId);
    }

    try {
      // Gọi API để lấy seriesId từ MovieController
      const response = await fetch(`https://poprcm-be.onrender.com/api/movies/${movieId}/series`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('SeriesForMovieResponse from MovieController:', apiResponse);
      
      if (apiResponse.result && Array.isArray(apiResponse.result) && apiResponse.result.length > 0) {
        // Lấy seriesId từ response đầu tiên
        const seriesForMovieResponse = apiResponse.result[0];
        const seriesId = seriesForMovieResponse.seriesId;
        
        if (seriesId) {
          // Sử dụng getSeriesById để lấy thông tin đầy đủ về series
          return await this.getSeriesById(seriesId);
        }
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get series by movie ID from API, using mock data:', error);
      
      // Fallback to mock data
      const seriesMovie = mockSeriesMovies.find(sm => sm.movieId === movieId);
      if (!seriesMovie) return null;

      // Sử dụng getSeriesById cho fallback cũng đảm bảo tính nhất quán
      return await this.getSeriesById(seriesMovie.seriesId);
    }
  }
}