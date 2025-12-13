import { Movie } from '@/types/Movies';
import { mockMovies } from '@/mocksData/mockMovies';
import { mockActors } from '@/mocksData/mockActors';
import { mockMovieActors } from '@/mocksData/mockMovieActors';
import { mockSeriesMovies } from '@/mocksData/mockSeries';
import { mockEpisodes } from '@/mocksData/mockEpisodes';

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

  // Helper method to populate episodes for a movie (mock data only)
  private static populateMovieEpisodes(movieId: string) {
    return mockEpisodes
      .filter(ep => ep.movieId === movieId)
      .sort((a, b) => {
        // Sort by server name first, then by episode number
        if (a.serverName !== b.serverName) {
          return a.serverName.localeCompare(b.serverName);
        }
        return a.episodeNumber - b.episodeNumber;
      });
  }

  private static populateSeasonNumber(movieId: string) {
    const seriesMovie = mockSeriesMovies.find(sm => sm.movieId === movieId);
    return seriesMovie ? seriesMovie.seasonNumber : undefined;
  }

  // Helper method to load all mock data
  private static loadAllMockData(): Movie[] {
    return mockMovies.map(movie => movie);
  }

  // Helper method to filter and sort movies (reusable logic)
  private static filterAndSortMovies(
    movies: Movie[],
    filters: {
      query?: string;
      year?: number;
      type?: string;
      status?: string;
      language?: string;
      genreIds?: string[];
      countryId?: string;
      sortBy?: string;
    }
  ): Movie[] {
    const { query = "", year, type, status, language, genreIds = [], countryId, sortBy } = filters;
    const searchTerm = query.toLowerCase().trim();

    // Normalize filters
    const filterType = type === "all" ? undefined : type;
    const filterStatus = status === "all" ? undefined : status;
    const filterLanguage = language === "all" ? undefined : language;
    const filterCountryId = countryId === "all" ? undefined : countryId;
    const effectiveGenreIds = Array.isArray(genreIds) ? genreIds.filter(id => id !== "all") : [];

    // Apply filters
    const filteredMovies = movies.filter((movie) => {
      const matchesQuery = !searchTerm ||
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.originalName.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm);

      const matchesYear = !year || movie.releaseYear === year;
      const matchesType = !filterType || movie.type === filterType;
      const matchesStatus = !filterStatus || movie.status === filterStatus;
      const matchesLanguage = !filterLanguage || movie.lang === filterLanguage;
      
      const matchesGenres = effectiveGenreIds.length === 0 ||
        effectiveGenreIds.every((genreId) => movie.genres.some((genre) => genre.id === genreId));
      
      const matchesCountry = !filterCountryId || movie.country.some((c) => c.id === filterCountryId);

      return matchesQuery && matchesYear && matchesType && matchesStatus && 
             matchesLanguage && matchesGenres && matchesCountry;
    });

    // Apply sorting
    if (sortBy === "Nhiều lượt xem") {
      filteredMovies.sort((a, b) => b.view - a.view);
    } else if (sortBy === "Điểm IMDB") {
      filteredMovies.sort((a, b) => (b.imdbScore || 0) - (a.imdbScore || 0));
    } else if (sortBy === "Điểm TMDB") {
      filteredMovies.sort((a, b) => (b.tmdbScore || 0) - (a.tmdbScore || 0));
    } else if (sortBy === "Mới nhất") {
      filteredMovies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filteredMovies;
  }

  // Load data from API or mock
  private static async loadMoviesData(
    page: number = 0,
    size: number = 24
  ): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.movies = this.loadAllMockData();
      this.isDataLoaded = true;
      return;
    }

    try {
      // Load movies with pagination
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
        this.movies = apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
        this.isDataLoaded = true;
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load movies from API, using mock data:', error);
      // Fallback to mock data với đầy đủ relations
      this.movies = this.loadAllMockData();
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
  static async getAllMovies(page: number = 0, size: number = 24): Promise<Movie[]> {
    await this.loadMoviesData(page, size);
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
    size = 24,
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
    // Load dữ liệu - nếu dùng mock thì load toàn bộ, nếu dùng API thì chỉ cần load theo pagination
    const loadSize = this.isServiceAvailable() ? size : 1000;
    await this.loadMoviesData(0, loadSize);

    const searchTerm = query.toLowerCase().trim();

    // Normalize filters: nếu truyền "all" => coi như không lọc (ignore)
    const filterType = type === "all" ? undefined : type;
    const filterStatus = status === "all" ? undefined : status;
    const filterLanguage = language === "all" ? undefined : language;
    const filterCountryId = countryId === "all" ? undefined : countryId;
    const effectiveGenreIds = Array.isArray(genreIds) ? genreIds.filter(id => id !== "all") : [];

    // Nếu sử dụng API, gọi API với phân trang
    if (this.isServiceAvailable()) {
      try {
        const authToken = localStorage.getItem('authToken');
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          ...(query && { query }),
          ...(year && { year: year.toString() }),
          ...(filterType && { type: filterType }),
          ...(filterStatus && { status: filterStatus }),
          ...(filterLanguage && { language: filterLanguage }),
          ...(filterCountryId && { countryId: filterCountryId }),
          ...(sortBy && { sortBy }),
        });

        // Thêm genreIds nếu có
        if (effectiveGenreIds.length > 0) {
          effectiveGenreIds.forEach(genreId => params.append('genreIds', genreId));
        }

        const response = await fetch(`${this.API_BASE_URL}/filter?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          const apiResponse = await response.json();
          if (apiResponse.result && apiResponse.result.content) {
            return {
              movies: apiResponse.result.content.map((movieResponse: any) => 
                this.mapMovieResponseToMovie(movieResponse)
              ),
              totalCount: apiResponse.result.totalElements || 0,
              totalPages: apiResponse.result.totalPages || 1
            };
          }
        }
      } catch (error) {
        console.warn('Filter API failed, falling back to local filtering:', error);
      }
    }

    // Fallback to local filtering for mock data
    const filteredMovies = this.filterAndSortMovies(this.movies, {
      query,
      year,
      type: filterType,
      status: filterStatus,
      language: filterLanguage,
      genreIds: effectiveGenreIds,
      countryId: filterCountryId,
      sortBy
    });

    // Tính toán phân trang cho mock data
    const totalCount = filteredMovies.length;
    const totalPages = Math.ceil(totalCount / size) || 1;
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
    const loadSize = this.isServiceAvailable() ? 24 : 1000;
    await this.loadMoviesData(0, loadSize);
    const movie = this.movies.find(movie => movie.id === id);

    if (!movie) return null;

    // Nếu dùng mock data thì trả về movie đã populate đầy đủ relations
    if (!this.isServiceAvailable()) {
      return {
        ...movie,
        actors: this.populateMovieActors(movie.id),
        episodes: this.populateMovieEpisodes(movie.id),
        seasonNumber: this.populateSeasonNumber(movie.id),
      };
    }

    // Nếu dùng API thì trả về movie như bình thường (đã có relations từ API)
    return movie;
  }

  // Search movies with API integration
  static async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) {
      return await this.getAllMovies();
    }

    if (!this.isServiceAvailable()) {
      await this.loadMoviesData(0, 1000);
      return this.filterAndSortMovies(this.movies, { query });
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
      await this.loadMoviesData(0, 1000);
      return this.filterAndSortMovies(this.movies, { query });
    }
  }

  // Get recent movies
  static async getRecentMovies(limit: number = 10): Promise<Movie[]> {
    // Chỉ load toàn bộ khi dùng mock data để sort, API có thể sort trực tiếp
    const loadSize = this.isServiceAvailable() ? 24 : 1000;
    await this.loadMoviesData(0, loadSize);
    const sortedMovies = [...this.movies]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return sortedMovies;
  }

  // Get popular movies (by view count)
  static async getPopularMovies(limit: number = 10): Promise<Movie[]> {
    // Chỉ load toàn bộ khi dùng mock data để sort, API có thể sort trực tiếp
    const loadSize = this.isServiceAvailable() ? 24 : 1000;
    await this.loadMoviesData(0, loadSize);
    const sortedMovies = [...this.movies]
      .sort((a, b) => b.view - a.view)
      .slice(0, limit);
    
    return sortedMovies;
  }

  // Get top rated movies
  static async getTopRatedMovies(limit: number = 10): Promise<Movie[]> {
    // Chỉ load toàn bộ khi dùng mock data để sort, API có thể sort trực tiếp
    const loadSize = this.isServiceAvailable() ? 24 : 1000;
    await this.loadMoviesData(0, loadSize);

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

  static async getMostViewedMoviesOfWeek(limit: number = 10): Promise<Movie[]> {
    return this.getPopularMovies(limit);
  }

  static async getMostViewedMoviesOfMonth(limit: number = 10): Promise<Movie[]> {
    return this.getPopularMovies(limit);
  }

  static async getMoviesFromGenreSlug(genreSlug: string, limit: number = 9): Promise<Movie[]> {
    await this.loadMoviesData(0, 1000);
    const moviesFromGenre = this.movies.filter(movie => 
      movie.genres.some(genre => genre.id === genreSlug)
    ).slice(0, limit);
    return moviesFromGenre;
  }

  // Helper method for unique value extraction (generic)
  private static async getUniqueValues<T>(
    endpoint: string,
    extractorFn: (movie: Movie) => T | T[],
    fallbackErrorMsg: string
  ): Promise<T[]> {
    if (this.isServiceAvailable()) {
      try {
        const response = await fetch(`${this.API_BASE_URL}/${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const apiResponse = await response.json();
          if (apiResponse.result && Array.isArray(apiResponse.result)) {
            return apiResponse.result.filter(Boolean);
          }
        }
      } catch (error) {
        console.warn(`${fallbackErrorMsg}:`, error);
      }
    }
    
    await this.loadMoviesData(0, 1000);
    const allValues = this.movies.flatMap(movie => {
      const value = extractorFn(movie);
      return Array.isArray(value) ? value : [value];
    });
    return [...new Set(allValues)].filter(Boolean);
  }

  // Get unique release years
  static async getUniqueReleaseYears(): Promise<number[]> {
    const years = await this.getUniqueValues(
      'years',
      (movie) => movie.releaseYear,
      'Years API failed, falling back to local data'
    );
    return years.sort((a, b) => b - a);
  }

  // Get unique types
  static async getUniqueTypes(): Promise<string[]> {
    return this.getUniqueValues(
      'types',
      (movie) => movie.type,
      'Types API failed, falling back to local data'
    );
  }

  // Get unique statuses
  static async getUniqueStatuses(): Promise<string[]> {
    return this.getUniqueValues(
      'statuses',
      (movie) => movie.status,
      'Statuses API failed, falling back to local data'
    );
  }

  // Get unique languages
  static async getUniqueLanguages(): Promise<string[]> {
    return this.getUniqueValues(
      'languages',
      (movie) => movie.lang,
      'Languages API failed, falling back to local data'
    );
  }

  // Get actors for a specific movie
  static async getMovieActors(movieId: string) {
    return this.populateMovieActors(movieId);
  }

  // Get movies by season number (mock data only)
  static async getMoviesBySeasonNumber(seasonNumber: number): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      await this.loadMoviesData(0, 1000);
      const movieIds = mockSeriesMovies
        .filter(sm => sm.seasonNumber === seasonNumber)
        .map(sm => sm.movieId);
      
      return this.movies.filter(movie => movieIds.includes(movie.id));
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/season/${seasonNumber}`, {
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
      
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        return apiResponse.result.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
      
    } catch (error) {
      console.warn('Failed to get movies by season from API, fallback to mock data:', error);
      
      await this.loadMoviesData(0, 1000);
      const movieIds = mockSeriesMovies
        .filter(sm => sm.seasonNumber === seasonNumber)
        .map(sm => sm.movieId);
      
      return this.movies.filter(movie => movieIds.includes(movie.id));
    }
  }

  // Get recommended movies with simple algorithm: same genre + sorted by rating
  static async getRecommendedMovies(movieId: string, limit: number = 10): Promise<Movie[]> {
    await this.loadMoviesData(0, 1000);
    
    // Tìm phim gốc
    const sourceMovie = this.movies.find(movie => movie.id === movieId);
    if (!sourceMovie) return [];
    
    // Lấy danh sách genre IDs của phim gốc
    const sourceGenreIds = sourceMovie.genres.map(genre => genre.id);
    
    // Lọc phim cùng thể loại, sắp xếp theo điểm, lấy top 10
    const recommendedMovies = this.movies
      .filter(movie => {
        // Loại trừ chính phim đó
        if (movie.id === movieId) return false;
        
        // Kiểm tra xem có ít nhất 1 thể loại giống nhau không
        return movie.genres.some(genre => sourceGenreIds.includes(genre.id));
      })
      .sort((a, b) => {
        // Tính điểm trung bình (ưu tiên TMDB, fallback IMDB)
        const scoreA = a.tmdbScore || a.imdbScore || 0;
        const scoreB = b.tmdbScore || b.imdbScore || 0;
        
        // Sắp xếp theo điểm cao xuống thấp
        return scoreB - scoreA;
      })
      .slice(0, limit); // Lấy top 10 (hoặc theo limit)
  
    return recommendedMovies;
  }

  // Get top viewed movies for ranking (alias for getMostViewedMoviesOfWeek)
  static async getTopViewedMoviesRanking(limit: number = 10): Promise<Movie[]> {
    return this.getMostViewedMoviesOfWeek(limit);
  }

  // Get top favorites movies for ranking (mock data - shuffle popular movies)
  static async getTopFavoritesMoviesRanking(limit: number = 10): Promise<Movie[]> {
    try {
      await this.loadMoviesData(0, 1000);
      // Tạo mock favorites ranking bằng cách shuffle và lấy random từ popular movies
      const shuffled = [...this.movies]
        .sort((a, b) => b.view - a.view) // Lấy movies có view cao
        .slice(0, 30) // Lấy top 30 để shuffle
        .sort(() => Math.random() - 0.5) // Random shuffle
        .slice(0, limit);
      
      return shuffled;
    } catch (error) {
      console.error('Error fetching top favorites movies ranking:', error);
      return [];
    }
  }

  // Get top comments movies for ranking (mock data - shuffle by different criteria)
  static async getTopCommentsMoviesRanking(limit: number = 10): Promise<Movie[]> {
    try {
      await this.loadMoviesData(0, 1000);
      // Tạo mock comments ranking bằng cách shuffle movies theo rating
      const shuffled = [...this.movies]
        .filter(movie => (movie.imdbScore || 0) > 0 || (movie.tmdbScore || 0) > 0) // Movies có rating
        .sort((a, b) => {
          const aScore = ((a.imdbScore || 0) + (a.tmdbScore || 0)) / 2;
          const bScore = ((b.imdbScore || 0) + (b.tmdbScore || 0)) / 2;
          return bScore - aScore;
        })
        .slice(0, 30) // Lấy top 30 để shuffle
        .sort(() => Math.random() - 0.5) // Random shuffle
        .slice(0, limit);
      
      return shuffled;
    } catch (error) {
      console.error('Error fetching top comments movies ranking:', error);
      return [];
    }
  }
}