import { Series, SeriesMovie } from '@/types/Series';
import { mockSeries, mockSeriesMovies } from '@/mocksData/mockSeries';
import { mockMovies } from '@/mocksData/mockMovies';

export class MockSeriesService {
  private static series: Series[] = [...mockSeries];

  // Helper method to populate series movies for mock data
  static populateSeriesMovies(seriesId: string): SeriesMovie[] {
    return mockSeriesMovies
      .filter(sm => sm.seriesId === seriesId)
      .map(sm => ({
        ...sm,
        movie: mockMovies.find(m => m.id === sm.movieId)
      }));
  }

  // Load mock data with series movies populated
  static loadMockData(): Series[] {
    this.series = mockSeries.map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
    return [...this.series];
  }

  // Get all mock series
  static getAllSeries(): Series[] {
    return this.loadMockData();
  }

  // Get all mock series with pagination and filtering
  static getAllSeriesWithPagination(
    page: number = 0, 
    size: number = 10, 
    name?: string,
    country?: string,
    genre?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): { series: Series[]; total: number; page: number; size: number } {
    let filteredSeries = this.loadMockData();

    // Apply name filter
    if (name && name.trim()) {
      const searchTerm = name.toLowerCase().trim();
      filteredSeries = filteredSeries.filter(series => 
        series.name.toLowerCase().includes(searchTerm) ||
        series.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredSeries.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
            break;
          case 'releaseYear':
            aValue = parseInt(a.releaseYear) || 0;
            bValue = parseInt(b.releaseYear) || 0;
            break;
          case 'status':
            aValue = a.status?.toLowerCase() || '';
            bValue = b.status?.toLowerCase() || '';
            break;
          default:
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
        }

        if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    const total = filteredSeries.length;
    const startIndex = page * size;
    const paginatedSeries = filteredSeries.slice(startIndex, startIndex + size);

    return {
      series: paginatedSeries,
      total,
      page,
      size
    };
  }

  // Get mock series by ID
  static getSeriesById(id: string): Series | null {
    const series = this.series.find(s => s.id === id);
    if (!series) return null;

    return {
      ...series,
      seriesMovies: this.populateSeriesMovies(id)
    };
  }

  // Add new mock series
  static addSeries(seriesData: Omit<Series, 'id' | 'seriesMovies'>, movieIds?: string[]): Series {
    const newSeries: Series = {
      id: `series-${String(this.series.length + 1).padStart(3, '0')}`,
      ...seriesData,
      seriesMovies: []
    };
    
    this.series.push(newSeries);
    
    // Add movies to series if provided
    if (movieIds && movieIds.length > 0) {
      for (const movieId of movieIds) {
        this.addMovieToSeries(newSeries.id, movieId, 1);
      }
    }
    
    return newSeries;
  }

  // Update mock series
  static updateSeries(id: string, seriesData: Partial<Series>, movieIds?: string[], removedMovieIds?: string[]): Series | null {
    const index = this.series.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    // Handle series movies if provided in seriesData
    if (seriesData.seriesMovies) {
      // Remove old series movies for this series
      mockSeriesMovies.splice(0, mockSeriesMovies.length, 
        ...mockSeriesMovies.filter(sm => sm.seriesId !== id)
      );
      
      // Add new series movies
      seriesData.seriesMovies.forEach((seriesMovie, index) => {
        mockSeriesMovies.push({
          id: `sm-${Date.now()}-${index}`,
          movieId: seriesMovie.movieId,
          seriesId: id,
          seasonNumber: index + 1,
          movie: seriesMovie.movie
        });
      });
    }
    
    // Handle movie removals
    if (removedMovieIds && removedMovieIds.length > 0) {
      for (const movieId of removedMovieIds) {
        this.removeMovieFromSeries(id, movieId);
      }
    }
    
    // Handle movie additions
    if (movieIds && movieIds.length > 0) {
      for (const movieId of movieIds) {
        this.addMovieToSeries(id, movieId, 1);
      }
    }
    
    this.series[index] = { 
      ...this.series[index], 
      ...seriesData,
      seriesMovies: this.populateSeriesMovies(id)
    };
    
    return this.series[index];
  }

  // Delete mock series
  static deleteSeries(id: string): boolean {
    const index = this.series.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    // Remove all series movies for this series
    mockSeriesMovies.splice(0, mockSeriesMovies.length, 
      ...mockSeriesMovies.filter(sm => sm.seriesId !== id)
    );
    
    this.series.splice(index, 1);
    return true;
  }

  // Upload poster (mock)
  static uploadPoster(seriesId: string, posterFile: File): { success: boolean; posterUrl?: string; message: string } {
    const fakeUrl = `https://via.placeholder.com/300x450?text=Series+${seriesId}`;
    
    const index = this.series.findIndex(s => s.id === seriesId);
    if (index !== -1) {
      this.series[index].posterUrl = fakeUrl;
    }
    
    return {
      success: true,
      posterUrl: fakeUrl,
      message: 'Poster uploaded successfully (Mock)'
    };
  }

  // Delete poster (mock)
  static deletePoster(seriesId: string): { success: boolean; message: string } {
    const index = this.series.findIndex(s => s.id === seriesId);
    if (index !== -1) {
      this.series[index].posterUrl = '';
    }
    
    return {
      success: true,
      message: 'Poster deleted successfully (Mock)'
    };
  }

  // Search mock series
  static searchSeries(query: string): Series[] {
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

  // Add movie to series (mock)
  static addMovieToSeries(seriesId: string, movieId: string, seasonNumber: number): { success: boolean; series?: Series; message: string } {
    const newSeriesMovie: SeriesMovie = {
      id: `sm-${Date.now()}`,
      movieId,
      seriesId,
      seasonNumber,
      movie: mockMovies.find(m => m.id === movieId)
    };
    
    mockSeriesMovies.push(newSeriesMovie);
    
    // Update series in local array
    const seriesIndex = this.series.findIndex(s => s.id === seriesId);
    if (seriesIndex !== -1) {
      this.series[seriesIndex].seriesMovies = this.populateSeriesMovies(seriesId);
    }
    
    const updatedSeries = this.getSeriesById(seriesId);
    
    return {
      success: true,
      series: updatedSeries || undefined,
      message: 'Movie added to series successfully (Mock)'
    };
  }

  // Remove movie from series (mock)
  static removeMovieFromSeries(seriesId: string, movieId: string): { success: boolean; series?: Series; message: string } {
    const index = mockSeriesMovies.findIndex(sm => sm.seriesId === seriesId && sm.movieId === movieId);
    
    if (index !== -1) {
      mockSeriesMovies.splice(index, 1);
    }
    
    // Update series in local array
    const seriesIndex = this.series.findIndex(s => s.id === seriesId);
    if (seriesIndex !== -1) {
      this.series[seriesIndex].seriesMovies = this.populateSeriesMovies(seriesId);
    }
    
    const updatedSeries = this.getSeriesById(seriesId);
    
    return {
      success: true,
      series: updatedSeries || undefined,
      message: 'Movie removed from series successfully (Mock)'
    };
  }

  // Get series statistics (mock)
  static getSeriesStats(): {
    total: number;
    ongoingSeries: number;
    completedSeries: number;
    totalMovies: number;
    averageMoviesPerSeries: number;
    newestYear: string;
    oldestYear: string;
  } {
    const total = this.series.length;
    const ongoingSeries = this.series.filter(s => s.status === 'Ongoing').length;
    const completedSeries = this.series.filter(s => s.status === 'Completed').length;
    const totalMovies = this.series.reduce((sum, s) => sum + (s.seriesMovies?.length || 0), 0);
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

  // Filter operations
  static filterByYear(year: string): Series[] {
    return this.series.filter(s => s.releaseYear === year).map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  static filterByStatus(status: string): Series[] {
    if (status === 'all') return this.getAllSeries();
    return this.series.filter(s => s.status === status).map(series => ({
      ...series,
      seriesMovies: this.populateSeriesMovies(series.id)
    }));
  }

  // Get unique values
  static getUniqueReleaseYears(): string[] {
    const years = [...new Set(this.series.map(s => s.releaseYear))];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }

  static getUniqueStatuses(): string[] {
    return [...new Set(this.series.map(s => s.status))];
  }

  // Check if series name exists
  static checkSeriesNameExists(name: string, excludeId?: string): boolean {
    return this.series.some(series => 
      series.name.toLowerCase() === name.toLowerCase() && 
      series.id !== excludeId
    );
  }

  // Get recent series
  static getRecentSeries(limit: number = 10): Series[] {
    const allSeries = this.loadMockData();
    return [...allSeries]
      .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
      .slice(0, limit);
  }

  // Get series by movie count
  static getSeriesByMovieCount(limit: number = 10): Series[] {
    const allSeries = this.loadMockData();
    return [...allSeries]
      .sort((a, b) => (b.seriesMovies?.length || 0) - (a.seriesMovies?.length || 0))
      .slice(0, limit);
  }

  // Get all series-movie relationships
  static getAllSeriesMovies(): SeriesMovie[] {
    const allSeries = this.loadMockData();
    const allSeriesMovies: SeriesMovie[] = [];
    
    allSeries.forEach(series => {
      if (series.seriesMovies) {
        allSeriesMovies.push(...series.seriesMovies);
      }
    });
    
    return allSeriesMovies;
  }

  // Reset data
  static resetData(): void {
    this.series = [...mockSeries];
  }
}