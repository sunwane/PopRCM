import { SimilarMovie, AISearchResponse } from '@/types/Movies';
import { MoviesService } from '@/services/MoviesService';

class AIService {
  static searchMovies(content: string) {
    throw new Error('Method not implemented.');
  }
  private baseURL = 'http://localhost:8088/api/ai';

  async searchMovies(query: string): Promise<AISearchResponse> {
    if (localStorage.getItem('serviceAvailable') === 'false') {
      return {
        status: 'error',
        query: query,
        message: 'Xin hãy kiểm tra kết nối mạng hoặc thử lại sau.',
        movies: [],
        count: 0
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`AI Search API error: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('AI Search API Response:', jsonResponse);
      
      // Response structure từ API:
      // {
      //   status: "success" | "error",
      //   query: string,
      //   message: string,
      //   count: number,
      //   movies: [{ movieId, title, similarity, reason }]
      // }

      if (jsonResponse.status === 'success' && jsonResponse.movies) {
        // Fetch chi tiết từng phim dựa trên movieId
        const movieDetails = await Promise.allSettled(
          jsonResponse.movies.map(async (apiMovie: any) => {
            try {
              const movieDetail = await MoviesService.getMovieById(apiMovie.movieId);
              if (movieDetail) {
                return {
                  id: parseInt(apiMovie.movieId.slice(-6), 36) || Math.random() * 1000000, // Convert string to number
                  movieId: apiMovie.movieId,
                  title: movieDetail.title,
                  description: movieDetail.description,
                  genre: movieDetail.genres?.map(g => g.genresName) || [],
                  releaseYear: movieDetail.releaseYear,
                  rating: movieDetail.PopRating || movieDetail.imdbScore || movieDetail.tmdbScore || 0,
                  posterUrl: movieDetail.posterUrl,
                  similarity: apiMovie.similarity
                } as SimilarMovie;
              } else {
                // Fallback nếu không tìm thấy chi tiết phim
                return {
                  id: parseInt(apiMovie.movieId.slice(-6), 36) || Math.random() * 1000000,
                  movieId: apiMovie.movieId,
                  title: apiMovie.title,
                  description: 'Đang cập nhật thông tin...',
                  genre: [],
                  similarity: apiMovie.similarity
                } as SimilarMovie;
              }
            } catch (error) {
              console.warn(`Failed to fetch details for movie ${apiMovie.movieId}:`, error);
              // Fallback với thông tin cơ bản từ API
              return {
                id: parseInt(apiMovie.movieId.slice(-6), 36) || Math.random() * 1000000,
                movieId: apiMovie.movieId,
                title: apiMovie.title,
                description: 'Không thể tải thông tin chi tiết',
                genre: [],
                similarity: apiMovie.similarity
              } as SimilarMovie;
            }
          })
        );

        // Extract successful results
        const successfulResults = movieDetails
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<SimilarMovie>).value)
          .filter(Boolean);

        return {
          status: 'success',
          query: jsonResponse.query,
          message: jsonResponse.message,
          movies: successfulResults,
          count: successfulResults.length
        };
      }

      console.log('Parsed AI Search Response:', jsonResponse);
      
      return jsonResponse as AISearchResponse;
      
    } catch (error: any) {
      console.error('❌ AI Search API error:', error);
      console.log('Falling back to mock search response...');
      return this.mockSearchMovies(query);
    }
  }

  // Deprecated: Giữ lại để backward compatibility
  async chat(prompt: string): Promise<string> {
    console.warn('chat() method is deprecated, use searchMovies() instead');
    const result = await this.searchMovies(prompt);
    
    if (result.status === 'success') {
      return result.message + '\n\nTìm thấy ' + result.count + ' phim phù hợp.';
    } else {
      return result.message;
    }
  }

  private mockSearchMovies(query: string): AISearchResponse {
    // Mock search responses based on query content
    const lowerQuery = query.toLowerCase();
    
    // Mock movie data structure to match SimilarMovie
    const mockMovies: SimilarMovie[] = [
      {
        id: 1,
        title: "One Piece Film: Red",
        description: "Phim điện ảnh về hành trình tìm kho báu One Piece",
        genre: ["Anime", "Hành động", "Phiêu lưu"],
        releaseYear: 2022,
        rating: 8.5,
        posterUrl: "/placeholder/onepiece.jpg",
        similarity: 0.95
      },
      {
        id: 2, 
        title: "Your Name",
        description: "Anime tình cảm về hoán đổi thân thể giữa hai người",
        genre: ["Anime", "Romance", "Drama"],
        releaseYear: 2016,
        rating: 8.4,
        posterUrl: "/placeholder/yourname.jpg", 
        similarity: 0.88
      },
      {
        id: 3,
        title: "Demon Slayer: Mugen Train", 
        description: "Hành trình tiêu diệt quỷ với đồ họa tuyệt đẹp",
        genre: ["Anime", "Hành động", "Supernatural"],
        releaseYear: 2020,
        rating: 8.7,
        posterUrl: "/placeholder/demonslayer.jpg",
        similarity: 0.82
      }
    ];

    if (lowerQuery.includes('anime') || lowerQuery.includes('hoạt hình')) {
      return {
        status: 'success',
        query: query,
        movies: mockMovies,
        count: mockMovies.length,
        message: `Tìm thấy ${mockMovies.length} phim anime phù hợp với yêu cầu của bạn`
      };
    }
    
    if (lowerQuery.includes('hành động') || lowerQuery.includes('action')) {
      const actionMovies = mockMovies.filter(m => 
        m.genre && Array.isArray(m.genre) && m.genre.some(g => g.toLowerCase().includes('hành động'))
      );
      return {
        status: 'success', 
        query: query,
        movies: actionMovies,
        count: actionMovies.length,
        message: `Tìm thấy ${actionMovies.length} phim hành động phù hợp với yêu cầu của bạn`
      };
    }

    if (lowerQuery.includes('romance') || lowerQuery.includes('tình cảm')) {
      const romanceMovies = mockMovies.filter(m =>
        m.genre && Array.isArray(m.genre) && m.genre.some(g => g.toLowerCase().includes('romance'))
      );
      return {
        status: 'success',
        query: query, 
        movies: romanceMovies,
        count: romanceMovies.length,
        message: `Tìm thấy ${romanceMovies.length} phim tình cảm phù hợp với yêu cầu của bạn`
      };
    }

    // Default case - return all mock movies
    return {
      status: 'success',
      query: query,
      movies: mockMovies.slice(0, 3), // Limit to 3 results
      count: 3,
      message: 'Tìm thấy 3 phim phù hợp với yêu cầu của bạn'
    };
  }
}

export default new AIService();