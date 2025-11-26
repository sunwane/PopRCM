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

  // Get mock series by ID
  static getSeriesById(id: string): Series | null {
    const series = this.series.find(s => s.id === id);
    if (!series) return null;

    return {
      ...series,
      seriesMovies: this.populateSeriesMovies(id)
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