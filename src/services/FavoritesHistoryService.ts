import { ApiResponse, PageResponse, Favorites, WatchHistory } from '@/types/User';
import { Movie, Episode } from '@/types/Movies';
import ServiceChecker from './ServiceChecker';
import { mapMovieResponseToMovie } from './MoviesService';

export class FavoritesHistoryService {
  private static readonly API_BASE_URL = 'https://poprcm-be.onrender.com/api';
  
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
      console.log('Watch history API response:', apiResponse);
      
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
   * GET /api/history - Lấy lịch sử xem phim (chỉ tập mới nhất của mỗi movie) với thông tin movie đầy đủ
   */
  static async getLatestWatchHistoryWithMovies(page: number = 0, size: number = 20): Promise<PageResponse<WatchHistory & { movie: Movie }> | null> {
    if (!this.isServiceAvailable()) {
      // Mock data với movie info
      return {
        content: this.getMockWatchHistoryWithMovies(),
        totalElements: 2,
        totalPages: 1,
        size,
        number: page
      };
    }

    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${this.API_BASE_URL}/history?page=0&size=1000`, {
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
      console.log('Watch history API response:', apiResponse);
      
      if (apiResponse.result && apiResponse.result.content) {
        // Group by movieId và lấy tập mới nhất
        const latestHistoryMap = new Map<string, any>();
        
        apiResponse.result.content.forEach((historyItem: any) => {
          const movieId = historyItem.episode?.movieId;
          if (!movieId) return;
          
          const existing = latestHistoryMap.get(movieId);
          const currentWatchedAt = new Date(historyItem.watchAt);
          
          if (!existing || currentWatchedAt > new Date(existing.watchAt)) {
            latestHistoryMap.set(movieId, historyItem);
          }
        });

        // Convert to array và fetch movie details
        const latestHistoryArray = Array.from(latestHistoryMap.values());
        
        // Fetch movie details cho từng movieId
        const historyWithMovies = await Promise.all(
          latestHistoryArray.map(async (historyItem) => {
            const movieId = historyItem.episode?.movieId;
            if (!movieId) return null;

            // Fetch movie details
            const movieResponse = await fetch(`${this.API_BASE_URL}/movies/${movieId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            let movie = null;
            if (movieResponse.ok) {
              const movieApiResponse: ApiResponse<any> = await movieResponse.json();
              if (movieApiResponse.result) {
                movie = mapMovieResponseToMovie(movieApiResponse.result);
              }
            }

            return {
              episode: historyItem.episode,
              currentTime: historyItem.currentTime,
              watchedAt: new Date(historyItem.watchAt),
              movie: movie
            };
          })
        );

        // Filter out null results và sort
        const validHistory = historyWithMovies
          .filter((item): item is WatchHistory & { movie: Movie } => 
            item !== null && item.movie !== null) // Filter out items without valid movie
          .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

        // Apply pagination
        const totalElements = validHistory.length;
        const totalPages = Math.ceil(totalElements / size);
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = validHistory.slice(startIndex, endIndex);

        return {
          content: paginatedContent,
          totalElements,
          totalPages,
          size,
          number: page
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching watch history with movies:', error);
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

  private static getMockWatchHistoryWithMovies(): (WatchHistory & { movie: Movie })[] {
    return [
      {
        watchedAt: new Date('2024-12-16T10:30:00'),
        currentTime: 1200, // 20 minutes
        episode: {
          id: '1',
          title: 'SPY x FAMILY_S03E38_Biến loạn ở Berlint_Kẻ chỉ điểm và Nightfall',
          episodeNumber: 1,
          videoUrl: 'https://vip.opstream90.com/share/cd50a6640d6284992905dc447fd7701d',
          m3u8Url: 'https://vip.opstream90.com/20251004/13958_cd50a664/index.m3u8',
          serverName: 'Vietsub #1',
          movieId: '8a0754fd-8871-4baa-8dbc-3726aa501091',
          movieSlug: 'gia-dinh-x-diep-vien-phan-3',
          movieTitle: 'Gia Đình × Điệp Viên (Phần 3)',
          createdAt: new Date('2025-12-23T11:11:08.509108')
        },
        movie: {
          id: '8a0754fd-8871-4baa-8dbc-3726aa501091',
          title: 'Gia Đình × Điệp Viên (Phần 3)',
          originalName: 'SPY x FAMILY Season 3',
          posterUrl: '/placeholder/spy-family-s3-poster.jpg',
          thumbnailUrl: '/placeholder/spy-family-s3-thumb.jpg',
          description: 'Mùa 3 của series anime nổi tiếng về gia đình điệp viên Forger',
          releaseYear: 2024,
          duration: '24 min/ep',
          type: 'series',
          lang: 'Vietsub',
          country: [{ id: '1', name: 'Nhật Bản' }],
          director: 'Kazuhiro Furuhashi',
          actors: [],
          genres: [
            { id: '1', genresName: 'Anime' },
            { id: '2', genresName: 'Hành động' },
            { id: '3', genresName: 'Hài hước' }
          ],
          totalEpisodes: 12,
          currentEpisode: 1,
          status: 'ongoing',
          view: 2500000,
          seasonNumber: 3,
          trailerUrl: '',
          createdAt: new Date('2024-10-01'),
          modifiedAt: new Date('2024-12-16'),
          slug: 'gia-dinh-x-diep-vien-phan-3'
        }
      },
      {
        watchedAt: new Date('2024-12-15T20:15:00'),
        currentTime: 800, // 13 minutes  
        episode: {
          id: '2',
          title: 'Tập 5: Cuộc chiến cuối cùng',
          episodeNumber: 5,
          videoUrl: 'https://example.com/demon-slayer-ep5.mp4',
          m3u8Url: 'https://example.com/m3u8/demon-slayer-5',
          serverName: 'Vietsub #1',
          movieId: '9b1865ge-9982-5cca-9edc-4837bb612192',
          movieSlug: 'thanh-guom-diet-quy-movie',
          movieTitle: 'Thanh Gươm Diệt Quỷ: Movie',
          createdAt: new Date('2024-12-15')
        },
        movie: {
          id: '9b1865ge-9982-5cca-9edc-4837bb612192',
          title: 'Thanh Gươm Diệt Quỷ: Movie',
          originalName: 'Demon Slayer: Kimetsu no Yaiba Movie',
          posterUrl: '/placeholder/demon-slayer-movie-poster.jpg',
          thumbnailUrl: '/placeholder/demon-slayer-movie-thumb.jpg',
          description: 'Bộ phim điện ảnh từ series anime Thanh Gươm Diệt Quỷ nổi tiếng',
          releaseYear: 2024,
          duration: '120 min',
          type: 'movie',
          lang: 'Vietsub',
          country: [{ id: '1', name: 'Nhật Bản' }],
          director: 'Haruo Sotozaki',
          actors: [],
          genres: [
            { id: '1', genresName: 'Anime' },
            { id: '2', genresName: 'Hành động' },
            { id: '4', genresName: 'Siêu nhiên' }
          ],
          totalEpisodes: 1,
          currentEpisode: 1,
          status: 'completed',
          view: 3200000,
          seasonNumber: undefined,
          trailerUrl: '',
          createdAt: new Date('2024-11-01'),
          modifiedAt: new Date('2024-12-15'),
          slug: 'thanh-guom-diet-quy-movie'
        }
      }
    ];
  }
}
