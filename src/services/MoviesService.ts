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
      console.warn('Failed to load movies from API', error);
      throw error;
    }
  }

  // Cải thiện hàm mapping để phù hợp với MovieResponse DTO từ backend
  public static mapMovieResponseToMovie(res: any): Movie {
    const { 
      id, title, originName, description = '', releaseYear, type = [], duration = '',
      posterUrl, thumbUrl, trailerUrl, totalEpisodes, director = [], status = [],
      createdAt, modifiedAt, views = 0, slug, tmdbScore, imdbScore, lang = [],
      actors = [], genres = [], countries = [], episodes = [], currentEpisodeCount = 0
    } = res;

    return {
      id,
      title,
      originalName: originName || title, // Giữ originalName từ originName
      description,
      releaseYear: releaseYear || 0,
      type: Array.isArray(type) ? type[0] || '' : (type || ''), // Lấy type đầu tiên
      duration: duration || '',
      // Sửa lại URL mapping - posterUrl là poster chính, thumbUrl là thumbnail
      posterUrl: thumbUrl,
      thumbnailUrl: posterUrl,
      trailerUrl: trailerUrl || '',
      // Parse totalEpisodes nếu là string có format "24 Tập"
      totalEpisodes: totalEpisodes ? (
        typeof totalEpisodes === 'string' 
          ? parseInt(totalEpisodes.replace(/\D/g, '')) || undefined
          : totalEpisodes
      ) : undefined,
      currentEpisode: currentEpisodeCount || 0,
      // Director: join array thành string
      director: Array.isArray(director) ? director.join(', ') : (director || ''),
      // Status: lấy status đầu tiên từ array
      status: Array.isArray(status) ? status[0] || '' : (status || ''),
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      modifiedAt: modifiedAt ? new Date(modifiedAt) : new Date(),
      view: views || 0,
      slug: slug || '',
      tmdbScore: tmdbScore || undefined,
      imdbScore: imdbScore || undefined,
      // Lang: lấy language đầu tiên từ array
      lang: Array.isArray(lang) ? lang[0] || '' : (lang || ''),
      // Map countries từ CountryResponse
      country: countries?.map((c: any) => ({ 
        id: c.id || '', 
        name: c.name || '' 
      })) || [],
      // Map actors từ ActorResponse
      actors: actors?.map((a: any) => ({
        actorId: a.actorId || a.id || '',
        originName: a.originName || a.name || '',
        characterName: a.characterName || '',
        profilePath: a.profilePath || '',
        alsoKnownAs: a.alsoKnownAs || null,
        genderDisplay: a.genderDisplay || null,
        tmdbId: a.tmdbId || null
      })) || [],
      // Map genres từ GenreResponse
      genres: genres?.map((g: any) => ({ 
        id: g.id || '', 
        genresName: g.genresName || g.name || '' 
      })) || [],
      // Map episodes từ EpisodeResponse
      episodes: episodes?.map((e: any) => ({
        id: e.id || '',
        title: e.title || `Tập ${e.episodeNumber || 1}`,
        episodeNumber: e.episodeNumber || 0,
        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
        videoUrl: e.videoUrl || '',
        m3u8Url: e.m3u8Url || '',
        serverName: e.serverName || 'Vietsub', // Default server name
        movieId: e.movieId || id, // Đảm bảo có movieId
        movieTitle: e.movieTitle || '',
        movieSlug: e.movieSlug || ''
      })) || []
    };
  }

  // Get all movies
  static async getAllMovies(page: number = 0, size: number = 24): Promise<Movie[]> {
    await this.loadMoviesData(page, size);
    return this.movies;
  }

    // Hàm tổng quát để lọc phim với API thật
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
    
    if (!this.isServiceAvailable()) {
      // Fallback to mock data logic
      await this.loadMoviesData(0, 1000);
      const filteredMovies = this.filterAndSortMovies(this.movies, {
        query, year, type, status, language, genreIds, countryId, sortBy
      });
      
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
      
      return {
        movies: paginatedMovies,
        totalCount: filteredMovies.length,
        totalPages: Math.ceil(filteredMovies.length / size)
      };
    }

    try {
      // API thật với endpoint /api/movies/filter - match với MovieFilterRequest backend
      const filterRequest: any = {};
      
      // Chỉ add các field có giá trị
      if (query && query.trim()) {
        filterRequest.query = query.trim();
      }
      
      if (year) {
        filterRequest.releaseYear = year;
      }
      
      if (type && type !== "all") {
        filterRequest.types = [type];
      }
      
      if (status && status !== "all") {
        filterRequest.statuses = [status];
      }
      
      if (language && language !== "all") {
        filterRequest.languages = [language];
      }
      
      if (genreIds && genreIds.length > 0 && !genreIds.includes("all")) {
        filterRequest.genreIds = genreIds;
      }
      
      if (countryId && countryId !== "all") {
        filterRequest.countryIds = [countryId];
      }
      
      if (sortBy) {
        // Map sort options to backend format
        switch(sortBy) {
          case "Nhiều lượt xem":
            filterRequest.sortBy = "views";
            filterRequest.sortDirection = "desc";
            break;
          case "Điểm IMDB":
            filterRequest.sortBy = "imdbScore";
            filterRequest.sortDirection = "desc";
            break;
          case "Điểm TMDB":
            filterRequest.sortBy = "tmdbScore";
            filterRequest.sortDirection = "desc";
            break;
          case "Mới nhất":
            filterRequest.sortBy = "updatedAt";
            filterRequest.sortDirection = "desc";
            break;
          default:
            filterRequest.sortBy = "updatedAt";
            filterRequest.sortDirection = "desc";
        }
      }

      const response = await fetch(`${this.API_BASE_URL}/filter?page=${page}&size=${size}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        const movies = apiResponse.result.content.map(this.mapMovieResponseToMovie);
        return {
          movies,
          totalCount: apiResponse.result.totalElements,
          totalPages: apiResponse.result.totalPages
        };
      }
      
      throw new Error('Invalid API response format');
      
    } catch (error) {
      console.warn('API failed for getFilteredMovies, falling back to mock data...', error);
      // Fallback to mock data
      await this.loadMoviesData(0, 1000);
      
      const filteredMovies = this.filterAndSortMovies(this.movies, {
        query, year, type, status, language, genreIds, countryId, sortBy
      });
      
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
      
      return {
        movies: paginatedMovies,
        totalCount: filteredMovies.length,
        totalPages: Math.ceil(filteredMovies.length / size)
      };
    }
  }

  // Get movie by ID
  static async getMovieById(id: string): Promise<Movie | null> {
    try {
      // Gọi API thật để lấy chi tiết phim
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Movie not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      return this.mapMovieResponseToMovie(apiResponse.result);    

    } catch (error) {
      console.warn('API failed for getMovieById, falling back to mock data...', error);
      // Fallback to mock data
      const loadSize = 1000;
      await this.loadMoviesData(0, loadSize);
      const movie = this.movies.find(movie => movie.id === id);

      if (!movie) return null;

      return {
        ...movie,
        actors: this.populateMovieActors(movie.id),
        episodes: this.populateMovieEpisodes(movie.id),
        seasonNumber: this.populateSeasonNumber(movie.id),
      };
    }
  }

  // Search movies with API integration
  static async searchMovies(query: string, size: number = 5): Promise<Movie[]> {
    if (!query.trim()) {
      return await this.getAllMovies();
    }

    if (!this.isServiceAvailable()) {
      await this.loadMoviesData(0, 1000);
      return this.filterAndSortMovies(this.movies, { query });
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=0&size=${size}`, {
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
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
      
    } catch (error) {
      console.warn('Search API failed', error);
      throw error;
    }
  }

  // Get popular movies (by view count)
  static async getPopularMovies(limit: number = 10): Promise<Movie[]> {
    const loadSize = this.isServiceAvailable() ? 24 : 1000;
    await this.loadMoviesData(0, loadSize);
    const sortedMovies = [...this.movies]
      .sort((a, b) => b.view - a.view)
      .slice(0, limit);
    
    return sortedMovies;
  }

  static async getMostViewedMoviesOfWeek(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      return this.getPopularMovies(limit);
    }

    return this.getMostViewedMoviesOfMonth(limit);
  }

  static async getMostViewedMoviesOfMonth(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      return this.getPopularMovies(limit);
    }

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // getMonth() returns 0-11
      const currentYear = currentDate.getFullYear();

      const response = await fetch(`${this.API_BASE_URL}/top/views?month=${currentMonth}&year=${currentYear}&size=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.result && apiResponse.result.content.length === 0) {
        return this.getPopularMovies(limit);
      }
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  static async getMoviesFromGenreSlug(genreSlug: string, limit: number = 9): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      await this.loadMoviesData(0, 1000);
      const moviesFromGenre = this.movies.filter(movie => 
        movie.genres.some(genre => genre.id === genreSlug)
      ).slice(0, limit);
      return moviesFromGenre;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/genre/${genreSlug}?page=0&size=${limit}`, {
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
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
    } catch (error) {
      console.warn('API failed for getMoviesFromGenreSlug, falling back to mock...', error);
      await this.loadMoviesData(0, 1000);
      const moviesFromGenre = this.movies.filter(movie => 
        movie.genres.some(genre => genre.id === genreSlug)
      ).slice(0, limit);
      return moviesFromGenre;
    }
  }

  // Helper method for unique value extraction (generic)
  private static async getUniqueValues<T>(
    extractorFn: (movie: Movie) => T | T[],
  ): Promise<T[]> {
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
      (movie) => movie.releaseYear,
    );
    return years.sort((a, b) => b - a);
  }

  // Get unique types
  static async getUniqueTypes(): Promise<string[]> {
    return this.getUniqueValues(
      (movie) => movie.type,
    );
  }

  // Get unique statuses
  static async getUniqueStatuses(): Promise<string[]> {
    return this.getUniqueValues(
      (movie) => movie.status,
    );
  }

  // Get unique languages
  static async getUniqueLanguages(): Promise<string[]> {
    return this.getUniqueValues(
      (movie) => movie.lang,
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
    if (!this.isServiceAvailable()) {
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

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/recommendations?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        // If unauthorized, try getting related movies instead
        if (response.status === 401 || response.status === 403) {
          return this.getRelatedMovies(movieId, limit);
        }
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
      console.warn('API failed for getRecommendedMovies, falling back to related movies...', error);
      return this.getRelatedMovies(movieId, limit);
    }
  }

  // Get related movies (public endpoint)
  static async getRelatedMovies(movieId: string, limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      // Fallback to mock logic similar to recommendations
      await this.loadMoviesData(0, 1000);
      const sourceMovie = this.movies.find(movie => movie.id === movieId);
      if (!sourceMovie) return [];
      
      const sourceGenreIds = sourceMovie.genres.map(genre => genre.id);
      
      return this.movies
        .filter(movie => {
          if (movie.id === movieId) return false;
          return movie.genres.some(genre => sourceGenreIds.includes(genre.id));
        })
        .sort((a, b) => {
          const scoreA = a.tmdbScore || a.imdbScore || 0;
          const scoreB = b.tmdbScore || b.imdbScore || 0;
          return scoreB - scoreA;
        })
        .slice(0, limit);
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/${movieId}/related`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      console.warn('API failed for getRelatedMovies, falling back to mock...', error);
      // Fallback to mock logic
      await this.loadMoviesData(0, 1000);
      const sourceMovie = this.movies.find(movie => movie.id === movieId);
      if (!sourceMovie) return [];
      
      const sourceGenreIds = sourceMovie.genres.map(genre => genre.id);
      
      return this.movies
        .filter(movie => {
          if (movie.id === movieId) return false;
          return movie.genres.some(genre => sourceGenreIds.includes(genre.id));
        })
        .sort((a, b) => {
          const scoreA = a.tmdbScore || a.imdbScore || 0;
          const scoreB = b.tmdbScore || b.imdbScore || 0;
          return scoreB - scoreA;
        })
        .slice(0, limit);
    }
  }

  // Get top viewed movies for ranking (alias for getMostViewedMoviesOfWeek)
  static async getTopViewedMoviesRanking(limit: number = 10): Promise<Movie[]> {
    return this.getMostViewedMoviesOfMonth(limit);
  }

  // Get top favorites movies for ranking
  static async getTopFavoritesMoviesRanking(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
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

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const response = await fetch(`${this.API_BASE_URL}/top/favorite?month=${currentMonth}&year=${currentYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('API response for top favorites movies ranking:', apiResponse);

      if (apiResponse.result && apiResponse.result.content.length === 0) {
        return this.getPopularMovies(limit);
      }
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
    } catch (error) {
      console.warn('API failed for getTopFavoritesMoviesRanking, falling back to mock...', error);
      return [];
    }
  }

  // Get top comments movies for ranking
  static async getTopCommentsMoviesRanking(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
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

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const response = await fetch(`${this.API_BASE_URL}/top/comment?month=${currentMonth}&year=${currentYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log('API response for top comments movies ranking:', apiResponse);

      if (apiResponse.result && apiResponse.result.content.length === 0) {
        return this.getPopularMovies(limit);
      }
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        );
      }
      return [];
    } catch (error) {
      console.warn('API failed for getTopCommentsMoviesRanking, falling back to mock...', error);
      return [];
    }
  }

  // Get top viewed series this week
  static async getTopViewedSeriesThisWeek(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      console.log('Using mock data for top viewed series this week');
      return [...mockMovies]
        .filter(movie => movie.type === 'series')
        .sort((a, b) => b.view - a.view)
        .slice(0, limit);
    }

    try {
      console.log('Fetching top viewed series this week from API...');
      const response = await fetch(`${this.API_BASE_URL}/top/week/series`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.result && apiResponse.result.length === 0) {
        return this.getPopularMovies(limit);
      }
      
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        console.log('✅ Top viewed series this week fetched successfully from API');
        return apiResponse.result.map((movie: any) => this.mapMovieResponseToMovie(movie)).slice(0, limit);
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (error) {
      return [];
    }
  }

  // Get top viewed single movies this week
  static async getTopViewedSinglesThisWeek(limit: number = 10): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      console.log('Using mock data for top viewed singles this week');
      return [...mockMovies]
        .filter(movie => movie.type === 'single')
        .sort((a, b) => b.view - a.view)
        .slice(0, limit);
    }

    try {
      console.log('Fetching top viewed singles this week from API...');
      const response = await fetch(`${this.API_BASE_URL}/top/week/single`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.result && apiResponse.result.length === 0) {
        return this.getPopularMovies(limit);
      }
      
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        console.log('✅ Top viewed singles this week fetched successfully from API');
        return apiResponse.result.map((movie: any) => this.mapMovieResponseToMovie(movie)).slice(0, limit);
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (error) {
      return [];
    }
  }

  // Get anime movies
  static async getAnimeMovies(limit: number = 15): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      console.log('Using mock data for anime movies');
      return [...mockMovies]
        .filter(movie => 
          movie.country.some(c => c.name.toLowerCase().includes('nhật bản')) &&
          movie.genres.some(g => g.genresName.toLowerCase().includes('hoạt hình'))
        )
        .sort((a, b) => b.view - a.view)
        .slice(0, limit);
    }

    try {
      console.log('Fetching anime movies from API...');
      const response = await fetch(`${this.API_BASE_URL}/anime`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result && Array.isArray(apiResponse.result)) {
        console.log('✅ Anime movies fetched successfully from API');
        return apiResponse.result.map((movie: any) => this.mapMovieResponseToMovie(movie)).slice(0, limit);
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (error) {
      console.warn('Anime movies API failed, using mock data:', error);
      return [...mockMovies]
        .filter(movie => 
          movie.country.some(c => c.name.toLowerCase().includes('nhật bản')) &&
          movie.genres.some(g => g.genresName.toLowerCase().includes('hoạt hình'))
        )
        .sort((a, b) => b.view - a.view)
        .slice(0, limit);
    }
  }
}

// Export utility function for external use
export const mapMovieResponseToMovie = MoviesService.mapMovieResponseToMovie;