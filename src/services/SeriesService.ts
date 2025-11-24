import { Series, SeriesMovie } from '@/types/Series';
import { MockSeriesService } from './MockSeriesService';

export class SeriesService {
  private static readonly API_BASE_URL = 'http://localhost:8088/api/series';

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
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
  private static async loadSeriesData(): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      return MockSeriesService.getAllSeries();
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?page=0&size=100`, {
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
        console.log('Loaded series from API:', series.length);
        return series;
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load series from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      return MockSeriesService.getAllSeries();
    }
  }

  // Get all series
  static async getAllSeries(): Promise<Series[]> {
    const series = await this.loadSeriesData();
    return [...series];
  }

  // Get series by ID
  static async getSeriesById(id: string): Promise<Series | null> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getSeriesById(id);
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
      return MockSeriesService.getSeriesById(id);
    }
  }

  // Add new series
  static async addSeries(seriesData: Omit<Series, 'id' | 'seriesMovies'>, movieIds?: string[]): Promise<Series> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.addSeries(seriesData, movieIds);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      // Chuyển đổi Series sang SeriesCreateRequest
      const requestBody = {
        name: seriesData.name,
        description: seriesData.description || '',
        status: seriesData.status,
        releaseYear: parseInt(seriesData.releaseYear)
      };

      const response = await fetch(`${this.API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        const newSeries = this.mapSeriesResponseToSeries(apiResponse.result);
        
        // Add movies to series if provided
        if (movieIds && movieIds.length > 0) {
          for (const movieId of movieIds) {
            await this.addMovieToSeries(newSeries.id, movieId);
          }
        }
        
        return newSeries;
      }
      
      throw new Error('Invalid API response structure');
      
    } catch (error) {
      console.error('Failed to add series via API:', error);
      // Fallback to mock data
      return MockSeriesService.addSeries(seriesData, movieIds);
    }
  }

  // Update series
  static async updateSeries(id: string, seriesData: Partial<Series>, movieIds?: string[], removedMovieIds?: string[]): Promise<Series | null> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.updateSeries(id, seriesData, movieIds, removedMovieIds);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      // Chuyển đổi Series sang SeriesUpdateRequest
      const requestBody = {
        name: seriesData.name,
        description: seriesData.description,
        status: seriesData.status,
        releaseYear: seriesData.releaseYear ? parseInt(seriesData.releaseYear) : undefined
      };

      // Loại bỏ các field undefined
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key as keyof typeof requestBody] === undefined) {
          delete requestBody[key as keyof typeof requestBody];
        }
      });

      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        const updatedSeries = this.mapSeriesResponseToSeries(apiResponse.result);
        
        // Handle movie changes
        if (removedMovieIds && removedMovieIds.length > 0) {
          for (const movieId of removedMovieIds) {
            await this.removeMovieFromSeries(id, movieId);
          }
        }
        
        if (movieIds && movieIds.length > 0) {
          for (const movieId of movieIds) {
            await this.addMovieToSeries(id, movieId);
          }
        }
        
        return updatedSeries;
      }
      
      return null;
      
    } catch (error) {
      console.error('Failed to update series via API:', error);
      // Fallback to mock data
      return MockSeriesService.updateSeries(id, seriesData, movieIds, removedMovieIds);
    }
  }

  // Delete series
  static async deleteSeries(id: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.deleteSeries(id);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return false;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
      
    } catch (error) {
      console.error('Failed to delete series via API:', error);
      // Fallback to mock data
      return MockSeriesService.deleteSeries(id);
    }
  }

  // Upload poster for series
  static async uploadPoster(seriesId: string, posterFile: File): Promise<{ success: boolean; posterUrl?: string; message: string }> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.uploadPoster(seriesId, posterFile);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', posterFile);

      const response = await fetch(`${this.API_BASE_URL}/${seriesId}/poster`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return {
          success: true,
          posterUrl: apiResponse.result.posterUrl,
          message: apiResponse.message || 'Poster uploaded successfully'
        };
      }
      
      throw new Error('Invalid API response structure');
      
    } catch (error) {
      console.error('Failed to upload poster via API:', error);
      return MockSeriesService.uploadPoster(seriesId, posterFile);
    }
  }

  // Delete poster for series
  static async deletePoster(seriesId: string): Promise<{ success: boolean; message: string }> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.deletePoster(seriesId);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${seriesId}/poster`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Poster deleted successfully'
      };
      
    } catch (error) {
      console.error('Failed to delete poster via API:', error);
      return MockSeriesService.deletePoster(seriesId);
    }
  }

  // Check if series name exists
  static async checkSeriesNameExists(name: string, excludeId?: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.checkSeriesNameExists(name, excludeId);
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      return allSeries.some(series => 
        series.name.toLowerCase() === name.toLowerCase() && 
        series.id !== excludeId
      );
    } catch (error) {
      return MockSeriesService.checkSeriesNameExists(name, excludeId);
    }
  }

  // Search series
  static async searchSeries(query: string): Promise<Series[]> {
    if (!query.trim()) {
      return await this.getAllSeries();
    }

    if (!this.isServiceAvailable()) {
      return MockSeriesService.searchSeries(query);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?search=${encodeURIComponent(query)}&page=0&size=100`, {
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
        return apiResponse.result.content.map((seriesResponse: any) => 
          this.mapSeriesResponseToSeries(seriesResponse)
        );
      }
      return [];
      
    } catch (error) {
      console.warn('Search API failed, falling back to mock search:', error);
      return MockSeriesService.searchSeries(query);
    }
  }

  // Filter by release year
  static async filterByYear(year: string): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.filterByYear(year);
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      return allSeries.filter(series => series.releaseYear === year);
    } catch (error) {
      return MockSeriesService.filterByYear(year);
    }
  }

  // Filter by status
  static async filterByStatus(status: string): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.filterByStatus(status);
    }
    
    try {
      if (status === 'all') return this.getAllSeries();
      const allSeries = await this.loadSeriesData();
      return allSeries.filter(series => series.status === status);
    } catch (error) {
      return MockSeriesService.filterByStatus(status);
    }
  }

  // Get recent series
  static async getRecentSeries(limit: number = 10): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getRecentSeries(limit);
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      return [...allSeries]
        .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
        .slice(0, limit);
    } catch (error) {
      return MockSeriesService.getRecentSeries(limit);
    }
  }

  // Get series by movie count
  static async getSeriesByMovieCount(limit: number = 10): Promise<Series[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getSeriesByMovieCount(limit);
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      return [...allSeries]
        .sort((a, b) => (b.seriesMovies?.length || 0) - (a.seriesMovies?.length || 0))
        .slice(0, limit);
    } catch (error) {
      return MockSeriesService.getSeriesByMovieCount(limit);
    }
  }

  // Get series statistics
  static async getSeriesStats(): Promise<{
    total: number;
    ongoingSeries: number;
    completedSeries: number;
    totalMovies: number;
    averageMoviesPerSeries: number;
    newestYear: string;
    oldestYear: string;
  }> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getSeriesStats();
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      
      const total = allSeries.length;
      const ongoingSeries = allSeries.filter(s => s.status === 'Ongoing').length;
      const completedSeries = allSeries.filter(s => s.status === 'Completed').length;
      const totalMovies = allSeries.reduce((sum, s) => sum + (s.seriesMovies?.length || 0), 0);
      const averageMoviesPerSeries = total > 0 ? totalMovies / total : 0;
      
      const years = allSeries.map(s => parseInt(s.releaseYear)).filter(y => !isNaN(y));
      const newestYear = years.length > 0 ? Math.max(...years).toString() : '0';
      const oldestYear = years.length > 0 ? Math.min(...years).toString() : '0';
      
      return {
        total,
        ongoingSeries,
        completedSeries,
        totalMovies,
        averageMoviesPerSeries: Math.round(averageMoviesPerSeries),
        newestYear,
        oldestYear
      };
    } catch (error) {
      return MockSeriesService.getSeriesStats();
    }
  }

  // Get unique release years
  static async getUniqueReleaseYears(): Promise<string[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getUniqueReleaseYears();
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      const years = [...new Set(allSeries.map(series => series.releaseYear))];
      return years.sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
    } catch (error) {
      return MockSeriesService.getUniqueReleaseYears();
    }
  }

  // Get unique statuses
  static async getUniqueStatuses(): Promise<string[]> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getUniqueStatuses();
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      return [...new Set(allSeries.map(series => series.status))];
    } catch (error) {
      return MockSeriesService.getUniqueStatuses();
    }
  }

  // Bulk operations
  static async bulkUpdateStatus(seriesIds: string[], status: string): Promise<Series[]> {
    const updatedSeries: Series[] = [];
    for (const id of seriesIds) {
      const updatedSerie = await this.updateSeries(id, { status });
      if (updatedSerie) {
        updatedSeries.push(updatedSerie);
      }
    }
    
    return updatedSeries;
  }

  // Bulk delete
  static async bulkDeleteSeries(seriesIds: string[]): Promise<boolean> {
    for (const id of seriesIds) {
      await this.deleteSeries(id);
    }
    
    return true;
  }

  // Get movies for a specific series
  static async getSeriesMovies(seriesId: string) {
    const series = await this.getSeriesById(seriesId);
    return series?.seriesMovies || [];
  }

  // Get all series-movie relationships
  static async getAllSeriesMovies() {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.getAllSeriesMovies();
    }
    
    try {
      const allSeries = await this.loadSeriesData();
      const allSeriesMovies: SeriesMovie[] = [];
      
      allSeries.forEach(series => {
        if (series.seriesMovies) {
          allSeriesMovies.push(...series.seriesMovies);
        }
      });
      
      return allSeriesMovies;
    } catch (error) {
      return MockSeriesService.getAllSeriesMovies();
    }
  }

  // Add movie to series
  static async addMovieToSeries(seriesId: string, movieId: string, seasonNumber: number = 1): Promise<{ success: boolean; series?: Series; message: string }> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.addMovieToSeries(seriesId, movieId, seasonNumber);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      const requestBody = {
        movieId: movieId.toString(),
        //seasonNumber: seasonNumber
      };

      const response = await fetch(`${this.API_BASE_URL}/${seriesId}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        const updatedSeries = this.mapSeriesResponseToSeries(apiResponse.result);
        
        return {
          success: true,
          series: updatedSeries,
          message: apiResponse.message || 'Movie added to series successfully'
        };
      }
      
      throw new Error('Invalid API response structure');
      
    } catch (error) {
      console.error('Failed to add movie to series via API:', error);
      return MockSeriesService.addMovieToSeries(seriesId, movieId, seasonNumber);
    }
  }

  // Remove movie from series
  static async removeMovieFromSeries(seriesId: string, movieId: string): Promise<{ success: boolean; series?: Series; message: string }> {
    if (!this.isServiceAvailable()) {
      return MockSeriesService.removeMovieFromSeries(seriesId, movieId);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${seriesId}/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        const updatedSeries = this.mapSeriesResponseToSeries(apiResponse.result);
        
        return {
          success: true,
          series: updatedSeries,
          message: apiResponse.message || 'Movie removed from series successfully'
        };
      }
      
      return {
        success: true,
        message: 'Movie removed from series successfully'
      };
      
    } catch (error) {
      console.error('Failed to remove movie from series via API:', error);
      return MockSeriesService.removeMovieFromSeries(seriesId, movieId);
    }
  }
}