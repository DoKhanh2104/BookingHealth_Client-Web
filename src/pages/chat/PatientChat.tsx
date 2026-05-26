import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { userService } from '../../services/userService';
import type { ChatRoom, ChatMessage, User } from '../../types';
import { toast } from 'sonner';

const PatientChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get user profile on mount
  useEffect(() => {
    userService.getProfile()
      .then((res) => {
        if (res.result) {
          setCurrentUser(res.result);
        }
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
      });
  }, []);

  // Fetch or create chat room for this appointment
  useEffect(() => {
    if (!id) return;
    chatService.getRoomByAppointment(Number(id))
      .then((res) => {
        if (res.result) {
          setRoom(res.result);
          // Initial fetch of messages
          return chatService.getMessages(res.result.id);
        }
        return null;
      })
      .then((msgRes) => {
        if (msgRes && msgRes.result) {
          setMessages(msgRes.result);
          setTimeout(scrollToBottom, 100);
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || 'Không thể tạo phòng chat. Đảm bảo ca khám đã hoàn thành!';
        toast.error(errorMsg);
        // Redirect back after a delay
        setTimeout(() => navigate('/appointments'), 2000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // Poll messages every 3 seconds
  useEffect(() => {
    if (!room) return;
    const interval = setInterval(() => {
      chatService.getMessages(room.id)
        .then((res) => {
          if (res.result && JSON.stringify(res.result) !== JSON.stringify(messages)) {
            const oldLength = messages.length;
            setMessages(res.result);
            if (res.result.length > oldLength) {
              setTimeout(scrollToBottom, 100);
            }
          }
        })
        .catch((err) => {
          console.error('Error polling messages:', err);
        });
  }, 3000);

    return () => clearInterval(interval);
  }, [room, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !room || sending) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    chatService.sendMessage({ chatRoomId: room.id, content })
      .then((res) => {
        if (res.result) {
          setMessages((prev) => [...prev, res.result]);
          setTimeout(scrollToBottom, 50);
        }
      })
      .catch(() => {
        toast.error('Gửi tin nhắn không thành công. Hãy thử lại!');
        setInputText(content); // Restore content on error
      })
      .finally(() => {
        setSending(false);
      });
  };

  const formatMessageTime = (timeStr?: string) => {
    if (!timeStr) return '';
    try {
      // timeStr is LocalDateTime string (e.g. 2026-05-25T15:30:20)
      const timePart = timeStr.split('T')[1] || '';
      const parts = timePart.split(':');
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
      return timeStr;
    } catch {
      return timeStr || '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="text-muted-foreground font-semibold">Đang chuẩn bị phòng tư vấn...</span>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="bg-muted/10 min-h-screen py-6 text-xs sm:text-sm">
      <div className="max-w-3xl mx-auto px-4">
        {/* Chat Widget */}
        <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-muted/5 flex-shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 flex-shrink-0">
                {room.doctorName ? room.doctorName.charAt(0) : 'B'}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-foreground text-sm sm:text-base leading-snug">
                  {room.doctorName ? `BS. ${room.doctorName}` : 'Bác sĩ phụ trách'}
                </h4>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  ● Kênh tư vấn sau khám (Lịch hẹn #{room.appointmentId})
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground font-bold text-xs rounded-xl hover:bg-accent cursor-pointer transition-colors"
            >
              ← Quay lại
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground space-y-2">
                <div className="text-2xl">💬</div>
                <p className="font-medium text-xs">Phòng tư vấn trực tuyến đã sẵn sàng.</p>
                <p className="text-[10px] opacity-75 max-w-xs mx-auto">
                  Hãy gửi lời chào hoặc thắc mắc của bạn về đơn thuốc, tác dụng phụ hoặc chế độ ăn uống cho Bác sĩ.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUser && msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] border border-primary/20 flex-shrink-0 mb-1">
                          {msg.senderName ? msg.senderName.charAt(0) : 'B'}
                        </div>
                      )}
                      <div
                        className={`
                          px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm text-xs
                          ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-background border border-border text-foreground rounded-tl-none'
                          }
                        `}
                      >
                        <p className="break-words">{msg.content}</p>
                        <span
                          className={`
                            block text-[8px] mt-1 text-right
                            ${isMe ? 'text-primary-foreground/75' : 'text-muted-foreground/75'}
                          `}
                        >
                          {formatMessageTime(msg.sendTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border flex gap-2.5 flex-shrink-0 bg-background"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi tư vấn bác sĩ..."
              className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-black rounded-xl shadow-md shadow-primary/20 transition-all text-xs cursor-pointer"
            >
              {sending ? 'Đang gửi...' : 'Gửi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
