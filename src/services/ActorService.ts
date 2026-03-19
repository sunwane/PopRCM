import { Actor } from '@/types/Actor';
import { mockActors } from '@/mocksData/mockActors';
import { mockMovieActors } from '@/mocksData/mockMovieActors';
import { mockMovies } from '@/mocksData/mockMovies';
import { Movie } from '@/types/Movies';

export class ActorService {
  private static actors: Actor[] = [...mockActors];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/actors`;

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Helper method để populate movieActors cho mock data
  private static populateActorMovies(actorId: string) {
    return mockMovieActors
      .filter(ma => ma.actorId === actorId)
      .map(ma => ({
        ...ma,
        movie: mockMovies.find(m => m.id === ma.movieId),
        actor: mockActors.find(a => a.id === ma.actorId)
      }))
      .filter(ma => ma.movie && ma.actor); // Chỉ giữ lại những record có đầy đủ thông tin
  }

  // Load mock data với movieActors được populate
  private static loadMockData(): void {
    this.actors = mockActors.map(actor => ({
      ...actor,
      movieActors: this.populateActorMovies(actor.id)
    }));
    this.isDataLoaded = true;
  }

  // Chuyển đổi ActorResponse từ API sang Actor interface
  private static mapActorResponseToActor(actorResponse: any): Actor {
    return {
      id: actorResponse.actorId,
      tmdbId: actorResponse.tmdbId?.toString(),
      originName: actorResponse.originName,
      profilePath: actorResponse.profilePath,
      gender: this.mapGenderFromNumber(actorResponse.gender),
      alsoKnownAs: actorResponse.alsoKnownAs || [],
      moviesCount: actorResponse.movieCount || 0
    };
  }

  // Chuyển đổi gender từ số sang string
  private static mapGenderFromNumber(genderNum: number): string {
    switch (genderNum) {
      case 1: return 'female';
      case 2: return 'male';
      default: return 'unknown';
    }
  }

  // Chuyển đổi MovieResponse từ API sang Movie interface
  private static mapMovieResponseToMovie(movieResponse: any): Movie {
    const { 
      id, title, originName, description = '', releaseYear, type = [], duration = '',
      posterUrl, thumbUrl, trailerUrl, totalEpisodes, director = [], status = [],
      createdAt, modifiedAt, views = 0, slug, tmdbScore, imdbScore, lang = [],
      actors = [], genres = [], countries = [], episodes = [], currentEpisodeCount = 0
    } = movieResponse;

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

  // Load data from API or mock
  private static async loadActorsData(
    page: number = 0,
    size: number = 24
  ): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.loadMockData(); // Sử dụng method mới
      return;
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
        this.actors = apiResponse.result.content.map((actorResponse: any) => 
          this.mapActorResponseToActor(actorResponse)
        );
        this.isDataLoaded = true;
        console.log('Loaded actors from API:', this.actors.length);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load actors from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.loadMockData(); // Sử dụng method mới
    }
  }

  // Get all actors - với pagination parameters và cập nhật để phù hợp với controller
  static async getAllActors(
    page: number = 0,
    size: number = 24
  ): Promise<{ actors: Actor[], totalElements: number }> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using local data for all actors');
      
      // Đảm bảo mock data được load
      if (!this.isDataLoaded) {
        this.loadMockData();
      }

      // Pagination cho mock data
      const start = page * size;
      const end = start + size;
      const paginatedActors = this.actors.slice(start, end);
      
      return {
        actors: paginatedActors,
        totalElements: this.actors.length
      };
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
      
      // API trả về Page<ActorResponse>, cần extract content và totalElements
      if (apiResponse.result && apiResponse.result.content) {
        const actors = apiResponse.result.content.map((actorResponse: any) =>
          this.mapActorResponseToActor(actorResponse)
        ) || [];
        
        return {
          actors,
          totalElements: apiResponse.result.totalElements || 0
        };
      }
      
      return {
        actors: apiResponse.result || [],
        totalElements: 0
      };
    } catch (error) {
      console.warn('Failed to get all actors from API, fallback to mock data:', error);
      
      // Fallback to mock data
      if (!this.isDataLoaded) {
        this.loadMockData();
      }

      // Pagination cho mock data
      const start = page * size;
      const end = start + size;
      const paginatedActors = this.actors.slice(start, end);
      
      return {
        actors: paginatedActors,
        totalElements: this.actors.length
      };
    }
  }

  // Get actor by ID
  static async getActorById(id: string): Promise<Actor | null> {
    if (!this.isServiceAvailable()) {
      // Đảm bảo mock data được load với movieActors
      if (!this.isDataLoaded) {
        this.loadMockData();
      }
      const actor = this.actors.find(a => a.id === id);
      if (actor) {
        // Tính số lượng phim
        const moviesCount = actor.movieActors?.length || 0;
        return {
          ...actor,
          moviesCount
        };
      }
      return null;
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
      
      if (apiResponse.result) {
        return this.mapActorResponseToActor(apiResponse.result);
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get actor from API, using local data:', error);
      // Fallback to mock data
      if (!this.isDataLoaded) {
        this.loadMockData();
      }
      const actor = this.actors.find(a => a.id === id);
      if (actor) {
        const moviesCount = actor.movieActors?.length || 0;
        return {
          ...actor,
          moviesCount
        };
      }
      return null;
    }
  }

  // Helper function to get movies by actor ID - Cập nhật để phù hợp với controller
  static async getMoviesByActorId(
    actorId: string, 
    page: number = 0, 
    size: number = 24
  ): Promise<Movie[]> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using local data to get movies by actor');
      
      // Đảm bảo mock data được load
      if (!this.isDataLoaded) {
        this.loadMockData();
      }

      // Tìm movies từ mockMovieActors và mockMovies
      const movieActorRelations = mockMovieActors.filter(ma => ma.actorId === actorId);
      const movies: Movie[] = [];

      for (const relation of movieActorRelations) {
        const movie = mockMovies.find(m => m.id === relation.movieId);
        if (movie) {
          movies.push(movie);
        }
      }

      // Thực hiện pagination local cho mock data
      const start = page * size;
      const end = start + size;
      return movies.slice(start, end);
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/${actorId}/movies?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // API trả về Page<MovieResponse>, cần extract content và map từng movie
      if (apiResponse.result && apiResponse.result.content) {
        return apiResponse.result.content.map((movieResponse: any) => 
          this.mapMovieResponseToMovie(movieResponse)
        ) || [];
      }
      return (apiResponse.result || []).map((movieResponse: any) => 
        this.mapMovieResponseToMovie(movieResponse)
      );
    } catch (error) {
      console.warn('Failed to get movies by actor from API, fallback to mock data:', error);
      
      // Fallback to mock data
      if (!this.isDataLoaded) {
        this.loadMockData();
      }

      // Tìm movies từ mockMovieActors và mockMovies
      const movieActorRelations = mockMovieActors.filter(ma => ma.actorId === actorId);
      const movies: Movie[] = [];

      for (const relation of movieActorRelations) {
        const movie = mockMovies.find(m => m.id === relation.movieId);
        if (movie) {
          movies.push(movie);
        }
      }

      // Thực hiện pagination local cho mock data
      const start = page * size;
      const end = start + size;
      return movies.slice(start, end);
    }
  }

  // Search actors - Cập nhật để phù hợp với controller
  static async searchActors(
    query: string, 
    page: number = 0, 
    size: number = 24
  ): Promise<{ actors: Actor[], totalElements: number }> {
    if (!query.trim()) {
      return await this.getAllActors(page, size);
    }

    if (!this.isServiceAvailable()) {
      console.info('API not available, using local search');
      if (!this.isDataLoaded) {
        this.loadMockData();
      }
      const searchTerm = query.toLowerCase().trim();
      const filteredActors = this.actors.filter(actor => 
        actor.originName.toLowerCase().includes(searchTerm) ||
        (actor.tmdbId ?? '').includes(searchTerm) ||
        (actor.alsoKnownAs ?? []).some(alias => alias.toLowerCase().includes(searchTerm))
      );
      
      // Thực hiện pagination local cho mock data
      const start = page * size;
      const end = start + size;
      const paginatedActors = filteredActors.slice(start, end);
      
      return {
        actors: paginatedActors,
        totalElements: filteredActors.length
      };
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/search?keyword=${encodeURIComponent(query)}&page=${page}&size=${size}`, {
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
        const actors = apiResponse.result.content.map((actorResponse: any) => 
          this.mapActorResponseToActor(actorResponse)
        );
        
        return {
          actors,
          totalElements: apiResponse.result.totalElements || 0
        };
      }
      
      return {
        actors: [],
        totalElements: 0
      };
      
    } catch (error) {
      console.warn('Search API failed, falling back to local search:', error);
      // Fallback to local search
      if (!this.isDataLoaded) {
        this.loadMockData();
      }
      const searchTerm = query.toLowerCase().trim();
      const filteredActors = this.actors.filter(actor => 
        actor.originName.toLowerCase().includes(searchTerm) ||
        (actor.tmdbId ?? '').includes(searchTerm) ||
        (actor.alsoKnownAs ?? []).some(alias => alias.toLowerCase().includes(searchTerm))
      );
      
      // Thực hiện pagination local cho mock data
      const start = page * size;
      const end = start + size;
      const paginatedActors = filteredActors.slice(start, end);
      
      return {
        actors: paginatedActors,
        totalElements: filteredActors.length
      };
    }
  }

  // Get movie count for actor - SỬA PHẦN NÀY
  static async getMovieCountByActor(actorId: string): Promise<number> {
    if (!this.isServiceAvailable()) {
      // Đếm từ mockMovieActors thay vì từ actor.movieActors
      const movieCount = mockMovieActors.filter(ma => ma.actorId === actorId).length;
      return movieCount;
    }

    // API call cho movie count
    try {
      const response = await fetch(`${this.API_BASE_URL}/${actorId}/movies/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const apiResponse = await response.json();
        return apiResponse.result || 0;
      }
    } catch (error) {
      console.warn('Movie count API failed, falling back to local count:', error);
    }

    // Fallback
    const movieCount = mockMovieActors.filter(ma => ma.actorId === actorId).length;
    return movieCount;
  }

  // Refresh data - Force reload from API
  static refreshData(): void {
    this.isDataLoaded = false;
  }

  // Reset to mock data
  static resetToMockData(): void {
    this.loadMockData();
  }
}