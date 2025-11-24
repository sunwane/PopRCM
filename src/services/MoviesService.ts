import { Movie } from '@/types/Movies';
import { mockMovies } from '@/mocksData/mockMovies';
import { mockActors } from '@/mocksData/mockActors';
import { mockMovieActors } from '@/mocksData/mockMovieActors';

export class MoviesService {
  private static movies: Movie[] = [...mockMovies]; // Initialize with mock data
  private static isDataLoaded = false; // Changed to false to force loading
  private static readonly API_BASE_URL = 'http://localhost:8088/api/movies';

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Helper method to populate movie actors
  private static populateMovieActors(movieId: string) {
    return mockMovieActors
      .filter(ma => ma.movieId === movieId)
      .map(ma => ({
        ...ma,
        movie: this.movies.find(m => m.id === ma.movieId),
        actor: mockActors.find(a => a.id === ma.actorId)
      }));
  }

  // Load data from API or mock
  private static async loadMoviesData(): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.movies = mockMovies.map(movie => ({
        ...movie,
        actors: this.populateMovieActors(movie.id)
      }));
      this.isDataLoaded = true;
      return;
    }

    try {
      // Load all movies for filtering (we'll implement server-side pagination later)
      const response = await fetch(`${this.API_BASE_URL}?page=0&size=1000`, {
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
        this.movies = apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
        this.isDataLoaded = true;
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load movies from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.movies = mockMovies.map(movie => ({
        ...movie,
        actors: this.populateMovieActors(movie.id)
      }));
      this.isDataLoaded = true;
    }
  }

  // Optimized mapping function with concise handling of arrays and defaults
  private static mapMovieResponseToMovie(res: any): Movie {
    const { 
      id, title, originName, description = '', releaseYear, type = [], duration = '',
      posterUrl, thumbUrl, trailerUrl, totalEpisodes, director = [], status = [],
      createdAt, modifiedAt, views = 0, slug, tmdbScore, imdbScore, lang = [],
      actors = [], genres = [], countries = [], episodes = []
    } = res;

    return {
      id,
      title,
      originalName: originName || title,
      description,
      releaseYear,
      type: Array.isArray(type) ? type[0] || '' : type,
      duration,
      posterUrl: `https://img.ophim.live/uploads/movies/${thumbUrl}`,
      thumbnailUrl: `https://img.ophim.live/uploads/movies/${posterUrl}`,
      trailerUrl,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : undefined,
      director: Array.isArray(director) ? director.join(', ') : director,
      status: Array.isArray(status) ? status[0] || '' : status,
      createdAt: new Date(createdAt),
      modifiedAt: new Date(modifiedAt),
      view: views,
      slug,
      tmdbScore,
      imdbScore,
      lang: Array.isArray(lang) ? lang[0] || '' : lang,
      country: countries?.map((c: any) => ({ id: c.id, name: c.name })) || [],
      actors: actors?.map((a: any) => ({
        actorId: a.actorId,
        originName: a.originName,
        characterName: a.characterName,
        profilePath: a.profilePath,
      })) || [],
      genres: genres?.map((g: any) => ({ id: g.id, genresName: g.genresName })) || [],
      episodes: episodes?.map((e: any) => ({
        id: e.id,
        title: e.title || '',
        episodeNumber: e.episodeNumber || 0,
        createdAt: new Date(e.createdAt || Date.now()),
        videoUrl: e.videoUrl || '',
        m3u8Url: e.m3u8Url,
        serverName: e.serverName || ''
      })) || []
    };
  }

  // Get all movies
  static async getAllMovies(): Promise<Movie[]> {
    await this.loadMoviesData();
    return this.movies;
  }

    // Hàm tổng quát để lọc phim
  static async getFilteredMovies({
    query = "",
    year,
    type,
    status,
    language,
    genreIds = [],
    countryId,
    sortBy,
    page = 0,
    size = 20,
  }: {
    query?: string;
    year?: number;
    type?: string;
    status?: string;
    language?: string;
    genreIds?: string[];
    countryId?: string;
    sortBy?: string;
    page?: number;
    size?: number;
  }): Promise<{ movies: Movie[], totalCount: number, totalPages: number }> {
    await this.loadMoviesData(); // Đảm bảo dữ liệu đã được tải

    const searchTerm = query.toLowerCase().trim();

    // Normalize filters: nếu truyền "all" => coi như không lọc (ignore)
    const filterType = type === "all" ? undefined : type;
    const filterStatus = status === "all" ? undefined : status;
    const filterLanguage = language === "all" ? undefined : language;
    const filterCountryId = countryId === "all" ? undefined : countryId;
    const effectiveGenreIds = Array.isArray(genreIds) ? genreIds.filter(id => id !== "all") : [];

    // Lọc phim dựa trên các tiêu chí
    const filteredMovies = this.movies.filter((movie) => {
      // Lọc theo từ khóa tìm kiếm
      const matchesQuery =
        !searchTerm ||
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.originalName.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm);

      // Lọc theo năm phát hành
      const matchesYear = !year || movie.releaseYear === year;

      // Lọc theo loại phim (ignore nếu filterType undefined)
      const matchesType = !filterType || movie.type === filterType;

      // Lọc theo trạng thái
      const matchesStatus = !filterStatus || movie.status === filterStatus;

      // Lọc theo ngôn ngữ
      const matchesLanguage = !filterLanguage || movie.lang === filterLanguage;

      // Lọc theo thể loại (effectiveGenreIds là mảng string)
      const matchesGenres =
        effectiveGenreIds.length === 0 ||
        effectiveGenreIds.every((genreId) => movie.genres.some((genre) => genre.id === genreId));

      // Lọc theo quốc gia
      const matchesCountry = !filterCountryId || movie.country.some((c) => c.id === filterCountryId);

      // Kết hợp tất cả các điều kiện
      return matchesQuery && matchesYear && matchesType && matchesStatus && matchesLanguage && matchesGenres && matchesCountry;
    });

      // Sắp xếp nếu cần
    if (sortBy === "Nhiều lượt xem") {
      filteredMovies.sort((a, b) => b.view - a.view);
    } else if (sortBy === "Điểm IMDB") {
      filteredMovies.sort((a, b) => (b.imdbScore || 0) - (a.imdbScore || 0));
    } else if (sortBy === "Điểm TMDB") {
      filteredMovies.sort((a, b) => (b.tmdbScore || 0) - (a.tmdbScore || 0));
    } else if (sortBy === "Mới nhất") {
      filteredMovies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Tính toán phân trang
    const totalCount = filteredMovies.length;
    const totalPages = Math.ceil(totalCount / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const movies = filteredMovies.slice(startIndex, endIndex);

    return {
      movies,
      totalCount,
      totalPages
    };
  }

  // Get movie by ID
  static async getMovieById(id: string): Promise<Movie | null> {
    await this.loadMoviesData();
    const movie = this.movies.find(movie => movie.id === id);
    if (!movie) return null;

    // Chỉ populate actors khi dùng mock data
    if (!this.isServiceAvailable()) {
      return {
        ...movie,
        actors: this.populateMovieActors(id)
      };
    }
    
    // API đã có actors sẵn rồi
    return movie;
  }

  // Search movies with API integration
  static async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) {
      return await this.getAllMovies();
    }

    if (!this.isServiceAvailable()) {
      // Mock data - cần populate actors
      await this.loadMoviesData();
      const searchTerm = query.toLowerCase().trim();
      const filteredMovies = this.movies.filter(movie => {
        const directors = Array.isArray(movie.director) ? movie.director.join(' ') : movie.director;
        return (
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.originalName.toLowerCase().includes(searchTerm) ||
          directors.toLowerCase().includes(searchTerm) ||
          movie.description.toLowerCase().includes(searchTerm)
        );
      });

      return filteredMovies;
    }

    try {
      // API call - actors đã có sẵn
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=0&size=100`, {
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
        // Trả về trực tiếp, không ghi đè actors
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
      
    } catch (error) {
      // Fallback to mock - cần populate actors
      console.warn('Search API failed, falling back to local search:', error);
      await this.loadMoviesData();
      const searchTerm = query.toLowerCase().trim();
      const filteredMovies = this.movies.filter(movie => {
        const directors = Array.isArray(movie.director) ? movie.director.join(' ') : movie.director;
        return (
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.originalName.toLowerCase().includes(searchTerm) ||
          directors.toLowerCase().includes(searchTerm) ||
          movie.description.toLowerCase().includes(searchTerm)
        );
      });

      return filteredMovies;
    }
  }

  // Get movies by actor
  static async getMoviesByActor(actorId: string): Promise<Movie[]> {
    this.loadMoviesData();
    
    // Get movie IDs that have this actor
    const movieIdsWithActor = mockMovieActors
      .filter(ma => ma.actorId === actorId)
      .map(ma => ma.movieId);
    
    const filteredMovies = this.movies.filter(movie => 
      movieIdsWithActor.includes(movie.id)
    );
    
    return filteredMovies;
  }

  // Get recent movies
  static async getRecentMovies(limit: number = 10): Promise<Movie[]> {
    this.loadMoviesData();
    const sortedMovies = [...this.movies]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return sortedMovies;
  }

  // Get popular movies (by view count)
  static async getPopularMovies(limit: number = 10): Promise<Movie[]> {
    this.loadMoviesData();
    const sortedMovies = [...this.movies]
      .sort((a, b) => b.view - a.view)
      .slice(0, limit);
    
    return sortedMovies;
  }

  // Get top rated movies
  static async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    this.loadMoviesData();

    const sortedMovies = [...this.movies]
      .map(movie => {
        // Tính điểm trung bình của imdbScore và tmdbScore
        const imdbScore = movie.imdbScore || 0; // Nếu không có imdbScore, dùng 0
        const tmdbScore = movie.tmdbScore || 0; // Nếu không có tmdbScore, dùng 0
        const scoreCount = (movie.imdbScore ? 1 : 0) + (movie.tmdbScore ? 1 : 0); // Đếm số điểm hợp lệ
        const averageScore = scoreCount > 0 ? (imdbScore + tmdbScore) / scoreCount : 0; // Tính trung bình
        return {
          ...movie,
          averageScore // Thêm điểm trung bình vào đối tượng phim
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore) // Sắp xếp theo điểm trung bình giảm dần
      .slice(0, limit); // Lấy số lượng phim theo limit

    return sortedMovies;
  }

  // Get unique release years
  static async getUniqueReleaseYears(): Promise<number[]> {
    this.loadMoviesData();
    const years = [...new Set(this.movies.map(movie => movie.releaseYear))];
    return years.sort((a, b) => b - a);
  }

  // Get unique types (optimized for array handling)
  static async getUniqueTypes(): Promise<string[]> {
    this.loadMoviesData();
    const allTypes = this.movies.flatMap(movie => 
      Array.isArray(movie.type) ? movie.type : [movie.type]
    );
    return [...new Set(allTypes)].filter(Boolean);
  }

  // Get unique statuses (optimized for array handling)
  static async getUniqueStatuses(): Promise<string[]> {
    this.loadMoviesData();
    const allStatuses = this.movies.flatMap(movie => 
      Array.isArray(movie.status) ? movie.status : [movie.status]
    );
    return [...new Set(allStatuses)].filter(Boolean);
  }

  // Get unique languages (optimized for array handling)  
  static async getUniqueLanguages(): Promise<string[]> {
    this.loadMoviesData();
    const allLanguages = this.movies.flatMap(movie => 
      Array.isArray(movie.lang) ? movie.lang : [movie.lang]
    );
    return [...new Set(allLanguages)].filter(Boolean);
  }

  // Get actors for a specific movie
  static async getMovieActors(movieId: string) {
    return this.populateMovieActors(movieId);
  }
}