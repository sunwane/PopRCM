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
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?page=0&size=10`, {
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
        this.movies = apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
        this.isDataLoaded = true;
        console.log('Loaded movies from API:', this.movies.length);
        console.log('List movies: ',this.movies);
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

  // Chuyển đổi MovieResponse từ API sang Movie interface
  private static mapMovieResponseToMovie(movieResponse: any): Movie {
    return {
      id: movieResponse.id,
      title: movieResponse.title,
      originalName: movieResponse.originName || movieResponse.title,
      description: movieResponse.description || '',
      releaseYear: movieResponse.releaseYear,
      type: movieResponse.type,
      duration: movieResponse.duration || '',

      //phải nhờ BE chỉnh lại thumbUrl và posterUrl
      posterUrl: "https://img.ophim.live/uploads/movies/" + movieResponse.thumbUrl,
      thumbnailUrl: "https://img.ophim.live/uploads/movies/" + movieResponse.posterUrl,

      trailerUrl: movieResponse.trailerUrl,
      totalEpisodes: movieResponse.totalEpisodes ? parseInt(movieResponse.totalEpisodes) : undefined,
      director: movieResponse.director || '',
      status: movieResponse.status,
      createdAt: new Date(movieResponse.createdAt),
      modifiedAt: new Date(movieResponse.modifiedAt),
      view: movieResponse.views || 0,
      slug: movieResponse.slug,
      tmdbScore: movieResponse.tmdbScore,
      imdbScore: movieResponse.imdbScore,
      lang: movieResponse.lang,
      country: [], // Will be populated separately if needed
      actors: movieResponse.actors ? movieResponse.actors.map((actor: any) => ({
        id: actor.id,
        actorId: actor.actorId,
        movieId: parseInt(movieResponse.id),
        characterName: actor.characterName,
        actor: {
          id: actor.actorId,
          name: actor.name || '',
          birthDate: actor.birthDate ? new Date(actor.birthDate) : new Date(),
          nationality: actor.nationality || '',
          biography: actor.biography || '',
          profileImageUrl: actor.profileImageUrl,
          createdAt: new Date(),
        }
      })) : [],
      genres: [], // Will be populated separately if needed
      episodes: [] // Will be populated separately if needed
    };
  }

  // Get all movies
  static async getAllMovies(): Promise<Movie[]> {
    await this.loadMoviesData();
    return this.movies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get movie by ID
  static async getMovieById(id: string): Promise<Movie | null> {
    await this.loadMoviesData();
    const movie = this.movies.find(movie => movie.id === id);
    if (!movie) return null;

    // Add actors relationship
    return {
      ...movie,
      actors: this.populateMovieActors(id)
    };
  }

  // Get movie by slug
  static async getMovieBySlug(slug: string): Promise<Movie | null> {
    this.loadMoviesData();
    const movie = this.movies.find(movie => movie.slug === slug);
    if (!movie) return null;

    // Add actors relationship
    return {
      ...movie,
      actors: this.populateMovieActors(movie.id)
    };
  }

  // Helper method for local search
  private static async localSearch(query: string): Promise<Movie[]> {
    await this.loadMoviesData(); // Đảm bảo dữ liệu đã được tải
    const searchTerm = query.toLowerCase().trim();

    // Lọc phim dựa trên tiêu chí tìm kiếm
    const filteredMovies = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.originalName.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm)
    );

    // Thêm thông tin diễn viên vào kết quả
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Search movies with API integration
  static async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) {
      return await this.getAllMovies(); // Nếu không có query, trả về tất cả phim
    }

    if (!this.isServiceAvailable()) {
      console.info('API not available, using local search');
      return await this.localSearch(query); // Gọi hàm localSearch
    }

    try {
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
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
      
    } catch (error) {
      console.warn('Search API failed, falling back to local search:', error);
      return await this.localSearch(query); // Fallback to local search
    }
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
  }: {
    query?: string;
    year?: number;
    type?: string;
    status?: string;
    language?: string;
    genreIds?: string[];
    countryId?: string;
    sortBy?: string;
  }): Promise<Movie[]> {
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

    

    // Thêm thông tin diễn viên vào kết quả
    return filteredMovies.map((movie) => ({
      ...movie,
      actors: this.populateMovieActors(movie.id),
    }));
  }

  // Get movies by actor - should be in actor service but here for now
  static async getMoviesByActor(actorId: string): Promise<Movie[]> {
    this.loadMoviesData();
    
    // Get movie IDs that have this actor
    const movieIdsWithActor = mockMovieActors
      .filter(ma => ma.actorId === actorId)
      .map(ma => ma.movieId);
    
    const filteredMovies = this.movies.filter(movie => 
      movieIdsWithActor.includes(movie.id)
    );
    
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get recent movies
  static async getRecentMovies(limit: number = 10): Promise<Movie[]> {
    this.loadMoviesData();
    const sortedMovies = [...this.movies]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return sortedMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get popular movies (by view count)
  static async getPopularMovies(limit: number = 10): Promise<Movie[]> {
    this.loadMoviesData();
    const sortedMovies = [...this.movies]
      .sort((a, b) => b.view - a.view)
      .slice(0, limit);
    
    return sortedMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
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

    return sortedMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id) // Thêm thông tin diễn viên
    }));
  }

  // Get unique types
  static async getUniqueTypes(): Promise<string[]> {
    this.loadMoviesData();
    return [...new Set(this.movies.map(movie => movie.type))];
  }

  // Get unique statuses
  static async getUniqueStatuses(): Promise<string[]> {
    this.loadMoviesData();
    return [...new Set(this.movies.map(movie => movie.status))];
  }

  // Get unique languages
  static async getUniqueLanguages(): Promise<string[]> {
    this.loadMoviesData();
    return [...new Set(this.movies.map(movie => movie.lang))];
  }

  // Get actors for a specific movie
  static async getMovieActors(movieId: string) {
    return this.populateMovieActors(movieId);
  }

  // Get all movie-actor relationships
  static async getAllMovieActors() {
    return mockMovieActors.map(ma => ({
      ...ma,
      movie: this.movies.find(m => m.id === ma.movieId),
      actor: mockActors.find(a => a.id === ma.actorId)
    }));
  }
}