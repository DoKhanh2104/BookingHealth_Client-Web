import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import {
  XIcon,
  PlusIcon,
  MapPinIcon,
  SendIcon,
  ArrowRightIcon,
  StethoscopeIcon,
  StarIcon,
  BuildingIcon,
  MoneyIcon,
  HeartIcon,
  CheckCircleIcon,
} from '../../components/icons';

const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8084';

interface DoctorRef {
  id: number;
  name?: string;
  specialty?: string;
  rating?: number;
  fee?: string;
  clinic?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  doctors?: DoctorRef[];
  screenLogId?: number; // id bản ghi nhật ký sàng lọc (để gửi "Phản hồi tốt")
  feedbackSent?: boolean; // đã bấm phản hồi tốt chưa
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

// Lưu hội thoại theo phiên để không mất khi rời trang / chuyển tab / tải lại
const CHAT_STORAGE_KEY = 'bookinghealth_ai_chat';

const WELCOME_CONTENT =
  'Xin chào! Tôi là **Trợ lý AI **.\n\nBạn có thể mô tả các triệu chứng đang gặp phải (ví dụ: *"Tôi bị đau đầu và mờ mắt"*), tôi sẽ phân tích và gợi ý chuyên khoa phù hợp.\n\nNgoài ra, bạn cũng có thể hỏi tôi về các thông tin khác như tìm bác sĩ, phòng khám gần nhất!';

const createWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: WELCOME_CONTENT,
  timestamp: new Date(),
});

// Khôi phục hội thoại đã lưu khi vào lại trang (timestamp được parse lại thành Date)
const loadSession = (): { messages: ChatMessage[]; userLocation: UserLocation | null } => {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as {
        messages?: ChatMessage[];
        userLocation?: UserLocation | null;
      };
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        return {
          messages: parsed.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
          userLocation: parsed.userLocation ?? null,
        };
      }
    }
  } catch {
    // storage hỏng hoặc bị chặn → dùng mặc định
  }
  return { messages: [createWelcomeMessage()], userLocation: null };
};

const Screening: React.FC = () => {
  const restored = useMemo(() => loadSession(), []);
  const [messages, setMessages] = useState<ChatMessage[]>(restored.messages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(restored.userLocation);
  const [locationAsked, setLocationAsked] = useState(restored.userLocation != null);
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

  // Đồng bộ hội thoại vào sessionStorage (giữ lại khi rời trang / chuyển tab / tải lại)
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages, userLocation }));
    } catch {
      // bỏ qua nếu storage đầy hoặc bị chặn
    }
  }, [messages, userLocation]);

  const handleNewChat = () => {
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setMessages([createWelcomeMessage()]);
    setUserLocation(null);
    setLocationAsked(false);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

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

  const saveScreeningLog = async (symptoms: string, specialtyName: string, aiAnswer?: string) => {
    try {
      // Bọc trong try-catch, bỏ qua lỗi nếu token hết hạn (do apiClient sẽ tự redirect 401)
      // hoặc nếu người dùng chưa đăng nhập thì API có thể vẫn nhận nếu ta tắt bắt buộc authen.
      // Ở đây ta cứ gọi thử.
      const token = localStorage.getItem('bookinghealth_admin_token');
      if (!token) return; // Nếu đang yêu cầu authen, tạm thời bỏ qua nếu ko có token (hoặc BE cho phép null)

      const res = await apiClient.post('/screen-logs', {
        symptoms,
        specialtyName,
        aiAnswer,
      });
      return res?.data?.result?.id as number | undefined;
    } catch (error) {
      console.warn('Lỗi khi lưu nhật ký sàng lọc:', error);
    }
  };

  // Người dùng bấm "Phản hồi tốt" -> đánh dấu ca này để AI dùng làm mẫu huấn luyện
  const sendGoodFeedback = async (msgId: string, logId: number) => {
    try {
      await apiClient.patch(`/screen-logs/${logId}/useful`);
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, feedbackSent: true } : m)));
    } catch (error) {
      console.warn('Lỗi gửi phản hồi:', error);
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
        .map((m) => {
          let content = m.content;
          // Nhúng tên bác sĩ đã gợi ý vào ngữ cảnh (UI vẫn hiển thị card sạch),
          // để câu hỏi nối tiếp như "bác sĩ đầu tiên..." được AI nhớ đúng.
          if (m.role === 'assistant' && m.doctors && m.doctors.length > 0) {
            const list = m.doctors
              .map(
                (d, i) =>
                  `${i + 1}. ${d.name || `Bác sĩ #${d.id}`}${d.specialty ? ` (${d.specialty})` : ''}`,
              )
              .join('; ');
            content += `\n[Các bác sĩ đã gợi ý ở trên: ${list}]`;
          }
          return { role: m.role, content };
        });

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

        const assistantId = (Date.now() + 1).toString();
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: data.answer || 'Xin lỗi, tôi không thể xử lý câu hỏi này.',
            timestamp: new Date(),
            doctors: data.doctors,
          },
        ]);

        // Nếu là tư vấn triệu chứng và có specialty trả về -> Lưu log, gắn id để hiện nút phản hồi
        if (data.intent === 'symptom_advice' && data.specialty) {
          const logId = await saveScreeningLog(question, data.specialty, data.answer);
          if (logId) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, screenLogId: logId } : m)),
            );
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Không thể kết nối đến AI server. Vui lòng thử lại sau.',
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
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
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
            onClick={handleNewChat}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            title="Trò chuyện mới"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            title="Quay lại"
          >
            <XIcon className="w-4 h-4" />
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
              className={`max-w-[70%] sm:max-w-[60%] rounded-xl px-5 py-3 text-sm space-y-1 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm'
                  : 'bg-background border border-border text-foreground rounded-tl-none shadow-sm'
              }`}
            >
              <div className={msg.role === 'assistant' ? 'space-y-1' : ''}>
                {formatContent(msg.content)}
              </div>
              {msg.role === 'assistant' && msg.doctors && msg.doctors.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-muted-foreground font-medium">Bác sĩ gợi ý:</p>
                  {msg.doctors.map((doc) => (
                    <div key={doc.id} className="card card-hover p-3">
                      <div className="flex items-start gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <StethoscopeIcon className="w-4 h-4 text-primary" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm leading-tight truncate">
                            {doc.name || `Bác sĩ #${doc.id}`}
                          </p>
                          {doc.specialty && (
                            <p className="text-xs text-muted-foreground truncate">
                              {doc.specialty}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                            {doc.clinic && (
                              <span className="flex items-center gap-1 truncate">
                                <BuildingIcon className="w-3.5 h-3.5 shrink-0" />
                                {doc.clinic}
                              </span>
                            )}
                            {doc.rating != null && (
                              <span className="flex items-center gap-1">
                                <StarIcon filled className="w-3.5 h-3.5 text-amber-500" />
                                {doc.rating}/5
                              </span>
                            )}
                            {doc.fee && (
                              <span className="flex items-center gap-1">
                                <MoneyIcon className="w-3.5 h-3.5 shrink-0" />
                                {doc.fee}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/doctors/${doc.id}`)}
                        className="btn btn-primary btn-sm btn-block mt-2.5"
                      >
                        Xem chi tiết
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {msg.role === 'assistant' && msg.screenLogId && (
                <div className="mt-2">
                  {msg.feedbackSent ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircleIcon className="w-4 h-4" />
                      Cảm ơn phản hồi của bạn
                    </span>
                  ) : (
                    <button
                      onClick={() => sendGoodFeedback(msg.id, msg.screenLogId!)}
                      className="btn btn-outline btn-sm"
                      title="Đánh dấu câu trả lời này hữu ích (giúp AI học)"
                    >
                      <HeartIcon className="w-4 h-4" />
                      Phản hồi tốt
                    </button>
                  )}
                </div>
              )}
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
            <div className="bg-background border border-border rounded-xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
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
              className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
              title="Chia sẻ vị trí để tìm phòng khám gần bạn"
            >
              <MapPinIcon className="w-5 h-5" />
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Mô tả triệu chứng của bạn hoặc hỏi bất kỳ điều gì..."
            className="flex-1 px-5 py-3 text-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-muted/30 transition-all placeholder-muted-foreground"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Screening;
