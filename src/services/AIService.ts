import { SimilarMovie, AISearchResponse } from '@/types/Movies';

class AIService {
  private baseURL = 'http://localhost:8088/api';

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
      console.log('Attempting to call AI search API...');
      const authToken = localStorage.getItem('authToken') || '';
      const response = await fetch(`${this.baseURL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`AI Search API error: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('AI Search API Response:', jsonResponse);
      
      // Response structure từ controller:
      // {
      //   status: "success" | "error",
      //   query: string,
      //   movies: SimilarMovie[],
      //   count: number,
      //   message: string
      // }
      
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
        m.genre.some(g => g.toLowerCase().includes('hành động'))
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
        m.genre.some(g => g.toLowerCase().includes('romance'))
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

  // Keep old mockChat for backward compatibility
  private mockChat(query: string): string {
    // Mock AI responses based on prompt content
    const lowerPrompt = query.toLowerCase();
    
    if (lowerPrompt.includes('phim') || lowerPrompt.includes('movie')) {
      return `Dựa trên câu hỏi của bạn về phim, tôi khuyên bạn nên xem:

🎬 **One Piece: Đảo Hải tặc** - Anime huyền thoại với hành trình tìm kho báu
🎭 **Your Name** - Anime tình cảm siêu hay về hoán đổi cơ thể  
🔥 **Demon Slayer** - Hành động đỉnh cao với đồ họa tuyệt đẹp

Bạn thích thể loại nào nhất? Tôi có thể gợi ý thêm!`;
    }
    
    if (lowerPrompt.includes('anime')) {
      return `Anime là một thế giới tuyệt vời! Dựa trên sở thích của bạn, tôi gợi ý:

✨ **Thể loại hành động:** Attack on Titan, Demon Slayer, Jujutsu Kaisen
💕 **Romance:** Your Name, A Silent Voice, Weathering with You
😄 **Comedy:** One Punch Man, Mob Psycho 100
🎭 **Drama:** Spirited Away, Princess Mononoke

Bạn muốn khám phá thể loại nào?`;
    }

    if (lowerPrompt.includes('gợi ý') || lowerPrompt.includes('recommend')) {
      return `Tôi sẽ gợi ý cho bạn những bộ phim hot nhất hiện tại:

🔥 **Top trending:**
• One Piece (Anime) - Hành trình huyền thoại
• Spirited Away - Kiệt tác Ghibli  
• Demon Slayer - Hành động mãn nhãn
• Your Name - Romance cảm động

💡 **Mẹo:** Hãy cho tôi biết bạn thích thể loại gì để tôi gợi ý chính xác hơn!`;
    }

    // Default response
    return `Xin chào! Tôi là AI assistant của PopRCM

Tôi có thể giúp bạn:
🎬 Tìm phim hay theo sở thích
📺 Gợi ý anime/series hot
⭐ Đánh giá và review phim
🔍 Tìm kiếm nội dung theo thể loại

Hãy hỏi tôi bất cứ điều gì về phim ảnh nhé! 😊`;
  }
}

export default new AIService();