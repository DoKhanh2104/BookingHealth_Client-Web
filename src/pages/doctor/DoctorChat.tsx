import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { chatService } from '../../services/chatService';
import { userService } from '../../services/userService';
import type { ChatRoom, ChatMessage, User } from '../../types';

const DoctorChat: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch initial profile & rooms
  useEffect(() => {
    let active = true;

    Promise.all([
      userService.getProfile(),
      chatService.getMyChatRooms()
    ])
      .then(([userRes, roomsRes]) => {
        if (!active) return;
        if (userRes.result) {
          setCurrentUser(userRes.result);
        }
        if (roomsRes.result) {
          setChatRooms(roomsRes.result);
          if (roomsRes.result.length > 0) {
            setActiveRoomId(roomsRes.result[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading chat workspace:', err);
        toast.error('Không thể tải danh sách cuộc trò chuyện!');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Fetch messages when active room changes
  useEffect(() => {
    if (!activeRoomId) return;
    let active = true;

    chatService.getMessages(activeRoomId)
      .then((res) => {
        if (!active) return;
        if (res.result) {
          setMessages(res.result);
          setTimeout(scrollToBottom, 50);
        }
      })
      .catch((err) => {
        console.error('Error fetching room messages:', err);
      });

    return () => {
      active = false;
    };
  }, [activeRoomId]);

  // Poll for message updates
  useEffect(() => {
    if (!activeRoomId) return;

    const interval = setInterval(() => {
      chatService.getMessages(activeRoomId)
        .then((res) => {
          if (res.result && JSON.stringify(res.result) !== JSON.stringify(messages)) {
            const oldLength = messages.length;
            setMessages(res.result);
            if (res.result.length > oldLength) {
              setTimeout(scrollToBottom, 50);
            }
          }
        })
        .catch(() => {});

      chatService.getMyChatRooms()
        .then((res) => {
          if (res.result) {
            setChatRooms(res.result);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [activeRoomId, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRoomId || sending) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    chatService.sendMessage({ chatRoomId: activeRoomId, content })
      .then((res) => {
        if (res.result) {
          setMessages((prev) => [...prev, res.result]);
          setTimeout(scrollToBottom, 50);

          chatService.getMyChatRooms()
            .then((roomsRes) => {
              if (roomsRes.result) setChatRooms(roomsRes.result);
            });
        }
      })
      .catch(() => {
        toast.error('Gửi tin nhắn thất bại!');
        setInputText(content);
      })
      .finally(() => {
        setSending(false);
      });
  };

  const handleSelectRoom = (roomId: number) => {
    setActiveRoomId(roomId);
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    try {
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

  const activeRoom = chatRooms.find((r) => r.id === activeRoomId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs h-[calc(100vh-12rem)]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="text-muted-foreground font-semibold">Đang tải hộp thoại...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm h-[calc(100vh-12rem)] flex text-xs">
      {/* Sidebar - Rooms List */}
      <div className="w-80 border-r border-border flex flex-col flex-shrink-0 bg-muted/10">
        <div className="p-4 border-b border-border bg-background">
          <h3 className="font-extrabold text-foreground text-sm">Hộp thoại tư vấn</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {chatRooms.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Không có cuộc hội thoại nào.
            </div>
          ) : (
            chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room.id)}
                className={`
                  w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-accent/40 cursor-pointer
                  ${activeRoomId === room.id ? 'bg-primary/5 hover:bg-primary/5' : ''}
                `}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 border border-primary/20">
                  {room.userName ? room.userName.charAt(0) : 'B'}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-bold truncate text-foreground">
                      {room.userName || 'Bệnh nhân'}
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">
                      {formatTime(room.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-[10px] truncate leading-tight text-muted-foreground/80">
                    {room.lastMessage || 'Chưa có tin nhắn'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {activeRoom ? (
          <>
            {/* Chat header */}
            <div className="h-14 border-b border-border flex items-center px-6 gap-3 flex-shrink-0 bg-muted/5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                {activeRoom.userName ? activeRoom.userName.charAt(0) : 'B'}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{activeRoom.userName || 'Bệnh nhân'}</h4>
                <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                  ● Kênh tư vấn trực tuyến (Lịch hẹn #{activeRoom.appointmentId})
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  Bắt đầu cuộc trò chuyện tư vấn với bệnh nhân.
                </div>
              ) : (
                messages.map((msg) => {
                  const isDoctor = currentUser && msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-sm px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm text-xs
                          ${
                            isDoctor
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted/50 border border-border text-foreground rounded-tl-none'
                          }
                        `}
                      >
                        <p className="break-words">{msg.content}</p>
                        <span
                          className={`
                            block text-[9px] mt-1 text-right
                            ${isDoctor ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}
                          `}
                        >
                          {formatTime(msg.sendTime)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border flex gap-2 flex-shrink-0 bg-muted/5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung phản hồi tư vấn..."
                className="flex-1 px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="px-5 py-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20 cursor-pointer transition-all"
              >
                {sending ? 'Đang gửi...' : 'Gửi'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Chọn một hộp thoại để bắt đầu tư vấn.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
