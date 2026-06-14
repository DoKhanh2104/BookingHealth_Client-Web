import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

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
  'Gần đây tôi hay bị đau đầu, chóng mặt và mờ mắt...',
  'Tôi thường xuyên bị ợ hơi, ợ chua và đầy bụng.',
  'Bé nhà tôi 3 tuổi bị sốt cao liên tục 2 ngày nay.',
  'Tôi muốn tìm bác sĩ Tim mạch giỏi ở gần đây.',
];

const Screening: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Xin chào! Tôi là **Trợ lý AI **.\n\nBạn có thể mô tả các triệu chứng đang gặp phải (ví dụ: *"Tôi bị đau đầu và mờ mắt"*), tôi sẽ phân tích và gợi ý chuyên khoa phù hợp.\n\nNgoài ra, bạn cũng có thể hỏi tôi về các thông tin khác như tìm bác sĩ, phòng khám gần nhất!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationAsked, setLocationAsked] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const requestLocation = useCallback(() => {
    if (locationAsked) return;
    setLocationAsked(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // User denied
        },
      );
    }
  }, [locationAsked]);

  const saveScreeningLog = async (symptoms: string, specialtyName: string) => {
    try {
      // Bọc trong try-catch, bỏ qua lỗi nếu token hết hạn (do apiClient sẽ tự redirect 401)
      // hoặc nếu người dùng chưa đăng nhập thì API có thể vẫn nhận nếu ta tắt bắt buộc authen.
      // Ở đây ta cứ gọi thử.
      const token = localStorage.getItem('bookinghealth_admin_token');
      if (!token) return; // Nếu đang yêu cầu authen, tạm thời bỏ qua nếu ko có token (hoặc BE cho phép null)

      await apiClient.post('/screen-logs', {
        symptoms,
        specialtyName,
      });
    } catch (error) {
      console.warn('Lỗi khi lưu nhật ký sàng lọc:', error);
    }
  };

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

        // Nếu là tư vấn triệu chứng và có specialty trả về -> Lưu log
        if (data.intent === 'symptom_advice' && data.specialty) {
          await saveScreeningLog(question, data.specialty);
        }
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

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
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
    <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-primary flex items-center justify-between px-32 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-white font-bold text-sm leading-tight">Trợ lý AI BookingHealth</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-primary-foreground/80 text-xs">
                Sẵn sàng phân tích triệu chứng
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userLocation && (
            <span className="text-primary-foreground/70 text-xs bg-white/10 px-2.5 py-1 rounded-full">
              GPS đã bật
            </span>
          )}
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors text-sm"
            title="Quay lại"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-24 xl:px-48 py-6 space-y-4 bg-muted/20"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                AI
              </div>
            )}
            <div
              className={`max-w-[70%] sm:max-w-[60%] rounded-2xl px-5 py-3 text-sm space-y-1 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20'
                  : 'bg-background border border-border text-foreground rounded-tl-none shadow-sm'
              }`}
            >
              <div className={msg.role === 'assistant' ? 'space-y-1' : ''}>
                {formatContent(msg.content)}
              </div>
              <span
                className={`block text-[10px] mt-2 ${
                  msg.role === 'user'
                    ? 'text-primary-foreground/70 text-right'
                    : 'text-muted-foreground'
                }`}
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
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
              AI
            </div>
            <div className="bg-background border border-border rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
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

      {/* Suggested Questions */}
      {messages.filter((m) => m.role === 'user').length === 0 && !isLoading && (
        <div className="px-4 sm:px-8 lg:px-24 xl:px-48 pb-3 flex flex-wrap gap-2 bg-muted/20">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/10 hover:border-primary/30 transition-colors text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 sm:px-8 lg:px-24 xl:px-48 py-4 border-t border-border bg-background flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          {!userLocation && (
            <button
              type="button"
              onClick={requestLocation}
              className="w-11 h-11 flex-shrink-0 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center text-lg transition-colors"
              title="Chia sẻ vị trí để tìm phòng khám gần bạn"
            >
              📍
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Mô tả triệu chứng của bạn hoặc hỏi bất kỳ điều gì..."
            className="flex-1 px-5 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-muted/30 transition-all placeholder-muted-foreground"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-11 h-11 flex-shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-primary/30 transition-all"
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
      </div>
    </div>
  );
};

export default Screening;
