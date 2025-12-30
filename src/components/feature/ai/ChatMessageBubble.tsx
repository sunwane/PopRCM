import { ChatMessage } from '@/hooks/useAIChat';
import Link from 'next/link';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatContent = (content: string) => {
    // Replace line breaks with <br> and format emojis
    return content
      .split('\n')
      .map((line, index) => (
        <span key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </span>
      ));
  };

  if (message.isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-end max-w-[80%]">
          <div className="bg-linear-to-r from-(--gradient-primary-start) to-(--gradient-primary-end) text-white px-6 py-3 rounded-2xl rounded-br-md shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {formatContent(message.content)}
            </p>
          </div>
          <span className="text-xs text-(--text-secondary) mt-1 px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="w-8 h-8 bg-(--primary) rounded-full flex items-center justify-center ml-3 mt-1 shrink-0">
          <span className="text-white text-sm font-semibold">U</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
    <div className="w-10 h-10 mr-2 bg-linear-to-br from-(--surface) to-(--gradient-secondary-end) rounded-full flex items-center justify-center">
      <span className="flex items-center justify-center">
        <img
          src={"/LogoIcon.png"}
          alt="PopRCM Icon"
          className="h-[60%] w-[60%]"
        />
      </span>
    </div>
      <div className="flex flex-col items-start max-w-[80%]">
        <div className="bg-(--surface) text-(--text-primary) px-6 py-3 rounded-2xl rounded-bl-md shadow-lg border border-(--border-blue)/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {formatContent(message.content)}
          </p>
        </div>
        
        {/* Display movies if available */}
        {message.movies && message.movies.length > 0 && (
          <div className="mt-3 w-full">
            <div className="grid gap-3 max-w-md">
              {message.movies.map((movie) => (
                <div key={movie.id} className="bg-(--surface-secondary) border border-(--border-blue)/10 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    {movie.posterUrl && (
                      <img 
                        src={movie.posterUrl || '/placeholder/placeholder-poster.png'} 
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder/placeholder-poster.png';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-(--text-primary) text-sm truncate">
                        {movie.title || 'Không có tiêu đề'}
                      </h4>
                      <p 
                        className="text-xs text-(--text-secondary) mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{__html: movie.description || 'Không có mô tả'}}>
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {movie.releaseYear && (
                          <span className="text-xs bg-(--primary)/10 text-(--primary) px-2 py-1 rounded">
                            {movie.releaseYear}
                          </span>
                        )}
                        {movie.rating ? (
                          <span className="text-xs text-yellow-400 bg-(--surface) px-2 py-1 rounded">
                            {movie.rating}
                          </span>
                        ) : null}
                        {movie.similarity && (
                          <span className="ml-0.5 text-xs text-(--accent) font-medium">
                            {Math.round((movie.similarity || 0) * 100)}% phù hợp
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genre && Array.isArray(movie.genre) && movie.genre.slice(0, 3).map((g, index) => (
                          <span key={index} className="text-xs bg-white/10 py-1 px-2 text-gray-400 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Add view movie button */}
                  <Link 
                    href={`/movie/${movie.movieId || movie.id}`}
                    className="block mt-3 text-center bg-(--gradient-primary-start) hover:bg-(--primary) text-white py-2 px-3 rounded text-xs transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <span className="text-xs text-(--text-secondary) mt-1 px-2">
          AI • {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}