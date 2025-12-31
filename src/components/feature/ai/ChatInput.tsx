import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-(--surface) p-4">
      {/* Input Area */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Hỏi tôi về phim ảnh, anime, series..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-(--background) border border-(--border-blue)/30 rounded-2xl px-4 py-3 pr-12 text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:border-(--primary) transition-colors disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ 
              minHeight: '48px',
              scrollbarWidth: 'thin'
            }}
          />
          {/* Character counter */}
          <div className="absolute bottom-2 right-12 text-xs text-(--text-secondary)">
            {message.length}/500
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          className="w-12 h-12 bg-linear-to-r from-(--gradient-primary-start) to-(--gradient-primary-end) hover:from-(--gradient-secondary-start) hover:to-(--gradient-secondary-end) text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-(--text-secondary) mt-2 text-center">
        AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
      </p>
    </div>
  );
}