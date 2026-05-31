/**
 * AI Chat Widget — floating chatbot powered by BookingHealth AI (RAG).
 * Tích hợp vào ClientLayout, hiển thị ở góc dưới phải màn hình.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';

const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8084';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserLocation {
  lat: number;
  lon: number;
}

const SUGGESTED_QUESTIONS = [
  '🩺 Bác sĩ Tim mạch nào được đánh giá cao nhất?',
  '📍 Phòng khám nào gần tôi nhất?',
  '💰 Bác sĩ Da liễu nào có phí khám rẻ nhất?',
  '📋 Có những chuyên khoa nào trong hệ thống?',
];

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Xin chào! Tôi là **Trợ lý AI BookingHealth**.\n\nTôi có thể giúp bạn:\n• 🔍 Tìm bác sĩ phù hợp theo chuyên khoa\n• 📍 Tìm phòng khám gần bạn nhất\n• 💰 So sánh phí khám bệnh\n• 🗓 Kiểm tra lịch khám trống\n\nBạn muốn hỏi gì hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationAsked, setLocationAsked] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen, isMinimized]);

  const requestLocation = useCallback(() => {
    if (locationAsked) return;
    setLocationAsked(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // User denied — that's fine, just no geo features
        },
      );
    }
  }, [locationAsked]);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);

      // Build history (last 6 messages excluding welcome)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await fetch(`${AI_API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            chat_history: history,
            user_location: userLocation,
            stream: false,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.answer || 'Xin lỗi, tôi không thể xử lý câu hỏi này.',
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '⚠️ Không thể kết nối đến AI server. Vui lòng thử lại sau.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          inputRef.current?.focus({ preventScroll: true });
        }, 0);
      }
    },
    [isLoading, messages, userLocation],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    requestLocation();
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, i) => {
      // Bold text
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={i}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          id="ai-chat-widget-open-btn"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Trợ lý AI BookingHealth"
        >
          <span className="text-2xl">🤖</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          {/* Tooltip */}
          <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Trợ lý AI BookingHealth
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chat-widget"
          className={`fixed bottom-6 right-6 z-50 w-[380px] bg-background rounded-3xl shadow-2xl shadow-primary/20 border border-border flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="h-16 bg-primary flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
                🤖
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">
                  Trợ lý AI BookingHealth
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 text-[10px]">Powered by Gemini</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {userLocation && (
                <span className="text-blue-100 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                  📍 GPS
                </span>
              )}
              <button
                id="ai-chat-minimize-btn"
                onClick={() => setIsMinimized((v) => !v)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              <button
                id="ai-chat-close-btn"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Đóng"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs space-y-0.5 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20'
                          : 'bg-background border border-border text-foreground rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div className={msg.role === 'assistant' ? 'space-y-0.5' : ''}>
                        {formatContent(msg.content)}
                      </div>
                      <span
                        className={`block text-[9px] mt-1 ${msg.role === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}
                      >
                        {msg.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-background border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions (show only if no user messages yet) */}
              {messages.filter((m) => m.role === 'user').length === 0 && !isLoading && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
                      className="text-[10px] px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/10 hover:border-primary/30 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-border flex gap-2 bg-background flex-shrink-0 rounded-b-[1.5rem]"
              >
                {!userLocation && (
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="w-10 h-10 flex-shrink-0 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center text-lg transition-colors"
                    title="Chia sẻ vị trí để tìm phòng khám gần bạn"
                  >
                    📍
                  </button>
                )}
                <input
                  ref={inputRef}
                  id="ai-chat-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi về bác sĩ, phòng khám..."
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-muted/20 transition-all placeholder-muted-foreground"
                />
                <button
                  id="ai-chat-send-btn"
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 flex-shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
