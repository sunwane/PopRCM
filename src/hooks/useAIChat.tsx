import { useState, useRef, useEffect } from 'react';
import AIService from '@/services/AIService';
import { SimilarMovie } from '@/types/Movies';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  movies?: SimilarMovie[]; // Add movies to chat message
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-' + Date.now(),
      content: `Xin chào! Tôi là AI assistant của PopRCM 🤖

Tôi có thể giúp bạn:
🎬 Tìm phim hay theo sở thích
📺 Gợi ý anime/series hot  
⭐ Đánh giá và review phim
🔍 Tìm kiếm nội dung theo thể loại

Hãy hỏi tôi bất cứ điều gì về phim ảnh nhé! 😊`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const searchResult = await AIService.searchMovies(content);
      
      let responseContent = '';
      let movieResults: SimilarMovie[] = [];
      
      if (searchResult.status === 'success') {
        responseContent = searchResult.message;
        movieResults = searchResult.movies;
        
        // Add additional context if movies found
        if (movieResults.length > 0) {
          responseContent += '\n\nDưới đây là những bộ phim tôi gợi ý cho bạn:';
        }
      } else {
        responseContent = searchResult.message;
      }
      
      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        movies: movieResults.length > 0 ? movieResults : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err: any) {
      console.error('AI Chat error:', err);
      setError('Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!');
      
      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        content: 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 😅',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-' + Date.now(),
      content: `Xin chào! Tôi là AI assistant của PopRCM 🤖

Tôi có thể giúp bạn:
🎬 Tìm phim hay theo sở thích
📺 Gợi ý anime/series hot  
⭐ Đánh giá và review phim
🔍 Tìm kiếm nội dung theo thể loại

Hãy hỏi tôi bất cứ điều gì về phim ảnh nhé! 😊`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    messagesEndRef
  };
}