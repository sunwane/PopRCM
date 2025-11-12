import { Series, SeriesMovie } from '@/types/Series';
import { mockSeries, mockSeriesMovies } from '@/mocksData/mockSeries';
import { mockMovies } from '@/mocksData/mockMovies';

export class SeriesService {
  private static series: Series[] = [...mockSeries]; // Initialize with mock data
  private static isDataLoaded = true; // Set to true since we're using mock data

  // Helper method to populate series movies
  private static populateSeriesMovies(seriesId: string) {
    return mockSeriesMovies
      .filter(sm => sm.seriesId === seriesId)
      .map(sm => ({
        ...sm,
        movie: mockMovies.find(m => m.id === sm.movieId)
      }));
  }

  // Load data from mock (can be extended to API later)
  private static loadSeriesData(): void {
    if (this.isDataLoaded) return;
    
    // Populate series with movies relationship
    this.series = mockSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
    
    this.isDataLoaded = true;
  }

  // Get all series
  static async getAllSeries(): Promise<Series[]> {
    this.loadSeriesData();
    return this.series.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Get series by ID
  static async getSeriesById(id: string): Promise<Series | null> {
    this.loadSeriesData();
    const series = this.series.find(series => series.id === id);
    if (!series) return null;

    // Add movies relationship
    return {
      ...series,
      seriesMovies: this.populateSeriesMovies(id)
    };
  }

  // Add new series
  static async addSeries(seriesData: Omit<Series, 'id' | 'seriesMovies'>): Promise<Series> {
    this.loadSeriesData();
    
    const newSeries: Series = {
      id: `series-${String(this.series.length + 1).padStart(3, '0')}`,
      ...seriesData,
      seriesMovies: [] // Initialize empty movies array
    };
    
    this.series.push(newSeries);
    return newSeries;
  }

  // Update series
  static async updateSeries(id: string, seriesData: Partial<Series>): Promise<Series | null> {
    this.loadSeriesData();
    
    const index = this.series.findIndex(series => series.id === id);
    if (index === -1) return null;
    
    this.series[index] = {
      ...this.series[index],
      ...seriesData
    };
    
    return {
      ...this.series[index],
      seriesMovies: this.populateSeriesMovies(id)
    };
  }

  // Delete series
  static async deleteSeries(id: string): Promise<boolean> {
    this.loadSeriesData();
    
    const index = this.series.findIndex(series => series.id === id);
    if (index === -1) return false;
    
    this.series.splice(index, 1);
    return true;
  }

  // Check if series name exists
  static async checkSeriesNameExists(name: string, excludeId?: string): Promise<boolean> {
    this.loadSeriesData();
    
    return this.series.some(series => 
      series.name.toLowerCase() === name.toLowerCase() && 
      series.id !== excludeId
    );
  }

  // Search series
  static async searchSeries(query: string): Promise<Series[]> {
    this.loadSeriesData();
    
    if (!query.trim()) return this.getAllSeries();
    
    const searchTerm = query.toLowerCase().trim();
    const filteredSeries = this.series.filter(series => 
      series.name.toLowerCase().includes(searchTerm) ||
      series.description.toLowerCase().includes(searchTerm)
    );

    return filteredSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Filter by release year
  static async filterByYear(year: string): Promise<Series[]> {
    this.loadSeriesData();
    const filteredSeries = this.series.filter(series => series.releaseYear === year);
    return filteredSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Filter by status
  static async filterByStatus(status: string): Promise<Series[]> {
    this.loadSeriesData();
    if (status === 'all') return this.getAllSeries();
    const filteredSeries = this.series.filter(series => series.status === status);
    return filteredSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Get recent series
  static async getRecentSeries(limit: number = 10): Promise<Series[]> {
    this.loadSeriesData();
    const sortedSeries = [...this.series]
      .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
      .slice(0, limit);
    
    return sortedSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Get series by movie count
  static async getSeriesByMovieCount(limit: number = 10): Promise<Series[]> {
    this.loadSeriesData();
    const sortedSeries = [...this.series]
      .map(series => ({
        ...series,
        movieCount: mockSeriesMovies.filter(sm => sm.seriesId === series.id).length
      }))
      .sort((a, b) => b.movieCount - a.movieCount)
      .slice(0, limit);
    
    return sortedSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
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
    this.loadSeriesData();
    
    const total = this.series.length;
    const ongoingSeries = this.series.filter(s => s.status === 'Ongoing').length;
    const completedSeries = this.series.filter(s => s.status === 'Completed').length;
    const totalMovies = mockSeriesMovies.length;
    const averageMoviesPerSeries = total > 0 ? totalMovies / total : 0;
    
    const years = this.series.map(s => parseInt(s.releaseYear)).filter(y => !isNaN(y));
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
  }

  // Get unique release years
  static async getUniqueReleaseYears(): Promise<string[]> {
    this.loadSeriesData();
    const years = [...new Set(this.series.map(series => series.releaseYear))];
    return years.sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
  }

  // Get unique statuses
  static async getUniqueStatuses(): Promise<string[]> {
    this.loadSeriesData();
    return [...new Set(this.series.map(series => series.status))];
  }

  // Refresh data
  static refreshData(): void {
    this.series = [...mockSeries];
    this.isDataLoaded = true;
  }

  // Bulk operations
  static async bulkUpdateStatus(seriesIds: string[], status: string): Promise<Series[]> {
    this.loadSeriesData();
    
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
    this.loadSeriesData();
    
    for (const id of seriesIds) {
      await this.deleteSeries(id);
    }
    
    return true;
  }

  // Get movies for a specific series
  static async getSeriesMovies(seriesId: string) {
    return this.populateSeriesMovies(seriesId);
  }

  // Get all series-movie relationships
  static async getAllSeriesMovies() {
    return mockSeriesMovies.map(sm => ({
      ...sm,
      movie: mockMovies.find(m => m.id === sm.movieId)
    }));
  }

  // Add movie to series
  static async addMovieToSeries(seriesId: string, movieId: number, seasonNumber: number): Promise<SeriesMovie> {
    const newSeriesMovie: SeriesMovie = {
      id: `sm-${String(mockSeriesMovies.length + 1).padStart(3, '0')}`,
      movieId,
      seriesId,
      seasonNumber,
      movie: mockMovies.find(m => m.id === movieId)
    };
    
    mockSeriesMovies.push(newSeriesMovie);
    return newSeriesMovie;
  }

  // Remove movie from series
  static async removeMovieFromSeries(seriesMovieId: string): Promise<boolean> {
    const index = mockSeriesMovies.findIndex(sm => sm.id === seriesMovieId);
    if (index === -1) return false;
    
    mockSeriesMovies.splice(index, 1);
    return true;
  }
}