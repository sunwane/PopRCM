import { ApiResponse, PageResponse, Favorites, WatchHistory } from '@/types/User';
import { Movie, Episode } from '@/types/Movies';
import ServiceChecker from './ServiceChecker';
import { mapMovieResponseToMovie } from './MoviesService';

export class FavoritesHistoryService {
  private static readonly API_BASE_URL = 'http://localhost:8088/api';
  
  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') === 'true';
    }
    return true;
  }

  // Get auth token from localStorage
  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Chuyển đổi response từ API sang Favorites interface
  private static mapFavoriteResponse(favoriteResponse: any): Favorites {
    return {
      favoriteId: favoriteResponse.favoriteId,
      movie: favoriteResponse.movie ? mapMovieResponseToMovie(favoriteResponse.movie) : favoriteResponse.movie,
      createdAt: new Date(favoriteResponse.createdAt)
    };
  }

  // Chuyển đổi response từ API sang WatchHistory interface
  private static mapWatchHistoryResponse(historyResponse: any): WatchHistory {
    return {
      episode: historyResponse.episode,
      currentTime: historyResponse.currentTime,
      watchedAt: new Date(historyResponse.watchAt)
    };
  }

  /**
   * FAVORITES MANAGEMENT
   */

  /**
   * GET /api/favorites - Lấy danh sách phim yêu thích
   */
  static async getFavorites(page: number = 0, size: number = 20): Promise<PageResponse<Favorites> | null> {
    if (!this.isServiceAvailable()) {
      // Mock data for favorites
      return {
        content: this.getMockFavorites(),
        totalElements: 5,
        totalPages: 1,
        size,
        number: page
      };
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/favorites?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const apiResponse: ApiResponse<PageResponse<any>> = await response.json();
      
      if (apiResponse.result) {
        return {
          ...apiResponse.result,
          content: apiResponse.result.content.map(this.mapFavoriteResponse)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return null;
    }
  }

  /**
   * POST /api/favorites - Thêm phim vào yêu thích
   */
  static async addFavorite(movieId: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      // Mock success - simulate API delay
      console.log('Mock: Added favorite for movie', movieId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return true;
    }

    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        return false;
      }

      const response = await fetch(`${this.API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieId })
      });

      if (response.ok) {
        console.log('Successfully added movie to favorites:', movieId);
        return true;
      } else {
        console.error('Failed to add favorite, status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  }

  /**
   * DELETE /api/favorites/{movieId} - Xóa phim khỏi yêu thích
   */
  static async removeFavorite(movieId: string): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      // Mock success - simulate API delay
      console.log('Mock: Removed favorite for movie', movieId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return true;
    }

    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        return false;
      }

      const response = await fetch(`${this.API_BASE_URL}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Successfully removed movie from favorites:', movieId);
        return true;
      } else {
        console.error('Failed to remove favorite, status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  /**
   * WATCH HISTORY MANAGEMENT
   */

  /**
   * GET /api/history - Lấy lịch sử xem phim
   */
  static async getWatchHistory(page: number = 0, size: number = 20): Promise<PageResponse<WatchHistory> | null> {
    if (!this.isServiceAvailable()) {
      // Mock data for watch history
      return {
        content: this.getMockWatchHistory(),
        totalElements: 3,
        totalPages: 1,
        size,
        number: page
      };
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/history?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch watch history');
      }

      const apiResponse: ApiResponse<PageResponse<any>> = await response.json();
      
      if (apiResponse.result) {
        return {
          ...apiResponse.result,
          content: apiResponse.result.content.map(this.mapWatchHistoryResponse)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching watch history:', error);
      return null;
    }
  }

  /**
   * POST /api/history/episode/{episodeId} - Cập nhật tiến trình xem
   */
  static async updateWatchProgress(episodeId: string, currentTime: number): Promise<boolean> {
    if (!this.isServiceAvailable()) {
      // Mock success
      console.log('Mock: Updated watch progress for episode', episodeId, 'at time', currentTime);
      return true;
    }

    try {
      const token = this.getAuthToken();
      if (!token) {
        // Public endpoint for non-authenticated users
        const response = await fetch(`${this.API_BASE_URL}/history/public/episode/${episodeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ currentTime })
        });
        return response.ok;
      }

      const response = await fetch(`${this.API_BASE_URL}/history/episode/${episodeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentTime })
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating watch progress:', error);
      return false;
    }
  }

  /**
   * Mock data for development/fallback
   */
  private static getMockFavorites(): Favorites[] {
    return [
      {
        favoriteId: '1',
        createdAt: new Date('2024-12-15'),
        movie: {
          id: '1',
          title: 'Thế giới ảo diệu của Gumball',
          originalName: 'The Amazing World of Gumball',
          posterUrl: '/placeholder/gumball-poster.jpg',
          thumbnailUrl: '/placeholder/gumball-thumb.jpg',
          description: 'Bộ phim hoạt hình hài hước về chú mèo Gumball',
          releaseYear: 2011,
          duration: '22 min/ep',
          type: 'series',
          lang: 'Vietsub',
          country: [],
          director: 'Ben Bocquelet',
          actors: [],
          genres: [],
          totalEpisodes: 240,
          currentEpisode: 1,
          status: 'completed',
          view: 1500000,
          seasonNumber: 1,
          trailerUrl: '',
          createdAt: new Date('2011-05-03'),
          modifiedAt: new Date('2024-12-15'),
          slug: 'the-gioi-ao-dieu-cua-gumball'
        }
      },
      {
        favoriteId: '2',
        createdAt: new Date('2024-12-14'),
        movie: {
          id: '2',
          title: 'Nữ hoàng Dưa Lưới',
          originalName: 'The Melon Queen',
          posterUrl: '/placeholder/melon-queen-poster.jpg',
          thumbnailUrl: '/placeholder/melon-queen-thumb.jpg',
          description: 'Câu chuyện về nữ hoàng của vương quốc dưa lưới',
          releaseYear: 2024,
          duration: '45 min/ep',
          type: 'series',
          lang: 'Vietsub',
          country: [],
          director: 'Park Min-soo',
          actors: [],
          genres: [],
          totalEpisodes: 16,
          currentEpisode: 16,
          status: 'completed',
          view: 2300000,
          seasonNumber: undefined,
          trailerUrl: '',
          createdAt: new Date('2024-01-15'),
          modifiedAt: new Date('2024-12-14'),
          slug: 'nu-hoang-dua-luoi'
        }
      }
    ];
  }

  private static getMockWatchHistory(): WatchHistory[] {
    return [
      {
        watchedAt: new Date('2024-12-16T10:30:00'),
        currentTime: 1200, // 20 minutes
        episode: {
          id: '1',
          title: 'Tập 1: Khởi đầu',
          episodeNumber: 1,
          videoUrl: 'https://example.com/episode-1.mp4',
          m3u8Url: 'https://example.com/m3u8/1',
          serverName: 'Vietsub',
          movieId: '1',
          createdAt: new Date('2024-12-16')
        }
      },
      {
        watchedAt: new Date('2024-12-15T20:15:00'),
        currentTime: 2700, // 45 minutes  
        episode: {
          id: '2',
          title: 'Tập 2: Phiêu lưu',
          episodeNumber: 2,
          videoUrl: 'https://example.com/episode-2.mp4',
          m3u8Url: 'https://example.com/m3u8/2',
          serverName: 'Vietsub',
          movieId: '1',
          createdAt: new Date('2024-12-15')
        }
      }
    ];
  }
}
