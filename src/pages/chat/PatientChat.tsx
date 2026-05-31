import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { userService } from '../../services/userService';
import type { ChatRoom, ChatMessage, User } from '../../types';
import { toast } from 'sonner';

const PatientChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Get user profile on mount
  useEffect(() => {
    userService
      .getProfile()
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
    chatService
      .getRoomByAppointment(Number(id))
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
        const errorMsg =
          err.response?.data?.message || 'Không thể tạo phòng chat. Đảm bảo ca khám đã hoàn thành!';
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
      chatService
        .getMessages(room.id)
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

    chatService
      .sendMessage({ chatRoomId: room.id, content })
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
        setTimeout(() => {
          inputRef.current?.focus({ preventScroll: true });
        }, 0);
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
    <div className="bg-muted/10 min-h-screen py-8 text-sm font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Chat Widget */}
        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5 flex flex-col h-[calc(100vh-6rem)]">
          {/* Header */}
          <div className="h-20 border-b border-border/50 flex items-center justify-between px-8 bg-background/50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/10 flex-shrink-0 border border-primary/20">
                {room.doctorName ? room.doctorName.charAt(0) : 'B'}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-foreground text-lg leading-snug">
                  {room.doctorName ? `BS. ${room.doctorName}` : 'Bác sĩ phụ trách'}
                </h4>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Kênh tư vấn sau khám (Lịch hẹn #{room.appointmentId})
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="px-5 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-border/80 font-semibold text-sm rounded-2xl hover:bg-accent/50 cursor-pointer transition-all shadow-sm"
            >
              ← Quay lại
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
          >
            {messages.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground space-y-2">
                <div className="text-2xl">💬</div>
                <p className="font-medium text-xs">Phòng tư vấn trực tuyến đã sẵn sàng.</p>
                <p className="text-[10px] opacity-75 max-w-xs mx-auto">
                  Hãy gửi lời chào hoặc thắc mắc của bạn về đơn thuốc, tác dụng phụ hoặc chế độ ăn
                  uống cho Bác sĩ.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUser && msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className="flex items-end gap-3 max-w-[75%]">
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-md shadow-primary/10 flex-shrink-0 mb-1 border border-primary/20">
                          {msg.senderName ? msg.senderName.charAt(0) : 'B'}
                        </div>
                      )}
                      <div
                        className={`
                          px-5 py-3.5 rounded-[1.5rem] leading-relaxed text-sm shadow-sm
                          ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-sm shadow-primary/20'
                              : 'bg-background border border-border text-foreground rounded-bl-sm shadow-foreground/5'
                          }
                        `}
                      >
                        <p className="break-words">{msg.content}</p>
                        <span
                          className={`
                            block text-[10px] mt-1.5 font-medium
                            ${isMe ? 'text-primary-foreground/80 text-right' : 'text-muted-foreground text-left'}
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
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-5 border-t border-border flex gap-3 flex-shrink-0 bg-background/95 backdrop-blur-md rounded-b-[2rem]"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi tư vấn bác sĩ..."
              className="flex-1 px-5 py-3.5 border border-border rounded-2xl bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all text-sm cursor-pointer flex items-center justify-center min-w-[100px]"
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                'Gửi'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
