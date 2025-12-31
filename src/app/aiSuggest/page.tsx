'use client';

import PageHeader from '@/components/layout/PageHeader';
import { useAIChat } from '@/hooks/useAIChat';
import ChatMessageBubble from '@/components/feature/ai/ChatMessageBubble';
import ChatInput from '@/components/feature/ai/ChatInput';
import TypingIndicator from '@/components/feature/ai/TypingIndicator';

export default function AISuggestPage() {
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef } = useAIChat();

  return (
    <div className="bg-(--background) flex flex-col min-h-screen h-screen overflow-hidden">
      {/* Page Header PopRCM */}
      <PageHeader />

      {/* Main Chat Area: sidebar + chat */}
      <main className="flex flex-row w-full flex-1 min-h-0 bg-(--surface)" style={{height: 'calc(100vh - 64px)'}}>
        {/* Sidebar trái: header chat + gợi ý */}
        <aside className="hidden md:flex flex-col w-[320px] min-w-[260px] max-w-[360px] h-full border-r border-(--border-blue)/10 bg-linear-to-b from-(--background) to-(--surface) p-0">
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <div className="w-16 h-16 bg-linear-to-br from-(--surface) to-(--gradient-secondary-end) rounded-full flex items-center justify-center">
              <span className="flex items-center justify-center">
                <img
                  src={"/LogoIcon.png"}
                  alt="PopRCM Icon"
                  className="h-[60%] w-[60%]"
                />
              </span>
            </div>
            <div className="text-center">
              <h2 className="font-bold text-xl text-(--text-primary)">Trò chuyện với AI PopRCM</h2>
              <span className="text-sm text-(--text-secondary)">Hỏi đáp phim ảnh, anime, series, review, gợi ý...</span>
            </div>
            <button
              onClick={clearChat}
              className="mt-4 px-4 py-2 text-sm bg-(--background-secondary) hover:bg-(--background-secondary)/80 text-(--text-focus) border border-(--border-blue)/50 transition-colors rounded-lg"
            >
              🗑️ Xóa đoạn chat
            </button>
          </div>
          {/* Gợi ý nhanh */}
          <div className="px-6 pb-8 flex-1">
            <div className="mb-4 text-sm font-medium text-(--text-primary)">🚀 Gợi ý nhanh</div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => sendMessage("Gợi ý phim hay hôm nay")}
                disabled={isLoading}
                className="text-left text-sm px-4 py-3 bg-(--background-secondary)/30 hover:bg-(--background-secondary)/60 text-(--text-focus) border border-(--border-blue)/20 rounded-xl transition-all duration-200 hover:border-(--primary)/30 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎬</span>
                  <span>Gợi ý phim hay hôm nay</span>
                </div>
              </button>
              <button 
                onClick={() => sendMessage("Anime nào đang hot?")}
                disabled={isLoading}
                className="text-left text-sm px-4 py-3 bg-(--background-secondary)/30 hover:bg-(--background-secondary)/60 text-(--text-focus) border border-(--border-blue)/20 rounded-xl transition-all duration-200 hover:border-(--primary)/30 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📺</span>
                  <span>Anime nào đang hot?</span>
                </div>
              </button>
              <button 
                onClick={() => sendMessage("Top phim được xem nhiều nhất")}
                disabled={isLoading}
                className="text-left text-sm px-4 py-3 bg-(--background-secondary)/30 hover:bg-(--background-secondary)/60 text-(--text-focus) border border-(--border-blue)/20 rounded-xl transition-all duration-200 hover:border-(--primary)/30 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">⭐</span>
                  <span>Phim được xem nhiều nhất?</span>
                </div>
              </button>
              <button 
                onClick={() => sendMessage("Tìm phim theo thể loại")}
                disabled={isLoading}
                className="text-left text-sm px-4 py-3 bg-(--background-secondary)/30 hover:bg-(--background-secondary)/60 text-(--text-focus) border border-(--border-blue)/20 rounded-xl transition-all duration-200 hover:border-(--primary)/30 hover:shadow-lg disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔍</span>
                  <span>Tìm phim theo thể loại</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Vùng chat messages + input */}
        <section className="flex flex-col flex-1 min-w-0 h-full">
          {/* Chat messages: flex-grow, scroll riêng, page không scroll */}
          <div className="flex-1 min-h-0 w-full px-0 py-0 bg-linear-to-b from-(--background)/80 to-(--surface)/90 overflow-y-auto">
            <div className="w-full px-8 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 bg-linear-to-br from-(--surface) to-(--gradient-secondary-end) rounded-full flex items-center justify-center">
                    <span className="flex items-center justify-center">
                      <img
                        src={"/LogoIcon.png"}
                        alt="PopRCM Icon"
                        className="h-[60%] w-[60%]"
                      />
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
                    Chào mừng đến với AI Chat
                  </h2>
                  <p className="text-(--text-secondary) mb-6 max-w-lg">
                    Hãy hỏi tôi bất cứ điều gì về phim ảnh, anime, series hoặc nhấn vào gợi ý nhanh bên dưới!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Chat input full width, không bo góc */}
          <div className="w-full border-t border-(--border-blue)/40 bg-(--surface)">
            <div className="w-full px-4 pt-1">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}