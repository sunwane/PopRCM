import { Episode } from '@/types/Movies';
import { mockEpisodes } from '@/mocksData/mockEpisodes';

export class EpisodesService {
  private static episodes: Episode[] = [...mockEpisodes];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'http://localhost:8088/api/episodes';

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
      id: parseInt(episodeResponse.id),
      title: episodeResponse.title,
      episodeNumber: episodeResponse.episodeNumber,
      createdAt: new Date(episodeResponse.createdAt),
      videoUrl: episodeResponse.videoUrl,
      m3u8Url: episodeResponse.m3u8Url,
      serverName: episodeResponse.serverName || 'Vietsub'
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
          'Authorization': `Bearer ${authToken}`
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

  // Add episode (local only for now)
  static async addEpisode(movieId: string, episodeData: Omit<Episode, 'id' | 'createdAt'>): Promise<Episode> {
    const newEpisode: Episode = {
      ...episodeData,
      id: Date.now(), // Generate temporary ID
      createdAt: new Date()
    };
    
    this.episodes.push(newEpisode);
    return newEpisode;
  }

  // Update episode (local only for now)
  static async updateEpisode(episodeId: number, updates: Partial<Episode>): Promise<Episode | null> {
    const index = this.episodes.findIndex(ep => ep.id === episodeId);
    if (index === -1) return null;
    
    this.episodes[index] = { ...this.episodes[index], ...updates };
    return this.episodes[index];
  }

  // Delete episode (local only for now)
  static async deleteEpisode(episodeId: number): Promise<boolean> {
    const index = this.episodes.findIndex(ep => ep.id === episodeId);
    if (index === -1) return false;
    
    this.episodes.splice(index, 1);
    return true;
  }

  // Reorder episodes (local only for now)
  static async reorderEpisodes(movieId: string, episodes: Episode[]): Promise<Episode[]> {
    // Update local episodes for this movie
    this.episodes = this.episodes.filter(ep => !episodes.some(newEp => newEp.id === ep.id));
    this.episodes.push(...episodes);
    
    // Sort by episode number within each server
    this.episodes.sort((a, b) => {
      if (a.serverName !== b.serverName) {
        return a.serverName.localeCompare(b.serverName);
      }
      return a.episodeNumber - b.episodeNumber;
    });
    
    return episodes;
  }

  // Clear cached episodes
  static clearCache(): void {
    this.episodes = [];
    this.isDataLoaded = false;
  }
}