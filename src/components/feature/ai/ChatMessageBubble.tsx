import { ChatMessage } from '@/hooks/useAIChat';

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
      <div className="w-8 h-8 bg-linear-to-br from-(--gradient-secondary-start) to-(--gradient-secondary-end) rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
        <span className="text-white text-sm">🤖</span>
      </div>
      <div className="flex flex-col items-start max-w-[80%]">
        <div className="bg-(--surface) text-(--text-primary) px-6 py-3 rounded-2xl rounded-bl-md shadow-lg border border-(--border-blue)/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {formatContent(message.content)}
          </p>
        </div>
        <span className="text-xs text-(--text-secondary) mt-1 px-2">
          AI • {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}