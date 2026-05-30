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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
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
        setTimeout(() => {
          inputRef.current?.focus({ preventScroll: true });
        }, 0);
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
    <div className="bg-background/95 backdrop-blur-xl border border-border/80 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5 h-[calc(100vh-8rem)] flex text-sm font-sans mx-auto max-w-7xl mt-4">
      {/* Sidebar - Rooms List */}
      <div className="w-80 lg:w-96 border-r border-border flex flex-col flex-shrink-0 bg-muted/10">
        <div className="p-6 border-b border-border bg-background/50 backdrop-blur-md">
          <h3 className="font-extrabold text-foreground text-lg">Hộp thoại tư vấn</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/50">
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
                  w-full p-4 text-left transition-all flex items-start gap-4 hover:bg-background cursor-pointer group border-l-4
                  ${activeRoomId === room.id ? 'bg-background border-primary shadow-sm' : 'border-transparent'}
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors border
                  ${activeRoomId === room.id ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 border-primary/20' : 'bg-primary/5 text-primary border-primary/10 group-hover:bg-primary/10'}`}>
                  {room.userName ? room.userName.charAt(0) : 'B'}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground truncate text-base">
                      {room.userName || 'Bệnh nhân'}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium flex-shrink-0">
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
            <div className="h-20 border-b border-border flex items-center px-8 gap-4 flex-shrink-0 bg-background/50 backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg shadow-md shadow-primary/10">
                {activeRoom.userName ? activeRoom.userName.charAt(0) : 'B'}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-foreground text-lg">{activeRoom.userName || 'Bệnh nhân'}</h4>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  Kênh tư vấn trực tuyến (Lịch hẹn #{activeRoom.appointmentId})
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground font-medium">
                  Bắt đầu cuộc trò chuyện tư vấn với bệnh nhân.
                </div>
              ) : (
                messages.map((msg) => {
                  const isDoctor = currentUser && msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isDoctor ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`
                          max-w-[70%] px-5 py-3.5 rounded-[1.5rem] leading-relaxed shadow-sm text-sm
                          ${
                            isDoctor
                              ? 'bg-primary text-primary-foreground rounded-br-sm shadow-primary/20'
                              : 'bg-background border border-border text-foreground rounded-bl-sm shadow-foreground/5'
                          }
                        `}
                      >
                        <p className="break-words">{msg.content}</p>
                        <span
                          className={`
                            block text-[10px] mt-1.5 font-medium
                            ${isDoctor ? 'text-primary-foreground/80 text-right' : 'text-muted-foreground text-left'}
                          `}
                        >
                          {formatTime(msg.sendTime)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input form */}
            <form
              onSubmit={handleSendMessage}
              className="p-5 border-t border-border flex gap-3 flex-shrink-0 bg-background"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập nội dung phản hồi tư vấn..."
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium">
            Chọn một hộp thoại để bắt đầu tư vấn.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
