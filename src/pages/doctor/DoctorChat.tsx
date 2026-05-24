import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ChatRoom {
  id: number;
  patientName: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: number;
  sender: 'doctor' | 'patient';
  content: string;
  time: string;
}

const DoctorChat: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState<number>(1);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Active Chat Rooms list
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: 1,
      patientName: 'Nguyễn Văn Minh',
      lastMessage: 'Bác sĩ ơi, sau khi uống thuốc em vẫn thấy hơi đầy bụng ạ.',
      time: '10:45',
      unread: true,
    },
    {
      id: 2,
      patientName: 'Võ Hoàng Yến',
      lastMessage: 'Cảm ơn bác sĩ nhiều, huyết áp của em đo hôm nay tốt lắm rồi ạ.',
      time: 'Hôm qua',
      unread: false,
    },
    {
      id: 3,
      patientName: 'Trần Thị Hà',
      lastMessage: 'Bác sĩ cho em hỏi đơn thuốc này uống trước ăn hay sau ăn ạ?',
      time: '23/05',
      unread: false,
    },
  ]);

  // Mock Messages database indexed by Room ID
  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>({
    1: [
      {
        id: 1,
        sender: 'patient',
        content: 'Chào bác sĩ, em vừa khám ở phòng khám về lúc sáng ạ.',
        time: '10:30',
      },
      {
        id: 2,
        sender: 'doctor',
        content: 'Chào Minh, tình hình sức khỏe hiện tại của em thế nào rồi?',
        time: '10:32',
      },
      {
        id: 3,
        sender: 'patient',
        content: 'Dạ em uống liều đầu tiên rồi, nhưng em vẫn thấy hơi đầy bụng khó chịu ạ.',
        time: '10:35',
      },
    ],
    2: [
      {
        id: 1,
        sender: 'doctor',
        content: 'Chào chị Yến, chị nhớ đo huyết áp vào mỗi buổi sáng nhé.',
        time: 'Hôm qua',
      },
      {
        id: 2,
        sender: 'patient',
        content: 'Cảm ơn bác sĩ nhiều, huyết áp của em đo hôm nay tốt lắm rồi ạ.',
        time: 'Hôm qua',
      },
    ],
    3: [
      {
        id: 1,
        sender: 'patient',
        content: 'Bác sĩ cho em hỏi đơn thuốc này uống trước ăn hay sau ăn ạ?',
        time: '23/05',
      },
      {
        id: 2,
        sender: 'doctor',
        content: 'Các thuốc trong đơn của em uống sau ăn 30 phút nhé.',
        time: '23/05',
      },
    ],
  });

  const activeMessages = allMessages[activeRoomId] || [];
  const activeRoom = chatRooms.find((r) => r.id === activeRoomId);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newMsg: Message = {
      id: Date.now(),
      sender: 'doctor',
      content: inputText,
      time: timeString,
    };

    // Update messages
    setAllMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg],
    }));

    // Update last message in chatroom list
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === activeRoomId) {
          return {
            ...room,
            lastMessage: inputText,
            time: timeString,
            unread: false,
          };
        }
        return room;
      }),
    );

    setInputText('');

    // Simulate quick auto reply from patient for demo
    setTimeout(() => {
      const replies = [
        'Dạ em hiểu rồi, cảm ơn bác sĩ nhiều ạ!',
        'Vâng ạ, em sẽ theo dõi thêm và báo lại bác sĩ.',
        'Dạ vâng, chúc bác sĩ buổi chiều làm việc vui vẻ.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: Message = {
        id: Date.now() + 1,
        sender: 'patient',
        content: randomReply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setAllMessages((prev) => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] || []), replyMsg],
      }));

      setChatRooms((prev) =>
        prev.map((room) => {
          if (room.id === activeRoomId) {
            return {
              ...room,
              lastMessage: randomReply,
              time: replyMsg.time,
              unread: true,
            };
          }
          return room;
        }),
      );

      toast('Bệnh nhân vừa nhắn tin mới cho bạn!');
    }, 2000);
  };

  const handleSelectRoom = (roomId: number) => {
    setActiveRoomId(roomId);
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return { ...room, unread: false };
        }
        return room;
      }),
    );
  };

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm h-[calc(100vh-12rem)] flex text-xs">
      {/* Sidebar - Rooms List */}
      <div className="w-80 border-r border-border flex flex-col flex-shrink-0 bg-muted/10">
        <div className="p-4 border-b border-border bg-background">
          <h3 className="font-extrabold text-foreground text-sm">Hộp thoại tư vấn</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleSelectRoom(room.id)}
              className={`
                w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-accent/40 cursor-pointer
                ${activeRoomId === room.id ? 'bg-primary/5 hover:bg-primary/5' : ''}
              `}
            >
              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 border border-primary/20">
                {room.patientName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`font-bold truncate ${room.unread ? 'text-primary' : 'text-foreground'}`}
                  >
                    {room.patientName}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">
                    {room.time}
                  </span>
                </div>
                <p
                  className={`text-[10px] truncate leading-tight ${room.unread ? 'text-foreground font-semibold' : 'text-muted-foreground/80'}`}
                >
                  {room.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Chat header */}
        {activeRoom ? (
          <>
            <div className="h-14 border-b border-border flex items-center px-6 gap-3 flex-shrink-0 bg-muted/5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                {activeRoom.patientName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{activeRoom.patientName}</h4>
                <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                  ● Đang trực tuyến
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((msg) => {
                const isDoctor = msg.sender === 'doctor';
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
                      <p>{msg.content}</p>
                      <span
                        className={`
                        block text-[9px] mt-1 text-right
                        ${isDoctor ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}
                      `}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
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
                placeholder="Nhập nội dung tư vấn..."
                className="flex-1 px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:border-primary text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20 cursor-pointer"
              >
                Gửi
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
