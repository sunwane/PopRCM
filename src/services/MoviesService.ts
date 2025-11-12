import { Movie } from '@/types/Movies';
import { mockMovies } from '@/mocksData/mockMovies';
import { mockActors } from '@/mocksData/mockActors';
import { mockMovieActors } from '@/mocksData/mockMovieActors';

export class MoviesService {
  private static movies: Movie[] = [...mockMovies]; // Initialize with mock data
  private static isDataLoaded = true; // Set to true since we're using mock data

  // Helper method to populate movie actors
  private static populateMovieActors(movieId: number) {
    return mockMovieActors
      .filter(ma => ma.movieId === movieId)
      .map(ma => ({
        ...ma,
        movie: this.movies.find(m => m.id === ma.movieId),
        actor: mockActors.find(a => a.id === ma.actorId)
      }));
  }

  // Load data from mock (can be extended to API later)
  private static loadMoviesData(): void {
    if (this.isDataLoaded) return;
    
    // Populate movies with actors relationship
    this.movies = mockMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
    
    this.isDataLoaded = true;
  }

  // Get all movies
  static async getAllMovies(): Promise<Movie[]> {
    this.loadMoviesData();
    return this.movies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get movie by ID
  static async getMovieById(id: number): Promise<Movie | null> {
    this.loadMoviesData();
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

  // Add new movie
  static async addMovie(movieData: Omit<Movie, 'id' | 'createdAt' | 'modifiedAt' | 'slug'>): Promise<Movie> {
    this.loadMoviesData();
    
    const newMovie: Movie = {
      id: Math.max(...this.movies.map(m => m.id), 0) + 1,
      ...movieData,
      createdAt: new Date(),
      modifiedAt: new Date(),
      slug: this.generateSlug(movieData.title),
      view: 0,
      actors: []
    };
    
    this.movies.push(newMovie);
    return newMovie;
  }

  // Update movie
  static async updateMovie(id: number, movieData: Partial<Movie>): Promise<Movie | null> {
    this.loadMoviesData();
    
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index === -1) return null;
    
    // Update slug if title changed
    if (movieData.title && movieData.title !== this.movies[index].title) {
      movieData.slug = this.generateSlug(movieData.title);
    }
    
    this.movies[index] = {
      ...this.movies[index],
      ...movieData,
      modifiedAt: new Date()
    };
    
    return {
      ...this.movies[index],
      actors: this.populateMovieActors(id)
    };
  }

  // Delete movie
  static async deleteMovie(id: number): Promise<boolean> {
    this.loadMoviesData();
    
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index === -1) return false;
    
    this.movies.splice(index, 1);
    return true;
  }

  // Check if movie title exists
  static async checkMovieTitleExists(title: string, excludeId?: number): Promise<boolean> {
    this.loadMoviesData();
    
    return this.movies.some(movie => 
      movie.title.toLowerCase() === title.toLowerCase() && 
      movie.id !== excludeId
    );
  }

  // Search movies
  static async searchMovies(query: string): Promise<Movie[]> {
    this.loadMoviesData();
    
    if (!query.trim()) return this.getAllMovies();
    
    const searchTerm = query.toLowerCase().trim();
    const filteredMovies = this.movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.originalName.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm)
    );

    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Filter by release year
  static async filterByYear(year: number): Promise<Movie[]> {
    this.loadMoviesData();
    const filteredMovies = this.movies.filter(movie => movie.releaseYear === year);
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Filter by type
  static async filterByType(type: string): Promise<Movie[]> {
    this.loadMoviesData();
    if (type === 'all') return this.getAllMovies();
    const filteredMovies = this.movies.filter(movie => movie.type === type);
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Filter by status
  static async filterByStatus(status: string): Promise<Movie[]> {
    this.loadMoviesData();
    if (status === 'all') return this.getAllMovies();
    const filteredMovies = this.movies.filter(movie => movie.status === status);
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Filter by language
  static async filterByLanguage(lang: string): Promise<Movie[]> {
    this.loadMoviesData();
    if (lang === 'all') return this.getAllMovies();
    const filteredMovies = this.movies.filter(movie => movie.lang === lang);
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get movies by genre
  static async getMoviesByGenre(genreId: string): Promise<Movie[]> {
    this.loadMoviesData();
    const filteredMovies = this.movies.filter(movie => 
      movie.genres.some(genre => genre.id === genreId)
    );
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
  }

  // Get movies by country
  static async getMoviesByCountry(countryId: string): Promise<Movie[]> {
    this.loadMoviesData();
    const filteredMovies = this.movies.filter(movie => 
      movie.country.some(country => country.id === countryId)
    );
    return filteredMovies.map(movie => ({
      ...movie,
      actors: this.populateMovieActors(movie.id)
    }));
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

  // Get movies statistics
  static async getMoviesStats(): Promise<{
    total: number;
    totalMovies: number;
    totalSeries: number;
    totalAnime: number;
    totalViews: number;
    averageRating: number;
    recentlyAdded: number;
    ongoingSeries: number;
    completedMovies: number;
  }> {
    this.loadMoviesData();
    
    const total = this.movies.length;
    const totalMovies = this.movies.filter(m => m.type === 'Movie').length;
    const totalSeries = this.movies.filter(m => m.type === 'Series').length;
    const totalAnime = this.movies.filter(m => m.type === 'hoathinh').length;
    const totalViews = this.movies.reduce((sum, movie) => sum + movie.view, 0);
    const averageRating = total > 0 
    ? this.movies.reduce((sum, movie) => {
        const imdbScore = movie.imdbScore || 0; // Nếu không có imdbScore, dùng 0
        const tmdbScore = movie.tmdbScore || 0; // Nếu không có tmdbScore, dùng 0
        const scoreCount = (movie.imdbScore ? 1 : 0) + (movie.tmdbScore ? 1 : 0); // Đếm số điểm hợp lệ
        const averageScore = scoreCount > 0 ? (imdbScore + tmdbScore) / scoreCount : 0; // Tính trung bình nếu có điểm
        return sum + averageScore; // Cộng vào tổng
      }, 0) / total // Chia cho tổng số phim
    : 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyAdded = this.movies.filter(m => new Date(m.createdAt) >= thirtyDaysAgo).length;
    
    const ongoingSeries = this.movies.filter(m => m.status === 'Ongoing').length;
    const completedMovies = this.movies.filter(m => m.status === 'Completed').length;
    
    return {
      total,
      totalMovies,
      totalSeries,
      totalAnime,
      totalViews,
      averageRating: Math.round(averageRating * 10) / 10,
      recentlyAdded,
      ongoingSeries,
      completedMovies
    };
  }

  // Increment view count
  static async incrementViewCount(id: number): Promise<Movie | null> {
    this.loadMoviesData();
    
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index === -1) return null;
    
    this.movies[index].view += 1;
    this.movies[index].modifiedAt = new Date();
    
    return {
      ...this.movies[index],
      actors: this.populateMovieActors(id)
    };
  }

  // Get unique release years
  static async getUniqueReleaseYears(): Promise<number[]> {
    this.loadMoviesData();
    const years = [...new Set(this.movies.map(movie => movie.releaseYear))];
    return years.sort((a, b) => b - a);
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

  // Helper method to generate slug
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Refresh data
  static refreshData(): void {
    this.movies = [...mockMovies];
    this.isDataLoaded = true;
  }

  // Bulk operations
  static async bulkUpdateStatus(movieIds: number[], status: string): Promise<Movie[]> {
    this.loadMoviesData();
    
    const updatedMovies: Movie[] = [];
    for (const id of movieIds) {
      const updatedMovie = await this.updateMovie(id, { status });
      if (updatedMovie) {
        updatedMovies.push(updatedMovie);
      }
    }
    
    return updatedMovies;
  }

  // Bulk delete
  static async bulkDeleteMovies(movieIds: number[]): Promise<boolean> {
    this.loadMoviesData();
    
    for (const id of movieIds) {
      await this.deleteMovie(id);
    }
    
    return true;
  }

  // Get actors for a specific movie
  static async getMovieActors(movieId: number) {
    return this.populateMovieActors(movieId);
  }

  // Get all actors
  static async getAllActors() {
    return [...mockActors];
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