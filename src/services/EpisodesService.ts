import { Episode } from '@/types/Movies';
import { mockEpisodes } from '@/mocksData/mockEpisodes';
import { mockMovies } from '@/mocksData/mockMovies';

export class EpisodesService {
  private static episodes: Episode[] = [...mockEpisodes];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/episodes`;

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Chuyển đổi EpisodeResponse từ API sang Episode interface
  private static mapEpisodeResponseToEpisode(episodeResponse: any): Episode {
    return {
      id: episodeResponse.id,
      title: episodeResponse.title,
      episodeNumber: episodeResponse.episodeNumber,
      createdAt: new Date(episodeResponse.createdAt),
      videoUrl: episodeResponse.videoUrl,
      m3u8Url: episodeResponse.m3u8Url,
      serverName: episodeResponse.serverName || 'Vietsub',
      movieId: episodeResponse.movieId || '1' // Default movieId if not provided
    };
  }

  // Load episodes for a specific movie
  private static async loadEpisodesData(movieId: string): Promise<void> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock episodes');
      this.episodes = mockEpisodes.filter(ep => ep.id.toString().startsWith(movieId));
      this.isDataLoaded = true;
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?movieId=${movieId}`, {
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
        this.episodes = apiResponse.result.map((episodeResponse: any) => 
          this.mapEpisodeResponseToEpisode(episodeResponse)
        );
        console.log('Loaded episodes from API:', this.episodes.length);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load episodes from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.episodes = mockEpisodes.filter(ep => ep.id.toString().startsWith(movieId));
    }
    
    this.isDataLoaded = true;
  }

  // Get episodes for a movie
  static async getEpisodesForMovie(movieId: string): Promise<Episode[]> {
    await this.loadEpisodesData(movieId);
    return [...this.episodes];
  }

  // Get episode by ID
  static async getEpisodeById(episodeId: string): Promise<Episode | null> {
    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock episode');
      return mockEpisodes.find(ep => ep.id.toString() === episodeId) || null;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${episodeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return this.mapEpisodeResponseToEpisode(apiResponse.result);
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get episode from API, using mock data:', error);
      return mockEpisodes.find(ep => ep.id.toString() === episodeId) || null;
    }
  }

  static async getMovieByEpisodeId(episodeId: string): Promise<typeof mockMovies[0] | null> {
    const episode = await this.getEpisodeById(episodeId);
    if (!episode) return null;
    const movie = mockMovies.find(mov => mov.id === episode.movieId);
    return movie || null;
  }

  // Clear cached episodes
  static clearCache(): void {
    this.episodes = [];
    this.isDataLoaded = false;
  }
}